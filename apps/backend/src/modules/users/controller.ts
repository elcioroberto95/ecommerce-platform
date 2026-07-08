import type { RequestHandler } from 'express';

import { usersService } from './service';
import type { CreateUserInput, UpdateUserInput } from './schemas';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

const create: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as CreateUserInput;

    const user = await usersService.create(data);

    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const me: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const user = await usersService.getProfile(request.user.id);

    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const updateMe: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const data = request.body as UpdateUserInput;

    const user = await usersService.updateProfile(
      request.user.id,
      request.user.role,
      data
    );

    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const usersController = {
  create,
  me,
  updateMe
};