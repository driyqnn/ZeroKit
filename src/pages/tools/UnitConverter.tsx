
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type UnitCategory = {
  name: string;
  units: {
    [key: string]: number;
  };
  defaultFrom: string;
  defaultTo: string;
};

// Conversion factors relative to base unit
const unitCategories: { [key: string]: UnitCategory } = {
  length: {
    name: "Length",
    units: {
      "Kilometer (km)": 1000,
      "Meter (m)": 1,
      "Centimeter (cm)": 0.01,
      "Millimeter (mm)": 0.001,
      "Mile (mi)": 1609.34,
      "Yard (yd)": 0.9144,
      "Foot (ft)": 0.3048,
      "Inch (in)": 0.0254,
      "Nautical Mile (nmi)": 1852
    },
    defaultFrom: "Meter (m)",
    defaultTo: "Foot (ft)"
  },
  mass: {
    name: "Mass",
    units: {
      "Tonne (t)": 1000,
      "Kilogram (kg)": 1,
      "Gram (g)": 0.001,
      "Milligram (mg)": 0.000001,
      "Pound (lb)": 0.453592,
      "Ounce (oz)": 0.0283495,
      "Stone (st)": 6.35029
    },
    defaultFrom: "Kilogram (kg)",
    defaultTo: "Pound (lb)"
  },
  volume: {
    name: "Volume",
    units: {
      "Cubic Meter (m³)": 1,
      "Liter (L)": 0.001,
      "Milliliter (mL)": 0.000001,
      "Cubic Foot (ft³)": 0.0283168,
      "Gallon (US) (gal)": 0.00378541,
      "Quart (US) (qt)": 0.000946353,
      "Pint (US) (pt)": 0.000473176,
      "Cup (US)": 0.000236588,
      "Fluid Ounce (US) (fl oz)": 0.0000295735,
      "Tablespoon (US) (tbsp)": 0.0000147868,
      "Teaspoon (US) (tsp)": 0.00000492892
    },
    defaultFrom: "Liter (L)",
    defaultTo: "Gallon (US) (gal)"
  },
  temperature: {
    name: "Temperature",
    units: {
      "Celsius (°C)": 1,
      "Fahrenheit (°F)": 2,
      "Kelvin (K)": 3
    },
    defaultFrom: "Celsius (°C)",
    defaultTo: "Fahrenheit (°F)"
  },
  area: {
    name: "Area",
    units: {
      "Square Kilometer (km²)": 1000000,
      "Square Meter (m²)": 1,
      "Square Centimeter (cm²)": 0.0001,
      "Hectare (ha)": 10000,
      "Acre (ac)": 4046.86,
      "Square Mile (mi²)": 2589988.11,
      "Square Yard (yd²)": 0.836127,
      "Square Foot (ft²)": 0.092903,
      "Square Inch (in²)": 0.00064516
    },
    defaultFrom: "Square Meter (m²)",
    defaultTo: "Square Foot (ft²)"
  },
  speed: {
    name: "Speed",
    units: {
      "Meter per Second (m/s)": 1,
      "Kilometer per Hour (km/h)": 0.277778,
      "Mile per Hour (mph)": 0.44704,
      "Knot (kn)": 0.514444,
      "Foot per Second (ft/s)": 0.3048
    },
    defaultFrom: "Kilometer per Hour (km/h)",
    defaultTo: "Mile per Hour (mph)"
  },
  time: {
    name: "Time",
    units: {
      "Year (y)": 31536000,
      "Month (avg)": 2628000,
      "Week (wk)": 604800,
      "Day (d)": 86400,
      "Hour (h)": 3600,
      "Minute (min)": 60,
      "Second (s)": 1,
      "Millisecond (ms)": 0.001,
      "Microsecond (μs)": 0.000001
    },
    defaultFrom: "Hour (h)",
    defaultTo: "Minute (min)"
  },
  energy: {
    name: "Energy",
    units: {
      "Joule (J)": 1,
      "Kilojoule (kJ)": 1000,
      "Calorie (cal)": 4.184,
      "Kilocalorie (kcal)": 4184,
      "Watt-hour (Wh)": 3600,
      "Kilowatt-hour (kWh)": 3600000,
      "Electronvolt (eV)": 1.602176634e-19,
      "British Thermal Unit (BTU)": 1055.06
    },
    defaultFrom: "Kilojoule (kJ)",
    defaultTo: "Kilocalorie (kcal)"
  },
  pressure: {
    name: "Pressure",
    units: {
      "Pascal (Pa)": 1,
      "Kilopascal (kPa)": 1000,
      "Bar": 100000,
      "Atmosphere (atm)": 101325,
      "Millimeter of Mercury (mmHg)": 133.322,
      "Pound per Square Inch (psi)": 6894.76
    },
    defaultFrom: "Kilopascal (kPa)",
    defaultTo: "Pound per Square Inch (psi)"
  }
};

