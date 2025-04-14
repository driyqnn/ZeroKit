import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Waves, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface FluidResults {
  velocity: number;
  reynoldsNumber: number;
  pressureDrop: number;
  flowType: string;
  massFlowRate: number;
  dragCoefficient: number;
  frictionFactor: number;
}

const FluidDynamicsCalculator = () => {
  const [calculationType, setCalculationType] = useState<"pipe" | "open-channel" | "drag">("pipe");
  const [fluidType, setFluidType] = useState<"water" | "air" | "oil" | "custom">("water");
  const [fluidDensity, setFluidDensity] = useState<number>(997); // kg/m³ (water)
  const [fluidViscosity, setFluidViscosity] = useState<number>(0.001); // Pa·s (water)
  const [pipeLength, setPipeLength] = useState<number>(10); // meters
  const [pipeDiameter, setPipeDiameter] = useState<number>(0.05); // meters
  const [flowRate, setFlowRate] = useState<number>(0.001); // m³/s
  const [results, setResults] = useState<FluidResults | null>(null);

  // Update fluid properties when fluid type changes
  const handleFluidTypeChange = (type: "water" | "air" | "oil" | "custom") => {
    setFluidType(type);
    
    switch (type) {
      case "water":
        setFluidDensity(997);
        setFluidViscosity(0.001);
        break;
      case "air":
        setFluidDensity(1.225);
        setFluidViscosity(0.000018);
        break;
      case "oil":
        setFluidDensity(900);
        setFluidViscosity(0.03);
        break;
      case "custom":
        // Keep current values
        break;
    }
  };

  const calculateResults = () => {
    if (calculationType === "pipe") {
      // Cross-sectional area
      const area = Math.PI * Math.pow(pipeDiameter / 2, 2);
      
      // Flow velocity
      const velocity = flowRate / area;
      
      // Reynolds number
      const reynoldsNumber = (fluidDensity * velocity * pipeDiameter) / fluidViscosity;
      
      // Determine flow type
      let flowType = "Laminar";
      if (reynoldsNumber > 4000) {
        flowType = "Turbulent";
      } else if (reynoldsNumber > 2300) {
        flowType = "Transitional";
      }
      
      // Friction factor - Darcy-Weisbach equation with Haaland equation for the friction factor
      let frictionFactor;
      
      if (reynoldsNumber < 2300) {
        // Laminar flow
        frictionFactor = 64 / reynoldsNumber;
      } else {
        // Turbulent flow - simplified Haaland equation
        const relativeRoughness = 0.00015 / pipeDiameter; // Assuming steel pipe roughness
        frictionFactor = Math.pow(-1.8 * Math.log10(Math.pow(relativeRoughness / 3.7, 1.11) + 6.9 / reynoldsNumber), -2);
      }
      
      // Pressure drop - Darcy-Weisbach equation
      const pressureDrop = frictionFactor * (pipeLength / pipeDiameter) * (fluidDensity * Math.pow(velocity, 2)) / 2;
      
      // Mass flow rate
      const massFlowRate = fluidDensity * flowRate;
      
      // Drag coefficient (simplified)
      const dragCoefficient = 0.0; // Not applicable for pipe flow
      
      setResults({
        velocity,
        reynoldsNumber,
        pressureDrop,
        flowType,
        massFlowRate,
        frictionFactor,
        dragCoefficient
      });
      
      toast.success("Fluid dynamics calculations completed");
    }
  };

  return (
    <ToolLayout
      title="Fluid Dynamics Calculator"
      description="Calculate pressure drops, flow rates, and fluid parameters"
      icon={<Waves className="h-6 w-6 text-primary" />}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fluid Parameters</CardTitle>
            <CardDescription>Define fluid properties and flow conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calculationType">Calculation Type</Label>
              <Select 
                value={calculationType} 
                onValueChange={(value: any) => setCalculationType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pipe">Pipe Flow</SelectItem>
                  <SelectItem value="open-channel">Open Channel Flow (Premium)</SelectItem>
                  <SelectItem value="drag">Drag Force (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fluidType">Fluid Type</Label>
              <Select 
                value={fluidType} 
                onValueChange={(value: any) => handleFluidTypeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fluid type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fluidDensity">Fluid Density (kg/m³)</Label>
                <Input 
                  id="fluidDensity"
                  type="number"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  disabled={fluidType !== "custom" && calculationType === "pipe"}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fluidViscosity">Dynamic Viscosity (Pa·s)</Label>
                <Input 
                  id="fluidViscosity"
                  type="number"
                  value={fluidViscosity}
                  onChange={(e) => setFluidViscosity(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.0001"
                  disabled={fluidType !== "custom" && calculationType === "pipe"}
                />
              </div>
            </div>
            
            {calculationType === "pipe" && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipeDiameter">Pipe Diameter (m)</Label>
                    <Input 
                      id="pipeDiameter"
                      type="number"
                      value={pipeDiameter}
                      onChange={(e) => setPipeDiameter(parseFloat(e.target.value) || 0)}
                      min="0.001"
                      step="0.001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pipeLength">Pipe Length (m)</Label>
                    <Input 
                      id="pipeLength"
                      type="number"
                      value={pipeLength}
                      onChange={(e) => setPipeLength(parseFloat(e.target.value) || 0)}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="flowRate">Volumetric Flow Rate (m³/s)</Label>
                  <Input 
                    id="flowRate"
                    type="number"
                    value={flowRate}
                    onChange={(e) => setFlowRate(parseFloat(e.target.value) || 0)}
                    min="0.0001"
                    step="0.0001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Typical household faucet: ~0.0001 m³/s | Fire hydrant: ~0.075 m³/s
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCalculationType("pipe");
                  setFluidType("water");
                  setFluidDensity(997);
                  setFluidViscosity(0.001);
                  setPipeLength(10);
                  setPipeDiameter(0.05);
                  setFlowRate(0.001);
                  setResults(null);
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                onClick={calculateResults}
                className="flex items-center gap-2"
              >
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>Fluid dynamics analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <Tabs defaultValue="primary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="primary">Primary Results</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="primary" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md text-center">
                          <div className="text-xl font-bold">{results.velocity.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Velocity (m/s)</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md text-center">
                          <div className="text-xl font-bold">{results.pressureDrop.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Pressure Drop (Pa)</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md text-center">
                          <div className={`text-xl font-bold ${
                            results.reynoldsNumber > 4000 ? "text-amber-500" : "text-emerald-500"
                          }`}>
                            {results.flowType}
                          </div>
                          <div className="text-xs text-muted-foreground">Flow Type</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-3">Additional Results:</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="text-muted-foreground">Reynolds Number:</div>
                          <div className="text-right">{results.reynoldsNumber.toFixed(0)}</div>
                          
                          <div className="text-muted-foreground">Mass Flow Rate:</div>
                          <div className="text-right">{results.massFlowRate.toFixed(4)} kg/s</div>
                          
                          <div className="text-muted-foreground">Friction Factor:</div>
                          <div className="text-right">{results.frictionFactor.toFixed(4)}</div>
                          
                          <div className="text-muted-foreground">Head Loss:</div>
                          <div className="text-right">{(results.pressureDrop / (fluidDensity * 9.81)).toFixed(3)} m</div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          const content = `Fluid Dynamics Calculation Results
Date: ${new Date().toLocaleString()}
---
Calculation Type: ${calculationType.charAt(0).toUpperCase() + calculationType.slice(1)} Flow
Fluid Type: ${fluidType.charAt(0).toUpperCase() + fluidType.slice(1)}
Fluid Density: ${fluidDensity} kg/m³
Fluid Viscosity: ${fluidViscosity} Pa·s
Pipe Diameter: ${pipeDiameter} m
Pipe Length: ${pipeLength} m
Volumetric Flow Rate: ${flowRate} m³/s
---
RESULTS:
Flow Velocity: ${results.velocity.toFixed(2)} m/s
Reynolds Number: ${results.reynoldsNumber.toFixed(0)}
Flow Type: ${results.flowType}
Pressure Drop: ${results.pressureDrop.toFixed(2)} Pa
Friction Factor: ${results.frictionFactor.toFixed(4)}
Mass Flow Rate: ${results.massFlowRate.toFixed(4)} kg/s
Head Loss: ${(results.pressureDrop / (fluidDensity * 9.81)).toFixed(3)} m
`;
                          
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'fluid-dynamics-results.txt';
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
                  
                  <TabsContent value="advanced" className="pt-4 h-[400px] flex items-center justify-center">
                    <div className="text-center p-6 border border-dashed rounded-md w-full">
                      <p className="text-muted-foreground">
                        Advanced analysis with graphs and visualizations would appear here in a full fluid dynamics application.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    Enter parameters and click Calculate to see results here.
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
          The Fluid Dynamics Calculator provides engineers with tools to calculate pressure drops, flow rates, and Reynolds numbers
          for pipe flow systems. It uses equations such as the Darcy-Weisbach equation for pressure drop calculation and determines
          flow regimes based on Reynolds number.
        </p>
      </div>
    </ToolLayout>
  );
};

export default FluidDynamicsCalculator;
