
import React from 'react';
import { Check, X } from 'lucide-react';
import { Rule } from './types';

interface RuleProps {
  rule: Rule;
}

const RuleItem: React.FC<RuleProps> = ({ rule }) => {
  const { id, title, description, isCompleted, icon: Icon } = rule;
  
  return (
    <div
      className={`mb-4 p-3 rounded-md border ${
        isCompleted
          ? "bg-green-500/10 border-green-500/30"
          : "bg-muted/30 border-muted"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{title}</h3>
            {isCompleted ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default RuleItem;
