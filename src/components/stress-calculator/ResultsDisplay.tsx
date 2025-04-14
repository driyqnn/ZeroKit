
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight } from "lucide-react";

interface ResultsDisplayProps {
  results: {
    stress: {
      pascal: number;
      mpa: number;
      ksi: number;
    };
    strain?: number;
    type: "axial" | "bending" | "shear";
    inputs: Record<string, string>;
  };
  stressType: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, stressType }) => {
  const formatNumber = (num: number) => {
    // Format large numbers with scientific notation and small numbers with fixed decimals
    if (num > 1000000 || num < 0.001) {
      return num.toExponential(4);
    } else {
      return num.toFixed(4);
    }
  };

  const getStressSymbol = () => {
    switch (stressType) {
      case "axial":
        return "σ";
      case "bending":
        return "σb";
      case "shear":
        return "τ";
      default:
        return "σ";
    }
  };

  const getStressLabel = () => {
    switch (stressType) {
      case "axial":
        return "Axial Stress";
      case "bending":
        return "Bending Stress";
      case "shear":
        return "Shear Stress";
      default:
        return "Stress";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-lg">Calculation Results</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Input Parameters</h3>
            <Table>
              <TableBody>
                {Object.entries(results.inputs).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize">{key}</TableCell>
                    <TableCell className="text-right">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Calculated Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{getStressLabel()}</TableCell>
                  <TableCell>{getStressSymbol()}</TableCell>
                  <TableCell className="text-right">{formatNumber(results.stress.mpa)} MPa</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{getStressLabel()} (Alternative Units)</TableCell>
                  <TableCell>{getStressSymbol()}</TableCell>
                  <TableCell className="text-right">{formatNumber(results.stress.ksi)} ksi</TableCell>
                </TableRow>
                {results.strain && (
                  <TableRow>
                    <TableCell className="font-medium">Strain</TableCell>
                    <TableCell>ε</TableCell>
                    <TableCell className="text-right">{formatNumber(results.strain)} (ΔL/L)</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="pt-2 text-sm text-muted-foreground">
            <p>Note: Results are calculated based on linear elastic theory and may not account for non-linear material behavior.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
