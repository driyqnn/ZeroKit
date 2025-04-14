
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Paintbrush, Copy, Plus, Trash, RotateCw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GradientColor {
  id: string;
  color: string;
  stop: number;
}

interface GradientPreset {
  name: string;
  colors: { color: string; stop: number }[];
  angle: number;
  type: "linear" | "radial";
}

const CSSGradientGenerator = () => {
  const { toast } = useToast();
  const [colors, setColors] = useState<GradientColor[]>([
    { id: crypto.randomUUID(), color: "#8B5CF6", stop: 0 },
    { id: crypto.randomUUID(), color: "#EC4899", stop: 100 }
  ]);
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [cssCode, setCssCode] = useState("");

  // Presets
  const presets: GradientPreset[] = [
    {
      name: "Sunset",
      colors: [
        { color: "#FF416C", stop: 0 },
        { color: "#FF4B2B", stop: 100 }
      ],
      angle: 90,
      type: "linear"
    },
    {
      name: "Ocean",
      colors: [
        { color: "#2193b0", stop: 0 },
        { color: "#6dd5ed", stop: 100 }
      ],
      angle: 45,
      type: "linear"
    },
    {
      name: "Emerald",
      colors: [
        { color: "#43cea2", stop: 0 },
        { color: "#185a9d", stop: 100 }
      ],
      angle: 135,
      type: "linear"
    },
    {
      name: "Midnight",
      colors: [
        { color: "#232526", stop: 0 },
        { color: "#414345", stop: 100 }
      ],
      angle: 90,
      type: "linear"
    },
    {
      name: "Candy",
      colors: [
        { color: "#FC466B", stop: 0 },
        { color: "#3F5EFB", stop: 100 }
      ],
      angle: 90,
      type: "linear"
    },
    {
      name: "Lavender Radial",
      colors: [
        { color: "#7F7FD5", stop: 0 },
        { color: "#91EAE4", stop: 100 }
      ],
      angle: 0,
      type: "radial"
    },
  ];

  // Update CSS code when options change
  useEffect(() => {
    generateCSS();
  }, [colors, angle, gradientType]);

  // Generate CSS code
  const generateCSS = () => {
    // Sort colors by stop value
    const sortedColors = [...colors].sort((a, b) => a.stop - b.stop);
    
    // Create color stops string
    const colorStops = sortedColors
      .map(color => `${color.color} ${color.stop}%`)
      .join(", ");
    
    // Build gradient string based on type
    let gradientString = "";
    
    if (gradientType === "linear") {
      gradientString = `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      gradientString = `radial-gradient(circle, ${colorStops})`;
    }
    
    // Set CSS code
    setCssCode(`background: ${gradientString};`);
  };

  // Add a new color
  const addColor = () => {
    if (colors.length >= 10) {
      toast({
        title: "Maximum colors reached",
        description: "You can add up to 10 color stops",
        variant: "destructive"
      });
      return;
    }
    
    // Find a middle stop value between existing colors
    const stops = colors.map(c => c.stop).sort((a, b) => a - b);
    let newStop = 50;
    
    if (stops.length >= 2) {
      // Find the largest gap between stops
      let maxGap = 0;
      let gapPos = 0;
      
      for (let i = 0; i < stops.length - 1; i++) {
        const gap = stops[i+1] - stops[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapPos = i;
        }
      }
      
      newStop = stops[gapPos] + maxGap / 2;
    }
    
    const newColor: GradientColor = {
      id: crypto.randomUUID(),
      color: "#64748B",
      stop: Math.round(newStop)
    };
    
    setColors([...colors, newColor]);
  };

  // Remove a color
  const removeColor = (id: string) => {
    if (colors.length <= 2) {
      toast({
        title: "Minimum colors required",
        description: "You need at least 2 colors for a gradient",
        variant: "destructive"
      });
      return;
    }
    
    setColors(colors.filter(color => color.id !== id));
  };

  // Update color value or stop
  const updateColor = (id: string, field: keyof GradientColor, value: string | number) => {
    setColors(
      colors.map(color => {
        if (color.id === id) {
          return { ...color, [field]: value };
        }
        return color;
      })
    );
  };

  // Apply a preset
  const applyPreset = (preset: GradientPreset) => {
    const presetColors = preset.colors.map(color => ({
      id: crypto.randomUUID(),
      color: color.color,
      stop: color.stop
    }));
    
    setColors(presetColors);
    setAngle(preset.angle);
    setGradientType(preset.type);
    
    toast({
      title: "Preset applied",
      description: `Applied "${preset.name}" preset`
    });
  };

  // Copy CSS code to clipboard
  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode).then(
      () => {
        toast({
          title: "CSS copied to clipboard",
          description: "The gradient CSS code has been copied to your clipboard"
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy CSS code to clipboard",
          variant: "destructive"
        });
      }
    );
  };

  // Get gradient preview style
  const getGradientStyle = () => {
    // Sort colors by stop value
    const sortedColors = [...colors].sort((a, b) => a.stop - b.stop);
    
    // Create color stops string
    const colorStops = sortedColors
      .map(color => `${color.color} ${color.stop}%`)
      .join(", ");
    
    // Return style object
    if (gradientType === "linear") {
      return {
        background: `linear-gradient(${angle}deg, ${colorStops})`,
        width: "100%",
        height: "200px",
        borderRadius: "8px"
      };
    } else {
      return {
        background: `radial-gradient(circle, ${colorStops})`,
        width: "100%",
        height: "200px",
        borderRadius: "8px"
      };
    }
  };

  // Randomize gradient
  const randomizeGradient = () => {
    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    
    const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    const newColors: GradientColor[] = [];
    
    for (let i = 0; i < numColors; i++) {
      newColors.push({
        id: crypto.randomUUID(),
        color: getRandomColor(),
        stop: Math.round(i * (100 / (numColors - 1))) // Evenly spaced
      });
    }
    
    setColors(newColors);
    setAngle(Math.floor(Math.random() * 360));
    setGradientType(Math.random() > 0.7 ? "radial" : "linear");
    
    toast({
      title: "Gradient randomized",
      description: "Created a random gradient"
    });
  };

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Create custom CSS gradients with preview"
      icon={<Paintbrush className="h-6 w-6 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Gradient Preview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Gradient Preview</h2>
              <div style={getGradientStyle()} className="mb-4 shadow-lg"></div>
              
              <div className="flex items-center justify-between bg-muted/30 p-4 rounded">
                <pre className="text-sm font-mono overflow-x-auto flex-grow">
                  {cssCode}
                </pre>
                <Button variant="ghost" size="icon" onClick={copyCSS}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Gradient Controls */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Gradient Settings</h2>
              
              {/* Gradient Type */}
              <div className="mb-6">
                <Label className="mb-2 block">Gradient Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="linear"
                      name="gradientType"
                      value="linear"
                      checked={gradientType === "linear"}
                      onChange={() => setGradientType("linear")}
                      className="mr-2"
                    />
                    <Label htmlFor="linear">Linear</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="radial"
                      name="gradientType"
                      value="radial"
                      checked={gradientType === "radial"}
                      onChange={() => setGradientType("radial")}
                      className="mr-2"
                    />
                    <Label htmlFor="radial">Radial</Label>
                  </div>
                </div>
              </div>
              
              {/* Angle (only for linear) */}
              {gradientType === "linear" && (
                <div className="mb-6">
                  <Label htmlFor="angle" className="mb-2 block">
                    Angle: {angle}°
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="angle"
                      type="range"
                      min="0"
                      max="359"
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="flex-grow"
                    />
                    <RotateCw className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              )}
              
              {/* Color Stops */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Color Stops</Label>
                  <Button size="sm" variant="outline" onClick={addColor}>
                    <Plus className="h-4 w-4 mr-1" /> Add Color
                  </Button>
                </div>
                
                {colors.map((color, index) => (
                  <div key={color.id} className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-10 h-10 rounded-md border border-input flex-shrink-0"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <Input
                      type="color"
                      value={color.color}
                      onChange={(e) => updateColor(color.id, "color", e.target.value)}
                      className="w-12 h-10 p-0 border-none bg-transparent"
                    />
                    <div className="flex flex-col flex-grow">
                      <Label className="text-xs text-muted-foreground mb-1">
                        Stop: {color.stop}%
                      </Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={color.stop}
                        onChange={(e) => updateColor(color.id, "stop", parseInt(e.target.value))}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeColor(color.id)}
                      disabled={colors.length <= 2}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={randomizeGradient}>
                  <RotateCw className="h-4 w-4 mr-2" /> Randomize
                </Button>
                <Button variant="outline" onClick={() => setColors([...colors].reverse())}>
                  <ArrowUpDown className="h-4 w-4 mr-2" /> Reverse Colors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Presets */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Gradient Presets</h2>
              <div className="space-y-4">
                {presets.map((preset, index) => {
                  // Create gradient style for preset preview
                  const presetStyle = {
                    background: preset.type === "linear"
                      ? `linear-gradient(${preset.angle}deg, ${preset.colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`
                      : `radial-gradient(circle, ${preset.colors.map(c => `${c.color} ${c.stop}%`).join(", ")})`,
                    height: "60px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  };
                  
                  return (
                    <div
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="hover:scale-[1.02] transition-transform"
                    >
                      <div style={presetStyle} className="shadow-sm"></div>
                      <p className="text-sm mt-1 text-center">{preset.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted/20 rounded-lg">
        <h3 className="font-medium mb-2">Usage Tips</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Add multiple color stops to create complex gradients</li>
          <li>For smooth transitions, use adjacent colors in the color wheel</li>
          <li>Complementary colors create vibrant, high-contrast gradients</li>
          <li>Radial gradients work well for spotlight or focus effects</li>
        </ul>
      </div>
    </ToolLayout>
  );
};

export default CSSGradientGenerator;
