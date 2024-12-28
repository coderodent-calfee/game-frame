import {Player} from "@server-backend/models/player";


export interface Game {
    gameId: string;
    players: Player[];
    status: string;
    minPlayers: number;
    maxPlayers: number;
}

export class GameEntity implements Game {
    public readonly gameId: string;
    public readonly players: Player[];
    public status: string;
    public readonly minPlayers: number;
    public readonly maxPlayers: number;

    constructor(gameId : string) {
        this.gameId = gameId;
        this.players = [];
        this.status = "waiting"; // waiting, started, ended
        this.minPlayers = 1;
        this.maxPlayers = 16;
    }

    addPlayer(player : Player) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
        }
    }

    startGame() {
        if (this.players.length >= this.minPlayers) {
            this.status = "started";
        } else {
            throw new Error("Not enough players to start the game");
        }
    }

    getPlayerIds() {
        return this.players.map((player:Player) => player.playerId);
    }
    
    getGameStatus() {
        return {
            gameId: this.gameId,
            status: this.status,
            players: this.players
        };
    }

}