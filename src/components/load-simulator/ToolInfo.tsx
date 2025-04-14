
import React from "react";

const ToolInfo: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-md">
      <h2 className="text-lg font-medium mb-2">About This Tool</h2>
      <p className="text-sm text-muted-foreground mb-3">
        The Load Simulator provides engineers with a beam analysis tool for estimating stresses and deformations in common structural elements. 
        This enhanced version includes non-linear material behavior, advanced visualizations, and detailed failure analysis.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Features</h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
            <li>Multiple beam types: simply-supported, cantilever, fixed-ends, and more</li>
            <li>Various loading conditions: point, uniform, triangular loads</li>
            <li>Non-linear material behavior models using Ramberg-Osgood relationships</li>
            <li>Visualization of deflection curves, stress distributions, and moment diagrams</li>
            <li>Temperature effects on material properties</li>
            <li>Detailed safety factor analysis with real-world recommendations</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Real-World Applications</h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
            <li>Building structure preliminary design and validation</li>
            <li>Bridge component analysis for load capacities</li>
            <li>Machine component sizing for mechanical engineering</li>
            <li>Educational tool for understanding structural mechanics</li>
            <li>Quick field calculations for civil and structural engineers</li>
            <li>Failure analysis and safety factor assessment</li>
          </ul>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Note: While this tool provides advanced simulation capabilities, comprehensive analysis for critical structures should 
        always be performed using specialized structural analysis software and verified by qualified engineers.
      </p>
    </div>
  );
};

export default ToolInfo;
