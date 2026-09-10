import { buildUpdate, query, queryOne } from '../../shared/database/pool';
import type { PublicUserRow, UserRow } from '../../shared/database/rows';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

/** Never return the password hash outside the auth flow. */
const PUBLIC_COLUMNS = 'id, name, email, role, "createdAt", "updatedAt"';

const UPDATABLE_COLUMNS = ['name', 'email', 'password'] as const;

export const usersRepository = {
  /** Full row, including the password hash: used only by login. */
  findByEmail(email: string) {
    return queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
  },

  findById(id: string) {
    return queryOne<PublicUserRow>(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  },

  async create(data: CreateUserData) {
    const rows = await query<PublicUserRow>(
      `INSERT INTO users (id, name, email, password, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, now(), now())
       RETURNING ${PUBLIC_COLUMNS}`,
      [data.name, data.email, data.password]
    );
    return rows[0] as PublicUserRow;
  },

  async updateById(id: string, data: UpdateUserData) {
    const { text, values } = buildUpdate('users', id, data, UPDATABLE_COLUMNS, PUBLIC_COLUMNS);
    const rows = await query<PublicUserRow>(text, values);
    return rows[0] as PublicUserRow;
  },
};
