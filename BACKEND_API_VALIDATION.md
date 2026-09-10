# 🔍 Backend API Validation Report

**Data**: 2026-09-01  
**Status**: Checking implementation status  
**Objetivo**: Map frontend requirements vs backend APIs

---

## 📊 RESUMO EXECUTIVO

```
✅ PRONTOS (5 APIs)
- Auth (login/register/logout)
- Users (profile CRUD)
- Addresses (CRUD completo)
- Cart (CRUD completo)
- Orders (create + list + detail)

⚠️ INCOMPLETOS (3 APIs)
- Products (faltam filtros: category, price, rating)
- Categories (não existe endpoint separado)
- Products (faltam related products)

⏳ NÃO INICIADOS (0)
```

---

## 📋 DETALHAMENTO POR PÁGINA

### 1️⃣ HOME PAGE
```
Endpoints necessários:
├─ GET /products (featured=true, limit=6)  ⚠️ INCOMPLETO
└─ GET /categories                          ❌ NÃO EXISTE

Status: PARCIALMENTE PRONTO
Blocker: Não tem endpoint de categories
```

### 2️⃣ SEARCH PAGE
```
Endpoints necessários:
├─ GET /products?search=X&category=Y&price_min=Z&price_max=W  ❌ FALTA FILTROS
├─ GET /categories                                             ❌ NÃO EXISTE
└─ GET /products/search?q=X (autocomplete)                     ❌ NÃO EXISTE

Status: BLOQUEADO
Blockers: 
  - listProductsQuerySchema só tem search/page/limit
  - Faltam filtros: category, price_min, price_max, rating
  - Sem endpoint de categories
  - Sem autocomplete endpoint
```

### 3️⃣ COLLECTION PAGE
```
Depends on: Search Page
Endpoints necessários:
└─ GET /products?category=slug  ❌ FALTA CATEGORIA NO QUERY

Status: BLOQUEADO
Reason: Depends on Search Page blockers
```

### 4️⃣ PRODUCT DETAIL PAGE
```
Endpoints necessários:
├─ GET /products/:id           ✅ PRONTO
└─ GET /products/:id/related   ❌ NÃO EXISTE

Status: INCOMPLETO
Blocker: Related products endpoint missing
```

### 5️⃣ CART PAGE
```
Endpoints necessários:
├─ GET /cart                        ✅ PRONTO
├─ POST /cart/items                 ✅ PRONTO
├─ PATCH /cart/items/:productId     ✅ PRONTO
├─ DELETE /cart/items/:productId    ✅ PRONTO
└─ DELETE /cart                     ✅ PRONTO

Status: ✅ TOTALMENTE PRONTO
```

### 6️⃣ CHECKOUT PAGE
```
Endpoints necessários:
├─ GET /users/me/addresses         ✅ PRONTO
├─ POST /users/me/addresses        ✅ PRONTO
├─ PATCH /users/me/addresses/:id   ✅ PRONTO
├─ DELETE /users/me/addresses/:id  ✅ PRONTO
├─ POST /orders                     ✅ PRONTO
└─ DELETE /cart (after order)       ✅ PRONTO

Status: ✅ TOTALMENTE PRONTO
```

### 7️⃣ PROFILE PAGE
```
Endpoints necessários:
├─ GET /users/me                   ✅ PRONTO
├─ PATCH /users/me                 ✅ PRONTO
├─ GET /users/me/addresses         ✅ PRONTO
├─ POST /users/me/addresses        ✅ PRONTO
├─ PATCH /users/me/addresses/:id   ✅ PRONTO
├─ DELETE /users/me/addresses/:id  ✅ PRONTO
└─ PUT /users/me/password          ⚠️ FALTA CONFIRMAR

Status: QUASE PRONTO
Blocker: Password change endpoint não verificado
```

### 8️⃣ ORDERS PAGES
```
Endpoints necessários:
├─ GET /orders (user's orders)      ✅ PRONTO
├─ GET /orders/:orderId            ✅ PRONTO
└─ GET /orders/:orderId/tracking   ⏳ MOCK OK POR ENQUANTO

Status: ✅ TOTALMENTE PRONTO (com mocks)
```

