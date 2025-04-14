
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketMood as MarketMoodType } from './types';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MarketMoodProps {
  mood: MarketMoodType;
}

const MarketMood: React.FC<MarketMoodProps> = ({ mood }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-background">
              {mood.type === 'bullish' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {mood.type === 'bearish' && <TrendingDown className="h-4 w-4 text-red-500" />}
              {mood.type === 'stable' && <ArrowRight className="h-4 w-4 text-blue-500" />}
            </div>
            <span className="text-sm font-medium">
              Market Mood: 
              <span className={`ml-1 ${
                mood.type === 'bullish' ? 'text-green-500' : 
                mood.type === 'bearish' ? 'text-red-500' : 'text-blue-500'
              }`}>
                {mood.type.charAt(0).toUpperCase() + mood.type.slice(1)}
              </span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{mood.description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketMood;
