import { prisma } from '../../db/prisma.js';
import { NotFoundError } from '../../shared/errors/index.js';
import { logAuditEvent } from '../../shared/utils/audit.js';
export const userService = {
    async getById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: { include: { role: true } },
                studentProfile: true,
                teacherProfile: true
            }
        });
        if (!user)
            throw new NotFoundError('User');
        return user;
    },
    async update(id, data, actorId) {
        return prisma.$transaction(async (tx) => {
            const oldUser = await tx.user.findUnique({ where: { id } });
            if (!oldUser)
                throw new NotFoundError('User');
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
    async getAuditLogs(userId) {
        return prisma.auditEvent.findMany({
            where: { entityType: 'User', entityId: userId },
            orderBy: { createdAt: 'desc' }
        });
    },
    async getAllAuditLogs() {
        return prisma.auditEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    },
    async findAllTeachers() {
        const teachers = await prisma.user.findMany({
            where: {
                teacherProfile: { isNot: null }
            },
            select: {
                firstName: true,
                lastName: true,
                teacherProfile: {
                    select: { id: true }
                }
            }
        });
        return teachers.map(t => ({
            id: t.teacherProfile?.id,
            firstName: t.firstName,
            lastName: t.lastName
        }));
    }
};
