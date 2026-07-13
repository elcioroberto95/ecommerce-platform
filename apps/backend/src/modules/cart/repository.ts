import { prisma } from '../../shared/database/prisma';

type CreateCartItemData = {
  cartId: string;
  productId: string;
  quantity: number;
};

const cartInclude = {
  items: {
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  },
} as const;

export const cartRepository = {
  findProductById(productId: string) {
    return prisma.product.findFirst({
      where: {
        id: productId,
        active: true,
      },
    });
  },

  findOrCreateCart(userId: string) {
    return prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
      include: cartInclude,
    });
  },

  findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
  },

  createCartItem(data: CreateCartItemData) {
    return prisma.cartItem.create({
      data,
    });
  },

  updateCartItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: {
        quantity,
      },
    });
  },

  removeCartItem(cartId: string, productId: string) {
    return prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  },

  clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  },
};