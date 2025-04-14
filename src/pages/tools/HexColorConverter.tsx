
import React, { useState, useEffect } from "react";
import { Palette, Copy, Check, RefreshCw, Shuffle } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

const HexColorConverter = () => {
  const { toast } = useToast();
  const [color, setColor] = useState<string>("#6E59A5");
  const [colorFormats, setColorFormats] = useState<ColorFormats>({
    hex: "#6E59A5",
    rgb: "rgb(110, 89, 165)",
    hsl: "hsl(262, 30%, 50%)",
    cmyk: "cmyk(33%, 46%, 0%, 35%)"
  });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("hex");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    convertColor(color);
  }, [color]);

  const hexToRgb = (hex: string) => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return { r: 0, g: 0, b: 0 };
    }

    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    if (r === 0 && g === 0 && b === 0) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    // Normalize RGB values
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;
    
    const k = 1 - Math.max(nr, ng, nb);
    const c = k === 1 ? 0 : Math.round(((1 - nr - k) / (1 - k)) * 100);
    const m = k === 1 ? 0 : Math.round(((1 - ng - k) / (1 - k)) * 100);
    const y = k === 1 ? 0 : Math.round(((1 - nb - k) / (1 - k)) * 100);
    
    return { 
      c, 
      m, 
      y, 
      k: Math.round(k * 100) 
    };
  };

  const convertColor = (input: string) => {
    try {
      let hex = input;
      
      // If it's an RGB or HSL value, convert to HEX
      if (input.startsWith("rgb") || input.startsWith("hsl")) {
        const values = input.match(/\d+/g);
        if (!values || values.length < 3) throw new Error("Invalid RGB/HSL format");
        
        if (input.startsWith("rgb")) {
          const r = parseInt(values[0]);
          const g = parseInt(values[1]);
          const b = parseInt(values[2]);
          
          hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      } else if (!input.startsWith("#")) {
        // Assume it's hex but missing the #
        hex = `#${input}`;
      }
      
      // Standardize hex to have 6 digits
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      
      // Validate hex format
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        throw new Error("Invalid hex color format");
      }
      
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      
      setColorFormats({
        hex: hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
      });
      
      // Add to recent colors if not already in the list
      if (!recentColors.includes(hex)) {
        const newRecentColors = [hex, ...recentColors.slice(0, 7)];
        setRecentColors(newRecentColors);
      }
      
    } catch (error) {
      console.error("Color conversion error:", error);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    
    toast({
      title: "Copied!",
      description: `${format.toUpperCase()} color value copied to clipboard`,
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
    
    toast({
      title: "Random Color",
      description: "Generated a random color",
    });
  };

  return (
    <ToolLayout
      title="Hex Color Converter"
      description="Convert between HEX, RGB, HSL, and CMYK color formats"
      icon={<Palette className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Converter</CardTitle>
            <CardDescription>
              Enter a color in any supported format to convert between color systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                    <TabsTrigger value="cmyk">CMYK</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hex" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="hex-input">Hex Color</Label>
                      <div className="relative">
                        <Input
                          id="hex-input"
                          value={color.startsWith('#') ? color : `#${color}`}
                          onChange={handleColorChange}
                          placeholder="#RRGGBB"
                          className="pr-10"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => copyToClipboard(colorFormats.hex, 'hex')}
                        >
                          {copied === 'hex' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rgb" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="rgb-input">RGB Color</Label>
                      <div className="relative">
                        <Input
                          id="rgb-input"
                          value={colorFormats.rgb}
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="rgb(255, 255, 255)"
                          className="pr-10"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => copyToClipboard(colorFormats.rgb, 'rgb')}
                        >
                          {copied === 'rgb' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hsl" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="hsl-input">HSL Color</Label>
                      <div className="relative">
                        <Input
                          id="hsl-input"
                          value={colorFormats.hsl}
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="hsl(360, 100%, 100%)"
                          className="pr-10"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => copyToClipboard(colorFormats.hsl, 'hsl')}
                        >
                          {copied === 'hsl' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cmyk" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cmyk-input">CMYK Color</Label>
                      <div className="relative">
                        <Input
                          id="cmyk-input"
                          value={colorFormats.cmyk}
                          readOnly
                          className="pr-10"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => copyToClipboard(colorFormats.cmyk, 'cmyk')}
                        >
                          {copied === 'cmyk' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={generateRandomColor}
                    className="flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    Random Color
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setColor("#6E59A5");
                      setActiveTab("hex");
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 min-w-[180px]">
                <div 
                  className="h-40 rounded-lg border"
                  style={{ 
                    backgroundColor: colorFormats.hex,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}
                ></div>
                
                <div className="text-center text-sm text-muted-foreground mt-1">
                  Click any value to copy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Colors</CardTitle>
          </CardHeader>
          <CardContent>
            {recentColors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentColors.map((recentColor, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-md border hover:scale-110 transition-transform"
                    style={{ backgroundColor: recentColor }}
                    onClick={() => {
                      setColor(recentColor);
                      setActiveTab("hex");
                      toast({
                        title: "Color Selected",
                        description: recentColor,
                      });
                    }}
                    title={recentColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Your recently used colors will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default HexColorConverter;
