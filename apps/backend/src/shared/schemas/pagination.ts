import { z } from 'zod';

/**
 * Pagination shared by every list endpoint.
 *
 * Hard cap: no request can ask for more than MAX_PAGE_SIZE rows, whatever the
 * route. With millions of rows, an unbounded list is a way to take the API
 * down with a single request.
 */
export const MAX_PAGE_SIZE = 250;
export const DEFAULT_PAGE_SIZE = 20;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE, `limit must be at most ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}

export function toOffset({ page, limit }: PaginationQuery): number {
  return (page - 1) * limit;
}

export function buildPage<T>(items: T[], total: number, { page, limit }: PaginationQuery): Page<T> {
  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
