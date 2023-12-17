import * as fs from 'fs';
import { Heap } from 'heap-js';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

const DIRECTIONS: Record<Direction, [number, number]> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const grid: number[][] = input
  .split('\n')
  .map((line) => line.split('').map((block) => parseInt(block)));

const rows: number = grid.length;
const cols: number = grid[0].length;

const isInBounds = (row: number, col: number): boolean =>
  row >= 0 && row < rows && col >= 0 && col < cols;

const getMinHeatLoss = (
  minConsecutiveBlocks: number,
  maxConsecutiveBlocks: number
): number => {
  const heap: Heap<[number, number, number, Direction, number]> = new Heap(
    (a, b) => a[0] - b[0]
  );
  heap.push([0, 0, 0, 'RIGHT', 0]);
  const visitedBlocks: Set<string> = new Set<string>();
  while (!heap.isEmpty()) {
    const [heatLoss, row, col, currentDirection, stepsInCurrentDirection] =
      heap.pop()!;
    if (row === rows - 1 && col === cols - 1) {
      return heatLoss;
    }
    if (
      visitedBlocks.has(
        `${row},${col},${currentDirection},${stepsInCurrentDirection}`
      )
    ) {
      continue;
    }
    visitedBlocks.add(
      `${row},${col},${currentDirection},${stepsInCurrentDirection}`
    );
    for (const key of Object.keys(DIRECTIONS)) {
      const direction: Direction = key as Direction;
      if (direction === currentDirection) {
        const newRow = row + DIRECTIONS[direction][0];
        const newCol = col + DIRECTIONS[direction][1];
        if (
          isInBounds(newRow, newCol) &&
          stepsInCurrentDirection < maxConsecutiveBlocks
        ) {
          heap.push([
            heatLoss + grid[newRow][newCol],
            newRow,
            newCol,
            direction,
            stepsInCurrentDirection + 1,
          ]);
        }
      } else if (
        DIRECTIONS[direction][0] !== -DIRECTIONS[currentDirection][0] ||
        DIRECTIONS[direction][1] !== -DIRECTIONS[currentDirection][1]
      ) {
        const newRow = row + minConsecutiveBlocks * DIRECTIONS[direction][0];
        const newCol = col + minConsecutiveBlocks * DIRECTIONS[direction][1];
        if (isInBounds(newRow, newCol)) {
          let newHeatLoss: number = heatLoss;
          for (let i = 1; i <= minConsecutiveBlocks; i++) {
            newHeatLoss +=
              grid[row + i * DIRECTIONS[direction][0]][
                col + i * DIRECTIONS[direction][1]
              ];
          }
          heap.push([
            newHeatLoss,
            newRow,
            newCol,
            direction,
            minConsecutiveBlocks,
          ]);
        }
      }
    }
  }
  return -1;
};

console.log('Part 1:', getMinHeatLoss(1, 3));
console.log('Part 2:', getMinHeatLoss(4, 10));
