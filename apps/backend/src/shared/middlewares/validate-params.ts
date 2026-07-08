import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validateParams = (schema: ZodTypeAny): RequestHandler => {
    return (request, response, next) => {
        const result = schema.safeParse(request.params);

        if (!result.success) {
            response.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Validation error',
                issues: result.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            });

            return;
        }

        request.validatedParams = result.data;

        next();
    };
};