import { Router } from 'express';
import {addPlayer, createGame} from "../controllers/gameController";

const router = Router();

router.get('/info', (req, res) => {
    res.json({ message: 'Game info route' });
});

router.post('/:gameId/join', addPlayer);

router.post('/newGame', createGame);

export default router;
