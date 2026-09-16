import { execute, queryOne, withTransaction } from '../../shared/database/pool';
import type { PasswordResetTokenRow } from '../../shared/database/rows';

type CreateTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export const passwordResetTokensRepository = {
  async create(data: CreateTokenData) {
    await execute(
      `INSERT INTO password_reset_tokens (id, "userId", "tokenHash", "expiresAt", "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, now())`,
      [data.userId, data.tokenHash, data.expiresAt]
    );
  },

  /** Drops every outstanding token for a user: requesting a new link voids the old ones. */
  deleteUnusedByUserId(userId: string) {
    return execute(
      'DELETE FROM password_reset_tokens WHERE "userId" = $1 AND "usedAt" IS NULL',
      [userId]
    );
  },

  /**
   * Applies the new password and burns the token in one transaction, so a
   * replayed link cannot set the password twice. Returns null when the token is
   * unknown, already used or expired.
   */
  consume(tokenHash: string, passwordHash: string) {
    return withTransaction(async client => {
      const token = await queryOne<PasswordResetTokenRow>(
        `SELECT * FROM password_reset_tokens
         WHERE "tokenHash" = $1 AND "usedAt" IS NULL AND "expiresAt" > now()
         FOR UPDATE`,
        [tokenHash],
        client
      );

      if (!token) {
        return null;
      }

      await execute(
        'UPDATE users SET password = $1, "updatedAt" = now() WHERE id = $2',
        [passwordHash, token.userId],
        client
      );

      await execute(
        'UPDATE password_reset_tokens SET "usedAt" = now() WHERE id = $1',
        [token.id],
        client
      );

      await execute(
        'DELETE FROM password_reset_tokens WHERE "userId" = $1 AND "usedAt" IS NULL',
        [token.userId],
        client
      );

      return token;
    });
  },
};
