import { prisma } from '../../db/prisma.js';
export const authRepository = {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email, isActive: true },
        });
    },
    async findById(id) {
        return prisma.user.findUnique({
            where: { id, isActive: true },
        });
    },
    async createRefreshToken(userId, token) {
        return prisma.refreshToken.create({
            data: {
                tokenHash: token,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
    },
    async findRefreshToken(token) {
        return prisma.refreshToken.findUnique({
            where: { tokenHash: token },
            include: { user: true },
        });
    },
    async deleteRefreshToken(token) {
        await prisma.refreshToken.delete({
            where: { tokenHash: token },
        });
    },
    async deleteRefreshTokensByUserId(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    },
    async updatePassword(userId, hashedPassword) {
        return prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
        });
    },
    async updateLastLogin(userId) {
        return prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() },
        });
    },
};
