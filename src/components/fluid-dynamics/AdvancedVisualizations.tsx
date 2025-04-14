import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedVisualizationsProps {
  results: {
    velocity: number;
    reynoldsNumber: number;
    pressureDrop: number;
    flowType: string;
    massFlowRate: number;
    dragCoefficient: number;
    frictionFactor: number;
  } | null;
  pipeLength: number;
  pipeDiameter: number;
  fluidDensity: number;
  fluidViscosity: number;
}

const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({
  results,
  pipeLength,
  pipeDiameter,
  fluidDensity,
  fluidViscosity
}) => {
  const pressureChartRef = useRef<SVGSVGElement>(null);
  const velocityChartRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!results || !pressureChartRef.current || !velocityChartRef.current) return;
    
    // Clear previous charts
    d3.select(pressureChartRef.current).selectAll("*").remove();
    d3.select(velocityChartRef.current).selectAll("*").remove();
    
    // Create pressure drop chart along pipe length
    createPressureChart();
    
    // Create velocity profile chart
    createVelocityProfileChart();
  }, [results]);
  
  const createPressureChart = () => {
    if (!results || !pressureChartRef.current) return;
    
    const svg = d3.select(pressureChartRef.current);
    const width = pressureChartRef.current.clientWidth || 500;
    const height = pressureChartRef.current.clientHeight || 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Generate data points along pipe length
    const numPoints = 50;
    const data = Array.from({ length: numPoints }, (_, i) => {
      const x = (i / (numPoints - 1)) * pipeLength;
      // Pressure decreases linearly along the pipe for simplicity
      const pressure = results.pressureDrop * (1 - x / pipeLength);
      return { x, pressure };
    });
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, pipeLength])
      .range([0, innerWidth]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, results.pressureDrop * 1.1])
      .range([innerHeight, 0]);
    
    // Create the plot area
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "black")
      .attr("x", innerWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text("Pipe Length (m)");
    
    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("Pressure (Pa)");
    
    // Draw line
    const line = d3.line<{x: number, pressure: number}>()
      .x(d => x(d.x))
      .y(d => y(d.pressure));
    
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
    
    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ""));
      
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Pressure Drop Along Pipe");
  };
  
  const createVelocityProfileChart = () => {
    if (!results || !velocityChartRef.current) return;
    
    const svg = d3.select(velocityChartRef.current);
    const width = velocityChartRef.current.clientWidth || 500;
    const height = velocityChartRef.current.clientHeight || 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create the plot area
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Draw pipe cross-section
    const radius = innerHeight / 2;
    const centerY = innerHeight / 2;
    
    // Draw pipe wall
    g.append("circle")
      .attr("cx", innerWidth / 2)
      .attr("cy", centerY)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
    
    const isLaminar = results.reynoldsNumber < 2300;
    
    // Generate velocity profile data
    const numPoints = 20;
    const velocityData = [];
    
    for (let i = 0; i < numPoints; i++) {
      const r = (i / (numPoints - 1)) * radius;
      let velocityRatio;
      
      if (isLaminar) {
        // Parabolic profile for laminar flow
        velocityRatio = 1 - Math.pow(r / radius, 2);
      } else {
        // Flatter profile for turbulent flow (1/7th power law)
        velocityRatio = Math.pow(1 - r / radius, 1/7);
      }
      
      const velocity = results.velocity * velocityRatio;
      
      velocityData.push({
        r,
        velocity,
        x: innerWidth / 2 - r,
        y: centerY
      });
      
      velocityData.push({
        r,
        velocity,
        x: innerWidth / 2 + r,
        y: centerY
      });
    }
    
    // Sort data by x-coordinate for proper line drawing
    velocityData.sort((a, b) => a.x - b.x);
    
    // Color scale based on velocity
    const colorScale = d3.scaleSequential()
      .domain([0, results.velocity])
      .interpolator(d3.interpolateBlues);
    
    // Draw velocity profile
    const velocityLine = d3.line<{x: number, y: number, velocity: number}>()
      .x(d => d.x)
      .y(d => d.y - (d.velocity / results.velocity) * radius);
    
    g.append("path")
      .datum(velocityData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", velocityLine);
    
    // Fill velocity profile
    const velocityArea = d3.area<{x: number, y: number, velocity: number}>()
      .x(d => d.x)
      .y0(d => centerY)
      .y1(d => d.y - (d.velocity / results.velocity) * radius);
    
    g.append("path")
      .datum(velocityData)
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.5)
      .attr("d", velocityArea);
    
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(`${isLaminar ? "Laminar" : "Turbulent"} Velocity Profile`);
    
    // Add legend
    g.append("text")
      .attr("x", innerWidth - 100)
      .attr("y", 20)
      .text(`Re = ${results.reynoldsNumber.toFixed(0)}`);
    
    g.append("text")
      .attr("x", innerWidth - 100)
      .attr("y", 40)
      .text(`V_max = ${results.velocity.toFixed(2)} m/s`);
  };
  
  if (!results) {
    return null;
  }
  
  return (
    <Tabs defaultValue="pressure">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="pressure">Pressure Profile</TabsTrigger>
        <TabsTrigger value="velocity">Velocity Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pressure" className="pt-2">
        <div className="h-[300px] border rounded-md overflow-hidden">
          <svg 
            ref={pressureChartRef} 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid meet"
          ></svg>
        </div>
      </TabsContent>
      
      <TabsContent value="velocity" className="pt-2">
        <div className="h-[300px] border rounded-md overflow-hidden">
          <svg 
            ref={velocityChartRef} 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid meet"
          ></svg>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedVisualizations;
