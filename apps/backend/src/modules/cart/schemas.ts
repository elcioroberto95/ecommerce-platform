import { z } from 'zod';

export const addCartItemSchema = z
    .object({
        productId: z.string().uuid('Invalid product id'),

        quantity: z.coerce
            .number()
            .int('Quantity must be an integer')
            .min(1, 'Quantity must be greater than zero'),
    })
    .strict();

export const updateCartItemSchema = z
    .object({
        quantity: z.coerce
            .number()
            .int('Quantity must be an integer')
            .min(1, 'Quantity must be greater than zero'),
    })
    .strict();

export const cartItemParamsSchema = z.object({
    productId: z.string().uuid('Invalid product id'),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;