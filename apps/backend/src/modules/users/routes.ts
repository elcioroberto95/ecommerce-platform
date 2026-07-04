import { Router } from 'express';

import { validateBody } from '../../shared/middlewares/validate-body';
import { usersController } from './controller';
import { createUserSchema } from './schemas';

const usersRoutes = Router();

usersRoutes.post('/users', validateBody(createUserSchema), usersController.create);

export default usersRoutes;