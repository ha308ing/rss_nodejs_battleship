export const MESSAGE_TYPE = {
    REG: "reg",
    UPDATE_ROOM: "update_room",
    UPDATE_WINNERS: "update_winners",
    CREATE_ROOM: "create_room",
    ADD_USER_TO_ROOM: "add_user_to_room",
    CREATE_GAME: "create_game",
    ADD_SHIPS: "add_ships",
    START_GAME: "start_game",
    TURN: "turn",
    ATTACK: "attack",
    RANDOM_ATTACK: "randomAttack",
    FINISH: "finish",
} as const;

export type TMessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export const ERROR_MESSAGE = {
    WRONG_NAME: "Please select another name",
};
