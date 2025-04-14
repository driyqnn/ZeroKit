
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ShearStressFormProps {
  setResults: (results: any) => void;
}

export const ShearStressForm: React.FC<ShearStressFormProps> = ({ setResults }) => {
  const [shearForce, setShearForce] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [forceUnit, setForceUnit] = useState<string>('N');
  const [areaUnit, setAreaUnit] = useState<string>('mm2');
  const [error, setError] = useState<string | null>(null);

  const calculateShearStress = () => {
    // Clear previous error
    setError(null);
    
    // Validate inputs
    if (!shearForce || !area) {
      setError('Please provide both force and area values.');
      return;
    }
    
    const forceValue = parseFloat(shearForce);
    const areaValue = parseFloat(area);
    
    if (isNaN(forceValue) || isNaN(areaValue)) {
      setError('Please provide valid numeric values.');
      return;
    }
    
    if (areaValue <= 0) {
      setError('Area must be greater than zero.');
      return;
    }
    
    // Convert force to Newtons
    let forceInNewtons = forceValue;
    if (forceUnit === 'kN') forceInNewtons = forceValue * 1000;
    if (forceUnit === 'lbf') forceInNewtons = forceValue * 4.44822;
    
    // Convert area to square meters
    let areaInSquareMeters = areaValue;
    if (areaUnit === 'mm2') areaInSquareMeters = areaValue * 0.000001;
    if (areaUnit === 'cm2') areaInSquareMeters = areaValue * 0.0001;
    if (areaUnit === 'in2') areaInSquareMeters = areaValue * 0.00064516;
    
    // Calculate shear stress in Pascals (τ = F/A)
    const stressInPascals = forceInNewtons / areaInSquareMeters;
    const stressInMPa = stressInPascals / 1000000;
    const stressInKsi = stressInPascals / 6894757.2932;
    
    setResults({
      stress: {
        pascal: stressInPascals,
        mpa: stressInMPa,
        ksi: stressInKsi
      },
      type: "shear",
      inputs: {
        force: `${shearForce} ${forceUnit}`,
        area: `${area} ${areaUnit}`
      }
    });
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Shear stress (τ) is calculated as shear force (V) divided by the area parallel to the applied force (A): τ = V/A
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="shear-force">Shear Force</Label>
            <Input 
              id="shear-force" 
              value={shearForce} 
              onChange={(e) => setShearForce(e.target.value)}
              placeholder="Enter shear force value" 
              type="number"
            />
          </div>
          
          <div>
            <Label htmlFor="force-unit">Unit</Label>
            <Select value={forceUnit} onValueChange={setForceUnit}>
              <SelectTrigger id="force-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">N (Newtons)</SelectItem>
                <SelectItem value="kN">kN (Kilonewtons)</SelectItem>
                <SelectItem value="lbf">lbf (Pound-force)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="area">Shear Area</Label>
            <Input 
              id="area" 
              value={area} 
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area value" 
              type="number"
            />
          </div>
          
          <div>
            <Label htmlFor="area-unit">Unit</Label>
            <Select value={areaUnit} onValueChange={setAreaUnit}>
              <SelectTrigger id="area-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm2">mm² (Square millimeters)</SelectItem>
                <SelectItem value="cm2">cm² (Square centimeters)</SelectItem>
                <SelectItem value="in2">in² (Square inches)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={calculateShearStress} 
          className="mt-2"
        >
          Calculate Shear Stress
        </Button>
      </div>
    </div>
  );
};
