import type { RoleName, User, UserRole, Role } from '@prisma/client';

export type UserWithRoles = User & {
  userRoles: (UserRole & { role: Role })[];
};

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  roles: RoleName[];
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequesterContext {
  id: string;
  roles: RoleName[];
}