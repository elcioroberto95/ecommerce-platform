import { hash } from 'bcryptjs';

import { ConflictError } from '../../core/errors/conflict-error';
import { usersRepository } from './repository';
import type { CreateUserInput } from './schemas';

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
};