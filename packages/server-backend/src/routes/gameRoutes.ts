import { Router } from 'express';
import {addPlayer, createGame, getGameInfo} from "../controllers/gameController";

const router = Router();

router.get('/:gameId/info', getGameInfo);

router.post('/:gameId/join', addPlayer);

router.post('/newGame', createGame);

export default router;
