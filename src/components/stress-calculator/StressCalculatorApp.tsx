
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Info, Calculator } from "lucide-react";
import { AxialStressForm } from './AxialStressForm';
import { BendingStressForm } from './BendingStressForm';
import { ShearStressForm } from './ShearStressForm';
import { ResultsDisplay } from './ResultsDisplay';

export const StressCalculatorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("axial");
  const [results, setResults] = useState<any>(null);

  return (
    <div className="animate-fade-in">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Engineering Stress Calculator
            </CardTitle>
            <CardDescription>
              Calculate different types of stresses for structural and mechanical engineering applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="axial" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="axial">Axial Stress</TabsTrigger>
                <TabsTrigger value="bending">Bending Stress</TabsTrigger>
                <TabsTrigger value="shear">Shear Stress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="axial" className="space-y-4">
                <AxialStressForm setResults={setResults} />
              </TabsContent>
              
              <TabsContent value="bending" className="space-y-4">
                <BendingStressForm setResults={setResults} />
              </TabsContent>
              
              <TabsContent value="shear" className="space-y-4">
                <ShearStressForm setResults={setResults} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {results && <ResultsDisplay results={results} stressType={activeTab} />}
      </div>
    </div>
  );
};
