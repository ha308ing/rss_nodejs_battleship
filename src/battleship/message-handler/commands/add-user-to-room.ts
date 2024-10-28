import { IMessage } from "@/battleship/types";
import { MESSAGE_TYPE } from "@/battleship/constants";
import { clients, rooms } from "@/battleship/entities";
import { createGame } from "./create-game";
import { turn } from "./turn";

export interface IAddUserToRoom extends IMessage {
    type: typeof MESSAGE_TYPE.ADD_USER_TO_ROOM;
    data: {
        indexRoom: string;
    };
}

type TFnAddUser = (
    inputData: IAddUserToRoom["data"],
    connectionIndex: string
) => void;

export const addUserToRoom: TFnAddUser = ({ indexRoom }, connectionIndex) => {
    const playerIndex = clients.playersIndex.get(connectionIndex);
    console.log("add user %s to room %s", playerIndex, indexRoom);

    const success = rooms.addPlayerToRoom(indexRoom, connectionIndex);
    if (!success) return;

    clients.gamesIndex.set(indexRoom, [indexRoom, connectionIndex]);
    createGame(indexRoom);
    turn(indexRoom);
};
