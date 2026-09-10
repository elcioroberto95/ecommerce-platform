# Frontend Architecture Plan

## Overview

This document outlines the complete frontend architecture for the e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

**Status:** Planning Phase  
**Last Updated:** 2026-09-01

---

## 📋 Project Structure

```
apps/frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── (auth)/        # Auth routes
│   │   ├── products/      # Products routes
│   │   ├── cart/          # Cart routes
│   │   ├── checkout/      # Checkout routes
│   │   └── orders/        # Orders routes
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── forms/        # Form components
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client and services
│   ├── lib/              # Utilities and helpers
│   ├── context/          # React Context
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
└── __tests__/            # Test files
```

---

## 🔌 Backend Modules Mapping

### Modules Available

- **Auth** — User registration, login, JWT tokens
- **Products** — Product listing, search, filtering
- **Cart** — Add/remove items, update quantities
- **Orders** — Place orders, order history
- **Addresses** — User address management

### API Endpoints Summary

*(Will be populated by workflow analysis)*

---

## 📄 Pages & Features

### Priority 1: Authentication & Home

#### Home Page (`/`)
- **Purpose:** Landing page with featured products
- **Components:** Hero section, product grid, featured carousel
- **API Calls:** `GET /products?featured=true`
- **Estimated:** 4 hours

#### Login Page (`/auth/login`)
- **Purpose:** User authentication
- **Components:** Login form, validation, error handling
- **API Calls:** `POST /auth/login`
- **Estimated:** 3 hours

#### Register Page (`/auth/register`)
- **Purpose:** New user registration
- **Components:** Registration form, validation, terms
- **API Calls:** `POST /auth/register`
- **Estimated:** 3 hours

---

### Priority 2: Products & Browsing

#### Products Page (`/products`)
- **Purpose:** Browse and search products
- **Components:** Product grid, filters, pagination, search bar
- **API Calls:** 
  - `GET /products`
  - `GET /products/search?q=...`
  - `GET /products/categories`
- **Estimated:** 6 hours

#### Product Detail Page (`/products/[id]`)
- **Purpose:** View single product details
- **Components:** Product carousel, specs, reviews, related products
- **API Calls:** 
  - `GET /products/{id}`
  - `GET /products/{id}/related`
- **Estimated:** 5 hours

---

### Priority 3: Shopping Cart & Checkout

#### Cart Page (`/cart`)
- **Purpose:** View and modify shopping cart
- **Components:** Cart items, quantity controls, price summary
- **API Calls:**
  - `GET /cart`
  - `PUT /cart/items/{id}`
  - `DELETE /cart/items/{id}`
- **Estimated:** 4 hours

