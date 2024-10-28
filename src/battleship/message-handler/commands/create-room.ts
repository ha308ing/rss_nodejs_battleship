import type { MESSAGE_TYPE } from "@/battleship/constants";
import type { IMessage } from "@/battleship/types";
import { clients, rooms } from "@/battleship/entities";

export interface ICreateRoom extends IMessage {
    type: typeof MESSAGE_TYPE.CREATE_ROOM;
    data: string;
}

type TFnCreateRoom = (connectionIndex: string) => void;

export const createRoom: TFnCreateRoom = (connectionIndex) => {
    const playerIndex = clients.getPlayerIndex(connectionIndex);

    rooms.createRoom(playerIndex, connectionIndex);
};
