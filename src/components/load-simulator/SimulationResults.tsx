
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { SimulationResult, BeamType, LoadType } from "@/types/beam";

interface SimulationResultsProps {
  results: SimulationResult | null;
  beamType: BeamType;
  loadType: LoadType;
  length: number;
  width: number;
  height: number;
  materialE: number;
  loadValue: number;
  materialName: string;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({
  results,
  beamType,
  loadType,
  length,
  width,
  height,
  materialE,
  loadValue,
  materialName
}) => {
  const downloadResults = () => {
    if (!results) return;
    
    const content = `Load Simulation Results
Date: ${new Date().toLocaleString()}
---
Beam Type: ${beamType}
Load Type: ${loadType}
Beam Length: ${length} m
Beam Width: ${width} m
Beam Height: ${height} m
Material: ${materialName}
Material Elastic Modulus: ${materialE} GPa
Applied Load: ${loadValue} ${loadType === 'uniform' || loadType === 'triangular' ? 'kN/m' : 'kN'}
---
RESULTS:
Maximum Stress: ${results.maxStress.toFixed(2)} MPa
Maximum Deflection: ${results.maxDeflection.toFixed(4)} mm
Safety Factor: ${results.safetyFactor.toFixed(2)}

Non-linear Effects:
Stress Multiplier: ${results.nonLinearEffects?.stressMultiplier.toFixed(3) || 'N/A'}
Deflection Multiplier: ${results.nonLinearEffects?.deflectionMultiplier.toFixed(3) || 'N/A'}

Potential Failure Mode: ${results.failureMode || 'N/A'}
---
Recommendation: ${results.recommendation}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'load-simulation-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Results downloaded successfully");
  };

  if (!results) {
    return null;
  }

  const getSafetyIcon = () => {
    if (results.safetyFactor < 1.5) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (results.safetyFactor < 3) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
        <CardDescription>Load analysis and structural recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Summary</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{results.maxStress.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Max Stress (MPa)</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">{results.maxDeflection.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">Max Deflection (mm)</div>
              </div>
              <div className={`p-3 rounded-md text-center ${
                results.safetyFactor < 1.5 ? "bg-red-500/20" : 
                results.safetyFactor < 3 ? "bg-yellow-500/20" : 
                "bg-green-500/20"
              }`}>
                <div className="text-2xl font-bold flex items-center justify-center gap-2">
                  {results.safetyFactor.toFixed(2)}
                  {getSafetyIcon()}
                </div>
                <div className="text-xs text-muted-foreground">Safety Factor</div>
              </div>
            </div>
            
            {results.nonLinearEffects && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-3 rounded-md text-center border">
                  <div className="text-lg font-medium">{results.nonLinearEffects.stressMultiplier.toFixed(3)}x</div>
                  <div className="text-xs text-muted-foreground">Non-linear Stress Factor</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md text-center border">
                  <div className="text-lg font-medium">{results.nonLinearEffects.deflectionMultiplier.toFixed(3)}x</div>
                  <div className="text-xs text-muted-foreground">Non-linear Deflection Factor</div>
                </div>
              </div>
            )}
            
            <div className="border rounded-md p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Recommendation:</h3>
              <p className="text-sm">{results.recommendation}</p>
            </div>
            
            {results.failureMode && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Potential Failure Mode:</h3>
                <p className="text-sm">{results.failureMode}</p>
              </div>
            )}
            
            <Button 
              onClick={downloadResults}
              variant="outline" 
              className="w-full flex items-center gap-2 mt-4"
            >
              <Download className="h-4 w-4" />
              Download Results
            </Button>
          </TabsContent>
          
          <TabsContent value="advanced" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Reactions:</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Support A:</div>
                  <div className="text-right">{results.reactionForces?.start.toFixed(2)} kN</div>
                  
                  <div className="text-muted-foreground">Support B:</div>
                  <div className="text-right">{results.reactionForces?.end.toFixed(2)} kN</div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Section Properties:</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Area:</div>
                  <div className="text-right">{(width * height * 1000000).toFixed(0)} mm²</div>
                  
                  <div className="text-muted-foreground">I<sub>xx</sub>:</div>
                  <div className="text-right">{((width * Math.pow(height, 3)) / 12 * 1000000000).toFixed(0)} mm⁴</div>
                  
                  <div className="text-muted-foreground">S<sub>xx</sub>:</div>
                  <div className="text-right">{((width * Math.pow(height, 2)) / 6 * 1000000).toFixed(0)} mm³</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Material Details:</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-muted-foreground">Material:</div>
                <div className="text-right">{materialName}</div>
                
                <div className="text-muted-foreground">Elastic Modulus:</div>
                <div className="text-right">{materialE} GPa</div>
                
                <div className="text-muted-foreground">Allowable Stress:</div>
                <div className="text-right">≈ {(materialE * 0.6).toFixed(0)} MPa</div>
                
                <div className="text-muted-foreground">Allowable Deflection:</div>
                <div className="text-right">L/250 = {(length * 1000 / 250).toFixed(1)} mm</div>
              </div>
            </div>
            
            <Button 
              onClick={downloadResults}
              variant="outline" 
              className="w-full flex items-center gap-2 mt-4"
            >
              <Download className="h-4 w-4" />
              Download Full Report
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
