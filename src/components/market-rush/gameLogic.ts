
import { v4 as uuidv4 } from 'uuid';
import { GameState, Item, InventoryItem, GameEvent, Tip, FinalStats, TradeHistoryItem, Challenge, MarketMood, PlayerTrait } from './types';

// Define the items
const generateItems = (): Item[] => {
  return [
    {
      id: uuidv4(),
      name: 'Oil',
      price: 45.00,
      previousPrice: 45.00,
      volatility: 0.15, // High volatility
      maxQuantity: 10,
      perishable: false,
      perishDays: 0,
      icon: '🛢️',
    },
    {
      id: uuidv4(),
      name: 'Gold',
      price: 250.00,
      previousPrice: 250.00,
      volatility: 0.10,
      maxQuantity: 5,
      perishable: false,
      perishDays: 0,
      icon: '🪙',
    },
    {
      id: uuidv4(),
      name: 'Apples',
      price: 3.50,
      previousPrice: 3.50,
      volatility: 0.08,
      maxQuantity: 20,
      perishable: true,
      perishDays: 3,
      icon: '🍎',
    },
    {
      id: uuidv4(),
      name: 'Laptops',
      price: 800.00,
      previousPrice: 800.00,
      volatility: 0.05,
      maxQuantity: 3,
      perishable: false,
      perishDays: 0,
      icon: '💻',
    },
    {
      id: uuidv4(),
      name: 'MemeCoin',
      price: 12.00,
      previousPrice: 12.00,
      volatility: 0.25, // Very high volatility
      maxQuantity: 15,
      perishable: false,
      perishDays: 0,
      icon: '🪙',
    },
    {
      id: uuidv4(),
      name: 'Water Bottles',
      price: 1.50,
      previousPrice: 1.50,
      volatility: 0.03, // Low volatility
      maxQuantity: 30,
      perishable: false,
      perishDays: 0,
      icon: '💧',
    },
    {
      id: uuidv4(),
      name: 'Black Market Diamond',
      price: 1500.00,
      previousPrice: 1500.00,
      volatility: 0.20,
      maxQuantity: 1,
      perishable: false,
      perishDays: 0,
      icon: '💎',
    },
    {
      id: uuidv4(),
      name: 'Black Market Artifact',
      price: 3000.00,
      previousPrice: 3000.00,
      volatility: 0.30,
      maxQuantity: 1,
      perishable: false,
      perishDays: 0,
      icon: '🏺',
    },
  ];
};

// Define possible market events
const marketEvents: GameEvent[] = [
  {
    id: '1',
    name: 'Oil Boom',
    description: 'Oil Boom: Oil +25%',
    affectedItem: 'Oil',
    priceModifier: 1.25,
  },
  {
    id: '2',
    name: 'Tech Crash',
    description: 'Tech Market Crash: Laptops -20%',
    affectedItem: 'Laptops',
    priceModifier: 0.8,
  },
  {
    id: '3',
    name: 'Food Shortage',
    description: 'Food Shortage: Apples +30%',
    affectedItem: 'Apples',
    priceModifier: 1.3,
  },
  {
    id: '4',
    name: 'Gold Panic',
    description: 'Gold Market Panic: Gold -15%',
    affectedItem: 'Gold',
    priceModifier: 0.85,
  },
  {
    id: '5',
    name: 'Meme Surge',
    description: 'MemeCoin trending on social media: +50%',
    affectedItem: 'MemeCoin',
    priceModifier: 1.5,
  },
  {
    id: '6',
    name: 'Water Crisis',
    description: 'Regional water shortage: Water Bottles +40%',
    affectedItem: 'Water Bottles',
    priceModifier: 1.4,
  },
  {
    id: '7',
    name: 'Black Market Raid',
    description: 'Police raid on black market: Black Market items -40%',
    affectedItem: 'Black Market',
    priceModifier: 0.6,
  },
  {
    id: '8',
    name: 'Collector Interest',
    description: 'Wealthy collector seeks Black Market Artifact: +70%',
    affectedItem: 'Black Market Artifact',
    priceModifier: 1.7,
  },
];

