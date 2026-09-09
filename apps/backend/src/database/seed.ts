/**
 * Database seed.
 *
 * Generates a large, realistic pt-BR dataset with @faker-js/faker:
 * categories, products, users (admin + demo + generated customers), addresses,
 * carts and orders with items.
 *
 * Run inside Docker (compiled with the app):
 *   docker compose exec backend node dist/database/seed.js
 *
 * Volumes are controlled by SEED_* env vars (see ./seed/config.ts).
 * WARNING: the seed wipes every table before inserting.
 */

import { randomUUID } from 'node:crypto';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { prisma } from '../shared/database/prisma';
import type { OrderStatus, Prisma } from '../generated/prisma/client';
import { KNOWN_ACCOUNTS, seedConfig } from './seed/config';
import {
  ADDRESS_LABELS,
  BRANDS,
  CATEGORY_TEMPLATES,
  FEATURES,
  NEIGHBORHOODS,
  PRODUCT_MODIFIERS,
  USE_CASES,
  WARRANTIES,
} from './seed/catalog';

const PASSWORD_SALT_ROUNDS = 10;
const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_OPTIONS = [14.9, 19.9, 24.9, 29.9];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function money(value: number): string {
  return value.toFixed(2);
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function pastDate(maxDays: number): Date {
  return faker.date.recent({ days: maxDays });
}

/**
 * Picks `count` distinct random elements. faker.helpers.arrayElements shuffles
 * the whole source array on every call, which is O(n) per order and becomes the
 * bottleneck with 10k products x 10k orders. Sampling indices is O(count).
 */
function sampleDistinct<T>(source: T[], min: number, max: number): T[] {
  const count = Math.min(faker.number.int({ min, max }), source.length);
  const picked = new Set<number>();
  while (picked.size < count) {
    picked.add(faker.number.int({ min: 0, max: source.length - 1 }));
  }
  return Array.from(picked, index => source[index] as T);
}

function formatDuration(startedAt: number): string {
  return `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
}

async function insertInBatches<T>(
  label: string,
  rows: T[],
  insert: (batch: T[]) => Promise<unknown>
): Promise<void> {
  const startedAt = Date.now();
  for (const batch of chunk(rows, seedConfig.batchSize)) {
    await insert(batch);
  }
  console.log(`  ✔ ${label.padEnd(12)} ${String(rows.length).padStart(6)} rows  (${formatDuration(startedAt)})`);
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

type CategoryRow = Prisma.CategoryCreateManyInput & { id: string };
type ProductRow = Prisma.ProductCreateManyInput & { id: string; price: string };
type UserRow = Prisma.UserCreateManyInput & { id: string };
type AddressRow = Prisma.AddressCreateManyInput & { id: string; userId: string };
type CartRow = Prisma.CartCreateManyInput & { id: string };
type CartItemRow = Prisma.CartItemCreateManyInput;
type OrderRow = Prisma.OrderCreateManyInput & { id: string };
type OrderItemRow = Prisma.OrderItemCreateManyInput;

function buildCategories(): CategoryRow[] {
  return CATEGORY_TEMPLATES.map(template => ({
    id: randomUUID(),
    name: template.name,
    slug: template.slug,
    description: template.description,
    active: true,
  }));
}

function buildProductName(baseName: string): string {
  const brand = faker.helpers.arrayElement(BRANDS);
  const modifier = faker.helpers.maybe(() => faker.helpers.arrayElement(PRODUCT_MODIFIERS), { probability: 0.6 });
  const series = `${faker.string.alpha({ length: 1, casing: 'upper' })}${faker.number.int({ min: 10, max: 999 })}`;

  return [baseName, brand, modifier, series].filter(Boolean).join(' ');
}

function buildProductDescription(name: string): string {
  const [featureA, featureB] = faker.helpers.arrayElements(FEATURES, 2);
  const useCase = faker.helpers.arrayElement(USE_CASES);
  const warranty = faker.helpers.arrayElement(WARRANTIES);

  return `${name} combina ${featureA} e ${featureB}. Ideal para ${useCase}. ${warranty}`;
}

function buildProducts(categories: CategoryRow[]): ProductRow[] {
  const templatesBySlug = new Map(CATEGORY_TEMPLATES.map(template => [template.slug, template]));

  return Array.from({ length: seedConfig.products }, () => {
    const category = faker.helpers.arrayElement(categories);
    const template = templatesBySlug.get(category.slug);
    if (!template) {
      throw new Error(`Missing template for category ${category.slug}`);
    }

    const base = faker.helpers.arrayElement(template.products);
    const name = buildProductName(base.name);
    const [minPrice, maxPrice] = base.price;
    const price = faker.commerce.price({ min: minPrice, max: maxPrice, dec: 2 });
    const outOfStock = faker.number.float() < seedConfig.outOfStockRatio;
    const inactive = faker.number.float() < seedConfig.inactiveRatio;
    const createdAt = pastDate(730);

    return {
      id: randomUUID(),
      name,
      description: buildProductDescription(name),
      price,
      stock: outOfStock ? 0 : faker.number.int({ min: 1, max: 250 }),
      categoryId: category.id,
      active: !inactive,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

async function buildUsers(): Promise<UserRow[]> {
  const [adminHash, demoHash, sharedHash] = await Promise.all([
    hash(KNOWN_ACCOUNTS.admin.password, PASSWORD_SALT_ROUNDS),
    hash(KNOWN_ACCOUNTS.customer.password, PASSWORD_SALT_ROUNDS),
    hash(KNOWN_ACCOUNTS.generatedCustomerPassword, PASSWORD_SALT_ROUNDS),
  ]);

  const users: UserRow[] = [
    { id: randomUUID(), name: KNOWN_ACCOUNTS.admin.name, email: KNOWN_ACCOUNTS.admin.email, password: adminHash, role: 'ADMIN' },
    { id: randomUUID(), name: KNOWN_ACCOUNTS.customer.name, email: KNOWN_ACCOUNTS.customer.email, password: demoHash, role: 'CUSTOMER' },
  ];

  const usedEmails = new Set(users.map(user => user.email));

  for (let i = 0; i < seedConfig.users; i += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let email = faker.internet.email({ firstName, lastName }).toLowerCase();
    while (usedEmails.has(email)) {
      email = faker.internet.email({ firstName, lastName, provider: `${faker.string.alphanumeric(4)}.dev` }).toLowerCase();
    }
    usedEmails.add(email);

    const createdAt = pastDate(540);
    users.push({
      id: randomUUID(),
      name: `${firstName} ${lastName}`,
      email,
      password: sharedHash,
      role: 'CUSTOMER',
      createdAt,
      updatedAt: createdAt,
    });
  }

  return users;
}

function buildAddresses(users: UserRow[]): AddressRow[] {
  const addresses: AddressRow[] = [];

  for (const user of users) {
    const count = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < count; i += 1) {
      addresses.push({
        id: randomUUID(),
        userId: user.id,
        label: faker.helpers.arrayElement(ADDRESS_LABELS),
        recipient: user.name,
        zipCode: faker.location.zipCode('#####-###'),
        street: faker.location.street(),
        number: faker.location.buildingNumber(),
        complement: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.4 }) ?? null,
        neighborhood: faker.helpers.arrayElement(NEIGHBORHOODS),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        country: 'BR',
        isDefault: i === 0,
        active: true,
      });
    }
  }

  return addresses;
}

function buildCarts(customers: UserRow[], products: ProductRow[]): { carts: CartRow[]; items: CartItemRow[] } {
  const carts: CartRow[] = [];
  const items: CartItemRow[] = [];
  const sellable = products.filter(product => product.active && (product.stock ?? 0) > 0);

  for (const user of customers) {
    if (faker.number.float() >= seedConfig.cartRatio) {
      continue;
    }

    const cart: CartRow = { id: randomUUID(), userId: user.id };
    carts.push(cart);

    for (const product of sampleDistinct(sellable, 1, 5)) {
      items.push({
        cartId: cart.id,
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: Math.min(3, product.stock ?? 1) }),
      });
    }
  }

  return { carts, items };
}

function pickOrderStatus(): OrderStatus {
  return faker.helpers.weightedArrayElement<OrderStatus>([
    { value: 'FINISHED', weight: 55 },
    { value: 'PROCESSING', weight: 15 },
    { value: 'PENDING', weight: 15 },
    { value: 'CANCELED', weight: 15 },
  ]);
}

function buildOrders(
  customers: UserRow[],
  addresses: AddressRow[],
  products: ProductRow[]
): { orders: OrderRow[]; items: OrderItemRow[] } {
  const orders: OrderRow[] = [];
  const items: OrderItemRow[] = [];

  const addressesByUser = new Map<string, AddressRow[]>();
  for (const address of addresses) {
    const list = addressesByUser.get(address.userId) ?? [];
    list.push(address);
    addressesByUser.set(address.userId, list);
  }

  for (let i = 0; i < seedConfig.orders; i += 1) {
    const user = faker.helpers.arrayElement(customers);
    const userAddresses = addressesByUser.get(user.id);
    if (!userAddresses || userAddresses.length === 0) {
      continue;
    }

    const orderId = randomUUID();
    const createdAt = pastDate(365);
    let subtotal = 0;

    for (const product of sampleDistinct(products, 1, 5)) {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = Number(product.price);
      const lineSubtotal = unitPrice * quantity;
      subtotal += lineSubtotal;

      items.push({
        orderId,
        productId: product.id,
        productName: product.name,
        unitPrice: money(unitPrice),
        quantity,
        subtotal: money(lineSubtotal),
        createdAt,
        updatedAt: createdAt,
      });
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : faker.helpers.arrayElement(SHIPPING_OPTIONS);

    orders.push({
      id: orderId,
      userId: user.id,
      addressId: faker.helpers.arrayElement(userAddresses).id,
      status: pickOrderStatus(),
      subtotal: money(subtotal),
      shipping: money(shipping),
      total: money(subtotal + shipping),
      createdAt,
      updatedAt: createdAt,
    });
  }

  return { orders, items };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function cleanDatabase(): Promise<void> {
  // Children first to respect foreign keys.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  faker.seed(seedConfig.randomSeed);

  console.log('🌱 Seeding database');
  console.log(
    `   products=${seedConfig.products} users=${seedConfig.users} orders=${seedConfig.orders} randomSeed=${seedConfig.randomSeed}\n`
  );

  console.log('🗑️  Cleaning existing data...');
  await cleanDatabase();

  console.log('🧬 Generating data...');
  const categories = buildCategories();
  const products = buildProducts(categories);
  const users = await buildUsers();
  const customers = users.filter(user => user.role === 'CUSTOMER');
  const addresses = buildAddresses(users);
  const { carts, items: cartItems } = buildCarts(customers, products);
  const { orders, items: orderItems } = buildOrders(customers, addresses, products);

  console.log('💾 Inserting...');
  await insertInBatches('categories', categories, data => prisma.category.createMany({ data }));
  await insertInBatches('products', products, data => prisma.product.createMany({ data }));
  await insertInBatches('users', users, data => prisma.user.createMany({ data }));
  await insertInBatches('addresses', addresses, data => prisma.address.createMany({ data }));
  await insertInBatches('carts', carts, data => prisma.cart.createMany({ data }));
  await insertInBatches('cart_items', cartItems, data => prisma.cartItem.createMany({ data }));
  await insertInBatches('orders', orders, data => prisma.order.createMany({ data }));
  await insertInBatches('order_items', orderItems, data => prisma.orderItem.createMany({ data }));

  console.log(`\n✅ Done in ${formatDuration(startedAt)}`);
  console.log(`
🔑 Accounts
   admin     ${KNOWN_ACCOUNTS.admin.email} / ${KNOWN_ACCOUNTS.admin.password}
   customer  ${KNOWN_ACCOUNTS.customer.email} / ${KNOWN_ACCOUNTS.customer.password}
   generated ${customers.length - 1} customers, password ${KNOWN_ACCOUNTS.generatedCustomerPassword}
`);
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
