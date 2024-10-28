import { MESSAGE_TYPE } from "@/battleship/constants";
import { decodeMessage } from "./decode-message";
import * as commands from "./commands";

export const createMessageHandler = (connectionIndex: string) => {
    return (message: string) => {
        const { type, data: messageData } = decodeMessage(message);

        switch (type) {
            case MESSAGE_TYPE.REG: {
                commands.reg(messageData, connectionIndex);
                commands.updateRoom();
                commands.updateWinners();
                break;
            }
            case MESSAGE_TYPE.CREATE_ROOM: {
                commands.createRoom(connectionIndex);
                commands.updateRoom();
                commands.updateWinners();
                break;
            }
            case MESSAGE_TYPE.ADD_USER_TO_ROOM: {
                commands.addUserToRoom(messageData, connectionIndex);
                commands.updateRoom();
                break;
            }
            case MESSAGE_TYPE.ADD_SHIPS: {
                commands.addShips(messageData);
                break;
            }
            case MESSAGE_TYPE.ATTACK: {
                commands.attack(messageData);
                commands.updateWinners();
                break;
            }
            case MESSAGE_TYPE.RANDOM_ATTACK: {
                commands.randomAttack(messageData);
                commands.updateWinners();
                break;
            }
            case MESSAGE_TYPE.SINGLE_PLAY: {
                commands.singlePlay(connectionIndex);
                break;
            }
        }
    };
};