// Define available player traits
const playerTraits: PlayerTrait[] = [
  {
    id: 'analyst',
    name: 'The Analyst',
    description: 'Access to price graphs for better decisions',
    icon: '📊',
    effect: 'Access to price graphs'
  },
  {
    id: 'hustler',
    name: 'The Hustler',
    description: 'Trade twice a day without penalty',
    icon: '🏃',
    effect: 'Trade twice per day'
  },
  {
    id: 'insider',
    name: 'The Insider',
    description: 'Market tips cost 50% less',
    icon: '🕵️',
    effect: 'Tips cost $100 instead of $200'
  },
  {
    id: 'hoarder',
    name: 'The Hoarder',
    description: '50% larger inventory capacity',
    icon: '🧳',
    effect: '+50% inventory capacity'
  },
  {
    id: 'gambler',
    name: 'The Gambler',
    description: 'Higher rewards from risky trades',
    icon: '🎲',
    effect: 'More volatile markets, higher potential gains'
  }
];

// Generate daily challenges
export const generateDailyChallenges = (state: GameState): Challenge[] => {
  // List of potential challenge templates
  const challengeTemplates = [
    {
      description: "Make $500 in one day",
      reward: 200,
      check: (s: GameState) => {
        // This would need proper tracking of daily profits
        return false;
      }
    },
    {
      description: "Hold at least 5 different items",
      reward: 150,
      check: (s: GameState) => {
        const itemsHeld = s.inventory.filter(item => item.quantity > 0).length;
        return itemsHeld >= 5;
      }
    },
    {
      description: "Accumulate $2000 in cash",
      reward: 100,
      check: (s: GameState) => {
        return s.cash >= 2000;
      }
    },
    {
      description: "Hold 10 of any single item",
      reward: 250,
      check: (s: GameState) => {
        return s.inventory.some(item => item.quantity >= 10);
      }
    },
    {
      description: "Have more cash than the AI rival",
      reward: 200,
      check: (s: GameState) => {
        return s.cash > s.aiRivalCash;
      }
    }
  ];
  
  // Pick 3 random challenges
  const challenges: Challenge[] = [];
  const shuffled = [...challengeTemplates].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < 3 && i < shuffled.length; i++) {
    const template = shuffled[i];
    challenges.push({
      id: uuidv4(),
      description: template.description,
      reward: template.reward,
      completed: false,
      check: template.check
    });
  }
  
  return challenges;
};

// Generate market mood
const generateMarketMood = (): MarketMood => {
  const moods = [
    {
      type: 'bullish' as const,
      description: 'Markets trending upward',
      modifier: 0.05
    },
    {
      type: 'stable' as const,
      description: 'Markets are stable',
      modifier: 0
    },
    {
      type: 'bearish' as const,
      description: 'Markets trending downward',
      modifier: -0.05
    }
  ];
  
  return moods[Math.floor(Math.random() * moods.length)];
};

// Initialize the game state
export const initializeGame = (): GameState => {
  const items = generateItems();
  
  return {
    day: 1,
    cash: 1000,
    inventory: items.map(item => ({
      ...item,
      quantity: 0,
    })),
    items,
    events: [],
    activeTip: null,
    loanAmount: 0,
    loanDueDay: null,
    blackMarketUnlocked: false,
    gameOver: false,
    finalStats: null,
    aiRivalCash: 1000,
    selectedTrait: null,
    dailyChallenges: [],
    marketMood: generateMarketMood(),
    tradeHistory: [],
    dailyStats: [],
    mysteryItemAvailable: false,
    mysteryItemPrice: 300,
    storageUpgrades: {},
    pendingTrades: []
  };
};

// Update item prices for a new day
const updatePrices = (state: GameState): GameState => {
  const updatedItems = state.items.map(item => {
    let priceChangePercent = (Math.random() * 2 * item.volatility) - item.volatility;
    
    // Apply market mood influence
    priceChangePercent += state.marketMood.modifier;
    
    // Check for streaks (hype chain)
    if (item.price > item.previousPrice) {
      // Item price is rising, chance for bigger rise
      const streakMultiplier = Math.random() > 0.7 ? 1.5 : 1;
      priceChangePercent *= streakMultiplier;
      
      // But also higher chance of crash
      if (Math.random() > 0.8) {
        priceChangePercent = -item.volatility * 2;
      }
    }
    
    const newPrice = Math.max(
      0.5, // Minimum price
      item.price * (1 + priceChangePercent)
    );
    
    return {
      ...item,
      previousPrice: item.price,
      price: parseFloat(newPrice.toFixed(2)),
    };
  });
  
  return { ...state, items: updatedItems };
};

