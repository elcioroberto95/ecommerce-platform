import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/app-error';
import { logger } from '../../core/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.headers['x-request-id'];

  if (error instanceof AppError) {
    logger.warn(
      {
        err: {
          name: error.name,
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
        requestId,
        path: req.originalUrl,
        method: req.method,
      },
      error.message
    );

    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }

  logger.error(
    {
      err: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      requestId,
      path: req.originalUrl,
      method: req.method,
    },
    'Unhandled application error'
  );

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
  });
}