
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinalStats, PriceHistory, Item } from './types';
import { Check, X, RefreshCw, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import PriceChart from './PriceChart';

interface GameOverProps {
  finalStats: FinalStats;
  days: number;
  onRestart: () => void;
  priceHistory: PriceHistory;
  items: Item[];
}

const GameOver: React.FC<GameOverProps> = ({ 
  finalStats, 
  days,
  onRestart,
  priceHistory,
  items
}) => {
  const { finalCash, profit, bestItem, beatAI } = finalStats;
  
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl flex justify-center items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Market Rush Complete!
          </CardTitle>
          <CardDescription className="text-xl">
            You completed {days} days of trading
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Final Cash</p>
              <p className="text-3xl font-bold">${finalCash.toFixed(2)}</p>
              <p className={`text-sm ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profit >= 0 ? (
                  <span className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" /> +${profit.toFixed(2)}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <TrendingDown className="h-4 w-4" /> ${profit.toFixed(2)}
                  </span>
                )}
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Best Item</p>
              <p className="text-2xl font-bold">{bestItem.name}</p>
              <p className={`text-sm ${bestItem.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {bestItem.profit >= 0 ? '+' : ''}${bestItem.profit.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">AI Rival</p>
              {beatAI ? (
                <div className="flex flex-col items-center">
                  <Check className="h-8 w-8 text-green-500" />
                  <p className="text-green-500 font-semibold mt-1">Defeated!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <X className="h-8 w-8 text-red-500" />
                  <p className="text-red-500 font-semibold mt-1">Lost!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-4">Market Price History</h3>
            <PriceChart 
              priceHistory={priceHistory}
              items={items}
              selectedItemId={null}
              showAllItems
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} size="lg" className="px-8">
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOver;