// Apply random events
const applyRandomEvents = (state: GameState): GameState => {
  // 30% chance of an event occurring
  if (Math.random() > 0.7) {
    const randomEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
    
    const updatedItems = state.items.map(item => {
      // Check if this item is affected
      if (
        (randomEvent.affectedItem === 'Black Market' && item.name.includes('Black Market')) ||
        item.name === randomEvent.affectedItem
      ) {
        return {
          ...item,
          price: parseFloat((item.price * (randomEvent.priceModifier || 1)).toFixed(2)),
        };
      }
      return item;
    });
    
    return {
      ...state,
      items: updatedItems,
      events: [...state.events, randomEvent],
    };
  }
  
  return state;
};

// Handle the AI rival's trading
const simulateAIRival = (state: GameState): GameState => {
  // Simple AI strategy: buy low, sell high based on recent price changes
  let aiCash = state.aiRivalCash;
  const aiDecisions = Math.random(); // AI decision randomness
  
  // Identify items with significant price changes
  const promisingItems = state.items.filter(item => {
    const priceChange = item.price / item.previousPrice;
    return priceChange > 1.1 || priceChange < 0.9;
  });
  
  if (promisingItems.length > 0 && aiDecisions > 0.4) {
    // AI makes a trade (this is just a simulation, not actual inventory management)
    const tradedItem = promisingItems[Math.floor(Math.random() * promisingItems.length)];
    
    // AI increases cash based on good trades (simplified)
    if ((tradedItem.price > tradedItem.previousPrice && aiDecisions > 0.5) || 
        (tradedItem.price < tradedItem.previousPrice && aiDecisions <= 0.5)) {
      // Good trade
      aiCash += Math.random() * 100 + 50;
    } else {
      // Bad trade
      aiCash -= Math.random() * 50 + 20;
    }
  }
  
  // Ensure AI cash stays positive
  aiCash = Math.max(aiCash, 50);
  
  // Add small random change to make AI performance less predictable
  aiCash += (Math.random() * 40) - 20;
  
  return { ...state, aiRivalCash: parseFloat(aiCash.toFixed(2)) };
};

// Check if items in inventory have perished
const checkPerishedItems = (state: GameState): GameState => {
  const updatedInventory = state.inventory.map(item => {
    if (
      item.perishable && 
      item.purchaseDay !== undefined && 
      state.day - item.purchaseDay >= item.perishDays &&
      item.quantity > 0
    ) {
      // Item has perished
      return { ...item, quantity: 0 };
    }
    return item;
  });
  
  return { ...state, inventory: updatedInventory };
};

// Handle the loan repayment check
const checkLoanDue = (state: GameState): GameState => {
  if (state.loanAmount > 0 && state.loanDueDay === state.day) {
    // If player can't repay, penalize
    if (state.cash < state.loanAmount) {
      // Apply 20% penalty and extend due date
      const newLoanAmount = parseFloat((state.loanAmount * 1.2).toFixed(2));
      const newDueDay = Math.min(state.day + 5, 30);
      
      return { 
        ...state, 
        loanAmount: newLoanAmount,
        loanDueDay: newDueDay,
      };
    }
  }
  
  return state;
};

