import type { IShip } from ".";
import { formatCoordinates } from "./format-coordinates";
import { getSurroundingCells } from "./get-surrounding-cells";

export const addShipProps = (ships: IShip[]): IShip[] => {
    return ships.map((ship) => {
        let { x, y } = ship.position;
        const isVertical = ship.direction;
        const length = ship.length;
        let coordinates = [];
        let surrounding = getSurroundingCells(x, y, length, isVertical);

        for (let i = 0; i < length; i++) {
            const coordinatesString = formatCoordinates(x, y);
            coordinates.push(coordinatesString);
            if (isVertical) {
                y++;
            } else {
                x++;
            }
        }

        return { ...ship, coordinates, hits: [], killed: false, surrounding };
    });
};
