import { attendanceService } from './service.js';
export const getClasses = async (req, res) => {
    const classes = await attendanceService.getClasses(req.user);
    res.json(classes);
};
export const getStudents = async (req, res) => {
    const students = await attendanceService.getStudents(req.params.classId);
    res.json(students);
};
export const getAttendance = async (req, res) => {
    const { classId } = req.params;
    const { date } = req.query;
    const records = await attendanceService.getAttendanceByDate(classId, date);
    res.json(records);
};
export const mark = async (req, res) => {
    const result = await attendanceService.markAttendance(req.body, req.user);
    res.json(result);
};
export const getSubjects = async (req, res) => {
    const subjects = await attendanceService.getSubjects();
    res.json(subjects);
};
