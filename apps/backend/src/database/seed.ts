/**
 * Database seed.
 *
 * Generates a large, realistic pt-BR dataset: categories, products, users
 * (admin + demo + generated customers), addresses, carts and orders with items.
 *
 * Run inside Docker (compiled with the app):
 *   docker compose exec backend node dist/database/seed.js
 *
 * Volumes are controlled by SEED_* env vars (see ./seed/config.ts).
 * WARNING: the seed truncates every table before inserting.
 *
 * Scale notes (defaults are 5M products, 5M users, 5M orders ≈ 45M rows)
 * - Everything is streamed. A chunk is generated, inserted with one
 *   `INSERT ... SELECT FROM unnest()` statement per table (N array parameters
 *   instead of N x rows parameters) and released. Memory stays flat.
 * - Users, their addresses, carts and orders are built in the same pass, so
 *   orders are spread over every user without keeping users in memory.
 * - Hot loops use a tiny seeded PRNG and word lists instead of faker: faker
 *   costs tens of microseconds per call, which adds up to hours at this size.
 * - Carts/orders reference products through a reservoir sample of sellable
 *   products (uniform, fixed size) taken while products stream by.
 */

import { randomUUID } from 'node:crypto';

import { hash } from 'bcryptjs';

import { execute, pool } from '../shared/database/pool';
import { KNOWN_ACCOUNTS, seedConfig } from './seed/config';
import {
  ADDRESS_COMPLEMENTS,
  ADDRESS_LABELS,
  BRANDS,
  CATEGORY_TEMPLATES,
  CITIES,
  EMAIL_DOMAINS,
  FEATURES,
  FIRST_NAMES,
  LAST_NAMES,
  NEIGHBORHOODS,
  PRODUCT_MODIFIERS,
  STREET_NAMES,
  STREET_TYPES,
  USE_CASES,
  WARRANTIES,
  type CategoryTemplate,
} from './seed/catalog';

const PASSWORD_SALT_ROUNDS = 10;
const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_OPTIONS = ['14.90', '19.90', '24.90', '29.90'];
const DAY_MS = 86_400_000;

type SeedOrderStatus = 'FINISHED' | 'PROCESSING' | 'PENDING' | 'CANCELED';
const PROGRESS_EVERY_ROWS = 250_000;

// ---------------------------------------------------------------------------
// Fast deterministic PRNG (mulberry32)
// ---------------------------------------------------------------------------

function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(seedConfig.randomSeed);

function randomInt(min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)] as T;
}

/** `count` distinct random elements in O(count), no shuffling of the source. */
function sampleDistinct<T>(source: T[], min: number, max: number): T[] {
  const count = Math.min(randomInt(min, max), source.length);
  const picked = new Set<number>();
  while (picked.size < count) {
    picked.add(randomInt(0, source.length - 1));
  }
  return Array.from(picked, index => source[index] as T);
}

function randomPastIso(maxDays: number): string {
  return new Date(Date.now() - rng() * maxDays * DAY_MS).toISOString();
}

function pickOrderStatus(): SeedOrderStatus {
  const roll = rng() * 100;
  if (roll < 55) return 'FINISHED';
  if (roll < 70) return 'PROCESSING';
  if (roll < 85) return 'PENDING';
  return 'CANCELED';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function money(value: number): string {
  return value.toFixed(2);
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '');
}

