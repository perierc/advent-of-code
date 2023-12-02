import * as fs from 'fs';

type Bag = {
  [color: string]: number;
};

const bag: Bag = { red: 12, green: 13, blue: 14 };
const colors = Object.keys(bag);

let sumPossibleIds = 0;

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

for (const line of lines) {
  let isPossible = true;
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
          break;
        }
      }
    }
  }
  if (isPossible) {
    sumPossibleIds += parseInt(idStr.split(' ')[1]);
  }
}

console.log('The sum of all possible game ids is ' + sumPossibleIds + '.');
