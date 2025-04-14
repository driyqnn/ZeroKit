import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { BarChart3 } from "lucide-react";
import ComingSoonTool from "@/components/ComingSoonTool";
import MobileNotice from "@/components/MobileNotice";

const StockMarketGame = () => {
  return (
    <ToolLayout
      title="Stock Market Game"
      description="Practice trading with virtual money in a realistic stock market simulation"
      icon={<BarChart3 className="h-6 w-6 text-primary" />}>
      <MobileNotice toolName="Stock Market Game">
        <ComingSoonTool
          title="Stock Market Game"
          description="Practice trading with virtual money in a realistic stock market simulation"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          estimatedRelease="Q3 2025"
        />
      </MobileNotice>
    </ToolLayout>
  );
};

export default StockMarketGame;
