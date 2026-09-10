# 📐 Pages Design Model & Mental Map

**Objetivo**: Definir visualmente cada página, critérios e sugestões antes de implementar  
**Status**: Design Phase  
**Data**: 2026-09-01

---

## 🏠 HOME PAGE

### Wireframe ASCII
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART(0)  USER   │  ← Header (sticky)
├────────────────────────────────────────┤
│                                        │
│   ╔════════════════════════════════╗  │
│   ║  HERO BANNER - BIG CTA         ║  │
│   ║  "Shop Now" or "Explore"       ║  │
│   ╚════════════════════════════════╝  │
│                                        │
│  🔄 FEATURED PRODUCTS CAROUSEL 🔄    │  ← Swipeable
│  ┌─────┬─────┬─────┬─────┬─────┐     │
│  │ P1  │ P2  │ P3  │ P4  │ P5  │     │
│  └─────┴─────┴─────┴─────┴─────┘     │
│                                        │
│  📦 FEATURED PRODUCTS GRID            │  ← 3 columns desktop
│  ┌─────────┬─────────┬─────────┐     │
│  │ Product │ Product │ Product │     │
│  ├─────────┼─────────┼─────────┤     │
│  │ Product │ Product │ Product │     │
│  └─────────┴─────────┴─────────┘     │
│                                        │
│  ⭐ STATS (Trust section)             │
│  📊 10K Products  |  50K Customers    │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ NEWSLETTER CTA                 │   │
│  │ "Get 20% off your first order" │   │
│  └────────────────────────────────┘   │
│                                        │
│  FOOTER                                │
└────────────────────────────────────────┘
```

### Componentes Principais
```
Header Component
├─ Logo (link to home)
├─ Search bar with autocomplete ⭐ INTERACTIVE
├─ Cart icon with badge
└─ User menu (login/profile)

Hero Section
├─ Background image/video
├─ Title "Shop Amazing Products"
├─ CTA Button

Carousel Component
├─ Auto-scroll
├─ Manual navigation
├─ Mobile: swipe support
└─ Featured products from API

Product Grid
├─ ProductCard component (reusable)
├─ 3 columns desktop / 2 mobile / 1 mobile-sm
└─ Responsive gap

Trust Section
├─ Stats cards
│  ├─ 10K+ Products
│  ├─ 50K+ Happy Customers
│  └─ 24/7 Support
└─ Small icons

Newsletter CTA
├─ Input field
├─ Subscribe button
└─ Success message

Footer Component
├─ Links columns
├─ Social icons
└─ Copyright
```

### Critérios de Aceitação
```
✅ Header sticky on scroll
✅ Search autocomplete shows 5 suggestions
✅ Carousel auto-scrolls every 5 seconds
✅ Carousel responsive (swipe on mobile)
✅ Featured products load from API
✅ ProductCard shows: image, name, price, rating
✅ Mobile responsive (320px+)
✅ Lighthouse score 85+
✅ No console errors
✅ SEO meta tags (og, twitter)
✅ Images optimized
```

### Sugestões de Melhoria
```
🌟 ADD: Product quick-view modal
   → Hover on product → Quick view button
   → Shows image + price + add to cart

🌟 ADD: "New Arrivals" badge
   → Visual indicator for new products
   → Filter by "New" in search

🌟 ADD: Live product counter
   → "50 in stock" or "Last 2 left!"
   → Urgency element

🌟 ADD: Section navigation
   → "Browse by category" links
   → Quick access to collections

🌟 OPTIONAL: Product recommendations
   → "You might like" section
   → Personalized (later with AI)

🌟 OPTIONAL: Live chat widget
   → Help icon bottom-right
   → Chat with support (mock)
