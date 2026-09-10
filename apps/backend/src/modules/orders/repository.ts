import { BadRequestError } from '../../core/errors/bad-request-error';
import { execute, pool, query, queryOne, withTransaction, type Queryable } from '../../shared/database/pool';
import type { AddressRow, CartRow, OrderItemRow, OrderRow, OrderStatus, Role } from '../../shared/database/rows';
import { loadCartItems } from '../cart/repository';

type CreateOrderItemData = {
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
};

type CreateOrderFromCartData = {
  cartId: string;
  userId: string;
  addressId: string;
  subtotal: string;
  shipping: string;
  total: string;
  items: CreateOrderItemData[];
};

export interface OrderAddress {
  id: string;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface OrderWithDetails extends OrderRow {
  address: OrderAddress;
  items: OrderItemRow[];
}

export interface OrderWithDetailsAndUser extends OrderWithDetails {
  user: OrderUser;
}

/** Raw shape of the orders/addresses(/users) JOIN. */
interface OrderJoinRow extends OrderRow {
  address_id: string;
  address_recipient: string;
  address_zipCode: string;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_country: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_role?: Role;
}

const ORDER_SELECT = `
  SELECT
    o.id, o."userId", o."addressId", o.status, o.subtotal, o.shipping, o.total, o."createdAt", o."updatedAt",
    a.id AS address_id, a.recipient AS address_recipient, a."zipCode" AS "address_zipCode",
    a.street AS address_street, a.number AS address_number, a.complement AS address_complement,
    a.neighborhood AS address_neighborhood, a.city AS address_city, a.state AS address_state,
    a.country AS address_country`;

const USER_SELECT = `,
    u.id AS user_id, u.name AS user_name, u.email AS user_email, u.role AS user_role`;

const ORDER_FROM = `
  FROM orders o
  JOIN addresses a ON a.id = o."addressId"`;

const USER_JOIN = `
  JOIN users u ON u.id = o."userId"`;

function mapOrder(row: OrderJoinRow, items: OrderItemRow[]): OrderWithDetails {
  return {
    id: row.id,
    userId: row.userId,
    addressId: row.addressId,
    status: row.status,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    address: {
      id: row.address_id,
      recipient: row.address_recipient,
      zipCode: row.address_zipCode,
      street: row.address_street,
      number: row.address_number,
      complement: row.address_complement,
      neighborhood: row.address_neighborhood,
      city: row.address_city,
      state: row.address_state,
      country: row.address_country,
    },
    items,
  };
}

/**
 * Loads orders matching `where` plus their address and items. Items are
 * fetched with one query for all orders (= ANY($1)) and grouped in memory,
 * instead of one query per order.
 */
async function loadOrders(
  where: string,
  values: unknown[],
  options: { withUser?: boolean; offset?: number; limit?: number } = {},
  db: Queryable = pool
): Promise<OrderJoinRow[] & { items: Map<string, OrderItemRow[]> }> {
  const select = options.withUser ? `${ORDER_SELECT}${USER_SELECT}` : ORDER_SELECT;
  const from = options.withUser ? `${ORDER_FROM}${USER_JOIN}` : ORDER_FROM;

  // Lists are always paginated; single-order lookups pass no limit.
  const pageValues = [...values];
  let pageSql = '';
  if (options.limit !== undefined) {
    pageValues.push(options.limit, options.offset ?? 0);
    pageSql = ` LIMIT $${pageValues.length - 1} OFFSET $${pageValues.length}`;
  }

  const orders = await query<OrderJoinRow>(
    `${select} ${from} ${where} ORDER BY o."createdAt" DESC, o.id ASC${pageSql}`,
    pageValues,
    db
  );

  const items = new Map<string, OrderItemRow[]>();
  if (orders.length > 0) {
    const rows = await query<OrderItemRow>(
      'SELECT * FROM order_items WHERE "orderId" = ANY($1::text[]) ORDER BY "createdAt" ASC',
      [orders.map(order => order.id)],
      db
    );
    for (const item of rows) {
      const list = items.get(item.orderId) ?? [];
      list.push(item);
      items.set(item.orderId, list);
    }
  }

  return Object.assign(orders, { items });
}

async function findOrders(where: string, values: unknown[], db: Queryable = pool): Promise<OrderWithDetails[]> {
  const rows = await loadOrders(where, values, {}, db);
  return rows.map(row => mapOrder(row, rows.items.get(row.id) ?? []));
}

export const ordersRepository = {
  findAddressByIdAndUserId(addressId: string, userId: string) {
    return queryOne<AddressRow>('SELECT * FROM addresses WHERE id = $1 AND "userId" = $2 AND active', [
      addressId,
      userId,
    ]);
  },

  async findCartByUserId(userId: string) {
    const cart = await queryOne<CartRow>('SELECT * FROM carts WHERE "userId" = $1', [userId]);
    return cart ? loadCartItems(cart) : null;
  },

  /**
   * Creates the order atomically: reserve stock, insert order + items, empty
   * the cart. Any failure rolls everything back, including the stock update.
   */
  createFromCart(data: CreateOrderFromCartData) {
    return withTransaction(async client => {
      for (const item of data.items) {
        // The WHERE guards the stock: 0 rows updated means someone else bought it first.
        const updated = await execute(
          `UPDATE products SET stock = stock - $2, "updatedAt" = now()
           WHERE id = $1 AND active AND stock >= $2`,
          [item.productId, item.quantity],
          client
        );

        if (updated === 0) {
          throw new BadRequestError(`Insufficient stock for product ${item.productName}`);
        }
      }

      const inserted = await queryOne<{ id: string }>(
        `INSERT INTO orders (id, "userId", "addressId", subtotal, shipping, total, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, now(), now())
         RETURNING id`,
        [data.userId, data.addressId, data.subtotal, data.shipping, data.total],
        client
      );
      const orderId = (inserted as { id: string }).id;

      await execute(
        `INSERT INTO order_items
           (id, "orderId", "productId", "productName", "unitPrice", quantity, subtotal, "createdAt", "updatedAt")
         SELECT gen_random_uuid()::text, $1, t."productId", t."productName", t."unitPrice", t.quantity, t.subtotal, now(), now()
         FROM unnest($2::text[], $3::text[], $4::numeric[], $5::int[], $6::numeric[])
           AS t("productId", "productName", "unitPrice", quantity, subtotal)`,
        [
          orderId,
          data.items.map(item => item.productId),
          data.items.map(item => item.productName),
          data.items.map(item => item.unitPrice),
          data.items.map(item => item.quantity),
          data.items.map(item => item.subtotal),
        ],
        client
      );

      await execute('DELETE FROM cart_items WHERE "cartId" = $1', [data.cartId], client);

      const [order] = await findOrders('WHERE o.id = $1', [orderId], client);
      return order as OrderWithDetails;
    });
  },

  async findManyByUserId(userId: string, offset: number, limit: number) {
    const [rows, countRows] = await Promise.all([
      loadOrders('WHERE o."userId" = $1', [userId], { offset, limit }),
      query<{ total: string }>('SELECT count(*)::text AS total FROM orders WHERE "userId" = $1', [userId]),
    ]);
    return {
      items: rows.map(row => mapOrder(row, rows.items.get(row.id) ?? [])),
      total: Number((countRows[0] as { total: string }).total),
    };
  },

  async findByIdAndUserId(orderId: string, userId: string) {
    const [order] = await findOrders('WHERE o.id = $1 AND o."userId" = $2', [orderId, userId]);
    return order ?? null;
  },

  async findManyAdmin(offset: number, limit: number): Promise<{ items: OrderWithDetailsAndUser[]; total: number }> {
    const [rows, countRows] = await Promise.all([
      loadOrders('', [], { withUser: true, offset, limit }),
      query<{ total: string }>('SELECT count(*)::text AS total FROM orders'),
    ]);
    return {
      items: rows.map(row => ({
        ...mapOrder(row, rows.items.get(row.id) ?? []),
        user: {
          id: row.user_id as string,
          name: row.user_name as string,
          email: row.user_email as string,
          role: row.user_role as Role,
        },
      })),
      total: Number((countRows[0] as { total: string }).total),
    };
  },

  async findById(orderId: string) {
    const [order] = await findOrders('WHERE o.id = $1', [orderId]);
    return order ?? null;
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    await execute('UPDATE orders SET status = $2, "updatedAt" = now() WHERE id = $1', [orderId, status]);
    const [order] = await findOrders('WHERE o.id = $1', [orderId]);
    return order as OrderWithDetails;
  },
};
