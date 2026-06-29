import { Router } from 'express';

import healthRoutes from '../modules/health/routes';

const router = Router();

router.use(healthRoutes);

router.use((_, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

export default router;