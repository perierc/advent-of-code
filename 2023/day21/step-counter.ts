import * as fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const grid: string[][] = input.split('\n').map((line) => line.split(''));

const encode = (r: number, c: number): string => {
  return r + ',' + c;
};

const decode = (hash: string): number[] => {
  return hash.split(',').map(Number);
};

const countReachablePlots = (grid: string[][], nbSteps: number): number => {
  let gridCopy = grid.map((line) => [...line]);
  const size = gridCopy.length;
  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const startRow = gridCopy.findIndex((row) => row.includes('S'));
  const startCol = gridCopy[startRow].findIndex((char) => char === 'S');
  gridCopy[startRow][startCol] = '.';

  let reachablePlots = new Set<string>();
  reachablePlots.add(encode(startRow, startCol));
  for (let i = 0; i < nbSteps; i++) {
    const newReachablePlots = new Set<string>();
    for (const plot of reachablePlots.values()) {
      const [r, c] = decode(plot);
      for (const [dr, dc] of neighbors) {
        const row = r + dr;
        const col = c + dc;
        const virtualRow = ((row % size) + size) % size;
        const virtualCol = ((col % size) + size) % size;
        if (gridCopy[virtualRow][virtualCol] === '.')
          newReachablePlots.add(encode(row, col));
      }
    }
    reachablePlots = newReachablePlots;
  }
  return reachablePlots.size;
};

/**
 * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
 *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
 * so the coefficients are:
 * a = y0/2 - y1 + y2/2
 * b = -3*y0/2 + 2*y1 - y2/2
 * c = y0
 */
const simplifiedLagrange = (values: number[]) => {
  return {
    a: values[0] / 2 - values[1] + values[2] / 2,
    b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
    c: values[0],
  };
};

const solvePart2 = (grid: string[][]): number => {
  const values = [
    countReachablePlots(grid, 65),
    countReachablePlots(grid, 65 + 131),
    countReachablePlots(grid, 65 + 131 * 2),
  ];
  const poly = simplifiedLagrange(values);
  const target = (26_501_365 - 65) / 131;
  return poly.a * target * target + poly.b * target + poly.c;
};

console.log('Part 1:', countReachablePlots(grid, 64));
console.log('Part 2:', solvePart2(grid));
