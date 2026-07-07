import { Router } from 'express';
import healthRouter from './health';
import authRouter from './authRoutes';

const router = Router();

// Version 1 routes
router.use('/health', healthRouter);
router.use('/auth', authRouter);

export default router;
