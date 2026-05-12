import { prisma } from '../../db/prisma.js';
export const attendanceRepository = {
    async findByClassAndDate(classId, date, subjectId) {
        const d = new Date(date);
        return prisma.attendance.findMany({
            where: {
                classId,
                subjectId: subjectId || undefined,
                date: {
                    gte: new Date(d.setHours(0, 0, 0, 0)),
                    lte: new Date(d.setHours(23, 59, 59, 999))
                },
                deletedAt: null
            },
            include: { student: { include: { user: true } } },
        });
    },
    async upsertMany(classId, subjectId, date, records, recordedById) {
        const d = new Date(date);
        const attendanceDate = new Date(d.setHours(0, 0, 0, 0));
        return prisma.$transaction(records.map(r => {
            const whereCondition = subjectId
                ? {
                    studentId_classId_subjectId_date: {
                        studentId: r.studentId,
                        classId,
                        subjectId,
                        date: attendanceDate,
                    }
                }
                : {
                    studentId_classId_subjectId_date: {
                        studentId: r.studentId,
                        classId,
                        subjectId: '',
                        date: attendanceDate,
                    }
                };
            return prisma.attendance.upsert({
                where: whereCondition,
                update: {
                    status: r.status,
                    notes: r.notes,
                    recordedById,
                    updatedAt: new Date()
                },
                create: {
                    studentId: r.studentId,
                    classId,
                    subjectId,
                    date: attendanceDate,
                    status: r.status,
                    notes: r.notes || null,
                    recordedById,
                }
            });
        }));
    },
    async getClassesByTeacher(teacherId) {
        return prisma.class.findMany({
            where: { homeroomTeacherId: teacherId, deletedAt: null },
        });
    },
    async getAllClasses() {
        return prisma.class.findMany({ where: { deletedAt: null } });
    }
};
