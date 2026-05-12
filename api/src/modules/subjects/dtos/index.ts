import { z } from 'zod';

export const createSubjectSchema = z.object({
  code: z.string().trim().min(2).max(32),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().optional(),
  credits: z.number().int().positive().optional().nullable(),
  teacherId: z.string().uuid().optional().nullable(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
