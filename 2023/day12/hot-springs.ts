import * as fs from 'fs';

let sumArrangementsPart1: number = 0;
let sumArrangementsPart2: number = 0;

const countCache: Map<string, number> = new Map();

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n').filter((line: string) => line != '');

const countArrangements = (
  springs: string[],
  springCounts: number[]
): number => {
  const key: string = springs.join('') + springCounts.join(',');
  if (countCache.has(key)) return countCache.get(key)!;

  if (springs.length === 0) {
    return springCounts.length === 0 ? 1 : 0;
  }
  if (springCounts.length === 0) {
    return springs.some((spring: string) => spring === '#') ? 0 : 1;
  }
  if (
    springCounts.reduce((a, b) => a + b, 0) >
    springs.reduce((acc, curr) => (curr === '.' ? acc : acc + 1), 0)
  ) {
    return 0;
  }

  let totalArrangements: number = 0;

  if (springs[0] === '.' || springs[0] === '?') {
    totalArrangements += countArrangements(
      springs.slice(1),
      springCounts.slice()
    );
  }

  if (springs[0] === '#' || springs[0] === '?') {
    if (
      springCounts[0] <= springs.length &&
      springs
        .slice(0, springCounts[0])
        .every((spring: string) => spring !== '.') &&
      springs[springCounts[0]] !== '#'
    ) {
      const newSprings: string[] = springs.slice(springCounts[0]);
      newSprings[0] = '.';
      totalArrangements += countArrangements(newSprings, springCounts.slice(1));
    }
  }

  countCache.set(key, totalArrangements);
  return totalArrangements;
};

for (const line of lines) {
  const springs: string[] = line.split(' ')[0].split('');
  const springCounts: number[] = line.split(' ')[1].split(',').map(Number);
  const expandedSprings: string[] = [];
  const expandedSpringCounts: number[] = [];
  for (let i: number = 0; i < 5; i++) {
    expandedSprings.push(...springs);
    if (i !== 4) expandedSprings.push('?');
    expandedSpringCounts.push(...springCounts);
  }

  sumArrangementsPart1 += countArrangements(springs, springCounts);
  sumArrangementsPart2 += countArrangements(
    expandedSprings,
    expandedSpringCounts
  );
}

console.log('Part 1:', sumArrangementsPart1);
console.log('Part 2:', sumArrangementsPart2);
