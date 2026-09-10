import { execute, query, queryOne, type Queryable, pool } from '../../shared/database/pool';
import type { CartItemRow, CartRow, ProductRow } from '../../shared/database/rows';

type CreateCartItemData = {
  cartId: string;
  productId: string;
  quantity: number;
};

export interface CartItemWithProduct extends CartItemRow {
  product: ProductRow;
}

export interface CartWithItems extends CartRow {
  items: CartItemWithProduct[];
}

/** Raw shape of the item/product JOIN: product columns are prefixed. */
interface CartItemJoinRow extends CartItemRow {
  product_id: string;
  product_name: string;
  product_description: string | null;
  product_price: string;
  product_stock: number;
  product_imageUrl: string | null;
  product_categoryId: string | null;
  product_active: boolean;
  product_createdAt: Date;
  product_updatedAt: Date;
}

const ITEM_WITH_PRODUCT_SQL = `
  SELECT
    ci.id, ci."cartId", ci."productId", ci.quantity, ci."createdAt", ci."updatedAt",
    p.id AS product_id, p.name AS product_name, p.description AS product_description,
    p.price AS product_price, p.stock AS product_stock, p."imageUrl" AS "product_imageUrl",
    p."categoryId" AS "product_categoryId", p.active AS product_active,
    p."createdAt" AS "product_createdAt", p."updatedAt" AS "product_updatedAt"
  FROM cart_items ci
  JOIN products p ON p.id = ci."productId"`;

function mapCartItem(row: CartItemJoinRow): CartItemWithProduct {
  return {
    id: row.id,
    cartId: row.cartId,
    productId: row.productId,
    quantity: row.quantity,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    product: {
      id: row.product_id,
      name: row.product_name,
      description: row.product_description,
      price: row.product_price,
      stock: row.product_stock,
      imageUrl: row.product_imageUrl,
      categoryId: row.product_categoryId,
      active: row.product_active,
      createdAt: row.product_createdAt,
      updatedAt: row.product_updatedAt,
    },
  };
}

/** Attaches the items (with their products) to a cart row. */
export async function loadCartItems(cart: CartRow, db: Queryable = pool): Promise<CartWithItems> {
  const rows = await query<CartItemJoinRow>(
    `${ITEM_WITH_PRODUCT_SQL} WHERE ci."cartId" = $1 ORDER BY ci."createdAt" ASC`,
    [cart.id],
    db
  );
  return { ...cart, items: rows.map(mapCartItem) };
}

export const cartRepository = {
  findProductById(productId: string) {
    return queryOne<ProductRow>('SELECT * FROM products WHERE id = $1 AND active', [productId]);
  },

  /**
   * Each user has at most one cart ("userId" is UNIQUE). The upsert creates it
   * on first use; ON CONFLICT ... DO UPDATE makes RETURNING work in both cases.
   */
  async findOrCreateCart(userId: string) {
    const cart = await queryOne<CartRow>(
      `INSERT INTO carts (id, "userId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, now(), now())
       ON CONFLICT ("userId") DO UPDATE SET "updatedAt" = carts."updatedAt"
       RETURNING *`,
      [userId]
    );
    return loadCartItems(cart as CartRow);
  },

  async findCartItem(cartId: string, productId: string) {
    const row = await queryOne<CartItemJoinRow>(
      `${ITEM_WITH_PRODUCT_SQL} WHERE ci."cartId" = $1 AND ci."productId" = $2`,
      [cartId, productId]
    );
    return row ? mapCartItem(row) : null;
  },

  async createCartItem(data: CreateCartItemData) {
    const rows = await query<CartItemRow>(
      `INSERT INTO cart_items (id, "cartId", "productId", quantity, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, now(), now())
       RETURNING *`,
      [data.cartId, data.productId, data.quantity]
    );
    return rows[0] as CartItemRow;
  },

  async updateCartItem(cartId: string, productId: string, quantity: number) {
    const rows = await query<CartItemRow>(
      `UPDATE cart_items SET quantity = $3, "updatedAt" = now()
       WHERE "cartId" = $1 AND "productId" = $2
       RETURNING *`,
      [cartId, productId, quantity]
    );
    return rows[0] as CartItemRow;
  },

  removeCartItem(cartId: string, productId: string) {
    return execute('DELETE FROM cart_items WHERE "cartId" = $1 AND "productId" = $2', [cartId, productId]);
  },

  clearCart(cartId: string) {
    return execute('DELETE FROM cart_items WHERE "cartId" = $1', [cartId]);
  },
};
