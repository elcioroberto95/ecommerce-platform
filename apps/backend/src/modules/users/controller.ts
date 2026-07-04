import type { RequestHandler } from 'express';

import { usersService } from './service';
import type { CreateUserInput } from './schemas';

const create: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as CreateUserInput;

    const user = await usersService.create(data);

    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const usersController = {
  create,
};