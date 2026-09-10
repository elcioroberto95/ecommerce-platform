import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { authorizeRoles } from '../../shared/middlewares/authorize-roles';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateParams } from '../../shared/middlewares/validate-params';
import { validateQuery } from '../../shared/middlewares/validate-query';
import { productsController } from './controller';
import {
    createProductSchema,
    listProductsQuerySchema,
    productParamsSchema,
    relatedProductsQuerySchema,
    updateProductSchema,
} from './schemas';

const productsRoutes = Router();

productsRoutes.get(
    '/products',
    validateQuery(listProductsQuerySchema),
    productsController.list
);

// Every /products/:id* handler reads request.validatedParams, so the params
// validator is mandatory here. Without it the controllers throw on undefined.
productsRoutes.get(
    '/products/:id',
    validateParams(productParamsSchema),
    productsController.getById
);

productsRoutes.get(
    '/products/:id/related',
    validateParams(productParamsSchema),
    validateQuery(relatedProductsQuerySchema),
    productsController.getRelated
);

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
    validateParams(productParamsSchema),
    validateBody(updateProductSchema),
    productsController.update
);

productsRoutes.delete(
    '/products/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateParams(productParamsSchema),
    productsController.remove
);

export default productsRoutes;
