# Database Seeds Configuration

Seeds for development and testing. Configure and run these to populate the database with realistic data.

**Status:** To be implemented based on workflow analysis

---

## 🎯 Seed Strategy

- **Development:** Minimal realistic data (5-20 records per entity)
- **Testing:** Diverse data for edge cases and filtering tests
- **Staging:** Large datasets simulating production (100+)

---

## 📊 Seed Data Specifications

### Categories

| Entity | Count | Purpose |
|--------|-------|---------|
| **Categories** | 10 | Product categorization |

**Sample Data:**
```json
[
  {
    "id": "cat-001",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "image_url": "https://..."
  },
  {
    "id": "cat-002",
    "name": "Clothing",
    "description": "Apparel and fashion items",
    "image_url": "https://..."
  },
  ...
]
```

---

### Products

| Entity | Count | Purpose |
|--------|-------|---------|
| **Products** | 50 | Main catalog |
| **With Images** | 50 | Gallery display |
| **With Reviews** | 30 | Rating system |
| **Stock Levels** | Varied | Out of stock scenarios |

**Sample Data:**
```json
{
  "id": "prod-001",
  "name": "Wireless Headphones",
  "description": "Premium wireless headphones",
  "long_description": "...",
  "price": 150.00,
  "discount_price": 120.00,
  "category_id": "cat-001",
  "in_stock": true,
  "stock_quantity": 25,
  "rating": 4.5,
  "reviews_count": 42,
  "images": [
    "https://...",
    "https://..."
  ],
  "specifications": {
    "Battery Life": "30 hours",
    "Bluetooth": "5.0",
    "Weight": "200g"
  }
}
```

---

### Users

| Entity | Count | Purpose |
|--------|-------|---------|
| **Regular Users** | 5 | Test different roles |
| **Admin Users** | 1 | Admin functionality |

**Sample Users:**
```json
[
  {
    "id": "user-001",
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "hashed_password",
    "phone": "11999999999",
    "created_at": "2024-01-15",
    "role": "customer"
  },
  {
    "id": "user-002",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "hashed_password",
    "role": "customer"
  },
  ...
]
```

---

### Addresses

| Entity | Count | Purpose |
|--------|-------|---------|
| **User Addresses** | 2-3 per user | Address selection in checkout |
| **Default Address** | 1 per user | Auto-select in forms |

**Sample Data:**
```json
{
  "id": "addr-001",
  "user_id": "user-001",
  "label": "Home",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 42",
  "city": "São Paulo",
  "state": "SP",
  "postal_code": "01234-567",
  "country": "Brazil",
  "is_default": true
}
```

---

### Orders

| Entity | Count | Purpose |
|--------|-------|---------|
| **Completed Orders** | 5-10 | Order history display |
| **Pending Orders** | 2-3 | Status tracking |
| **Cancelled Orders** | 1-2 | Edge case handling |

**Sample Data:**
```json
{
  "id": "order-001",
  "order_number": "ORD-2024-001",
  "user_id": "user-001",
  "status": "delivered",
  "items": [
    {
      "id": "item-001",
      "product_id": "prod-001",
      "product_name": "Wireless Headphones",
      "price": 120.00,
      "quantity": 1
    }
  ],
  "subtotal": 120.00,
  "shipping_cost": 15.00,
  "tax": 27.00,
  "total": 162.00,
  "shipping_address_id": "addr-001",
  "tracking_number": "BR123456789",
  "created_at": "2024-01-20",
  "estimated_delivery": "2024-01-25",
  "timeline": [
    {
      "status": "pending",
      "date": "2024-01-20",
      "description": "Order placed"
    },
    {
      "status": "processing",
      "date": "2024-01-21",
      "description": "Processing order"
    },
    {
      "status": "shipped",
      "date": "2024-01-22",
      "description": "Shipped"
    },
    {
      "status": "delivered",
      "date": "2024-01-25",
      "description": "Delivered"
    }
  ]
}
```

---

### Reviews

