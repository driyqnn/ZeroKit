
export interface Item {
  id: string;
  name: string;
  price: number;
  previousPrice: number;
  volatility: number;
  maxQuantity: number;
  perishable: boolean;
  perishDays: number;
  icon: string;
  insured?: boolean;
  insuredUntil?: number;
}

export interface InventoryItem extends Item {
  quantity: number;
  purchaseDay?: number;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  affectedItem?: string;
  priceModifier?: number;
  duration?: number;
}

export interface Tip {
  itemId: string;
  prediction: 'up' | 'down' | 'stable';
  accurate: boolean;
}

export interface PlayerTrait {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: string;
}

export interface Challenge {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
  check: (state: GameState) => boolean;
}

export interface MarketMood {
  type: 'bullish' | 'stable' | 'bearish';
  description: string;
  modifier: number;
}

export interface MysteryItem {
  name: string;
  value: number;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface DailyStats {
  day: number;
  bestMove: { item: string; profit: number } | null;
  worstMove: { item: string; loss: number } | null;
  itemsPerished: string[];
}

export interface TradeHistoryItem {
  day: number;
  action: 'buy' | 'sell';
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface GameState {
  day: number;
  cash: number;
  inventory: InventoryItem[];
  items: Item[];
  events: GameEvent[];
  activeTip: Tip | null;
  loanAmount: number;
  loanDueDay: number | null;
  blackMarketUnlocked: boolean;
  gameOver: boolean;
  finalStats: FinalStats | null;
  aiRivalCash: number;
  selectedTrait: PlayerTrait | null;
  dailyChallenges: Challenge[];
  marketMood: MarketMood;
  tradeHistory: TradeHistoryItem[];
  dailyStats: DailyStats[];
  mysteryItemAvailable: boolean;
  mysteryItemPrice: number;
  storageUpgrades: { [itemId: string]: number };
  pendingTrades: {
    type: 'buy' | 'sell';
    itemId: string;
    quantity: number;
    price: number;
    executionDay: number;
  }[];
}

export interface FinalStats {
  finalCash: number;
  profit: number;
  bestItem: {
    name: string;
    profit: number;
  };
  beatAI: boolean;
}

export interface PriceHistory {
  [itemId: string]: number[];
}
