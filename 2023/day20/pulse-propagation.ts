import * as fs from 'fs';

type FlipFlopModule = { isOn: boolean; outputModules: string[] };
type ConjunctionModule = {
  lastPulses: Record<string, boolean>; // input modules and their most recent pulse (true = high, false = low)
  outputModules: string[];
};
type BroadcastModule = { outputModules: string[] };
type Module = FlipFlopModule | ConjunctionModule | BroadcastModule;

const createModules = (): Record<string, Module> => {
  const modules: Record<string, Module> = {};

  const input: string = fs.readFileSync('./input.txt', 'utf8');
  const lines: string[] = input.split('\n').filter((line) => line.length > 0);

  // Create modules
  for (const line of lines) {
    const outputModules: string[] = line.split(' -> ')[1].split(', ');
    if (line.startsWith('broadcaster')) {
      modules['broadcaster'] = { outputModules };
    } else {
      const moduleName: string = line.split(' -> ')[0].slice(1);
      if (line[0] === '%') {
        modules[moduleName] = { isOn: false, outputModules };
      } else if (line[0] === '&') {
        modules[moduleName] = { lastPulses: {}, outputModules };
      }
    }
  }

  // Fill conjunction modules with default last pulses
  for (const moduleName in modules) {
    const module: Module = modules[moduleName];
    for (const outputModule of module.outputModules) {
      if (modules[outputModule]?.hasOwnProperty('lastPulses')) {
        const outputConjunctionModule: ConjunctionModule = modules[
          outputModule
        ] as ConjunctionModule;
        outputConjunctionModule.lastPulses[moduleName] = false;
      }
    }
  }

  return modules;
};

const pressButton = (
  modules: Record<string, Module>,
  pulseCounts: { lowPulseCount: number; highPulseCount: number }
): string[] => {
  const modulesThatSentHighToMg: string[] = []; // 'mg' is the conjunction module just before 'rx', it needs to get all its last pulses high to send a low to 'rx'
  const queue: [string, string, boolean][] = []; // queue of the signals in the form [senderModule, receiverModule, pulseType] (true = high, false = low)
  pulseCounts.lowPulseCount++;
  for (const outputModule of modules['broadcaster'].outputModules) {
    queue.push(['broadcaster', outputModule, false]);
    pulseCounts.lowPulseCount++;
  }
  while (queue.length > 0) {
    const [senderModule, receiverModule, pulseType] = queue.shift()!;
    const module = modules[receiverModule];
    if (module?.hasOwnProperty('isOn') && pulseType === false) {
      const flipFlopModule: FlipFlopModule = module as FlipFlopModule;
      flipFlopModule.isOn = !flipFlopModule.isOn;
      const newPulseType: boolean = flipFlopModule.isOn;
      for (const outputModule of flipFlopModule.outputModules) {
        queue.push([receiverModule, outputModule, newPulseType]);
        if (newPulseType === false) {
          pulseCounts.lowPulseCount++;
        } else {
          pulseCounts.highPulseCount++;
        }
      }
    } else if (module?.hasOwnProperty('lastPulses')) {
      if (receiverModule === 'mg' && pulseType === true) {
        modulesThatSentHighToMg.push(senderModule);
      }
      const conjunctionModule: ConjunctionModule = module as ConjunctionModule;
      conjunctionModule.lastPulses[senderModule] = pulseType;
      const lastPulseTypes: boolean[] = Object.values(
        conjunctionModule.lastPulses
      ) as boolean[];
      const newPulseType: boolean = !lastPulseTypes.every(
        (pulse) => pulse === true
      );
      for (const outputModule of conjunctionModule.outputModules) {
        queue.push([receiverModule, outputModule, newPulseType]);
        if (newPulseType === false) {
          pulseCounts.lowPulseCount++;
        } else {
          pulseCounts.highPulseCount++;
        }
      }
    }
  }

  return modulesThatSentHighToMg;
};

const part1 = (): number => {
  const modules = createModules();
  const pulseCounts = { lowPulseCount: 0, highPulseCount: 0 };

  for (let i = 0; i < 1000; i++) {
    pressButton(modules, pulseCounts);
  }

  return pulseCounts.lowPulseCount * pulseCounts.highPulseCount;
};

const part2 = (): number => {
  const modules = createModules();
  const pulseCounts = { lowPulseCount: 0, highPulseCount: 0 };

  // 'mg' is the conjunction module just before 'rx', it needs to get all its last pulses high to send a low to 'rx'
  const minIterationsToSendHighToMg: Record<string, number> = {};
  for (const moduleName in modules) {
    if (modules[moduleName].outputModules.includes('mg')) {
      minIterationsToSendHighToMg[moduleName] = 0;
    }
  }

  let buttonPresses = 0;
  while (Object.values(minIterationsToSendHighToMg).some((n) => n === 0)) {
    const modulesThatSentHighToMg = pressButton(modules, pulseCounts);
    buttonPresses++;
    while (modulesThatSentHighToMg.length > 0) {
      const moduleName = modulesThatSentHighToMg.shift()!;
      if (minIterationsToSendHighToMg[moduleName] === 0) {
        minIterationsToSendHighToMg[moduleName] = buttonPresses;
      }
    }
  }

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

  return lcmOfArray(Object.values(minIterationsToSendHighToMg));
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
