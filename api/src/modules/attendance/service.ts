import { attendanceRepository } from './repository.js';
import { prisma } from '../../db/prisma.js';
import { ForbiddenError, NotFoundError } from '../../shared/errors/index.js';
import { RoleName } from '@prisma/client';
import { logAuditEvent } from '../../shared/utils/audit.js';

export const attendanceService = {
  async getAttendanceByDate(classId: string, dateStr: string, subjectId?: string) {
    const date = new Date(dateStr);
    return attendanceRepository.findByClassAndDate(classId, date, subjectId);
  },

  async markAttendance(input: any, user: any) {
    const { classId, subjectId, date: dateStr, records } = input;
    const date = new Date(dateStr);

    // RBAC: Admin can do anything
    if (!user.roles.includes(RoleName.ADMIN)) {
      if (!user.roles.includes(RoleName.TEACHER)) {
        throw new ForbiddenError('Only teachers or admins can mark attendance');
      }

      // Find teacher profile for this user
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher) throw new ForbiddenError('Teacher profile not found');

      // Check if teacher teaches this class OR this subject
      // To simplify, let's allow if they are the teacher assigned to the subject OR homeroom
      if (subjectId) {
          const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
          if (subject && subject.teacherId !== teacher.id) {
              // If not subject teacher, check homeroom
              const targetClass = await prisma.class.findUnique({ where: { id: classId } });
              if (!targetClass || targetClass.homeroomTeacherId !== teacher.id) {
                throw new ForbiddenError('You can only mark attendance for your own class or subject');
              }
          }
      }
    }

    const result = await attendanceRepository.upsertMany(classId, subjectId || null, date, records, user.id);

    // Log Audit Event
    await logAuditEvent(prisma, {
      actorId: user.id,
      entityType: 'ATTENDANCE',
      entityId: classId,
      action: 'MARK_ATTENDANCE',
      diff: { subjectId, date: dateStr, count: records.length }
    });

    return result;
  },

  async getClasses(user: any) {
    if (user.roles.includes(RoleName.ADMIN)) {
      return attendanceRepository.getAllClasses();
    }
    
    const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (!teacher) return [];
    
    return attendanceRepository.getClassesByTeacher(teacher.id);
  },

  async getSubjects() {
    return prisma.subject.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' }
    });
  },
  
  async getStudents(classId: string) {
    const enrollments = await prisma.enrollment.findMany({
        where: { classId, deletedAt: null },
        include: { student: { include: { user: true } } }
    });
    return enrollments.map(e => e.student);
  }
};
