import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/routes.js';
import { subjectsRouter } from './modules/subjects/routes.js';
export const createApp = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    // Routes
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/subjects', subjectsRouter);
    // Error handling basic
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.statusCode || 500).json({
            error: {
                message: err.message || 'Internal Server Error',
                code: err.code || 'INTERNAL_ERROR'
            }
        });
    });
    return app;
};
