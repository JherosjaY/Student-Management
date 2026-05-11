import type { RequestHandler } from 'express';
import { subjectsService } from './service.js';
import type { CreateSubjectInput, UpdateSubjectInput } from './dtos/index.js';

export const getAll: RequestHandler = async (req, res) => {
  const { page, limit } = req.query;
  const subjects = await subjectsService.getAllSubjects({ 
    page: page ? Number(page) : undefined, 
    limit: limit ? Number(limit) : undefined 
  });
  res.json(subjects);
};

export const getById: RequestHandler = async (req, res) => {
  const subject = await subjectsService.getSubjectById(req.params.id);
  res.json(subject);
};

export const create: RequestHandler = async (req, res) => {
  const subject = await subjectsService.createSubject(req.body as CreateSubjectInput);
  res.status(201).json(subject);
};

export const update: RequestHandler = async (req, res) => {
  const subject = await subjectsService.updateSubject(req.params.id, req.body as UpdateSubjectInput);
  res.json(subject);
};

export const remove: RequestHandler = async (req, res) => {
  await subjectsService.deleteSubject(req.params.id);
  res.status(204).send();
};
