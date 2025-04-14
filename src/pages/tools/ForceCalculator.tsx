import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Sigma, ArrowRight, Download, RefreshCw, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Force {
  id: string;
  magnitude: number;
  angle: number;
  name: string;
}

interface ForceResults {
  resultantMagnitude: number;
  resultantAngle: number;
  equilibriumForce: {
    magnitude: number;
    angle: number;
  };
  components: {
    x: number[];
    y: number[];
  };
  sumX: number;
  sumY: number;
}

const ForceCalculator = () => {
  const [calculationType, setCalculationType] = useState<"resultant" | "equilibrium" | "moment">("resultant");
  const [forces, setForces] = useState<Force[]>([
    { id: crypto.randomUUID(), magnitude: 100, angle: 0, name: "Force 1" },
    { id: crypto.randomUUID(), magnitude: 100, angle: 90, name: "Force 2" },
  ]);
  const [results, setResults] = useState<ForceResults | null>(null);

  const updateForce = (id: string, field: keyof Force, value: number | string) => {
    setForces(forces.map(force => 
      force.id === id ? { ...force, [field]: value } : force
    ));
  };

  const addForce = () => {
    if (forces.length >= 8) {
      toast.error("Maximum 8 forces allowed");
      return;
    }
    
    setForces([
      ...forces,
      { 
        id: crypto.randomUUID(), 
        magnitude: 100, 
        angle: 0, 
        name: `Force ${forces.length + 1}` 
      }
    ]);
  };

  const removeForce = (id: string) => {
    if (forces.length <= 2) {
      toast.error("Minimum 2 forces required");
      return;
    }
    
    const updatedForces = forces.filter(force => force.id !== id);
    
    // Rename forces to keep sequential numbering
    const renamedForces = updatedForces.map((force, index) => ({
      ...force,
      name: `Force ${index + 1}`
    }));
    
    setForces(renamedForces);
  };

  const calculateForces = () => {
    // Calculate components
    const componentsX: number[] = [];
    const componentsY: number[] = [];
    
    forces.forEach(force => {
      // Convert angle to radians for calculation
      const angleRad = (force.angle * Math.PI) / 180;
      
      // Calculate X and Y components
      const x = force.magnitude * Math.cos(angleRad);
      const y = force.magnitude * Math.sin(angleRad);
      
      componentsX.push(x);
      componentsY.push(y);
    });
    
    // Calculate sum of components
    const sumX = componentsX.reduce((sum, component) => sum + component, 0);
    const sumY = componentsY.reduce((sum, component) => sum + component, 0);
    
    // Calculate resultant force
    const resultantMagnitude = Math.sqrt(sumX * sumX + sumY * sumY);
    
    // Calculate resultant angle (in degrees)
    const resultantAngle = (Math.atan2(sumY, sumX) * 180) / Math.PI;
    
    // Calculate equilibrium force (equal and opposite to resultant)
    const equilibriumForce = {
      magnitude: resultantMagnitude,
      angle: (resultantAngle + 180) % 360, // Opposite direction
    };
    
    setResults({
      resultantMagnitude,
      resultantAngle,
      equilibriumForce,
      components: {
        x: componentsX,
        y: componentsY,
      },
      sumX,
      sumY,
    });
    
    toast.success("Force calculation completed");
  };

  return (
    <ToolLayout
      title="Force Calculator"
      description="Calculate forces, moments, and equilibrium conditions for engineering applications"
      icon={<Sigma className="h-6 w-6 text-primary" />}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Force Inputs</CardTitle>
            <CardDescription>Define forces with magnitude and direction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calculationType">Calculation Type</Label>
              <Select value={calculationType} onValueChange={(value: any) => setCalculationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resultant">Resultant Force</SelectItem>
                  <SelectItem value="equilibrium">Equilibrium</SelectItem>
                  <SelectItem value="moment">Moment (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Forces</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addForce}
                  className="h-8 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Force
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[350px] overflow-y-auto p-1">
                {forces.map((force) => (
                  <div key={force.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end border-b pb-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Magnitude (N)</Label>
                      <Input 
                        type="number"
                        value={force.magnitude}
                        onChange={(e) => updateForce(force.id, "magnitude", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="10"
                        className="h-9"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Angle (degrees)</Label>
                      <Input 
                        type="number"
                        value={force.angle}
                        onChange={(e) => updateForce(force.id, "angle", parseFloat(e.target.value) || 0)}
                        min="0"
                        max="360"
                        step="5"
                        className="h-9"
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => removeForce(force.id)}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Note: Angle is measured counterclockwise from the positive x-axis.
                0° points right (east), 90° points up (north), etc.
              </p>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCalculationType("resultant");
                  setForces([
                    { id: crypto.randomUUID(), magnitude: 100, angle: 0, name: "Force 1" },
                    { id: crypto.randomUUID(), magnitude: 100, angle: 90, name: "Force 2" },
                  ]);
                  setResults(null);
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                onClick={calculateForces}
                className="flex items-center gap-2"
              >
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Force analysis and vector components</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <Tabs defaultValue="resultant">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="resultant">Resultant</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resultant" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md text-center">
                          <div className="text-2xl font-bold">{results.resultantMagnitude.toFixed(2)} N</div>
                          <div className="text-xs text-muted-foreground">Resultant Magnitude</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md text-center">
                          <div className="text-2xl font-bold">{results.resultantAngle.toFixed(1)}°</div>
                          <div className="text-xs text-muted-foreground">Resultant Direction</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-2">Equilibrium Force</h3>
                        <p className="text-sm">To maintain equilibrium, apply a force of:</p>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <div className="text-lg font-bold">{results.equilibriumForce.magnitude.toFixed(2)} N</div>
                            <div className="text-xs text-muted-foreground">Magnitude</div>
                          </div>
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-bold">{results.equilibriumForce.angle.toFixed(1)}°</div>
                            <div className="text-xs text-muted-foreground">Direction</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-[150px] border border-dashed rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground text-center px-4">
                          Force vector diagram visualization would appear here in a full engineering application.
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          const content = `Force Calculation Results
Date: ${new Date().toLocaleString()}
---
Calculation Type: ${calculationType.charAt(0).toUpperCase() + calculationType.slice(1)}
Input Forces:
${forces.map((force, index) => `  ${index + 1}. ${force.magnitude.toFixed(2)} N at ${force.angle.toFixed(1)}°`).join('\n')}

---
RESULTS:

Resultant Force:
- Magnitude: ${results.resultantMagnitude.toFixed(2)} N
- Direction: ${results.resultantAngle.toFixed(1)}°

Equilibrium Force:
- Magnitude: ${results.equilibriumForce.magnitude.toFixed(2)} N
- Direction: ${results.equilibriumForce.angle.toFixed(1)}°

Sum of Components:
- X-Direction: ${results.sumX.toFixed(2)} N
- Y-Direction: ${results.sumY.toFixed(2)} N
`;
                          
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'force-calculation.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          
                          toast.success("Results downloaded successfully");
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download Results
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="components" className="pt-4">
                    <div className="border rounded-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Force</th>
                            <th className="text-right p-2">X-Component (N)</th>
                            <th className="text-right p-2">Y-Component (N)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forces.map((force, index) => (
                            <tr key={force.id} className="border-b">
                              <td className="p-2">{force.name}</td>
                              <td className="text-right p-2">{results.components.x[index].toFixed(2)}</td>
                              <td className="text-right p-2">{results.components.y[index].toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="font-medium bg-muted/20">
                            <td className="p-2">Sum</td>
                            <td className="text-right p-2">{results.sumX.toFixed(2)}</td>
                            <td className="text-right p-2">{results.sumY.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 p-4 border rounded-md space-y-2">
                      <h3 className="text-sm font-medium">Component Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        {Math.abs(results.sumX) < 0.01 && Math.abs(results.sumY) < 0.01 ? (
                          "The system is in equilibrium. The sum of forces in both X and Y directions is approximately zero."
                        ) : (
                          "The system is not in equilibrium. Apply the equilibrium force to balance the system."
                        )}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Resultant X</div>
                          <div className={`font-medium ${Math.abs(results.sumX) < 0.01 ? "text-green-500" : ""}`}>
                            {results.sumX.toFixed(2)} N
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Resultant Y</div>
                          <div className={`font-medium ${Math.abs(results.sumY) < 0.01 ? "text-green-500" : ""}`}>
                            {results.sumY.toFixed(2)} N
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    Enter force parameters and click Calculate to see results here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 p-4 bg-muted/30 rounded-md">
        <h2 className="text-lg font-medium mb-2">About This Tool</h2>
        <p className="text-sm text-muted-foreground">
          The Force Calculator helps engineers analyze systems of forces by calculating resultant forces,
          equilibrium conditions, and breaking down vectors into components. This tool is useful for statics
          problems, mechanical systems analysis, and structural engineering applications.
        </p>
      </div>
    </ToolLayout>
  );
};

export default ForceCalculator;
