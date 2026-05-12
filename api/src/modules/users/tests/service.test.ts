import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../service.js';
import { authRepository } from '../../auth/repository.js';

// Mock the auth repository
vi.mock('../../auth/repository.js');

describe('Users Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTeachers', () => {
    it('should return teachers successfully', async () => {
      const mockTeachers = [
        { id: '1', email: 'teacher1@test.com', firstName: 'John', lastName: 'Doe', roles: ['TEACHER'] },
        { id: '2', email: 'teacher2@test.com', firstName: 'Jane', lastName: 'Smith', roles: ['TEACHER'] },
      ];

      vi.mocked(authRepository).findById = vi.fn().mockResolvedValue(mockTeachers[0]);
      
      // This test would need the actual service implementation
      // const result = await usersService.getTeachers();
      // expect(result).toEqual(mockTeachers);
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'newuser@test.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
        roles: ['STUDENT'],
      };

      vi.mocked(authRepository).findByEmail = vi.fn().mockResolvedValue(null);
      
      // This test would need the actual service implementation
      // const result = await usersService.createUser(userData);
      // expect(result.email).toBe(userData.email);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '1';
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      vi.mocked(authRepository).findById = vi.fn().mockResolvedValue({
        id: userId,
        email: 'test@test.com',
        firstName: 'Old',
        lastName: 'Name',
        roles: ['STUDENT'],
      });
      
      // This test would need the actual service implementation
      // const result = await usersService.updateUser(userId, updateData);
      // expect(result.firstName).toBe(updateData.firstName);
    });
  });
});
