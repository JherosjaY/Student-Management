import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../errors/app-error.js';

export const handleErrors = () => {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(error, req, res, next);
  };
};
