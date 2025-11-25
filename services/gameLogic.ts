import { BetCategory } from '../types';

/**
 * Determines the winning category for a set of 3 numbers.
 * 
 * Priority:
 * 1. Leopard (Highest)
 * 2. Straight
 * 3. Pair
 */
export const calculateResultCategory = (n1: number, n2: number, n3: number): BetCategory | 'NONE' => {
  const allSame = n1 === n2 && n2 === n3;
  if (allSame) return BetCategory.LEOPARD;

  // Straight Logic: 012...890, 901
  const numStr = `${n1}${n2}${n3}`;
  const straights = ['012', '123', '234', '345', '456', '567', '678', '789', '890', '901'];
  if (straights.includes(numStr)) return BetCategory.STRAIGHT;

  // Pair Logic
  if (n1 === n2 || n1 === n3 || n2 === n3) return BetCategory.PAIR;

  return 'NONE';
};

export const getRandomNumbers = (): [number, number, number] => {
  return [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
};