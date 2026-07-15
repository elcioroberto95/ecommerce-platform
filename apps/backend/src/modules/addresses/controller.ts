import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { addressesService } from './service';
import type {
  AddressParams,
  CreateAddressInput,
  UpdateAddressInput,
} from './schemas';

const list: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const addresses = await addressesService.list(request.user.id);

    response.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

const create: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const data = request.body as CreateAddressInput;

    const address = await addressesService.create(request.user.id, data);

    response.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

const update: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const { addressId } = request.validatedParams as AddressParams;
    const data = request.body as UpdateAddressInput;

    const address = await addressesService.update(
      request.user.id,
      addressId,
      data
    );

    response.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

const remove: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) {
      throw new UnauthorizedError('Missing authenticated user');
    }

    const { addressId } = request.validatedParams as AddressParams;

    await addressesService.remove(request.user.id, addressId);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addressesController = {
  list,
  create,
  update,
  remove,
};