import * as authService from './service.js';
export const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: 'User registered. Please check the console for verification link.',
            user,
        });
    }
    catch (err) {
        next(err);
    }
};
export const verifyEmail = async (req, res, next) => {
    try {
        const { userId, token } = req.body;
        const result = await authService.verifyEmail(userId, token);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
