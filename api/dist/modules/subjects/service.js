import { subjectsRepository } from './repository.js';
import { ConflictError, NotFoundError } from '../../shared/errors/index.js';
export const subjectsService = {
    async getAllSubjects(query = {}) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        return subjectsRepository.findAllPaginated(page, limit);
    },
    async getSubjectById(id) {
        const subject = await subjectsRepository.findById(id);
        if (!subject)
            throw new NotFoundError('Subject');
        return subject;
    },
    async createSubject(data) {
        const existing = await subjectsRepository.findByCode(data.code);
        if (existing)
            throw new ConflictError('Subject code already exists');
        return subjectsRepository.create(data);
    },
    async updateSubject(id, data) {
        await this.getSubjectById(id);
        if (data.code) {
            const existing = await subjectsRepository.findByCode(data.code);
            if (existing && existing.id !== id) {
                throw new ConflictError('Subject code already exists');
            }
        }
        return subjectsRepository.update(id, data);
    },
    async deleteSubject(id) {
        await this.getSubjectById(id);
        return subjectsRepository.delete(id);
    },
};
