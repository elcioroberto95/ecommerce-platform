import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { authorizeRoles } from '../../shared/middlewares/authorize-roles';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateParams } from '../../shared/middlewares/validate-params';
import { ordersController } from './controller';
import {
    createOrderSchema,
    orderParamsSchema,
    updateOrderStatusSchema,
} from './schemas';
import { validateQuery } from '../../shared/middlewares/validate-query';
import { paginationQuerySchema } from '../../shared/schemas/pagination';

const ordersRoutes = Router();

ordersRoutes.post(
    '/orders',
    authenticate,
    validateBody(createOrderSchema),
    ordersController.create
);

ordersRoutes.get('/orders', authenticate, validateQuery(paginationQuerySchema), ordersController.listMine);

ordersRoutes.get(
    '/orders/:orderId',
    authenticate,
    validateParams(orderParamsSchema),
    ordersController.getMine
);

ordersRoutes.get(
    '/admin/orders',
    authenticate,
    authorizeRoles('ADMIN'),
    validateQuery(paginationQuerySchema),
    ordersController.listAdmin
);

ordersRoutes.patch(
    '/admin/orders/:orderId/status',
    authenticate,
    authorizeRoles('ADMIN'),
    validateParams(orderParamsSchema),
    validateBody(updateOrderStatusSchema),
    ordersController.updateStatus
);

export default ordersRoutes;