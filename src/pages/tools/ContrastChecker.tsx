import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Eye, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContrastResult {
  ratio: number;
  AA: boolean;
  AALarge: boolean;
  AAA: boolean;
  AAALarge: boolean;
}

const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [foregroundInput, setForegroundInput] = useState("#FFFFFF");
  const [backgroundInput, setBackgroundInput] = useState("#000000");
  const [contrastResult, setContrastResult] = useState<ContrastResult | null>(null);
  const [sampleText, setSampleText] = useState("Sample Text");
  const [savedPalettes, setSavedPalettes] = useState<{ fg: string; bg: string; name?: string }[]>([]);
  
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  useEffect(() => {
    calculateContrast(foregroundColor, backgroundColor);
    
    // Load saved palettes from localStorage
    const savedPairs = localStorage.getItem("contrast_checker_palettes");
    if (savedPairs) {
      try {
        setSavedPalettes(JSON.parse(savedPairs));
      } catch (e) {
        console.error("Error loading saved palettes:", e);
      }
    }
  }, [foregroundColor, backgroundColor]);
  
  const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForegroundInput(value);
    
    if (hexRegex.test(value)) {
      setForegroundColor(value);
    }
  };
  
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBackgroundInput(value);
    
    if (hexRegex.test(value)) {
      setBackgroundColor(value);
    }
  };
  
  const swapColors = () => {
    setForegroundColor(backgroundColor);
    setBackgroundColor(foregroundColor);
    setForegroundInput(backgroundColor);
    setBackgroundInput(foregroundColor);
  };

  const calculateContrast = (fg: string, bg: string) => {
    // Convert hex to RGB
    const foregroundRGB = hexToRgb(fg);
    const backgroundRGB = hexToRgb(bg);
    
    if (!foregroundRGB || !backgroundRGB) {
      setContrastResult(null);
      return;
    }
    
    // Calculate luminance
    const foregroundLuminance = calculateLuminance(foregroundRGB);
    const backgroundLuminance = calculateLuminance(backgroundRGB);
    
    // Calculate contrast ratio
    const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / 
                  (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    
    const roundedRatio = Math.round(ratio * 100) / 100;
    
    setContrastResult({
      ratio: roundedRatio,
      AA: roundedRatio >= 4.5,
      AALarge: roundedRatio >= 3,
      AAA: roundedRatio >= 7,
      AAALarge: roundedRatio >= 4.5,
    });
  };
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };
  
  const calculateLuminance = (rgb: { r: number; g: number; b: number }) => {
    // Convert sRGB values to linear values
    const linearR = rgb.r / 255 <= 0.03928
      ? rgb.r / 255 / 12.92
      : Math.pow((rgb.r / 255 + 0.055) / 1.055, 2.4);
    const linearG = rgb.g / 255 <= 0.03928
      ? rgb.g / 255 / 12.92
      : Math.pow((rgb.g / 255 + 0.055) / 1.055, 2.4);
    const linearB = rgb.b / 255 <= 0.03928
      ? rgb.b / 255 / 12.92
      : Math.pow((rgb.b / 255 + 0.055) / 1.055, 2.4);
    
    // Calculate luminance
    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  };
  
  const getRandomColors = () => {
    const getRandomHex = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };
    
    const newForeground = getRandomHex();
    const newBackground = getRandomHex();
    
    setForegroundColor(newForeground);
    setBackgroundColor(newBackground);
    setForegroundInput(newForeground);
    setBackgroundInput(newBackground);
  };
  
  const savePalette = () => {
    const newPalettes = [...savedPalettes, { fg: foregroundColor, bg: backgroundColor }];
    setSavedPalettes(newPalettes);
    localStorage.setItem("contrast_checker_palettes", JSON.stringify(newPalettes));
    toast.success("Color palette saved");
  };
  
  const loadPalette = (fg: string, bg: string) => {
    setForegroundColor(fg);
    setBackgroundColor(bg);
    setForegroundInput(fg);
    setBackgroundInput(bg);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };
  
  const getContrastRatingClass = () => {
    if (!contrastResult) return "bg-gray-500";
    
    if (contrastResult.ratio >= 7) return "bg-green-500";
    if (contrastResult.ratio >= 4.5) return "bg-yellow-500";
    if (contrastResult.ratio >= 3) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <ToolLayout
      title="Contrast Checker"
      description="Check color contrast for web accessibility compliance"
      icon={<Eye className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="foregroundColor">Text Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded border border-border" 
                        style={{ backgroundColor: foregroundColor }}
                      />
                      <Input
                        id="foregroundColor"
                        type="text"
                        value={foregroundInput}
                        onChange={handleForegroundChange}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded border border-border" 
                        style={{ backgroundColor: backgroundColor }}
                      />
                      <Input
                        id="backgroundColor"
                        type="text"
                        value={backgroundInput}
                        onChange={handleBackgroundChange}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={swapColors} size="sm" variant="outline">
                      Swap Colors
                    </Button>
                    <Button onClick={getRandomColors} size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" /> Random
                    </Button>
                    <Button onClick={savePalette} size="sm">
                      Save Palette
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sampleText">Sample Text</Label>
                    <Input
                      id="sampleText"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                    />
                  </div>
                  
                  <div 
                    className="p-6 rounded-md min-h-[150px] flex flex-col items-center justify-center text-center"
                    style={{ 
                      backgroundColor: backgroundColor,
                      color: foregroundColor,
                    }}
                  >
                    <h2 className="text-2xl font-bold mb-2">{sampleText}</h2>
                    <p className="text-sm">This is how your text will appear with the selected colors</p>
                  </div>
                </div>
              </div>
            </div>
            
            {contrastResult && (
              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-16 h-16 ${getContrastRatingClass()} rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4`}>
                    {contrastResult.ratio}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Contrast Ratio: {contrastResult.ratio}:1</h3>
                    <p className="text-muted-foreground">
                      {contrastResult.AAA ? 
                        "Great! This contrast meets AAA standards." : 
                        contrastResult.AA ? 
                        "Good. This contrast meets AA standards." : 
                        contrastResult.AALarge ? 
                        "This contrast is acceptable for large text only." : 
                        "Poor contrast. This does not meet accessibility guidelines."}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">WCAG 2.1 AA</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${contrastResult.AA ? "bg-green-500" : "bg-red-500"}`}>
                          {contrastResult.AA ? <Check className="h-3 w-3 text-white" /> : ""}
                        </div>
                        <span>Normal Text ({contrastResult.AA ? "Pass" : "Fail"})</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${contrastResult.AALarge ? "bg-green-500" : "bg-red-500"}`}>
                          {contrastResult.AALarge ? <Check className="h-3 w-3 text-white" /> : ""}
                        </div>
                        <span>Large Text ({contrastResult.AALarge ? "Pass" : "Fail"})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">WCAG 2.1 AAA</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${contrastResult.AAA ? "bg-green-500" : "bg-red-500"}`}>
                          {contrastResult.AAA ? <Check className="h-3 w-3 text-white" /> : ""}
                        </div>
                        <span>Normal Text ({contrastResult.AAA ? "Pass" : "Fail"})</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${contrastResult.AAALarge ? "bg-green-500" : "bg-red-500"}`}>
                          {contrastResult.AAALarge ? <Check className="h-3 w-3 text-white" /> : ""}
                        </div>
                        <span>Large Text ({contrastResult.AAALarge ? "Pass" : "Fail"})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">CSS Values</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[200px]">
                      <code className="block bg-muted/30 p-2 rounded text-xs font-mono mb-1">
                        color: {foregroundColor};
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => copyToClipboard(`color: ${foregroundColor};`)}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy CSS
                      </Button>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <code className="block bg-muted/30 p-2 rounded text-xs font-mono mb-1">
                        background-color: {backgroundColor};
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => copyToClipboard(`background-color: ${backgroundColor};`)}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy CSS
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Saved Palettes</h3>
              {savedPalettes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No palettes saved yet</p>
                  <p className="text-sm">Save color combinations you want to reference later</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPalettes.map((palette, index) => (
                    <div 
                      key={index} 
                      className="border border-border rounded-md p-3 flex items-center cursor-pointer hover:border-primary transition-colors duration-200"
                      onClick={() => loadPalette(palette.fg, palette.bg)}
                    >
                      <div className="h-8 w-8 rounded mr-3" style={{ backgroundColor: palette.bg }}></div>
                      <div className="h-8 w-8 rounded mr-3" style={{ backgroundColor: palette.fg }}></div>
                      <div className="flex-grow">
                        <div className="text-sm font-medium">{palette.name || `Palette ${index + 1}`}</div>
                        <div className="text-xs text-muted-foreground">{palette.fg} / {palette.bg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Accessibility Tips</h3>
              <div className="space-y-3 text-sm">
                <p><strong>WCAG 2.1 Guidelines:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>AA requires a contrast ratio of at least 4.5:1 for normal text</li>
                  <li>AA requires a contrast ratio of at least 3:1 for large text</li>
                  <li>AAA requires a contrast ratio of at least 7:1 for normal text</li>
                  <li>AAA requires a contrast ratio of at least 4.5:1 for large text</li>
                </ul>
                <p className="mt-4"><strong>Large Text is defined as:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>14 point (typically 18.66px) and bold or larger, or</li>
                  <li>18 point (typically 24px) or larger</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ContrastChecker;
