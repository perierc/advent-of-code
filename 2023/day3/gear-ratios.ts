import { log } from 'console';
import * as fs from 'fs';

const isNumber = (value: string): boolean => {
  return !isNaN(parseInt(value));
};

let sum1: number = 0;
let sumGearRatios: number = 0;

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const ROWS: number = lines.length;
const COLS: number = lines[0].length;
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
];

const visited: boolean[][] = Array(ROWS)
  .fill(null)
  .map(() => Array(COLS).fill(false));

const checkIfPartNumber = (r: number, c: number): void => {
  let numberDigits = 1;
  visited[r][c] = true;
  while (c + numberDigits < COLS && isNumber(lines[r][c + numberDigits])) {
    visited[r][c + numberDigits] = true;
    numberDigits++;
  }
  for (let col = c; col < c + numberDigits; col++) {
    for (const [dr, dc] of DIRECTIONS) {
      const newRow = r + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        lines[newRow][newCol] != '.' &&
        !isNumber(lines[newRow][newCol])
      ) {
        sum1 += parseInt(lines[r].substring(c, c + numberDigits));
        return;
      }
    }
  }
};

const checkIfGear = (r: number, c: number): void => {
  if (lines[r][c] != '*') return;
  const numbers: number[] = [];
  const visitedAdjacentCells: number[][] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const newRow = r + dr;
    const newCol = c + dc;
    if (
      visitedAdjacentCells.some(
        (cell) => cell[0] == newRow && cell[1] == newCol
      )
    )
      continue;
    if (
      newRow >= 0 &&
      newRow < ROWS &&
      newCol >= 0 &&
      newCol < COLS &&
      isNumber(lines[newRow][newCol])
    ) {
      let startCol = newCol;
      while (startCol - 1 >= 0 && isNumber(lines[newRow][startCol - 1])) {
        startCol--;
      }
      let endCol = newCol;
      while (endCol + 1 < COLS && isNumber(lines[newRow][endCol + 1])) {
        endCol++;
      }
      const number = parseInt(lines[newRow].substring(startCol, endCol + 1));
      numbers.push(number);
      for (let col = startCol; col <= endCol; col++) {
        visitedAdjacentCells.push([newRow, col]);
      }
    }
  }
  if (numbers.length == 2) {
    sumGearRatios += numbers[0] * numbers[1];
  }
  return;
};

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    checkIfGear(r, c);
    if (isNumber(lines[r][c]) && !visited[r][c]) {
      checkIfPartNumber(r, c);
    }
  }
}

console.log('Part 1:', sum1);
console.log('Part 2:', sumGearRatios);
