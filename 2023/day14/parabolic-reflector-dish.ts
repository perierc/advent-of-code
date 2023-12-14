import * as fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const platform: string[][] = input.split('\n').map((row) => row.split(''));

const tiltNorth = (platform: string[][]) => {
  for (let col = 0; col < platform[0].length; col++) {
    const rocksToMove: number[] = [];
    for (let row = platform.length - 1; row >= 0; row--) {
      if (platform[row][col] === 'O') {
        rocksToMove.push(row);
      }
      if (platform[row][col] === '#' || row === 0) {
        let offset = platform[row][col] === '#' ? 1 : 0;
        while (rocksToMove.length) {
          const rockRow = rocksToMove.pop()!;
          platform[rockRow][col] = '.';
          platform[row + offset][col] = 'O';
          offset++;
        }
      }
    }
  }
};

const tiltSouth = (platform: string[][]) => {
  for (let col = 0; col < platform[0].length; col++) {
    const rocksToMove: number[] = [];
    for (let row = 0; row < platform.length; row++) {
      if (platform[row][col] === 'O') {
        rocksToMove.push(row);
      }
      if (platform[row][col] === '#' || row === platform.length - 1) {
        let offset = platform[row][col] === '#' ? 1 : 0;
        while (rocksToMove.length) {
          const rockRow = rocksToMove.pop()!;
          platform[rockRow][col] = '.';
          platform[row - offset][col] = 'O';
          offset++;
        }
      }
    }
  }
};

const tiltEast = (platform: string[][]) => {
  for (let row = 0; row < platform.length; row++) {
    const rocksToMove: number[] = [];
    for (let col = 0; col < platform[0].length; col++) {
      if (platform[row][col] === 'O') {
        rocksToMove.push(col);
      }
      if (platform[row][col] === '#' || col === platform[0].length - 1) {
        let offset = platform[row][col] === '#' ? 1 : 0;
        while (rocksToMove.length) {
          const rockCol = rocksToMove.pop()!;
          platform[row][rockCol] = '.';
          platform[row][col - offset] = 'O';
          offset++;
        }
      }
    }
  }
};

const tiltWest = (platform: string[][]) => {
  for (let row = 0; row < platform.length; row++) {
    const rocksToMove: number[] = [];
    for (let col = platform[0].length - 1; col >= 0; col--) {
      if (platform[row][col] === 'O') {
        rocksToMove.push(col);
      }
      if (platform[row][col] === '#' || col === 0) {
        let offset = platform[row][col] === '#' ? 1 : 0;
        while (rocksToMove.length) {
          const rockCol = rocksToMove.pop()!;
          platform[row][rockCol] = '.';
          platform[row][col + offset] = 'O';
          offset++;
        }
      }
    }
  }
};

const runSpinCycle = (platform: string[][]) => {
  tiltNorth(platform);
  tiltWest(platform);
  tiltSouth(platform);
  tiltEast(platform);
};

const stringifyPlatform = (platform: string[][]): string => {
  return platform.map((row) => row.join('')).join('\n');
};

const getTotalLoad = (platform: string[][]): number => {
  let totalLoad = 0;

  for (let row = 0; row < platform.length; row++) {
    for (let col = 0; col < platform[0].length; col++) {
      if (platform[row][col] === 'O') {
        totalLoad += platform.length - row;
      }
    }
  }

  return totalLoad;
};

const getTotalLoadAfterSpinCycles = (
  platform: string[][],
  nbCycles: number
) => {
  const platformToSpins = new Map<string, number>();
  let spins = 0;

  while (spins < nbCycles) {
    if (platformToSpins.has(stringifyPlatform(platform))) {
      const cycleLength =
        spins - platformToSpins.get(stringifyPlatform(platform))!;
      const remainingSpins = nbCycles - spins;
      const newRemainingSpins = remainingSpins % cycleLength;
      spins = nbCycles - newRemainingSpins;
      if (spins === nbCycles) {
        break;
      }
    }
    platformToSpins.set(stringifyPlatform(platform), spins);
    runSpinCycle(platform);
    spins++;
  }

  return getTotalLoad(platform);
};

const platformPart1: string[][] = platform.map((row) => [...row]);
tiltNorth(platformPart1);

const platformPart2: string[][] = platform.map((row) => [...row]);

console.log('Part 1:', getTotalLoad(platformPart1));
console.log('Part 2:', getTotalLoadAfterSpinCycles(platformPart2, 1000000000));
