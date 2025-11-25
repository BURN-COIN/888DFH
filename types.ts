
export enum BetCategory {
  LEOPARD = 'LEOPARD',
  STRAIGHT = 'STRAIGHT',
  PAIR = 'PAIR',
  CUSTOM = 'CUSTOM',
  BIG = 'BIG',
  SMALL = 'SMALL',
  ODD = 'ODD',
  EVEN = 'EVEN',
  BIG_ODD = 'BIG_ODD',
  BIG_EVEN = 'BIG_EVEN',
  SMALL_ODD = 'SMALL_ODD',
  SMALL_EVEN = 'SMALL_EVEN',
}

export interface Bet {
  category: BetCategory;
  amount: number;
}

export interface HistoryItem {
  id: number;
  numbers: [number, number, number];
  resultCategory: BetCategory | 'NONE';
  timestamp: number;
  winAmount: number;
  isCustomWin: boolean;
  specialWins: string[]; // Track other wins like Big/Small
}

export const ODDS: Record<BetCategory, number> = {
  [BetCategory.LEOPARD]: 50,
  [BetCategory.STRAIGHT]: 40,
  [BetCategory.PAIR]: 3,
  [BetCategory.CUSTOM]: 100,
  [BetCategory.BIG]: 1.95,
  [BetCategory.SMALL]: 1.95,
  [BetCategory.ODD]: 1.95,
  [BetCategory.EVEN]: 1.95,
  [BetCategory.BIG_ODD]: 3.8,
  [BetCategory.BIG_EVEN]: 3.8,
  [BetCategory.SMALL_ODD]: 3.8,
  [BetCategory.SMALL_EVEN]: 3.8,
};

export const CATEGORY_LABELS: Record<BetCategory, string> = {
  [BetCategory.LEOPARD]: '豹子 (50倍)',
  [BetCategory.STRAIGHT]: '顺子 (40倍)',
  [BetCategory.PAIR]: '对子 (3倍)',
  [BetCategory.CUSTOM]: '自选号 (100倍)',
  [BetCategory.BIG]: '大 (1.95)',
  [BetCategory.SMALL]: '小 (1.95)',
  [BetCategory.ODD]: '单 (1.95)',
  [BetCategory.EVEN]: '双 (1.95)',
  [BetCategory.BIG_ODD]: '大单 (3.8)',
  [BetCategory.BIG_EVEN]: '大双 (3.8)',
  [BetCategory.SMALL_ODD]: '小单 (3.8)',
  [BetCategory.SMALL_EVEN]: '小双 (3.8)',
};