function formatDuration(startedAt: number): string {
  return `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function logRow(label: string, rows: number, startedAt: number): void {
  const seconds = (Date.now() - startedAt) / 1000;
  const rate = seconds > 0 ? Math.round(rows / seconds) : rows;
  console.log(`  ✔ ${label.padEnd(12)} ${fmt(rows).padStart(11)} rows  (${formatDuration(startedAt)}, ${fmt(rate)} rows/s)`);
}

class Progress {
  private next = PROGRESS_EVERY_ROWS;
  private readonly startedAt = Date.now();

  constructor(
    private readonly label: string,
    private readonly total: number
  ) {}

  report(done: number): void {
    if (done < this.next && done < this.total) {
      return;
    }
    const seconds = (Date.now() - this.startedAt) / 1000;
    const rate = seconds > 0 ? Math.round(done / seconds) : done;
    const eta = rate > 0 ? Math.round((this.total - done) / rate) : 0;
    console.log(`    … ${this.label} ${fmt(done)}/${fmt(this.total)} (${fmt(rate)} rows/s, ETA ${eta}s)`);
    this.next += PROGRESS_EVERY_ROWS;
  }
}

/** Runs `producer` chunk by chunk, keeping up to `concurrency` inserts in flight. */
async function streamChunks(
  total: number,
  chunkSize: number,
  produce: (offset: number, size: number) => Promise<unknown>
): Promise<void> {
  let offset = 0;
  while (offset < total) {
    const inFlight: Array<Promise<unknown>> = [];
    for (let k = 0; k < seedConfig.concurrency && offset < total; k += 1) {
      const size = Math.min(chunkSize, total - offset);
      inFlight.push(produce(offset, size));
      offset += size;
    }
    await Promise.all(inFlight);
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

interface CategoryRow {
  id: string;
  template: CategoryTemplate;
}

async function seedCategories(): Promise<CategoryRow[]> {
  const startedAt = Date.now();
  const rows = CATEGORY_TEMPLATES.map(template => ({ id: randomUUID(), template }));

  await execute(
    `INSERT INTO categories (id, name, slug, description, active, "createdAt", "updatedAt")
     SELECT id, name, slug, description, true, now(), now()
     FROM unnest($1::text[], $2::text[], $3::text[], $4::text[]) AS t(id, name, slug, description)`,
    [
      rows.map(row => row.id),
      rows.map(row => row.template.name),
      rows.map(row => row.template.slug),
      rows.map(row => row.template.description),
    ]
  );

  logRow('categories', rows.length, startedAt);
  return rows;
}

// ---------------------------------------------------------------------------
// Products (streamed)
// ---------------------------------------------------------------------------

/** Compact reference kept in memory for carts/orders. */
interface ProductRef {
  id: string;
  name: string;
  price: number;
  stock: number;
}

function buildProductName(baseName: string): string {
  const modifier = rng() < 0.6 ? ` ${pick(PRODUCT_MODIFIERS)}` : '';
  const series = `${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(10, 999)}`;
  return `${baseName} ${pick(BRANDS)}${modifier} ${series}`;
}

function buildProductDescription(name: string): string {
  const featureA = pick(FEATURES);
  let featureB = pick(FEATURES);
  while (featureB === featureA) {
    featureB = pick(FEATURES);
  }
  return `${name} combina ${featureA} e ${featureB}. Ideal para ${pick(USE_CASES)}. ${pick(WARRANTIES)}`;
}

async function seedProducts(categories: CategoryRow[]): Promise<ProductRef[]> {
  const pool: ProductRef[] = [];
  let sellableSeen = 0;
  const total = seedConfig.products;
  const progress = new Progress('products', total);
  const startedAt = Date.now();
  let inserted = 0;

  await streamChunks(total, seedConfig.productChunkSize, async (_offset, size) => {
    const ids = new Array<string>(size);
    const names = new Array<string>(size);
    const descriptions = new Array<string>(size);
    const prices = new Array<string>(size);
    const stocks = new Array<number>(size);
    const imageUrls = new Array<string>(size);
    const categoryIds = new Array<string>(size);
    const actives = new Array<boolean>(size);
    const createdAts = new Array<string>(size);

    for (let i = 0; i < size; i += 1) {
      const category = pick(categories);
      const base = pick(category.template.products);
      const [minPrice, maxPrice] = base.price;

      const id = randomUUID();
      const name = buildProductName(base.name);
      const price = Math.round((minPrice + rng() * (maxPrice - minPrice)) * 100) / 100;
      const stock = rng() < seedConfig.outOfStockRatio ? 0 : randomInt(1, 250);
      const active = rng() >= seedConfig.inactiveRatio;

      ids[i] = id;
      names[i] = name;
      descriptions[i] = buildProductDescription(name);
      prices[i] = money(price);
      stocks[i] = stock;
      imageUrls[i] = `https://picsum.photos/seed/${id}/600/600`;
      categoryIds[i] = category.id;
      actives[i] = active;
      createdAts[i] = randomPastIso(730);

      // Reservoir sampling: uniform sample of sellable products for carts/orders.
      if (active && stock > 0) {
        const ref: ProductRef = { id, name, price, stock };
        if (pool.length < seedConfig.productPoolSize) {
          pool.push(ref);
        } else {
          const j = Math.floor(rng() * (sellableSeen + 1));
          if (j < seedConfig.productPoolSize) {
            pool[j] = ref;
          }
        }
        sellableSeen += 1;
      }
    }

    await execute(
      `INSERT INTO products
         (id, name, description, price, stock, "imageUrl", "categoryId", active, "createdAt", "updatedAt")
       SELECT * FROM unnest(
         $1::text[], $2::text[], $3::text[], $4::numeric[], $5::int[], $6::text[], $7::text[], $8::boolean[],
         $9::timestamptz[], $9::timestamptz[]
       )`,
      [ids, names, descriptions, prices, stocks, imageUrls, categoryIds, actives, createdAts]
    );

    inserted += size;
    progress.report(inserted);
  });

  logRow('products', inserted, startedAt);
  return pool;
}

