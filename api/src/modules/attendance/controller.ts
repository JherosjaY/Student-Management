import type { RequestHandler } from 'express';
import { attendanceService } from './service.js';

export const getClasses: RequestHandler = async (req, res) => {
  const classes = await attendanceService.getClasses(req.user);
  res.json(classes);
};

export const getStudents: RequestHandler = async (req, res) => {
  const students = await attendanceService.getStudents(req.params.classId);
  res.json(students);
};

export const getAttendance: RequestHandler = async (req, res) => {
  const { classId } = req.params;
  const { date } = req.query;
  const records = await attendanceService.getAttendanceByDate(classId, date as string);
  res.json(records);
};

export const mark: RequestHandler = async (req, res) => {
  const result = await attendanceService.markAttendance(req.body, req.user);
  res.json(result);
};

export const getSubjects: RequestHandler = async (req, res) => {
  const subjects = await attendanceService.getSubjects();
  res.json(subjects);
};
