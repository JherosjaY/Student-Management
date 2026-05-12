import { Prisma, type RoleName, type Student, type Teacher } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import type { UserWithRoles } from './types/index.js';

export interface UserListFilters {
  search?: string;
  role?: RoleName;
  isActive?: boolean;
}

export interface UserListOrderBy {
  field: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'lastLoginAt';
  direction: 'asc' | 'desc';
}

const userWithRolesInclude = {
  userRoles: { include: { role: true } },
} satisfies Prisma.UserInclude;

const buildWhere = (filters: UserListFilters): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = { deletedAt: null };

  if (filters.search !== undefined) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search.toLowerCase() } },
    ];
  }
  if (filters.role !== undefined) {
    where.userRoles = { some: { role: { name: filters.role } } };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  return where;
};

export const usersRepository = {
  list: async (
    filters: UserListFilters,
    orderBy: UserListOrderBy,
    skip: number,
    take: number,
  ): Promise<{ items: UserWithRoles[]; totalCount: number }> => {
    const where = buildWhere(filters);
    const [items, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: userWithRolesInclude,
        orderBy: { [orderBy.field]: orderBy.direction },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, totalCount };
  },

  findById: (id: string): Promise<UserWithRoles | null> => {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: userWithRolesInclude,
    });
  },

  findByEmail: (email: string): Promise<UserWithRoles | null> => {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase(), deletedAt: null },
      include: userWithRolesInclude,
    });
  },

  create: async (data: Prisma.UserCreateInput): Promise<UserWithRoles> => {
    return prisma.user.create({
      data: { ...data, email: data.email.toLowerCase() },
      include: userWithRolesInclude,
    });
  },

  update: async (
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserWithRoles> => {
    const updateData = { ...data };
    if (updateData.email !== undefined) {
      (updateData as any).email = (updateData.email as string).toLowerCase();
    }
    return prisma.user.update({
      where: { id, deletedAt: null },
      data: updateData,
      include: userWithRolesInclude,
    });
  },

  softDelete: async (id: string): Promise<void> => {
    await prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  updateLastLogin: async (id: string): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },

  addRole: async (userId: string, roleName: RoleName): Promise<void> => {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (role === null) {
      throw new Error(`Role "${roleName}" not found`);
    }
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      create: { userId, roleId: role.id },
      update: {},
    });
  },

  removeRole: async (userId: string, roleName: RoleName): Promise<void> => {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (role === null) {
      throw new Error(`Role "${roleName}" not found`);
    }
    await prisma.userRole.deleteMany({
      where: { userId, roleId: role.id },
    });
  },

  // Profile helpers
  findStudentProfile: (userId: string): Promise<Student | null> => {
    return prisma.student.findUnique({ where: { userId } });
  },

  findTeacherProfile: (userId: string): Promise<Teacher | null> => {
    return prisma.teacher.findUnique({ where: { userId } });
  },

  createStudentProfile: (data: Prisma.StudentCreateInput): Promise<Student> => {
    return prisma.student.create({ data });
  },

  createTeacherProfile: (data: Prisma.TeacherCreateInput): Promise<Teacher> => {
    return prisma.teacher.create({ data });
  },
};