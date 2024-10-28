import { Entity } from "../entity";
import { IRoom, rooms } from "../rooms";
import { Game } from "../game";
import { MESSAGES } from "@/battleship/constants";

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
}

export const games = new Games("Games");
