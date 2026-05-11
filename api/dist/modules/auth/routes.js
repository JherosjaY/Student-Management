import { Router } from 'express';
import * as authController from './controller.js';
const router = Router();
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
export const authRouter = router;
