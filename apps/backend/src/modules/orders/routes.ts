import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { ordersService } from './service';
import type {
    CreateOrderInput,
    OrderParams,
    UpdateOrderStatusInput,
} from './schemas';

const create: RequestHandler = async (request, response, next) => {
    try {
        if (!request.user) {
            throw new UnauthorizedError('Missing authenticated user');
        }

        const data = request.body as CreateOrderInput;

        const order = await ordersService.create(request.user.id, data);

        response.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const listMine: RequestHandler = async (request, response, next) => {
    try {
        if (!request.user) {
            throw new UnauthorizedError('Missing authenticated user');
        }

        const orders = await ordersService.listMine(request.user.id);

        response.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const getMine: RequestHandler = async (request, response, next) => {
    try {
        if (!request.user) {
            throw new UnauthorizedError('Missing authenticated user');
        }

        const { orderId } = request.validatedParams as OrderParams;

        const order = await ordersService.getMine(request.user.id, orderId);

        response.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

const listAdmin: RequestHandler = async (_request, response, next) => {
    try {
        const orders = await ordersService.listAdmin();

        response.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const updateStatus: RequestHandler = async (request, response, next) => {
    try {
        const { orderId } = request.validatedParams as OrderParams;
        const data = request.body as UpdateOrderStatusInput;

        const order = await ordersService.updateStatus(orderId, data);

        response.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const ordersController = {
    create,
    listMine,
    getMine,
    listAdmin,
    updateStatus,
};