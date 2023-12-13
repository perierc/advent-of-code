import * as fs from 'fs';

const getSumRowsBeforeHorizontalLineOfReflection = (
  pattern: string[]
): number => {
  let sumRows: number = 0;
  for (let row = 0; row < pattern.length - 1; row++) {
    let top: number = row;
    let bottom: number = row + 1;
    let isMirror: boolean = true;
    while (top >= 0 && bottom < pattern.length) {
      if (pattern[top] !== pattern[bottom]) {
        isMirror = false;
        top = -1;
        break;
      }
      top--;
      bottom++;
    }
    if (isMirror) {
      sumRows += row + 1;
    }
  }
  return sumRows;
};

const getSumColsBeforeVerticalLineOfReflection = (
  pattern: string[]
): number => {
  let sumCols: number = 0;
  for (let col = 0; col < pattern[0].length - 1; col++) {
    let left: number = col;
    let right: number = col + 1;
    let isMirror: boolean = true;
    while (left >= 0 && right < pattern[0].length) {
      for (let row = 0; row < pattern.length; row++) {
        if (pattern[row][left] !== pattern[row][right]) {
          isMirror = false;
          left = -1;
          break;
        }
      }
      left--;
      right++;
    }
    if (isMirror) {
      sumCols += col + 1;
    }
  }
  return sumCols;
};

const findSmudgeForHorizontalLineOfReflectionAndGetRowsBefore = (
  pattern: string[]
): number => {
  for (let row = 0; row < pattern.length - 1; row++) {
    let top: number = row;
    let bottom: number = row + 1;
    let nbSmudges: number = 0;
    while (top >= 0 && bottom < pattern.length) {
      for (let col = 0; col < pattern[0].length; col++) {
        if (pattern[top][col] !== pattern[bottom][col]) {
          nbSmudges++;
        }
      }
      top--;
      bottom++;
    }
    if (nbSmudges === 1) {
      return row + 1;
    }
  }
  return 0;
};

const findSmudgeForVerticalLineOfReflectionAndGetColsBefore = (
  pattern: string[]
): number => {
  for (let col = 0; col < pattern[0].length - 1; col++) {
    let left: number = col;
    let right: number = col + 1;
    let nbSmudges: number = 0;
    while (left >= 0 && right < pattern[0].length) {
      for (let row = 0; row < pattern.length; row++) {
        if (pattern[row][left] !== pattern[row][right]) {
          nbSmudges++;
        }
      }
      left--;
      right++;
    }
    if (nbSmudges === 1) {
      return col + 1;
    }
  }
  return 0;
};

let sumPart1: number = 0;
let sumPart2: number = 0;

const input: string = fs.readFileSync('./input.txt', 'utf8');
const patterns: string[] = input.split('\n\n');

for (const patternStr of patterns) {
  const pattern: string[] = patternStr.split('\n');
  sumPart1 += 100 * getSumRowsBeforeHorizontalLineOfReflection(pattern);
  sumPart1 += getSumColsBeforeVerticalLineOfReflection(pattern);
  sumPart2 +=
    100 * findSmudgeForHorizontalLineOfReflectionAndGetRowsBefore(pattern);
  sumPart2 += findSmudgeForVerticalLineOfReflectionAndGetColsBefore(pattern);
}

console.log('Part 1:', sumPart1);
console.log('Part 2:', sumPart2);
