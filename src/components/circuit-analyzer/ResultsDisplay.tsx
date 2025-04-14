
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Component } from "@/types/circuit";

interface ResultsDisplayProps {
  results: any;
  circuitType: "series" | "parallel" | "mixed";
  voltage: number;
  components: Component[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  circuitType,
  voltage,
  components
}) => {
  const downloadResults = () => {
    if (!results) return;
    
    const content = `Circuit Analysis Results
Date: ${new Date().toLocaleString()}
---
Circuit Type: ${circuitType}
Source Voltage: ${voltage} V
Components: ${components.map((c, i) => `R${i+1} = ${c.value} ${c.unit}`).join(', ')}
---
RESULTS:
Total Resistance: ${results.totalResistance.toFixed(2)} Ω
Total Current: ${(circuitType === "series" ? results.current : results.totalCurrent).toFixed(4)} A
Total Power: ${results.totalPower.toFixed(2)} W

Component Analysis:
${components.filter(c => c.type === "resistor").map((comp, i) => {
  const voltageValue = circuitType === "series" 
    ? results.voltageDrops.find((v: any) => v.id === comp.id)?.voltage
    : voltage;
    
  const current = circuitType === "series"
    ? results.voltageDrops.find((v: any) => v.id === comp.id)?.current
    : results.branchCurrents.find((b: any) => b.id === comp.id)?.current;
    
  const power = results.powerConsumption.find((p: any) => p.id === comp.id)?.power;
  
  return `R${i+1} (${comp.value} Ω): V=${voltageValue?.toFixed(2)}V, I=${current?.toFixed(4)}A, P=${power?.toFixed(2)}W`;
}).join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Results downloaded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>Circuit behavior and component values</CardDescription>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-6">
            <Tabs defaultValue="results">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="diagram">Circuit Diagram</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xl font-bold">
                        {results.totalResistance.toFixed(2)} Ω
                      </div>
                      <div className="text-xs text-muted-foreground">Total Resistance</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xl font-bold">
                        {(circuitType === "series" ? results.current : results.totalCurrent).toFixed(4)} A
                      </div>
                      <div className="text-xs text-muted-foreground">Total Current</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xl font-bold">
                        {results.totalPower.toFixed(2)} W
                      </div>
                      <div className="text-xs text-muted-foreground">Total Power</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Component Analysis:</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Component</th>
                          <th className="text-right pb-2">Voltage (V)</th>
                          <th className="text-right pb-2">Current (A)</th>
                          <th className="text-right pb-2">Power (W)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {components.filter(c => c.type === "resistor").map((comp, i) => {
                          const voltageValue = circuitType === "series" 
                            ? results.voltageDrops.find((v: any) => v.id === comp.id)?.voltage
                            : voltage;
                            
                          const current = circuitType === "series"
                            ? results.voltageDrops.find((v: any) => v.id === comp.id)?.current
                            : results.branchCurrents.find((b: any) => b.id === comp.id)?.current;
                            
                          const power = results.powerConsumption.find((p: any) => p.id === comp.id)?.power;
                          
                          return (
                            <tr key={comp.id} className="border-b last:border-b-0">
                              <td className="py-2">R{i+1} ({comp.value} Ω)</td>
                              <td className="text-right py-2">{voltageValue?.toFixed(2)}</td>
                              <td className="text-right py-2">{current?.toFixed(4)}</td>
                              <td className="text-right py-2">{power?.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={downloadResults}
                  >
                    <Download className="h-4 w-4" />
                    Download Results
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="diagram" className="pt-4 h-[400px] flex items-center justify-center">
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Interactive circuit diagram would appear here in a full electrical engineering application.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
            <div className="text-center p-6">
              <p className="text-muted-foreground">
                Configure your circuit and click Analyze to see results here.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
