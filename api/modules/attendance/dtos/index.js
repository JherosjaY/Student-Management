import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';
export const markAttendanceSchema = z.object({
    classId: z.string().uuid(),
    subjectId: z.string().uuid().optional().nullable(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    records: z.array(z.object({
        studentId: z.string().uuid(),
        status: z.nativeEnum(AttendanceStatus),
        notes: z.string().optional().nullable(),
    })),
});
