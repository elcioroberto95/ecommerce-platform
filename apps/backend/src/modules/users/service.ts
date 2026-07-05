import { hash } from 'bcryptjs';

import { ConflictError } from '../../core/errors/conflict-error';
import { usersRepository } from './repository';
import type { CreateUserInput } from './schemas';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

const PASSWORD_SALT_ROUNDS = 10;

export const usersService = {
  async create(data: CreateUserInput) {
    const userAlreadyExists = await usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await hash(data.password, PASSWORD_SALT_ROUNDS);

    const user = await usersRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
    });

    return user;
  },
  async getProfile(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError('Invalid authorization token');
    }

    return user;
  },
};