import { errorHandler } from '../errors/app-error.js';
export const handleErrors = () => {
    return (error, req, res, next) => {
        errorHandler(error, req, res, next);
    };
};
