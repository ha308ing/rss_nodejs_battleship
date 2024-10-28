import type {
    IAttackOut,
    ICreateGameOut,
    IRegOut,
    IStartGameOut,
    ITurnOut,
} from "@/battleship/message-handler/commands";
import { IFinishOut } from "@/battleship/message-handler/commands";
import type { MESSAGE_TYPE, TMessageType } from "@/battleship/constants";

type TOutgoingMessage =
    | IAttackOut
    | ICreateGameOut
    | IFinishOut
    | IRegOut
    | IStartGameOut
    | ITurnOut;

type TDataOut<T> = T extends typeof MESSAGE_TYPE.ATTACK
    ? IAttackOut["data"]
    : T extends typeof MESSAGE_TYPE.CREATE_GAME
    ? ICreateGameOut["data"]
    : T extends typeof MESSAGE_TYPE.FINISH
    ? IFinishOut["data"]
    : T extends typeof MESSAGE_TYPE.REG
    ? IRegOut["data"]
    : T extends typeof MESSAGE_TYPE.START_GAME
    ? IStartGameOut["data"]
    : T extends typeof MESSAGE_TYPE.TURN
    ? ITurnOut["data"]
    : never;

type TFnEncodeMessage = <
    T extends TMessageType = TMessageType,
    D = TDataOut<T>
>(
    type: T,
    data: D
) => string;

export const encodeMessage: TFnEncodeMessage = (type, data) => {
    const dataString = JSON.stringify(data);
    return JSON.stringify({ id: 0, type, data: dataString });
};
