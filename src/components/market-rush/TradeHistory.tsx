
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradeHistoryItem } from './types';
import { History } from 'lucide-react';

interface TradeHistoryProps {
  history: TradeHistoryItem[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Trade History
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-2 rounded-md ${
                  item.action === 'buy' ? 'bg-blue-500/10' : 'bg-green-500/10'
                }`}
              >
                <div>
                  <span className="text-sm font-medium">Day {item.day}: </span>
                  <span className="text-sm">
                    {item.action === 'buy' ? 'Bought ' : 'Sold '}
                    {item.quantity} {item.itemName} 
                    {item.action === 'buy' ? ' for ' : ' at '}
                    ${item.price.toFixed(2)} each
                  </span>
                </div>
                <div className={`font-medium ${item.action === 'buy' ? 'text-red-500' : 'text-green-500'}`}>
                  {item.action === 'buy' ? '-' : '+'}${item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">No trades yet. Start trading to see your history!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeHistory;
