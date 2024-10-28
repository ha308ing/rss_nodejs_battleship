import { IMessage } from "@/battleship/types";
import { clients, games } from "@/battleship/entities";
import { MESSAGE_TYPE } from "@/battleship/constants";

export interface ICreateGameOut extends IMessage {
    type: typeof MESSAGE_TYPE.CREATE_GAME;
    data: {
        idGame: string;
        idPlayer: string;
    };
}

type TFnCreateGame = (idGame: string) => void;

export const createGame: TFnCreateGame = (idGame) => {
    const game = games.getGame(idGame);

    const playersClients = clients.getGameClients(idGame);

    const [client1Index, client2Index] = playersClients;

    const { gameId } = game;

    clients.send(client1Index, MESSAGE_TYPE.CREATE_GAME, {
        idGame: gameId,
        idPlayer: clients.playersIndex.get(client1Index),
    });

    clients.send(client2Index, MESSAGE_TYPE.CREATE_GAME, {
        idGame: gameId,
        idPlayer: clients.playersIndex.get(client2Index),
    });
};
