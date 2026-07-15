import { z } from 'zod';

export const createOrderSchema = z
    .object({
        addressId: z.string().uuid('Invalid address id'),
    })
    .strict();

export const orderParamsSchema = z.object({
    orderId: z.string().uuid('Invalid order id'),
});

export const updateOrderStatusSchema = z
    .object({
        status: z.enum(['PENDING', 'PROCESSING', 'FINISHED', 'CANCELED']),
    })
    .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderParams = z.infer<typeof orderParamsSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;