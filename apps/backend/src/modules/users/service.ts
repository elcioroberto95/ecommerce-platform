import { hash } from 'bcryptjs';
import { ForbiddenError } from '../../core/errors/forbidden-error';
import { ConflictError } from '../../core/errors/conflict-error';
import { usersRepository } from './repository';
import type { CreateUserInput, UpdateUserInput } from './schemas';
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
  async updateProfile(
    userId: string,
    userRole: 'CUSTOMER' | 'ADMIN',
    data: UpdateUserInput
  ) {
    const currentUser = await usersRepository.findById(userId);

    if (!currentUser) {
      throw new UnauthorizedError('Invalid authorization token');
    }

    if (data.email && userRole !== 'ADMIN') {
      throw new ForbiddenError('Only admins can update email');
    }

    if (data.email) {
      const userWithSameEmail = await usersRepository.findByEmail(data.email);

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await hash(data.password, PASSWORD_SALT_ROUNDS);
    }

    return usersRepository.updateById(userId, updateData);
  }
};