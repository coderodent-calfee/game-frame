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

    const userInfo = UserService.getUserInfo(sessionId);
    const playerName = userInfo?.name ?? `Player${game.players.length+1}`;
    console.log("playerName is:", playerName );

    const playerId = generateId();
    const newPlayer = new PlayerEntity(game.gameId, playerName, playerId);

    players[playerId] = newPlayer;
    sessionPlayer[sessionId] = newPlayer.playerId;

    return newPlayer;
};

export const getPlayerBySession = (sessionId: string): PlayerEntity | undefined => {
    const playerId = sessionPlayer[sessionId];
    if(playerId){
        return players[playerId];
    }
};

export const getSessionByPlayer = (playerId: string): string | undefined => {
    for (const [sessionId, mappedPlayerId] of Object.entries(sessionPlayer)) {
        if (mappedPlayerId === playerId) {
            return sessionId;
        }
    }
    return undefined;
};


export const disconnectPlayer = (sessionId: string) => {
    delete sessionPlayer[sessionId];
};
export default {sessionPlayer, createPlayer, getPlayerBySession, getSessionByPlayer, disconnectPlayer};