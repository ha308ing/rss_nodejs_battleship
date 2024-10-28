import type { WebSocket } from "ws";
import { clients } from "@/battleship/entities";
import { createMessageHandler } from "@/battleship/message-handler";
import { closeListener } from "./close-listener";

export const connectionListener = (ws: WebSocket) => {
    const [index] = clients.add(ws);
    const messageHandler = createMessageHandler(index);

    console.log("New connection: %s", index);

    ws.on("message", messageHandler);

    ws.on("close", closeListener(index));

    ws.pong();
};
