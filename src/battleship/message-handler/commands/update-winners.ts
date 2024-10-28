import { MESSAGE_TYPE } from "@/battleship/constants";
import { clients, players, type IPlayer } from "@/battleship/entities";

export interface IUpdateWinners {
    type: typeof MESSAGE_TYPE.UPDATE_WINNERS;
    data: IPlayer[];
}

export const updateWinners = () => {
    const response = players.getWinners();

    clients.sendAll(MESSAGE_TYPE.UPDATE_WINNERS, response);
};
