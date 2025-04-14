
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, CircleDollarSign, Coins, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tip, Item, PlayerTrait } from './types';

interface GameActionsProps {
  day: number;
  cash: number;
  loanAmount: number;
  activeTip: Tip | null;
  items: Item[];
  onNextDay: () => void;
  onGetTip: () => void;
  onLoan: () => void;
  onPayLoan: () => void;
  playerTrait?: PlayerTrait | null;
  showAllIn?: boolean;
  onAllIn?: (itemId: string) => void;
}

const GameActions: React.FC<GameActionsProps> = ({
  day,
  cash,
  loanAmount,
  activeTip,
  items,
  onNextDay,
  onGetTip,
  onLoan,
  onPayLoan,
  playerTrait,
  showAllIn
}) => {
  // Get the item name from the active tip
  const tipItemName = activeTip 
    ? items.find(item => item.id === activeTip.itemId)?.name
    : null;
  
  // Determine tip cost based on player trait
  const tipCost = playerTrait?.id === 'insider' ? 100 : 200;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Actions</span>
          {playerTrait && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{playerTrait.icon}</span>
              <span>{playerTrait.name}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={onNextDay} 
          className="w-full"
          size="lg"
        >
          Next Day →
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onGetTip}
            disabled={cash < tipCost || day >= 30 || !!activeTip}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Get Tip (${tipCost})
          </Button>
          
          {loanAmount > 0 ? (
            <Button 
              variant="destructive" 
              onClick={onPayLoan}
              disabled={cash < loanAmount}
            >
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Pay Loan (${loanAmount})
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onLoan}
              disabled={day >= 25 || loanAmount > 0}
            >
              <Coins className="h-4 w-4 mr-2" />
              Take Loan ($500)
            </Button>
          )}
        </div>
        
        {showAllIn && (
          <Button 
            variant="outline"
            className="w-full flex items-center gap-2 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
          >
            <Zap className="h-4 w-4 text-amber-500" />
            Go All In
          </Button>
        )}
        
        {activeTip && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Market Tip</AlertTitle>
            <AlertDescription>
              {tipItemName} might go {activeTip.prediction} soon.
            </AlertDescription>
          </Alert>
        )}
        
        {loanAmount > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Loan Information</AlertTitle>
            <AlertDescription>
              You have a loan of ${loanAmount} due on Day {day + 5}.
              Failure to repay will result in penalties.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default GameActions;
