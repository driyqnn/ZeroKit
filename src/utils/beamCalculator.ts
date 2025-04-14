
import { BeamType, LoadType, SimulationResult } from "@/types/beam";
import { 
  calculateNonLinearStress, 
  calculateNonLinearDeflection,
  calculateSafetyFactor,
  generateRecommendation,
  materialDatabase
} from "@/utils/materialBehavior";

export const runBeamSimulation = (
  beamType: BeamType,
  loadType: LoadType,
  length: number,
  width: number,
  height: number,
  materialE: number,
  loadValue: number,
  materialName: string = "Structural Steel",
  temperature: number = 20
): SimulationResult => {
  let maxStress = 0;
  let maxDeflection = 0;
  
  // Get the appropriate material properties
  const material = materialDatabase.find(m => m.name === materialName) || materialDatabase[0];
  
  // Moment of inertia calculation (rectangular section)
  const I = (width * Math.pow(height, 3)) / 12; // m⁴
  
  // Section modulus
  const S = I / (height / 2); // m³
  
  // Cross-sectional area
  const area = width * height; // m²
  
  // Calculate linear stress and deflection based on beam theory
  let linearStress = 0;
  let linearDeflection = 0;
  let reactionStart = 0;
  let reactionEnd = 0;
  
  // Create discretized points for diagrams
  const numPoints = 50;
  const momentDiagram = new Array(numPoints).fill(0);
  const shearDiagram = new Array(numPoints).fill(0);
  const deflectionCurve = new Array(numPoints).fill(0);
  const stressDistribution = new Array(numPoints).fill(0);
  
  // Simplified calculations based on beam theory
  if (beamType === "simply-supported") {
    if (loadType === "point") {
      // Point load at center of simply supported beam
      linearStress = (loadValue * 1000 * length * height) / (4 * I * 1000000); // MPa
      linearDeflection = (loadValue * 1000 * Math.pow(length, 3)) / (48 * materialE * 1000 * I); // mm
      
      // Reactions
      reactionStart = loadValue / 2;
      reactionEnd = loadValue / 2;
      
      // Generate diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Shear diagram
        if (x < length / 2) {
          shearDiagram[i] = reactionStart;
        } else {
          shearDiagram[i] = -reactionEnd;
        }
        
        // Moment diagram
        if (x <= length / 2) {
          momentDiagram[i] = reactionStart * x;
        } else {
          momentDiagram[i] = reactionStart * length - reactionEnd * (x - length / 2);
        }
        
        // Deflection curve (simplified)
        if (x <= length / 2) {
          deflectionCurve[i] = (loadValue * 1000 * x) * (Math.pow(length, 2) - Math.pow(x, 2)) / (48 * materialE * 1000 * I);
        } else {
          deflectionCurve[i] = (loadValue * 1000 * (length - x)) * (2 * length * x - Math.pow(x, 2)) / (48 * materialE * 1000 * I);
        }
        
        // Stress distribution
        stressDistribution[i] = (momentDiagram[i] * 1000 * height) / (2 * I * 1000000);
      }
    } else if (loadType === "uniform") {
      // Uniform load on simply supported beam
      linearStress = (loadValue * 1000 * Math.pow(length, 2)) / (8 * I) * (height / 2) / 1000000; // MPa
      linearDeflection = (5 * loadValue * 1000 * Math.pow(length, 4)) / (384 * materialE * 1000 * I); // mm
      
      // Reactions
      reactionStart = loadValue * length / 2;
      reactionEnd = loadValue * length / 2;
      
      // Generate diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Shear diagram
        shearDiagram[i] = reactionStart - loadValue * x;
        
        // Moment diagram
        momentDiagram[i] = reactionStart * x - loadValue * x * x / 2;
        
        // Deflection curve
        deflectionCurve[i] = (loadValue * 1000 * x) * (Math.pow(length, 3) - 2 * length * Math.pow(x, 2) + Math.pow(x, 3)) / (24 * materialE * 1000 * I);
        
        // Stress distribution
        stressDistribution[i] = (momentDiagram[i] * 1000 * height) / (2 * I * 1000000);
      }
    } else if (loadType === "triangular") {
      // Triangular load on simply supported beam
      linearStress = (loadValue * 1000 * Math.pow(length, 2)) / (6 * I) * (height / 2) / 1000000; // MPa
      linearDeflection = (1 * loadValue * 1000 * Math.pow(length, 4)) / (120 * materialE * 1000 * I); // mm
      
      // Reactions
      reactionStart = loadValue * length / 6;
      reactionEnd = loadValue * length / 3;
      
      // Generate diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Simplified diagrams for triangular load
        // Shear and moment diagrams would be more complex for triangular load
        
        // Stress distribution
        stressDistribution[i] = linearStress * (1 - Math.pow(2 * x / length - 1, 2));
      }
    }
  } else if (beamType === "cantilever") {
    if (loadType === "point") {
      // Point load at end of cantilever beam
      linearStress = (loadValue * 1000 * length) / (I * width) * (height / 2) / 1000000; // MPa
      linearDeflection = (loadValue * 1000 * Math.pow(length, 3)) / (3 * materialE * 1000 * I); // mm
      
      // Reactions
      reactionStart = loadValue;
      
      // Generate diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Shear diagram
        shearDiagram[i] = loadValue;
        
        // Moment diagram
        momentDiagram[i] = loadValue * (length - x);
        
        // Deflection curve
        deflectionCurve[i] = (loadValue * 1000 / (6 * materialE * 1000 * I)) * (3 * length * Math.pow(x, 2) - Math.pow(x, 3));
        
        // Stress distribution
        stressDistribution[i] = (momentDiagram[i] * 1000 * height) / (2 * I * 1000000);
      }
    } else if (loadType === "uniform") {
      // Uniform load on cantilever beam
      linearStress = (loadValue * 1000 * Math.pow(length, 2)) / (2 * I) * (height / 2) / 1000000; // MPa
      linearDeflection = (loadValue * 1000 * Math.pow(length, 4)) / (8 * materialE * 1000 * I); // mm
      
      // Reactions
      reactionStart = loadValue * length;
      
      // Generate diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Shear diagram
        shearDiagram[i] = loadValue * (length - x);
        
        // Moment diagram
        momentDiagram[i] = loadValue * Math.pow(length - x, 2) / 2;
        
        // Deflection curve
        deflectionCurve[i] = (loadValue * 1000 / (24 * materialE * 1000 * I)) * (Math.pow(x, 4) - 4 * Math.pow(length, 3) * x + 3 * Math.pow(length, 4));
        
        // Stress distribution
        stressDistribution[i] = (momentDiagram[i] * 1000 * height) / (2 * I * 1000000);
      }
    }
  } else if (beamType === "fixed-ends") {
    if (loadType === "point") {
      // Point load at center of fixed-ends beam
      linearStress = (loadValue * 1000 * length) / (8 * I) * (height / 2) / 1000000; // MPa
      linearDeflection = (loadValue * 1000 * Math.pow(length, 3)) / (192 * materialE * 1000 * I); // mm
      
      // Reactions are more complex for fixed-end beams
      
      // Generate simplified diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Stress distribution (simplified)
        stressDistribution[i] = linearStress * (1 - Math.abs(2 * x / length - 1));
      }
    } else if (loadType === "uniform") {
      // Uniform load on fixed-ends beam
      linearStress = (loadValue * 1000 * Math.pow(length, 2)) / (12 * I) * (height / 2) / 1000000; // MPa
      linearDeflection = (loadValue * 1000 * Math.pow(length, 4)) / (384 * materialE * 1000 * I); // mm
      
      // Generate simplified diagrams
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * length;
        
        // Stress distribution (simplified)
        stressDistribution[i] = linearStress * (1 - Math.pow(2 * x / length - 1, 2));
      }
    }
  }
  
  // Calculate non-linear effects
  // Nominal strain at extreme fiber
  const strain = linearStress / (materialE * 1000);
  
  // Apply non-linear material behavior
  maxStress = calculateNonLinearStress(linearStress, strain, material, temperature);
  
  // Apply non-linear geometric effects
  maxDeflection = calculateNonLinearDeflection(linearDeflection, length * 1000, material, linearStress);
  
  // Calculate deflection ratio for serviceability check
  const deflectionRatio = maxDeflection / (length * 1000);
  
  // Enhanced safety factor calculation
  const safetyFactor = calculateSafetyFactor(
    maxStress,
    material,
    temperature
  );
  
  // Generate comprehensive recommendation
  const recommendation = generateRecommendation(
    safetyFactor,
    deflectionRatio,
    material,
    maxStress
  );
  
  // Determine potential failure mode
  let failureMode = "";
  
  if (maxStress > 0.9 * material.yieldStrength) {
    failureMode = "Material yielding";
  } else if (deflectionRatio > 1/250) {
    failureMode = "Excessive deflection";
  } else {
    failureMode = "No imminent failure mode";
  }
  
  // Non-linear effects multipliers
  const stressMultiplier = maxStress / linearStress;
  const deflectionMultiplier = maxDeflection / linearDeflection;
  
  return {
    maxStress,
    maxDeflection,
    safetyFactor,
    recommendation,
    stressDistribution,
    deflectionCurve,
    reactionForces: {
      start: reactionStart,
      end: reactionEnd
    },
    momentDiagram,
    shearDiagram,
    failureMode,
    nonLinearEffects: {
      stressMultiplier,
      deflectionMultiplier
    }
  };
};
