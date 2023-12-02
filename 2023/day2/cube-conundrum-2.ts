import * as fs from 'fs';

type Bag = {
  [color: string]: number;
};

const colors = ['red', 'green', 'blue'];

let powers: number[] = [];

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

for (const line of lines) {
  const minimalBag: Bag = { red: 0, green: 0, blue: 0 };
  const [idStr, setsStr] = line.split(': ');
  const sets: string[] = setsStr.split('; ');

  for (const set of sets) {
    for (const color of colors) {
      const colorRegex = new RegExp(`\\d+ ${color}`);
      const colorStr = set.match(colorRegex)?.[0];
      if (colorStr) {
        const colorCount = parseInt(colorStr.split(' ')[0]);
        if (colorCount > minimalBag[color]) {
          minimalBag[color] = colorCount;
        }
      }
    }
  }

  const power = minimalBag.red * minimalBag.green * minimalBag.blue;
  powers.push(power);
}

const sumOfPowers = powers.reduce((acc, curr) => acc + curr, 0);
console.log('The sum of powers is ' + sumOfPowers + '.');
