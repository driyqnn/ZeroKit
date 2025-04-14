
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Gauge } from "lucide-react";
import { toast } from "sonner";
import { runBeamSimulation } from "@/utils/beamCalculator";
import { BeamType, LoadType, SimulationResult } from "@/types/beam";
import BeamParameters from "@/components/load-simulator/BeamParameters";
import SimulationResults from "@/components/load-simulator/SimulationResults";
import ToolInfo from "@/components/load-simulator/ToolInfo";
import MaterialSelector from "@/components/load-simulator/MaterialSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeamVisualization from "@/components/load-simulator/BeamVisualization";
import { materialDatabase } from "@/utils/materialBehavior";

const LoadSimulator = () => {
  const [beamType, setBeamType] = useState<BeamType>("simply-supported");
  const [loadType, setLoadType] = useState<LoadType>("point");
  const [length, setLength] = useState<number>(5); // meters
  const [width, setWidth] = useState<number>(0.2); // meters
  const [height, setHeight] = useState<number>(0.3); // meters
  const [materialName, setMaterialName] = useState<string>("Structural Steel");
  const [materialE, setMaterialE] = useState<number>(200); // GPa for steel
  const [yieldStrength, setYieldStrength] = useState<number>(250); // MPa
  const [poissonRatio, setPoissonRatio] = useState<number>(0.3);
  const [density, setDensity] = useState<number>(7850); // kg/m³
  const [loadValue, setLoadValue] = useState<number>(10); // kN
  const [temperature, setTemperature] = useState<number>(20); // °C
  const [results, setResults] = useState<SimulationResult | null>(null);

  const handleRunSimulation = () => {
    const simulationResults = runBeamSimulation(
      beamType, 
      loadType, 
      length, 
      width, 
      height, 
      materialE, 
      loadValue,
      materialName,
      temperature
    );
    
    setResults(simulationResults);
    toast.success("Simulation completed successfully");
  };

  const resetForm = () => {
    setBeamType("simply-supported");
    setLoadType("point");
    setLength(5);
    setWidth(0.2);
    setHeight(0.3);
    setMaterialName("Structural Steel");
    setMaterialE(200);
    setYieldStrength(250);
    setPoissonRatio(0.3);
    setDensity(7850);
    setLoadValue(10);
    setTemperature(20);
    setResults(null);
    toast.info("Form reset to default values");
  };

  return (
    <ToolLayout
      title="Load Simulator"
      description="Simulate load distribution on structural elements with advanced material behaviors"
      icon={<Gauge className="h-6 w-6 text-primary" />}
    >
      <Tabs defaultValue="input">
        <TabsList className="mb-6">
          <TabsTrigger value="input">Parameters</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
          <TabsTrigger value="visualization" disabled={!results}>Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            <div className="space-y-6">
              <BeamParameters
                beamType={beamType}
                setBeamType={setBeamType}
                loadType={loadType}
                setLoadType={setLoadType}
                length={length}
                setLength={setLength}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                materialE={materialE}
                setMaterialE={setMaterialE}
                loadValue={loadValue}
                setLoadValue={setLoadValue}
                temperature={temperature}
                setTemperature={setTemperature}
                onReset={resetForm}
                onRunSimulation={handleRunSimulation}
              />
              
              <MaterialSelector
                materialName={materialName}
                materialE={materialE}
                setMaterialName={setMaterialName}
                setMaterialE={setMaterialE}
                setYieldStrength={setYieldStrength}
                setPoissonRatio={setPoissonRatio}
                setDensity={setDensity}
                advanced={true}
              />
            </div>
            
            {results && (
              <SimulationResults
                results={results}
                beamType={beamType}
                loadType={loadType}
                length={length}
                width={width}
                height={height}
                materialE={materialE}
                loadValue={loadValue}
                materialName={materialName}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <SimulationResults
            results={results}
            beamType={beamType}
            loadType={loadType}
            length={length}
            width={width}
            height={height}
            materialE={materialE}
            loadValue={loadValue}
            materialName={materialName}
          />
        </TabsContent>
        
        <TabsContent value="visualization">
          {results && (
            <BeamVisualization
              results={results}
              beamType={beamType}
              loadType={loadType}
              length={length}
              height={height}
              width={width}
            />
          )}
        </TabsContent>
      </Tabs>
      
      <ToolInfo />
    </ToolLayout>
  );
};

export default LoadSimulator;
