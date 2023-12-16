import * as fs from 'fs';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

const DIRECTIONS: Record<Direction, [number, number]> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const grid: string[][] = input.split('\n').map((line) => line.split(''));

const rows: number = grid.length;
const cols: number = grid[0].length;

const explore = (
  row: number,
  col: number,
  direction: Direction,
  visitedTiles: Direction[][][]
): void => {
  if (
    row < 0 ||
    row >= rows ||
    col < 0 ||
    col >= cols ||
    visitedTiles[row][col].includes(direction)
  ) {
    return;
  }
  visitedTiles[row][col].push(direction);
  const tile: string = grid[row][col];
  if (tile === '.') {
    explore(
      row + DIRECTIONS[direction][0],
      col + DIRECTIONS[direction][1],
      direction,
      visitedTiles
    );
  } else if (tile === '/') {
    let newDirection: Direction;
    switch (direction) {
      case 'UP':
        newDirection = 'RIGHT';
        break;
      case 'RIGHT':
        newDirection = 'UP';
        break;
      case 'DOWN':
        newDirection = 'LEFT';
        break;
      case 'LEFT':
        newDirection = 'DOWN';
        break;
    }
    explore(
      row + DIRECTIONS[newDirection][0],
      col + DIRECTIONS[newDirection][1],
      newDirection,
      visitedTiles
    );
  } else if (tile === '\\') {
    let newDirection: Direction;
    switch (direction) {
      case 'UP':
        newDirection = 'LEFT';
        break;
      case 'LEFT':
        newDirection = 'UP';
        break;
      case 'DOWN':
        newDirection = 'RIGHT';
        break;
      case 'RIGHT':
        newDirection = 'DOWN';
        break;
    }
    explore(
      row + DIRECTIONS[newDirection][0],
      col + DIRECTIONS[newDirection][1],
      newDirection,
      visitedTiles
    );
  } else if (tile === '|') {
    if (direction === 'UP' || direction === 'DOWN') {
      explore(
        row + DIRECTIONS[direction][0],
        col + DIRECTIONS[direction][1],
        direction,
        visitedTiles
      );
    } else {
      explore(
        row + DIRECTIONS['UP'][0],
        col + DIRECTIONS['UP'][1],
        'UP',
        visitedTiles
      );
      explore(
        row + DIRECTIONS['DOWN'][0],
        col + DIRECTIONS['DOWN'][1],
        'DOWN',
        visitedTiles
      );
    }
  } else if (tile === '-') {
    if (direction === 'LEFT' || direction === 'RIGHT') {
      explore(
        row + DIRECTIONS[direction][0],
        col + DIRECTIONS[direction][1],
        direction,
        visitedTiles
      );
    } else {
      explore(
        row + DIRECTIONS['LEFT'][0],
        col + DIRECTIONS['LEFT'][1],
        'LEFT',
        visitedTiles
      );
      explore(
        row + DIRECTIONS['RIGHT'][0],
        col + DIRECTIONS['RIGHT'][1],
        'RIGHT',
        visitedTiles
      );
    }
  }
  return;
};

const countEnergizedTiles = (visitedTiles: Direction[][][]): number => {
  let count: number = 0;
  for (const row of visitedTiles) {
    for (const tile of row) {
      if (tile.length > 0) {
        count++;
      }
    }
  }
  return count;
};

const countEnergizedTilesFromConfiguration = (
  row: number,
  col: number,
  direction: Direction
): number => {
  const visitedTiles: Direction[][][] = grid.map((line) => line.map(() => []));
  explore(row, col, direction, visitedTiles);
  return countEnergizedTiles(visitedTiles);
};

const countEnergizedTilesFromBestConfiguration = (): number => {
  let maxCount: number = 0;
  for (let row = 0; row < rows; row++) {
    const countFromLeft = countEnergizedTilesFromConfiguration(row, 0, 'RIGHT');
    if (countFromLeft > maxCount) {
      maxCount = countFromLeft;
    }
    const countFromRight = countEnergizedTilesFromConfiguration(
      row,
      cols - 1,
      'LEFT'
    );
    if (countFromRight > maxCount) {
      maxCount = countFromRight;
    }
  }
  for (let col = 0; col < cols; col++) {
    const countFromTop = countEnergizedTilesFromConfiguration(0, col, 'DOWN');
    if (countFromTop > maxCount) {
      maxCount = countFromTop;
    }
    const countFromBottom = countEnergizedTilesFromConfiguration(
      rows - 1,
      col,
      'UP'
    );
    if (countFromBottom > maxCount) {
      maxCount = countFromBottom;
    }
  }
  return maxCount;
};

console.log('Part 1:', countEnergizedTilesFromConfiguration(0, 0, 'RIGHT'));
console.log('Part 2:', countEnergizedTilesFromBestConfiguration());