```

### APIs Necessárias
```
GET /products?featured=true&limit=6
GET /categories
GET /products/search?q=search (autocomplete)
```

---

## 🔍 SEARCH PAGE

### Wireframe ASCII
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART(0)  USER   │
├────────────────────────────────────────┤
│  "You searched for: laptop"            │  ← Search query display
├──────────────────┬─────────────────────┤
│ FILTERS          │  PRODUCTS           │
│ ─────────────────┼─────────────────────│
│ Categories       │  Showing 124 items  │
│ ☑ Electronics    │  Sort: ▼ Relevance │
│ ☐ Accessories    │                     │
│ ☐ Home           │  ┌─────┬─────┬─────┐
│                  │  │ P1  │ P2  │ P3  │
│ Price Range      │  ├─────┼─────┼─────┤
│ $0 ─────── $1000 │  │ P4  │ P5  │ P6  │
│ Min: $50        │  ├─────┼─────┼─────┤
│ Max: $500       │  │ P7  │ P8  │ P9  │
│                  │  └─────┴─────┴─────┘
│ Rating           │
│ ★★★★★ 5 stars   │  ◀ 1 2 3 4 5 ▶ Page 3
│ ★★★★☆ 4+ stars  │
│ ★★★☆☆ 3+ stars  │
│                  │
│ [Apply Filters]  │
│ [Reset Filters]  │
│                  │
└────────────────────────────────────────┘
```

### Componentes Principais
```
Filter Sidebar (Sticky Left)
├─ Categories (radio/checkbox)
├─ Price range slider
├─ Rating filter (stars)
├─ In stock toggle
├─ Apply/Reset buttons
└─ Results count

Products Section (Main)
├─ Search query display
├─ Sort dropdown (relevance, price, rating)
├─ Product grid (3 columns desktop)
├─ Pagination (bottom)
└─ Empty state (no results)

Sort Options
├─ Relevance (default)
├─ Price: Low to High
├─ Price: High to Low
└─ Top Rated
```

### Critérios de Aceitação
```
✅ Filters work correctly
✅ Sort options change order
✅ URL params sync with filters
✅ Pagination works (10/20/50 items)
✅ Results counter shows correct number
✅ Filter tags show selected filters
✅ "Clear filters" resets all
✅ Mobile: filters in collapsible sidebar
✅ No lag when filtering
✅ Empty state message when no results
```

### Sugestões de Melhoria
```
🌟 ADD: "Did you mean" suggestions
   → If no results, suggest alternatives
   → "Did you mean: laptop stand?"

🌟 ADD: Save search
   → Heart icon to save search
   → View saved searches in profile

🌟 ADD: Search history
   → Dropdown shows last 5 searches
   → Clear history option

🌟 ADD: Faceted search
   → More granular filters
   → Brand filter
   → Color filter (for apparel)

🌟 ADD: Search tips
   → "Try broader search"
   → "Filter to narrow results"

🌟 OPTIONAL: Visual search
   → Upload image to search
   → Find similar products

🌟 OPTIONAL: Advanced filters
   → Date range (for newest products)
   → Discount level
   → Seller rating
```

### APIs Necessárias
```
GET /products?search=query&category=X&price_min=Y&price_max=Z&sort=relevance&page=1&limit=20
GET /categories
GET /products/search?q=partial (autocomplete)
```

---

## 🛒 CART PAGE

### Wireframe ASCII
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART(3)  USER   │
├────────────────────────────────────────┤
│  SHOPPING CART                         │
├────────────────────┬───────────────────┤
│ ITEMS (3)          │  ORDER SUMMARY    │
│ ───────────────────┼───────────────────│
│ ┌────────────────┐ │ Subtotal  $299.97│
│ │ Product 1      │ │ Shipping  $ 10.00│
│ │ Price: $199.99 │ │ Tax       $ 15.00│
│ │ Qty: [−] 1 [+] │ │ ─────────────────│
│ │ Remove ✕       │ │ TOTAL    $324.97│
│ └────────────────┘ │                   │
│                    │ ┌─────────────────┐
│ ┌────────────────┐ │ │ [CHECKOUT BTN]  │
│ │ Product 2      │ │ └─────────────────┘
│ │ Price: $49.99  │ │
│ │ Qty: [−] 2 [+] │ │ [Continue Shopping]
│ │ Remove ✕       │ │
│ └────────────────┘ │
│                    │
│ ┌────────────────┐ │ Coupon Code:
│ │ Product 3      │ │ [________] [Apply]
│ │ Price: $49.99  │ │
│ │ Qty: [−] 1 [+] │ │ ✓ Free shipping
│ │ Remove ✕       │ │   on orders $50+
│ └────────────────┘ │
│                    │
│ [Clear Cart]       │
└────────────────────┴───────────────────┘
```

### Componentes Principais
```
Cart Items List
├─ CartItem component (each)
│  ├─ Product image
│  ├─ Product name
│  ├─ Price
│  ├─ Quantity controls [−] [qty] [+]
│  └─ Remove button [✕]
└─ Empty state "Your cart is empty"

