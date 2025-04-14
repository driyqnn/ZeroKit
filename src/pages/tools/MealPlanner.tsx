
import React from 'react';
import ComingSoonTool from "@/components/ComingSoonTool";
import { Utensils } from "lucide-react";

const MealPlanner = () => {
  return (
    <ComingSoonTool
      title="Meal Planner"
      description="Plan weekly meals and recipes with this easy-to-use tool."
      icon={<Utensils className="h-6 w-6 text-primary" />}
      estimatedRelease="Q3 2025"
    />
  );
};

export default MealPlanner;
