import { uptime } from 'process';
import { env } from '../../config/env';

export class HealthService {
  execute() {
    return {
      status: 'ok',
      service: 'backend',
      environment: env.nodeEnv,
      uptime: uptime(),
      timestamp: new Date().toISOString(),
    };
  }
} 