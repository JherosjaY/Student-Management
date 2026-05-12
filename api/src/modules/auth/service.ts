import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma.js';
import { ValidationError } from '../../shared/errors/index.js';
import { RoleName } from '@prisma/client';
import { logAuditEvent } from '../../shared/utils/audit.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';

export const register = async (input: any) => {
  const { email, password, firstName, lastName } = input;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ValidationError('Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      isActive: true,
    },
  });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      tokenHash: token,
      expiresAt,
    },
  });

  const verificationLink = `http://localhost:5173/verify-email?token=${token}&userId=${user.id}`;
  console.log('\n--- [LAB 1] EMAIL VERIFICATION ---');
  console.log(`User: ${email}`);
  console.log(`Link: ${verificationLink}`);
  console.log('----------------------------------\n');

  return { id: user.id, email: user.email };
};

export const verifyEmail = async (userId: string, token: string) => {
  const tUserId = userId.trim();
  const tToken = token.trim();

  // 1. Check if user is already verified
  const user = await prisma.user.findUnique({ where: { id: tUserId } });
  if (!user) throw new ValidationError('User not found');
  if (user.emailVerifiedAt) return { success: true, message: 'Already verified' };

  // 2. Find the token
  const storedToken = await prisma.verificationToken.findFirst({
    where: { 
      userId: tUserId, 
      tokenHash: tToken 
    },
  });

  if (!storedToken) throw new ValidationError('Invalid or expired token');
  if (storedToken.expiresAt < new Date()) throw new ValidationError('Token expired');

  // 3. Mark as verified, Assign Role, Create Profile and Enroll
  await prisma.$transaction(async (tx) => {
    // Verify User
    await tx.user.update({
      where: { id: tUserId },
      data: { emailVerifiedAt: new Date() },
    });

    // Assign STUDENT role (Upsert to avoid unique constraint error)
    const studentRole = await tx.role.findUniqueOrThrow({
      where: { name: RoleName.STUDENT }
    });

    await tx.userRole.upsert({
      where: { userId_roleId: { userId: tUserId, roleId: studentRole.id } },
      update: {},
      create: { userId: tUserId, roleId: studentRole.id }
    });

    // Create Student Profile (Upsert)
    const student = await tx.student.upsert({
      where: { userId: tUserId },
      update: {},
      create: {
        userId: tUserId,
        studentNumber: `S-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: new Date()
      }
    });

    // Auto-enroll in the first available class
    const defaultClass = await tx.class.findFirst({
        where: { name: 'Grade 10 - Algebra' }
    });

    if (defaultClass) {
      await tx.enrollment.upsert({
        where: { 
          studentId_classId_academicYear: { 
            studentId: student.id, 
            classId: defaultClass.id, 
            academicYear: defaultClass.academicYear 
          } 
        },
        update: { status: 'ACTIVE' },
        create: {
          studentId: student.id,
          classId: defaultClass.id,
          academicYear: defaultClass.academicYear,
          status: 'ACTIVE'
        }
      });
    }

    // Clean up tokens
    await tx.verificationToken.deleteMany({
      where: { userId: tUserId }
    });

    // Log Audit Event
    await logAuditEvent(tx, {
      actorId: tUserId,
      entityType: 'USER',
      entityId: tUserId,
      action: 'VERIFY_EMAIL',
      diff: { status: 'VERIFIED' }
    });
  });

  console.log(`[DEBUG] Success! User ${tUserId} verified.`);
  return { success: true };
};

export const login = async (input: any) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) throw new ValidationError('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new ValidationError('Invalid email or password');

  if (!user.emailVerifiedAt) {
    throw new ValidationError('Email not verified. Please check your console for the link.');
  }

  const roleNames = user.userRoles.map((ur) => ur.role.name);

  const token = jwt.sign(
    { userId: user.id, email: user.email, roles: roleNames },
    JWT_ACCESS_SECRET,
    { expiresIn: '24h' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: roleNames,
    },
    token,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If an account exists, a reset link has been sent.' };

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: token,
      expiresAt,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}&userId=${user.id}`;
  console.log('\n--- [LAB 5] PASSWORD RESET ---');
  console.log(`User: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log('------------------------------\n');

  return { message: 'Reset link sent to terminal' };
};

export const resetPassword = async (userId: string, token: string, newPassword: string) => {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { userId, tokenHash: token.trim() },
  });

  if (!resetToken) throw new ValidationError('Invalid or expired reset token');
  if (resetToken.expiresAt < new Date()) throw new ValidationError('Reset token expired');

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId },
    }),
  ]);

  return { success: true };
};
