import type { RequestHandler } from 'express';
import { z } from 'zod';

export const validateBody = (schema: z.ZodTypeAny): RequestHandler => {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        message: 'Validation error',
        issues: result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    request.body = result.data;

    return next();
  };
};