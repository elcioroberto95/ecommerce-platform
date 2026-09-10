import { Router } from 'express';
import { HealthController } from './controller';
import { HealthService } from './service';

const router = Router();
const service = new HealthService();
const controller = new HealthController(service);

// Mounted under API_PREFIX, like every other module: /api/v1/health.
router.get('/health', controller.execute);
router.get('/health/ready', controller.ready);

export default router;
