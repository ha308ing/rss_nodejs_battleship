import { httpServer } from "@/http_server";
import { battleshipServer } from "@/battleship";
import "dotenv/config";

const { PORT_WS } = process.env;

const HTTP_PORT = 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
battleshipServer.listen(PORT_WS);
