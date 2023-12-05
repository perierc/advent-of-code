import * as fs from 'fs';

type Map = {
  destination_range_start: number;
  source_range_start: number;
  range_length: number;
};

type SeedRange = {
  range_start: number;
  range_length: number;
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const sections: string[] = input.split('\n\n');

const categoriesMaps: Map[][] = Array(sections.length - 1)
  .fill(null)
  .map(() => []);
for (let i = 1; i < sections.length; i++) {
  const mapsStr = sections[i].split(':\n')[1].trim();
  for (const mapStr of mapsStr.split('\n')) {
    const [destination_range_start, source_range_start, range_length] =
      mapStr.split(' ');
    categoriesMaps[i - 1].push({
      destination_range_start: parseInt(destination_range_start),
      source_range_start: parseInt(source_range_start),
      range_length: parseInt(range_length),
    });
  }
}

const seedsStr = sections[0].split(': ')[1].trim();
const seedsStrList = seedsStr.split(' ');

const seeds: number[] = seedsStrList.map((seed) => parseInt(seed));

let seedRanges: SeedRange[] = [];
for (let i = 0; i < seedsStrList.length; i += 2) {
  seedRanges.push({
    range_start: parseInt(seedsStrList[i]),
    range_length: parseInt(seedsStrList[i + 1]),
  });
}

const findLowestLocationNumber1 = (): number => {
  let lowestLocationNumber1 = Infinity;
  for (const seed of seeds) {
    let currentValue = seed;
    for (const categoryMaps of categoriesMaps) {
      for (const map of categoryMaps) {
        if (
          currentValue >= map.source_range_start &&
          currentValue < map.source_range_start + map.range_length
        ) {
          currentValue =
            map.destination_range_start +
            (currentValue - map.source_range_start);
          break;
        }
      }
    }
    if (currentValue < lowestLocationNumber1) {
      lowestLocationNumber1 = currentValue;
    }
  }
  return lowestLocationNumber1;
};

const findLowestLocationNumber2 = (): number => {
  let location = 0;
  while (true) {
    let currentValue = location;
    for (let i = categoriesMaps.length - 1; i >= 0; i--) {
      for (const map of categoriesMaps[i]) {
        if (
          currentValue >= map.destination_range_start &&
          currentValue < map.destination_range_start + map.range_length
        ) {
          currentValue =
            map.source_range_start +
            (currentValue - map.destination_range_start);
          break;
        }
      }
    }
    for (const seedRange of seedRanges) {
      if (
        currentValue >= seedRange.range_start &&
        currentValue < seedRange.range_start + seedRange.range_length
      ) {
        return location;
      }
    }
    location += 1;
  }
};

console.log('Part 1:', findLowestLocationNumber1());
console.log('Part 2:', findLowestLocationNumber2());
