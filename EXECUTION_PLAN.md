# 🎯 PLANO DE EXECUÇÃO - E-commerce Platform

**Status Atual**: 30% completo  
**Data**: 2026-09-01  
**Equipe**: 1 dev (você)  
**Objetivo**: MVP completo em 8 semanas

---

## 🚀 PRÓXIMAS 2 SEMANAS - CUSTOMER FRONTEND

### SEMANA 1 (Dias 1-5)

#### DIA 1-2: SEARCH PAGE (2 dias)
```
Arquivo: apps/frontend/src/app/search/page.tsx

Layout:
├─ Header (reutiliza existente)
├─ Search Bar (mostra query)
├─ Sidebar Filters
│  ├─ Categories (GET /categories)
│  ├─ Price range slider
│  ├─ Rating filter
│  └─ Apply/Clear buttons
├─ Products Grid
│  ├─ 3 colunas responsive
│  ├─ ProductCard component
│  └─ Pagination
└─ Footer (reutiliza)

Features CORE:
✅ URL query params (search, filters, page)
✅ GET /products?search=X&category=Y&page=Z
✅ Filter + Sort logic
✅ Pagination (10/20/50)
✅ Results counter ("Encontrados X produtos")

Tasks:
□ Criar página search/page.tsx
□ Implementar filters state (useState + URL)
□ Chamar API products com filtros
□ Implementar paginação
□ Responsive grid
□ Mobile menu filters

Tests:
□ Filtros funcionam
□ URL params sincronizam
□ Paginação funciona
□ Mobile responsivo

Commits:
- feat: implement search page with filters
```

#### DIA 3: COLLECTION PAGE (1 dia)
```
Arquivo: apps/frontend/src/app/collection/[slug]/page.tsx

Layout: IDÊNTICO ao Search, mas:
├─ Hardcoded category
├─ Title: "Coleção: Category Name"
└─ Pre-filter by category_id

Tasks:
□ Reutilizar Search page code
□ Criar dynamic route [slug]
□ Auto-filter por category
□ Navigation links from Home

Commits:
- feat: implement collection page
```

#### DIA 4: PRODUCT DETAIL (upgrade) (1.5 dias)
```
Arquivo: apps/frontend/src/app/products/[id]/page.tsx (upgrade)

Current: 30% (básico)
Adicionar:
├─ Image carousel (swipe mobile)
├─ Specs table (from API)
├─ Reviews section (mock)
├─ Related products (GET /products/related)
├─ Add to cart (integração)
├─ Wishlist button
└─ Out of stock handling

Tasks:
□ Carousel com thumbnails
□ Fetch specs completos
□ Display reviews (mock data)
□ Related products (dynamic)
□ Add to cart logic
□ Error handling

Commits:
- feat: complete product detail page
```

#### DIA 5: CART PAGE (1.5 dias)
```
Arquivo: apps/frontend/src/app/cart/page.tsx

Layout:
├─ Header
├─ Cart Items
│  ├─ Product info
│  ├─ Price
│  ├─ Quantity controls (±)
│  └─ Remove button
├─ Order Summary
│  ├─ Subtotal
│  ├─ Shipping (estimado - mock $10)
│  ├─ Tax (5%)
│  └─ TOTAL
├─ Coupon field (mock)
└─ CTA "Proceed to Checkout"

State:
└─ localStorage + API cart

Tasks:
□ Criar context CartContext
□ Integrar com API cart
□ Update quantity
□ Remove items
□ Calculate totals
□ Empty state
□ Persist localStorage

Commits:
- feat: implement cart page with full functionality
```

### SEMANA 2 (Dias 6-10)

