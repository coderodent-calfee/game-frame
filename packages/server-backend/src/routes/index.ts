import { Router } from 'express';
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';
import logRoutes from './logRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/log', logRoutes);

export default router;
