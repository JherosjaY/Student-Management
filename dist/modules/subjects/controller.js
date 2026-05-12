import { subjectsService } from './service.js';
export const getAll = async (req, res) => {
    const { page, limit } = req.query;
    const subjects = await subjectsService.getAllSubjects({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
    });
    res.json(subjects);
};
export const getById = async (req, res) => {
    const subject = await subjectsService.getSubjectById(req.params.id);
    res.json(subject);
};
export const create = async (req, res) => {
    const subject = await subjectsService.createSubject(req.body);
    res.status(201).json(subject);
};
export const update = async (req, res) => {
    const subject = await subjectsService.updateSubject(req.params.id, req.body);
    res.json(subject);
};
export const remove = async (req, res) => {
    await subjectsService.deleteSubject(req.params.id);
    res.status(204).send();
};
