import { MESSAGE_TYPE } from "@/battleship/constants";
import { clients, rooms, type IRoom } from "@/battleship/entities";

export interface IUpdateRoom {
    type: typeof MESSAGE_TYPE.UPDATE_ROOM;
    data: IRoom;
}

export const updateRoom = () => {
    const response = rooms.getRoomsArray();

    clients.sendAll(MESSAGE_TYPE.UPDATE_ROOM, response);
};
