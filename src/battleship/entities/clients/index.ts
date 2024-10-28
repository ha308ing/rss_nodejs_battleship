import { WebSocket } from "ws";
import { Entity } from "@/battleship/entities/entity";
import { MESSAGES, TMessageType } from "@/battleship/constants";
import { encodeMessage } from "./encode-message";

export class Clients extends Entity<WebSocket> {
    playersIndex: Map<string, string>;
    gamesIndex: Map<string, string[]>;

    constructor(name: string) {
        super(name);
        this.playersIndex = new Map();
        this.gamesIndex = new Map();
    }

    createClientSender(index: string) {
        const client = this._entities.get(index);

        return (type: TMessageType, data: unknown) => {
            const message = encodeMessage(type, data);
            client?.send(message);
        };
    }

    sendAll(type: TMessageType, data: unknown) {
        const message = encodeMessage(type, data);
        this._entities.forEach((client) => {
            client.send(message);
        });
    }

    send(clientIndex: string, type: TMessageType, data: unknown) {
        const client = this.getClient(clientIndex);

        const message = encodeMessage(type, data);

        client.send(message);
    }

    sendPlayers(gameIndex: string, type: TMessageType, data: unknown) {
        const clientsIndex = this.gamesIndex.get(gameIndex);

        if (clientsIndex == undefined)
            throw new Error("send players. client indexes not found");
        const message = encodeMessage(type, data);

        clientsIndex.forEach((clientIndex) => {
            const client = this._entities.get(clientIndex);
            if (client == undefined)
                throw new Error("send players client not found");
            client.send(message);
        });
    }

    addPlayerIndex(clientIndex: string, playerIndex: string) {
        this.playersIndex.set(clientIndex, playerIndex);
    }

    getPlayerIndex(connectionIndex: string) {
        const playerIndex = this.playersIndex.get(connectionIndex);

        if (playerIndex == undefined)
            throw new Error(MESSAGES.ERROR_СLIENT_PLAYER_NOT_FOUND);

        return playerIndex;
    }

    getClient(clientIndex: string) {
        const client = this.get(clientIndex);

        if (client == undefined)
            throw new Error(MESSAGES.ERROR_CLIENT_NOT_FOUND);

        return client;
    }

    getGameClients(gameIndex: string) {
        const gameClients = this.gamesIndex.get(gameIndex);

        if (gameClients == undefined)
            throw new Error(MESSAGES.ERROR_CLIENT_GAME_NOT_FOUND);

        return gameClients;
    }
}

export const clients = new Clients("Clients");