---

## 🔴 BLOCKERS DETALHADOS

### BLOCKER #1: Products Filters
**Afeta**: Search Page, Collection Page, Home Page  
**Severity**: CRITICAL  
**O que falta**:
```javascript
// ATUAL: listProductsQuerySchema só tem
{
  search?: string
  page?: number (default 1)
  limit?: number (default 20)
}

// NECESSÁRIO:
{
  search?: string
  category?: string (uuid ou slug)
  price_min?: number
  price_max?: number
  rating_min?: number
  in_stock?: boolean
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
  page?: number
  limit?: number
}
```

**Action Item**: 
```
[ ] Update listProductsQuerySchema to include filters
[ ] Update productsController.list to apply filters
[ ] Test with real data
```

---

### BLOCKER #2: Categories Endpoint
**Afeta**: Home Page, Search Page, Collection Page, Navigation  
**Severity**: CRITICAL  
**O que falta**:
```
Endpoint: GET /categories
Response: 
{
  data: [
    { id: uuid, name: string, slug: string, description?: string }
  ]
}
```

**Action Item**:
```
[ ] Create categories module/controller
[ ] Add GET /categories route
[ ] Populate categories from seed
[ ] Test endpoint
```

---

### BLOCKER #3: Related Products Endpoint
**Afeta**: Product Detail Page  
**Severity**: MEDIUM  
**O que falta**:
```
Endpoint: GET /products/:id/related?limit=5
Response:
{
  data: [
    { id, name, price, image, rating }
  ]
}

Logic: Get products from same category, exclude current product
```

**Action Item**:
```
[ ] Add related products logic to productsController
[ ] Add /products/:id/related route
[ ] Test with real data
```

---

### BLOCKER #4: Products Autocomplete
**Afeta**: Search Page autocomplete  
**Severity**: LOW  
**O que falta**:
```
Endpoint: GET /products/search/autocomplete?q=query&limit=5
Response:
{
  data: [
    { id, name }
  ]
}
```

**Action Item**:
```
[ ] Add separate endpoint for autocomplete
[ ] Optimize query for performance (use LIKE)
[ ] Limit results to 5-10
```

---

### BLOCKER #5: Password Change Endpoint
**Afeta**: Profile Page (Settings tab)  
**Severity**: MEDIUM  
**Status**: Precisa confirmar se existe  
**Endpoint esperado**: `PUT /users/me/password`

**Action Item**:
```
[ ] Verify if endpoint exists in usersController
[ ] If not, add new endpoint with validation
[ ] Test with auth
```

---

## ✅ READY TO USE

### Cart Endpoints (✅ All complete)
```
✅ GET /cart
✅ POST /cart/items
✅ PATCH /cart/items/:productId
✅ DELETE /cart/items/:productId
✅ DELETE /cart

Can implement: CART PAGE immediately
```

### Addresses Endpoints (✅ All complete)
```
✅ GET /users/me/addresses
✅ POST /users/me/addresses
✅ PATCH /users/me/addresses/:addressId
✅ DELETE /users/me/addresses/:addressId

Can implement: CHECKOUT + PROFILE immediately
```

### Orders Endpoints (✅ All complete)
```
✅ POST /orders (create)
✅ GET /orders (list user's orders)
✅ GET /orders/:orderId (get details)

Can implement: ORDERS PAGES immediately
```

### Product Detail (⚠️ Partial)
```
✅ GET /products/:id
❌ GET /products/:id/related (MISSING)

Can implement: 80% of Product Detail Page
Missing: Related products carousel
```

---

## 🚦 IMPLEMENTATION ORDER

### PHASE 1: Unblock Search (Priority: CRITICAL)
```
Day 1:
[ ] Create categories endpoint
[ ] Update products filter schema
[ ] Test with real data
Time: ~2-3 hours

Unblocks:
├─ Search Page
├─ Collection Page
└─ Home Page (categories)
```

### PHASE 2: Add Missing Features (Priority: HIGH)
```
Day 2:
[ ] Add related products endpoint
[ ] Add autocomplete endpoint
[ ] Update product detail schema
Time: ~2-3 hours

Unblocks:
└─ Product Detail Page (fully)
```

