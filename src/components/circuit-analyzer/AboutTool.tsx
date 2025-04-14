
import React from "react";

const AboutTool: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-md">
      <h2 className="text-lg font-medium mb-2">About This Tool</h2>
      <p className="text-sm text-muted-foreground">
        The Circuit Analyzer provides a simplified way to analyze basic electrical circuits using Ohm's law and Kirchhoff's laws.
        For educational purposes, this tool focuses on DC circuits with resistors in series or parallel configurations.
      </p>
    </div>
  );
};

export default AboutTool;
