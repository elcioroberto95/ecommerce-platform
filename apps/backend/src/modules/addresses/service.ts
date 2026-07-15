import { NotFoundError } from '../../core/errors/not-found-error';
import { addressesRepository } from './repository';
import type { CreateAddressInput, UpdateAddressInput } from './schemas';

export const addressesService = {
  async list(userId: string) {
    return addressesRepository.findManyByUserId(userId);
  },

  async create(userId: string, data: CreateAddressInput) {
    const totalAddresses = await addressesRepository.countActiveByUserId(userId);

    const shouldBeDefault = data.isDefault === true || totalAddresses === 0;

    if (shouldBeDefault) {
      await addressesRepository.unsetDefaultAddresses(userId);
    }

    return addressesRepository.create({
      userId,
      label: data.label,
      recipient: data.recipient,
      zipCode: data.zipCode,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
      isDefault: shouldBeDefault,
    });
  },

  async update(userId: string, addressId: string, data: UpdateAddressInput) {
    const address = await addressesRepository.findByIdAndUserId(addressId, userId);

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (data.isDefault === true) {
      await addressesRepository.unsetDefaultAddresses(userId);
    }

    return addressesRepository.updateById(addressId, data);
  },

  async remove(userId: string, addressId: string) {
    const address = await addressesRepository.findByIdAndUserId(addressId, userId);

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    await addressesRepository.softDeleteById(addressId);

    if (address.isDefault) {
      const nextDefaultAddress = await addressesRepository.findFirstActiveByUserId(userId);

      if (nextDefaultAddress) {
        await addressesRepository.updateById(nextDefaultAddress.id, {
          isDefault: true,
        });
      }
    }
  },
};