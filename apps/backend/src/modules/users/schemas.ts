import { z } from 'zod';

export const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name must have at most 100 characters'),

    email: z
        .string()
        .trim()
        .email('Invalid email')
        .transform(email => email.toLowerCase()),

    password: z
        .string()
        .min(6, 'Password must have at least 6 characters')
        .max(72, 'Password must have at most 72 characters'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;