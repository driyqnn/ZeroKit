
import React, { useEffect, useRef } from "react";
import { Component } from "@/types/circuit";
import { CircleSlash } from "lucide-react";

interface CircuitDiagramProps {
  circuitType: "series" | "parallel" | "mixed";
  components: Component[];
  voltage: number;
  results: any;
}

const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  circuitType,
  components,
  voltage,
  results
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !results) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set drawing styles
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#666";
    ctx.font = "12px sans-serif";

    const drawSeriesCircuit = () => {
      const resistors = components.filter(c => c.type === "resistor");
      const width = canvas.width;
      const height = canvas.height;
      const startX = 50;
      const endX = width - 50;
      const wireY = height / 2;
      const resistorHeight = 40;
      const resistorSpacing = (endX - startX - 100) / Math.max(resistors.length, 1);
      
      // Draw battery
      ctx.beginPath();
      ctx.moveTo(startX, wireY - 30);
      ctx.lineTo(startX, wireY + 30);
      // Long line (positive)
      ctx.moveTo(startX - 10, wireY - 30);
      ctx.lineTo(startX + 10, wireY - 30);
      // Short line (negative)
      ctx.moveTo(startX - 5, wireY + 30);
      ctx.lineTo(startX + 5, wireY + 30);
      ctx.stroke();
      
      // Draw voltage label
      ctx.fillText(`${voltage}V`, startX - 20, wireY);
      
      // Draw wire from battery to first resistor
      ctx.beginPath();
      ctx.moveTo(startX, wireY - 30);
      ctx.lineTo(startX + 50, wireY - 30);
      ctx.stroke();
      
      // Draw resistors
      let currentX = startX + 70;
      
      resistors.forEach((resistor, index) => {
        // Draw resistor symbol (rectangle)
        ctx.beginPath();
        ctx.rect(currentX, wireY - 15, 40, 30);
        ctx.stroke();
        
        // Draw resistor value
        ctx.fillText(`${resistor.value}Ω`, currentX, wireY + 30);
        
        // Add current info if available
        if (results?.voltageDrops) {
          const info = results.voltageDrops.find((v: any) => v.id === resistor.id);
          if (info) {
            ctx.fillText(`${info.voltage.toFixed(1)}V`, currentX, wireY - 20);
            ctx.fillText(`${info.current.toFixed(3)}A`, currentX, wireY + 45);
          }
        }
        
        // Draw connecting wire to next resistor
        if (index < resistors.length - 1) {
          ctx.beginPath();
          ctx.moveTo(currentX + 40, wireY);
          ctx.lineTo(currentX + resistorSpacing, wireY);
          ctx.stroke();
        }
        
        currentX += resistorSpacing;
      });
      
      // Draw wire back to battery
      ctx.beginPath();
      ctx.moveTo(currentX - resistorSpacing + 40, wireY);
      ctx.lineTo(endX, wireY);
      ctx.lineTo(endX, wireY + 30);
      ctx.lineTo(startX, wireY + 30);
      ctx.stroke();
    };
    
    const drawParallelCircuit = () => {
      const resistors = components.filter(c => c.type === "resistor");
      const width = canvas.width;
      const height = canvas.height;
      const startX = 50;
      const endX = width - 50;
      const mainWireY1 = 50;
      const mainWireY2 = height - 50;
      const resistorSpacing = (mainWireY2 - mainWireY1 - 50) / Math.max(resistors.length, 1);
      
      // Draw battery
      ctx.beginPath();
      ctx.moveTo(startX, mainWireY1);
      ctx.lineTo(startX, mainWireY2);
      // Long line (positive)
      ctx.moveTo(startX - 10, mainWireY1);
      ctx.lineTo(startX + 10, mainWireY1);
      // Short line (negative)
      ctx.moveTo(startX - 5, mainWireY2);
      ctx.lineTo(startX + 5, mainWireY2);
      ctx.stroke();
      
      // Draw voltage label
      ctx.fillText(`${voltage}V`, startX - 20, (mainWireY1 + mainWireY2) / 2);
      
      // Draw main wires
      ctx.beginPath();
      ctx.moveTo(startX, mainWireY1);
      ctx.lineTo(endX, mainWireY1);
      ctx.moveTo(startX, mainWireY2);
      ctx.lineTo(endX, mainWireY2);
      ctx.stroke();
      
      // Draw resistors in parallel
      let currentY = mainWireY1 + 40;
      
      resistors.forEach((resistor, index) => {
        // Draw vertical connecting lines
        ctx.beginPath();
        ctx.moveTo(startX + 100, mainWireY1);
        ctx.lineTo(startX + 100, currentY);
        ctx.moveTo(endX - 100, mainWireY1);
        ctx.lineTo(endX - 100, currentY);
        ctx.stroke();
        
        // Draw resistor symbol (rectangle)
        ctx.beginPath();
        ctx.rect(startX + 100, currentY - 15, endX - startX - 200, 30);
        ctx.stroke();
        
        // Draw resistor value
        ctx.fillText(`${resistor.value}Ω`, (startX + endX) / 2 - 20, currentY + 5);
        
        // Add current info if available
        if (results?.branchCurrents) {
          const info = results.branchCurrents.find((v: any) => v.id === resistor.id);
          if (info) {
            ctx.fillText(`${voltage.toFixed(1)}V`, startX + 120, currentY - 20);
            ctx.fillText(`${info.current.toFixed(3)}A`, endX - 140, currentY - 20);
          }
        }
        
        currentY += resistorSpacing;
      });
    };
    
    if (circuitType === "series") {
      drawSeriesCircuit();
    } else if (circuitType === "parallel") {
      drawParallelCircuit();
    } else {
      // Mixed circuit placeholder
      ctx.fillText("Mixed circuit diagram visualization", canvas.width / 2 - 100, canvas.height / 2);
    }

  }, [circuitType, components, voltage, results]);

  if (!results) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-md">
        <CircleSlash className="w-12 h-12 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground">
          Configure your circuit and click Analyze to see the diagram.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400}
        className="max-w-full max-h-full"
      />
    </div>
  );
};

export default CircuitDiagram;
