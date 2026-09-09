export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Matches Prisma enum Role
export type UserRole = 'CUSTOMER' | 'ADMIN'

// Matches backend POST /auth/login -> user
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Matches backend POST /auth/login response
export interface LoginResponse {
  accessToken: string
  user: User
}

// Matches backend GET /categories -> data[]
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type ProductCategory = Pick<Category, 'id' | 'name' | 'slug'>

// Matches backend products `productSelect` + formatProduct (price as number)
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  imageUrl: string | null
  categoryId: string | null
  category: ProductCategory | null
  active: boolean
  createdAt: string
  updatedAt: string
}

// Matches backend GET /products
export interface ProductsResponse {
  items: Product[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Matches backend GET /products/:id/related
export interface RelatedProductsResponse {
  items: Product[]
  total: number
}

// Matches backend GET /categories
export interface CategoriesResponse {
  data: Category[]
}

// Matches backend listProductsQuerySchema
export type ProductSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest'

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  sort?: ProductSort
}

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  product_image: string
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
  item_count: number
}

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  total: number
  created_at: string
  estimated_delivery: string
}

export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}
