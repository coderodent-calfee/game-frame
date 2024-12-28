import {PlayerEntity} from "@server-backend/models/player";
import {GameEntity} from "@server-backend/models/game";

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

export const createPlayer = (gameId : string, name: string): PlayerEntity => {
    const playerId = generateId();
    const newPlayer = new PlayerEntity(gameId, name, playerId);

    players[playerId] = newPlayer;

    return newPlayer;
};

export const getPlayerBySession = (sessionId: string): PlayerEntity | undefined => {
    const playerId = sessionPlayer[sessionId];
    if(playerId){
        return players[playerId];
    }
};

export default {sessionPlayer, createPlayer};