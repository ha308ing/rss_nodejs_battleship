import { MESSAGE_TYPE } from "@/battleship/constants";
import type { IMessage } from "@/battleship/types";
import { games, type IShip } from "@/battleship/entities";
import { startGame } from "./start-game";

export interface IAddShips extends IMessage {
    type: typeof MESSAGE_TYPE.ADD_SHIPS;
    data: { gameId: string; ships: IShip[]; indexPlayer: string };
}

type TFnAddShips = (inputData: IAddShips["data"]) => void;

export const addShips: TFnAddShips = ({ gameId, ships, indexPlayer }) => {
    try {
        const game = games.getGame(gameId);

        game.addShips(indexPlayer, ships);

        if (!game.isReady) return;

        startGame(gameId);
    } catch (error) {}
};
