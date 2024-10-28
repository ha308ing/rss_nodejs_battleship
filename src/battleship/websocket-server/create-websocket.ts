import { WebSocketServer } from "ws";

export const createWebSocketServer = (port: string | number) => {
    if (typeof port === "string") {
        port = parseInt(port);
    }

    return new WebSocketServer({
        port,
        clientTracking: true,
        perMessageDeflate: {
            zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3,
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024,
            },

            clientNoContextTakeover: true,
            serverNoContextTakeover: true,
            serverMaxWindowBits: 10,

            concurrencyLimit: 10,
            threshold: 1024,
        },
    });
};
