import { Router } from 'express';

import { validateBody } from '../../shared/middlewares/validate-body';
import { authController } from './controller';
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './schemas';

const authRoutes = Router();

authRoutes.post('/auth/login', validateBody(loginSchema), authController.login);

authRoutes.post(
  '/auth/forgot-password',
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);

authRoutes.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

export default authRoutes;