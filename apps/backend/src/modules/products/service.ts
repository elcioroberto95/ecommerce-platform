import { NotFoundError } from '../../core/errors/not-found-error';
import { productsRepository } from './repository';
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from './schemas';

function formatProduct<T extends { price: unknown }>(product: T) {
  return {
    ...product,
    price: Number(product.price),
  };
}

export const productsService = {
  async create(data: CreateProductInput) {
    const product = await productsRepository.create(data);

    return formatProduct(product);
  },

  async list(query: ListProductsQuery) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const result = await productsRepository.findMany({
      search: query.search,
      skip,
      take: limit,
    });

    return {
      items: result.items.map(formatProduct),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  },

  async getById(id: string) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return formatProduct(product);
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await productsRepository.updateById(id, data);

    return formatProduct(updatedProduct);
  },

  async remove(id: string) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const removedProduct = await productsRepository.removeById(id);

    return formatProduct(removedProduct);
  },
};