import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { authorizeRoles } from '../../shared/middlewares/authorize-roles';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateQuery } from '../../shared/middlewares/validate-query';
import { productsController } from './controller';
import {
    createProductSchema,
    listProductsQuerySchema,
    updateProductSchema,
} from './schemas';

const productsRoutes = Router();

productsRoutes.get(
    '/products',
    validateQuery(listProductsQuerySchema),
    productsController.list
);

productsRoutes.get('/products/:id', productsController.getById);

productsRoutes.post(
    '/products',
    authenticate,
    authorizeRoles('ADMIN'),
    validateBody(createProductSchema),
    productsController.create
);

productsRoutes.patch(
    '/products/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateBody(updateProductSchema),
    productsController.update
);

productsRoutes.delete(
    '/products/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    productsController.remove
);

export default productsRoutes;