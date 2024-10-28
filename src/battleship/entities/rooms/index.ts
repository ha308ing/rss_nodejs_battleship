import { MESSAGES } from "@/battleship/constants";
import { Entity } from "../entity";
import { clients, games, type IPlayer, players } from "@/battleship/entities";

export interface IRoom {
    roomId: string;
    roomUsers: IPlayer[];
    playersIds: string[];
}

export class Rooms extends Entity<IRoom> {
    getRoomsArray() {
        return Array.from(this._entities.values());
    }

    // one group per connection,
    // because starting a game switches to the game without opportunity to go back
    createRoom(playerIndex: string, connectionIndex: string) {
        const player = players.getPlayer(playerIndex);
        const room = {
            roomId: connectionIndex,
            roomUsers: [player],
            playersIds: [playerIndex],
        };
        if (!this._entities.has(connectionIndex))
            this.add(room, connectionIndex);
    }

    addPlayerToRoom(roomIndex: string, connectionIndex: string): boolean {
        const room = this.getRoom(roomIndex);

        const playerIndex = clients.getPlayerIndex(connectionIndex);

        if (room.playersIds.includes(playerIndex)) return false;

        const player = players.getPlayer(playerIndex);

        room.roomUsers.push(player);
        room.playersIds.push(playerIndex);

        games.createGame(room);

        this.delete(roomIndex);
        return true;
    }

    getRoom(roomIndex: string) {
        const room = this.get(roomIndex);

        if (room == undefined) throw new Error(MESSAGES.ERROR_ROOM_NOT_FOUND);

        return room;
    }
}

export const rooms = new Rooms("Rooms");
