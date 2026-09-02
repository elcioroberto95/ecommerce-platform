import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../shared/database/prisma';

type CreateProductData = {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
};

type UpdateProductData = {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
};

type FindManyParams = {
  search?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  skip: number;
  take: number;
  orderBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'relevance';
};

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  categoryId: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const productsRepository = {
  create(data: CreateProductData) {
    return prisma.product.create({
      data,
      select: productSelect,
    });
  },

  async findMany({
    search,
    categoryId,
    priceMin,
    priceMax,
    inStock,
    skip,
    take,
    orderBy = 'relevance',
  }: FindManyParams) {
    const where: Prisma.ProductWhereInput = {
      active: true,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price = { ...where.price, gte: new Prisma.Decimal(priceMin) };
      }
      if (priceMax !== undefined) {
        where.price = { ...where.price, lte: new Prisma.Decimal(priceMax) };
      }
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (orderBy) {
      case 'price_asc':
        orderByClause = { price: 'asc' };
        break;
      case 'price_desc':
        orderByClause = { price: 'desc' };
        break;
      case 'newest':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'relevance':
      default:
        orderByClause = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: orderByClause,
        skip,
        take,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      items,
      total,
    };
  },

  findById(id: string) {
    return prisma.product.findFirst({
      where: {
        id,
        active: true,
      },
      select: productSelect,
    });
  },

  updateById(id: string, data: UpdateProductData) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
      select: productSelect,
    });
  },

  removeById(id: string) {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
      select: productSelect,
    });
  },

  async findRelated(productId: string, limit: number = 5) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        active: true,
      },
      select: {
        categoryId: true,
      },
    });

    if (!product || !product.categoryId) {
      return {
        items: [],
        total: 0,
      };
    }

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          active: true,
        },
        select: productSelect,
        take: limit,
      }),

      prisma.product.count({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          active: true,
        },
      }),
    ]);

    return {
      items,
      total,
    };
  },
};