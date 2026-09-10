import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { authorizeRoles } from '../../shared/middlewares/authorize-roles';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateParams } from '../../shared/middlewares/validate-params';
import { validateQuery } from '../../shared/middlewares/validate-query';
import { paginationQuerySchema } from '../../shared/schemas/pagination';
import { categoriesController } from './controller';
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from './schemas';

const categoriesRoutes = Router();

categoriesRoutes.get('/categories', validateQuery(paginationQuerySchema), categoriesController.list);

categoriesRoutes.post(
	'/categories',
	authenticate,
	authorizeRoles('ADMIN'),
	validateBody(createCategorySchema),
	categoriesController.create
);

categoriesRoutes.get(
	'/categories/:id',
	validateParams(categoryParamsSchema),
	categoriesController.getById
);

categoriesRoutes.patch(
	'/categories/:id',
	authenticate,
	authorizeRoles('ADMIN'),
	validateParams(categoryParamsSchema),
	validateBody(updateCategorySchema),
	categoriesController.update
);

categoriesRoutes.delete(
	'/categories/:id',
	authenticate,
	authorizeRoles('ADMIN'),
	validateParams(categoryParamsSchema),
	categoriesController.remove
);

export default categoriesRoutes;
