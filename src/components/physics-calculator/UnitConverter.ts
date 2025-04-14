
import { getUnitOptions } from './UnitSelector';

// Convert a value from one unit to another
const convertUnit = (value: number, fromUnit: string, toUnit: string, unitType: string): number => {
  // If units are the same, no conversion needed
  if (fromUnit === toUnit) return value;
  
  // Get all unit options for this unit type
  const unitOptions = getUnitOptions(unitType);
  
  // Find conversion factors
  const fromUnitOption = unitOptions.find(opt => opt.value === fromUnit);
  const toUnitOption = unitOptions.find(opt => opt.value === toUnit);
  
  if (!fromUnitOption || !toUnitOption) {
    console.error(`Conversion failed: Units not found for ${unitType}`);
    return value; // Return original value if conversion failed
  }
  
  // Convert to base unit, then to target unit
  const valueInBaseUnit = value * fromUnitOption.conversionFactor;
  return valueInBaseUnit / toUnitOption.conversionFactor;
};

export { convertUnit };
