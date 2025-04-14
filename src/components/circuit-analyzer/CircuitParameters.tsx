
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { Component } from "@/types/circuit";

interface CircuitParametersProps {
  circuitType: "series" | "parallel" | "mixed";
  setCircuitType: (value: "series" | "parallel" | "mixed") => void;
  voltage: number;
  setVoltage: (value: number) => void;
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  analyzeCircuit: () => void;
  resetCircuit: () => void;
}

const CircuitParameters: React.FC<CircuitParametersProps> = ({
  circuitType,
  setCircuitType,
  voltage,
  setVoltage,
  components,
  setComponents,
  analyzeCircuit,
  resetCircuit
}) => {
  const updateComponentValue = (id: string, value: number) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, value } : comp
    ));
  };

  const updateComponentType = (id: string, type: Component["type"]) => {
    setComponents(components.map(comp => {
      if (comp.id === id) {
        let unit = "Ω";
        if (type === "capacitor") unit = "μF";
        if (type === "inductor") unit = "mH";
        if (type === "voltage") unit = "V";
        if (type === "current") unit = "A";
        
        return { ...comp, type, unit };
      }
      return comp;
    }));
  };

  const addComponent = () => {
    if (components.length >= 6) {
      toast.error("Maximum 6 components allowed in this simplified analyzer");
      return;
    }
    
    setComponents([
      ...components, 
      { id: crypto.randomUUID(), type: "resistor", value: 1000, unit: "Ω" }
    ]);
  };

  const removeComponent = (id: string) => {
    if (components.length <= 1) {
      toast.error("Circuit must have at least one component");
      return;
    }
    
    setComponents(components.filter(comp => comp.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Circuit Parameters</CardTitle>
        <CardDescription>Define components and circuit configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="circuitType">Circuit Type</Label>
            <Select value={circuitType} onValueChange={(value: any) => setCircuitType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select circuit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="series">Series Circuit</SelectItem>
                <SelectItem value="parallel">Parallel Circuit</SelectItem>
                <SelectItem value="mixed">Mixed Circuit (Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voltage">Source Voltage (V)</Label>
            <Input 
              id="voltage"
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Components</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addComponent}
              className="h-8 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Component
            </Button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
            {components.map((component, index) => (
              <div key={component.id} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select 
                    value={component.type}
                    onValueChange={(value: any) => updateComponentType(component.id, value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resistor">Resistor</SelectItem>
                      <SelectItem value="capacitor">Capacitor (Premium)</SelectItem>
                      <SelectItem value="inductor">Inductor (Premium)</SelectItem>
                      <SelectItem value="voltage">Voltage Source (Premium)</SelectItem>
                      <SelectItem value="current">Current Source (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Value ({component.unit})</Label>
                  <Input 
                    type="number"
                    value={component.value}
                    onChange={(e) => updateComponentValue(component.id, parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                    className="h-9"
                  />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => removeComponent(component.id)}
                >
                  <span className="sr-only">Remove</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={resetCircuit}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={analyzeCircuit}
            className="flex items-center gap-2"
          >
            Analyze Circuit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircuitParameters;
