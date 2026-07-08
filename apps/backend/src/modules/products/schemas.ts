import { z } from 'zod';

export const createProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Name must have at least 2 characters')
            .max(120, 'Name must have at most 120 characters'),

        description: z
            .string()
            .trim()
            .max(1000, 'Description must have at most 1000 characters')
            .optional()
            .nullable(),

        price: z.coerce.number().positive('Price must be greater than zero'),

        stock: z.coerce
            .number()
            .int('Stock must be an integer')
            .min(0, 'Stock must be greater than or equal to zero')
            .default(0),
    })
    .strict();

export const updateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Name must have at least 2 characters')
            .max(120, 'Name must have at most 120 characters')
            .optional(),

        description: z
            .string()
            .trim()
            .max(1000, 'Description must have at most 1000 characters')
            .optional()
            .nullable(),

        price: z.coerce.number().positive('Price must be greater than zero').optional(),

        stock: z.coerce
            .number()
            .int('Stock must be an integer')
            .min(0, 'Stock must be greater than or equal to zero')
            .optional(),
    })
    .strict()
    .refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided',
    });

export const listProductsQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .optional()
        .transform(value => (value ? value : undefined)),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const productParamsSchema = z.object({
    id: z.string().uuid('Invalid product id'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;


export type ProductParams = z.infer<typeof productParamsSchema>;