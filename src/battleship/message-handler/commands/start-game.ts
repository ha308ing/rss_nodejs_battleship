import { MESSAGE_TYPE } from "@/battleship/constants";
import { clients, games, type TShipType } from "@/battleship/entities";
import type { IMessage } from "@/battleship/types";

export interface IStartGameOut extends IMessage {
    type: typeof MESSAGE_TYPE.START_GAME;
    data: {
        ships: {
            position: {
                x: number;
                y: number;
            };
            direction: boolean;
            length: number;
            type: TShipType;
        };
        currentPlayerIndex: string;
    };
}

export const startGame = (gameIndex: string) => {
    const game = games.getGame(gameIndex);

    const playersClients = clients.getGameClients(gameIndex);

    const [client1Index, client2Index] = playersClients;
    const [player1Index, player2Index] = game.playersIds;

    clients.send(client1Index, MESSAGE_TYPE.START_GAME, {
        currentPlayerIndex: game.turnIndex,
        ships: game.ships[player1Index],
    });
    clients.send(client2Index, MESSAGE_TYPE.START_GAME, {
        currentPlayerIndex: game.turnIndex,
        ships: game.ships[player2Index],
    });
};
