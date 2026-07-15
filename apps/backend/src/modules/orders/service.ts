import { BadRequestError } from '../../core/errors/bad-request-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { ordersRepository } from './repository';
import type { CreateOrderInput, UpdateOrderStatusInput } from './schemas';

type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof ordersRepository.findByIdAndUserId>>
>;

function toMoney(value: number) {
  return value.toFixed(2);
}

function calculateShipping(subtotal: number, state: string) {
  if (subtotal >= 300) {
    return 0;
  }

  if (state === 'SP') {
    return 15;
  }

  if (['RJ', 'MG', 'PR'].includes(state)) {
    return 25;
  }

  return 40;
}

function formatOrder(order: OrderWithDetails) {
  return {
    id: order.id,
    userId: order.userId,
    addressId: order.addressId,
    status: order.status,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    total: Number(order.total),
    address: {
      id: order.address.id,
      recipient: order.address.recipient,
      zipCode: order.address.zipCode,
      street: order.address.street,
      number: order.address.number,
      complement: order.address.complement,
      neighborhood: order.address.neighborhood,
      city: order.address.city,
      state: order.address.state,
      country: order.address.country,
    },
    items: order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export const ordersService = {
  async create(userId: string, data: CreateOrderInput) {
    const address = await ordersRepository.findAddressByIdAndUserId(
      data.addressId,
      userId
    );

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    const cart = await ordersRepository.findCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    for (const item of cart.items) {
      if (!item.product.active) {
        throw new BadRequestError(`Product ${item.product.name} is not active`);
      }

      if (item.quantity > item.product.stock) {
        throw new BadRequestError(
          `Requested quantity exceeds available stock for product ${item.product.name}`
        );
      }
    }

    const orderItems = cart.items.map(item => {
      const unitPrice = Number(item.product.price);
      const subtotal = unitPrice * item.quantity;

      return {
        productId: item.productId,
        productName: item.product.name,
        unitPrice: toMoney(unitPrice),
        quantity: item.quantity,
        subtotal: toMoney(subtotal),
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    const shipping = calculateShipping(subtotal, address.state);
    const total = subtotal + shipping;

    const order = await ordersRepository.createFromCart({
      cartId: cart.id,
      userId,
      addressId: address.id,
      subtotal: toMoney(subtotal),
      shipping: toMoney(shipping),
      total: toMoney(total),
      items: orderItems,
    });

    return formatOrder(order);
  },

  async listMine(userId: string) {
    const orders = await ordersRepository.findManyByUserId(userId);

    return orders.map(formatOrder);
  },

  async getMine(userId: string, orderId: string) {
    const order = await ordersRepository.findByIdAndUserId(orderId, userId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return formatOrder(order);
  },

  async listAdmin() {
    const orders = await ordersRepository.findManyAdmin();

    return orders.map(order => ({
      ...formatOrder(order),
      user: order.user,
    }));
  },

  async updateStatus(orderId: string, data: UpdateOrderStatusInput) {
    const order = await ordersRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const updatedOrder = await ordersRepository.updateStatus(orderId, data.status);

    return formatOrder(updatedOrder);
  },
};