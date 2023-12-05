import * as fs from 'fs';

type Bag = {
  [color: string]: number;
};

const bag: Bag = { red: 12, green: 13, blue: 14 };
const colors = Object.keys(bag);

let sumPossibleIds = 0;
let sumPowers = 0;

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

for (const line of lines) {
  let isPossible = true;
  const minimalBag: Bag = { red: 0, green: 0, blue: 0 };
  const [idStr, setsStr] = line.split(': ');
  const sets: string[] = setsStr.split('; ');

  for (const set of sets) {
    for (const color of colors) {
      const colorRegex = new RegExp(`\\d+ ${color}`);
      const colorStr = set.match(colorRegex)?.[0];
      if (colorStr) {
        const colorCount = parseInt(colorStr.split(' ')[0]);
        if (colorCount > bag[color]) {
          isPossible = false;
        }
        if (colorCount > minimalBag[color]) {
          minimalBag[color] = colorCount;
        }
      }
    }
  }

  if (isPossible) {
    sumPossibleIds += parseInt(idStr.split(' ')[1]);
  }
  const power = minimalBag.red * minimalBag.green * minimalBag.blue;
  sumPowers += power;
}

console.log('Part 1:', sumPossibleIds);
console.log('Part 2:', sumPowers);
