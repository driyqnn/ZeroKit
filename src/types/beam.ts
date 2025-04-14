
export type BeamType = "simply-supported" | "cantilever" | "continuous" | "fixed-ends" | "overhanging";
export type LoadType = "point" | "uniform" | "moment" | "triangular" | "partial-uniform";

export interface Material {
  name: string;
  elasticModulus: number; // GPa
  yieldStrength: number;  // MPa
  poissonRatio: number;
  density: number; // kg/m³
}

export interface SimulationResult {
  maxStress: number;
  maxDeflection: number;
  safetyFactor: number;
  recommendation: string;
  // Enhanced results for improved simulation
  stressDistribution?: number[];
  deflectionCurve?: number[];
  reactionForces?: {
    start: number;
    end: number;
  };
  momentDiagram?: number[];
  shearDiagram?: number[];
  failureMode?: string;
  nonLinearEffects?: {
    stressMultiplier: number;
    deflectionMultiplier: number;
  };
}
