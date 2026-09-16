import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email')
    .transform(email => email.toLowerCase()),

  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email')
    .transform(email => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, 'Token is required'),

  password: z
    .string()
    .min(6, 'Password must have at least 6 characters')
    .max(72, 'Password must have at most 72 characters'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
