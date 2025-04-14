
import { LucideIcon } from "lucide-react";

export interface Rule {
  id: number;
  title: string;
  description: string;
  validator: (password: string) => boolean;
  isActive: boolean;
  isCompleted: boolean;
  icon: LucideIcon;
  score: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}
