const isInBounary = (x: number, y: number) =>
    x > -1 && x < 10 && y > -1 && y < 10;

export const getSurroundingCells = (
    x: number,
    y: number,
    length: number,
    isVertical: boolean
): number[][] => {
    const surround = [];

    let top = y - 1;
    let left = x - 1;
    let right = isVertical ? x + 2 : x + length + 1;
    let bottom = isVertical ? y + length + 1 : y + 2;

    for (let t = top; t < bottom; t++) {
        for (let l = left; l < right; l++) {
            if (isInBounary(l, t)) surround.push([l, t]);
        }
    }

    return surround;
};
