import { Router } from 'express';

import { validateBody } from '../../shared/middlewares/validate-body';
import { authController } from './controller';
import { loginSchema } from './schemas';

const authRoutes = Router();

authRoutes.post('/auth/login', validateBody(loginSchema), authController.login);

export default authRoutes;