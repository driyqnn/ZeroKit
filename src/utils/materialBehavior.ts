
/**
 * Utility functions for material behavior modeling in structural analysis
 */

// Material types with their properties
export interface MaterialProperties {
  name: string;
  elasticModulus: number; // GPa
  yieldStrength: number;  // MPa
  ultimateStrength: number; // MPa
  poissonRatio: number;
  densityKgM3: number; // kg/m³
  thermalExpansion: number; // µm/m-°C
  nonLinearFactor: number; // Used in non-linear behavior calculations (0-1 scale)
}

// Common materials database
export const materialDatabase: MaterialProperties[] = [
  {
    name: "Structural Steel",
    elasticModulus: 200,
    yieldStrength: 250,
    ultimateStrength: 400,
    poissonRatio: 0.3,
    densityKgM3: 7850,
    thermalExpansion: 12,
    nonLinearFactor: 0.7
  },
  {
    name: "Aluminum Alloy",
    elasticModulus: 70,
    yieldStrength: 95,
    ultimateStrength: 110,
    poissonRatio: 0.35,
    densityKgM3: 2700,
    thermalExpansion: 23,
    nonLinearFactor: 0.6
  },
  {
    name: "Concrete",
    elasticModulus: 30,
    yieldStrength: 40,  // Compression strength
    ultimateStrength: 40,
    poissonRatio: 0.2,
    densityKgM3: 2400,
    thermalExpansion: 10,
    nonLinearFactor: 0.4
  },
  {
    name: "Wood (Pine)",
    elasticModulus: 11,
    yieldStrength: 40,
    ultimateStrength: 60,
    poissonRatio: 0.3,
    densityKgM3: 550,
    thermalExpansion: 4,
    nonLinearFactor: 0.3
  },
  {
    name: "Titanium Alloy",
    elasticModulus: 110,
    yieldStrength: 830,
    ultimateStrength: 900,
    poissonRatio: 0.34,
    densityKgM3: 4500,
    thermalExpansion: 8.6,
    nonLinearFactor: 0.8
  },
  {
    name: "Reinforced Concrete",
    elasticModulus: 25,
    yieldStrength: 60,
    ultimateStrength: 70,
    poissonRatio: 0.2,
    densityKgM3: 2500,
    thermalExpansion: 9.9,
    nonLinearFactor: 0.35
  },
  {
    name: "Custom Material",
    elasticModulus: 100,
    yieldStrength: 250,
    ultimateStrength: 400,
    poissonRatio: 0.3,
    densityKgM3: 1000,
    thermalExpansion: 10,
    nonLinearFactor: 0.5
  }
];

/**
 * Calculate stress with non-linear material behavior
 * Uses Ramberg-Osgood model for non-linear stress-strain relationship
 */
export const calculateNonLinearStress = (
  linearStress: number,
  strain: number,
  material: MaterialProperties,
  temperature: number = 20 // Default room temperature
): number => {
  // Apply material non-linearity factor
  const nonLinearFactor = material.nonLinearFactor;
  
  // Base yield strength at room temperature
  let yieldStrength = material.yieldStrength;
  
  // Temperature effects on yield strength (simplified approach)
  // Most materials weaken at higher temperatures
  if (temperature > 100) {
    // Simplified temperature reduction factor
    const tempFactor = Math.max(0.5, 1 - (temperature - 100) / 1000);
    yieldStrength *= tempFactor;
  }
  
  // If stress is below 50% of yield strength, behavior is mostly linear
  if (linearStress < 0.5 * yieldStrength) {
    return linearStress;
  }
  
  // Non-linear behavior increases as we approach yield strength
  // Ramberg-Osgood simplified model
  const stressRatio = linearStress / yieldStrength;
  const plasticStrain = Math.pow(stressRatio, 1/nonLinearFactor) * (strain / 10);
  
  // Total stress including non-linear effects
  const totalStress = linearStress * (1 + plasticStrain * nonLinearFactor);
  
  // Limit to ultimate strength
  return Math.min(totalStress, material.ultimateStrength);
};

