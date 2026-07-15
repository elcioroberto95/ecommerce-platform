import { BadRequestError } from '../../core/errors/bad-request-error';
import { prisma } from '../../shared/database/prisma';
import type { UpdateOrderStatusInput } from './schemas';

type CreateOrderItemData = {
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  subtotal: string;
};

type CreateOrderFromCartData = {
  cartId: string;
  userId: string;
  addressId: string;
  subtotal: string;
  shipping: string;
  total: string;
  items: CreateOrderItemData[];
};

const orderInclude = {
  address: true,
  items: {
    orderBy: {
      createdAt: 'asc',
    },
  },
} as const;

export const ordersRepository = {
  findAddressByIdAndUserId(addressId: string, userId: string) {
    return prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
        active: true,
      },
    });
  },

  findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  },

  createFromCart(data: CreateOrderFromCartData) {
    return prisma.$transaction(async tx => {
      for (const item of data.items) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            active: true,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new BadRequestError(
            `Insufficient stock for product ${item.productName}`
          );
        }
      }

      const order = await tx.order.create({
        data: {
          userId: data.userId,
          addressId: data.addressId,
          subtotal: data.subtotal,
          shipping: data.shipping,
          total: data.total,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: data.cartId,
        },
      });

      return order;
    });
  },

  findManyByUserId(userId: string) {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: orderInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findByIdAndUserId(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: orderInclude,
    });
  },

  findManyAdmin() {
    return prisma.order.findMany({
      include: {
        ...orderInclude,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findById(orderId: string) {
    return prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: orderInclude,
    });
  },

  updateStatus(orderId: string, status: UpdateOrderStatusInput['status']) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: orderInclude,
    });
  },
};