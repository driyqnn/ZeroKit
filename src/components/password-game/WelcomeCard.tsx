
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Lock, Puzzle, Trophy } from "lucide-react";

export interface WelcomeCardProps {
  onStart: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ onStart }) => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl flex justify-center items-center gap-3">
          <Lock className="h-8 w-8 text-primary" />
          The Password Game
        </CardTitle>
        <CardDescription className="text-lg">
          Can you create a password that satisfies all the rules?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg flex flex-col items-center text-center gap-2">
              <Puzzle className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Dynamic Challenges</h3>
              <p className="text-muted-foreground text-sm">
                Rules are progressively revealed as you solve each challenge
              </p>
            </div>
            <div className="p-4 border rounded-lg flex flex-col items-center text-center gap-2">
              <Lock className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Test Your Creativity</h3>
              <p className="text-muted-foreground text-sm">
                Come up with innovative ways to meet the password requirements
              </p>
            </div>
            <div className="p-4 border rounded-lg flex flex-col items-center text-center gap-2">
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Earn Achievements</h3>
              <p className="text-muted-foreground text-sm">
                Unlock special achievements as you progress through the game
              </p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-black/20 rounded-lg">
            <p className="text-muted-foreground mb-6">
              Inspired by Neal Agarwal's "The Password Game", this is a fun way to explore the 
              absurdity of complex password requirements while testing your problem-solving skills.
            </p>
            <Button onClick={onStart} className="w-full md:w-auto">
              <KeyRound className="mr-2 h-4 w-4" />
              Start the Game
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