Order Summary (Sticky Right)
├─ Subtotal
├─ Shipping (calculated)
├─ Tax (5%)
├─ TOTAL (bold)
├─ Checkout CTA button
└─ Continue Shopping link

Coupon Section
├─ Input field
├─ Apply button
└─ Success message
```

### Critérios de Aceitação
```
✅ Cart items display correctly
✅ Quantity can be updated
✅ Items can be removed
✅ Totals recalculate on change
✅ Empty state shows when no items
✅ Checkout button enabled (with items)
✅ Checkout button disabled (no items)
✅ Continue Shopping returns to previous page
✅ Cart persists on refresh
✅ Mobile responsive
✅ Lazy load images
```

### Sugestões de Melhoria
```
🌟 ADD: Free shipping threshold
   → "Add $15 more for free shipping"
   → Progress bar showing progress

🌟 ADD: Recommended products
   → "People also bought" section
   → Below cart items

🌟 ADD: Save for later
   → Move item to wishlist
   → "Save for later" button instead of delete

🌟 ADD: Quantity input validation
   → Can't exceed stock
   → Shows "Only 5 left in stock"

🌟 ADD: Item notes
   → Gift message field
   → Special instructions

🌟 ADD: Gift card option
   → Add gift card to cart
   → Gift card amount + message

🌟 OPTIONAL: Bulk discounts
   → "Buy 3, get 10% off"
   → Show discount at checkout
```

### APIs Necessárias
```
GET /cart
PUT /cart/items/:id (update quantity)
DELETE /cart/items/:id (remove)
POST /cart/apply-coupon
GET /cart (persistent)
```

---

## 💳 CHECKOUT PAGE

### Wireframe ASCII (Multi-step)
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART   USER      │
├────────────────────────────────────────┤
│ [1: ADDRESS] [2: DELIVERY] [3: CONFIRM]│
├────────────────────────────────────────┤
│                                        │
│ STEP 1: SHIPPING ADDRESS               │
│ ─────────────────────────────────────  │
│ User: John Doe                         │
│ Email: john@example.com                │
│                                        │
│ Saved Addresses:                       │
│ ◉ Home (123 Main St, San Francisco...) │
│ ○ Work (456 Work Ave, San Francisco..) │
│                                        │
│ Or Create New:                         │
│ [Address Form - Street, City, Zip]    │
│                                        │
│                [< BACK]  [NEXT >]     │
│                                        │
└────────────────────────────────────────┘
```

### Step Breakdown
```
STEP 1: Shipping Address
├─ Display user info (name, email)
├─ List saved addresses (radio select)
├─ Option to create new address
│  ├─ Street address
│  ├─ City
│  ├─ State
│  ├─ ZIP code
│  └─ Validation (required fields)
└─ Actions: [Back] [Next]

STEP 2: Delivery Options
├─ Show available shipping methods
│  ├─ Standard (5-7 days) - $10
│  ├─ Express (2-3 days) - $20
│  └─ Overnight (1 day) - $50
├─ Show estimated delivery date
├─ Cost updates dynamically
└─ Actions: [Back] [Next]

STEP 3: Review & Confirm
├─ Order summary
│  ├─ Items list
│  ├─ Prices breakdown
│  ├─ Shipping address
│  └─ Delivery method
├─ Edit links (go back to step)
├─ Final total
└─ Actions: [Back] [Place Order]

Success Page
├─ Confirmation number
├─ Order details
├─ Estimated delivery
├─ "Track your order" button
└─ "Continue shopping" button
```

