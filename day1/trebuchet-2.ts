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

function getCalibrationValue(line: string): number {
  const digits = convertLettersToDigits(line);
  if (digits.length) {
    return parseInt(digits[0] + digits[digits.length - 1]);
  } else {
    return 0;
  }
}

let sum = 0;

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    const lines = data.split('\n');
    for (const line of lines) {
      sum += getCalibrationValue(line);
    }
    console.log('The sum of all calibration values is ' + sum + '.');
  }
});
