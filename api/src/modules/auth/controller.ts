import type { Request, Response, NextFunction } from 'express';
import * as authService from './service.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      message: 'User registered. Please check the console for verification link.',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body;
    const result = await authService.verifyEmail(userId, token);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token, newPassword } = req.body;
    const result = await authService.resetPassword(userId, token, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
