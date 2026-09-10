import { z } from 'zod';

export const createCategorySchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, 'Name must have at least 2 characters')
			.max(100, 'Name must have at most 100 characters'),

		slug: z
			.string()
			.trim()
			.min(2, 'Slug must have at least 2 characters')
			.max(100, 'Slug must have at most 100 characters')
			.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),

		description: z
			.string()
			.trim()
			.max(500, 'Description must have at most 500 characters')
			.optional()
			.nullable(),
	})
	.strict();

export const updateCategorySchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, 'Name must have at least 2 characters')
			.max(100, 'Name must have at most 100 characters')
			.optional(),

		slug: z
			.string()
			.trim()
			.min(2, 'Slug must have at least 2 characters')
			.max(100, 'Slug must have at most 100 characters')
			.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
			.optional(),

		description: z
			.string()
			.trim()
			.max(500, 'Description must have at most 500 characters')
			.optional()
			.nullable(),
	})
	.strict()
	.refine(data => Object.keys(data).length > 0, {
		message: 'At least one field must be provided',
	});

export const categoryParamsSchema = z.object({
	id: z.string().uuid('Invalid category id'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