### Critérios de Aceitação
```
✅ Multi-step form navigation works
✅ Step validation before proceeding
✅ Form data persists between steps
✅ Address selection works
✅ New address creation works
✅ Shipping methods display correctly
✅ Order creation succeeds
✅ Success page shows confirmation
✅ Error handling + retry logic
✅ Mobile responsive (vertical steps)
✅ Session timeout handling
```

### Sugestões de Melhoria
```
🌟 ADD: Express checkout
   → One-click checkout for returning users
   → Use default address + shipping

🌟 ADD: Gift recipient option
   → Different shipping address
   → Gift message

🌟 ADD: Billing address
   → Option to use different from shipping
   → Checkbox "Same as shipping"

🌟 ADD: Order notes
   → Special delivery instructions
   → "Leave at door" option

🌟 ADD: Order review step
   → Everything visible before payment
   → "You won't be charged until you confirm"

🌟 ADD: Price comparison
   → Show original vs final price
   → Savings amount highlighted

🌟 OPTIONAL: Promo code auto-apply
   → "Promo code WELCOME10 saves you $30"
   → Auto-apply if available

🌟 OPTIONAL: Financing options
   → "Pay in 3 installments"
   → Interest-free option
```

### APIs Necessárias
```
GET /addresses (user's saved addresses)
POST /addresses (create new address)
GET /shipping-methods (available options)
POST /orders (create order)
DELETE /cart (clear after order)
GET /orders/:id (confirmation)
```

---

## 👤 PROFILE PAGE

### Wireframe ASCII
```
┌──────────────────────────────────────────┐
│  LOGO      SEARCH     CART   USER(MENU)  │
├──────────────────────────────────────────┤
│ SIDEBAR              │ MAIN CONTENT       │
│ ──────────────────────┼────────────────────│
│ ▶ Personal Info      │ Personal Information
│ ▶ Addresses          │ ───────────────────
│ ▶ Settings           │ Name: [John Doe]
│ ▶ Logout             │ Email: john@... (read-only)
│                      │ Phone: [555-1234]
│                      │ Avatar: [Upload]
│                      │
│                      │ [Save Changes]
│                      │
│                      │ ───────────────────
│                      │ Addresses
│                      │ ───────────────────
│                      │ ┌─────────────────┐
│                      │ │ HOME            │
│                      │ │ 123 Main St     │
│                      │ │ [Edit] [Delete] │
│                      │ └─────────────────┘
│                      │
│                      │ [Add New Address]
│                      │
└──────────────────────┴────────────────────┘
```

### Componentes Principais
```
Sidebar Navigation
├─ Personal Info (tab 1)
├─ Addresses (tab 2)
├─ Settings (tab 3)
└─ Logout button

Personal Info Tab
├─ Name input (editable)
├─ Email display (read-only)
├─ Phone input (editable)
├─ Avatar upload
└─ Save button

Addresses Tab
├─ Address list
│  ├─ Address card (each)
│  │  ├─ Full address display
│  │  ├─ Edit button
│  │  └─ Delete button (with confirm)
│  └─ Set as default checkbox
├─ Add New Address button
└─ Address form (modal or inline)

Settings Tab
├─ Change password form
│  ├─ Current password
│  ├─ New password
│  ├─ Confirm password
│  └─ Save button
├─ Notifications preferences
└─ Account settings
```

### Critérios de Aceitación
```
✅ Tabs switch correctly
✅ Edit profile saves to API
✅ Avatar uploads successfully
✅ Address CRUD works (create, read, update, delete)
✅ Set default address works
✅ Password change validates
✅ Form validation shows errors
✅ Success messages display
✅ Mobile responsive
✅ Logout clears auth
✅ Only authenticated users access
```

