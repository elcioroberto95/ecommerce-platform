import { BadRequestError } from '../../core/errors/bad-request-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { cartRepository } from './repository';
import type { AddCartItemInput, UpdateCartItemInput } from './schemas';

type CartWithItems = Awaited<ReturnType<typeof cartRepository.findOrCreateCart>>;

function formatCart(cart: CartWithItems) {
  const items = cart.items.map(item => {
    const price = Number(item.product.price);
    const subtotal = price * item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price,
        stock: item.product.stock,
        active: item.product.active,
      },
      subtotal,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      totalItems,
      total,
    },
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await cartRepository.findOrCreateCart(userId);

    return formatCart(cart);
  },

  async addItem(userId: string, data: AddCartItemInput) {
    const product = await cartRepository.findProductById(data.productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const cart = await cartRepository.findOrCreateCart(userId);

    const existingItem = await cartRepository.findCartItem(cart.id, data.productId);

    const newQuantity = existingItem
      ? existingItem.quantity + data.quantity
      : data.quantity;

    if (newQuantity > product.stock) {
      throw new BadRequestError('Requested quantity exceeds available stock');
    }

    if (existingItem) {
      await cartRepository.updateCartItem(cart.id, data.productId, newQuantity);
    } else {
      await cartRepository.createCartItem({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      });
    }

    const updatedCart = await cartRepository.findOrCreateCart(userId);

    return formatCart(updatedCart);
  },

  async updateItem(
    userId: string,
    productId: string,
    data: UpdateCartItemInput
  ) {
    const product = await cartRepository.findProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (data.quantity > product.stock) {
      throw new BadRequestError('Requested quantity exceeds available stock');
    }

    const cart = await cartRepository.findOrCreateCart(userId);

    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (!existingItem) {
      throw new NotFoundError('Cart item not found');
    }

    await cartRepository.updateCartItem(cart.id, productId, data.quantity);

    const updatedCart = await cartRepository.findOrCreateCart(userId);

    return formatCart(updatedCart);
  },

  async removeItem(userId: string, productId: string) {
    const cart = await cartRepository.findOrCreateCart(userId);

    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (!existingItem) {
      throw new NotFoundError('Cart item not found');
    }

    await cartRepository.removeCartItem(cart.id, productId);

    const updatedCart = await cartRepository.findOrCreateCart(userId);

    return formatCart(updatedCart);
  },

  async clearCart(userId: string) {
    const cart = await cartRepository.findOrCreateCart(userId);

    await cartRepository.clearCart(cart.id);

    const updatedCart = await cartRepository.findOrCreateCart(userId);

    return formatCart(updatedCart);
  },
};