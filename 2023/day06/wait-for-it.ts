import * as fs from 'fs';
import { join } from 'path';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const times: number[] = lines[0]
  .split(':')[1]
  .trim()
  .split(' ')
  .filter((t) => t !== '')
  .map((t) => parseInt(t));
const distances: number[] = lines[1]
  .split(':')[1]
  .trim()
  .split(' ')
  .filter((d) => d !== '')
  .map((d) => parseInt(d));

const findProductOfNumberOfWaysPart1 = (): number => {
  let productOfNumberOfWays: number = 1;

  for (let i = 0; i < times.length; i++) {
    let numberOfWays: number = 0;
    for (let holdingTime = 1; holdingTime < times[i]; holdingTime++) {
      const distanceReached: number = holdingTime * (times[i] - holdingTime);
      if (distanceReached > distances[i]) {
        numberOfWays++;
      }
    }
    productOfNumberOfWays *= numberOfWays;
  }

  return productOfNumberOfWays;
};

const findNumberOfWaysPart2 = (): number => {
  let numberOfWays: number = 0;

  let timeStr: string = '';
  let distanceStr: string = '';
  for (let i = 0; i < times.length; i++) {
    timeStr += times[i];
    distanceStr += distances[i];
  }
  const time: number = parseInt(timeStr);
  const distance: number = parseInt(distanceStr);

  for (let holdingTime = 1; holdingTime < time; holdingTime++) {
    const distanceReached: number = holdingTime * (time - holdingTime);
    if (distanceReached > distance) {
      numberOfWays++;
    } else if (distanceReached < distance && numberOfWays > 0) {
      break;
    }
  }

  return numberOfWays;
};

console.log('Part 1:', findProductOfNumberOfWaysPart1());
console.log('Part 2:', findNumberOfWaysPart2());
