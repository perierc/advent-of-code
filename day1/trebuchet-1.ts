import * as fs from 'fs';

function getCalibrationValue(line: string): number {
  const firstDigit = line.match(/\d/);
  const lastDigit = line.match(/\d(?!.*\d)/);
  if (firstDigit && lastDigit) {
    return parseInt(firstDigit[0] + lastDigit[0]);
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
