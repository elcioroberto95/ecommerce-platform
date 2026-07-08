import { Router } from 'express';

import { validateBody } from '../../shared/middlewares/validate-body';
import { usersController } from './controller';
import { createUserSchema, updateUserSchema } from './schemas';
import { authenticate } from '../../shared/middlewares/authenticate';

const usersRoutes = Router();

usersRoutes.post('/users', validateBody(createUserSchema), usersController.create);
usersRoutes.get('/users/me', authenticate, usersController.me);
usersRoutes.patch(
    '/users/me',
    authenticate,
    validateBody(updateUserSchema),
    usersController.updateMe
);
export default usersRoutes;