#### DIA 6-7: CHECKOUT PAGE (3 dias)
```
Arquivo: apps/frontend/src/app/checkout/page.tsx

IMPORTANTE: Multi-step form com validação

Layout:
├─ Header
├─ Step Indicator (1 2 3)
├─ Form Content (dinâmico)
└─ Footer (Back/Next)

STEP 1: Shipping Address (Day 6)
├─ Show user profile info
├─ List saved addresses (GET /addresses)
├─ Radio select address
├─ Link "Add new address"
├─ Validation (required)
└─ Button "Next"

STEP 2: Delivery Options (Day 6)
├─ Shipping methods (MOCK)
│  ├─ Standard (5-7 dias) - $10
│  ├─ Express (2-3 dias) - $20
│  └─ Overnight (1 dia) - $50
├─ Delivery estimate
├─ Cost update
└─ Button "Next"

STEP 3: Review & Confirm (Day 7)
├─ Order summary
│  ├─ Items list
│  ├─ Prices
│  ├─ Shipping
│  └─ Tax
├─ Shipping address display
├─ "Back to edit" link
├─ Payment method (MOCK - "Continue to Payment")
└─ Button "Place Order"

STATE:
├─ currentStep (1/2/3)
├─ formData (address, shipping, etc)
├─ cart items
└─ orderTotal

VALIDATION:
└─ Zod schema per step

INTEGRATION:
├─ GET /addresses (current user)
├─ POST /orders (create order)
└─ DELETE /cart (clear after order)

Tasks:
□ Multi-step form component
□ Address selection + new address form
□ Shipping methods (mock)
□ Form validation (Zod)
□ API integration
□ Error handling
□ Success message + redirect

Commits:
- feat: implement checkout page (multi-step form)
- feat: checkout payment mock (technical debt)
```

#### DIA 8-9: PROFILE PAGE (2 dias)
```
Arquivo: apps/frontend/src/app/profile/page.tsx

Layout:
├─ Header
├─ Sidebar (sticky)
│  ├─ Personal Info (tab 1)
│  ├─ Addresses (tab 2)
│  ├─ Settings (tab 3)
│  └─ Logout
├─ Main Content (dinâmico por tab)
└─ Footer

TAB 1: Personal Info
├─ Name field (editable)
├─ Email (read-only)
├─ Phone field
├─ Avatar upload
└─ Save button

TAB 2: Addresses (Day 9 - CRUD completo)
├─ List saved addresses
│  ├─ Address card
│  ├─ Edit button → Form inline
│  ├─ Delete button → Confirmação
│  └─ Set as default checkbox
├─ Button "Add new address"
│  ├─ Form pops up
│  ├─ Fields: street, number, city, state, zip
│  ├─ Validation
│  └─ POST /addresses
└─ API Integration
    ├─ GET /addresses
    ├─ POST /addresses
    ├─ PUT /addresses/:id
    ├─ DELETE /addresses/:id
    └─ PUT /addresses/:id/default

TAB 3: Settings
├─ Change password form
├─ Current password validation
├─ New password strength
├─ Language preference
└─ Notification preferences

Tasks:
□ Tab component (Nav)
□ Edit profile form
□ Address list + CRUD
□ Add address form
□ Form validation
□ API integration (all endpoints)
□ Error handling
□ Success messages

Commits:
- feat: implement profile page with all features
- feat: complete address management (CRUD)
```

#### DIA 10: ORDERS & ORDER DETAILS (1 dia)
```
ORDERS LIST
Arquivo: apps/frontend/src/app/orders/page.tsx

Layout:
├─ Header
├─ Orders List
│  ├─ Order card (each)
│  │  ├─ Order #12345
│  │  ├─ Date: 01 Sep 2026
│  │  ├─ Status badge (Delivered/Processing/Pending)
│  │  ├─ Total: $123.45
│  │  └─ "View Details" link
│  └─ Pagination
└─ Footer

STATE:
└─ GET /orders (paginated)

ORDER DETAILS
Arquivo: apps/frontend/src/app/orders/[id]/page.tsx

Layout:
├─ Header
├─ Order Info
│  ├─ Order #12345
│  ├─ Date & Status
│  ├─ Timeline (visual)
│  │  ├─ ✓ Order Placed (01 Sep)
│  │  ├─ ✓ Processing (02 Sep)
│  │  ├─ ✓ Shipped (03 Sep)
│  │  └─ → Delivery (05 Sep est.)
│  ├─ Items list
│  ├─ Shipping address
│  └─ Price breakdown
└─ Footer

STATE:
└─ GET /orders/:id

Tasks:
□ Orders list page
□ Order cards
□ Pagination
□ Order details page
□ Timeline visualization
□ API integration

Commits:
- feat: implement orders and order details pages
```

---

## 📊 PROGRESSO VISUAL

```
WEEK 1:
Day 1-2: Search ........... ████████░░ 80%
Day 3:   Collection ...... ██░░░░░░░░ 20%
Day 4-5: Product + Cart .. ████░░░░░░ 40%

WEEK 2:
Day 6-7: Checkout ........ ███░░░░░░░ 30%
Day 8-9: Profile ......... ██░░░░░░░░ 20%
Day 10:  Orders .......... ██░░░░░░░░ 20%
```

