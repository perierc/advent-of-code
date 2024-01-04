import * as fs from 'fs';

type Brick = {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const bricks: Brick[] = [];
for (const line of lines) {
  const [brickStart, brickEnd] = line.split('~');
  const brick: Brick = {
    startX: parseInt(brickStart.split(',')[0]),
    startY: parseInt(brickStart.split(',')[1]),
    startZ: parseInt(brickStart.split(',')[2]),
    endX: parseInt(brickEnd.split(',')[0]),
    endY: parseInt(brickEnd.split(',')[1]),
    endZ: parseInt(brickEnd.split(',')[2]),
  };
  bricks.push(brick);
}
bricks.sort((a, b) => a.startZ - b.startZ);

const encode = (x: number, y: number): string => `${x},${y}`;

const dropBricks = (
  bricks: Brick[],
  brickIndexToSkip: number | null = null
): number => {
  let falls: number = 0;
  const peaks: Map<string, number> = new Map();

  for (let i = 0; i < bricks.length; i++) {
    if (i === brickIndexToSkip) {
      continue;
    }

    const brick: Brick = bricks[i];
    const XYCoords: [number, number][] = [];
    for (let x = brick.startX; x <= brick.endX; x++) {
      for (let y = brick.startY; y <= brick.endY; y++) {
        XYCoords.push([x, y]);
      }
    }

    let base = 1;
    for (const [x, y] of XYCoords) {
      const key: string = encode(x, y);
      if (peaks.has(key)) {
        base = Math.max(base, peaks.get(key)! + 1);
      }
    }
    const peak = base + brick.endZ - brick.startZ;
    if (peak < brick.endZ) {
      falls++;
    }
    for (const [x, y] of XYCoords) {
      const key: string = encode(x, y);
      peaks.set(key, peak);
    }
    brick.startZ = base;
    brick.endZ = peak;
  }

  return falls;
};

dropBricks(bricks);

let disintegrableBricks: number = 0;
let sumFallingBricks: number = 0;
for (let i = 0; i < bricks.length; i++) {
  const bricksCopy: Brick[] = bricks.map((brick) => ({ ...brick }));
  const fallingBricks: number = dropBricks(bricksCopy, i);
  sumFallingBricks += fallingBricks;
  disintegrableBricks += fallingBricks === 0 ? 1 : 0;
}

console.log('Part 1:', disintegrableBricks);
console.log('Part 2:', sumFallingBricks);
