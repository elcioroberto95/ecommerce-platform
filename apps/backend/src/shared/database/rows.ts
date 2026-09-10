/**
 * Row types: one interface per table, mirroring prisma/schema.prisma (which
 * remains the source of truth for migrations). Column names are the real
 * database identifiers, so a row can be used as-is after `SELECT *`.
 *
 * Type mapping (node-postgres defaults):
 *   text        -> string
 *   integer     -> number
 *   boolean     -> boolean
 *   numeric     -> string   (kept as string to preserve precision)
 *   timestamp   -> Date
 *   enum        -> string literal union below
 */

export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'FINISHED' | 'CANCELED';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

/** What the API is allowed to expose about a user. */
export type PublicUserRow = Omit<UserRow, 'password'>;

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartRow {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemRow {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressRow {
  id: string;
  userId: string;
  label: string | null;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRow {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  subtotal: string;
  shipping: string;
  total: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
  createdAt: Date;
  updatedAt: Date;
}
