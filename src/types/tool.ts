
import { LucideIcon } from "lucide-react";

export interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}
