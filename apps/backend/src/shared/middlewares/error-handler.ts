 
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/app-error';
import { logger } from '../../core/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Erro operacional (esperado)
  if (error instanceof AppError) {
    logger.warn(
      {
        err: {
          name: error.name,
          message: error.message,
          statusCode: error.statusCode,
        },
        path: req.path,
        method: req.method,
      },
      error.message
    );

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Erro de programação (bug)
  logger.error(
    {
      err: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      path: req.path,
      method: req.method,
    },
    'Internal Server Error'
  );

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}