import * as fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n').filter((line) => line !== '');

const instructions = lines[0];
const network = lines.slice(1);

type NodeNeighbors = {
  left: string;
  right: string;
};

const nodeNeighbors = new Map<string, NodeNeighbors>();
for (const nodeAndNeighbors of network) {
  const node = nodeAndNeighbors.slice(0, 3);
  const left = nodeAndNeighbors.slice(7, 10);
  const right = nodeAndNeighbors.slice(12, 15);
  nodeNeighbors.set(node, { left, right });
}

const getNextNode = (currentNode: string, instruction: string): string => {
  if (instruction === 'L') {
    return nodeNeighbors.get(currentNode)!.left;
  } else if (instruction === 'R') {
    return nodeNeighbors.get(currentNode)!.right;
  }
  return '';
};

const findNbStepsFromAAAtoZZZ = () => {
  let steps: number = 0;
  let currentNode: string = 'AAA';
  let i = 0;
  while (true) {
    steps++;
    currentNode = getNextNode(currentNode, instructions[i]);
    if (currentNode === 'ZZZ') {
      break;
    }
    i = (i + 1) % instructions.length;
  }

  return steps;
};

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function lcmOfArray(arr: number[]): number {
  return arr.reduce(lcm);
}

const findNbStepsFromNodesEndingWithAtoZ = () => {
  let startingNodes: string[] = [];
  for (const node of nodeNeighbors.keys()) {
    if (node.endsWith('A')) {
      startingNodes.push(node);
    }
  }
  let stepsToReachZFromStartingNodes: number[] = [];
  let currentNodes = startingNodes;
  let steps: number = 0;
  let i = 0;
  while (currentNodes.length > 0) {
    steps++;
    let currentIndex = 0;
    while (currentIndex < currentNodes.length) {
      currentNodes[currentIndex] = getNextNode(
        currentNodes[currentIndex],
        instructions[i]
      );
      if (currentNodes[currentIndex].endsWith('Z')) {
        stepsToReachZFromStartingNodes.push(steps);
        currentNodes.splice(currentIndex, 1);
      } else {
        currentIndex++;
      }
    }
    i = (i + 1) % instructions.length;
  }

  return lcmOfArray(stepsToReachZFromStartingNodes);
};

console.log('Part 1:', findNbStepsFromAAAtoZZZ());
console.log('Part 2:', findNbStepsFromNodesEndingWithAtoZ());
