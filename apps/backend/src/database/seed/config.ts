/**
 * Seed configuration.
 *
 * Every volume is overridable through environment variables so the same script
 * serves a quick local run and a heavy load-test dataset:
 *
 *   SEED_PRODUCTS=50000 SEED_USERS=1000 SEED_ORDERS=5000 node dist/database/seed.js
 *
 * SEED_RANDOM_SEED keeps generation deterministic: the same value always
 * produces the same dataset, which makes bugs reproducible.
 */

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer, received "${raw}"`);
  }

  return parsed;
}

export interface SeedConfig {
  randomSeed: number;
  products: number;
  users: number;
  orders: number;
  /** Fraction of customers that get a non-empty cart (0..1). */
  cartRatio: number;
  /** Fraction of products created with stock = 0. */
  outOfStockRatio: number;
  /** Fraction of products created as active = false. */
  inactiveRatio: number;
  /**
   * Everything is streamed: each chunk is generated, inserted with a single
   * `INSERT ... SELECT FROM unnest()` statement per table and released, so
   * memory stays flat regardless of the volumes above.
   */
  productChunkSize: number;
  /** Users per chunk. Their addresses, carts and orders are built in the same pass. */
  userChunkSize: number;
  /** Chunks inserted concurrently (bounded by the Prisma/pg connection pool). */
  concurrency: number;
  /**
   * Carts and orders reference products. Instead of keeping every product in
   * memory we keep a uniform random sample (reservoir sampling) of sellable
   * products of this size.
   */
  productPoolSize: number;
}

export const seedConfig: SeedConfig = {
  randomSeed: readInt('SEED_RANDOM_SEED', 42),
  products: readInt('SEED_PRODUCTS', 5_000_000),
  users: readInt('SEED_USERS', 5_000_000),
  orders: readInt('SEED_ORDERS', 5_000_000),
  cartRatio: 0.3,
  outOfStockRatio: 0.08,
  inactiveRatio: 0.05,
  productChunkSize: readInt('SEED_PRODUCT_CHUNK', 20_000),
  userChunkSize: readInt('SEED_USER_CHUNK', 10_000),
  concurrency: readInt('SEED_CONCURRENCY', 3),
  productPoolSize: 100_000,
};

/** Known accounts, printed at the end of the seed so they can be used in the UI. */
export const KNOWN_ACCOUNTS = {
  admin: { name: 'Admin', email: 'admin@ecommerce.dev', password: 'Admin123!' },
  customer: { name: 'Cliente Demo', email: 'cliente@ecommerce.dev', password: 'Cliente123!' },
  /** Password shared by every generated customer. */
  generatedCustomerPassword: 'Senha123!',
} as const;
