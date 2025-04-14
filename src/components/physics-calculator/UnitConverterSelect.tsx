
import React from 'react';
import { getUnitOptions } from './UnitSelector';
import { convertUnit } from './UnitConverter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UnitConverterSelectProps {
  value: number | string;
  unit: string;
  unitType: string;
  onUnitChange: (unit: string) => void;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  defaultUnit?: string;
}

const UnitConverterSelect: React.FC<UnitConverterSelectProps> = ({
  value,
  unit,
  unitType,
  onUnitChange,
  onChange,
  label,
  disabled = false,
  defaultUnit
}) => {
  const unitOptions = getUnitOptions(unitType);
  
  // If defaultUnit is provided and unit is empty, use defaultUnit
  React.useEffect(() => {
    if (defaultUnit && !unit && onUnitChange) {
      onUnitChange(defaultUnit);
    }
  }, [defaultUnit, unit, onUnitChange]);
  
  return (
    <div className="flex items-center space-x-2">
      {value !== undefined && (
        <span className="font-medium">
          {typeof value === 'number' ? value.toFixed(4) : value}
        </span>
      )}
      <Select value={unit} onValueChange={onUnitChange} disabled={disabled}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {unitOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UnitConverterSelect;