### Sugestões de Melhoria
```
🌟 ADD: Account deletion
   → Warning modal
   → Confirmation email

🌟 ADD: Login history
   → Show recent logins
   → Device info + location

🌟 ADD: Password strength meter
   → Real-time feedback
   → Requirements checklist

🌟 ADD: Two-factor authentication
   → Enable/disable 2FA
   → Recovery codes

🌟 ADD: Wishlist management
   → Tab for saved products
   → Move to cart from wishlist

🌟 ADD: Download personal data
   → GDPR compliance
   → Export as JSON/CSV

🌟 OPTIONAL: API keys management
   → For developers
   → Create/revoke keys

🌟 OPTIONAL: Preferences
   → Language selection
   → Currency selection
   → Privacy settings
```

### APIs Necessárias
```
GET /users/profile
PUT /users/profile
GET /addresses
POST /addresses
PUT /addresses/:id
DELETE /addresses/:id
PUT /addresses/:id/default
PUT /users/password
DELETE /users (account deletion)
```

---

## 📦 ORDERS PAGES

### Orders List
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART   USER      │
├────────────────────────────────────────┤
│ ORDER HISTORY                          │
│                                        │
│ ┌─────────────────────────────────┐   │
│ │ Order #12345                    │   │
│ │ Sep 1, 2026  |  $324.97         │   │
│ │ Status: 🟢 Delivered            │   │
│ │ [View Details] [Reorder]        │   │
│ └─────────────────────────────────┘   │
│                                        │
│ ┌─────────────────────────────────┐   │
│ │ Order #12344                    │   │
│ │ Aug 30, 2026  |  $199.99        │   │
│ │ Status: 🟡 In Transit           │   │
│ │ [View Details] [Reorder]        │   │
│ └─────────────────────────────────┘   │
│                                        │
│ ◀ 1 [2] 3 ▶                            │
│                                        │
└────────────────────────────────────────┘
```

### Order Details
```
┌────────────────────────────────────────┐
│  LOGO      SEARCH     CART   USER      │
├────────────────────────────────────────┤
│ ORDER #12345                           │
│                                        │
│ ORDER TIMELINE:                        │
│ ✓ Ordered (Sep 1)                     │
│ ✓ Processing (Sep 2)                  │
│ ✓ Shipped (Sep 3)                     │
│ → In Transit (Sep 4-6)                │
│   Delivery Sept 6                      │
│                                        │
│ ITEMS:                                 │
│ • Laptop (x1) ............. $799.99   │
│ • Mouse (x1) .............. $49.99    │
│ • USB Cable (x2) .......... $19.99    │
│                                        │
│ Subtotal .................. $869.97   │
│ Shipping .................. $ 10.00   │
│ Tax ........................ $ 25.00   │
│ TOTAL ...................... $904.97   │
│                                        │
│ Shipping to: 123 Main St...           │
│                                        │
│ Tracking: ABC123XYZ                   │
│ [Track Package]  [Download Invoice]  │
│                                        │
└────────────────────────────────────────┘
```

### Componentes Principais
```
Orders List Page
├─ Order cards (each)
│  ├─ Order number (link)
│  ├─ Date
│  ├─ Total amount
│  ├─ Status badge (color-coded)
│  ├─ View Details link
│  └─ Reorder button
├─ Pagination
├─ Filters (optional): by status, date range
└─ Empty state

Order Details Page
├─ Order header
│  ├─ Order number
│  └─ Order date
├─ Timeline visualization
│  ├─ Events list
│  │  ├─ Event name
│  │  └─ Date/time
│  └─ Visual timeline
├─ Items section
│  ├─ Product list
│  │  ├─ Name
│  │  ├─ Price
│  │  └─ Quantity
│  └─ Price breakdown
├─ Shipping address
├─ Tracking info
└─ Actions: Track, Invoice, Reorder
```

### Critérios de Aceitación
```
✅ Orders list displays all user orders
✅ Pagination works
✅ Status badges show correctly (color-coded)
✅ Order details page loads correctly
✅ Timeline shows all events
✅ Items display with correct prices
✅ Totals calculate correctly
✅ Tracking link works (mock)
✅ Invoice download works (mock)
✅ Reorder button works
✅ Mobile responsive
```

### Sugestões de Melhoria
```
🌟 ADD: Order search
   → Search by order number
   → Filter by status

