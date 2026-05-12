import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  roles: z.array(z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'])).default(['STUDENT']),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
  roles: z.array(z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'])).optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
});

export const createStudentProfileSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  gradeLevel: z.number().min(1).max(12),
  section: z.string().optional(),
});

export const createTeacherProfileSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().optional(),
  specialization: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type CreateStudentProfileDto = z.infer<typeof createStudentProfileSchema>;
export type CreateTeacherProfileDto = z.infer<typeof createTeacherProfileSchema>;
