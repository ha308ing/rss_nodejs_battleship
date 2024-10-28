import { IPoint } from "@/battleship/types";
import { IPlayer, players } from "../players";
import { IRoom } from "../rooms";
import { addShipProps } from "./add-ship-props";
import { formatCoordinates } from "./format-coordinates";
import { randomInt } from "crypto";
import { MESSAGES } from "@/battleship/constants";

export interface IGame {
    gameId: string;
    playersIds: string[];
    ships: Record<string, IShip[]>;
    filledCells: Record<string, Set<string>>;
    randomShots: Record<string, string[]>;
    players: Omit<IPlayer, "password">[];
    turn: number;
    turnIndex: string;
    winPlayer: string | null;
}

export type TShipType = "small" | "medium" | "large" | "huge";

export type TAttackStatus = "miss" | "killed" | "shot";

export interface IShip {
    position: IPoint;
    direction: boolean;
    length: number;
    type: TShipType;
    coordinates: string[];
    hits: string[]; // when hits.length == length => killed
    killed: boolean;
    surrounding: number[][];
}

const shipCount = 10;

export class Game implements IGame {
    gameId: string;
    playersIds: string[];
    ships: Record<string, IShip[]>;
    filledCells: Record<string, Set<string>>;
    randomShots: Record<string, string[]>;
    players: Omit<IPlayer, "password">[];
    turn: number;
    turnIndex: string;
    winPlayer: string | null;

    constructor(room: IRoom) {
        const { roomId: roomIndex, playersIds } = room;
        const [player1Index, player2Index] = playersIds;

        (this.gameId = roomIndex), (this.playersIds = playersIds);
        (this.players = room.roomUsers.map(({ name, wins }) => ({
            name,
            wins,
        }))),
            (this.ships = {
                [player1Index]: [],
                [player2Index]: [],
            });
        this.filledCells = {
            [player1Index]: new Set<string>(),
            [player2Index]: new Set<string>(),
        };
        this.turn = 0;
        this.turnIndex = player1Index;
        this.randomShots = {
            [player1Index]: Array.from(randomShots),
            [player2Index]: Array.from(randomShots),
        };
        this.winPlayer = null;
    }

    changeTurn() {
        const turn = (this.turn + 1) % 2;
        this.turn = turn;
        this.turnIndex = this.playersIds[turn];
    }

    addShips(playerIndex: string, ships: IShip[]) {
        ships = addShipProps(ships);
        this.ships[playerIndex] = ships;
    }

    get isReady() {
        const [player1Index, player2Index] = this.playersIds;
        return (
            this.ships[player1Index].length === shipCount &&
            this.ships[player2Index].length === shipCount
        );
    }

    _getRivalIndex() {
        const [player1Index, player2Index] = this.playersIds;

        return this.turnIndex == player1Index ? player2Index : player1Index;
    }

    attack(playerIndex: string, x: number, y: number) {
        if (playerIndex != this.turnIndex) return [];

        const rivalIndex = this._getRivalIndex();

        const ships = this.ships[rivalIndex];

        const attackString = formatCoordinates(x, y);
        let attackCoordinates: string[] = [attackString];

        const isNewHit = !this.filledCells[playerIndex].has(attackString);

        let surrounding: number[][] = [];
        let status: TAttackStatus = "miss";
        const response: Array<{
            position: IPoint;
            currentPlayer: string;
            status: TAttackStatus;
        }> = [];

        for (let i = 0; i < ships.length; i++) {
            if (ships[i].coordinates.includes(attackString)) {
                if (ships[i].killed) {
                    status = "killed";
                    attackCoordinates = ships[i].coordinates;
                    break;
                }

                status = "shot";
                if (!ships[i].hits.includes(attackString)) {
                    ships[i].hits.push(attackString);
                }

                if (ships[i].hits.length == ships[i].length) {
                    status = "killed";
                    ships[i].killed = true;
                    attackCoordinates = ships[i].coordinates;
                    surrounding = ships[i].surrounding;
                }

                break;
            }
        }

        if (status == "miss" && isNewHit) {
            this.changeTurn();
        }

        surrounding.forEach(([x, y]) => {
            const surroundingString = formatCoordinates(x, y);

            this.filledCells[playerIndex].add(surroundingString);
            const attackString = formatCoordinates(x, y);

            const randomAttackIndex =
                this.randomShots[playerIndex].indexOf(attackString);
            if (randomAttackIndex != -1)
                this.randomShots[playerIndex].splice(randomAttackIndex, 1);

            response.push({
                position: { x, y },
                currentPlayer: playerIndex,
                // missed?
                status: "miss",
            });
        });

        const randomAttackIndex =
            this.randomShots[playerIndex].indexOf(attackString);

        this.filledCells[playerIndex].add(attackString);
        if (randomAttackIndex != -1)
            this.randomShots[playerIndex].splice(randomAttackIndex, 1);

        attackCoordinates.forEach((attackString) => {
            const [x, y] = attackString.split(";").map((x) => +x);
            this.filledCells[playerIndex].add(attackString);

            const randomAttackIndex =
                this.randomShots[playerIndex].indexOf(attackString);
            if (randomAttackIndex != -1)
                this.randomShots[playerIndex].splice(randomAttackIndex, 1);

            response.push({
                position: { x, y },
                currentPlayer: playerIndex,
                status,
            });
        });

        this._checkWinner();

        return response;
    }

    _checkWinner = () => {
        const [player1Index, player2Index] = this.playersIds;

        const isPlayer1Winner =
            this.ships[player2Index].filter((ship) => ship.killed).length ==
            shipCount;
        const isPlayer2Winner =
            this.ships[player1Index].filter((ship) => ship.killed).length ==
            shipCount;

        let winnerIndex = null;

        if (isPlayer1Winner) {
            this.winPlayer = player1Index;
            winnerIndex = player1Index;
        } else if (isPlayer2Winner) {
            this.winPlayer = player2Index;
            winnerIndex = player2Index;
        }
        this._setWinner(winnerIndex);
    };

    _setWinner(playerIndex: string | null) {
        if (playerIndex == null) return;

        const player = players.getPlayer(playerIndex);
        this.winPlayer = playerIndex;

        player.wins++;
    }

    randomAttack(playerIndex: string) {
        const randomShots = this.randomShots[this.turnIndex];
        if (randomShots.length == 0) return { x: 0, y: 0 };
        const randomIndex = randomInt(0, randomShots.length);
        const randomShot = randomShots[randomIndex];
        if (randomShot == undefined)
            throw new Error(MESSAGES.ERROR_RANDOM_SHOT_NOT_FOUND);
        const atack = randomShot.split(";");
        const x = +atack[0],
            y = +atack[1];

        return { x, y };
    }
}

const randomShots = (() => {
    const res = [];
    for (let i = 0; i < 100; i++) {
        const [x, y] = i < 10 ? "0" + i : "" + i;
        res.push(`${x};${y}`);
    }
    return res;
})();
