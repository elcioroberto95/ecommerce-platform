export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  in_stock: boolean
  rating: number
  reviews_count: number
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
