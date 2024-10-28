import { Entity } from "../entity";
import { IRoom, rooms } from "../rooms";
import { Game } from "../game";
import { MESSAGES } from "@/battleship/constants";
import { players } from "../players";

export class Games extends Entity<Game> {
    createGame(room: IRoom) {
        const { roomId: roomIndex } = room;

        const game = new Game(room);

        this.add(game, roomIndex);
    }

    getGame(gameIndex: string) {
        const game = this.get(gameIndex);

        if (game == undefined) throw new Error(MESSAGES.ERROR_GAME_NOT_FOUND);

        return game;
    }

    _getPrintData() {
        return Array.from(this._entities.entries()).map(
            ([index, { playersIds, turn }]) => {
                const [player1, player2] = playersIds.map((playerId) => {
                    try {
                        return players.getPlayer(playerId);
                    } catch (error) {
                        return { name: "ghost" };
                    }
                });
                const playerTurn = turn == 0 ? player1.name : player2.name;
                return {
                    index,
                    Player1: player1.name,
                    Player2: player2.name,
                    Turn: playerTurn,
                };
            }
        );
    }
}

export const games = new Games("Games");
