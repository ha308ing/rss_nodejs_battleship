import { MESSAGE_TYPE } from "@/battleship/constants";
import type { IMessage } from "@/battleship/types";
import { clients, players } from "@/battleship/entities";

export interface IReg extends IMessage {
    type: typeof MESSAGE_TYPE.REG;
    data: {
        name: string;
        password: string;
    };
}

export interface IRegOut extends IMessage {
    type: typeof MESSAGE_TYPE.REG;
    data: {
        name: string;
        index: string;
        error: boolean;
        errorText: string;
    };
}

type TFnReg = (inputData: IReg["data"], connectionIndex: string) => void;

export const reg: TFnReg = (regData, connectionIndex) => {
    const sender = clients.createClientSender(connectionIndex);

    const [playerIndex, response] = players.addPlayer(regData);

    if (playerIndex != null) {
        clients.addPlayerIndex(connectionIndex, playerIndex);
    }

    sender(MESSAGE_TYPE.REG, response);
};
