import { prisma } from '../../db/prisma.js';
import { NotFoundError } from '../../shared/errors/index.js';
import { logAuditEvent } from '../../shared/utils/audit.js';

export const userService = {
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { 
        userRoles: { include: { role: true } },
        studentProfile: true,
        teacherProfile: true
      }
    });
    if (!user) throw new NotFoundError('User');
    return user;
  },

  async update(id: string, data: any, actorId: string) {
    return prisma.$transaction(async (tx) => {
      const oldUser = await tx.user.findUnique({ where: { id } });
      if (!oldUser) throw new NotFoundError('User');

      const newUser = await tx.user.update({
        where: { id },
        data
      });

      // Log audit
      await logAuditEvent(tx, {
        actorId,
        entityType: 'User',
        entityId: id,
        action: 'UPDATE',
        diff: { 
            before: { firstName: oldUser.firstName, lastName: oldUser.lastName, email: oldUser.email },
            after: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email }
        }
      });

      return newUser;
    });
  },

  async getAuditLogs(userId: string) {
    return prisma.auditEvent.findMany({
      where: { entityType: 'User', entityId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }
};
