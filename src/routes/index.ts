import { Router } from 'express';
import healthRouter from './health';

const router = Router();

// Version 1 routes
router.use('/health', healthRouter);

export default router;
