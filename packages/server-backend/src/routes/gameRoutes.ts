import { Router } from 'express';
import {addPlayer, createGame, getGameInfo, setPlayerName} from "../controllers/gameController";

const router = Router();

router.get('/:gameId/info', getGameInfo);

router.post('/:gameId/join', addPlayer);

router.post('/newGame', createGame);

router.post('/:gameId/setPlayerName', setPlayerName);

export default router;
