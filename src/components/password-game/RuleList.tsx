
import React from 'react';
import { Rule } from './types';
import RuleItem from './RuleItem';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export interface RuleListProps {
  rules: Rule[];
  showCompleted: boolean;
  onToggleShowCompleted?: () => void; // Added this prop
  completedCount?: number; // Added optional props
  totalCount?: number;
}

const RuleList: React.FC<RuleListProps> = ({ 
  rules, 
  showCompleted, 
  onToggleShowCompleted,
  completedCount,
  totalCount
}) => {
  // Filter active rules
  const activeRules = rules.filter(rule => rule.isActive);
  
  // Further filter based on showCompleted setting
  const displayRules = showCompleted 
    ? activeRules 
    : activeRules.filter(rule => !rule.isCompleted);

  return (
    <div className="space-y-3">
      {completedCount !== undefined && totalCount !== undefined && (
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} rules completed
          </div>
          {onToggleShowCompleted && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleShowCompleted}
            >
              {showCompleted ? (
                <>
                  <EyeOffIcon className="h-4 w-4 mr-2" />
                  Hide Completed
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Show Completed
                </>
              )}
            </Button>
          )}
        </div>
      )}
      
      {displayRules.map(rule => (
        <RuleItem key={rule.id} rule={rule} />
      ))}
      
      {displayRules.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          {showCompleted 
            ? "No active rules yet. Start the game to get your first rule!"
            : "All active rules have been completed!"}
        </div>
      )}
    </div>
  );
};

export default RuleList;
