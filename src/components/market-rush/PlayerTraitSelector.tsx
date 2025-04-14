
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Clock, ChartLine, CircleDollarSign, Package } from 'lucide-react';
import { PlayerTrait } from './types';

interface PlayerTraitSelectorProps {
  onSelectTrait: (trait: PlayerTrait) => void;
}

const PlayerTraitSelector: React.FC<PlayerTraitSelectorProps> = ({ onSelectTrait }) => {
  // Define available traits
  const traits: PlayerTrait[] = [
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
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Choose Your Trader Trait</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Select a trait that will define your trading style for all 30 days
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traits.map((trait) => (
            <Card 
              key={trait.id} 
              className="cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => onSelectTrait(trait)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">{trait.icon}</div>
                  <h3 className="font-medium mb-1">{trait.name}</h3>
                  <p className="text-xs text-muted-foreground">{trait.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerTraitSelector;
