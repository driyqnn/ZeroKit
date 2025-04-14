import {
  GraduationCap,
  BookOpen,
  BookMarked,
  Quote,
  PenSquare,
  BookText,
  PanelLeft,
  Calculator,
  ThumbsUp,
  AtomIcon,
  Braces,
  Music,
  Bell,
  Brain,
  FlaskConical,
  Atom,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface Category {
  title: string;
  tools: Tool[];
}

export const academicTools: Category = {
  title: "Academic Tools",
  tools: [
    {
      icon: Calculator,
      title: "General Average Calculator",
      description: "Calculate average grades and track academic performance.",
      slug: "general-average-calculator",
    },
    {
      icon: GraduationCap,
      title: "GWA Calculator",
      description: "Calculate General Weighted Average for academic records.",
      slug: "gwa-calculator",
    },

    {
      icon: Quote,
      title: "Citation Generator",
      description:
        "Create properly formatted citations in APA, MLA, Chicago, and other styles.",
      slug: "citation-generator",
    },
    {
      icon: BookText,
      title: "Dictionary & Thesaurus",
      description: "Look up word definitions, synonyms, and antonyms.",
      slug: "dictionary-thesaurus",
    },
    {
      icon: Calculator,
      title: "Physics Calculator",
      description:
        "Calculate common physics formulas for mechanics, thermodynamics, and more.",
      slug: "physics-calculator",
    },
    {
      icon: Braces,
      title: "Trigonometry Solver",
      description: "Solve trigonometric equations and visualize functions.",
      slug: "trigonometry-solver",
    },
    {
      icon: PanelLeft,
      title: "Data Sorting",
      description: "Sort and organize data sets with various algorithms.",
      slug: "data-sorting",
    },
  ],
};