// Process the next day
export const nextDay = (state: GameState): GameState => {
  // Check if game is over
  if (state.day >= 30) {
    const finalStats = calculateFinalStats(state);
    return { ...state, gameOver: true, finalStats };
  }
  
  // Apply all day changes in sequence
  let newState = { 
    ...state, 
    day: state.day + 1, 
    activeTip: null, 
    marketMood: generateMarketMood(), 
    mysteryItemAvailable: Math.random() > 0.7 // 30% chance for mystery item 
  };
  
  if (newState.mysteryItemAvailable) {
    newState.mysteryItemPrice = Math.floor(Math.random() * 400) + 100; // $100-500
  }
  
  // Update prices
  newState = updatePrices(newState);
  
  // Apply random events
  newState = applyRandomEvents(newState);
  
  // Handle perished items
  newState = checkPerishedItems(newState);
  
  // Check loan due
  newState = checkLoanDue(newState);
  
  // Simulate AI rival
  newState = simulateAIRival(newState);
  
  // Process any pending trades
  newState = processPendingTrades(newState);
  
  // Unlock black market on day 10
  if (newState.day === 10) {
    newState = { ...newState, blackMarketUnlocked: true };
    
    // Add black market unlocked event
    const blackMarketEvent: GameEvent = {
      id: 'unlock_black_market',
      name: 'Black Market Unlocked',
      description: 'You\'ve discovered the Black Market! Risky but potentially profitable items are now available.',
    };
    
    newState = {
      ...newState,
      events: [...newState.events, blackMarketEvent],
    };
  }
  
  return newState;
};

// Process pending trades
const processPendingTrades = (state: GameState): GameState => {
  const today = state.day;
  const pendingTradesToExecute = state.pendingTrades.filter(trade => trade.executionDay === today);
  const remainingPendingTrades = state.pendingTrades.filter(trade => trade.executionDay !== today);
  
  let updatedState = { ...state, pendingTrades: remainingPendingTrades };
  
  for (const trade of pendingTradesToExecute) {
    if (trade.type === 'buy') {
      const totalCost = trade.price * trade.quantity;
      
      // Only execute if the player has enough cash
      if (updatedState.cash >= totalCost) {
        // Update cash
        updatedState.cash = parseFloat((updatedState.cash - totalCost).toFixed(2));
        
        // Update inventory
        updatedState.inventory = updatedState.inventory.map(item => {
          if (item.id === trade.itemId) {
            return {
              ...item,
              quantity: item.quantity + trade.quantity,
              purchaseDay: today
            };
          }
          return item;
        });
        
        // Add to trade history
        const item = updatedState.items.find(i => i.id === trade.itemId);
        if (item) {
          updatedState.tradeHistory = [
            ...updatedState.tradeHistory,
            {
              day: today,
              action: 'buy',
              itemName: item.name,
              quantity: trade.quantity,
              price: trade.price,
              total: totalCost
            }
          ];
        }
      }
    } else if (trade.type === 'sell') {
      // Find the relevant inventory item
      const inventoryItem = updatedState.inventory.find(i => i.id === trade.itemId);
      
      // Only execute if the player has enough of the item
      if (inventoryItem && inventoryItem.quantity >= trade.quantity) {
        const saleValue = trade.price * trade.quantity;
        
        // Update cash
        updatedState.cash = parseFloat((updatedState.cash + saleValue).toFixed(2));
        
        // Update inventory
        updatedState.inventory = updatedState.inventory.map(item => {
          if (item.id === trade.itemId) {
            return {
              ...item,
              quantity: item.quantity - trade.quantity
            };
          }
          return item;
        });
        
        // Add to trade history
        const item = updatedState.items.find(i => i.id === trade.itemId);
        if (item) {
          updatedState.tradeHistory = [
            ...updatedState.tradeHistory,
            {
              day: today,
              action: 'sell',
              itemName: item.name,
              quantity: trade.quantity,
              price: trade.price,
              total: saleValue
            }
          ];
        }
      }
    }
  }
  
  return updatedState;
};

// Calculate final stats at the end of the game
const calculateFinalStats = (state: GameState): FinalStats => {
  // Calculate total inventory value
  const inventoryValue = state.inventory.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Final cash includes inventory value
  const finalCash = state.cash + inventoryValue - state.loanAmount;
  
  // Calculate profit (from initial $1000)
  const profit = finalCash - 1000;
  
  // Find best performing item
  let bestItem = { name: 'None', profit: 0 };
  
  // Check if player beat the AI
  const beatAI = finalCash > state.aiRivalCash;
  
  return {
    finalCash,
    profit,
    bestItem,
    beatAI,
  };
};

