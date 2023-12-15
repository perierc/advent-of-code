import * as fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const sequence: string[] = input.split(',');

const hash = (str: string): number => {
  let result: number = 0;

  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i);
    result *= 17;
    result %= 256;
  }

  return result;
};

let sumHashes: number = 0;
let sumFocusingPowers: number = 0;

const boxes: Record<number, [string, number][]> = {};

for (const str of sequence) {
  sumHashes += hash(str);

  let label: string = '';
  let i = 0;
  while (!'=-'.includes(str[i])) {
    label += str[i];
    i++;
  }
  const box: number = hash(label);
  if (str[i] === '-') {
    if (!boxes[box]) {
      continue;
    }
    boxes[box] = boxes[box].filter(([l]) => l !== label);
  }
  if (str[i] === '=') {
    const focalLength = parseInt(str.slice(i + 1));
    if (!boxes[box]) {
      boxes[box] = [];
    }
    if (boxes[box].some(([l]) => l === label)) {
      boxes[box].splice(
        boxes[box].findIndex(([l]) => l === label),
        1,
        [label, focalLength]
      );
    } else {
      boxes[box].push([label, focalLength]);
    }
  }
}

for (const box of Object.keys(boxes)) {
  const boxNumber = parseInt(box);
  const boxFocusingPower: number = boxes[boxNumber].reduce(
    (acc, [_, focalLength], i) => acc + (1 + boxNumber) * (i + 1) * focalLength,
    0
  );
  sumFocusingPowers += boxFocusingPower;
}

console.log('Part 1:', sumHashes);
console.log('Part 2:', sumFocusingPowers);
