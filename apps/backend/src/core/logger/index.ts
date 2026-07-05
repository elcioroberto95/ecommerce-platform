import pino from 'pino';
import { env } from '../../config/env';

const isDevelopment = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test';

export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL ?? 'info',

  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  formatters: {
    level: label => {
      return { level: label };
    },
  },

  base: {
    service: 'ecommerce-backend',
    env: env.NODE_ENV,
  },

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',

      'request.headers.authorization',
      'request.headers.cookie',

      'body.password',
      'body.passwordConfirmation',
      'body.token',
      'body.accessToken',
      'body.refreshToken',

      'req.body.password',
      'req.body.passwordConfirmation',
      'req.body.token',
      'req.body.accessToken',
      'req.body.refreshToken',

      'password',
      'token',
      'accessToken',
      'refreshToken',
    ],
    censor: '[REDACTED]',
  },
});