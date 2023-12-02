import * as fs from 'fs';

const SPELLED_OUT_NUMBER_TO_DIGIT: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

function getCalibrationValue1(line: string): number {
  const firstDigit = line.match(/\d/)?.[0];
  const lastDigit = line.match(/\d(?!.*\d)/)?.[0];
  if (firstDigit && lastDigit) {
    return parseInt(firstDigit + lastDigit);
  } else {
    return 0;
  }
}

function convertLettersToDigits(line: string): string {
  let result = '';
  for (let i = 0; i < line.length; i++) {
    for (const spelledOutNumber in SPELLED_OUT_NUMBER_TO_DIGIT) {
      if (line[i] === SPELLED_OUT_NUMBER_TO_DIGIT[spelledOutNumber]) {
        result += SPELLED_OUT_NUMBER_TO_DIGIT[spelledOutNumber];
      } else if (line.startsWith(spelledOutNumber, i)) {
        result += SPELLED_OUT_NUMBER_TO_DIGIT[spelledOutNumber];
      }
    }
  }
  return result;
}

function getCalibrationValue2(line: string): number {
  const digits = convertLettersToDigits(line);
  if (digits.length) {
    return parseInt(digits[0] + digits[digits.length - 1]);
  } else {
    return 0;
  }
}

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

let sum1 = 0;
let sum2 = 0;

for (const line of lines) {
  sum1 += getCalibrationValue1(line);
  sum2 += getCalibrationValue2(line);
}

console.log('Part 1:', sum1);
console.log('Part 2:', sum2);
