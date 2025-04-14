
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameEvent, Tip, Item } from './types';
import { AlertCircle } from 'lucide-react';

interface GameEventsProps {
  events: GameEvent[];
  day: number;
  activeTip: Tip | null;
  items: Item[];
}

const GameEvents: React.FC<GameEventsProps> = ({ events, day, activeTip, items }) => {
  // Filter events to show only the most recent ones (last 3 days)
  const recentEvents = events.slice(-5);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentEvents.length > 0 ? (
          <ul className="space-y-3">
            {recentEvents.map((event, index) => (
              <li key={index} className="border-b pb-2 last:border-none">
                <p className="text-sm text-muted-foreground">Day {day - (recentEvents.length - index - 1)}</p>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No market news yet. Wait for events to unfold as days progress.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GameEvents;
