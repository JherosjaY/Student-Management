import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';

// Note: In JS, we'll use string literals for role names instead of enum
const RoleName = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER', 
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  STAFF: 'STAFF'
};

const userWithRolesInclude = {
  userRoles: { include: { role: true } },
};

const buildWhere = (filters) => {
  const where = { deletedAt: null };

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
    filters,
    orderBy,
    skip,
    take,
  ) => {
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

  findById: (id) => {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: userWithRolesInclude,
    });
  },

  findByEmail: (email) => {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase(), deletedAt: null },
      include: userWithRolesInclude,
    });
  },

  create: async (data) => {
    return prisma.user.create({
      data: { ...data, email: data.email.toLowerCase() },
      include: userWithRolesInclude,
    });
  },

  update: async (
    id,
    data,
  ) => {
    const updateData = { ...data };
    if (updateData.email !== undefined) {
      updateData.email = updateData.email.toLowerCase();
    }
    return prisma.user.update({
      where: { id, deletedAt: null },
      data: updateData,
      include: userWithRolesInclude,
    });
  },

  softDelete: async (id) => {
    await prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  updateLastLogin: async (id) => {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },

  addRole: async (userId, roleName) => {
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

  removeRole: async (userId, roleName) => {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (role === null) {
      throw new Error(`Role "${roleName}" not found`);
    }
    await prisma.userRole.deleteMany({
      where: { userId, roleId: role.id },
    });
  },

  // Profile helpers
  findStudentProfile: (userId) => {
    return prisma.student.findUnique({ where: { userId } });
  },

  findTeacherProfile: (userId) => {
    return prisma.teacher.findUnique({ where: { userId } });
  },

  createStudentProfile: (data) => {
    return prisma.student.create({ data });
  },

  createTeacherProfile: (data) => {
    return prisma.teacher.create({ data });
  },
};