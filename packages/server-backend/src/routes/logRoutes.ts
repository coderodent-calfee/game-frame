import { Router } from 'express';

const router = Router();

router.post('/info', (req, res) => {
    const body = req.body;
    console.log("request.body:",body);
    res.json({ message: `/log/info:${body.message}` });
});

export default router;
