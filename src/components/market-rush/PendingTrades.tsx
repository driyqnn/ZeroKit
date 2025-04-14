
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from './types';
import { Clock } from 'lucide-react';

interface PendingTradesProps {
  pendingTrades: {
    type: 'buy' | 'sell';
    itemId: string;
    quantity: number;
    price: number;
    executionDay: number;
  }[];
  items: Item[];
  currentDay: number;
}

const PendingTrades: React.FC<PendingTradesProps> = ({ pendingTrades, items, currentDay }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending Trades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {pendingTrades.length > 0 ? (
          <ul className="space-y-2">
            {pendingTrades.map((trade, index) => {
              const item = items.find(i => i.id === trade.itemId);
              if (!item) return null;
              
              return (
                <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div>
                    <span className={trade.type === 'buy' ? 'text-blue-500' : 'text-green-500'}>
                      {trade.type === 'buy' ? 'Buy' : 'Sell'} 
                    </span>
                    <span> {trade.quantity} {item.name} @ ${trade.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Executes on Day {trade.executionDay} ({trade.executionDay - currentDay} days)
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No pending trades</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTrades;