// ---------------------------------------------------------------------------
// Users + addresses + carts + orders (streamed together, per user chunk)
// ---------------------------------------------------------------------------

interface ColumnBuffers {
  [column: string]: Array<string | number | boolean>;
}

function buffers(...columns: string[]): ColumnBuffers {
  const result: ColumnBuffers = {};
  for (const column of columns) {
    result[column] = [];
  }
  return result;
}

function col<T extends string | number | boolean>(b: ColumnBuffers, name: string): T[] {
  return b[name] as T[];
}

interface Totals {
  users: number;
  addresses: number;
  carts: number;
  cartItems: number;
  orders: number;
  orderItems: number;
}

async function seedUsersAndActivity(pool: ProductRef[]): Promise<Totals> {
  const [adminHash, demoHash, sharedHash] = await Promise.all([
    hash(KNOWN_ACCOUNTS.admin.password, PASSWORD_SALT_ROUNDS),
    hash(KNOWN_ACCOUNTS.customer.password, PASSWORD_SALT_ROUNDS),
    hash(KNOWN_ACCOUNTS.generatedCustomerPassword, PASSWORD_SALT_ROUNDS),
  ]);

  const totalUsers = seedConfig.users + 2; // + admin + demo customer
  const ordersPerUser = seedConfig.orders / Math.max(1, seedConfig.users);
  const totals: Totals = { users: 0, addresses: 0, carts: 0, cartItems: 0, orders: 0, orderItems: 0 };
  const progress = new Progress('users', totalUsers);
  const startedAt = Date.now();

  await streamChunks(totalUsers, seedConfig.userChunkSize, async (offset, size) => {
    const u = buffers('id', 'name', 'email', 'password', 'role', 'createdAt');
    const a = buffers(
      'id', 'userId', 'label', 'recipient', 'zipCode', 'street', 'number', 'complement',
      'neighborhood', 'city', 'state', 'isDefault', 'createdAt'
    );
    const c = buffers('id', 'userId', 'createdAt');
    const ci = buffers('id', 'cartId', 'productId', 'quantity', 'createdAt');
    const o = buffers('id', 'userId', 'addressId', 'status', 'subtotal', 'shipping', 'total', 'createdAt');
    const oi = buffers('id', 'orderId', 'productId', 'productName', 'unitPrice', 'quantity', 'subtotal', 'createdAt');

    for (let i = 0; i < size; i += 1) {
      const index = offset + i;
      const userId = randomUUID();
      const userCreatedAt = randomPastIso(540);

      let name: string;
      let email: string;
      let password: string;
      let role: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER';

      if (index === 0) {
        ({ name, email } = KNOWN_ACCOUNTS.admin);
        password = adminHash;
        role = 'ADMIN';
      } else if (index === 1) {
        ({ name, email } = KNOWN_ACCOUNTS.customer);
        password = demoHash;
      } else {
        const first = pick(FIRST_NAMES);
        const last = pick(LAST_NAMES);
        name = `${first} ${last}`;
        // The global index guarantees uniqueness without a lookup table.
        email = `${stripAccents(first).toLowerCase()}.${stripAccents(last).toLowerCase()}${index}@${pick(EMAIL_DOMAINS)}`;
        password = sharedHash;
      }

      col(u, 'id').push(userId);
      col(u, 'name').push(name);
      col(u, 'email').push(email);
      col(u, 'password').push(password);
      col(u, 'role').push(role);
      col(u, 'createdAt').push(userCreatedAt);

      // Addresses: 1..3, the first is the default.
      const addressIds: string[] = [];
      const addressCount = randomInt(1, 3);
      for (let k = 0; k < addressCount; k += 1) {
        const addressId = randomUUID();
        const city = pick(CITIES);
        addressIds.push(addressId);

        col(a, 'id').push(addressId);
        col(a, 'userId').push(userId);
        col(a, 'label').push(pick(ADDRESS_LABELS));
        col(a, 'recipient').push(name);
        col(a, 'zipCode').push(`${city.cepPrefix}${randomInt(10, 99)}-${String(randomInt(0, 999)).padStart(3, '0')}`);
        col(a, 'street').push(`${pick(STREET_TYPES)} ${pick(STREET_NAMES)}`);
        col(a, 'number').push(String(randomInt(1, 4999)));
        col(a, 'complement').push(rng() < 0.4 ? pick(ADDRESS_COMPLEMENTS) : '');
        col(a, 'neighborhood').push(pick(NEIGHBORHOODS));
        col(a, 'city').push(city.city);
        col(a, 'state').push(city.state);
        col(a, 'isDefault').push(k === 0);
        col(a, 'createdAt').push(userCreatedAt);
      }

      if (role === 'ADMIN') {
        continue;
      }

      // Cart for a fraction of customers.
      if (rng() < seedConfig.cartRatio) {
        const cartId = randomUUID();
        col(c, 'id').push(cartId);
        col(c, 'userId').push(userId);
        col(c, 'createdAt').push(userCreatedAt);

        for (const product of sampleDistinct(pool, 1, 5)) {
          col(ci, 'id').push(randomUUID());
          col(ci, 'cartId').push(cartId);
          col(ci, 'productId').push(product.id);
          col(ci, 'quantity').push(randomInt(1, Math.min(3, product.stock)));
          col(ci, 'createdAt').push(userCreatedAt);
        }
      }

      // Orders: Poisson-ish count around ordersPerUser, so the total matches.
      let orderCount = Math.floor(ordersPerUser);
      if (rng() < ordersPerUser - orderCount) {
        orderCount += 1;
      }

      for (let k = 0; k < orderCount; k += 1) {
        const orderId = randomUUID();
        const orderCreatedAt = randomPastIso(365);
        let subtotal = 0;

        for (const product of sampleDistinct(pool, 1, 5)) {
          const quantity = randomInt(1, 3);
          const lineSubtotal = product.price * quantity;
          subtotal += lineSubtotal;

          col(oi, 'id').push(randomUUID());
          col(oi, 'orderId').push(orderId);
          col(oi, 'productId').push(product.id);
          col(oi, 'productName').push(product.name);
          col(oi, 'unitPrice').push(money(product.price));
          col(oi, 'quantity').push(quantity);
          col(oi, 'subtotal').push(money(lineSubtotal));
          col(oi, 'createdAt').push(orderCreatedAt);
        }

        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? '0.00' : pick(SHIPPING_OPTIONS);

        col(o, 'id').push(orderId);
        col(o, 'userId').push(userId);
        col(o, 'addressId').push(pick(addressIds));
        col(o, 'status').push(pickOrderStatus());
        col(o, 'subtotal').push(money(subtotal));
        col(o, 'shipping').push(shipping);
        col(o, 'total').push(money(subtotal + Number(shipping)));
        col(o, 'createdAt').push(orderCreatedAt);
      }
    }

    // Parents first (users, addresses), then children. Each is one statement.
    await execute(
      `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
       SELECT * FROM unnest(
         $1::text[], $2::text[], $3::text[], $4::text[], $5::text[]::"Role"[], $6::timestamptz[], $6::timestamptz[]
       )`,
      [u.id, u.name, u.email, u.password, u.role, u.createdAt]
    );

    await execute(
      `INSERT INTO addresses
         (id, "userId", label, recipient, "zipCode", street, number, complement, neighborhood,
          city, state, country, "isDefault", active, "createdAt", "updatedAt")
       SELECT id, "userId", label, recipient, "zipCode", street, number, NULLIF(complement, ''), neighborhood,
              city, state, 'BR', "isDefault", true, "createdAt", "createdAt"
       FROM unnest(
         $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[],
         $9::text[], $10::text[], $11::text[], $12::boolean[], $13::timestamptz[]
       ) AS t(id, "userId", label, recipient, "zipCode", street, number, complement, neighborhood,
              city, state, "isDefault", "createdAt")`,
      [
        a.id, a.userId, a.label, a.recipient, a.zipCode, a.street, a.number, a.complement,
        a.neighborhood, a.city, a.state, a.isDefault, a.createdAt,
      ]
    );

    await Promise.all([
      execute(
        `INSERT INTO carts (id, "userId", "createdAt", "updatedAt")
         SELECT * FROM unnest($1::text[], $2::text[], $3::timestamptz[], $3::timestamptz[])`,
        [c.id, c.userId, c.createdAt]
      ),
      execute(
        `INSERT INTO orders (id, "userId", "addressId", status, subtotal, shipping, total, "createdAt", "updatedAt")
         SELECT * FROM unnest(
           $1::text[], $2::text[], $3::text[], $4::text[]::"OrderStatus"[],
           $5::numeric[], $6::numeric[], $7::numeric[], $8::timestamptz[], $8::timestamptz[]
         )`,
        [o.id, o.userId, o.addressId, o.status, o.subtotal, o.shipping, o.total, o.createdAt]
      ),
    ]);

    await Promise.all([
      execute(
        `INSERT INTO cart_items (id, "cartId", "productId", quantity, "createdAt", "updatedAt")
         SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::int[], $5::timestamptz[], $5::timestamptz[])`,
        [ci.id, ci.cartId, ci.productId, ci.quantity, ci.createdAt]
      ),
      execute(
        `INSERT INTO order_items
           (id, "orderId", "productId", "productName", "unitPrice", quantity, subtotal, "createdAt", "updatedAt")
         SELECT * FROM unnest(
           $1::text[], $2::text[], $3::text[], $4::text[], $5::numeric[], $6::int[], $7::numeric[],
           $8::timestamptz[], $8::timestamptz[]
         )`,
        [oi.id, oi.orderId, oi.productId, oi.productName, oi.unitPrice, oi.quantity, oi.subtotal, oi.createdAt]
      ),
    ]);

    totals.users += u.id.length;
    totals.addresses += a.id.length;
    totals.carts += c.id.length;
    totals.cartItems += ci.id.length;
    totals.orders += o.id.length;
    totals.orderItems += oi.id.length;
    progress.report(totals.users);
  });

  logRow('users', totals.users, startedAt);
  logRow('addresses', totals.addresses, startedAt);
  logRow('carts', totals.carts, startedAt);
  logRow('cart_items', totals.cartItems, startedAt);
  logRow('orders', totals.orders, startedAt);
  logRow('order_items', totals.orderItems, startedAt);
  return totals;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function cleanDatabase(): Promise<void> {
  // TRUNCATE is O(1) regardless of row count; DELETE on millions of rows is not.
  await execute(
    'TRUNCATE TABLE order_items, orders, cart_items, carts, addresses, products, categories, users RESTART IDENTITY CASCADE'
  );
}

async function main(): Promise<void> {
  const startedAt = Date.now();

  console.log('🌱 Seeding database');
  console.log(
    `   products=${fmt(seedConfig.products)} users=${fmt(seedConfig.users)} orders=${fmt(seedConfig.orders)} ` +
      `randomSeed=${seedConfig.randomSeed} chunk=${fmt(seedConfig.productChunkSize)}/${fmt(seedConfig.userChunkSize)} ` +
      `concurrency=${seedConfig.concurrency}\n`
  );

  console.log('🗑️  Truncating tables...');
  await cleanDatabase();

  console.log('💾 Inserting...');
  const categories = await seedCategories();

  const pool = await seedProducts(categories);
  if (pool.length === 0) {
    throw new Error('No sellable products generated; cannot build carts and orders');
  }

  const totals = await seedUsersAndActivity(pool);

  console.log(`\n✅ Done in ${formatDuration(startedAt)}`);
  console.log(`
🔑 Accounts
   admin     ${KNOWN_ACCOUNTS.admin.email} / ${KNOWN_ACCOUNTS.admin.password}
   customer  ${KNOWN_ACCOUNTS.customer.email} / ${KNOWN_ACCOUNTS.customer.password}
   generated ${fmt(totals.users - 2)} customers, password ${KNOWN_ACCOUNTS.generatedCustomerPassword}
`);
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
