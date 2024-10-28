import type { IMessage } from "@/battleship/types";
import { clients, games } from "@/battleship/entities";
import { MESSAGE_TYPE } from "@/battleship/constants";
import { updateWinners } from "./update-winners";

export interface IFinishOut extends IMessage {
    type: typeof MESSAGE_TYPE.FINISH;
    data: {
        winPlayer: string;
    };
}

export const finish = (gameId: string) => {
    const game = games.getGame(gameId);

    if (game.winPlayer != null)
        clients.sendPlayers(gameId, MESSAGE_TYPE.FINISH, {
            winPlayer: game.winPlayer,
        });
    updateWinners();
};
