import { buildUpdate, escapeLike, query, queryOne } from '../../shared/database/pool';
import type { ProductRow } from '../../shared/database/rows';

type CreateProductData = {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId?: string | null;
};

type UpdateProductData = {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  imageUrl?: string | null;
  categoryId?: string | null;
};

export type ProductSort = 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'relevance';

type FindManyParams = {
  search?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  skip: number;
  take: number;
  orderBy?: ProductSort;
};

/** A product joined with the summary of its category (what the API returns). */
export interface ProductWithCategory extends ProductRow {
  category: { id: string; name: string; slug: string } | null;
}

/** Raw shape of the JOIN below: category columns are prefixed to avoid clashes. */
interface ProductJoinRow extends ProductRow {
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
}

const PRODUCT_COLUMNS = `
  p.id, p.name, p.description, p.price, p.stock, p."imageUrl", p."categoryId", p.active,
  p."createdAt", p."updatedAt",
  c.id AS category_id, c.name AS category_name, c.slug AS category_slug`;

const FROM_WITH_CATEGORY = 'FROM products p LEFT JOIN categories c ON c.id = p."categoryId"';

const UPDATABLE_COLUMNS = ['name', 'description', 'price', 'stock', 'imageUrl', 'categoryId'] as const;

function mapProduct(row: ProductJoinRow): ProductWithCategory {
  const { category_id, category_name, category_slug, ...product } = row;
  return {
    ...product,
    category:
      category_id && category_name && category_slug
        ? { id: category_id, name: category_name, slug: category_slug }
        : null,
  };
}

const ORDER_BY: Record<ProductSort, string> = {
  price_asc: 'p.price ASC, p.id ASC',
  price_desc: 'p.price DESC, p.id ASC',
  newest: 'p."createdAt" DESC, p.id ASC',
  // No ratings in the domain yet: fall back to newest.
  rating: 'p."createdAt" DESC, p.id ASC',
  relevance: 'p."createdAt" DESC, p.id ASC',
};

export const productsRepository = {
  async create(data: CreateProductData) {
    const rows = await query<{ id: string }>(
      `INSERT INTO products (id, name, description, price, stock, "imageUrl", "categoryId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, now(), now())
       RETURNING id`,
      [data.name, data.description ?? null, data.price, data.stock, data.imageUrl ?? null, data.categoryId ?? null]
    );
    return this.findByIdIncludingInactive((rows[0] as { id: string }).id) as Promise<ProductWithCategory>;
  },

  async findMany({ search, categoryId, priceMin, priceMax, inStock, skip, take, orderBy = 'relevance' }: FindManyParams) {
    // WHERE is assembled from optional filters; each one appends its own $n.
    const conditions: string[] = ['p.active'];
    const values: unknown[] = [];

    if (search) {
      values.push(`%${escapeLike(search)}%`);
      conditions.push(`(p.name ILIKE $${values.length} ESCAPE '\\' OR p.description ILIKE $${values.length} ESCAPE '\\')`);
    }

    if (categoryId) {
      values.push(categoryId);
      conditions.push(`p."categoryId" = $${values.length}`);
    }

    if (priceMin !== undefined) {
      values.push(priceMin);
      conditions.push(`p.price >= $${values.length}`);
    }

    if (priceMax !== undefined) {
      values.push(priceMax);
      conditions.push(`p.price <= $${values.length}`);
    }

    if (inStock) {
      conditions.push('p.stock > 0');
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    // Items and total run in parallel on two pooled connections.
    const [items, countRows] = await Promise.all([
      query<ProductJoinRow>(
        `SELECT ${PRODUCT_COLUMNS} ${FROM_WITH_CATEGORY} ${where}
         ORDER BY ${ORDER_BY[orderBy]}
         LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, take, skip]
      ),
      query<{ total: string }>(`SELECT count(*)::text AS total FROM products p ${where}`, values),
    ]);

    return {
      items: items.map(mapProduct),
      total: Number((countRows[0] as { total: string }).total),
    };
  },

  async findById(id: string) {
    const row = await queryOne<ProductJoinRow>(
      `SELECT ${PRODUCT_COLUMNS} ${FROM_WITH_CATEGORY} WHERE p.id = $1 AND p.active`,
      [id]
    );
    return row ? mapProduct(row) : null;
  },

  async findByIdIncludingInactive(id: string) {
    const row = await queryOne<ProductJoinRow>(`SELECT ${PRODUCT_COLUMNS} ${FROM_WITH_CATEGORY} WHERE p.id = $1`, [id]);
    return row ? mapProduct(row) : null;
  },

  async updateById(id: string, data: UpdateProductData) {
    const { text, values } = buildUpdate('products', id, data, UPDATABLE_COLUMNS, 'id');
    await query(text, values);
    return this.findByIdIncludingInactive(id) as Promise<ProductWithCategory>;
  },

  /** Soft delete. */
  async removeById(id: string) {
    await query('UPDATE products SET active = false, "updatedAt" = now() WHERE id = $1', [id]);
    return this.findByIdIncludingInactive(id) as Promise<ProductWithCategory>;
  },

  async findRelated(productId: string, limit: number = 5) {
    const product = await queryOne<{ categoryId: string | null }>(
      'SELECT "categoryId" FROM products WHERE id = $1 AND active',
      [productId]
    );

    if (!product || !product.categoryId) {
      return { items: [], total: 0 };
    }

    const [items, countRows] = await Promise.all([
      query<ProductJoinRow>(
        `SELECT ${PRODUCT_COLUMNS} ${FROM_WITH_CATEGORY}
         WHERE p."categoryId" = $1 AND p.id <> $2 AND p.active
         LIMIT $3`,
        [product.categoryId, productId, limit]
      ),
      query<{ total: string }>(
        'SELECT count(*)::text AS total FROM products p WHERE p."categoryId" = $1 AND p.id <> $2 AND p.active',
        [product.categoryId, productId]
      ),
    ]);

    return {
      items: items.map(mapProduct),
      total: Number((countRows[0] as { total: string }).total),
    };
  },
};
