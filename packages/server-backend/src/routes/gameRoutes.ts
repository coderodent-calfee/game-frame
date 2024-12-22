import { Router } from 'express';

const router = Router();

router.get('/info', (req, res) => {
    res.json({ message: 'Game info route' });
});

router.post('/join', (req, res) => {
    res.json({ message: 'Join game route' });
});

export default router;
