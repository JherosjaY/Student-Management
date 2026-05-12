import { prisma } from '../../db/prisma.js';
import bcrypt from 'bcryptjs';
import type { User, RefreshToken } from '@prisma/client';

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email, isActive: true },
    });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id, isActive: true },
    });
  },

  async createRefreshToken(userId: string, token: string): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        tokenHash: token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  },

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash: token },
      include: { user: true },
    });
  },

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { tokenHash: token },
    });
  },

  async deleteRefreshTokensByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });
  },

  async updateLastLogin(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  },
};
