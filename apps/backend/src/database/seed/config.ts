/**
 * Seed configuration.
 *
 * Every volume is overridable through environment variables so the same script
 * serves a quick local run and a heavy load-test dataset:
 *
 *   SEED_PRODUCTS=50000 SEED_USERS=10000 SEED_ORDERS=40000 node dist/database/seed.js
 *
 * SEED_RANDOM_SEED keeps faker deterministic: the same value always produces
 * the same dataset, which makes bugs reproducible.
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
  /** Rows per createMany call. */
  batchSize: number;
}

export const seedConfig: SeedConfig = {
  randomSeed: readInt('SEED_RANDOM_SEED', 42),
  products: readInt('SEED_PRODUCTS', 10000),
  users: readInt('SEED_USERS', 2000),
  orders: readInt('SEED_ORDERS', 10000),
  cartRatio: 0.3,
  outOfStockRatio: 0.08,
  inactiveRatio: 0.05,
  batchSize: 500,
};

/** Known accounts, printed at the end of the seed so they can be used in the UI. */
export const KNOWN_ACCOUNTS = {
  admin: { name: 'Admin', email: 'admin@ecommerce.dev', password: 'Admin123!' },
  customer: { name: 'Cliente Demo', email: 'cliente@ecommerce.dev', password: 'Cliente123!' },
  /** Password shared by every generated customer. */
  generatedCustomerPassword: 'Senha123!',
} as const;
