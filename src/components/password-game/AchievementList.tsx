
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AchievementItem from './AchievementItem';

interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList = ({ achievements }: AchievementListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[160px]">
          <div className="space-y-2">
            {achievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                id={achievement.id}
                title={achievement.title}
                description={achievement.description}
                unlocked={achievement.unlocked}
                icon={achievement.icon}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AchievementList;
