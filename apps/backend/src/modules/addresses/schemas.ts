import { z } from 'zod';

export const createAddressSchema = z
    .object({
        label: z
            .string()
            .trim()
            .max(50, 'Label must have at most 50 characters')
            .optional()
            .nullable(),

        recipient: z
            .string()
            .trim()
            .min(2, 'Recipient must have at least 2 characters')
            .max(100, 'Recipient must have at most 100 characters'),

        zipCode: z
            .string()
            .trim()
            .min(8, 'Zip code must have at least 8 characters')
            .max(9, 'Zip code must have at most 9 characters')
            .transform(value => value.replace(/\D/g, '')),

        street: z
            .string()
            .trim()
            .min(2, 'Street must have at least 2 characters')
            .max(150, 'Street must have at most 150 characters'),

        number: z
            .string()
            .trim()
            .min(1, 'Number is required')
            .max(20, 'Number must have at most 20 characters'),

        complement: z
            .string()
            .trim()
            .max(100, 'Complement must have at most 100 characters')
            .optional()
            .nullable(),

        neighborhood: z
            .string()
            .trim()
            .min(2, 'Neighborhood must have at least 2 characters')
            .max(100, 'Neighborhood must have at most 100 characters'),

        city: z
            .string()
            .trim()
            .min(2, 'City must have at least 2 characters')
            .max(100, 'City must have at most 100 characters'),

        state: z
            .string()
            .trim()
            .length(2, 'State must have exactly 2 characters')
            .transform(value => value.toUpperCase()),

        country: z
            .string()
            .trim()
            .length(2, 'Country must have exactly 2 characters')
            .transform(value => value.toUpperCase())
            .default('BR'),

        isDefault: z.boolean().optional().default(false),
    })
    .strict();

export const updateAddressSchema = z
    .object({
        label: z
            .string()
            .trim()
            .max(50, 'Label must have at most 50 characters')
            .optional()
            .nullable(),

        recipient: z
            .string()
            .trim()
            .min(2, 'Recipient must have at least 2 characters')
            .max(100, 'Recipient must have at most 100 characters')
            .optional(),

        zipCode: z
            .string()
            .trim()
            .min(8, 'Zip code must have at least 8 characters')
            .max(9, 'Zip code must have at most 9 characters')
            .transform(value => value.replace(/\D/g, ''))
            .optional(),

        street: z
            .string()
            .trim()
            .min(2, 'Street must have at least 2 characters')
            .max(150, 'Street must have at most 150 characters')
            .optional(),

        number: z
            .string()
            .trim()
            .min(1, 'Number is required')
            .max(20, 'Number must have at most 20 characters')
            .optional(),

        complement: z
            .string()
            .trim()
            .max(100, 'Complement must have at most 100 characters')
            .optional()
            .nullable(),

        neighborhood: z
            .string()
            .trim()
            .min(2, 'Neighborhood must have at least 2 characters')
            .max(100, 'Neighborhood must have at most 100 characters')
            .optional(),

        city: z
            .string()
            .trim()
            .min(2, 'City must have at least 2 characters')
            .max(100, 'City must have at most 100 characters')
            .optional(),

        state: z
            .string()
            .trim()
            .length(2, 'State must have exactly 2 characters')
            .transform(value => value.toUpperCase())
            .optional(),

        country: z
            .string()
            .trim()
            .length(2, 'Country must have exactly 2 characters')
            .transform(value => value.toUpperCase())
            .optional(),

        isDefault: z.boolean().optional(),
    })
    .strict()
    .refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided',
    });

export const addressParamsSchema = z.object({
    addressId: z.string().uuid('Invalid address id'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressParams = z.infer<typeof addressParamsSchema>;