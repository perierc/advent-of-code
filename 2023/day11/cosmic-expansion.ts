import * as fs from 'fs';

type Coords = [number, number];

const input: string = fs.readFileSync('./input.txt', 'utf8');
const space: string[][] = input
  .split('\n')
  .filter((row: string) => row != '')
  .map((row: string) => row.split(''));

// Store rows and cols to expand in space
const rowIndicesToExpand: number[] = [];
for (let row: number = 0; row < space.length; row++) {
  if (space[row].every((cell: string) => cell === '.')) {
    rowIndicesToExpand.push(row);
  }
}
const colIndicesToExpand: number[] = [];
for (let col: number = 0; col < space.length; col++) {
  if (space.every((row: string[]) => row[col] === '.')) {
    colIndicesToExpand.push(col);
  }
}

// Store the galaxies coordinates
const galaxyCoords: Coords[] = [];
for (let row: number = 0; row < space.length; row++) {
  for (let col: number = 0; col < space[0].length; col++) {
    if (space[row][col] === '#') {
      galaxyCoords.push([row, col]);
    }
  }
}

const findShortestPathLength = (
  galaxyIndex1: number,
  galaxyIndex2: number,
  expansionFactor: number
): number => {
  const [row1, col1]: Coords = galaxyCoords[galaxyIndex1];
  const [row2, col2]: Coords = galaxyCoords[galaxyIndex2];
  let dist = Math.abs(row1 - row2) + Math.abs(col1 - col2);
  for (
    let rowIndex: number = 0;
    rowIndex < rowIndicesToExpand.length;
    rowIndex++
  ) {
    if (
      rowIndicesToExpand[rowIndex] > Math.min(row1, row2) &&
      rowIndicesToExpand[rowIndex] < Math.max(row1, row2)
    ) {
      dist += expansionFactor - 1;
    }
  }
  for (
    let colIndex: number = 0;
    colIndex < colIndicesToExpand.length;
    colIndex++
  ) {
    if (
      colIndicesToExpand[colIndex] > Math.min(col1, col2) &&
      colIndicesToExpand[colIndex] < Math.max(col1, col2)
    ) {
      dist += expansionFactor - 1;
    }
  }
  return dist;
};

let sumShortestPathLengthsPart1: number = 0;
let sumShortestPathLengthsPart2: number = 0;
for (let i = 0; i < galaxyCoords.length; i++) {
  for (let j = i + 1; j < galaxyCoords.length; j++) {
    sumShortestPathLengthsPart1 += findShortestPathLength(i, j, 2);
    sumShortestPathLengthsPart2 += findShortestPathLength(i, j, 1000000);
  }
}

console.log('Part 1:', sumShortestPathLengthsPart1);
console.log('Part 2:', sumShortestPathLengthsPart2);