/**
 * Calculate deflection with non-linear geometry effects
 * Applies a non-linear factor to account for large deflection theory
 */
export const calculateNonLinearDeflection = (
  linearDeflection: number,
  length: number,
  material: MaterialProperties,
  stress: number
): number => {
  // If deflection is small relative to length, behavior is mostly linear
  if (linearDeflection < length / 250) {
    return linearDeflection;
  }
  
  // Non-linear effects increase for larger deflections
  const deflectionRatio = linearDeflection / length;
  const nonLinearFactor = 1 + Math.pow(deflectionRatio * 25, 2) * material.nonLinearFactor;
  
  // Additional factor for stress level
  const stressRatio = stress / material.yieldStrength;
  const stressFactor = 1 + Math.max(0, stressRatio - 0.7) * 0.5;
  
  return linearDeflection * nonLinearFactor * stressFactor;
};

/**
 * Calculate safety factor with more realistic behavior
 */
export const calculateSafetyFactor = (
  stress: number,
  material: MaterialProperties,
  temperature: number = 20,
  loadDuration: "temporary" | "sustained" | "permanent" = "sustained",
  safetyClass: "normal" | "high" | "exceptional" = "normal"
): number => {
  let yieldStrength = material.yieldStrength;
  
  // Temperature effects
  if (temperature > 100) {
    const tempFactor = Math.max(0.5, 1 - (temperature - 100) / 1000);
    yieldStrength *= tempFactor;
  }
  
  // Duration factors
  const durationFactor = loadDuration === "temporary" ? 1.1 : 
                        loadDuration === "sustained" ? 1.0 : 0.9;
  
  // Safety class factors
  const safetyClassFactor = safetyClass === "normal" ? 1.0 :
                           safetyClass === "high" ? 0.9 : 0.8;
  
  // Calculate adjusted safety factor
  const rawSafetyFactor = yieldStrength / stress;
  return rawSafetyFactor * durationFactor * safetyClassFactor;
};

/**
 * Generate recommendation based on enhanced analysis
 */
export const generateRecommendation = (
  safetyFactor: number,
  deflectionRatio: number,
  material: MaterialProperties,
  stress: number
): string => {
  let recommendations = [];
  
  // Safety factor evaluation
  if (safetyFactor < 1.2) {
    recommendations.push("CRITICAL: Structure is unsafe and likely to fail. Immediate redesign required.");
  } else if (safetyFactor < 1.5) {
    recommendations.push("WARNING: Structure barely meets minimum safety requirements. Consider significant reinforcement.");
  } else if (safetyFactor < 2.0) {
    recommendations.push("CAUTION: Structure meets basic safety requirements but has limited reserve capacity.");
  } else if (safetyFactor > 4.0) {
    recommendations.push("INEFFICIENT: Structure is significantly overdesigned. Material optimization possible.");
  } else {
    recommendations.push("Structure has adequate safety margin against failure.");
  }
  
  // Deflection evaluation
  if (deflectionRatio > 1/250) {
    recommendations.push("Deflection exceeds recommended limits for typical structures. May cause serviceability issues.");
  }
  
  // Material-specific recommendations
  if (stress > 0.9 * material.yieldStrength) {
    recommendations.push(`Material is operating close to yield strength (${material.yieldStrength} MPa). Significant plastic deformation may occur.`);
  }
  
  if (material.name === "Concrete" && stress > 0.4 * material.yieldStrength) {
    recommendations.push("Concrete stress exceeds 40% of compressive strength. Cracking is likely under sustained loading.");
  }
  
  if (material.name.includes("Wood") && deflectionRatio > 1/300) {
    recommendations.push("Wood member deflection may lead to long-term creep issues.");
  }
  
  return recommendations.join(' ');
};