---

## 📋 CHECKLIST POR PÁGINA

### Search Page
- [ ] Create page with sidebar filters
- [ ] Implement URL query params
- [ ] Filter logic (category, price, rating)
- [ ] Fetch from API with filters
- [ ] Pagination (10/20/50)
- [ ] Mobile responsive filters
- [ ] Sort options (price, rating, newest)
- [ ] Results counter
- [ ] Empty state when no results
- [ ] Tests (filters work, pagination)
- [ ] Code review + approve
- [ ] Commit

### Collection Page
- [ ] Create dynamic route [slug]
- [ ] Reuse Search component
- [ ] Auto-filter by category
- [ ] Navigation from Home
- [ ] Tests
- [ ] Commit

### Product Detail
- [ ] Image carousel with thumbnails
- [ ] Fetch full specs from API
- [ ] Reviews section (mock initially)
- [ ] Related products carousel
- [ ] Add to cart integration
- [ ] Wishlist button
- [ ] Out of stock handling
- [ ] Tests
- [ ] Commit

### Cart Page
- [ ] Create CartContext
- [ ] Fetch cart from API
- [ ] Display items with quantities
- [ ] Update quantity
- [ ] Remove items
- [ ] Calculate totals (subtotal + shipping + tax)
- [ ] Coupon field (mock)
- [ ] Empty state
- [ ] Persist to localStorage + API
- [ ] Tests
- [ ] Commit

### Checkout Page
- [ ] Multi-step form (1/2/3)
- [ ] Step 1: Address selection + form
- [ ] Step 2: Shipping methods (mock)
- [ ] Step 3: Review & confirm
- [ ] Form validation (Zod)
- [ ] Fetch user addresses
- [ ] Create new address option
- [ ] API integration (POST /orders)
- [ ] Success page + redirect
- [ ] Error handling
- [ ] Tests
- [ ] Commit

### Profile Page
- [ ] Tab navigation
- [ ] Tab 1: Edit personal info
- [ ] Tab 2: Addresses CRUD (full)
- [ ] Tab 3: Settings (password change)
- [ ] Upload avatar
- [ ] All form validations
- [ ] API integration (all endpoints)
- [ ] Success messages
- [ ] Error handling
- [ ] Tests
- [ ] Commit

### Orders Pages
- [ ] Orders list with cards
- [ ] Pagination
- [ ] Status badges
- [ ] Order details page
- [ ] Timeline visualization
- [ ] API integration
- [ ] Tests
- [ ] Commit

---

## 🔗 DEPENDENCIES

```
Frontend Pages → Backend APIs needed:

Search Page
└─ GET /products (with filters)
└─ GET /categories

Product Detail
└─ GET /products/:id
└─ GET /products/:id/related

Cart Page
└─ GET /cart
└─ PUT /cart/items/:id
└─ DELETE /cart/items/:id

Checkout
└─ GET /addresses
└─ POST /addresses
└─ POST /orders

Profile
└─ GET /users/profile
└─ PUT /users/profile
└─ GET /addresses
└─ POST /addresses
└─ PUT /addresses/:id
└─ DELETE /addresses/:id
└─ PUT /users/password

Orders
└─ GET /orders
└─ GET /orders/:id
```

---

## ⚠️ TECHNICAL DEBT (para Phase 2)

```
- [ ] Search with IA (autocomplete)
- [ ] Payment processing (atualmente mock)
- [ ] Shipping calculation (atualmente mock)
- [ ] Email notifications (atualmente mock)
- [ ] Inventory sync (atualmente mock)
```

---

## 🎯 COMEÇAR AGORA!

```
1. Crie branch: git checkout -b feat/customer-pages-week1-2

2. Implemente na ordem:
   - Search page (2 dias)
   - Collection page (1 dia)
   - Product detail upgrade (1.5 dias)
   - Cart page (1.5 dias)
   - Checkout page (3 dias)
   - Profile page (2 dias)
   - Orders pages (1 dia)

3. Após cada página:
   - Teste localmente
   - Make commit
   - Deploy (quando tiver CI/CD)

4. Fim de week 2:
   - PR com todas as pages
   - Code review
   - Merge

Total: 12 dias de dev (1.5 semanas)
```

---

**Vamo começar? 🚀**

Qual página quer implementar PRIMEIRO?