### PHASE 3: Frontend Implementation (Priority: NORMAL)
```
After Phase 1-2:
[ ] Cart Page .................. 1.5 days (ready NOW)
[ ] Checkout Page .............. 3 days (ready NOW)
[ ] Search Page ................ 2 days (after Phase 1)
[ ] Collection Page ............ 1 day (after Phase 1)
[ ] Product Detail Upgrade ..... 1.5 days (after Phase 2)
[ ] Profile Page ............... 2 days (ready NOW)
[ ] Orders Pages ............... 1 day (ready NOW)
```

---

## 📝 DETAILED ENDPOINT CHECKLIST

### Products Module

#### ✅ GET /products
```
Status: PARTIALLY READY
Current Query Params:
- search: string (optional)
- page: number (default 1)
- limit: number (default 20)

Missing Query Params:
- category: string
- price_min: number
- price_max: number
- rating_min: number
- in_stock: boolean
- sort: enum

Controller: apps/backend/src/modules/products/controller.ts
Schema: apps/backend/src/modules/products/schemas.ts

Action: UPDATE listProductsQuerySchema + controller logic
```

#### ✅ GET /products/:id
```
Status: READY
Uses: productParamsSchema validation
Controller: productsController.getById

Can use for: Product Detail Page (current implementation)
```

#### ❌ GET /products/:id/related
```
Status: MISSING
Expected: List related products by category
Controller: Need to add to productsController
Route: Need to add to productsRoutes

Action: Create new controller method + route
```

#### ❌ GET /categories
```
Status: MISSING
Expected: List all product categories
Controller: Need new categories module
Route: Need new categories routes

Action: Create new categories module with CRUD
```

---

### Cart Module (✅ READY)

#### ✅ GET /cart
```
Status: READY
Auth: Required (authenticate middleware)
Controller: cartController.getCart

Parameters: None (uses authenticated user)
```

#### ✅ POST /cart/items
```
Status: READY
Auth: Required
Body Schema: addCartItemSchema
  - productId: uuid
  - quantity: number

Controller: cartController.addItem
```

#### ✅ PATCH /cart/items/:productId
```
Status: READY
Auth: Required
Params: productId (uuid)
Body: updateCartItemSchema
  - quantity: number

Controller: cartController.updateItem
```

#### ✅ DELETE /cart/items/:productId
```
Status: READY
Auth: Required
Params: productId (uuid)

Controller: cartController.removeItem
```

#### ✅ DELETE /cart
```
Status: READY
Auth: Required
Purpose: Clear entire cart after order

Controller: cartController.clearCart
```

---

### Addresses Module (✅ READY)

#### ✅ GET /users/me/addresses
```
Status: READY
Auth: Required
Purpose: List user's saved addresses

Controller: addressesController.list
```

#### ✅ POST /users/me/addresses
```
Status: READY
Auth: Required
Body Schema: createAddressSchema
  - street: string
  - number: string
  - city: string
  - state: string
  - zipCode: string
  - isDefault?: boolean

Controller: addressesController.create
```

#### ✅ PATCH /users/me/addresses/:addressId
```
Status: READY
Auth: Required
Body Schema: updateAddressSchema
  - All fields optional

Controller: addressesController.update
```

#### ❌ PUT /users/me/addresses/:addressId/default
```
Status: CHECK IF EXISTS
Purpose: Set address as default
Expected: Simple boolean toggle

Controller: Need to verify/create
```

#### ✅ DELETE /users/me/addresses/:addressId
```
Status: READY
Auth: Required

Controller: addressesController.remove
```

---

### Orders Module (✅ READY)

#### ✅ POST /orders
```
Status: READY
Auth: Required
Body Schema: createOrderSchema
  - addressId: uuid
  - items: { productId, quantity }[]
  - shippingMethod?: string

Controller: ordersController.create
```

#### ✅ GET /orders
```
Status: READY
Auth: Required
Purpose: List user's orders (paginated)

Controller: ordersController.listMine
```

#### ✅ GET /orders/:orderId
```
Status: READY
Auth: Required
Purpose: Get order details

Controller: ordersController.getMine (user only)
```