| Entity | Count | Purpose |
|--------|-------|---------|
| **Product Reviews** | 3-5 per product | Social proof |
| **Rating Distribution** | Varied (1-5) | Rating system testing |

**Sample Data:**
```json
{
  "id": "review-001",
  "product_id": "prod-001",
  "user_id": "user-001",
  "user_name": "João Silva",
  "rating": 5,
  "comment": "Excellent product! Great sound quality and battery life.",
  "created_at": "2024-01-25"
}
```

---

## 🔧 Seed Implementation

### Backend Seed Script

Create `apps/backend/scripts/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const categories = await seedCategories()
  
  // Seed products
  const products = await seedProducts(categories)
  
  // Seed users
  const users = await seedUsers()
  
  // Seed addresses
  const addresses = await seedAddresses(users)
  
  // Seed orders
  await seedOrders(users, addresses, products)
  
  // Seed reviews
  await seedReviews(products, users)
  
  console.log('Database seeded successfully!')
}

async function seedCategories() {
  // Implementation...
}

async function seedProducts(categories: any[]) {
  // Implementation...
}

async function seedUsers() {
  // Implementation...
}

async function seedAddresses(users: any[]) {
  // Implementation...
}

async function seedOrders(users: any[], addresses: any[], products: any[]) {
  // Implementation...
}

async function seedReviews(products: any[], users: any[]) {
  // Implementation...
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Run Seeds

```bash
# In backend folder
pnpm seed

# Or with npm script
npm run db:seed
```

---

## 📋 Seed Data Checklist

- [ ] **Categories:** 10 diverse categories
- [ ] **Products:** 50 products across categories
- [ ] **Product Images:** Multiple images per product (3-5)
- [ ] **Product Specifications:** Technical details
- [ ] **Product Reviews:** 3-5 reviews per product (average)
- [ ] **Users:** 5 regular users + 1 admin
- [ ] **User Addresses:** 2-3 addresses per user
- [ ] **Orders:** Mix of statuses (pending, processing, shipped, delivered, cancelled)
- [ ] **Order Items:** Multiple items per order
- [ ] **Stock Levels:** Some products out of stock
- [ ] **Pricing:** Realistic prices with discounts

---

## 🧪 Test Data Scenarios

### Scenario 1: First-Time User Flow
```
1. User registers → Create user + default address
2. Browse products → Load product list
3. View product → Load product details
4. Add to cart → Create cart + item
5. Checkout → Create order
6. View order history → Display order
```

**Required Seeds:**
- 1 new user
- 5+ products
- Address for user

---

### Scenario 2: Filter & Search
```
1. Filter by category
2. Filter by price range
3. Filter by rating
4. Search by keyword
5. Sort by popularity
```

**Required Seeds:**
- Products in multiple categories
- Various price ranges
- Different ratings
- Multiple reviews per product

---

### Scenario 3: Address Management
```
1. View saved addresses
2. Select address at checkout
3. Add new address
4. Edit existing address
5. Delete address
```

**Required Seeds:**
- User with 2-3 addresses
- One as default

---

### Scenario 4: Order Tracking
```
1. Place order
2. View order details
3. Check order status
4. Track shipment
```

**Required Seeds:**
- Order in each status
- Timeline data

---

## 📈 Seed Data Volume

### Development (Minimal)
- Products: 20
- Users: 3
- Orders: 5
- Reviews: 10

### Testing (Standard)
- Products: 50
- Users: 10
- Orders: 20
- Reviews: 50

### Staging (Large)
- Products: 500+
- Users: 100+
- Orders: 500+
- Reviews: 1000+

---

## 🔐 Test Credentials

### Regular User
- **Email:** `test@example.com`
- **Password:** `Test@1234`

### Admin User
- **Email:** `admin@example.com`
- **Password:** `Admin@1234`

---

**Note:** Generate test passwords securely and hash them using bcrypt (cost: 10-12).

**Next Steps:**
1. Implement seed scripts in backend
2. Add seed npm script to package.json
3. Generate realistic data images
4. Test seed data completeness
