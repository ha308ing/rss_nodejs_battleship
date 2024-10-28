import { clients, games, rooms } from "@/battleship/entities";
import { finish, updateRoom } from "../message-handler/commands";

export const closeListener = (clientIndex: string) => {
    return () => {
        console.log("Close connection %s", clientIndex);
        try {
            const playerIndex = clients.getPlayerIndex(clientIndex);

            const gamesWithPlayer = Array.from(games._entities.values()).filter(
                ({ playersIds }) => {
                    return playersIds.includes(playerIndex);
                }
            );

            const roomsWithPlayer = Array.from(rooms._entities.values()).filter(
                ({ playersIds }) => {
                    return playersIds.includes(playerIndex);
                }
            );

            gamesWithPlayer.forEach((game) => {
                const playerLeftIndex = game.playersIds.indexOf(playerIndex);
                const winnerIndex = (playerLeftIndex + 1) % 2;

                game._setWinner(game.playersIds[winnerIndex]);

                finish(game.gameId);

                games.delete(game.gameId);
            });

            roomsWithPlayer.forEach(({ roomId }) => {
                rooms.delete(roomId);
            });
            updateRoom();
        } catch (error) {
            console.log(error);
        }
        clients.delete(clientIndex);
    };
};
