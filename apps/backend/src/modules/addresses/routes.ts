import { Router } from 'express';

import { authenticate } from '../../shared/middlewares/authenticate';
import { validateBody } from '../../shared/middlewares/validate-body';
import { validateParams } from '../../shared/middlewares/validate-params';
import { addressesController } from './controller';
import {
    addressParamsSchema,
    createAddressSchema,
    updateAddressSchema,
} from './schemas';

const addressesRoutes = Router();

addressesRoutes.get(
    '/users/me/addresses',
    authenticate,
    addressesController.list
);

addressesRoutes.post(
    '/users/me/addresses',
    authenticate,
    validateBody(createAddressSchema),
    addressesController.create
);

addressesRoutes.patch(
    '/users/me/addresses/:addressId',
    authenticate,
    validateParams(addressParamsSchema),
    validateBody(updateAddressSchema),
    addressesController.update
);

addressesRoutes.delete(
    '/users/me/addresses/:addressId',
    authenticate,
    validateParams(addressParamsSchema),
    addressesController.remove
);

export default addressesRoutes;