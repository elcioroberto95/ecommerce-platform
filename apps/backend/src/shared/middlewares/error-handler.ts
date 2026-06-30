import {  Request, Response } from 'express';
import { AppError } from '../../core/errors/app-error';

export function errorHandler(
  error: Error,
  _: Request,
  res: Response
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}