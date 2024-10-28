import { WebSocket } from "ws";
import { clients, games, players, rooms } from "@/battleship/entities";
import { createMessageHandler } from "@/battleship/message-handler";

export const connectionListener = (ws: WebSocket) => {
    const [index] = clients.add(ws);
    const messageHandler = createMessageHandler(index);

    console.log("New connection: %s", index);

    ws.on("message", messageHandler);

    ws.pong();
};
