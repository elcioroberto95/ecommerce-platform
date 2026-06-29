import { Request, Response } from 'express';
import { HealthService } from './service';

export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) {}

  execute = (_: Request, res: Response) => {
    return res.json(this.healthService.execute());
  };
}