// Buy an item
export const buyItem = (state: GameState, itemId: string): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Check if player has enough money
  if (state.cash < item.price) {
    throw new Error('Not enough cash');
  }
  
  // Find the item in inventory
  const inventoryItem = state.inventory.find(i => i.id === itemId);
  if (!inventoryItem) throw new Error('Inventory item not found');
  
  // Determine max quantity for this item, considering any storage upgrades
  const storageUpgrade = state.storageUpgrades[itemId] || 0;
  const effectiveMaxQuantity = item.maxQuantity + storageUpgrade;
  
  // Check if player has reached max quantity
  if (inventoryItem.quantity >= effectiveMaxQuantity) {
    throw new Error(`You can't hold more than ${effectiveMaxQuantity} of this item`);
  }
  
  // Update inventory
  const updatedInventory = state.inventory.map(i => {
    if (i.id === itemId) {
      return { 
        ...i, 
        quantity: i.quantity + 1,
        purchaseDay: state.day, // Record when the item was purchased
      };
    }
    return i;
  });
  
  // Update cash
  const updatedCash = parseFloat((state.cash - item.price).toFixed(2));
  
  return {
    ...state,
    cash: updatedCash,
    inventory: updatedInventory,
  };
};

// Sell an item
export const sellItem = (state: GameState, itemId: string): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Find the item in inventory
  const inventoryItem = state.inventory.find(i => i.id === itemId);
  if (!inventoryItem) throw new Error('Inventory item not found');
  
  // Check if player has the item
  if (inventoryItem.quantity <= 0) {
    throw new Error("You don't have any of this item to sell");
  }
  
  // Update inventory
  const updatedInventory = state.inventory.map(i => {
    if (i.id === itemId) {
      return { ...i, quantity: i.quantity - 1 };
    }
    return i;
  });
  
  // Update cash
  const updatedCash = parseFloat((state.cash + item.price).toFixed(2));
  
  return {
    ...state,
    cash: updatedCash,
    inventory: updatedInventory,
  };
};

// Take a loan
export const takeLoan = (state: GameState): GameState => {
  // Check if player already has a loan
  if (state.loanAmount > 0) {
    throw new Error('You already have an outstanding loan');
  }
  
  // Check if it's too late in the game for a loan
  if (state.day >= 25) {
    throw new Error('Loans not available after Day 25');
  }
  
  const loanAmount = 500;
  const loanDueDay = state.day + 5;
  
  return {
    ...state,
    cash: parseFloat((state.cash + loanAmount).toFixed(2)),
    loanAmount,
    loanDueDay,
  };
};

// Pay off the loan
export const payLoan = (state: GameState): GameState => {
  // Check if player has a loan
  if (state.loanAmount <= 0) {
    throw new Error('You don\'t have any outstanding loans');
  }
  
  // Check if player has enough money
  if (state.cash < state.loanAmount) {
    throw new Error('You don\'t have enough cash to pay off your loan');
  }
  
  return {
    ...state,
    cash: parseFloat((state.cash - state.loanAmount).toFixed(2)),
    loanAmount: 0,
    loanDueDay: null,
  };
};

// Buy a market tip
export const buyTip = (state: GameState): GameState => {
  // Determine tip cost based on player trait
  const tipCost = state.selectedTrait?.id === 'insider' ? 100 : 200;
  
  // Check if player has enough money
  if (state.cash < tipCost) {
    throw new Error('Not enough cash to buy a tip');
  }
  
  // Check if player already has an active tip
  if (state.activeTip) {
    throw new Error('You already have an active tip');
  }
  
  // Select a random item for the tip
  const validItems = state.items.filter(item => !item.name.includes('Black Market'));
  const randomItem = validItems[Math.floor(Math.random() * validItems.length)];
  
  // 70% chance the tip is accurate
  const isAccurate = Math.random() < 0.7;
  
  // Determine the actual future trend for the item (simplified)
  const actualTrend = Math.random() > 0.5 ? 'up' : 'down';
  
  // Create the tip (either accurate or misleading)
  const tip: Tip = {
    itemId: randomItem.id,
    prediction: isAccurate ? actualTrend : (actualTrend === 'up' ? 'down' : 'up'),
    accurate: isAccurate,
  };
  
  return {
    ...state,
    cash: parseFloat((state.cash - tipCost).toFixed(2)),
    activeTip: tip,
  };
};

