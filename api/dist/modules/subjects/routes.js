import { Router } from 'express';
import * as controller from './controller.js';
import { requireAuth, requireRoles } from '../auth/middleware.js';
import { validate } from '../../shared/middleware/index.js';
import { createSubjectSchema, updateSubjectSchema } from './dtos/index.js';
import { RoleName } from '@prisma/client';
const router = Router();
/**
 * @route   GET /api/subjects
 * @desc    Get all subjects
 * @access  Authenticated
 */
router.get('/', requireAuth, controller.getAll);
/**
 * @route   GET /api/subjects/:id
 * @desc    Get subject by ID
 * @access  Authenticated
 */
router.get('/:id', requireAuth, controller.getById);
/**
 * @route   POST /api/subjects
 * @desc    Create a new subject
 * @access  Admin
 */
router.post('/', requireAuth, requireRoles([RoleName.ADMIN]), validate({ body: createSubjectSchema }), controller.create);
/**
 * @route   PATCH /api/subjects/:id
 * @desc    Update a subject
 * @access  Admin
 */
router.patch('/:id', requireAuth, requireRoles([RoleName.ADMIN]), validate({ body: updateSubjectSchema }), controller.update);
/**
 * @route   DELETE /api/subjects/:id
 * @desc    Soft delete a subject
 * @access  Admin
 */
router.delete('/:id', requireAuth, requireRoles([RoleName.ADMIN]), controller.remove);
export { router as subjectsRouter };
