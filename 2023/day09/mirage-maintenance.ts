import * as fs from 'fs';

let sumNextValues: number = 0;
let sumPreviousValues: number = 0;

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

for (const line of lines) {
  const history: number[] = line
    .split(' ')
    .map((value: string) => parseInt(value));
  let sequences: number[][] = [history];
  while (sequences[sequences.length - 1].some((value: number) => value != 0)) {
    const sequence: number[] = sequences[sequences.length - 1];
    let nextSequence: number[] = [];
    for (let i: number = 0; i < sequence.length - 1; i++) {
      nextSequence.push(sequence[i + 1] - sequence[i]);
    }
    sequences.push(nextSequence);
  }
  let currentNextValue: number = 0;
  let currentPreviousValue: number = 0;
  for (let i = sequences.length - 2; i >= 0; i--) {
    currentNextValue += sequences[i][sequences[i].length - 1];
    currentPreviousValue = sequences[i][0] - currentPreviousValue;
  }
  sumNextValues += currentNextValue;
  sumPreviousValues += currentPreviousValue;
}

console.log('Part 1:', sumNextValues);
console.log('Part 2:', sumPreviousValues);
