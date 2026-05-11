import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma.js';
import { ValidationError } from '../../shared/errors/index.js';
export const register = async (input) => {
    const { email, password, firstName, lastName } = input;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new ValidationError('Email already registered');
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
export const verifyEmail = async (userId, token) => {
    const tUserId = userId.trim();
    const tToken = token.trim();
    // 1. Check if user is already verified
    const user = await prisma.user.findUnique({ where: { id: tUserId } });
    if (!user)
        throw new ValidationError('User not found');
    if (user.emailVerifiedAt)
        return { success: true, message: 'Already verified' };
    // 2. Find the token
    const storedToken = await prisma.verificationToken.findFirst({
        where: {
            userId: tUserId,
            tokenHash: tToken
        },
    });
    if (!storedToken)
        throw new ValidationError('Invalid or expired token');
    if (storedToken.expiresAt < new Date())
        throw new ValidationError('Token expired');
    // 3. Mark as verified
    await prisma.$transaction([
        prisma.user.update({
            where: { id: tUserId },
            data: { emailVerifiedAt: new Date() },
        }),
        prisma.verificationToken.delete({
            where: { id: storedToken.id }
        })
    ]);
    console.log(`[DEBUG] Success! User ${tUserId} verified.`);
    return { success: true };
};
