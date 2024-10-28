import type {
    IAddShips,
    IAddUserToRoom,
    IAttack,
    ICreateRoom,
    IReg,
    IRandomAttack,
    ISinglePlay,
} from "@/battleship/message-handler/commands";

type TIncomingMessage =
    | IReg
    | ICreateRoom
    | IAddUserToRoom
    | IAddShips
    | IAttack
    | IRandomAttack
    | ISinglePlay;

export const decodeMessage = (message: string): TIncomingMessage => {
    let { type, data: inputData } = JSON.parse(message);
    let data = inputData;
    try {
        data = JSON.parse(data);
    } catch (error) {}

    return { type, data };
};
