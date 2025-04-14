import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Recycle, RefreshCw, Download, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ThermodynamicResults {
  work: number;
  heatTransfer: number;
  efficiency: number;
  entropy: number;
  internalEnergy: number;
  enthalpy: number;
}

const ThermodynamicsAssistant = () => {
  const [processType, setProcessType] = useState<"isothermal" | "adiabatic" | "isobaric" | "isochoric">("isothermal");
  const [substance, setSubstance] = useState<"air" | "steam" | "r134a" | "custom">("air");
  const [initialState, setInitialState] = useState({
    pressure: 101.3, // kPa
    temperature: 25, // °C
    volume: 1.0, // m3
  });
  const [finalState, setFinalState] = useState({
    pressure: 200.0, // kPa
    temperature: 25, // °C
    volume: 0.5, // m3
  });
  const [useSI, setUseSI] = useState<boolean>(true);
  const [specificHeat, setSpecificHeat] = useState<number>(1.005); // kJ/kg·K for air
  const [specificHeatRatio, setSpecificHeatRatio] = useState<number>(1.4); // For air
  const [mass, setMass] = useState<number>(1.0); // kg
  const [results, setResults] = useState<ThermodynamicResults | null>(null);

  // Update substance properties when substance changes
  const handleSubstanceChange = (newSubstance: "air" | "steam" | "r134a" | "custom") => {
    setSubstance(newSubstance);
    
    switch (newSubstance) {
      case "air":
        setSpecificHeat(1.005);
        setSpecificHeatRatio(1.4);
        break;
      case "steam":
        setSpecificHeat(1.8723);
        setSpecificHeatRatio(1.33);
        break;
      case "r134a":
        setSpecificHeat(0.8518);
        setSpecificHeatRatio(1.127);
        break;
      case "custom":
        // Keep current values
        break;
    }
  };

  const calculateResults = () => {
    // Convert to Kelvin for calculations
    const T1 = initialState.temperature + 273.15; // K
    const T2 = finalState.temperature + 273.15; // K
    const P1 = initialState.pressure; // kPa
    const P2 = finalState.pressure; // kPa
    const V1 = initialState.volume; // m³
    const V2 = finalState.volume; // m³
    
    // Gas constant for air in kJ/kg·K
    const R = 0.287; // kJ/kg·K
    
    // Specific heat at constant volume
    const cv = specificHeat - R; // kJ/kg·K
    
    let work = 0; // kJ
    let heatTransfer = 0; // kJ
    let efficiency = 0; // %
    let entropy = 0; // kJ/K
    let internalEnergy = 0; // kJ
    let enthalpy = 0; // kJ
    
    switch (processType) {
      case "isothermal":
        // Isothermal process (T1 = T2)
        work = mass * R * T1 * Math.log(V2 / V1); // kJ
        heatTransfer = work; // For isothermal process, Q = W
        efficiency = 0; // Not applicable for a process
        entropy = mass * R * Math.log(V2 / V1);
        internalEnergy = 0; // No change in internal energy for isothermal process
        enthalpy = internalEnergy + R * T1 * (P2 - P1);
        break;
        
      case "adiabatic":
        // Adiabatic process (Q = 0)
        work = (mass * R * (T1 - T2)) / (specificHeatRatio - 1);
        heatTransfer = 0; // Adiabatic means no heat transfer
        efficiency = Math.abs(work / (mass * cv * T1)); // Work output / Initial internal energy
        entropy = 0; // Entropy change is zero in an ideal adiabatic process
        internalEnergy = mass * cv * (T1 - T2);
        enthalpy = mass * specificHeat * (T1 - T2);
        break;
        
      case "isobaric":
        // Isobaric process (P1 = P2)
        work = P1 * (V2 - V1);
        internalEnergy = mass * cv * (T1 - T2);
        heatTransfer = internalEnergy + work;
        efficiency = Math.abs(work / heatTransfer);
        entropy = mass * specificHeat * Math.log(T2 / T1);
        enthalpy = mass * specificHeat * (T1 - T2);
        break;
        
      case "isochoric":
        // Isochoric process (V1 = V2)
        work = 0; // No volume change means no work done
        internalEnergy = mass * cv * (T1 - T2);
        heatTransfer = internalEnergy;
        efficiency = 0; // No work done
        entropy = mass * cv * Math.log(T2 / T1);
        enthalpy = mass * specificHeat * (T1 - T2);
        break;
    }
    
    setResults({
      work,
      heatTransfer,
      efficiency,
      entropy,
      internalEnergy,
      enthalpy
    });
    
    toast.success("Thermodynamic calculations completed");
  };

  return (
    <ToolLayout
      title="Thermodynamics Assistant"
      description="Calculate heat transfer, energy conversion, and thermal efficiency"
      icon={<Recycle className="h-6 w-6 text-primary" />}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Parameters</CardTitle>
            <CardDescription>Define thermodynamic states and process type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Label htmlFor="processType">Process Type</Label>
                <Select 
                  value={processType} 
                  onValueChange={(value: any) => setProcessType(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select process type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="isothermal">Isothermal (const. T)</SelectItem>
                    <SelectItem value="adiabatic">Adiabatic (no heat transfer)</SelectItem>
                    <SelectItem value="isobaric">Isobaric (const. P)</SelectItem>
                    <SelectItem value="isochoric">Isochoric (const. V)</SelectItem>
                  </SelectContent>
              </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="unit-toggle" checked={useSI} onCheckedChange={setUseSI} />
                <Label htmlFor="unit-toggle" className="text-sm">Use SI Units</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="substance">Substance</Label>
              <Select 
                value={substance} 
                onValueChange={(value: any) => handleSubstanceChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select substance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="steam">Steam</SelectItem>
                  <SelectItem value="r134a">R-134a Refrigerant</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {substance === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specificHeat">Specific Heat (kJ/kg·K)</Label>
                  <Input 
                    id="specificHeat"
                    type="number"
                    value={specificHeat}
                    onChange={(e) => setSpecificHeat(parseFloat(e.target.value) || 0)}
                    min="0.1"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specificHeatRatio">Specific Heat Ratio (γ)</Label>
                  <Input 
                    id="specificHeatRatio"
                    type="number"
                    value={specificHeatRatio}
                    onChange={(e) => setSpecificHeatRatio(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="mass">Mass (kg)</Label>
              <Input 
                id="mass"
                type="number"
                value={mass}
                onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
                min="0.01"
                step="0.01"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 border p-3 rounded-md">
              <div className="text-center font-medium">Parameter</div>
              <div className="text-center font-medium">Initial State</div>
              <div className="text-center font-medium">Final State</div>
              
              <div className="text-sm">Pressure ({useSI ? 'kPa' : 'psi'})</div>
              <Input 
                type="number"
                value={initialState.pressure}
                onChange={(e) => setInitialState({...initialState, pressure: parseFloat(e.target.value) || 0})}
                min="0.01"
                step="0.1"
              />
              <Input 
                type="number"
                value={finalState.pressure}
                onChange={(e) => setFinalState({...finalState, pressure: parseFloat(e.target.value) || 0})}
                min="0.01"
                step="0.1"
              />
              
              <div className="text-sm">Temperature ({useSI ? '°C' : '°F'})</div>
              <Input 
                type="number"
                value={initialState.temperature}
                onChange={(e) => setInitialState({...initialState, temperature: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
              <Input 
                type="number"
                value={finalState.temperature}
                onChange={(e) => setFinalState({...finalState, temperature: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
              
              <div className="text-sm">Volume ({useSI ? 'm³' : 'ft³'})</div>
              <Input 
                type="number"
                value={initialState.volume}
                onChange={(e) => setInitialState({...initialState, volume: parseFloat(e.target.value) || 0})}
                min="0.001"
                step="0.001"
              />
              <Input 
                type="number"
                value={finalState.volume}
                onChange={(e) => setFinalState({...finalState, volume: parseFloat(e.target.value) || 0})}
                min="0.001"
                step="0.001"
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setProcessType("isothermal");
                  setSubstance("air");
                  setSpecificHeat(1.005);
                  setSpecificHeatRatio(1.4);
                  setMass(1.0);
                  setInitialState({
                    pressure: 101.3,
                    temperature: 25,
                    volume: 1.0,
                  });
                  setFinalState({
                    pressure: 200.0,
                    temperature: 25,
                    volume: 0.5,
                  });
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
            <CardTitle>Thermodynamic Results</CardTitle>
            <CardDescription>Energy analysis and process properties</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <Tabs defaultValue="energy">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="energy">Energy Analysis</TabsTrigger>
                    <TabsTrigger value="entropy">Process Properties</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="energy" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-5 w-5 text-red-400" />
                            <span className="text-sm font-medium">Heat Transfer</span>
                          </div>
                          <div className="text-xl font-bold mt-1">{results.heatTransfer.toFixed(2)} kJ</div>
                          <div className="text-xs text-muted-foreground">
                            {results.heatTransfer > 0 ? "Heat added to system" : "Heat removed from system"}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <Recycle className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium">Work Done</span>
                          </div>
                          <div className="text-xl font-bold mt-1">{results.work.toFixed(2)} kJ</div>
                          <div className="text-xs text-muted-foreground">
                            {results.work > 0 ? "Work done by system" : "Work done on system"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm font-medium">Internal Energy Change</div>
                          <div className="text-xl font-bold mt-1">{results.internalEnergy.toFixed(2)} kJ</div>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm font-medium">Enthalpy Change</div>
                          <div className="text-xl font-bold mt-1">{results.enthalpy.toFixed(2)} kJ</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-2">Efficiency Analysis</h3>
                        <div className={`flex items-center justify-between ${
                          results.efficiency > 0.5 ? "text-emerald-500" : "text-orange-500"
                        }`}>
                          <span>Process Efficiency:</span>
                          <span className="font-bold">{(results.efficiency * 100).toFixed(2)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {processType === "isothermal" || processType === "isochoric" 
                            ? "Efficiency calculation not applicable for this process type."
                            : results.efficiency > 0.5 
                              ? "Good efficiency for this process type."
                              : "Low efficiency. Consider process optimization."}
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          const content = `Thermodynamic Analysis Results
Date: ${new Date().toLocaleString()}
---
Process Type: ${processType.charAt(0).toUpperCase() + processType.slice(1)}
Substance: ${substance.charAt(0).toUpperCase() + substance.slice(1)}
Mass: ${mass} kg
Specific Heat: ${specificHeat} kJ/kg·K
Specific Heat Ratio: ${specificHeatRatio}

Initial State:
- Pressure: ${initialState.pressure} kPa
- Temperature: ${initialState.temperature} °C
- Volume: ${initialState.volume} m³

Final State:
- Pressure: ${finalState.pressure} kPa
- Temperature: ${finalState.temperature} °C
- Volume: ${finalState.volume} m³
---
RESULTS:
Work Done: ${results.work.toFixed(2)} kJ ${results.work > 0 ? "(done by system)" : "(done on system)"}
Heat Transfer: ${results.heatTransfer.toFixed(2)} kJ ${results.heatTransfer > 0 ? "(added to system)" : "(removed from system)"}
Internal Energy Change: ${results.internalEnergy.toFixed(2)} kJ
Enthalpy Change: ${results.enthalpy.toFixed(2)} kJ
Entropy Change: ${results.entropy.toFixed(4)} kJ/K
Process Efficiency: ${(results.efficiency * 100).toFixed(2)}%
`;
                          
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'thermodynamic-analysis.txt';
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
                  
                  <TabsContent value="entropy" className="pt-4">
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-md">
                        <div className="text-sm font-medium mb-2">Entropy Change</div>
                        <div className="text-xl font-bold">{results.entropy.toFixed(4)} kJ/K</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {results.entropy > 0 
                            ? "Entropy increases: Process is irreversible" 
                            : results.entropy < 0
                              ? "Entropy decreases: Process requires external work"
                              : "Entropy unchanged: Process is reversible"
                          }
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-3">
                        <h3 className="text-sm font-medium">Process Properties</h3>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>PV Work:</div>
                          <div className="text-right">{
                            processType === "isochoric" 
                              ? "0 kJ (constant volume)" 
                              : `${(initialState.pressure * (finalState.volume - initialState.volume)).toFixed(2)} kJ`
                          }</div>
                          
                          <div>Temperature Ratio:</div>
                          <div className="text-right">
                            {((finalState.temperature + 273.15) / (initialState.temperature + 273.15)).toFixed(3)}
                          </div>
                          
                          <div>Pressure Ratio:</div>
                          <div className="text-right">
                            {(finalState.pressure / initialState.pressure).toFixed(3)}
                          </div>
                          
                          <div>Volume Ratio:</div>
                          <div className="text-right">
                            {(finalState.volume / initialState.volume).toFixed(3)}
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-xs font-medium mb-1">Process Description:</h4>
                          <p className="text-xs text-muted-foreground">
                            {processType === "isothermal" && "Isothermal process: Temperature remains constant. Heat transfer exactly balances the work done."}
                            {processType === "adiabatic" && "Adiabatic process: No heat transfer with surroundings. Temperature changes due to work interaction."}
                            {processType === "isobaric" && "Isobaric process: Pressure remains constant. Work is proportional to volume change."}
                            {processType === "isochoric" && "Isochoric process: Volume remains constant. No work is done, all heat transfer changes internal energy."}
                          </p>
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
          The Thermodynamics Assistant helps engineers analyze basic thermodynamic processes including isothermal,
          adiabatic, isobaric, and isochoric transformations. It calculates work, heat transfer, internal energy changes,
          and entropy for ideal gas processes.
        </p>
      </div>
    </ToolLayout>
  );
};

export default ThermodynamicsAssistant;
