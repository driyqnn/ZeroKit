
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface BendingStressFormProps {
  setResults: (results: any) => void;
}

export const BendingStressForm: React.FC<BendingStressFormProps> = ({ setResults }) => {
  const [moment, setMoment] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [inertia, setInertia] = useState<string>('');
  const [momentUnit, setMomentUnit] = useState<string>('N·m');
  const [distanceUnit, setDistanceUnit] = useState<string>('mm');
  const [inertiaUnit, setInertiaUnit] = useState<string>('mm4');
  const [error, setError] = useState<string | null>(null);

  const calculateBendingStress = () => {
    // Clear previous error
    setError(null);
    
    // Validate inputs
    if (!moment || !distance || !inertia) {
      setError('Please provide all required values.');
      return;
    }
    
    const momentValue = parseFloat(moment);
    const distanceValue = parseFloat(distance);
    const inertiaValue = parseFloat(inertia);
    
    if (isNaN(momentValue) || isNaN(distanceValue) || isNaN(inertiaValue)) {
      setError('Please provide valid numeric values.');
      return;
    }
    
    if (inertiaValue <= 0) {
      setError('Moment of inertia must be greater than zero.');
      return;
    }
    
    // Convert moment to N·m
    let momentInNm = momentValue;
    if (momentUnit === 'kN·m') momentInNm = momentValue * 1000;
    if (momentUnit === 'lbf·ft') momentInNm = momentValue * 1.35582;
    
    // Convert distance to meters
    let distanceInMeters = distanceValue;
    if (distanceUnit === 'mm') distanceInMeters = distanceValue * 0.001;
    if (distanceUnit === 'cm') distanceInMeters = distanceValue * 0.01;
    if (distanceUnit === 'in') distanceInMeters = distanceValue * 0.0254;
    
    // Convert inertia to m^4
    let inertiaInM4 = inertiaValue;
    if (inertiaUnit === 'mm4') inertiaInM4 = inertiaValue * Math.pow(0.001, 4);
    if (inertiaUnit === 'cm4') inertiaInM4 = inertiaValue * Math.pow(0.01, 4);
    if (inertiaUnit === 'in4') inertiaInM4 = inertiaValue * Math.pow(0.0254, 4);
    
    // Calculate bending stress (σ = My/I)
    const stressInPascals = (momentInNm * distanceInMeters) / inertiaInM4;
    const stressInMPa = stressInPascals / 1000000;
    const stressInKsi = stressInPascals / 6894757.2932;
    
    setResults({
      stress: {
        pascal: stressInPascals,
        mpa: stressInMPa,
        ksi: stressInKsi
      },
      type: "bending",
      inputs: {
        moment: `${moment} ${momentUnit}`,
        distance: `${distance} ${distanceUnit}`,
        inertia: `${inertia} ${inertiaUnit}`
      }
    });
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Bending stress (σ) is calculated as moment (M) times distance from neutral axis (y) divided by moment of inertia (I): σ = My/I
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="moment">Bending Moment</Label>
            <Input 
              id="moment" 
              value={moment} 
              onChange={(e) => setMoment(e.target.value)}
              placeholder="Enter bending moment" 
              type="number"
            />
          </div>
          
          <div>
            <Label htmlFor="moment-unit">Unit</Label>
            <Select value={momentUnit} onValueChange={setMomentUnit}>
              <SelectTrigger id="moment-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N·m">N·m (Newton-meters)</SelectItem>
                <SelectItem value="kN·m">kN·m (Kilonewton-meters)</SelectItem>
                <SelectItem value="lbf·ft">lbf·ft (Pound-feet)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="distance">Distance from Neutral Axis</Label>
            <Input 
              id="distance" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance value" 
              type="number"
            />
          </div>
          
          <div>
            <Label htmlFor="distance-unit">Unit</Label>
            <Select value={distanceUnit} onValueChange={setDistanceUnit}>
              <SelectTrigger id="distance-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm">mm (Millimeters)</SelectItem>
                <SelectItem value="cm">cm (Centimeters)</SelectItem>
                <SelectItem value="in">in (Inches)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="inertia">Moment of Inertia</Label>
            <Input 
              id="inertia" 
              value={inertia} 
              onChange={(e) => setInertia(e.target.value)}
              placeholder="Enter moment of inertia" 
              type="number"
            />
          </div>
          
          <div>
            <Label htmlFor="inertia-unit">Unit</Label>
            <Select value={inertiaUnit} onValueChange={setInertiaUnit}>
              <SelectTrigger id="inertia-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm4">mm⁴</SelectItem>
                <SelectItem value="cm4">cm⁴</SelectItem>
                <SelectItem value="in4">in⁴</SelectItem>
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
          onClick={calculateBendingStress} 
          className="mt-2"
        >
          Calculate Bending Stress
        </Button>
      </div>
    </div>
  );
};
