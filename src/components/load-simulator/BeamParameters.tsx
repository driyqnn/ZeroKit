
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RefreshCw, Check } from "lucide-react";
import { BeamType, LoadType } from "@/types/beam";
import { Separator } from "@/components/ui/separator";

interface BeamParametersProps {
  beamType: BeamType;
  setBeamType: (value: BeamType) => void;
  loadType: LoadType;
  setLoadType: (value: LoadType) => void;
  length: number;
  setLength: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  materialE: number;
  setMaterialE: (value: number) => void;
  loadValue: number;
  setLoadValue: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  onReset: () => void;
  onRunSimulation: () => void;
}

const BeamParameters: React.FC<BeamParametersProps> = ({
  beamType, setBeamType,
  loadType, setLoadType,
  length, setLength,
  width, setWidth,
  height, setHeight,
  materialE, setMaterialE,
  loadValue, setLoadValue,
  temperature, setTemperature,
  onReset,
  onRunSimulation
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beam Parameters</CardTitle>
        <CardDescription>Enter beam specifications and loading conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="beamType">Beam Type</Label>
            <Select value={beamType} onValueChange={(value) => setBeamType(value as BeamType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select beam type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simply-supported">Simply Supported</SelectItem>
                <SelectItem value="cantilever">Cantilever</SelectItem>
                <SelectItem value="fixed-ends">Fixed Ends</SelectItem>
                <SelectItem value="continuous">Continuous (Multi-Span)</SelectItem>
                <SelectItem value="overhanging">Overhanging</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loadType">Load Type</Label>
            <Select value={loadType} onValueChange={(value) => setLoadType(value as LoadType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select load type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="point">Point Load</SelectItem>
                <SelectItem value="uniform">Uniform Load</SelectItem>
                <SelectItem value="triangular">Triangular Load</SelectItem>
                <SelectItem value="moment">Moment Load</SelectItem>
                <SelectItem value="partial-uniform">Partial Uniform Load</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="length">Beam Length (m)</Label>
          <Input 
            id="length"
            type="number"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            min="0.1"
            step="0.1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (m)</Label>
            <Input 
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              min="0.01"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (m)</Label>
            <Input 
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              min="0.01"
              step="0.01"
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loadValue">Load Value ({loadType === 'uniform' || loadType === 'triangular' || loadType === 'partial-uniform' ? 'kN/m' : loadType === 'moment' ? 'kN·m' : 'kN'})</Label>
            <Input 
              id="loadValue"
              type="number"
              value={loadValue}
              onChange={(e) => setLoadValue(parseFloat(e.target.value) || 0)}
              min="0.1"
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input 
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
              min="-50"
              max="1000"
              step="1"
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onRunSimulation} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamParameters;