const UnitConverter = () => {
  const [category, setCategory] = useState<string>("length");
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("3.28084");
  const [fromUnit, setFromUnit] = useState<string>(unitCategories.length.defaultFrom);
  const [toUnit, setToUnit] = useState<string>(unitCategories.length.defaultTo);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFromUnit(unitCategories[newCategory].defaultFrom);
    setToUnit(unitCategories[newCategory].defaultTo);
    handleConvert({ from: unitCategories[newCategory].defaultFrom, to: unitCategories[newCategory].defaultTo, value: "1" });
  };

  const handleConvert = ({ 
    from = fromUnit, 
    to = toUnit, 
    value = fromValue 
  }: { 
    from?: string, 
    to?: string, 
    value?: string 
  } = {}) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setToValue("");
      return;
    }
    
    // Handle temperature conversions specially
    if (category === "temperature") {
      setToValue(convertTemperature(numValue, from, to).toString());
      return;
    }
    
    // Handle other unit conversions
    const categoryUnits = unitCategories[category].units;
    const fromFactor = categoryUnits[from];
    const toFactor = categoryUnits[to];
    
    // Convert to base unit, then to target unit
    const result = (numValue * fromFactor) / toFactor;
    setToValue(result.toPrecision(7).replace(/\.?0+$/, ""));
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let result: number;
    
    // First convert to Celsius
    let celsius: number;
    if (from === "Celsius (°C)") {
      celsius = value;
    } else if (from === "Fahrenheit (°F)") {
      celsius = (value - 32) * 5/9;
    } else {
      // Kelvin
      celsius = value - 273.15;
    }
    
    // Then convert from Celsius to target
    if (to === "Celsius (°C)") {
      result = celsius;
    } else if (to === "Fahrenheit (°F)") {
      result = celsius * 9/5 + 32;
    } else {
      // Kelvin
      result = celsius + 273.15;
    }
    
    return parseFloat(result.toPrecision(7));
  };

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromValue(value);
    handleConvert({ value });
  };

  const handleFromUnitChange = (value: string) => {
    setFromUnit(value);
    handleConvert({ from: value });
  };

  const handleToUnitChange = (value: string) => {
    setToUnit(value);
    handleConvert({ to: value });
  };

  const generateCommonConversions = () => {
    const currentUnits = unitCategories[category].units;
    const unitNames = Object.keys(currentUnits);
    const conversions = [];
    
    // Generate some useful common conversions based on the category
    if (category === "length") {
      conversions.push({ from: "Meter (m)", to: "Foot (ft)", value: 1 });
      conversions.push({ from: "Kilometer (km)", to: "Mile (mi)", value: 1 });
      conversions.push({ from: "Centimeter (cm)", to: "Inch (in)", value: 1 });
      conversions.push({ from: "Meter (m)", to: "Yard (yd)", value: 1 });
    } else if (category === "mass") {
      conversions.push({ from: "Kilogram (kg)", to: "Pound (lb)", value: 1 });
      conversions.push({ from: "Gram (g)", to: "Ounce (oz)", value: 1 });
      conversions.push({ from: "Kilogram (kg)", to: "Stone (st)", value: 1 });
      conversions.push({ from: "Tonne (t)", to: "Pound (lb)", value: 1 });
    } else if (category === "volume") {
      conversions.push({ from: "Liter (L)", to: "Gallon (US) (gal)", value: 1 });
      conversions.push({ from: "Milliliter (mL)", to: "Fluid Ounce (US) (fl oz)", value: 1 });
      conversions.push({ from: "Liter (L)", to: "Quart (US) (qt)", value: 1 });
      conversions.push({ from: "Cup (US)", to: "Milliliter (mL)", value: 1 });
    } else if (category === "temperature") {
      conversions.push({ from: "Celsius (°C)", to: "Fahrenheit (°F)", value: 0 });
      conversions.push({ from: "Celsius (°C)", to: "Fahrenheit (°F)", value: 20 });
      conversions.push({ from: "Celsius (°C)", to: "Fahrenheit (°F)", value: 100 });
      conversions.push({ from: "Kelvin (K)", to: "Celsius (°C)", value: 273.15 });
    } else {
      // For other categories, generate generic conversions
      const first = unitNames[0];
      const middle = unitNames[Math.floor(unitNames.length / 2)];
      const last = unitNames[unitNames.length - 1];
      
      conversions.push({ from: first, to: middle, value: 1 });
      conversions.push({ from: middle, to: last, value: 1 });
      conversions.push({ from: first, to: last, value: 1 });
      
      if (unitNames.length > 3) {
        conversions.push({ from: unitNames[1], to: unitNames[unitNames.length - 2], value: 1 });
      }
    }
    
    return conversions;
  };

  const handleReset = () => {
    setFromValue("1");
    setFromUnit(unitCategories[category].defaultFrom);
    setToUnit(unitCategories[category].defaultTo);
    handleConvert({
      from: unitCategories[category].defaultFrom,
      to: unitCategories[category].defaultTo,
      value: "1"
    });
    toast.success("Converter has been reset");
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement"
      icon={<ArrowRight className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Select Measurement Category</h3>
            <Tabs 
              defaultValue="length" 
              value={category}
              onValueChange={handleCategoryChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1">
                {Object.keys(unitCategories).map(cat => (
                  <TabsTrigger key={cat} value={cat}>
                    {unitCategories[cat].name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div>
                <div className="mb-4">
                  <Label htmlFor="fromValue">From</Label>
                  <div className="flex mt-1">
                    <Input
                      id="fromValue"
                      type="number"
                      value={fromValue}
                      onChange={handleFromValueChange}
                      className="text-lg rounded-r-none"
                    />
                    <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                      <SelectTrigger className="w-[180px] rounded-l-none border-l-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.keys(unitCategories[category].units).map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwapUnits}
                  className="rounded-full h-10 w-10"
                >
                  <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
                </Button>
              </div>
              
              <div>
                <div className="mb-4">
                  <Label htmlFor="toValue">To</Label>
                  <div className="flex mt-1">
                    <Input
                      id="toValue"
                      type="text"
                      value={toValue}
                      readOnly
                      className="text-lg rounded-r-none bg-muted/20"
                    />
                    <Select value={toUnit} onValueChange={handleToUnitChange}>
                      <SelectTrigger className="w-[180px] rounded-l-none border-l-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.keys(unitCategories[category].units).map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Common {unitCategories[category].name} Conversions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generateCommonConversions().map((conversion, index) => {
              let result;
              if (category === "temperature") {
                result = convertTemperature(conversion.value, conversion.from, conversion.to);
              } else {
                const fromFactor = unitCategories[category].units[conversion.from];
                const toFactor = unitCategories[category].units[conversion.to];
                result = (conversion.value * fromFactor) / toFactor;
              }
              
              return (
                <div key={index} className="p-4 rounded-md bg-muted/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{conversion.value} {conversion.from.split(' ')[0]}</span>
                    </div>
                    <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">
                        {result.toPrecision(7).replace(/\.?0+$/, "")} {conversion.to.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {conversion.from} to {conversion.to}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">About Unit Conversion</h3>
          <p className="text-sm text-muted-foreground">
            Unit conversion is the process of changing a measurement from one unit to another. This tool provides conversions for length, mass, volume, temperature, area, speed, time, energy, and pressure units. The conversions are calculated using standard conversion factors and are accurate for general use.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default UnitConverter;
