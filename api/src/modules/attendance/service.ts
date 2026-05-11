import { attendanceRepository } from './repository.js';
import { prisma } from '../../db/prisma.js';
import { ForbiddenError, NotFoundError } from '../../shared/errors/index.js';
import { RoleName } from '@prisma/client';

export const attendanceService = {
  async getAttendanceByDate(classId: string, dateStr: string) {
    const date = new Date(dateStr);
    return attendanceRepository.findByClassAndDate(classId, date);
  },

  async markAttendance(input: any, user: any) {
    const { classId, date: dateStr, records } = input;
    const date = new Date(dateStr);

    // RBAC: Admin can do anything
    if (!user.roles.includes(RoleName.ADMIN)) {
      if (!user.roles.includes(RoleName.TEACHER)) {
        throw new ForbiddenError('Only teachers or admins can mark attendance');
      }

      // Find teacher profile for this user
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher) throw new ForbiddenError('Teacher profile not found');

      // Check if teacher teaches this class
      const targetClass = await prisma.class.findUnique({ where: { id: classId } });
      if (!targetClass) throw new NotFoundError('Class');

      if (targetClass.homeroomTeacherId !== teacher.id) {
        throw new ForbiddenError('You can only mark attendance for your own class');
      }
    }

    return attendanceRepository.upsertMany(classId, date, records, user.id);
  },

  async getClasses(user: any) {
    if (user.roles.includes(RoleName.ADMIN)) {
      return attendanceRepository.getAllClasses();
    }
    
    const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (!teacher) return [];
    
    return attendanceRepository.getClassesByTeacher(teacher.id);
  },
  
  async getStudents(classId: string) {
    const enrollments = await prisma.enrollment.findMany({
        where: { classId, deletedAt: null },
        include: { student: { include: { user: true } } }
    });
    return enrollments.map(e => e.student);
  }
};
