import type { IMessage, IPoint } from "@/battleship/types";
import { MESSAGE_TYPE } from "@/battleship/constants";
import { clients, games, TAttackStatus } from "@/battleship/entities";
import { turn } from "./turn";
import { finish } from "./finish";

export interface IAttack extends IMessage {
    type: typeof MESSAGE_TYPE.ATTACK;
    data: {
        gameId: string;
        indexPlayer: string;
        x: number;
        y: number;
    };
}

export interface IAttackOut extends IMessage {
    type: typeof MESSAGE_TYPE.ATTACK;
    data: {
        position: IPoint;
        currentPlayer: string;
        status: TAttackStatus;
    };
}

type TFnAttack = (inputData: IAttack["data"]) => void;

export const attack: TFnAttack = ({ gameId, indexPlayer, x, y }) => {
    const game = games.getGame(gameId);

    const response = game.attack(indexPlayer, x, y);

    response.forEach((message) => {
        clients.sendPlayers(gameId, MESSAGE_TYPE.ATTACK, message);
    });

    clients.sendPlayers(gameId, MESSAGE_TYPE.TURN, game.turnIndex);

    finish(gameId);
    turn(gameId);
};
