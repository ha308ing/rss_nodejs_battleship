import {
    createWebSocketServer,
    connectionListener,
} from "@/battleship/websocket-server";
import { MESSAGES } from "@/battleship/constants";

interface IBattleshipServer {
    listen: (port: number | string) => void;
}

export const battleshipServer: IBattleshipServer = {
    listen(port: number | string) {
        const wss = createWebSocketServer(port);

        wss.on("listening", () => {
            console.log(MESSAGES.GREETING, wss.options.port);
        });

        wss.on("connection", connectionListener);

        wss.on("error", console.error);
    },
};
