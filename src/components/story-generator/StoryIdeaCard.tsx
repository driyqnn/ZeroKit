
import React from 'react';
import { StoryIdea } from '@/contexts/StoryIdeaGeneratorContext';

interface StoryIdeaCardProps {
  idea: StoryIdea;
  compact?: boolean;
}

export const StoryIdeaCard: React.FC<StoryIdeaCardProps> = ({ idea, compact = false }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className={`font-semibold ${compact ? 'text-lg' : 'text-xl'}`}>Premise</h3>
        <p className="text-muted-foreground">{idea.premise}</p>
      </div>
      
      {!compact && (
        <>
          {idea.protagonist && (
            <div className="space-y-2">
              <h3 className="font-semibold">Protagonist</h3>
              <p className="text-muted-foreground">{idea.protagonist}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">Setting</h3>
            <p className="text-muted-foreground">{idea.setting}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Conflict</h3>
            <p className="text-muted-foreground">{idea.conflict}</p>
          </div>
          
          {idea.twist && (
            <div className="space-y-2">
              <h3 className="font-semibold">Plot Twist</h3>
              <p className="text-muted-foreground">{idea.twist}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
