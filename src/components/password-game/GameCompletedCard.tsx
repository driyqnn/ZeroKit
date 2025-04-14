
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";
import confetti from 'canvas-confetti';

export interface GameCompletedCardProps {
  score: number;
  onRestart: () => void;
}

const GameCompletedCard: React.FC<GameCompletedCardProps> = ({ score, onRestart }) => {
  React.useEffect(() => {
    // Trigger confetti explosion when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <Card className="border-primary/50 bg-black/70">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl flex justify-center items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Game Completed!
        </CardTitle>
        <CardDescription className="text-lg">
          Congratulations! You've created a password that satisfies all the rules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Your Final Score</h3>
            <p className="text-4xl font-bold text-primary mb-4">{score}</p>
            <p className="text-muted-foreground mb-6">
              You've demonstrated exceptional password-creating skills! Your password met all the criteria 
              and you've mastered the absurd art of secure (and overly complicated) passwords.
            </p>
            <Button onClick={onRestart} className="w-full md:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCompletedCard;
