
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { materialDatabase } from "@/utils/materialBehavior";

interface MaterialSelectorProps {
  materialName: string;
  materialE: number;
  setMaterialName: (value: string) => void;
  setMaterialE: (value: number) => void;
  setYieldStrength: (value: number) => void;
  setPoissonRatio: (value: number) => void;
  setDensity: (value: number) => void;
  advanced?: boolean;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materialName,
  materialE,
  setMaterialName,
  setMaterialE,
  setYieldStrength,
  setPoissonRatio,
  setDensity,
  advanced = false
}) => {
  const handleMaterialChange = (value: string) => {
    setMaterialName(value);
    
    // Find the selected material in the database
    const material = materialDatabase.find(m => m.name === value);
    
    if (material) {
      setMaterialE(material.elasticModulus);
      setYieldStrength(material.yieldStrength);
      setPoissonRatio(material.poissonRatio);
      setDensity(material.densityKgM3);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materialType">Material Type</Label>
          <Select 
            value={materialName} 
            onValueChange={handleMaterialChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materialDatabase.map((material) => (
                <SelectItem key={material.name} value={material.name}>{material.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="materialE">Elastic Modulus (GPa)</Label>
          <Input 
            id="materialE"
            type="number"
            value={materialE}
            onChange={(e) => setMaterialE(parseFloat(e.target.value) || 0)}
            min="1"
            step="1"
          />
        </div>
      </div>
      
      {advanced && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-properties">
            <AccordionTrigger className="text-sm">Advanced Material Properties</AccordionTrigger>
            <AccordionContent>
              <Card className="border-dashed">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="yieldStrength" className="text-xs">Yield Strength (MPa)</Label>
                      <Input 
                        id="yieldStrength"
                        type="number"
                        value={materialDatabase.find(m => m.name === materialName)?.yieldStrength || 250}
                        onChange={(e) => setYieldStrength(parseFloat(e.target.value) || 0)}
                        min="1"
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="poissonRatio" className="text-xs">Poisson's Ratio</Label>
                      <Input 
                        id="poissonRatio"
                        type="number"
                        value={materialDatabase.find(m => m.name === materialName)?.poissonRatio || 0.3}
                        onChange={(e) => setPoissonRatio(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="0.5"
                        step="0.01"
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="density" className="text-xs">Density (kg/m³)</Label>
                      <Input 
                        id="density"
                        type="number"
                        value={materialDatabase.find(m => m.name === materialName)?.densityKgM3 || 7850}
                        onChange={(e) => setDensity(parseFloat(e.target.value) || 0)}
                        min="1"
                        className="h-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default MaterialSelector;
