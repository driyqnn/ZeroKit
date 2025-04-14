
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Challenge } from './types';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

interface DailyChallengesProps {
  challenges: Challenge[];
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ challenges }) => {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Daily Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {challenges.map((challenge) => (
            <li 
              key={challenge.id} 
              className={`flex items-center justify-between p-2 rounded-md ${
                challenge.completed ? 'bg-green-500/10' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {challenge.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={challenge.completed ? 'line-through text-muted-foreground' : ''}>
                  {challenge.description}
                </span>
              </div>
              <span className="text-sm font-medium">${challenge.reward}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DailyChallenges;
