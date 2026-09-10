/**
 * Database access without an ORM.
 *
 * One `pg` Pool for the whole process. Repositories write plain SQL with
 * positional parameters ($1, $2, ...) and receive rows typed by hand (see
 * ./rows.ts). Nothing is generated: what you read here is what runs.
 *
 * Conventions
 * - Column names are camelCase and therefore always double-quoted in SQL
 *   ("createdAt"). Unquoted identifiers are folded to lowercase by Postgres.
 * - `id` and "updatedAt" have no database default (the ORM used to fill them
 *   in the client), so every INSERT sets `gen_random_uuid()::text` and `now()`
 *   and every UPDATE sets "updatedAt" = now().
 * - NUMERIC columns come back as strings to keep precision; services convert
 *   with Number() where a JSON number is wanted.
 */

import 'dotenv/config';

import { Pool, type PoolClient, type QueryResultRow } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

/** Anything that can run a query: the pool, or a client inside a transaction. */
export type Queryable = Pool | PoolClient;

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
  db: Queryable = pool
): Promise<T[]> {
  const result = await db.query<T>(text, values);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
  db: Queryable = pool
): Promise<T | null> {
  const rows = await query<T>(text, values, db);
  return rows[0] ?? null;
}

/** Runs a statement and returns the number of affected rows. */
export async function execute(text: string, values: unknown[] = [], db: Queryable = pool): Promise<number> {
  const result = await db.query(text, values);
  return result.rowCount ?? 0;
}

/**
 * Runs `work` inside a transaction. Every query in `work` must go through the
 * provided client, otherwise it would run on another pooled connection and
 * outside the transaction.
 */
export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Builds a partial UPDATE from an object, keeping only known columns and
 * skipping `undefined` (a missing field means "don't touch it", `null` means
 * "set it to NULL"). Always bumps "updatedAt".
 */
export function buildUpdate(
  table: string,
  id: string,
  data: Record<string, unknown>,
  allowedColumns: readonly string[],
  returning: string
): { text: string; values: unknown[] } {
  const assignments: string[] = [];
  const values: unknown[] = [];

  for (const column of allowedColumns) {
    const value = data[column];
    if (value !== undefined) {
      values.push(value);
      assignments.push(`"${column}" = $${values.length}`);
    }
  }

  assignments.push('"updatedAt" = now()');
  values.push(id);

  return {
    text: `UPDATE ${table} SET ${assignments.join(', ')} WHERE id = $${values.length} RETURNING ${returning}`,
    values,
  };
}

/** Escapes LIKE wildcards in user input so "50%" matches literally. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
