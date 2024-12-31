// src/services/GameService.ts
import { GameEntity } from "../models/game";
import {PlayerEntity} from "@server-backend/models/player";
import PlayerService from "@server-backend/services/playerService";
import UserService, {getUserInfo} from "@server-backend/services/userService";

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

export const getGamePlayer = (sessionId: string, gameId: string) : PlayerEntity | undefined => {
    // the session should be good enough, but the player only goes with one game, so 
    // todo: check the gameId too
    const player = PlayerService.getPlayerBySession(sessionId);
    if(player){
        return player;
    }
    else {
        console.log(`no player found for sessionId: ${sessionId}`);
        const userInfo = UserService.getUserInfo(sessionId);
        console.log(`user for sessionId: ${sessionId}`, userInfo);
    }
    return undefined;
};

export default {createGame, getGameById, getGameBySession, getGamePlayer};