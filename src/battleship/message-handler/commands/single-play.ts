import { MESSAGE_TYPE } from "@/battleship/constants";
import { WebSocket } from "ws";
import { createRoom } from "@/battleship/message-handler/commands";
import "dotenv/config";
import { encodeMessage } from "@/battleship/entities/clients/encode-message";
import { decodeMessage } from "@/battleship/message-handler/decode-message";

const { PORT_WS } = process.env;
const wsHost = "http://localhost:" + PORT_WS;

export interface ISinglePlay {
    type: typeof MESSAGE_TYPE.SINGLE_PLAY;
    data: "";
}

export const singlePlay = (connectionIndex: string) => {
    let botIndex = "";
    let gameId = "";
    const botWebSocket = new WebSocket(wsHost);
    botWebSocket.on("open", () => {
        botWebSocket.send(
            encodeMessage(MESSAGE_TYPE.REG, { name: "bot", password: "bot" })
        );

        createRoom(connectionIndex);

        botWebSocket.send(
            encodeMessage(MESSAGE_TYPE.ADD_USER_TO_ROOM, {
                indexRoom: connectionIndex,
            })
        );

        botWebSocket.on("message", (message) => {
            const { type, data } = decodeMessage(message.toString()) as {
                type: string;
                data: any;
            };

            switch (type) {
                case MESSAGE_TYPE.CREATE_GAME: {
                    botIndex = data.idPlayer;
                    gameId = data.idGame;
                    botWebSocket.send(
                        encodeMessage(MESSAGE_TYPE.ADD_SHIPS, {
                            ships: botShips,
                            gameId: data.idGame,
                            indexPlayer: botIndex,
                        })
                    );
                    break;
                }
                case MESSAGE_TYPE.ATTACK: {
                    botWebSocket.send(
                        encodeMessage(MESSAGE_TYPE.RANDOM_ATTACK, {
                            gameId: gameId,
                            indexPlayer: botIndex,
                        })
                    );
                    break;
                }
                case MESSAGE_TYPE.FINISH: {
                    botWebSocket.close();
                }
            }
        });
    });
};

const botShips = [
    {
        position: {
            x: 3,
            y: 2,
        },
        direction: true,
        type: "huge",
        length: 4,
    },
    {
        position: {
            x: 4,
            y: 7,
        },
        direction: true,
        type: "large",
        length: 3,
    },
    {
        position: {
            x: 0,
            y: 7,
        },
        direction: false,
        type: "large",
        length: 3,
    },
    {
        position: {
            x: 0,
            y: 3,
        },
        direction: false,
        type: "medium",
        length: 2,
    },
    {
        position: {
            x: 6,
            y: 6,
        },
        direction: false,
        type: "medium",
        length: 2,
    },
    {
        position: {
            x: 6,
            y: 0,
        },
        direction: true,
        type: "medium",
        length: 2,
    },
    {
        position: {
            x: 0,
            y: 5,
        },
        direction: false,
        type: "small",
        length: 1,
    },
    {
        position: {
            x: 8,
            y: 3,
        },
        direction: true,
        type: "small",
        length: 1,
    },
    {
        position: {
            x: 5,
            y: 3,
        },
        direction: false,
        type: "small",
        length: 1,
    },
    {
        position: {
            x: 8,
            y: 0,
        },
        direction: true,
        type: "small",
        length: 1,
    },
];
