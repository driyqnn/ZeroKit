import {
  Calculator,
  Percent,
  ArrowLeftRight,
  Ruler,
  Hash,
  Timer,
  Scale,
  FileText,
  FileDigit,
  Clock,
  Braces,
  CalendarClock,
  Shuffle,
  Database,
  CaseSensitive,
  Binary,
  ListFilter,
  Dices,
  Keyboard,
  Key,
  Lock,
  File,
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

export const convertersCalculators: Category = {
  title: "Converters & Calculators",
  tools: [
    {
      icon: ArrowLeftRight,
      title: "Unit Converter",
      description:
        "Convert between different units of measurement with precision.",
      slug: "unit-converter",
      isPopular: true,
    },
    {
      icon: Clock,
      title: "Time Zone Converter",
      description:
        "Convert times across different time zones with current time display.",
      slug: "time-zone-converter",
    },
    {
      icon: Calculator,
      title: "BMI Calculator",
      description:
        "Calculate your Body Mass Index (BMI) and get health insights.",
      slug: "bmi-calculator",
    },
    {
      icon: Braces,
      title: "JSON-YAML Converter",
      description: "Convert between JSON and YAML formats with validation.",
      slug: "json-yaml-converter",
    },
    {
      icon: Binary,
      title: "Base64 Tool",
      description:
        "Encode and decode Base64 data with support for text and files.",
      slug: "base64-tool",
    },
    {
      icon: CaseSensitive,
      title: "Text Case Converter",
      description:
        "Convert text between different cases (uppercase, lowercase, title case, etc.).",
      slug: "text-case-converter",
    },

    {
      icon: CalendarClock,
      title: "Timestamp Converter",
      description: "Convert between timestamps and human-readable dates.",
      slug: "timestamp-converter",
      isNew: true,
    },
    {
      icon: Hash,
      title: "Hash Generator",
      description: "Generate various hash types from text or files.",
      slug: "hash-generator",
    },
    {
      icon: Lock,
      title: "Password Security",
      description: "Check password strength and generate secure passwords.",
      slug: "password-security",
    },
    {
      icon: Key,
      title: "Password Game",
      description:
        "Challenge yourself to create the strongest password in this fun game.",
      slug: "password-game",
      isNew: true,
    },
    {
      icon: Percent,
      title: "Statistical Calculator",
      description: "Calculate mean, median, mode, standard deviation and more.",
      slug: "statistical-calculator",
    },
    {
      icon: Calculator,
      title: "Matrix Calculator",
      description:
        "Perform operations on matrices including addition, multiplication and inverses.",
      slug: "matrix-calculator",
      isNew: true,
    },

    {
      icon: Scale,
      title: "Loan Calculator",
      description:
        "Calculate loan payments, interest, and amortization schedules.",
      slug: "loan-calculator",
    },
    {
      icon: Shuffle,
      title: "UUID Generator",
      description: "Generate random UUIDs (Universally Unique Identifiers).",
      slug: "uuid-generator",
    },
    {
      icon: Dices,
      title: "Dice Roller",
      description:
        "Roll virtual dice for games, decisions, or random number generation.",
      slug: "dice-roller",
    },
  ],
};
