import type { RequestHandler } from 'express';
import { verify, type JwtPayload } from 'jsonwebtoken';

import { env } from '../../config/env';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

type AccessTokenPayload = JwtPayload & {
  role?: 'CUSTOMER' | 'ADMIN';
};

export const authenticate: RequestHandler = (request, _response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Missing authorization token'));
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new UnauthorizedError('Invalid authorization token'));
  }

  try {
    const decoded = verify(token, env.JWT_SECRET);

    if (typeof decoded === 'string' || !decoded.sub) {
      return next(new UnauthorizedError('Invalid authorization token'));
    }

    const payload = decoded as AccessTokenPayload;

    if (payload.role !== 'CUSTOMER' && payload.role !== 'ADMIN') {
      return next(new UnauthorizedError('Invalid authorization token'));
    }

    request.user = {
      id: decoded.sub,
      role: payload.role,
    };

    return next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};