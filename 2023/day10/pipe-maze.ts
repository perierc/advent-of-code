import * as fs from 'fs';

const TILE_TO_DIRECTIONS: Record<string, [number, number][]> = {
  '|': [
    [-1, 0],
    [1, 0],
  ],
  '-': [
    [0, -1],
    [0, 1],
  ],
  L: [
    [0, 1],
    [-1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  '7': [
    [0, -1],
    [1, 0],
  ],
  F: [
    [0, 1],
    [1, 0],
  ],
  S: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  '.': [],
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const grid: string[][] = input
  .split('\n')
  .filter((row: string) => row != '')
  .map((row: string) => row.split(''));
const rows: number = grid.length;
const cols: number = grid[0].length;

const findStartCoords = (): [number, number] => {
  for (let row: number = 0; row < rows; row++) {
    for (let col: number = 0; col < cols; col++) {
      if (grid[row][col] == 'S') {
        return [row, col];
      }
    }
  }
  throw new Error('No start found');
};

const getDistancesFromStart = (
  startRow: number,
  startCol: number
): number[][] => {
  const distances: number[][] = [];
  for (let row: number = 0; row < rows; row++) {
    distances.push([]);
    for (let col: number = 0; col < cols; col++) {
      distances[row].push(-1);
    }
  }
  distances[startRow][startCol] = 0;
  const queue: [number, number][] = [[startRow, startCol]];
  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    const distance: number = distances[row][col];
    for (const [dRow, dCol] of TILE_TO_DIRECTIONS[grid[row][col]]) {
      const nextRow: number = row + dRow;
      const nextCol: number = col + dCol;
      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols &&
        distances[nextRow][nextCol] == -1 &&
        TILE_TO_DIRECTIONS[grid[nextRow][nextCol]].some(
          ([dr, dc]: [number, number]) => dr == -dRow && dc == -dCol
        )
      ) {
        distances[nextRow][nextCol] = distance + 1;
        queue.push([nextRow, nextCol]);
      }
    }
  }
  return distances;
};

const findMaxDistance = (distances: number[][]): number => {
  let maxDistance: number = 0;
  for (const row of distances) {
    for (const distance of row) {
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
  }
  return maxDistance;
};

const [startRow, startCol] = findStartCoords();
const distancesFromStart = getDistancesFromStart(startRow, startCol);
const maxDistance = findMaxDistance(distancesFromStart);

const replaceS = (): void => {
  const possiblePipes = new Set<string>(['|', '-', 'L', 'J', '7', 'F']);

  for (const [dRow, dCol] of TILE_TO_DIRECTIONS[grid[startRow][startCol]]) {
    const nextRow: number = startRow + dRow;
    const nextCol: number = startCol + dCol;
    if (
      nextRow >= 0 &&
      nextRow < rows &&
      nextCol >= 0 &&
      nextCol < cols &&
      TILE_TO_DIRECTIONS[grid[nextRow][nextCol]].some(
        ([dr, dc]: [number, number]) => dr == -dRow && dc == -dCol
      )
    ) {
      if (dRow == -1) {
        possiblePipes.delete('-');
        possiblePipes.delete('7');
        possiblePipes.delete('F');
      }
      if (dRow == 1) {
        possiblePipes.delete('-');
        possiblePipes.delete('L');
        possiblePipes.delete('J');
      }
      if (dCol == -1) {
        possiblePipes.delete('|');
        possiblePipes.delete('L');
        possiblePipes.delete('F');
      }
      if (dCol == 1) {
        possiblePipes.delete('|');
        possiblePipes.delete('J');
        possiblePipes.delete('7');
      }
    }
  }

  grid[startRow][startCol] = Array.from(possiblePipes)[0];
};

const replaceJunkPipes = (): void => {
  for (let row: number = 0; row < rows; row++) {
    for (let col: number = 0; col < cols; col++) {
      if (distancesFromStart[row][col] === -1) {
        grid[row][col] = '.';
      }
    }
  }
};

const getNumberOfEnclosedTiles = (): number => {
  let enclosedTiles: number = 0;

  for (let row: number = 0; row < rows; row++) {
    let withinEnclosure: boolean = false;
    let up: boolean | null = null;
    for (let col: number = 0; col < cols; col++) {
      const char = grid[row][col];
      if (char === '|') {
        withinEnclosure = !withinEnclosure;
      } else if ('LF'.includes(char)) {
        up = char === 'L';
      } else if ('7J'.includes(char)) {
        if (char != (up ? 'J' : '7')) withinEnclosure = !withinEnclosure;
        up = null;
      }
      if (withinEnclosure && distancesFromStart[row][col] === -1) {
        enclosedTiles++;
      }
    }
  }

  return enclosedTiles;
};

replaceS();
replaceJunkPipes();
const nbEnclosedTiles = getNumberOfEnclosedTiles();

console.log('Part 1:', maxDistance);
console.log('Part 2:', nbEnclosedTiles);
