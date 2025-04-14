
import { Component, CircuitAnalysisResult } from "@/types/circuit";

export const analyzeCircuit = (
  circuitType: "series" | "parallel" | "mixed",
  voltage: number,
  components: Component[]
): CircuitAnalysisResult | null => {
  // Simplified circuit analysis - in a real app this would be much more comprehensive
  
  // For this demo, just handle basic series and parallel resistor circuits
  if (circuitType === "series") {
    // Series circuit calculations
    const resistors = components.filter(c => c.type === "resistor");
    const totalResistance = resistors.reduce((sum, r) => sum + r.value, 0);
    const current = voltage / totalResistance;
    
    // Calculate voltage across each resistor
    const voltageDrops = resistors.map(r => ({
      id: r.id,
      voltage: current * r.value,
      current: current
    }));
    
    // Calculate power for each resistor
    const powerConsumption = resistors.map(r => ({
      id: r.id,
      power: current * current * r.value
    }));
    
    return {
      totalResistance,
      current,
      totalPower: voltage * current,
      voltageDrops,
      powerConsumption
    };
    
  } else if (circuitType === "parallel") {
    // Parallel circuit calculations
    const resistors = components.filter(c => c.type === "resistor");
    const reciprocalSum = resistors.reduce((sum, r) => sum + (1 / r.value), 0);
    const totalResistance = 1 / reciprocalSum;
    const totalCurrent = voltage / totalResistance;
    
    // Calculate current through each resistor
    const branchCurrents = resistors.map(r => ({
      id: r.id,
      current: voltage / r.value,
      voltage: voltage
    }));
    
    // Calculate power for each resistor
    const powerConsumption = resistors.map(r => ({
      id: r.id,
      power: voltage * voltage / r.value
    }));
    
    return {
      totalResistance,
      totalCurrent,
      totalPower: voltage * totalCurrent,
      branchCurrents,
      powerConsumption
    };
  }
  
  return null;
};
