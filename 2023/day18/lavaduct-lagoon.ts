import * as fs from 'fs';

type Point = [number, number];

type Direction = 'U' | 'R' | 'D' | 'L';

const DIRECTIONS: Record<Direction, [number, number]> = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

const DIGIT_TO_DIRECTION: Record<string, Direction> = {
  '0': 'R',
  '1': 'D',
  '2': 'L',
  '3': 'U',
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const parseDirectionAndDistancePart1 = (line: string): [Direction, number] => {
  const direction: Direction = line.split(' ')[0] as Direction;
  const distance: number = parseInt(line.split(' ')[1]);

  return [direction, distance];
};

const parseDirectionAndDistancePart2 = (line: string): [Direction, number] => {
  const hexString: string = line.split(' ')[2];
  const hexcode: string = hexString.slice(2, hexString.length - 1);
  const distance: number = parseInt(hexcode.slice(0, 5), 16);
  const direction: Direction = DIGIT_TO_DIRECTION[hexcode.at(-1)!] as Direction;

  return [direction, distance];
};

const getLagoonVolume = (
  parseFunction: (line: string) => [Direction, number]
) => {
  const vertices: Point[] = [[0, 0]];
  let countBoundaryPoints: number = 0;

  for (const line of lines) {
    const [direction, distance] = parseFunction(line);
    const [x, y] = vertices[vertices.length - 1];
    vertices.push([
      x + DIRECTIONS[direction][0] * distance,
      y + DIRECTIONS[direction][1] * distance,
    ]);
    countBoundaryPoints += distance;
  }
  vertices.push([vertices[1][0], vertices[1][1]]);

  let volume: number = 0;

  for (let i = 1; i < vertices.length - 1; i++) {
    volume += vertices[i][0] * (vertices[i + 1][1] - vertices[i - 1][1]);
  }
  volume = Math.abs(volume) / 2 + countBoundaryPoints / 2 + 1;

  return volume;
};

console.log('Part 1:', getLagoonVolume(parseDirectionAndDistancePart1));
console.log('Part 2:', getLagoonVolume(parseDirectionAndDistancePart2));
