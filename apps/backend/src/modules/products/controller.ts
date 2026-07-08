import type { RequestHandler } from 'express';

import { productsService } from './service';
import type {
  CreateProductInput,
  ListProductsQuery,
  ProductParams,
  UpdateProductInput,
} from './schemas';

const create: RequestHandler = async (request, response, next) => {
  try {
    const data = request.body as CreateProductInput;

    const product = await productsService.create(data);

    response.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const list: RequestHandler = async (request, response, next) => {
  try {
    const query = request.validatedQuery as ListProductsQuery;

    const result = await productsService.list(query);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler = async (request, response, next) => {
  try {
    const { id } = request.validatedParams as ProductParams;

    const product = await productsService.getById(id);

    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const update: RequestHandler = async (request, response, next) => {
  try {
    const { id } = request.validatedParams as ProductParams;
    const data = request.body as UpdateProductInput;

    const product = await productsService.update(id, data);

    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const remove: RequestHandler = async (request, response, next) => {
  try {
    const { id } = request.validatedParams as ProductParams;

    await productsService.remove(id);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const productsController = {
  create,
  list,
  getById,
  update,
  remove,
};