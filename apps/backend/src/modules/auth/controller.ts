import type { RequestHandler } from 'express';

import { authService } from './service';
import type { LoginInput } from './schemas';

const login: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as LoginInput;

    const result = await authService.login(data);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};