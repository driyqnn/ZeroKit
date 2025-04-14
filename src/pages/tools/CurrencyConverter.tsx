
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { DollarSign, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CurrencyConverter = () => {
  return (
    <ToolLayout
      title="Currency Converter"
      description="Convert currencies in real-time"
      icon={<DollarSign className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="border-amber-500/30">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Lock className="h-20 w-20 text-amber-500 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-amber-500 mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-lg">
                The Currency Converter tool is currently under development. We're working on integrating reliable exchange rate data to provide you with accurate and timely currency conversions.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Check back soon for this feature. Thank you for your patience!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CurrencyConverter;
