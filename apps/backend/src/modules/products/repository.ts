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
  skip: number;
  take: number;
};

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
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

  async findMany({ search, skip, take }: FindManyParams) {
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

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: {
          createdAt: 'desc',
        },
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
};