import { Router } from 'express';
import * as controller from './controller.js';
import { requireAuth, requireRoles } from '../auth/middleware.js';
import { RoleName } from '@prisma/client';

const router = Router();

router.get('/:id', requireAuth, controller.getById);
router.patch('/:id', requireAuth, controller.update);
router.get('/:id/audit', requireAuth, requireRoles([RoleName.ADMIN]), controller.getAuditLogs);

export { router as usersRouter };
