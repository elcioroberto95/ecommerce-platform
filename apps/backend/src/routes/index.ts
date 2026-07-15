import { Router } from 'express';
import { NotFoundError } from '../core/errors/not-found-error';
import { API_PREFIX } from '../shared/constants/api';
import healthRoutes from '../modules/health/routes';
import usersRoutes from '../modules/users/routes';
import authRoutes from '../modules/auth/routes';
import productsRoutes from '../modules/products/routes';
import cartRoutes from '../modules/cart/routes';
import addressesRoutes from '../modules/addresses/routes';
import ordersRoutes from '../modules/orders/routes';

const router = Router();

router.use(API_PREFIX, healthRoutes);
router.use(API_PREFIX, usersRoutes);
router.use(API_PREFIX, authRoutes);
router.use(API_PREFIX, productsRoutes);
router.use(API_PREFIX, cartRoutes);
router.use(API_PREFIX, addressesRoutes);
router.use(API_PREFIX, ordersRoutes);
router.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

export default router;