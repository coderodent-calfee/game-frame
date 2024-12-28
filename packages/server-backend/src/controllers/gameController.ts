// controllers/GameController.ts
import { Request, Response } from "express";
import GameService from "../services/gameService";
import UserService from "../services/userService";
import PlayerService from "../services/playerService";


export const createGame = (req: Request, res: Response): void => {
    console.log('controller createGame', req.body);
    const { sessionId }: { sessionId: string } = req.body;

    if (!sessionId) {
        res.status(400).json({ error: "Game name is required" });
        return;
    }

    const newGame = GameService.createGame(sessionId);

    res.status(201).json({
        message: "Game created successfully",
        game: {
            gameId: newGame.getGameStatus().gameId
        },
    });
};

export const addPlayer = (req: Request, res: Response): void => {
    const { gameId } = req.params;    
    const { sessionId }: { sessionId: string } = req.body;
    const game = GameService.getGameById(gameId);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    const userName = UserService.getUserName(sessionId);
    const playerName = userName ?? `Player${game.getGameStatus().players.length+1}`;
    const newPlayer = PlayerService.createPlayer(gameId, playerName);
    PlayerService.sessionPlayer[sessionId] = newPlayer.getInfo().playerId;
    
    try {
        game.addPlayer(newPlayer);
        const playerInfo = newPlayer.getInfo();
        res.status(200).json({
            message: `${playerInfo.name} added to the game`,
            game,
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const startGame = (req: Request, res: Response): void => {
    const { gameId }: { gameId: string } = req.body;

    const game = GameService.getGameById(gameId);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }

    try {
        game.startGame();
        res.status(200).json({
            message: "Game started successfully",
            gameStatus: game.getGameStatus()
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getGameStatus = (req: Request, res: Response): void => {
    const { gameId } = req.params;

    const game = GameService.getGameById(gameId);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }

    res.status(200).json(game.getGameStatus());
};
