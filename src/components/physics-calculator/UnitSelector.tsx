
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UnitOption {
  value: string;
  label: string;
  conversionFactor: number; // Factor to convert to base unit
}

interface UnitSelectorProps {
  unitType: string;
  value: string;
  onChange: (value: string) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ unitType, value, onChange }) => {
  const unitOptions = getUnitOptions(unitType);
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select unit" />
      </SelectTrigger>
      <SelectContent>
        {unitOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Helper function to get unit options based on type
const getUnitOptions = (unitType: string): UnitOption[] => {
  switch (unitType) {
    case 'length':
      return [
        { value: 'm', label: 'Meters (m)', conversionFactor: 1 },
        { value: 'km', label: 'Kilometers (km)', conversionFactor: 1000 },
        { value: 'cm', label: 'Centimeters (cm)', conversionFactor: 0.01 },
        { value: 'mm', label: 'Millimeters (mm)', conversionFactor: 0.001 },
        { value: 'ft', label: 'Feet (ft)', conversionFactor: 0.3048 },
        { value: 'in', label: 'Inches (in)', conversionFactor: 0.0254 },
        { value: 'mi', label: 'Miles (mi)', conversionFactor: 1609.34 },
      ];
    case 'mass':
      return [
        { value: 'kg', label: 'Kilograms (kg)', conversionFactor: 1 },
        { value: 'g', label: 'Grams (g)', conversionFactor: 0.001 },
        { value: 'mg', label: 'Milligrams (mg)', conversionFactor: 0.000001 },
        { value: 'lb', label: 'Pounds (lb)', conversionFactor: 0.453592 },
        { value: 'oz', label: 'Ounces (oz)', conversionFactor: 0.0283495 },
        { value: 't', label: 'Metric Tons (t)', conversionFactor: 1000 },
      ];
    case 'time':
      return [
        { value: 's', label: 'Seconds (s)', conversionFactor: 1 },
        { value: 'min', label: 'Minutes (min)', conversionFactor: 60 },
        { value: 'h', label: 'Hours (h)', conversionFactor: 3600 },
        { value: 'ms', label: 'Milliseconds (ms)', conversionFactor: 0.001 },
      ];
    case 'velocity':
      return [
        { value: 'm/s', label: 'Meters per second (m/s)', conversionFactor: 1 },
        { value: 'km/h', label: 'Kilometers per hour (km/h)', conversionFactor: 0.277778 },
        { value: 'ft/s', label: 'Feet per second (ft/s)', conversionFactor: 0.3048 },
        { value: 'mph', label: 'Miles per hour (mph)', conversionFactor: 0.44704 },
      ];
    case 'acceleration':
      return [
        { value: 'm/s²', label: 'Meters per second² (m/s²)', conversionFactor: 1 },
        { value: 'ft/s²', label: 'Feet per second² (ft/s²)', conversionFactor: 0.3048 },
        { value: 'g', label: 'g-force (g)', conversionFactor: 9.80665 },
      ];
    case 'force':
      return [
        { value: 'N', label: 'Newtons (N)', conversionFactor: 1 },
        { value: 'kN', label: 'Kilonewtons (kN)', conversionFactor: 1000 },
        { value: 'lbf', label: 'Pound-force (lbf)', conversionFactor: 4.44822 },
        { value: 'dyn', label: 'Dynes (dyn)', conversionFactor: 0.00001 },
      ];
    case 'energy':
      return [
        { value: 'J', label: 'Joules (J)', conversionFactor: 1 },
        { value: 'kJ', label: 'Kilojoules (kJ)', conversionFactor: 1000 },
        { value: 'cal', label: 'Calories (cal)', conversionFactor: 4.184 },
        { value: 'kcal', label: 'Kilocalories (kcal)', conversionFactor: 4184 },
        { value: 'eV', label: 'Electron Volts (eV)', conversionFactor: 1.602e-19 },
        { value: 'kWh', label: 'Kilowatt Hours (kWh)', conversionFactor: 3600000 },
      ];
    case 'power':
      return [
        { value: 'W', label: 'Watts (W)', conversionFactor: 1 },
        { value: 'kW', label: 'Kilowatts (kW)', conversionFactor: 1000 },
        { value: 'hp', label: 'Horsepower (hp)', conversionFactor: 745.7 },
        { value: 'MW', label: 'Megawatts (MW)', conversionFactor: 1000000 },
      ];
    case 'pressure':
      return [
        { value: 'Pa', label: 'Pascals (Pa)', conversionFactor: 1 },
        { value: 'kPa', label: 'Kilopascals (kPa)', conversionFactor: 1000 },
        { value: 'bar', label: 'Bar', conversionFactor: 100000 },
        { value: 'atm', label: 'Atmospheres (atm)', conversionFactor: 101325 },
        { value: 'psi', label: 'Pounds per sq. inch (psi)', conversionFactor: 6894.76 },
      ];
    case 'area':
      return [
        { value: 'm²', label: 'Square meters (m²)', conversionFactor: 1 },
        { value: 'cm²', label: 'Square centimeters (cm²)', conversionFactor: 0.0001 },
        { value: 'ft²', label: 'Square feet (ft²)', conversionFactor: 0.092903 },
        { value: 'in²', label: 'Square inches (in²)', conversionFactor: 0.00064516 },
        { value: 'km²', label: 'Square kilometers (km²)', conversionFactor: 1000000 },
      ];
    case 'volume':
      return [
        { value: 'm³', label: 'Cubic meters (m³)', conversionFactor: 1 },
        { value: 'L', label: 'Liters (L)', conversionFactor: 0.001 },
        { value: 'mL', label: 'Milliliters (mL)', conversionFactor: 0.000001 },
        { value: 'ft³', label: 'Cubic feet (ft³)', conversionFactor: 0.0283168 },
        { value: 'gal', label: 'US Gallons (gal)', conversionFactor: 0.00378541 },
      ];
    case 'angle':
      return [
        { value: 'rad', label: 'Radians (rad)', conversionFactor: 1 },
        { value: 'deg', label: 'Degrees (°)', conversionFactor: 0.0174533 },
      ];
    case 'frequency':
      return [
        { value: 'Hz', label: 'Hertz (Hz)', conversionFactor: 1 },
        { value: 'kHz', label: 'Kilohertz (kHz)', conversionFactor: 1000 },
        { value: 'MHz', label: 'Megahertz (MHz)', conversionFactor: 1000000 },
        { value: 'GHz', label: 'Gigahertz (GHz)', conversionFactor: 1000000000 },
      ];
    case 'charge':
      return [
        { value: 'C', label: 'Coulombs (C)', conversionFactor: 1 },
        { value: 'mC', label: 'Millicoulombs (mC)', conversionFactor: 0.001 },
        { value: 'μC', label: 'Microcoulombs (μC)', conversionFactor: 0.000001 },
      ];
    case 'voltage':
      return [
        { value: 'V', label: 'Volts (V)', conversionFactor: 1 },
        { value: 'mV', label: 'Millivolts (mV)', conversionFactor: 0.001 },
        { value: 'kV', label: 'Kilovolts (kV)', conversionFactor: 1000 },
      ];
    case 'current':
      return [
        { value: 'A', label: 'Amperes (A)', conversionFactor: 1 },
        { value: 'mA', label: 'Milliamperes (mA)', conversionFactor: 0.001 },
        { value: 'μA', label: 'Microamperes (μA)', conversionFactor: 0.000001 },
      ];
    case 'resistance':
      return [
        { value: 'Ω', label: 'Ohms (Ω)', conversionFactor: 1 },
        { value: 'kΩ', label: 'Kilohms (kΩ)', conversionFactor: 1000 },
        { value: 'MΩ', label: 'Megohms (MΩ)', conversionFactor: 1000000 },
      ];
    case 'magnetic-field':
      return [
        { value: 'T', label: 'Tesla (T)', conversionFactor: 1 },
        { value: 'mT', label: 'Millitesla (mT)', conversionFactor: 0.001 },
        { value: 'G', label: 'Gauss (G)', conversionFactor: 0.0001 },
      ];
    case 'density':
      return [
        { value: 'kg/m³', label: 'Kilograms per cubic meter (kg/m³)', conversionFactor: 1 },
        { value: 'g/cm³', label: 'Grams per cubic centimeter (g/cm³)', conversionFactor: 1000 },
        { value: 'g/mL', label: 'Grams per milliliter (g/mL)', conversionFactor: 1000 },
        { value: 'lb/ft³', label: 'Pounds per cubic foot (lb/ft³)', conversionFactor: 16.0185 },
      ];
    case 'momentum':
      return [
        { value: 'kg·m/s', label: 'Kilogram meters per second (kg·m/s)', conversionFactor: 1 },
        { value: 'g·cm/s', label: 'Gram centimeters per second (g·cm/s)', conversionFactor: 0.00001 },
      ];
    case 'wavelength':
      return [
        { value: 'm', label: 'Meters (m)', conversionFactor: 1 },
        { value: 'cm', label: 'Centimeters (cm)', conversionFactor: 0.01 },
        { value: 'nm', label: 'Nanometers (nm)', conversionFactor: 1e-9 },
        { value: 'Å', label: 'Angstroms (Å)', conversionFactor: 1e-10 },
      ];
    default:
      return [
        { value: 'default', label: 'Default Unit', conversionFactor: 1 },
      ];
  }
};

export default UnitSelector;
export type { UnitOption };
export { getUnitOptions };
