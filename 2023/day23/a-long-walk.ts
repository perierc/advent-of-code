import * as fs from 'fs';

type Grid = string[][];
type Direction = 'N' | 'E' | 'S' | 'W';

const DIRECTIONS: Record<Direction, [number, number]> = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
};

const SLOPE_DIRECTIONS: Record<string, [number, number]> = {
  '>': DIRECTIONS['E'],
  '<': DIRECTIONS['W'],
  '^': DIRECTIONS['N'],
  v: DIRECTIONS['S'],
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');
const grid: Grid = lines.map((line) => line.split(''));

const encode = (r: number, c: number): string => `${r},${c}`;

const dfs = (
  grid: Grid,
  r: number,
  c: number,
  steps: number,
  visited: Set<string>,
  dry: boolean = false
) => {
  if (r === grid.length - 1) {
    return steps;
  }
  if (visited.has(encode(r, c))) {
    return 0;
  }
  let maxSteps = 0;
  visited.add(encode(r, c));
  for (const [dr, dc] of Object.values(DIRECTIONS)) {
    const row = r + dr;
    const col = c + dc;
    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid[0].length ||
      grid[row][col] === '#' ||
      (!dry &&
        '^><v'.includes(grid[row][col]) &&
        (SLOPE_DIRECTIONS[grid[row][col]][0] !== dr ||
          SLOPE_DIRECTIONS[grid[row][col]][1] !== dc))
    ) {
      continue;
    }
    maxSteps = Math.max(maxSteps, dfs(grid, row, col, steps + 1, visited, dry));
  }
  visited.delete(encode(r, c));
  return maxSteps;
};

// Part 2 : We need a workaround to stop exceeding the maximum call stack size.
// We will reduce the grid to a weighted graph, the nodes being the intersections.

type Intersection = {
  row: number;
  col: number;
  N?: { distance: number; nextIntersection: Intersection };
  E?: { distance: number; nextIntersection: Intersection };
  S?: { distance: number; nextIntersection: Intersection };
  W?: { distance: number; nextIntersection: Intersection };
};

const getPathNeighbors = (grid: Grid, row: number, col: number): string[] => {
  return [
    grid[row - 1]?.[col],
    grid[row]?.[col + 1],
    grid[row + 1]?.[col],
    grid[row]?.[col - 1],
  ].filter((tile) => tile === '.');
};

const getIntersections = (grid: Grid): Intersection[] => {
  const startCol = grid[0].findIndex((tile) => tile === '.');
  const endCol = grid[grid.length - 1].findIndex((tile) => tile === '.');
  const intersections: Intersection[] = [
    { row: 0, col: startCol },
    { row: grid.length - 1, col: endCol },
  ];

  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === '.') {
        const neighbors = getPathNeighbors(grid, row, col);
        if (neighbors.length > 2) {
          intersections.push({ row, col });
        }
      }
    }
  }

  for (const intersection of intersections) {
    for (const direction of Object.keys(DIRECTIONS) as Direction[]) {
      const [dr, dc] = DIRECTIONS[direction];
      if (grid[intersection.row + dr]?.[intersection.col + dc] === '.') {
        let distance = 1;
        let lastRow = intersection.row;
        let lastCol = intersection.col;
        let newRow = intersection.row + dr;
        let newCol = intersection.col + dc;
        while (getPathNeighbors(grid, newRow, newCol).length === 2) {
          distance++;
          for (const [dr, dc] of Object.values(DIRECTIONS)) {
            if (
              grid[newRow + dr][newCol + dc] === '.' &&
              (newRow + dr !== lastRow || newCol + dc !== lastCol)
            ) {
              lastRow = newRow;
              lastCol = newCol;
              newRow += dr;
              newCol += dc;
              break;
            }
          }
        }
        intersection[direction] = {
          distance,
          nextIntersection: intersections.find(
            (i) => i.row === newRow && i.col === newCol
          )!,
        };
      }
    }
  }

  return intersections;
};

const dfsOnIntersections = (
  intersections: Intersection[],
  currentIntersection: Intersection,
  steps: number,
  visited: Set<string>
) => {
  if (currentIntersection.row === grid.length - 1) {
    return steps;
  }
  if (visited.has(encode(currentIntersection.row, currentIntersection.col))) {
    return 0;
  }
  let maxSteps = 0;
  visited.add(encode(currentIntersection.row, currentIntersection.col));
  for (const direction of ['N', 'E', 'S', 'W'] as Direction[]) {
    if (!currentIntersection[direction]) {
      continue;
    }
    maxSteps = Math.max(
      maxSteps,
      dfsOnIntersections(
        intersections,
        currentIntersection[direction]!.nextIntersection,
        steps + currentIntersection[direction]!.distance,
        visited
      )
    );
  }
  visited.delete(encode(currentIntersection.row, currentIntersection.col));
  return maxSteps;
};

const getLongestHikeDry = (grid: Grid) => {
  const gridWithoutSlopes = grid.map((row) =>
    row.map((tile) => ('^><v'.includes(tile) ? '.' : tile))
  );

  const intersections = getIntersections(gridWithoutSlopes);

  return dfsOnIntersections(
    intersections,
    intersections.find((i) => i.row === 0)!,
    0,
    new Set<string>()
  );
};

console.log(
  'Part 1:',
  dfs(
    grid,
    0,
    grid[0].findIndex((tile) => tile === '.'),
    0,
    new Set(),
    false
  )
);
console.log('Part 2:', getLongestHikeDry(grid));
