import { prisma } from '../../db/prisma.js';
export const subjectsRepository = {
    async findAll() {
        return prisma.subject.findMany({
            where: { deletedAt: null },
            include: { teacher: true },
        });
    },
    async findById(id) {
        return prisma.subject.findFirst({
            where: { id, deletedAt: null },
            include: { teacher: true },
        });
    },
    async findByCode(code) {
        return prisma.subject.findFirst({
            where: { code, deletedAt: null },
        });
    },
    async create(data) {
        return prisma.subject.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                credits: data.credits,
                teacherId: data.teacherId || null,
            },
        });
    },
    async update(id, data) {
        return prisma.subject.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                credits: data.credits,
                teacherId: data.teacherId === undefined ? undefined : (data.teacherId || null),
            },
        });
    },
    async delete(id) {
        return prisma.subject.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
