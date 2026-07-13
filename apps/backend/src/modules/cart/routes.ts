import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateParams } from '../../shared/middlewares/validate-params';
import { cartController } from './controller';
import {
    addCartItemSchema,
    cartItemParamsSchema,
    updateCartItemSchema,
} from './schemas';

const cartRoutes = Router();

cartRoutes.get('/cart', authenticate, cartController.getCart);

cartRoutes.post(
    '/cart/items',
    authenticate,
    validateBody(addCartItemSchema),
    cartController.addItem
);

cartRoutes.patch(
    '/cart/items/:productId',
    authenticate,
    validateParams(cartItemParamsSchema),
    validateBody(updateCartItemSchema),
    cartController.updateItem
);

cartRoutes.delete(
    '/cart/items/:productId',
    authenticate,
    validateParams(cartItemParamsSchema),
    cartController.removeItem
);

cartRoutes.delete('/cart', authenticate, cartController.clearCart);

export default cartRoutes;