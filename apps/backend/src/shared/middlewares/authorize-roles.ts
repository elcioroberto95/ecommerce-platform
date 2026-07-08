import type { RequestHandler } from 'express';
import { ForbiddenError } from '../../core/errors/forbidden-error';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

type Role = 'CUSTOMER' | 'ADMIN';

export const authorizeRoles = (...allowedRoles: Role[]): RequestHandler => {
    return (request, _response, next) => {
        if (!request.user) {
            return next(new UnauthorizedError('Missing authenticated user'));
        }

        if (!allowedRoles.includes(request.user.role)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }

        return next();
    };
};