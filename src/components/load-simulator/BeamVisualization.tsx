
import React, { useEffect, useRef } from "react";
import { BeamType, LoadType, SimulationResult } from "@/types/beam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleSlash } from "lucide-react";

interface BeamVisualizationProps {
  results: SimulationResult | null;
  beamType: BeamType;
  loadType: LoadType;
  length: number;
  height: number;
  width: number;
}

const BeamVisualization: React.FC<BeamVisualizationProps> = ({
  results,
  beamType,
  loadType,
  length,
  height,
  width
}) => {
  const deflectionChartRef = useRef<HTMLCanvasElement>(null);
  const stressChartRef = useRef<HTMLCanvasElement>(null);
  const momentShearChartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!results || !results.deflectionCurve) return;
    
    if (deflectionChartRef.current) {
      drawDeflectionChart();
    }
    
    if (stressChartRef.current) {
      drawStressChart();
    }
    
    if (momentShearChartRef.current) {
      drawMomentShearChart();
    }
  }, [results, beamType, loadType]);
  
  const drawDeflectionChart = () => {
    if (!deflectionChartRef.current || !results?.deflectionCurve) return;
    
    const canvas = deflectionChartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    
    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.fillText("Length (m)", width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Deflection (mm)", 0, 0);
    ctx.restore();
    
    // Draw beam in undeflected position
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();
    
    // Draw deflected beam
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Scale factors for visualization
    const maxDeflection = Math.max(...results.deflectionCurve.map(Math.abs));
    const deflectionScale = Math.min(100, (height / 2 - padding) / maxDeflection);
    
    // Draw beam supports
    drawSupports(ctx, beamType, padding, width - padding, height / 2);
    
    // Draw load
    drawLoad(ctx, loadType, beamType, padding, width - padding, height / 2);
    
    // Draw deflection curve
    results.deflectionCurve.forEach((deflection, i) => {
      const x = padding + (width - 2 * padding) * i / (results.deflectionCurve!.length - 1);
      const y = height / 2 - deflection * deflectionScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw scale indicator
    ctx.fillStyle = "#666";
    ctx.fillText(`Max: ${results.maxDeflection.toFixed(3)} mm`, width - 150, padding + 15);
  };
  
  const drawStressChart = () => {
    if (!stressChartRef.current || !results?.stressDistribution) return;
    
    const canvas = stressChartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    
    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.fillText("Length (m)", width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Stress (MPa)", 0, 0);
    ctx.restore();
    
    // Draw stress distribution
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Scale factors for visualization
    const maxStress = Math.max(...results.stressDistribution.map(Math.abs));
    const stressScale = (height / 2 - padding) / maxStress;
    
    results.stressDistribution.forEach((stress, i) => {
      const x = padding + (width - 2 * padding) * i / (results.stressDistribution!.length - 1);
      const y = height / 2 - stress * stressScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Fill area under the curve
    ctx.lineTo(width - padding, height / 2);
    ctx.lineTo(padding, height / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
    ctx.fill();
    
    // Draw scale indicator
    ctx.fillStyle = "#666";
    ctx.fillText(`Max: ${results.maxStress.toFixed(2)} MPa`, width - 150, padding + 15);
  };
  
  const drawMomentShearChart = () => {
    if (!momentShearChartRef.current || !results?.momentDiagram || !results?.shearDiagram) return;
    
    const canvas = momentShearChartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const halfHeight = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw dividing line and labels
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(width, halfHeight);
    ctx.stroke();
    
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.fillText("Shear Diagram", padding, padding / 2);
    ctx.fillText("Moment Diagram", padding, halfHeight + padding / 2);
    
    // Draw shear diagram
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const maxShear = Math.max(...results.shearDiagram.map(Math.abs));
    const shearScale = (halfHeight / 2 - padding) / maxShear;
    
    results.shearDiagram.forEach((shear, i) => {
      const x = padding + (width - 2 * padding) * i / (results.shearDiagram!.length - 1);
      const y = halfHeight / 2 - shear * shearScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Fill area for shear
    ctx.lineTo(width - padding, halfHeight / 2);
    ctx.lineTo(padding, halfHeight / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
    ctx.fill();
    
    // Draw moment diagram
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const maxMoment = Math.max(...results.momentDiagram.map(Math.abs));
    const momentScale = (halfHeight / 2 - padding) / maxMoment;
    
    results.momentDiagram.forEach((moment, i) => {
      const x = padding + (width - 2 * padding) * i / (results.momentDiagram!.length - 1);
      const y = halfHeight + halfHeight / 2 - moment * momentScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Fill area for moment
    ctx.lineTo(width - padding, halfHeight + halfHeight / 2);
    ctx.lineTo(padding, halfHeight + halfHeight / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(139, 92, 246, 0.2)";
    ctx.fill();
    
    // Draw scale indicators
    ctx.fillStyle = "#666";
    ctx.fillText(`Max Shear: ${maxShear.toFixed(2)} kN`, width - 170, padding / 2 + 15);
    ctx.fillText(`Max Moment: ${maxMoment.toFixed(2)} kN·m`, width - 180, halfHeight + padding / 2 + 15);
  };
  
  const drawSupports = (ctx: CanvasRenderingContext2D, beamType: BeamType, startX: number, endX: number, baseY: number) => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    
    if (beamType === "simply-supported") {
      // Triangle support on left
      ctx.beginPath();
      ctx.moveTo(startX, baseY);
      ctx.lineTo(startX - 10, baseY + 15);
      ctx.lineTo(startX + 10, baseY + 15);
      ctx.closePath();
      ctx.stroke();
      
      // Roller support on right
      ctx.beginPath();
      ctx.arc(endX, baseY + 10, 5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (beamType === "cantilever") {
      // Fixed support on left
      ctx.beginPath();
      ctx.moveTo(startX, baseY - 20);
      ctx.lineTo(startX, baseY + 20);
      ctx.stroke();
      
      // Hatch marks
      for (let i = -15; i <= 15; i += 5) {
        ctx.beginPath();
        ctx.moveTo(startX, baseY + i);
        ctx.lineTo(startX - 5, baseY + i);
        ctx.stroke();
      }
    } else if (beamType === "fixed-ends") {
      // Fixed support on left
      ctx.beginPath();
      ctx.moveTo(startX, baseY - 20);
      ctx.lineTo(startX, baseY + 20);
      ctx.stroke();
      
      // Hatch marks on left
      for (let i = -15; i <= 15; i += 5) {
        ctx.beginPath();
        ctx.moveTo(startX, baseY + i);
        ctx.lineTo(startX - 5, baseY + i);
        ctx.stroke();
      }
      
      // Fixed support on right
      ctx.beginPath();
      ctx.moveTo(endX, baseY - 20);
      ctx.lineTo(endX, baseY + 20);
      ctx.stroke();
      
      // Hatch marks on right
      for (let i = -15; i <= 15; i += 5) {
        ctx.beginPath();
        ctx.moveTo(endX, baseY + i);
        ctx.lineTo(endX + 5, baseY + i);
        ctx.stroke();
      }
    }
  };
  
  const drawLoad = (ctx: CanvasRenderingContext2D, loadType: LoadType, beamType: BeamType, startX: number, endX: number, baseY: number) => {
    ctx.strokeStyle = "#f97316";
    ctx.fillStyle = "#f97316";
    ctx.lineWidth = 1;
    
    if (loadType === "point") {
      // Point load at center or end
      const loadX = beamType === "cantilever" ? endX : (startX + endX) / 2;
      
      // Arrow
      ctx.beginPath();
      ctx.moveTo(loadX, baseY - 30);
      ctx.lineTo(loadX, baseY);
      ctx.stroke();
      
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(loadX - 5, baseY - 10);
      ctx.lineTo(loadX, baseY);
      ctx.lineTo(loadX + 5, baseY - 10);
      ctx.stroke();
      
      // Point force symbol
      ctx.beginPath();
      ctx.arc(loadX, baseY - 30, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (loadType === "uniform") {
      // Uniform distributed load
      const loadStart = beamType === "cantilever" ? startX + 5 : startX;
      const loadEnd = endX;
      
      // Multiple arrows
      for (let x = loadStart; x <= loadEnd; x += (loadEnd - loadStart) / 8) {
        // Arrow
        ctx.beginPath();
        ctx.moveTo(x, baseY - 30);
        ctx.lineTo(x, baseY);
        ctx.stroke();
        
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x - 4, baseY - 10);
        ctx.lineTo(x, baseY);
        ctx.lineTo(x + 4, baseY - 10);
        ctx.stroke();
      }
      
      // Line across top of arrows
      ctx.beginPath();
      ctx.moveTo(loadStart, baseY - 30);
      ctx.lineTo(loadEnd, baseY - 30);
      ctx.stroke();
    } else if (loadType === "triangular") {
      // Triangular distributed load
      const loadStart = beamType === "cantilever" ? startX + 5 : startX;
      const loadEnd = endX;
      
      // Multiple arrows of varying length
      for (let i = 0; i <= 8; i++) {
        const x = loadStart + (loadEnd - loadStart) * (i / 8);
        const arrowLength = 30 * (i / 8);
        
        // Arrow
        ctx.beginPath();
        ctx.moveTo(x, baseY - arrowLength);
        ctx.lineTo(x, baseY);
        ctx.stroke();
        
        // Arrowhead
        if (arrowLength > 5) {
          ctx.beginPath();
          ctx.moveTo(x - 4, baseY - 10);
          ctx.lineTo(x, baseY);
          ctx.lineTo(x + 4, baseY - 10);
          ctx.stroke();
        }
      }
      
      // Line across top of arrows (triangular)
      ctx.beginPath();
      ctx.moveTo(loadStart, baseY);
      ctx.lineTo(loadEnd, baseY - 30);
      ctx.stroke();
    }
  };
  
  if (!results) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-md">
        <CircleSlash className="w-12 h-12 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground">
          Run a simulation to see beam visualization.
        </p>
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="deflection">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="deflection">Deflection</TabsTrigger>
        <TabsTrigger value="stress">Stress Distribution</TabsTrigger>
        <TabsTrigger value="moment">Moment & Shear</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deflection" className="pt-2">
        <div className="h-[300px] border rounded-md overflow-hidden">
          <canvas 
            ref={deflectionChartRef} 
            width={600} 
            height={300} 
            className="w-full h-full"
          ></canvas>
        </div>
      </TabsContent>
      
      <TabsContent value="stress" className="pt-2">
        <div className="h-[300px] border rounded-md overflow-hidden">
          <canvas 
            ref={stressChartRef} 
            width={600} 
            height={300} 
            className="w-full h-full"
          ></canvas>
        </div>
      </TabsContent>
      
      <TabsContent value="moment" className="pt-2">
        <div className="h-[300px] border rounded-md overflow-hidden">
          <canvas 
            ref={momentShearChartRef} 
            width={600} 
            height={300} 
            className="w-full h-full"
          ></canvas>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BeamVisualization;
