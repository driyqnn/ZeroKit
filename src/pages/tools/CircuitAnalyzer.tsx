
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PlugZap } from "lucide-react";
import { toast } from "sonner";
import CircuitParameters from "@/components/circuit-analyzer/CircuitParameters";
import ResultsDisplay from "@/components/circuit-analyzer/ResultsDisplay";
import CircuitDiagram from "@/components/circuit-analyzer/CircuitDiagram";
import AboutTool from "@/components/circuit-analyzer/AboutTool";
import { analyzeCircuit } from "@/utils/circuitAnalyzer";
import { Component, CircuitAnalysisResult } from "@/types/circuit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CircuitAnalyzer = () => {
  const [circuitType, setCircuitType] = useState<"series" | "parallel" | "mixed">("series");
  const [voltage, setVoltage] = useState<number>(12);
  const [components, setComponents] = useState<Component[]>([
    { id: crypto.randomUUID(), type: "resistor", value: 1000, unit: "Ω" },
    { id: crypto.randomUUID(), type: "resistor", value: 2000, unit: "Ω" },
  ]);
  const [results, setResults] = useState<CircuitAnalysisResult | null>(null);

  const handleAnalyzeCircuit = () => {
    const analysisResults = analyzeCircuit(circuitType, voltage, components);
    
    if (analysisResults) {
      setResults(analysisResults);
      toast.success("Circuit analysis completed");
    }
  };

  const resetCircuit = () => {
    setCircuitType("series");
    setVoltage(12);
    setComponents([
      { id: crypto.randomUUID(), type: "resistor", value: 1000, unit: "Ω" },
      { id: crypto.randomUUID(), type: "resistor", value: 2000, unit: "Ω" },
    ]);
    setResults(null);
  };

  return (
    <ToolLayout
      title="Circuit Analyzer"
      description="Analyze electrical circuits with Ohm's law and other principles"
      icon={<PlugZap className="h-6 w-6 text-primary" />}
    >
      <Tabs defaultValue="parameters">
        <TabsList className="mb-6">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
          <TabsTrigger value="diagram" disabled={!results}>Circuit Diagram</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters">
          <div className="grid lg:grid-cols-2 gap-6">
            <CircuitParameters 
              circuitType={circuitType}
              setCircuitType={setCircuitType}
              voltage={voltage}
              setVoltage={setVoltage}
              components={components}
              setComponents={setComponents}
              analyzeCircuit={handleAnalyzeCircuit}
              resetCircuit={resetCircuit}
            />
            
            {results && (
              <ResultsDisplay 
                results={results}
                circuitType={circuitType}
                voltage={voltage}
                components={components}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <ResultsDisplay 
            results={results}
            circuitType={circuitType}
            voltage={voltage}
            components={components}
          />
        </TabsContent>
        
        <TabsContent value="diagram">
          <CircuitDiagram 
            circuitType={circuitType}
            components={components}
            voltage={voltage}
            results={results}
          />
        </TabsContent>
      </Tabs>
      
      <AboutTool />
    </ToolLayout>
  );
};

export default CircuitAnalyzer;
