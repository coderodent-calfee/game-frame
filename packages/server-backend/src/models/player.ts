
export interface Player {
    playerId: string;
    name: string;
    gameId: string;
}

export class PlayerEntity implements Player {
    public readonly playerId: string;
    public name: string;
    public readonly gameId: string;

    constructor(gameId : string, name: string, playerId:string ) {
        this.gameId = gameId;
        this.name = name;
        this.playerId = playerId;
    }

    getInfo() : Player {
        return {
            gameId: this.gameId,
            name: this.name,
            playerId: this.playerId
        };
    }

}