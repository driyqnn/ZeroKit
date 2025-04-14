
import React from 'react';

interface AchievementProps {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

const AchievementItem = ({ id, title, description, unlocked, icon }: AchievementProps) => {
  return (
    <div
      className={`flex items-center p-2 rounded-md ${
        unlocked
          ? "bg-primary/10 text-primary"
          : "bg-muted/30 text-muted-foreground"
      }`}
    >
      <div className="mr-2">{icon}</div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs">{description}</div>
      </div>
    </div>
  );
};

export default AchievementItem;
