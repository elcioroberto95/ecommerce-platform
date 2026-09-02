import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { categoriesRepository } from './repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './schemas';

export const categoriesService = {
	async create(data: CreateCategoryInput) {
		const existing = await categoriesRepository.findBySlug(data.slug);

		if (existing) {
			throw new ConflictError(`Category with slug "${data.slug}" already exists`);
		}

		return categoriesRepository.create(data);
	},

	async list() {
		return categoriesRepository.findMany();
	},

	async getById(id: string) {
		const category = await categoriesRepository.findById(id);

		if (!category) {
			throw new NotFoundError('Category not found');
		}

		return category;
	},

	async getBySlug(slug: string) {
		const category = await categoriesRepository.findBySlug(slug);

		if (!category) {
			throw new NotFoundError('Category not found');
		}

		return category;
	},

	async update(id: string, data: UpdateCategoryInput) {
		const category = await categoriesRepository.findById(id);

		if (!category) {
			throw new NotFoundError('Category not found');
		}

		if (data.slug && data.slug !== category.slug) {
			const existing = await categoriesRepository.findBySlug(data.slug);

			if (existing) {
				throw new ConflictError(`Category with slug "${data.slug}" already exists`);
			}
		}

		return categoriesRepository.updateById(id, data);
	},

	async remove(id: string) {
		const category = await categoriesRepository.findById(id);

		if (!category) {
			throw new NotFoundError('Category not found');
		}

		return categoriesRepository.removeById(id);
	},
};