// Insure an item
export const insureItem = (state: GameState, itemId: string): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Find the item in inventory
  const inventoryItem = state.inventory.find(i => i.id === itemId);
  if (!inventoryItem || inventoryItem.quantity <= 0) {
    throw new Error("You don't have any of this item to insure");
  }
  
  // Check if already insured
  if (inventoryItem.insured) {
    throw new Error("This item is already insured");
  }
  
  // Calculate insurance cost (10% of current value)
  const insuranceCost = parseFloat((item.price * 0.1).toFixed(2));
  
  // Check if player has enough money
  if (state.cash < insuranceCost) {
    throw new Error('Not enough cash to insure this item');
  }
  
  // Update inventory
  const updatedInventory = state.inventory.map(i => {
    if (i.id === itemId) {
      return { 
        ...i,
        insured: true,
        insuredUntil: state.day + 3 // Insured for 3 days
      };
    }
    return i;
  });
  
  // Update cash
  const updatedCash = parseFloat((state.cash - insuranceCost).toFixed(2));
  
  return {
    ...state,
    cash: updatedCash,
    inventory: updatedInventory,
  };
};

// Purchase mystery item
export const purchaseMysteryItem = (state: GameState): GameState => {
  // Check if mystery item is available
  if (!state.mysteryItemAvailable) {
    throw new Error('No mystery item available today');
  }
  
  // Check if player has enough money
  if (state.cash < state.mysteryItemPrice) {
    throw new Error('Not enough cash to buy the mystery item');
  }
  
  // Determine what the player gets
  const randomValue = Math.random();
  let cashReward = 0;
  
  if (randomValue < 0.1) { // 10% chance for big win
    cashReward = state.mysteryItemPrice * 3;
  } else if (randomValue < 0.4) { // 30% chance for medium win
    cashReward = state.mysteryItemPrice * 1.5;
  } else if (randomValue < 0.7) { // 30% chance for small win
    cashReward = state.mysteryItemPrice * 1.1;
  } // 30% chance for loss (no reward)
  
  // Update cash (deduct price and add reward)
  let updatedCash = parseFloat((state.cash - state.mysteryItemPrice).toFixed(2));
  updatedCash = parseFloat((updatedCash + cashReward).toFixed(2));
  
  return {
    ...state,
    cash: updatedCash,
    mysteryItemAvailable: false
  };
};

// Upgrade storage capacity
export const upgradeStorage = (state: GameState, itemId: string): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Calculate upgrade cost (based on item value)
  const upgradeCost = parseFloat((item.price * 3).toFixed(2));
  
  // Check if player has enough money
  if (state.cash < upgradeCost) {
    throw new Error('Not enough cash for storage upgrade');
  }
  
  // Get current upgrade level
  const currentUpgrade = state.storageUpgrades[itemId] || 0;
  
  // Limit to max 3 upgrades per item
  if (currentUpgrade >= 3) {
    throw new Error('Storage already at maximum capacity for this item');
  }
  
  // Update storage upgrades
  const updatedStorageUpgrades = {
    ...state.storageUpgrades,
    [itemId]: currentUpgrade + 1
  };
  
  // Update cash
  const updatedCash = parseFloat((state.cash - upgradeCost).toFixed(2));
  
  return {
    ...state,
    cash: updatedCash,
    storageUpgrades: updatedStorageUpgrades
  };
};

