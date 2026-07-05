import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { env } from '../../config/env';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { usersRepository } from '../users/repository';
import type { LoginInput } from './schemas';

const ACCESS_TOKEN_EXPIRES_IN = '1d';

export const authService = {
  async login(data: LoginInput) {
    const user = await usersRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await compare(data.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = sign(
      {
        role: user.role,
      },
      env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};