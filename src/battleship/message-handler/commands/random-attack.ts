import { attack } from "./attack";
import { games } from "@/battleship/entities";
import { MESSAGE_TYPE } from "@/battleship/constants";
import type { IMessage } from "@/battleship/types";

export interface IRandomAttack extends IMessage {
    type: typeof MESSAGE_TYPE.RANDOM_ATTACK;
    data: {
        gameId: string;
        indexPlayer: string;
    };
}

type TFnRandomAttack = (messageData: IRandomAttack["data"]) => void;

export const randomAttack: TFnRandomAttack = ({ gameId, indexPlayer }) => {
    const game = games.getGame(gameId);

    const { x, y } = game.randomAttack(indexPlayer);

    attack({ gameId, indexPlayer, x, y });
};
