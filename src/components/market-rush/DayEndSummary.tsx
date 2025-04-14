
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Challenge, DailyStats } from './types';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

interface DayEndSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DailyStats;
  completedChallenges: Challenge[];
  challengeRewards: number;
}

const DayEndSummary: React.FC<DayEndSummaryProps> = ({ 
  isOpen, 
  onClose, 
  stats, 
  completedChallenges,
  challengeRewards
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Day {stats.day} Summary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Best Move */}
          {stats.bestMove && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-medium">Best Move</h3>
                <p className="text-sm">
                  {stats.bestMove.item}: +${stats.bestMove.profit.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          
          {/* Worst Move */}
          {stats.worstMove && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-red-500/10">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium">Worst Move</h3>
                <p className="text-sm">
                  {stats.worstMove.item}: -${Math.abs(stats.worstMove.loss).toFixed(2)}
                </p>
              </div>
            </div>
          )}
          
          {/* Items Perished */}
          {stats.itemsPerished.length > 0 && (
            <div className="p-3 rounded-md bg-amber-500/10">
              <h3 className="font-medium text-amber-600">Items Perished</h3>
              <p className="text-sm">
                {stats.itemsPerished.join(', ')} perished due to age.
              </p>
            </div>
          )}
          
          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div className="p-3 rounded-md bg-blue-500/10">
              <h3 className="font-medium text-blue-600">Challenges Completed</h3>
              <ul className="text-sm mt-1">
                {completedChallenges.map((challenge) => (
                  <li key={challenge.id} className="flex justify-between">
                    <span>{challenge.description}</span>
                    <span className="font-medium">+${challenge.reward}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t border-muted flex justify-between">
                <span className="font-medium">Total Rewards</span>
                <span className="flex items-center text-green-500 font-medium">
                  <Coins className="h-3.5 w-3.5 mr-1" />
                  ${challengeRewards}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEndSummary;
