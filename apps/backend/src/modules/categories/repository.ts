import { buildUpdate, query, queryOne } from '../../shared/database/pool';
import type { CategoryRow } from '../../shared/database/rows';

type CreateCategoryData = {
  name: string;
  slug: string;
  description?: string | null;
};

type UpdateCategoryData = {
  name?: string;
  slug?: string;
  description?: string | null;
};

const COLUMNS = 'id, name, slug, description, active, "createdAt", "updatedAt"';

const UPDATABLE_COLUMNS = ['name', 'slug', 'description'] as const;

export const categoriesRepository = {
  async create(data: CreateCategoryData) {
    const rows = await query<CategoryRow>(
      `INSERT INTO categories (id, name, slug, description, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, now(), now())
       RETURNING ${COLUMNS}`,
      [data.name, data.slug, data.description ?? null]
    );
    return rows[0] as CategoryRow;
  },

  async findMany(offset: number, limit: number) {
    const [items, countRows] = await Promise.all([
      query<CategoryRow>(`SELECT ${COLUMNS} FROM categories WHERE active ORDER BY name ASC LIMIT $1 OFFSET $2`, [
        limit,
        offset,
      ]),
      query<{ total: string }>('SELECT count(*)::text AS total FROM categories WHERE active'),
    ]);
    return { items, total: Number((countRows[0] as { total: string }).total) };
  },

  findById(id: string) {
    return queryOne<CategoryRow>(`SELECT ${COLUMNS} FROM categories WHERE id = $1 AND active`, [id]);
  },

  findBySlug(slug: string) {
    return queryOne<CategoryRow>(`SELECT ${COLUMNS} FROM categories WHERE slug = $1 AND active`, [slug]);
  },

  async updateById(id: string, data: UpdateCategoryData) {
    const { text, values } = buildUpdate('categories', id, data, UPDATABLE_COLUMNS, COLUMNS);
    const rows = await query<CategoryRow>(text, values);
    return rows[0] as CategoryRow;
  },

  /** Soft delete: the category stays for existing products, but is hidden. */
  async removeById(id: string) {
    const rows = await query<CategoryRow>(
      `UPDATE categories SET active = false, "updatedAt" = now() WHERE id = $1 RETURNING ${COLUMNS}`,
      [id]
    );
    return rows[0] as CategoryRow;
  },
};
