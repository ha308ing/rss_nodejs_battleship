import { MESSAGE_TYPE, TMessageType } from "@/battleship/constants";
import { WebSocket } from "ws";
import { createRoom } from "./create-room";
import "dotenv/config";

const { PORT } = process.env;
const wsHost = "http://localhost:" + PORT;

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
            JSON.stringify({
                type: MESSAGE_TYPE.REG,
                data: JSON.stringify({ name: "bot", password: "bot" }),
            })
        );
        createRoom(connectionIndex);
        botWebSocket.send(
            JSON.stringify({
                id: 0,
                type: MESSAGE_TYPE.ADD_USER_TO_ROOM,
                data: JSON.stringify({
                    indexRoom: connectionIndex,
                }),
            })
        );
        botWebSocket.on("message", (message) => {
            let data;
            const { type, data: dataString } = JSON.parse(message.toString());
            try {
                data = JSON.parse(dataString);
            } catch (error) {
                data = dataString;
            }
            console.log({ type, data });

            switch (type) {
                case MESSAGE_TYPE.CREATE_GAME: {
                    botIndex = data.idPlayer;
                    gameId = data.idGame;
                    console.log({ botIndex, data });
                    botWebSocket.send(
                        JSON.stringify({
                            id: 0,
                            type: MESSAGE_TYPE.ADD_SHIPS,
                            data: JSON.stringify({
                                ships: botShips,
                                gameId: data.idGame,
                                indexPlayer: botIndex,
                            }),
                        })
                    );
                    break;
                }
                case MESSAGE_TYPE.ATTACK: {
                    botWebSocket.send(
                        JSON.stringify({
                            id: 0,
                            type: MESSAGE_TYPE.RANDOM_ATTACK,
                            data: JSON.stringify({
                                gameId: gameId,
                                indexPlayer: botIndex,
                            }),
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
