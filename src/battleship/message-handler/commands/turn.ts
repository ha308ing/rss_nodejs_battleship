import { clients, games } from "@/battleship/entities";
import { IMessage } from "@/battleship/types";
import { MESSAGE_TYPE } from "@/battleship/constants";

export interface ITurnOut extends IMessage {
    type: typeof MESSAGE_TYPE.TURN;
    data: {
        currentPlayer: string;
    };
}

export const turn = (gameIndex: string) => {
    const clientsIndex = clients.getGameClients(gameIndex);

    const game = games.getGame(gameIndex);

    const [client1Index, client2Index] = clientsIndex;

    clients.send(client1Index, MESSAGE_TYPE.TURN, {
        currentPlayer: game.turnIndex,
    });
    clients.send(client2Index, MESSAGE_TYPE.TURN, {
        currentPlayer: game.turnIndex,
    });
};
