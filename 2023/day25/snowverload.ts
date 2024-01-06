import * as fs from 'fs';

type Wire = [string, string];

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const components: string[] = [];
const componentsSet: Set<string> = new Set();
const wires: Wire[] = [];

for (const line of lines) {
  const [leftComponent, wiresStr] = line.split(': ');
  const rightComponents = wiresStr.split(' ');
  if (!componentsSet.has(leftComponent)) {
    components.push(leftComponent);
    componentsSet.add(leftComponent);
  }
  for (const rightComponent of rightComponents) {
    wires.push([leftComponent, rightComponent]);
    if (!componentsSet.has(rightComponent)) {
      components.push(rightComponent);
      componentsSet.add(rightComponent);
    }
  }
}

const createFreshComponentsGroupMap = (): Map<string, string> => {
  const componentsGroup = new Map<string, string>();
  for (const component of components) {
    componentsGroup.set(component, component);
  }
  return componentsGroup;
};

const findParent = (
  component: string,
  componentsGroup: Map<string, string>
): string => {
  if (componentsGroup.get(component) === component) {
    return component;
  }
  componentsGroup.set(
    component,
    findParent(componentsGroup.get(component)!, componentsGroup)
  );
  return componentsGroup.get(component)!;
};

const union = (
  component1: string,
  component2: string,
  componentsGroup: Map<string, string>,
  groupParents: Set<string>
): void => {
  const parent1 = findParent(component1, componentsGroup);
  const parent2 = findParent(component2, componentsGroup);
  if (parent1 !== parent2) {
    componentsGroup.set(parent1, parent2);
    groupParents.delete(parent1);
  }
};

const getGroupCounts = (componentsGroup: Map<string, string>) => {
  const groupCounts: Record<string, number> = {};
  for (const component of components) {
    const parent = findParent(component, componentsGroup);
    if (!groupCounts[parent]) {
      groupCounts[parent] = 0;
    }
    groupCounts[parent]++;
  }
  return groupCounts;
};

while (true) {
  const componentsGroup = createFreshComponentsGroupMap();
  const groupParents: Set<string> = new Set(components);
  const remainingWires: Wire[] = [
    ...wires.map((wire) => [wire[0], wire[1]] as Wire),
  ];
  while (groupParents.size > 2) {
    const randomIndex = Math.floor(Math.random() * remainingWires.length);
    const wire = remainingWires.splice(randomIndex, 1)[0];
    union(wire[0], wire[1], componentsGroup, groupParents);
  }
  let removedWiresCount: number = 0;
  for (const wire of remainingWires) {
    const parentLeft = findParent(wire[0], componentsGroup);
    const parentRight = findParent(wire[1], componentsGroup);
    if (parentLeft === parentRight) {
      componentsGroup.set(wire[0], parentLeft);
      componentsGroup.set(wire[1], parentRight);
    } else {
      removedWiresCount++;
      if (removedWiresCount > 3) {
        break;
      }
    }
  }
  if (removedWiresCount === 3) {
    const groupCounts = getGroupCounts(componentsGroup);
    const [parent1, parent2] = groupParents.values();
    console.log('Part 1:', groupCounts[parent1] * groupCounts[parent2]);
    break;
  }
}
