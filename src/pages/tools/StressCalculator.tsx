
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { Ruler } from "lucide-react";
import { StressCalculatorApp } from "@/components/stress-calculator/StressCalculatorApp";

const StressCalculator = () => {
  return (
    <ToolLayout
      title="Stress Calculator"
      description="Calculate stress and strain in structural elements with common engineering formulas"
      icon={<Ruler className="h-6 w-6 text-primary" />}
      category="Engineering Tools"
    >
      <StressCalculatorApp />
    </ToolLayout>
  );
};

export default StressCalculator;