---

### Users Module

#### ✅ GET /users/me
```
Status: READY
Auth: Required
Purpose: Get current user profile

Controller: usersController.me
```

#### ✅ PATCH /users/me
```
Status: READY
Auth: Required
Body Schema: updateUserSchema
  - name?: string
  - email?: string (if not conflicting)
  - avatar?: string

Controller: usersController.updateMe
```

#### ❌ PUT /users/me/password
```
Status: NEED TO VERIFY
Expected Fields:
  - currentPassword: string
  - newPassword: string
  - confirmPassword: string

Controller: Check if exists in usersController
```

#### ❌ DELETE /users/me (Account deletion)
```
Status: NOT NEEDED FOR MVP
Can implement in Phase 2
```

---

## 🎯 QUICK ACTION ITEMS

### TODAY - Critical Path (4 hours)
```
PRIORITY 1: Create categories endpoint
- Create apps/backend/src/modules/categories/ folder
- Add controller with getCategories method
- Add routes with GET /categories
- Seed 3-5 categories from product data
- Test: GET /api/v1/categories

PRIORITY 2: Update products filter schema
- Add category, price_min, price_max to listProductsQuerySchema
- Update productsController.list to apply filters
- Test: GET /api/v1/products?category=electronics&price_max=500

PRIORITY 3: Add related products endpoint
- Add productsController.getRelated method
- Add route: GET /products/:id/related
- Query logic: products from same category, exclude self
- Test: GET /api/v1/products/:id/related
```

### NEXT - Good to Have (4 hours)
```
PRIORITY 4: Autocomplete endpoint
- Add productsController.autocomplete
- Route: GET /products/search/autocomplete?q=text
- Optimize with LIMIT 5-10
- Test search performance
```

---

## 📊 BLOCKING CHART

```
HOME PAGE
├─ Categories endpoint ......... ❌ BLOCKS HOME
└─ GET /products (featured) .... ⚠️ PARTIAL

SEARCH PAGE
├─ Categories endpoint ......... ❌ BLOCKS SEARCH
├─ Products filters ............ ❌ BLOCKS SEARCH
└─ Autocomplete ................ ⏳ NICE TO HAVE

COLLECTION PAGE
└─ Search Page (dependency) .... ❌ BLOCKS COLLECTION

PRODUCT DETAIL
├─ GET /products/:id ........... ✅ READY
└─ Related products ............ ⚠️ BLOCKS RELATED

CART PAGE
└─ All cart endpoints .......... ✅ FULLY READY NOW

CHECKOUT PAGE
├─ Addresses CRUD .............. ✅ FULLY READY NOW
└─ Orders creation ............. ✅ FULLY READY NOW

PROFILE PAGE
├─ Users CRUD .................. ✅ READY
├─ Addresses CRUD .............. ✅ READY
└─ Password change ............. ⏳ NEED TO CHECK

ORDERS PAGES
└─ Orders endpoints ............ ✅ FULLY READY NOW
```

---

## 🎯 RECOMMENDATION

### Start NOW (Can implement immediately):
1. **Cart Page** - All endpoints ready
2. **Checkout Page** - All endpoints ready
3. **Profile Page** - All endpoints ready (except password check)
4. **Orders Pages** - All endpoints ready

### Start AFTER fixing backend blockers (ASAP):
5. **Search Page** - Needs categories + filters (2-3 hours backend)
6. **Collection Page** - Needs Search Page ready
7. **Product Detail Upgrade** - Needs related products (1-2 hours backend)

### Timeline Impact:
```
If you start backend fixes NOW:
├─ 4 hours: Categories + Filters ready
├─ Frontend can start Search (2 days) parallel to other work
├─ 2 hours: Related products ready
└─ Frontend can finish Product Detail (1.5 days)

Total blocking time: ~6 hours backend work
But can run in PARALLEL with Cart/Checkout/Profile frontend dev
```

---

**NEXT STEP**: 
1. Share this report with backend team
2. Or: Start backend fixes immediately
3. While backend builds: Start Cart + Checkout + Profile frontend

Qual quer fazer primeiro? 🚀
