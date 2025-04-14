import {
  Calculator,
  HeartPulse,
  Keyboard,
  Dice6,
  LineChart,
  Coins,
} from "lucide-react";

export const lifestyleTools = {
  title: "Lifestyle & Productivity",
  slug: "lifestyle",
  tools: [
    {
      icon: Calculator,
      title: "Budget Tracker",
      description:
        "Track your income and expenses with an interactive budget planner",
      slug: "budget-tracker",
      isPopular: true,
    },

    {
      icon: Keyboard,
      title: "Typing Speed Test",
      description: "Test and improve your typing speed and accuracy",
      slug: "typing-speed-test",
    },

    {
      icon: Coins,
      title: "Market Rush",
      description: "Trading simulator game: buy low, sell high over 30 days",
      slug: "market-rush",
      isPopular: true,
    },
  ],
};
