import * as fs from 'fs';

type HandType =
  | 'five-of-a-kind'
  | 'four-of-a-kind'
  | 'full-house'
  | 'three-of-a-kind'
  | 'two-pairs'
  | 'one-pair'
  | 'high-card';

const HAND_TYPE_VALUES: Record<HandType, number> = {
  'five-of-a-kind': 7,
  'four-of-a-kind': 6,
  'full-house': 5,
  'three-of-a-kind': 4,
  'two-pairs': 3,
  'one-pair': 2,
  'high-card': 1,
};

let CARD_VALUES: Record<string, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const getSortedCardCount = (hand: string): Map<string, number> => {
  const cardCount: Map<string, number> = new Map();
  for (const card of hand) {
    if (cardCount.has(card)) {
      cardCount.set(card, cardCount.get(card)! + 1);
    } else {
      cardCount.set(card, 1);
    }
  }
  return new Map(
    [...cardCount.entries()].sort((cardA, cardB) => {
      if (cardA[1] === cardB[1]) {
        return CARD_VALUES[cardB[0]] - CARD_VALUES[cardA[0]];
      }
      return cardB[1] - cardA[1];
    })
  );
};

const getHandType = (sortedCardCount: Map<string, number>): HandType => {
  if (
    CARD_VALUES['J'] === 0 &&
    sortedCardCount.get('J') &&
    sortedCardCount.get('J') != 5
  ) {
    let cardCountWithoutJokers: Map<string, number> = new Map();
    let jokerCount: number = sortedCardCount.get('J')!;
    for (const [card, count] of sortedCardCount.entries()) {
      if (card !== 'J') {
        cardCountWithoutJokers.set(card, count + jokerCount);
      }
    }
    sortedCardCount = cardCountWithoutJokers;
  }
  const cardLabels: string[] = Array.from(sortedCardCount.keys());

  if (cardLabels.length === 1) {
    return 'five-of-a-kind';
  }
  if (cardLabels.length === 2) {
    if (sortedCardCount.get(cardLabels[0]) === 4) {
      return 'four-of-a-kind';
    }
    return 'full-house';
  }
  if (cardLabels.length === 3) {
    if (sortedCardCount.get(cardLabels[0]) === 3) {
      return 'three-of-a-kind';
    }
    return 'two-pairs';
  }
  if (cardLabels.length === 4) {
    return 'one-pair';
  }
  return 'high-card';
};

const compareHands = (hand1: string, hand2: string) => {
  const cardCountHand1 = getSortedCardCount(hand1);
  const cardCountHand2 = getSortedCardCount(hand2);

  const handTypeHand1 = getHandType(cardCountHand1);
  const handTypeHand2 = getHandType(cardCountHand2);

  if (HAND_TYPE_VALUES[handTypeHand1] > HAND_TYPE_VALUES[handTypeHand2]) {
    return 1;
  } else if (
    HAND_TYPE_VALUES[handTypeHand1] < HAND_TYPE_VALUES[handTypeHand2]
  ) {
    return -1;
  } else {
    for (let i = 0; i < hand1.length; i++) {
      if (CARD_VALUES[hand1[i]] > CARD_VALUES[hand2[i]]) {
        return 1;
      } else if (CARD_VALUES[hand1[i]] < CARD_VALUES[hand2[i]]) {
        return -1;
      }
    }
    return 0;
  }
};

const input: string = fs.readFileSync('./input.txt', 'utf8');
const lines: string[] = input.split('\n');

const getTotalWinnings = (): number => {
  let totalWinnings: number = 0;

  let couplesHandBid: string[][] = [];
  for (const line of lines) {
    couplesHandBid.push(line.split(' '));
  }
  couplesHandBid.sort((coupleA, coupleB) => {
    return compareHands(coupleA[0], coupleB[0]);
  });

  let rank = 1;
  for (let i = 0; i < couplesHandBid.length; i++) {
    totalWinnings += parseInt(couplesHandBid[i][1]) * rank;
    if (i < couplesHandBid.length - 1) {
      if (compareHands(couplesHandBid[i][0], couplesHandBid[i + 1][0]) !== 0) {
        rank++;
      }
    }
  }

  return totalWinnings;
};

const getTotalWinningsWithJokers = (): number => {
  CARD_VALUES['J'] = 0;

  return getTotalWinnings();
};

console.log('Part 1:', getTotalWinnings());
console.log('Part 2:', getTotalWinningsWithJokers());
