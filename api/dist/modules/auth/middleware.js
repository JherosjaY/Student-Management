import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/index.js';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';
export const requireAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid token');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_ACCESS_SECRET);
        req.user = {
            id: payload.userId,
            email: payload.email,
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            roles: payload.roles,
        };
        next();
    }
    catch (error) {
        throw new UnauthorizedError('Invalid token');
    }
};
export const requireRoles = (allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user)
            throw new UnauthorizedError();
        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            throw new ForbiddenError('Insufficient permissions');
        }
        next();
    };
};
