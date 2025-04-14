
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GameHeaderProps {
  day: number;
  cash: number;
  loanAmount: number;
  loanDueDay: number | null;
  aiRivalCash: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  day, 
  cash, 
  loanAmount,
  loanDueDay,
  aiRivalCash
}) => {
  // Calculate progress percentage (day out of 30)
  const progressPercentage = (day / 30) * 100;
  
  // Calculate cash difference with AI rival
  const cashDiff = cash - aiRivalCash;
  const isLeading = cashDiff >= 0;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold">Day {day} of 30</h2>
              <Progress value={progressPercentage} className="h-2 mt-2 w-full md:w-40" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Cash</p>
                <p className="text-2xl font-bold text-green-500">${cash.toFixed(2)}</p>
              </div>
              
              {loanAmount > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Loan Due (Day {loanDueDay})
                  </p>
                  <p className="text-2xl font-bold text-red-500">-${loanAmount.toFixed(2)}</p>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Rival Trader</p>
                <p className="text-2xl font-bold">${aiRivalCash.toFixed(2)}</p>
                
                {cashDiff !== 0 && (
                  <p className={`text-sm ${isLeading ? 'text-green-500' : 'text-red-500'}`}>
                    {isLeading ? '+' : ''}{cashDiff.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHeader;
