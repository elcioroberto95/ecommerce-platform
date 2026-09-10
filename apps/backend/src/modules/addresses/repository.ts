import { buildUpdate, execute, query, queryOne } from '../../shared/database/pool';
import type { AddressRow } from '../../shared/database/rows';

type CreateAddressData = {
  userId: string;
  label?: string | null;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

type UpdateAddressData = Partial<Omit<CreateAddressData, 'userId'>>;

/** Everything except the soft-delete flag. */
export type PublicAddressRow = Omit<AddressRow, 'active'>;

const COLUMNS = `
  id, "userId", label, recipient, "zipCode", street, number, complement, neighborhood,
  city, state, country, "isDefault", "createdAt", "updatedAt"`;

const UPDATABLE_COLUMNS = [
  'label', 'recipient', 'zipCode', 'street', 'number', 'complement',
  'neighborhood', 'city', 'state', 'country', 'isDefault',
] as const;

export const addressesRepository = {
  async findManyByUserId(userId: string, offset: number, limit: number) {
    const [items, countRows] = await Promise.all([
      query<PublicAddressRow>(
        `SELECT ${COLUMNS} FROM addresses
         WHERE "userId" = $1 AND active
         ORDER BY "isDefault" DESC, "createdAt" DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      ),
      query<{ total: string }>('SELECT count(*)::text AS total FROM addresses WHERE "userId" = $1 AND active', [userId]),
    ]);
    return { items, total: Number((countRows[0] as { total: string }).total) };
  },

  findByIdAndUserId(id: string, userId: string) {
    return queryOne<PublicAddressRow>(
      `SELECT ${COLUMNS} FROM addresses WHERE id = $1 AND "userId" = $2 AND active`,
      [id, userId]
    );
  },

  async countActiveByUserId(userId: string) {
    const row = await queryOne<{ total: string }>(
      'SELECT count(*)::text AS total FROM addresses WHERE "userId" = $1 AND active',
      [userId]
    );
    return Number(row?.total ?? 0);
  },

  async create(data: CreateAddressData) {
    const rows = await query<PublicAddressRow>(
      `INSERT INTO addresses
         (id, "userId", label, recipient, "zipCode", street, number, complement, neighborhood,
          city, state, country, "isDefault", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
       RETURNING ${COLUMNS}`,
      [
        data.userId, data.label ?? null, data.recipient, data.zipCode, data.street, data.number,
        data.complement ?? null, data.neighborhood, data.city, data.state, data.country, data.isDefault,
      ]
    );
    return rows[0] as PublicAddressRow;
  },

  async updateById(id: string, data: UpdateAddressData) {
    const { text, values } = buildUpdate('addresses', id, data, UPDATABLE_COLUMNS, COLUMNS);
    const rows = await query<PublicAddressRow>(text, values);
    return rows[0] as PublicAddressRow;
  },

  unsetDefaultAddresses(userId: string) {
    return execute(
      `UPDATE addresses SET "isDefault" = false, "updatedAt" = now()
       WHERE "userId" = $1 AND active AND "isDefault"`,
      [userId]
    );
  },

  async softDeleteById(id: string) {
    const rows = await query<PublicAddressRow>(
      `UPDATE addresses SET active = false, "isDefault" = false, "updatedAt" = now()
       WHERE id = $1
       RETURNING ${COLUMNS}`,
      [id]
    );
    return rows[0] as PublicAddressRow;
  },

  findFirstActiveByUserId(userId: string) {
    return queryOne<PublicAddressRow>(
      `SELECT ${COLUMNS} FROM addresses
       WHERE "userId" = $1 AND active
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [userId]
    );
  },
};
