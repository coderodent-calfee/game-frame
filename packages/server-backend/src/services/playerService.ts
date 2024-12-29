import {PlayerEntity} from "@server-backend/models/player";
import {GameEntity} from "@server-backend/models/game";
import UserService from "@server-backend/services/userService";

const players: Record<string, PlayerEntity> = {};

// sessionId -> PlayerId
interface SessionPlayerMap {
    [sessionId: string]: string;
}
const sessionPlayer : SessionPlayerMap = {};

function generateId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const createPlayer = (game : GameEntity, sessionId: string): PlayerEntity => {

    const userName = UserService.getUserName(sessionId);
    const playerName = userName ?? `Player${game.getGameInfo().players.length+1}`;

    const playerId = generateId();
    const newPlayer = new PlayerEntity(game.gameId, playerName, playerId);

    players[playerId] = newPlayer;
    sessionPlayer[sessionId] = newPlayer.getInfo().playerId;

    return newPlayer;
};

export const getPlayerBySession = (sessionId: string): PlayerEntity | undefined => {
    const playerId = sessionPlayer[sessionId];
    if(playerId){
        return players[playerId];
    }
};

export default {sessionPlayer, createPlayer};