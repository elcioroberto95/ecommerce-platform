import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Cleaning database...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
    },
  })

  const accessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Computer and mobile accessories',
    },
  })

  const home = await prisma.category.create({
    data: {
      name: 'Home',
      slug: 'home',
      description: 'Home and office products',
    },
  })

  // Create products
  console.log('📦 Creating products...')
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 199.99,
      stock: 25,
      categoryId: electronics.id,
    },
    {
      name: 'Smart Watch',
      description: 'Advanced fitness tracking smartwatch',
      price: 299.99,
      stock: 15,
      categoryId: electronics.id,
    },
    {
      name: 'Backpack Pro',
      description: 'Durable laptop backpack with multiple compartments',
      price: 89.99,
      stock: 40,
      categoryId: accessories.id,
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports',
      price: 49.99,
      stock: 60,
      categoryId: electronics.id,
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 59.99,
      stock: 30,
      categoryId: home.id,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with hot-swap switches',
      price: 149.99,
      stock: 0,
      categoryId: electronics.id,
    },
    {
      name: 'Webcam Pro',
      description: '4K webcam with auto-focus and noise cancellation',
      price: 129.99,
      stock: 20,
      categoryId: electronics.id,
    },
    {
      name: 'Mouse Wireless',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 39.99,
      stock: 50,
      categoryId: accessories.id,
    },
    {
      name: 'Monitor Stand',
      description: 'Adjustable monitor stand for better posture',
      price: 79.99,
      stock: 35,
      categoryId: home.id,
    },
    {
      name: 'Portable SSD',
      description: '1TB portable SSD with fast transfer speeds',
      price: 109.99,
      stock: 22,
      categoryId: electronics.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`
📊 Seed Summary:
  - Categories: 3 (Electronics, Accessories, Home)
  - Products: ${products.length}
  - Total stock value: $${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
