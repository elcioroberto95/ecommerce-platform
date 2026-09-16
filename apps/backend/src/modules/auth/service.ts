import { createHash, randomBytes } from 'node:crypto';

import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { env } from '../../config/env';
import { BadRequestError } from '../../core/errors/bad-request-error';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { logger } from '../../core/logger';
import { usersRepository } from '../users/repository';
import { passwordResetTokensRepository } from './repository';
import type { ForgotPasswordInput, LoginInput, ResetPasswordInput } from './schemas';

const ACCESS_TOKEN_EXPIRES_IN = '1d';
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const PASSWORD_SALT_ROUNDS = 10;

/** Only the hash is stored, so a leaked database cannot be used to reset passwords. */
function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

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

  /**
   * Always resolves the same way, whether or not the email exists: a different
   * response (or timing) would turn this endpoint into an account oracle.
   */
  async requestPasswordReset(data: ForgotPasswordInput) {
    const user = await usersRepository.findByEmail(data.email);

    if (!user) {
      logger.info({ email: data.email }, 'Password reset requested for unknown email');
      return;
    }

    const token = randomBytes(32).toString('hex');

    await passwordResetTokensRepository.deleteUnusedByUserId(user.id);
    await passwordResetTokensRepository.create({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    // There is no mail service yet, so the link goes to the log. Swap this for
    // the real sender when one exists - nothing else about the flow changes.
    logger.info(
      {
        userId: user.id,
        email: user.email,
        resetUrl: `${env.APP_URL}/auth/reset-password?token=${token}`,
      },
      'Password reset link generated'
    );
  },

  async resetPassword(data: ResetPasswordInput) {
    const passwordHash = await hash(data.password, PASSWORD_SALT_ROUNDS);
    const token = await passwordResetTokensRepository.consume(hashToken(data.token), passwordHash);

    if (!token) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    logger.info({ userId: token.userId }, 'Password reset completed');
  },
};