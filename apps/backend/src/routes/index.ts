import { Router } from 'express';
import { NotFoundError } from '../core/errors/not-found-error';
import { API_PREFIX } from '../shared/constants/api';
import healthRoutes from '../modules/health/routes';

const router = Router();

router.use(API_PREFIX, healthRoutes);

router.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

export default router;