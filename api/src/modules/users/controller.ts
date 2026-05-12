import type { RequestHandler } from 'express';
import { userService } from './service.js';

export const getById: RequestHandler = async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json(user);
};

export const update: RequestHandler = async (req, res) => {
  const user = await userService.update(req.params.id, req.body, req.user!.id);
  res.json(user);
};

export const getAuditLogs: RequestHandler = async (req, res) => {
  const logs = await userService.getAuditLogs(req.params.id);
  res.json(logs);
};

export const getAllAuditLogs: RequestHandler = async (req, res) => {
  const logs = await userService.getAllAuditLogs();
  res.json(logs);
};

export const findAllTeachers: RequestHandler = async (req, res) => {
  const teachers = await userService.findAllTeachers();
  res.json(teachers);
};
