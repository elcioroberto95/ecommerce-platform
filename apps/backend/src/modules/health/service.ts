import { uptime } from 'process';
import { env } from '../../config/env';

export class HealthService {
  execute() {
    return {
      status: 'ok',
      service: 'backend',
      environment: env.NODE_ENV,
      uptime: uptime(),
      timestamp: new Date().toISOString(),
    };
  }
} 