#### Checkout Page (`/checkout`)
- **Purpose:** Complete purchase
- **Components:** Address form, payment form, order review
- **API Calls:**
  - `POST /orders`
  - `GET /addresses` (user's saved addresses)
  - `POST /addresses` (new address)
- **Estimated:** 7 hours

---

### Priority 4: User Account

#### Order History Page (`/orders`)
- **Purpose:** View past orders
- **Components:** Orders list, filters, order details modal
- **API Calls:**
  - `GET /orders`
  - `GET /orders/{id}`
- **Estimated:** 4 hours

#### Account Page (`/account`)
- **Purpose:** Manage user profile and addresses
- **Components:** Profile form, address list, password change
- **API Calls:**
  - `GET /users/profile`
  - `PUT /users/profile`
  - `GET /addresses`
  - `POST /addresses`
  - `DELETE /addresses/{id}`
- **Estimated:** 5 hours

---

## 🗄️ Database Seeds

*(Will be populated by workflow)*

Minimum data needed for development:

- **Products:** 20-50 records with variants
- **Categories:** 5-10 records
- **Users:** 3-5 test users
- **Orders:** 2-5 past orders per user
- **Addresses:** 2-3 per user

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14** — App Router
- **TypeScript** — Type safety
- **React 18** — UI library

### Styling & Components
- **Tailwind CSS** — Utility-first CSS
- **shadcn/ui** — Pre-built components
- **Radix UI** — Accessible primitives

### State & Data
- **React Query (TanStack Query)** — Server state management
- **React Context** — Client state (auth, theme)
- **Zod** — Schema validation

### HTTP Client
- **Axios** — HTTP requests with interceptors
- **Authentication** — JWT via cookies/headers

### Development
- **ESLint** — Code quality
- **Prettier** — Code formatting
- **Jest** — Unit tests
- **React Testing Library** — Component tests
- **Playwright** — E2E tests

---

## 🏗️ Implementation Strategy

### Phase 1: Setup (Days 1-2)
- [ ] Create Next.js project with all dependencies
- [ ] Configure Tailwind + shadcn/ui
- [ ] Setup API client and interceptors
- [ ] Create base layout and navigation
- [ ] Setup authentication context

### Phase 2: Core Pages (Days 3-5)
- [ ] Implement Home page
- [ ] Implement Login/Register
- [ ] Implement Products page with search
- [ ] Implement Product detail page

### Phase 3: Shopping Flow (Days 5-7)
- [ ] Implement Cart page
- [ ] Implement Checkout with forms
- [ ] Integrate payment processing
- [ ] Order confirmation page

### Phase 4: Account (Days 7-8)
- [ ] Implement Order history
- [ ] Implement Account/Profile page
- [ ] Address management
- [ ] User settings

### Phase 5: Polish & QA (Days 8-10)
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Error handling improvements
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility audit

---

## 📊 Component Inventory

### Layout Components
- `Header` — Navigation and search
- `Footer` — Footer with links
- `Sidebar` — Category filters
- `MainLayout` — Default page layout

### Product Components
- `ProductCard` — Product list item
- `ProductGallery` — Image carousel
- `ProductSpecs` — Specifications table
- `ProductReviews` — Reviews section
- `ProductFilter` — Filter controls
- `SearchBar` — Product search

### Cart Components
- `CartItem` — Single cart item
- `CartSummary` — Price breakdown
- `CheckoutForm` — Checkout steps
- `AddressForm` — Address input
- `PaymentForm` — Payment info

### Common Components
- `LoadingSpinner` — Loading state
- `ErrorAlert` — Error messages
- `ConfirmDialog` — Confirmation modal
- `PaginationControls` — Pagination

---

## 🪝 Custom Hooks

- `useAuth()` — Authentication state
- `useProducts()` — Product data fetching
- `useCart()` — Cart operations
- `useOrders()` — Order fetching
- `useAddresses()` — Address management
- `useSearch()` — Search functionality
- `useLocalStorage()` — Local storage

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Store token in httpOnly cookie or localStorage
4. Axios interceptor adds token to all requests
5. Protected routes check auth context
6. Logout clears token and context

---

## 📝 API Integration Points

### Authentication Service
```typescript
// services/auth.ts
- login(email, password)
- register(name, email, password)
- logout()
- getCurrentUser()
- refreshToken()
```

### Products Service
```typescript
// services/products.ts
- getProducts(filters, pagination)
- getProductById(id)
- searchProducts(query)
- getCategories()
```

### Cart Service
```typescript
// services/cart.ts
- getCart()
- addToCart(productId, quantity)
- updateCartItem(itemId, quantity)
- removeFromCart(itemId)
- clearCart()
```

### Orders Service
```typescript
// services/orders.ts
- createOrder(data)
- getOrders()
- getOrderById(id)
- cancelOrder(id)
```

### Addresses Service
```typescript
// services/addresses.ts
- getAddresses()
- createAddress(data)
- updateAddress(id, data)
- deleteAddress(id)
```

---

## ✅ Quality Standards

- **Type Coverage:** 95%+ TypeScript coverage
- **Test Coverage:** 70%+ code coverage
- **Accessibility:** WCAG AA compliant
- **Performance:** Lighthouse score 90+
- **Mobile:** Responsive design (mobile-first)
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 📚 Documentation

- API integration guide
- Component storybook
- Setup instructions
- Deployment guide
- Contributing guidelines

---

**Next Step:** Analyze backend endpoints and create detailed API mappings.
