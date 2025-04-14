import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GameHeader from './GameHeader';
import ItemsTable from './ItemsTable';
import GameActions from './GameActions';
import GameEvents from './GameEvents';
import GameOver from './GameOver';
import PlayerTraitSelector from './PlayerTraitSelector';
import DailyChallenges from './DailyChallenges';
import MarketMood from './MarketMood';
import TradeHistory from './TradeHistory';
import DayEndSummary from './DayEndSummary';
import PendingTrades from './PendingTrades';
import MysteryItem from './MysteryItem';
import {
  initializeGame,
  nextDay,
  buyItem,
  sellItem,
  takeLoan,
  payLoan,
  buyTip,
  insureItem,
  upgradeMysteryItem, 
  purchaseMysteryItem,
  upgradeStorage,
  createDelayedOrder,
  cancelDelayedOrder,
  goAllIn,
  generateDailyChallenges
} from './gameLogic';
import { GameState, PriceHistory, Item, InventoryItem, PlayerTrait, Challenge, DailyStats } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PriceChart from './PriceChart';

const MarketRushGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({});
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dayEndSummary, setDayEndSummary] = useState<{ isOpen: boolean, stats: DailyStats | null, completedChallenges: Challenge[], rewards: number }>({
    isOpen: false,
    stats: null,
    completedChallenges: [],
    rewards: 0
  });
  
  // Check if game needs trait selection
  const needsTraitSelection = !gameState.gameOver && gameState.day === 1 && !gameState.selectedTrait;

  // Initialize price history
  useEffect(() => {
    const initialPriceHistory: PriceHistory = {};
    gameState.items.forEach(item => {
      initialPriceHistory[item.id] = [item.price];
    });
    setPriceHistory(initialPriceHistory);
  }, []);

  // Update price history when day changes
  useEffect(() => {
    if (gameState.day > 1) {
      const updatedHistory = { ...priceHistory };
      gameState.items.forEach(item => {
        if (updatedHistory[item.id]) {
          updatedHistory[item.id].push(item.price);
        } else {
          updatedHistory[item.id] = [item.price];
        }
      });
      setPriceHistory(updatedHistory);
    }
  }, [gameState.day]);

  // Always show price chart if player has Analyst trait
  useEffect(() => {
    if (gameState.selectedTrait?.id === 'analyst') {
      setShowPriceChart(true);
    }
  }, [gameState.selectedTrait]);

  const handleBuy = (item: Item) => {
    try {
      const newGameState = buyItem(gameState, item.id);
      setGameState(newGameState);
      toast.success(`Bought 1 ${item.name}`);
      
      // Add to trade history
      const updatedGameState = {
        ...newGameState,
        tradeHistory: [
          ...newGameState.tradeHistory,
          {
            day: newGameState.day,
            action: 'buy' as const,
            itemName: item.name,
            quantity: 1,
            price: item.price,
            total: item.price
          }
        ]
      };
      setGameState(updatedGameState);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSell = (item: InventoryItem) => {
    try {
      const newGameState = sellItem(gameState, item.id);
      setGameState(newGameState);
      toast.success(`Sold 1 ${item.name}`);
      
      // Add to trade history
      const currentItem = gameState.items.find(i => i.id === item.id);
      if (currentItem) {
        const updatedGameState = {
          ...newGameState,
          tradeHistory: [
            ...newGameState.tradeHistory,
            {
              day: newGameState.day,
              action: 'sell' as const,
              itemName: item.name,
              quantity: 1,
              price: currentItem.price,
              total: currentItem.price
            }
          ]
        };
        setGameState(updatedGameState);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleInsureItem = (item: Item) => {
    try {
      const newGameState = insureItem(gameState, item.id);
      setGameState(newGameState);
      toast.success(`Insured ${item.name} for 3 days`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleUpgradeStorage = (item: Item) => {
    try {
      const newGameState = upgradeStorage(gameState, item.id);
      setGameState(newGameState);
      toast.success(`Upgraded storage capacity for ${item.name}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleCreateDelayedOrder = (item: Item, type: 'buy' | 'sell', quantity: number) => {
    try {
      const newGameState = createDelayedOrder(gameState, item.id, type, quantity);
      setGameState(newGameState);
      toast.success(`Created delayed ${type} order for ${quantity} ${item.name}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleGoAllIn = (item: Item) => {
    try {
      const newGameState = goAllIn(gameState, item.id);
      setGameState(newGameState);
      toast.success(`Going all-in on ${item.name}!`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePurchaseMysteryItem = () => {
    try {
      const newGameState = purchaseMysteryItem(gameState);
      setGameState(newGameState);
      toast.success("You've purchased a mystery item!");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleNextDay = () => {
    try {
      // Check for completed challenges
      const completedChallenges = gameState.dailyChallenges.filter(c => 
        c.check(gameState) && !c.completed
      );
      
      let challengeRewards = 0;
      let updatedGameState = { ...gameState };
      
      // Apply challenge rewards
      if (completedChallenges.length > 0) {
        updatedGameState = { 
          ...updatedGameState, 
          dailyChallenges: updatedGameState.dailyChallenges.map(c => 
            completedChallenges.find(cc => cc.id === c.id) 
              ? { ...c, completed: true } 
              : c
          )
        };
        
        challengeRewards = completedChallenges.reduce((sum, c) => sum + c.reward, 0);
        updatedGameState.cash += challengeRewards;
      }
      
      // Process to next day
      const newGameState = nextDay(updatedGameState);
      
      // Generate new daily challenges if needed
      if (completedChallenges.length > 0 || newGameState.dailyChallenges.every(c => c.completed)) {
        newGameState.dailyChallenges = generateDailyChallenges(newGameState);
      }
      
      // Save the current state
      setGameState(newGameState);
      
      // If we have day end stats and didn't just end the game, show summary
      if (newGameState.dailyStats.length > 0 && !newGameState.gameOver) {
        const latestStats = newGameState.dailyStats[newGameState.dailyStats.length - 1];
        setDayEndSummary({
          isOpen: true,
          stats: latestStats,
          completedChallenges,
          rewards: challengeRewards
        });
      }
      
      // Check for loan due
      if (newGameState.loanAmount > 0 && newGameState.loanDueDay === newGameState.day) {
        toast.warning("Your loan payment is due today!");
      }
      
      // Show events
      if (newGameState.events.length > 0) {
        const latestEvent = newGameState.events[newGameState.events.length - 1];
        toast.info(latestEvent.description);
      }
      
      // Check for perished items
      const perishedItems = gameState.inventory.filter(
        item => item.perishable && item.purchaseDay && 
               (newGameState.day - item.purchaseDay) >= item.perishDays && 
               item.quantity > 0
      );
      
      if (perishedItems.length > 0) {
        perishedItems.forEach(item => {
          toast.error(`Your ${item.name} has perished!`);
        });
      }
      
      // Process delayed trades
      const executingTrades = newGameState.pendingTrades.filter(trade => 
        trade.executionDay === newGameState.day
      );
      
      if (executingTrades.length > 0) {
        toast.info(`Executing ${executingTrades.length} pending trades...`);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleGetTip = () => {
    try {
      const tipCost = gameState.selectedTrait?.id === 'insider' ? 100 : 200;
      const newGameState = buyTip(gameState);
      setGameState(newGameState);
      
      if (newGameState.activeTip) {
        const item = newGameState.items.find(i => i.id === newGameState.activeTip?.itemId);
        if (item) {
          toast.success(`Tip received: ${item.name} might go ${newGameState.activeTip.prediction}!`);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleLoan = () => {
    try {
      const newGameState = takeLoan(gameState);
      setGameState(newGameState);
      toast.success(`Loan of $500 taken. Due on Day ${newGameState.loanDueDay}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePayLoan = () => {
    try {
      const newGameState = payLoan(gameState);
      setGameState(newGameState);
      toast.success("Loan paid off!");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
    setShowPriceChart(true);
  };

  const handleSelectTrait = (trait: PlayerTrait) => {
    // Apply trait effects to the game state
    let updatedState = { ...gameState, selectedTrait: trait };
    
    // Special trait effects
    if (trait.id === 'hoarder') {
      // Increase max quantity for all items by 50%
      updatedState.items = updatedState.items.map(item => ({
        ...item,
        maxQuantity: Math.floor(item.maxQuantity * 1.5)
      }));
    }
    else if (trait.id === 'gambler') {
      // Increase volatility for all items
      updatedState.items = updatedState.items.map(item => ({
        ...item,
        volatility: item.volatility * 1.3
      }));
    }
    
    // Generate initial challenges
    updatedState.dailyChallenges = generateDailyChallenges(updatedState);
    
    setGameState(updatedState);
    toast.success(`You selected ${trait.name}!`);
  };

  const restartGame = () => {
    setGameState(initializeGame());
    setPriceHistory({});
    setShowPriceChart(false);
    setSelectedItemId(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {needsTraitSelection ? (
        <PlayerTraitSelector onSelectTrait={handleSelectTrait} />
      ) : !gameState.gameOver ? (
        <div className="space-y-6">
          <GameHeader 
            day={gameState.day} 
            cash={gameState.cash}
            loanAmount={gameState.loanAmount}
            loanDueDay={gameState.loanDueDay}
            aiRivalCash={gameState.aiRivalCash}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <Tabs defaultValue="market" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="market">Market</TabsTrigger>
                      <TabsTrigger value="inventory">Inventory</TabsTrigger>
                      {(showPriceChart || gameState.selectedTrait?.id === 'analyst') && (
                        <TabsTrigger value="charts">Price Charts</TabsTrigger>
                      )}
                      <TabsTrigger value="history">Trade History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="market" className="mt-0">
                      {/* Market Mood */}
                      <MarketMood mood={gameState.marketMood} />
                      
                      {/* Mystery Item (random days) */}
                      {gameState.mysteryItemAvailable && (
                        <div className="mb-4">
                          <MysteryItem 
                            price={gameState.mysteryItemPrice} 
                            cash={gameState.cash}
                            onPurchase={handlePurchaseMysteryItem}
                          />
                        </div>
                      )}
                      
                      <ItemsTable
                        items={gameState.items}
                        inventory={gameState.inventory}
                        cash={gameState.cash}
                        onBuy={handleBuy}
                        onSell={handleSell}
                        onSelectItem={handleSelectItem}
                        selectedItemId={selectedItemId}
                        showBlackMarket={gameState.blackMarketUnlocked}
                        onInsureItem={handleInsureItem}
                        onUpgradeStorage={handleUpgradeStorage}
                        onDelayedOrder={handleCreateDelayedOrder}
                        onGoAllIn={gameState.day >= 15 ? handleGoAllIn : undefined}
                        playerTrait={gameState.selectedTrait}
                        storageUpgrades={gameState.storageUpgrades}
                      />
                    </TabsContent>
                    
                    <TabsContent value="inventory" className="mt-0">
                      {gameState.inventory.filter(item => item.quantity > 0).length > 0 ? (
                        <ItemsTable
                          showOnlyInventory
                          items={gameState.items}
                          inventory={gameState.inventory.filter(item => item.quantity > 0)}
                          cash={gameState.cash}
                          onBuy={handleBuy}
                          onSell={handleSell}
                          onSelectItem={handleSelectItem}
                          selectedItemId={selectedItemId}
                          onInsureItem={handleInsureItem}
                          storageUpgrades={gameState.storageUpgrades}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Your inventory is empty.</p>
                          <p className="text-muted-foreground">Buy items from the Market tab!</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    {(showPriceChart || gameState.selectedTrait?.id === 'analyst') && (
                      <TabsContent value="charts" className="mt-0">
                        <PriceChart 
                          priceHistory={priceHistory}
                          items={gameState.items}
                          selectedItemId={selectedItemId}
                        />
                      </TabsContent>
                    )}
                    
                    <TabsContent value="history" className="mt-0">
                      <TradeHistory history={gameState.tradeHistory} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {/* Daily Challenges */}
              <DailyChallenges challenges={gameState.dailyChallenges} />
              
              {/* Pending Trades */}
              {gameState.pendingTrades.length > 0 && (
                <PendingTrades 
                  pendingTrades={gameState.pendingTrades} 
                  items={gameState.items}
                  currentDay={gameState.day}
                />
              )}
              
              <GameActions
                day={gameState.day}
                cash={gameState.cash}
                loanAmount={gameState.loanAmount}
                activeTip={gameState.activeTip}
                items={gameState.items}
                onNextDay={handleNextDay}
                onGetTip={handleGetTip}
                onLoan={handleLoan}
                onPayLoan={handlePayLoan}
                playerTrait={gameState.selectedTrait}
                showAllIn={gameState.day >= 15}
              />
              
              <GameEvents 
                events={gameState.events} 
                day={gameState.day}
                activeTip={gameState.activeTip}
                items={gameState.items}
              />
            </div>
          </div>
          
          {/* Day End Summary Modal */}
          {dayEndSummary.isOpen && dayEndSummary.stats && (
            <DayEndSummary
              isOpen={dayEndSummary.isOpen}
              onClose={() => setDayEndSummary(prev => ({ ...prev, isOpen: false }))}
              stats={dayEndSummary.stats}
              completedChallenges={dayEndSummary.completedChallenges}
              challengeRewards={dayEndSummary.rewards}
            />
          )}
        </div>
      ) : (
        <GameOver 
          finalStats={gameState.finalStats!} 
          days={gameState.day}
          onRestart={restartGame}
          priceHistory={priceHistory}
          items={gameState.items}
        />
      )}
    </div>
  );
};

export default MarketRushGame;
