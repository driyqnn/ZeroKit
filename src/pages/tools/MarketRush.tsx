
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import MarketRushGame from '@/components/market-rush/MarketRushGame';
import { Coins } from 'lucide-react';
import MobileNotice from '@/components/MobileNotice';

const MarketRush = () => {
  return (
    <ToolLayout
      title="Market Rush Game"
      description="Trading simulator: buy low, sell high over 30 days to maximize your profits"
      icon={<Coins className="h-6 w-6 text-primary" />}
      category="Games"
    >
      <MobileNotice toolName="Market Rush">
        <MarketRushGame />
      </MobileNotice>
    </ToolLayout>
  );
};

export default MarketRush;
