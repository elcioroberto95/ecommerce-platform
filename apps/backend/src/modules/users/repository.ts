import { prisma } from '../../shared/database/prisma';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

const userWithoutPasswordSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
  findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: userWithoutPasswordSelect,
    });
  },
  create(data: CreateUserData) {
    return prisma.user.create({
      data,
      select: userWithoutPasswordSelect,
    });
  },
};