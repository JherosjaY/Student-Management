import { subjectsRepository } from './repository.js';
import { ConflictError, NotFoundError } from '../../shared/errors/index.js';
import type { CreateSubjectInput, UpdateSubjectInput } from './dtos/index.js';

export const subjectsService = {
  async getAllSubjects(query: { page?: number; limit?: number } = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return subjectsRepository.findAllPaginated(page, limit);
  },

  async getSubjectById(id: string) {
    const subject = await subjectsRepository.findById(id);
    if (!subject) throw new NotFoundError('Subject');
    return subject;
  },

  async createSubject(data: CreateSubjectInput) {
    const existing = await subjectsRepository.findByCode(data.code);
    if (existing) throw new ConflictError('Subject code already exists');
    return subjectsRepository.create(data);
  },

  async updateSubject(id: string, data: UpdateSubjectInput) {
    await this.getSubjectById(id);
    if (data.code) {
      const existing = await subjectsRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ConflictError('Subject code already exists');
      }
    }
    return subjectsRepository.update(id, data);
  },

  async deleteSubject(id: string) {
    await this.getSubjectById(id);
    return subjectsRepository.delete(id);
  },
};
