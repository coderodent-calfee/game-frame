import { Router } from 'express';
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);

export default router;
