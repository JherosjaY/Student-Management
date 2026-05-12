export class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}
export const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code,
            },
        });
        return;
    }
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
        },
    });
};
