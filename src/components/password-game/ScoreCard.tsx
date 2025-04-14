
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy } from 'lucide-react';

export interface ScoreCardProps {
  score: number;
  highestScore: number;
  completed: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, highestScore, completed }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your Score
        </CardTitle>
        <CardDescription>
          {completed 
            ? "You've completed the game!" 
            : "Keep solving rules to increase your score"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground mb-1">Current Score</span>
            <span className="text-4xl font-bold text-primary">{score}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground mb-1">Highest Score</span>
            <span className="text-3xl font-semibold">{highestScore}</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">How Scoring Works</h4>
              <p className="text-xs text-muted-foreground">
                Each completed rule adds to your score. Harder rules are worth more points.
                Your highest score is saved across game sessions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
