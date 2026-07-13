import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { cartService } from './service';
import type {
  AddCartItemInput,
  CartItemParams,
  UpdateCartItemInput,
} from './schemas';

const getCart: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const cart = await cartService.getCart(request.user.id);

    response.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const addItem: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const data = request.body as AddCartItemInput;

    const cart = await cartService.addItem(request.user.id, data);

    response.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateItem: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const { productId } = request.validatedParams as CartItemParams;
    const data = request.body as UpdateCartItemInput;

    const cart = await cartService.updateItem(request.user.id, productId, data);

    response.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const removeItem: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const { productId } = request.validatedParams as CartItemParams;

    const cart = await cartService.removeItem(request.user.id, productId);

    response.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const cart = await cartService.clearCart(request.user.id);

    response.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const cartController = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};