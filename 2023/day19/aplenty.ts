import * as fs from 'fs';

type Rule = [string, string, string, string];

type Workflow = Rule[];

const input: string = fs.readFileSync('./input.txt', 'utf8');
const [workflows, parts]: string[] = input.split('\n\n');

const workflowMap: Map<string, Workflow> = new Map();

for (const workflow of workflows.split('\n')) {
  const workflowName: string = workflow.split('{')[0];
  const rulesStr: string[] = workflow.split('{')[1].split('}')[0].split(',');
  const rules: Rule[] = rulesStr.map((ruleStr: string) => {
    if (ruleStr.includes(':'))
      return [
        ruleStr[0],
        ruleStr[1],
        ruleStr.split(':')[0].slice(2),
        ruleStr.split(':')[1],
      ];
    else return ['', '', '', ruleStr];
  });
  workflowMap.set(workflowName, rules);
}
workflowMap.set('A', [['', '', '', 'A']]);
workflowMap.set('R', [['', '', '', 'R']]);

let sumRatings: number = 0;

for (const part of parts.split('\n')) {
  const ratingsStr: string[] = part.slice(1, part.length - 1).split(',');
  const ratings = { x: 0, m: 0, a: 0, s: 0 };
  for (const ratingStr of ratingsStr) {
    const key: string = ratingStr.split('=')[0];
    const rating: number = parseInt(ratingStr.split('=')[1]);
    ratings[key as keyof typeof ratings] = rating;
  }

  let currentWorkflow = workflowMap.get('in');
  while (currentWorkflow) {
    for (const rule of currentWorkflow) {
      if (rule[1] === '<') {
        if (ratings[rule[0] as keyof typeof ratings] < parseInt(rule[2])) {
          if (rule[3] !== 'A' && rule[3] !== 'R') {
            currentWorkflow = workflowMap.get(rule[3]);
          } else {
            currentWorkflow = undefined;
            if (rule[3] === 'A')
              sumRatings += ratings.x + ratings.m + ratings.a + ratings.s;
          }
          break;
        }
      } else if (rule[1] === '>') {
        if (ratings[rule[0] as keyof typeof ratings] > parseInt(rule[2])) {
          if (rule[3] !== 'A' && rule[3] !== 'R') {
            currentWorkflow = workflowMap.get(rule[3]);
          } else {
            currentWorkflow = undefined;
            if (rule[3] === 'A')
              sumRatings += ratings.x + ratings.m + ratings.a + ratings.s;
          }
          break;
        }
      } else {
        if (rule[3] !== 'A' && rule[3] !== 'R') {
          currentWorkflow = workflowMap.get(rule[3]);
        } else {
          currentWorkflow = undefined;
          if (rule[3] === 'A')
            sumRatings += ratings.x + ratings.m + ratings.a + ratings.s;
        }
        break;
      }
    }
  }
}

const countCombinations = (
  workflow: Workflow,
  ratingRanges: Record<string, number>
): number => {
  let count: number = 0;
  for (const rule of workflow) {
    if (rule[1] === '<') {
      count += countCombinations(workflowMap.get(rule[3])!, {
        ...ratingRanges,
        [`${rule[0]}Max`]: parseInt(rule[2]) - 1,
      });
      ratingRanges[`${rule[0]}Min`] = parseInt(rule[2]);
    } else if (rule[1] === '>') {
      count += countCombinations(workflowMap.get(rule[3])!, {
        ...ratingRanges,
        [`${rule[0]}Min`]: parseInt(rule[2]) + 1,
      });
      ratingRanges[`${rule[0]}Max`] = parseInt(rule[2]);
    } else {
      if (rule[3] !== 'A' && rule[3] !== 'R') {
        count += countCombinations(workflowMap.get(rule[3])!, ratingRanges);
      } else if (rule[3] === 'A') {
        count +=
          (ratingRanges['xMax'] - ratingRanges['xMin'] + 1) *
          (ratingRanges['mMax'] - ratingRanges['mMin'] + 1) *
          (ratingRanges['aMax'] - ratingRanges['aMin'] + 1) *
          (ratingRanges['sMax'] - ratingRanges['sMin'] + 1);
      }
    }
  }
  return count;
};

console.log('Part 1:', sumRatings);
console.log(
  'Part 2:',
  countCombinations(workflowMap.get('in')!, {
    xMin: 1,
    xMax: 4000,
    mMin: 1,
    mMax: 4000,
    aMin: 1,
    aMax: 4000,
    sMin: 1,
    sMax: 4000,
  })
);
