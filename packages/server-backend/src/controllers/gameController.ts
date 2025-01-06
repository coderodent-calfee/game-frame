// controllers/GameController.ts
import {Request, Response} from "express";
import GameService from "../services/gameService";
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
            gameId: newGame.gameId
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
    if (!sessionId) {
        res.status(404).json({ error: "sessionId not found" });
        return;
    }
    const newPlayer = PlayerService.createPlayer(game, sessionId);
    
    try {
        game.addPlayer(newPlayer);
        res.status(200).json({
            message: `${newPlayer.name} added to the game`,
            game,
            player: newPlayer
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
            gameStatus: game.status
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getGameInfo = (req: Request, res: Response): void => {
    const { gameId } = req.params;
    const  sessionId  = req.query.sessionId?.toString();
    console.log(`req.query is a  ${typeof  req.query} req.query: `, req.query);
    console.log(`sessionId is a  ${typeof  sessionId} sessionId: `, sessionId);
    console.log(`getGameInfo: gameId ${gameId} sessionId: ${sessionId}`);
    const game = GameService.getGameById(gameId);
    if (!game) {
        console.log(`gameId ${gameId} not found:`, gameId);

        res.status(404).json({ error: "Game not found" });
        return;
    }
    const gameInfo = {game};
    console.log(`gameId ${gameId} found:`, gameInfo);
    if(sessionId){
        const player = GameService.getGamePlayer(sessionId, gameId);
        if(player){
            console.log(`return playerId ${ player.playerId} sessionId is ${sessionId}: `);
            
            gameInfo["player"] = player;
        }
    }
    else{
        console.log(`no sessionId: ${sessionId}`)
    }
    res.status(200).json(gameInfo);
};


export const setPlayerName = (req: Request, res: Response): void => {

    try {
        const { gameId } = req.params;
        const { playerId, playerName }: { playerId: string, playerName: string } = req.body;
        console.log(`setPlayerName playerId ${playerId} name is ${playerName} game: ${gameId}`);
        const game = GameService.getGameById(gameId);
        if (!game) {
            res.status(404).json({ error: "Game not found" });
            return;
        }
        const player = game.players.find((p)=>{
            return p.playerId == playerId;
        });
        if (!player) {
            res.status(404).json({ error: "player not found" });
            return;
        }
        const oldName = player.name;
        player.name = playerName;
        res.status(200).json({
            message: `${oldName}changed to ${player.name}`,
            game,
            player
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};