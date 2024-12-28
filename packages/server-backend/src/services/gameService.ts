// src/services/GameService.ts
import { GameEntity } from "../models/game";

const games: Record<string, GameEntity> = {};
// sessionId -> GameId
interface SessionGameMap {
    [sessionId: string]: string;
}
const sessionGame : SessionGameMap = {};

function generateId(): string {
    const array = new Uint32Array(1);
    const randomValue = crypto.getRandomValues(array);
    const proto = randomValue[0].toString(36).toUpperCase();
    console.log(`proto gameId: ${proto}`);
    return proto.substring(0, 6);
}

export const createGame = (sessionId: string): GameEntity => {
    const gameId = generateId();
    const newGame = new GameEntity(gameId);
    games[gameId] = newGame;
    return newGame;
};

export const getGameById = (gameId : string): GameEntity | undefined => {
    return games[gameId];
};
export const getGameBySession = (sessionId: string): GameEntity | undefined => {
    const gameId = sessionGame[sessionId];
    if(gameId){
        return getGameById(gameId);
    }
};

export default {createGame, getGameById, getGameBySession};