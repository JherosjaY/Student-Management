import { ValidationError } from '../errors/app-error.js';
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            throw new ValidationError(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
        }
        req.body = result.data;
        next();
    };
};
