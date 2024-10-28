import { createHmac } from "crypto";
import { Entity } from "../entity";
import { MESSAGES } from "@/battleship/constants";

export interface IPlayer {
    name: string;
    wins: number;
    password: string;
}

const hashString = (secret: string, string: string) => {
    const algorithm = "sha256";
    const digest = "hex";
    return createHmac(algorithm, secret).update(string).digest(digest);
};

export class Players extends Entity<IPlayer> {
    addPlayer(
        item: Pick<IPlayer, "name" | "password">
    ): [null | string, { name: string; error: boolean; errorText: string }] {
        const { name, password } = item;

        const storedPlayer = this.getPlayerByName(name);

        if (storedPlayer != null) {
            const isCredentialsCorrect = this.isCredentialsCorrect(item);

            if (!isCredentialsCorrect) {
                return [
                    null,
                    {
                        name,
                        error: true,
                        errorText: MESSAGES.ERROR_CREDENTIALS,
                    },
                ];
            } else {
                const [playerIndex, player] = storedPlayer;
                return [
                    playerIndex,
                    {
                        name: player.name,
                        error: false,
                        errorText: "",
                    },
                ];
            }
        } else {
            const passwordHash = hashString(name, password);

            const player = { name, password: passwordHash, wins: 0 };

            const [playerIndex] = this.add(player);

            return [
                playerIndex,
                {
                    name,
                    error: false,
                    errorText: "",
                },
            ];
        }
    }

    isNameAvailable = (name: string) => {
        return Array.from(this._entities.values()).every(
            ({ name: playerName }) => playerName !== name
        );
    };

    getPlayerByName = (name: string) => {
        const filterResult = Array.from(this._entities.entries()).filter(
            ([_index, player]) => {
                return player.name === name;
            }
        );

        const player = filterResult.length > 0 ? filterResult[0] : null;
        return player;
    };

    isCredentialsCorrect = ({
        name,
        password,
    }: Pick<IPlayer, "name" | "password">) => {
        const storedPlayer = this.getPlayerByName(name);

        if (storedPlayer == null) return true;

        const [_playerIndex, player] = storedPlayer;

        const hash = hashString(name, password);
        const result = hash === player?.password;
        return result;
    };

    getWinners() {
        return Array.from(this._entities.values()).map(({ name, wins }) => ({
            name,
            wins,
        }));
    }

    getPlayer(playerIndex: string): IPlayer {
        const player = this._entities.get(playerIndex);
        if (player == undefined)
            throw new Error(MESSAGES.ERROR_PLAYER_NOT_FOUND);
        return player;
    }

    _getPrintData() {
        return Array.from(this._entities.entries()).map(
            ([index, { name }]) => ({ index, name })
        );
    }
}

export const players = new Players("Players");
