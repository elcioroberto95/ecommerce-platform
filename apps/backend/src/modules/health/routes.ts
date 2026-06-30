import { Router } from 'express';
import { ROUTES } from '../../shared/constants/routes';
import { HealthController } from './controller';
import { HealthService } from './service';

const router = Router();
const service = new HealthService();
const controller = new HealthController(service);

router.get(ROUTES.HEALTH, controller.execute);

export default router;