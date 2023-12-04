import * as fs from 'fs';

let sumPoints = 0;
let sumCards = 0;

const cardsCount = new Map<number, number>();

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n').filter((line) => line !== '');

// Initialize cards count with the original cards
for (let i = 0; i < lines.length; i++) {
  cardsCount.set(i + 1, 1);
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const numbers = line.split(': ')[1];
  const winningNumbers: string[] = numbers
    .split(' |')[0]
    .split(' ')
    .filter((num) => num !== '');
  const numbersToCheck: string[] = numbers
    .split(' |')[1]
    .split(' ')
    .filter((num) => num !== '');
  const matchingNumbers: string[] = winningNumbers.filter((num) =>
    numbersToCheck.includes(num)
  );

  const points = matchingNumbers.length ? 2 ** (matchingNumbers.length - 1) : 0;
  sumPoints += points;

  const nbCopies = cardsCount.get(i + 1) ?? 0;
  for (let n: number = 1; n <= matchingNumbers.length; n++) {
    const currentCount = cardsCount.get(i + 1 + n) ?? 0;
    cardsCount.set(i + 1 + n, currentCount + nbCopies);
  }
  sumCards += nbCopies;
}

console.log('Part 1:', sumPoints);
console.log('Part 2:', sumCards);
