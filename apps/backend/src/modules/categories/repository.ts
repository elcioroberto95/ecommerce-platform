import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../shared/database/prisma';

type CreateCategoryData = {
	name: string;
	slug: string;
	description?: string | null;
};

type UpdateCategoryData = {
	name?: string;
	slug?: string;
	description?: string | null;
};

const categorySelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	active: true,
	createdAt: true,
	updatedAt: true,
} as const;

export const categoriesRepository = {
	create(data: CreateCategoryData) {
		return prisma.category.create({
			data,
			select: categorySelect,
		});
	},

	async findMany() {
		return prisma.category.findMany({
			where: {
				active: true,
			},
			select: categorySelect,
			orderBy: {
				name: 'asc',
			},
		});
	},

	findById(id: string) {
		return prisma.category.findFirst({
			where: {
				id,
				active: true,
			},
			select: categorySelect,
		});
	},

	findBySlug(slug: string) {
		return prisma.category.findFirst({
			where: {
				slug,
				active: true,
			},
			select: categorySelect,
		});
	},

	updateById(id: string, data: UpdateCategoryData) {
		return prisma.category.update({
			where: {
				id,
			},
			data,
			select: categorySelect,
		});
	},

	removeById(id: string) {
		return prisma.category.update({
			where: {
				id,
			},
			data: {
				active: false,
			},
			select: categorySelect,
		});
	},
};
