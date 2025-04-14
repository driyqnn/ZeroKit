
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { LineChart, Calculator, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility functions for trigonometry calculations
const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

// Custom hook for handling form inputs with validation
const useFormInput = (initialValue: string, validator?: (value: number) => boolean) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (validator && newValue) {
      const numValue = parseFloat(newValue);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
      } else if (!validator(numValue)) {
        setError("Invalid value for this calculation");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  return { value, setValue, error, setError, handleChange };
};

const TrigonometrySolver = () => {
  const [angleUnit, setAngleUnit] = useState<"degrees" | "radians">("degrees");
  const [operation, setOperation] = useState<string>("angleFunction");
  const [function1, setFunction1] = useState<string>("sin");
  const [function2, setFunction2] = useState<string>("asin");
  const [resultVisible, setResultVisible] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  // Form inputs
  const angle = useFormInput("", (value) => 
    (angleUnit === "degrees" && value >= -360 && value <= 360) || 
    (angleUnit === "radians" && value >= -2 * Math.PI && value <= 2 * Math.PI)
  );
  
  const functionInput = useFormInput("", (value) => 
    (function2 === "asin" || function2 === "acos") ? (value >= -1 && value <= 1) : true
  );
  
  const triangleSideA = useFormInput("");
  const triangleSideB = useFormInput("");
  const triangleSideC = useFormInput("");
  const triangleAngleA = useFormInput("");
  const triangleAngleB = useFormInput("");
  const triangleAngleC = useFormInput("");

  const handleCalculate = () => {
    let calculatedResult: number | null = null;
    let calculationSteps: string[] = [];

    try {
      // Clear previous results
      setResult(null);
      setSteps([]);

      switch (operation) {
        case "angleFunction":
          calculatedResult = calculateAngleFunction();
          break;
        case "inverseFunction":
          calculatedResult = calculateInverseFunction();
          break;
        case "solveTriangle":
          calculatedResult = solveTriangle();
          break;
        default:
          toast.error("Invalid operation");
          return;
      }

      if (calculatedResult !== null) {
        setResult(calculatedResult);
        setResultVisible(true);
        setSteps(calculationSteps);
      }
    } catch (error) {
      console.error(error);
      toast.error("Calculation error: Please check your inputs");
    }

    // Function to calculate angle functions (sin, cos, tan)
    function calculateAngleFunction(): number {
      const inputAngle = parseFloat(angle.value);
      
      if (isNaN(inputAngle)) {
        toast.error("Please enter a valid angle");
        return 0;
      }
      
      let angleInRadians = angleUnit === "degrees" ? degreesToRadians(inputAngle) : inputAngle;
      let functionResult: number;
      
      // Calculate the trigonometric function
      switch (function1) {
        case "sin":
          functionResult = Math.sin(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating sin(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        case "cos":
          functionResult = Math.cos(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating cos(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        case "tan":
          if (Math.abs(Math.cos(angleInRadians)) < 1e-10) {
            toast.error("Tangent is undefined at this angle");
            return 0;
          }
          functionResult = Math.tan(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating tan(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        case "csc":
          if (Math.abs(Math.sin(angleInRadians)) < 1e-10) {
            toast.error("Cosecant is undefined at this angle");
            return 0;
          }
          functionResult = 1 / Math.sin(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating csc(${angleInRadians.toFixed(4)}) = 1/sin(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        case "sec":
          if (Math.abs(Math.cos(angleInRadians)) < 1e-10) {
            toast.error("Secant is undefined at this angle");
            return 0;
          }
          functionResult = 1 / Math.cos(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating sec(${angleInRadians.toFixed(4)}) = 1/cos(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        case "cot":
          if (Math.abs(Math.sin(angleInRadians)) < 1e-10) {
            toast.error("Cotangent is undefined at this angle");
            return 0;
          }
          functionResult = Math.cos(angleInRadians) / Math.sin(angleInRadians);
          calculationSteps = [
            `Converting angle to radians: ${angleUnit === "degrees" ? `${inputAngle}° = ${angleInRadians.toFixed(4)} radians` : `${inputAngle} radians`}`,
            `Calculating cot(${angleInRadians.toFixed(4)}) = cos(${angleInRadians.toFixed(4)})/sin(${angleInRadians.toFixed(4)}) = ${functionResult.toFixed(6)}`
          ];
          break;
        default:
          toast.error("Invalid function");
          return 0;
      }
      
      return parseFloat(functionResult.toFixed(6));
    }

    // Function to calculate inverse functions (asin, acos, atan)
    function calculateInverseFunction(): number {
      const inputValue = parseFloat(functionInput.value);
      
      if (isNaN(inputValue)) {
        toast.error("Please enter a valid number");
        return 0;
      }
      
      let functionResult: number;
      
      // Calculate the inverse trigonometric function
      switch (function2) {
        case "asin":
          if (inputValue < -1 || inputValue > 1) {
            toast.error("Input for arcsin must be between -1 and 1");
            return 0;
          }
          functionResult = Math.asin(inputValue);
          calculationSteps = [
            `Calculating arcsin(${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        case "acos":
          if (inputValue < -1 || inputValue > 1) {
            toast.error("Input for arccos must be between -1 and 1");
            return 0;
          }
          functionResult = Math.acos(inputValue);
          calculationSteps = [
            `Calculating arccos(${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        case "atan":
          functionResult = Math.atan(inputValue);
          calculationSteps = [
            `Calculating arctan(${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        case "acsc":
          if (Math.abs(inputValue) < 1) {
            toast.error("Input for arccsc must be less than -1 or greater than 1");
            return 0;
          }
          functionResult = Math.asin(1 / inputValue);
          calculationSteps = [
            `Calculating arccsc(${inputValue}) = arcsin(1/${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        case "asec":
          if (Math.abs(inputValue) < 1) {
            toast.error("Input for arcsec must be less than -1 or greater than 1");
            return 0;
          }
          functionResult = Math.acos(1 / inputValue);
          calculationSteps = [
            `Calculating arcsec(${inputValue}) = arccos(1/${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        case "acot":
          functionResult = Math.atan(1 / inputValue);
          calculationSteps = [
            `Calculating arccot(${inputValue}) = arctan(1/${inputValue}) = ${functionResult.toFixed(6)} radians`
          ];
          break;
        default:
          toast.error("Invalid function");
          return 0;
      }
      
      // Convert to degrees if needed
      if (angleUnit === "degrees") {
        const degreeResult = radiansToDegrees(functionResult);
        calculationSteps.push(`Converting to degrees: ${functionResult.toFixed(6)} radians = ${degreeResult.toFixed(6)}°`);
        return parseFloat(degreeResult.toFixed(6));
      }
      
      return parseFloat(functionResult.toFixed(6));
    }

    // Function to solve triangles
    function solveTriangle(): number {
      // Convert string inputs to numbers
      const a = parseFloat(triangleSideA.value);
      const b = parseFloat(triangleSideB.value);
      const c = parseFloat(triangleSideC.value);
      const angleADeg = parseFloat(triangleAngleA.value);
      const angleBDeg = parseFloat(triangleAngleB.value);
      const angleCDeg = parseFloat(triangleAngleC.value);
      
      // Convert to radians
      const angleA = angleADeg ? degreesToRadians(angleADeg) : 0;
      const angleB = angleBDeg ? degreesToRadians(angleBDeg) : 0;
      const angleC = angleCDeg ? degreesToRadians(angleCDeg) : 0;
      
      // Count how many variables are provided
      const sides = [a, b, c].filter(val => !isNaN(val)).length;
      const angles = [angleA, angleB, angleC].filter(val => val !== 0).length;

      calculationSteps = ["Applying the law of sines and cosines to solve the triangle:"];

      // Check if we have enough information
      if (sides + angles < 3) {
        toast.error("Not enough information to solve the triangle");
        return 0;
      }
      
      if (sides === 0) {
        toast.error("At least one side is required to solve a triangle");
        return 0;
      }
      
      // Different cases based on available information
      
      // Case 1: Three sides (SSS)
      if (sides === 3) {
        calculationSteps.push("Using SSS (three sides) to solve the triangle");
        // Check if triangle is valid
        if (a + b <= c || a + c <= b || b + c <= a) {
          toast.error("Invalid triangle: The sum of the lengths of any two sides must be greater than the length of the remaining side");
          return 0;
        }
        
        // Calculate angles using law of cosines
        const calcAngleA = Math.acos((b*b + c*c - a*a) / (2 * b * c));
        const calcAngleB = Math.acos((a*a + c*c - b*b) / (2 * a * c));
        const calcAngleC = Math.acos((a*a + b*b - c*c) / (2 * a * b));
        
        calculationSteps.push(`Angle A = arccos((b² + c² - a²)/(2bc)) = ${radiansToDegrees(calcAngleA).toFixed(2)}°`);
        calculationSteps.push(`Angle B = arccos((a² + c² - b²)/(2ac)) = ${radiansToDegrees(calcAngleB).toFixed(2)}°`);
        calculationSteps.push(`Angle C = arccos((a² + b² - c²)/(2ab)) = ${radiansToDegrees(calcAngleC).toFixed(2)}°`);
        
        // Calculate area using Heron's formula
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        
        calculationSteps.push(`Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2 = ${area.toFixed(4)} square units`);
        
        return parseFloat(area.toFixed(4));
      }
      
      // Case 2: Two sides and included angle (SAS)
      if (sides === 2 && angles === 1) {
        calculationSteps.push("Using SAS (two sides and included angle) to solve the triangle");
        
        // Determine which pair we have
        if (!isNaN(a) && !isNaN(b) && angleC) {
          // We have a, b, and angle C
          const calcC = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(angleC));
          calculationSteps.push(`Side c = √(a² + b² - 2ab⋅cos(C)) = ${calcC.toFixed(4)}`);
          
          // Calculate remaining angles
          const calcAngleA = Math.asin((a * Math.sin(angleC)) / calcC);
          const calcAngleB = Math.asin((b * Math.sin(angleC)) / calcC);
          
          calculationSteps.push(`Angle A = arcsin((a⋅sin(C))/c) = ${radiansToDegrees(calcAngleA).toFixed(2)}°`);
          calculationSteps.push(`Angle B = arcsin((b⋅sin(C))/c) = ${radiansToDegrees(calcAngleB).toFixed(2)}°`);
          
          // Calculate area
          const area = 0.5 * a * b * Math.sin(angleC);
          calculationSteps.push(`Area = (1/2)⋅a⋅b⋅sin(C) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        } else if (!isNaN(a) && !isNaN(c) && angleB) {
          // We have a, c, and angle B
          const calcB = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(angleB));
          calculationSteps.push(`Side b = √(a² + c² - 2ac⋅cos(B)) = ${calcB.toFixed(4)}`);
          
          // Calculate remaining angles
          const calcAngleA = Math.asin((a * Math.sin(angleB)) / calcB);
          const calcAngleC = Math.asin((c * Math.sin(angleB)) / calcB);
          
          calculationSteps.push(`Angle A = arcsin((a⋅sin(B))/b) = ${radiansToDegrees(calcAngleA).toFixed(2)}°`);
          calculationSteps.push(`Angle C = arcsin((c⋅sin(B))/b) = ${radiansToDegrees(calcAngleC).toFixed(2)}°`);
          
          // Calculate area
          const area = 0.5 * a * c * Math.sin(angleB);
          calculationSteps.push(`Area = (1/2)⋅a⋅c⋅sin(B) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        } else if (!isNaN(b) && !isNaN(c) && angleA) {
          // We have b, c, and angle A
          const calcA = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(angleA));
          calculationSteps.push(`Side a = √(b² + c² - 2bc⋅cos(A)) = ${calcA.toFixed(4)}`);
          
          // Calculate remaining angles
          const calcAngleB = Math.asin((b * Math.sin(angleA)) / calcA);
          const calcAngleC = Math.asin((c * Math.sin(angleA)) / calcA);
          
          calculationSteps.push(`Angle B = arcsin((b⋅sin(A))/a) = ${radiansToDegrees(calcAngleB).toFixed(2)}°`);
          calculationSteps.push(`Angle C = arcsin((c⋅sin(A))/a) = ${radiansToDegrees(calcAngleC).toFixed(2)}°`);
          
          // Calculate area
          const area = 0.5 * b * c * Math.sin(angleA);
          calculationSteps.push(`Area = (1/2)⋅b⋅c⋅sin(A) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        } else {
          toast.error("Could not identify sides and included angle");
          return 0;
        }
      }
      
      // Case 3: One side and two angles (ASA or AAS)
      if (sides === 1 && angles === 2) {
        calculationSteps.push("Using ASA/AAS (one side and two angles) to solve the triangle");
        
        // Calculate the third angle
        let thirdAngle = Math.PI - (angleA + angleB + angleC);
        if (angleA && angleB && !angleC) {
          thirdAngle = Math.PI - (angleA + angleB);
          calculationSteps.push(`Angle C = 180° - (A + B) = ${radiansToDegrees(thirdAngle).toFixed(2)}°`);
        } else if (angleA && !angleB && angleC) {
          thirdAngle = Math.PI - (angleA + angleC);
          calculationSteps.push(`Angle B = 180° - (A + C) = ${radiansToDegrees(thirdAngle).toFixed(2)}°`);
        } else if (!angleA && angleB && angleC) {
          thirdAngle = Math.PI - (angleB + angleC);
          calculationSteps.push(`Angle A = 180° - (B + C) = ${radiansToDegrees(thirdAngle).toFixed(2)}°`);
        }
        
        // Use the law of sines to find the other sides
        if (!isNaN(a)) {
          // We have side a
          const calcB = a * Math.sin(angleB) / Math.sin(angleA);
          const calcC = a * Math.sin(thirdAngle) / Math.sin(angleA);
          
          calculationSteps.push(`Side b = a⋅sin(B)/sin(A) = ${calcB.toFixed(4)}`);
          calculationSteps.push(`Side c = a⋅sin(C)/sin(A) = ${calcC.toFixed(4)}`);
          
          // Calculate area
          const area = 0.5 * calcB * calcC * Math.sin(angleA);
          calculationSteps.push(`Area = (1/2)⋅b⋅c⋅sin(A) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        } else if (!isNaN(b)) {
          // We have side b
          const calcA = b * Math.sin(angleA) / Math.sin(angleB);
          const calcC = b * Math.sin(thirdAngle) / Math.sin(angleB);
          
          calculationSteps.push(`Side a = b⋅sin(A)/sin(B) = ${calcA.toFixed(4)}`);
          calculationSteps.push(`Side c = b⋅sin(C)/sin(B) = ${calcC.toFixed(4)}`);
          
          // Calculate area
          const area = 0.5 * calcA * calcC * Math.sin(angleB);
          calculationSteps.push(`Area = (1/2)⋅a⋅c⋅sin(B) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        } else if (!isNaN(c)) {
          // We have side c
          const calcA = c * Math.sin(angleA) / Math.sin(thirdAngle);
          const calcB = c * Math.sin(angleB) / Math.sin(thirdAngle);
          
          calculationSteps.push(`Side a = c⋅sin(A)/sin(C) = ${calcA.toFixed(4)}`);
          calculationSteps.push(`Side b = c⋅sin(B)/sin(C) = ${calcB.toFixed(4)}`);
          
          // Calculate area
          const area = 0.5 * calcA * calcB * Math.sin(thirdAngle);
          calculationSteps.push(`Area = (1/2)⋅a⋅b⋅sin(C) = ${area.toFixed(4)} square units`);
          
          return parseFloat(area.toFixed(4));
        }
      }
      
      // If we get here, we couldn't solve the triangle
      toast.error("Unable to solve triangle with the given information");
      return 0;
    }
  };

  return (
    <ToolLayout
      title="Trigonometry Solver"
      description="Solve trigonometric equations, calculate functions, and solve triangles"
      icon={<LineChart className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="operation">Operation</Label>
                <Select
                  defaultValue={operation}
                  onValueChange={(value) => {
                    setOperation(value);
                    setResultVisible(false);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angleFunction">Trigonometric Functions</SelectItem>
                    <SelectItem value="inverseFunction">Inverse Trigonometric Functions</SelectItem>
                    <SelectItem value="solveTriangle">Solve Triangle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {operation === "angleFunction" && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="function1">Function</Label>
                      <Select
                        defaultValue={function1}
                        onValueChange={setFunction1}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sin">Sine (sin)</SelectItem>
                          <SelectItem value="cos">Cosine (cos)</SelectItem>
                          <SelectItem value="tan">Tangent (tan)</SelectItem>
                          <SelectItem value="csc">Cosecant (csc)</SelectItem>
                          <SelectItem value="sec">Secant (sec)</SelectItem>
                          <SelectItem value="cot">Cotangent (cot)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="angle">Angle</Label>
                      <div className="flex gap-2">
                        <Input
                          id="angle"
                          type="number"
                          value={angle.value}
                          onChange={angle.handleChange}
                          placeholder={angleUnit === "degrees" ? "e.g., 45" : "e.g., 0.785"}
                          className="flex-1"
                        />
                        <Select
                          value={angleUnit}
                          onValueChange={(value) => setAngleUnit(value as "degrees" | "radians")}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="degrees">Degrees</SelectItem>
                            <SelectItem value="radians">Radians</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {angle.error && <p className="text-destructive text-sm">{angle.error}</p>}
                    </div>
                  </div>
                  
                  <Button onClick={handleCalculate} className="w-full">Calculate</Button>
                </div>
              )}

              {operation === "inverseFunction" && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="function2">Inverse Function</Label>
                      <Select
                        defaultValue={function2}
                        onValueChange={setFunction2}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asin">Arcsine (arcsin)</SelectItem>
                          <SelectItem value="acos">Arccosine (arccos)</SelectItem>
                          <SelectItem value="atan">Arctangent (arctan)</SelectItem>
                          <SelectItem value="acsc">Arccosecant (arccsc)</SelectItem>
                          <SelectItem value="asec">Arcsecant (arcsec)</SelectItem>
                          <SelectItem value="acot">Arccotangent (arccot)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="functionInput">Input Value</Label>
                      <Input
                        id="functionInput"
                        type="number"
                        value={functionInput.value}
                        onChange={functionInput.handleChange}
                        placeholder={(function2 === "asin" || function2 === "acos") ? "Value between -1 and 1" : "Any number"}
                        className="flex-1"
                      />
                      {functionInput.error && <p className="text-destructive text-sm">{functionInput.error}</p>}
                    </div>
                    
                    <div className="space-y-2 w-[110px]">
                      <Label htmlFor="resultUnit">Result In</Label>
                      <Select
                        value={angleUnit}
                        onValueChange={(value) => setAngleUnit(value as "degrees" | "radians")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="degrees">Degrees</SelectItem>
                          <SelectItem value="radians">Radians</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={handleCalculate} className="w-full">Calculate</Button>
                </div>
              )}

              {operation === "solveTriangle" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg mb-2">Sides</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleSideA">Side a</Label>
                        <Input
                          id="triangleSideA"
                          type="number"
                          value={triangleSideA.value}
                          onChange={triangleSideA.handleChange}
                          placeholder="Length of side a"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleSideB">Side b</Label>
                        <Input
                          id="triangleSideB"
                          type="number"
                          value={triangleSideB.value}
                          onChange={triangleSideB.handleChange}
                          placeholder="Length of side b"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleSideC">Side c</Label>
                        <Input
                          id="triangleSideC"
                          type="number"
                          value={triangleSideC.value}
                          onChange={triangleSideC.handleChange}
                          placeholder="Length of side c"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg mb-2">Angles (in degrees)</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleAngleA">Angle A</Label>
                        <Input
                          id="triangleAngleA"
                          type="number"
                          value={triangleAngleA.value}
                          onChange={triangleAngleA.handleChange}
                          placeholder="Angle A in degrees"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleAngleB">Angle B</Label>
                        <Input
                          id="triangleAngleB"
                          type="number"
                          value={triangleAngleB.value}
                          onChange={triangleAngleB.handleChange}
                          placeholder="Angle B in degrees"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="triangleAngleC">Angle C</Label>
                        <Input
                          id="triangleAngleC"
                          type="number"
                          value={triangleAngleC.value}
                          onChange={triangleAngleC.handleChange}
                          placeholder="Angle C in degrees"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Enter at least three values to solve the triangle (at least one side is required):
                      <br />
                      - SSS: Three sides
                      <br />
                      - SAS: Two sides and the included angle
                      <br />
                      - ASA/AAS: One side and two angles
                    </p>
                  </div>
                  
                  <Button onClick={handleCalculate} className="w-full">Solve Triangle</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {resultVisible && result !== null && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Result</h3>
              
              <div className="p-4 bg-muted/30 rounded-md mb-4">
                <p className="text-2xl font-semibold">{result}</p>
                <p className="text-sm text-muted-foreground">
                  {operation === "angleFunction" 
                    ? `${function1}(${angle.value}${angleUnit === "degrees" ? "°" : " rad"})` 
                    : operation === "inverseFunction" 
                      ? `${function2}(${functionInput.value}) = ${result}${angleUnit === "degrees" ? "°" : " rad"}`
                      : "Triangle area (square units)"}
                </p>
              </div>
              
              {steps.length > 0 && (
                <div className="mt-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="steps">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          View Calculation Steps
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-4 bg-muted/20 rounded-md font-mono text-sm">
                          {steps.map((step, index) => (
                            <p key={index}>{step}</p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Trigonometric Formulas</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Pythagorean Identities</p>
                  <p className="font-mono mt-1">sin²θ + cos²θ = 1</p>
                  <p className="font-mono">tan²θ + 1 = sec²θ</p>
                  <p className="font-mono">1 + cot²θ = csc²θ</p>
                </div>
                
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Sum and Difference Formulas</p>
                  <p className="font-mono mt-1">sin(A + B) = sinA·cosB + cosA·sinB</p>
                  <p className="font-mono">sin(A - B) = sinA·cosB - cosA·sinB</p>
                  <p className="font-mono">cos(A + B) = cosA·cosB - sinA·sinB</p>
                  <p className="font-mono">cos(A - B) = cosA·cosB + sinA·sinB</p>
                </div>
                
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Double Angle Formulas</p>
                  <p className="font-mono mt-1">sin(2θ) = 2·sinθ·cosθ</p>
                  <p className="font-mono">cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Triangle Laws</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Law of Sines</p>
                  <p className="font-mono mt-1">a/sin(A) = b/sin(B) = c/sin(C)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Relates the sides of a triangle to the sines of the opposite angles
                  </p>
                </div>
                
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Law of Cosines</p>
                  <p className="font-mono mt-1">c² = a² + b² - 2ab·cos(C)</p>
                  <p className="font-mono">b² = a² + c² - 2ac·cos(B)</p>
                  <p className="font-mono">a² = b² + c² - 2bc·cos(A)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Relates the square of a side to the sum of squares of the other sides and their included angle
                  </p>
                </div>
                
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Law of Tangents</p>
                  <p className="font-mono mt-1">(a-b)/(a+b) = tan[(A-B)/2]/tan[(A+B)/2]</p>
                </div>
                
                <div className="p-2 border border-border rounded-md">
                  <p className="font-medium">Area of Triangle</p>
                  <p className="font-mono mt-1">Area = (1/2)·a·b·sin(C)</p>
                  <p className="font-mono">Area = (1/2)·b·c·sin(A)</p>
                  <p className="font-mono">Area = (1/2)·a·c·sin(B)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TrigonometrySolver;
