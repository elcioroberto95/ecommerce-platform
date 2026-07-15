import { prisma } from '../../shared/database/prisma';

type CreateAddressData = {
  userId: string;
  label?: string | null;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

type UpdateAddressData = Partial<Omit<CreateAddressData, 'userId'>>;

const addressSelect = {
  id: true,
  userId: true,
  label: true,
  recipient: true,
  zipCode: true,
  street: true,
  number: true,
  complement: true,
  neighborhood: true,
  city: true,
  state: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const addressesRepository = {
  findManyByUserId(userId: string) {
    return prisma.address.findMany({
      where: {
        userId,
        active: true,
      },
      select: addressSelect,
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  },

  findByIdAndUserId(id: string, userId: string) {
    return prisma.address.findFirst({
      where: {
        id,
        userId,
        active: true,
      },
      select: addressSelect,
    });
  },

  countActiveByUserId(userId: string) {
    return prisma.address.count({
      where: {
        userId,
        active: true,
      },
    });
  },

  create(data: CreateAddressData) {
    return prisma.address.create({
      data,
      select: addressSelect,
    });
  },

  updateById(id: string, data: UpdateAddressData) {
    return prisma.address.update({
      where: {
        id,
      },
      data,
      select: addressSelect,
    });
  },

  unsetDefaultAddresses(userId: string) {
    return prisma.address.updateMany({
      where: {
        userId,
        active: true,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  },

  softDeleteById(id: string) {
    return prisma.address.update({
      where: {
        id,
      },
      data: {
        active: false,
        isDefault: false,
      },
      select: addressSelect,
    });
  },

  findFirstActiveByUserId(userId: string) {
    return prisma.address.findFirst({
      where: {
        userId,
        active: true,
      },
      select: addressSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
};