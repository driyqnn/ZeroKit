
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Achievement } from './types';
import { Award, Clock, Check, Key, Sparkles } from 'lucide-react';

export const useGameAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Initialize achievements
  useEffect(() => {
    setAchievements([
      {
        id: 1,
        title: "Beginner",
        description: "Completed 5 rules",
        unlocked: false,
        icon: <Award className="h-4 w-4 text-amber-500" />
      },
      {
        id: 2,
        title: "Intermediate",
        description: "Completed 15 rules",
        unlocked: false,
        icon: <Award className="h-4 w-4 text-slate-400" />
      },
      {
        id: 3,
        title: "Advanced",
        description: "Completed 30 rules",
        unlocked: false,
        icon: <Award className="h-4 w-4 text-yellow-500" />
      },
      {
        id: 4,
        title: "Expert",
        description: "Completed 50 rules",
        unlocked: false,
        icon: <Award className="h-4 w-4 text-emerald-500" />
      },
      {
        id: 5,
        title: "Master",
        description: "Completed all rules",
        unlocked: false,
        icon: <Sparkles className="h-4 w-4 text-violet-500" />
      },
      {
        id: 6,
        title: "Speed Demon",
        description: "Completed 10 rules in under 2 minutes",
        unlocked: false,
        icon: <Clock className="h-4 w-4 text-red-500" />
      },
      {
        id: 7,
        title: "Perfect Start",
        description: "Completed the first 5 rules without errors",
        unlocked: false,
        icon: <Check className="h-4 w-4 text-green-500" />
      },
      {
        id: 8,
        title: "Completionist",
        description: "Tried 50 different passwords",
        unlocked: false,
        icon: <Key className="h-4 w-4 text-blue-500" />
      }
    ]);
  }, []);

  // Function to unlock an achievement
  const unlockAchievement = (id: number, title: string) => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          toast.success(`Achievement unlocked: ${title}`);
          return { ...achievement, unlocked: true };
        }
        return achievement;
      })
    );
  };

  return { achievements, unlockAchievement };
};
