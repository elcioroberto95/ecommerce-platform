import type { RequestHandler } from 'express';

import { categoriesService } from './service';
import type { CategoryParams, CreateCategoryInput, UpdateCategoryInput } from './schemas';
import type { PaginationQuery } from '../../shared/schemas/pagination';

const create: RequestHandler = async (request, response, next) => {
	try {
		const data = request.body as CreateCategoryInput;

		const category = await categoriesService.create(data);

		response.status(201).json(category);
	} catch (error) {
		next(error);
	}
};

const list: RequestHandler = async (request, response, next) => {
	try {
		const pagination = request.validatedQuery as PaginationQuery;

		const page = await categoriesService.list(pagination);

		response.status(200).json(page);
	} catch (error) {
		next(error);
	}
};

const getById: RequestHandler = async (request, response, next) => {
	try {
		const { id } = request.validatedParams as CategoryParams;

		const category = await categoriesService.getById(id);

		response.status(200).json(category);
	} catch (error) {
		next(error);
	}
};

const update: RequestHandler = async (request, response, next) => {
	try {
		const { id } = request.validatedParams as CategoryParams;
		const data = request.body as UpdateCategoryInput;

		const category = await categoriesService.update(id, data);

		response.status(200).json(category);
	} catch (error) {
		next(error);
	}
};

const remove: RequestHandler = async (request, response, next) => {
	try {
		const { id } = request.validatedParams as CategoryParams;

		const category = await categoriesService.remove(id);

		response.status(200).json(category);
	} catch (error) {
		next(error);
	}
};

export const categoriesController = {
	create,
	list,
	getById,
	update,
	remove,
};
