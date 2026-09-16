import { NextFunction, Request, Response } from 'express';
import { HealthService } from './service';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  execute = (_: Request, res: Response) => {
    return res.json(this.healthService.execute());
  };

  ready = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const { healthy, body } = await this.healthService.ready();

      // 503 tells an orchestrator to hold traffic back without killing the task.
      return res.status(healthy ? 200 : 503).json(body);
    } catch (error) {
      next(error);
    }
  };
}