🌟 ADD: Return/exchange option
   → 30-day return window
   → Return request form
   → Return tracking

🌟 ADD: Review products
   → From order details
   → Quick review link
   → Star rating + comment

🌟 ADD: Order sharing
   → Share order with someone
   → Generate share link

🌟 ADD: Estimated delivery countdown
   → "Arrives in 2 days"
   → Countdown timer

🌟 ADD: Delivery updates
   → Email notifications
   → SMS notifications (optional)

🌟 OPTIONAL: AR package preview
   → See where package will be delivered
   → AR visualization
```

### APIs Necessárias
```
GET /orders (list, paginated)
GET /orders/:id (details)
GET /orders/:id/tracking (tracking info)
GET /orders/:id/invoice (download)
POST /orders/:id/reorder (quick reorder)
POST /orders/:id/review (leave review)
```

---

## 🎯 DECISÕES DE DESIGN

### Padrões Reusáveis
```
✅ ProductCard
   - Image
   - Name (2 lines max)
   - Price
   - Rating stars + count
   - Add to cart / Wishlist
   - Stock status badge

✅ Header (Global)
   - Logo (home link)
   - Search bar (autocomplete)
   - Cart icon (badge count)
   - User menu

✅ Footer (Global)
   - Links columns
   - Social icons
   - Newsletter signup
   - Copyright

✅ Forms
   - Zod validation
   - Error messages below fields
   - Loading state on submit
   - Success toast

✅ Status Badges
   - Green: Delivered/Completed
   - Yellow: Processing/Pending
   - Blue: Shipped/In Transit
   - Red: Cancelled/Failed
```

### Breakpoints
```
Mobile: 320px - 639px
Tablet: 640px - 1023px
Desktop: 1024px+

Grid Columns:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
```

### Loading States
```
✅ Skeleton loaders for:
   - Product cards
   - Cart items
   - Order list
   - Address list

✅ Spinners for:
   - Form submission
   - Page navigation
```

---

## 🔗 FLOW DEPENDENCIES

```
HOME
├─→ SEARCH (click "Products" nav)
│   ├─→ COLLECTION (click category)
│   └─→ PRODUCT DETAIL (click product)
│       ├─→ CART (add to cart)
│       │   └─→ CHECKOUT (proceed)
│       │       └─→ ORDER CONFIRMATION
│       └─→ PRODUCT DETAIL (related products)
│
├─→ CART (cart icon)
│   └─→ CHECKOUT
│       └─→ ORDER CONFIRMATION
│           └─→ ORDERS LIST (view orders)
│               └─→ ORDER DETAILS
│
└─→ PROFILE (user menu)
    ├─→ ORDERS LIST
    │   └─→ ORDER DETAILS
    └─→ PROFILE (addresses, settings)
```

---

## ✅ SUMMARY

### Pages Status
```
🟢 HOME ............... Ready (wireframe ✓, components ✓)
🟢 SEARCH ............. Ready (wireframe ✓, components ✓)
🟢 PRODUCT DETAIL .... Ready (wireframe ✓, components ✓)
🟢 CART ............... Ready (wireframe ✓, components ✓)
🟢 CHECKOUT ........... Ready (wireframe ✓, components ✓)
🟢 PROFILE ............ Ready (wireframe ✓, components ✓)
🟢 ORDERS ............. Ready (wireframe ✓, components ✓)
```

### APIs Ready Check
```
Need to verify with backend team:
🔲 GET /products (with filters)
🔲 GET /categories
🔲 GET /cart
🔲 POST /cart/items
🔲 PUT /cart/items/:id
🔲 DELETE /cart/items/:id
🔲 GET /addresses
🔲 POST /addresses
🔲 PUT /addresses/:id
🔲 DELETE /addresses/:id
🔲 POST /orders
🔲 GET /orders
🔲 GET /orders/:id
🔲 GET /users/profile
🔲 PUT /users/profile
🔲 And more...
```

---

**PRÓXIMO PASSO**: Validar backend APIs com o time

Qual API quer verificar primeiro?
