import { prisma } from '../../db/prisma.js';

export const attendanceRepository = {
  async findByClassAndDate(classId: string, date: Date) {
    return prisma.attendance.findMany({
      where: { 
        classId, 
        date: {
          gte: new Date(date.setHours(0,0,0,0)),
          lte: new Date(date.setHours(23,59,59,999))
        },
        deletedAt: null 
      },
      include: { student: { include: { user: true } } },
    });
  },

  async upsertMany(classId: string, date: Date, records: any[], recordedById: string) {
    const attendanceDate = new Date(date.setHours(0, 0, 0, 0));
    
    // We use a manual loop instead of prisma.$transaction with array.map 
    // to ensure we can handle the sequence properly or use a real transaction.
    return prisma.$transaction(
      records.map(r => prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: r.studentId,
            classId,
            date: attendanceDate,
          }
        },
        update: { 
          status: r.status, 
          notes: r.notes, 
          recordedById,
          updatedAt: new Date()
        },
        create: {
          studentId: r.studentId,
          classId,
          date: attendanceDate,
          status: r.status,
          notes: r.notes || null,
          recordedById,
        }
      }))
    );
  },

  async getClassesByTeacher(teacherId: string) {
    return prisma.class.findMany({
      where: { homeroomTeacherId: teacherId, deletedAt: null },
    });
  },

  async getAllClasses() {
    return prisma.class.findMany({ where: { deletedAt: null } });
  }
};
