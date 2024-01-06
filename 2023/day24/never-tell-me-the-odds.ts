import * as fs from 'fs';
import { init } from 'z3-solver';

type Hailstone = {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
  slope: number;
  yIntercept: number;
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const hailstones: Hailstone[] = [];

for (const line of lines) {
  const [positions, velocities] = line.split(' @ ');
  const [px, py, pz] = positions.split(', ').map(Number);
  const [vx, vy, vz] = velocities.split(', ').map(Number);
  const slope = vy / vx;
  const yIntercept = py - slope * px;
  if (hailstones.some((h) => h.px === px && h.py === py)) {
    console.log('DUPLICATE POS:', px, py, pz);
  }
  hailstones.push({ px, py, pz, vx, vy, vz, slope, yIntercept });
}

const countPathIntersections = (
  hailstones: Hailstone[],
  lowerBound: number,
  upperBound: number
): number => {
  let count = 0;
  for (let i = 0; i < hailstones.length - 1; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const h1 = hailstones[i];
      const h2 = hailstones[j];
      if (h1.slope === h2.slope) {
        count += h1.yIntercept === h2.yIntercept ? 1 : 0;
      } else {
        const intersectionX =
          (h2.yIntercept - h1.yIntercept) / (h1.slope - h2.slope);
        const intersectionY = h1.slope * intersectionX + h1.yIntercept;
        if (
          intersectionX >= lowerBound &&
          intersectionX <= upperBound &&
          intersectionY >= lowerBound &&
          intersectionY <= upperBound &&
          (intersectionX - h1.px) / h1.vx >= 0 &&
          (intersectionX - h2.px) / h2.vx >= 0
        ) {
          count++;
        }
      }
    }
  }
  return count;
};

const getSumInitialCoordinatesOfRock = async (
  hailstones: Hailstone[]
): Promise<number> => {
  const { Context, em } = await init();
  const { Real, Solver } = Context('main');

  const px = Real.const('px');
  const py = Real.const('py');
  const pz = Real.const('pz');

  const vx = Real.const('vx');
  const vy = Real.const('vy');
  const vz = Real.const('vz');

  const solver = new Solver();

  for (let i = 0; i < 3; i++) {
    const hailstone = hailstones[i];
    const t = Real.const(`t${i}`);

    solver.add(t.ge(0));
    solver.add(px.add(vx.mul(t)).eq(t.mul(hailstone.vx).add(hailstone.px)));
    solver.add(py.add(vy.mul(t)).eq(t.mul(hailstone.vy).add(hailstone.py)));
    solver.add(pz.add(vz.mul(t)).eq(t.mul(hailstone.vz).add(hailstone.pz)));
  }

  await solver.check();

  const model = solver.model();

  const sum = [model.eval(px), model.eval(py), model.eval(pz)]
    .map(Number)
    .reduce((a, b) => a + b);

  em.PThread.terminateAllThreads();

  return sum;
};

(async () => {
  console.log(
    'Part 1:',
    countPathIntersections(hailstones, 200000000000000, 400000000000000)
  );
  console.log('Part 2:', await getSumInitialCoordinatesOfRock(hailstones));
})();
