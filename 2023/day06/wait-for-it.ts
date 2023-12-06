import * as fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const findProductOfNumberOfWaysPart1 = (): number => {
  let productOfNumberOfWays: number = 1;

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

  const time: number = parseInt(
    lines[0].split(':')[1].trim().split(' ').join('')
  );
  const distance: number = parseInt(
    lines[1].split(':')[1].trim().split(' ').join('')
  );

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