// Create a delayed order
export const createDelayedOrder = (state: GameState, itemId: string, type: 'buy' | 'sell', quantity: number): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Validate quantity
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }
  
  if (type === 'buy') {
    // Calculate total cost
    const totalCost = parseFloat((item.price * quantity).toFixed(2));
    
    // Check if player has enough money
    if (state.cash < totalCost) {
      throw new Error('Not enough cash for this order');
    }
    
    // Create order
    const newOrder = {
      type: 'buy' as const,
      itemId,
      quantity,
      price: item.price,
      executionDay: state.day + 2 // Execute in 2 days
    };
    
    // Update cash
    const updatedCash = parseFloat((state.cash - totalCost).toFixed(2));
    
    return {
      ...state,
      cash: updatedCash,
      pendingTrades: [...state.pendingTrades, newOrder]
    };
  } else { // Sell order
    // Find the item in inventory
    const inventoryItem = state.inventory.find(i => i.id === itemId);
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      throw new Error(`You don't have enough ${item.name} for this order`);
    }
    
    // Create order
    const newOrder = {
      type: 'sell' as const,
      itemId,
      quantity,
      price: item.price,
      executionDay: state.day + 2 // Execute in 2 days
    };
    
    // Update inventory (reserve the items)
    const updatedInventory = state.inventory.map(i => {
      if (i.id === itemId) {
        return { 
          ...i,
          quantity: i.quantity - quantity // Remove from inventory now
        };
      }
      return i;
    });
    
    return {
      ...state,
      inventory: updatedInventory,
      pendingTrades: [...state.pendingTrades, newOrder]
    };
  }
};

// Cancel a delayed order
export const cancelDelayedOrder = (state: GameState, orderIndex: number): GameState => {
  // Check if order exists
  if (orderIndex < 0 || orderIndex >= state.pendingTrades.length) {
    throw new Error('Order not found');
  }
  
  const orderToCancel = state.pendingTrades[orderIndex];
  
  let updatedState = { ...state };
  
  if (orderToCancel.type === 'buy') {
    // Refund the money
    const refundAmount = orderToCancel.price * orderToCancel.quantity;
    updatedState.cash = parseFloat((updatedState.cash + refundAmount).toFixed(2));
  } else { // Sell order
    // Return the items to inventory
    updatedState.inventory = updatedState.inventory.map(item => {
      if (item.id === orderToCancel.itemId) {
        return {
          ...item,
          quantity: item.quantity + orderToCancel.quantity
        };
      }
      return item;
    });
  }
  
  // Remove the order
  updatedState.pendingTrades = updatedState.pendingTrades.filter((_, index) => index !== orderIndex);
  
  return updatedState;
};

// Go all-in on a single item
export const goAllIn = (state: GameState, itemId: string): GameState => {
  const item = state.items.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  
  // Check if we are at least on day 15
  if (state.day < 15) {
    throw new Error('All-in option only available after Day 15');
  }
  
  // Sell all other items
  let updatedCash = state.cash;
  const itemsToSell = state.inventory.filter(i => i.id !== itemId && i.quantity > 0);
  
  for (const inventoryItem of itemsToSell) {
    const itemToSell = state.items.find(i => i.id === inventoryItem.id);
    if (itemToSell) {
      // Sell all of this item
      updatedCash += itemToSell.price * inventoryItem.quantity;
    }
  }
  
  // Calculate how many of the target item we can buy
  const maxAffordable = Math.floor(updatedCash / item.price);
  
  // Find the item in inventory
  const targetInventoryItem = state.inventory.find(i => i.id === itemId);
  if (!targetInventoryItem) throw new Error('Inventory item not found');
  
  // Determine max quantity for this item, considering any storage upgrades
  const storageUpgrade = state.storageUpgrades[itemId] || 0;
  const effectiveMaxQuantity = item.maxQuantity + storageUpgrade;
  
  // Calculate how many we can actually buy (limited by max capacity)
  const buyQuantity = Math.min(
    maxAffordable,
    effectiveMaxQuantity - targetInventoryItem.quantity
  );
  
  if (buyQuantity <= 0) {
    throw new Error(`You can't hold any more ${item.name}`);
  }
  
  // Calculate total cost
  const totalCost = item.price * buyQuantity;
  updatedCash -= totalCost;
  
  // Update inventory
  const updatedInventory = state.inventory.map(i => {
    if (i.id === itemId) {
      return { 
        ...i, 
        quantity: i.quantity + buyQuantity,
        purchaseDay: state.day
      };
    } else {
      // Sell all other items
      return { ...i, quantity: 0 };
    }
    return i;
  });
  
  return {
    ...state,
    cash: parseFloat(updatedCash.toFixed(2)),
    inventory: updatedInventory
  };
};

// Needed for compatibility but not implemented yet
export const upgradeMysteryItem = (state: GameState): GameState => {
  // This is a placeholder for API compatibility
  return state;
};

