
import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Palette, Upload, Copy, Image as ImageIcon, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Color {
  hex: string;
  rgb: string;
  name?: string;
}

const ColorPaletteGenerator = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
        extractColorsFromImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const extractColorsFromImage = (imageSrc: string) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        toast.error("Canvas context not supported");
        return;
      }
      
      // Scale down for performance
      const scaleFactor = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get image data and pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      
      // Collect and quantize colors
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < pixelData.length; i += 4) {
        // Skip transparent pixels
        if (pixelData[i + 3] < 128) continue;
        
        // Quantize colors (reduce precision to group similar colors)
        const r = Math.round(pixelData[i] / 16) * 16;
        const g = Math.round(pixelData[i + 1] / 16) * 16;
        const b = Math.round(pixelData[i + 2] / 16) * 16;
        
        const hex = rgbToHex(r, g, b);
        if (colorMap[hex]) {
          colorMap[hex]++;
        } else {
          colorMap[hex] = 1;
        }
      }
      
      // Get top colors, sorted by frequency
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex]) => ({
          hex,
          rgb: hexToRgb(hex)
        }));
      
      setColors(sortedColors);
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "rgb(0, 0, 0)";
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const generateRandomPalette = () => {
    const randomColors: Color[] = [];
    
    // Generate a base random color
    const hue = Math.floor(Math.random() * 360);
    
    // Generate a palette using color theory
    // Base color
    randomColors.push(hsvToColor(hue, 70, 90));
    
    // Complementary (opposite on the color wheel)
    randomColors.push(hsvToColor((hue + 180) % 360, 65, 85));
    
    // Analogous (adjacent on the color wheel)
    randomColors.push(hsvToColor((hue + 30) % 360, 60, 95));
    randomColors.push(hsvToColor((hue - 30 + 360) % 360, 60, 95));
    
    // Split complementary
    randomColors.push(hsvToColor((hue + 150) % 360, 50, 80));
    randomColors.push(hsvToColor((hue + 210) % 360, 50, 80));
    
    setColors(randomColors);
    setImagePreview(null);
  };

  const hsvToColor = (h: number, s: number, v: number): Color => {
    s /= 100;
    v /= 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    const hex = rgbToHex(r, g, b);
    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`
    };
  };

  const exportPalette = () => {
    if (colors.length === 0) return;
    
    const paletteText = colors.map(color => `${color.hex} - ${color.rgb}`).join('\n');
    
    const blob = new Blob([paletteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Palette exported successfully");
  };

  const getContrastTextColor = (hexColor: string) => {
    // Remove # if exists
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Extract beautiful color schemes from images or generate random palettes"
      icon={<Palette className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Upload Image</h3>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">
                    Click to upload or drag and drop an image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Or Generate Random Palette</h3>
                <div className="flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Don't have an image? Generate a random color palette based on color theory principles.
                  </p>
                  <Button 
                    onClick={generateRandomPalette} 
                    className="mt-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Random Palette
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {imagePreview && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Source Image</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Source"
                  className="max-h-64 mx-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {colors.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Color Palette</h3>
                <Button variant="outline" onClick={exportPalette}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Palette
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {colors.map((color, index) => (
                  <div key={index} className="flex flex-col">
                    <div 
                      className="aspect-square rounded-md shadow-md cursor-pointer transition-transform hover:scale-105"
                      style={{ 
                        backgroundColor: color.hex,
                        color: getContrastTextColor(color.hex)
                      }}
                      onClick={() => copyToClipboard(color.hex)}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-2">
                        <Copy size={16} className="opacity-70 mb-1" />
                        <span className="text-xs font-mono">{color.hex}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <button 
                        className="text-xs font-mono text-muted-foreground hover:text-foreground"
                        onClick={() => copyToClipboard(color.rgb)}
                      >
                        {color.rgb}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="font-medium mb-2">Preview</h4>
                <div 
                  className="p-6 rounded-md"
                  style={{ background: colors[5]?.hex || colors[0]?.hex }}
                >
                  <div 
                    className="p-6 rounded-md"
                    style={{ background: colors[1]?.hex }}
                  >
                    <div className="text-center">
                      <h3 
                        className="text-xl font-bold mb-2"
                        style={{ color: colors[2]?.hex }}
                      >
                        Sample Heading
                      </h3>
                      <p 
                        className="mb-4"
                        style={{ color: colors[3]?.hex }}
                      >
                        This is how your color scheme might look in a design.
                      </p>
                      <button 
                        className={cn("px-4 py-2 rounded-md", "text-sm font-medium")}
                        style={{ 
                          background: colors[4]?.hex,
                          color: getContrastTextColor(colors[4]?.hex || '#000000')
                        }}
                      >
                        Sample Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">About Color Palettes</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Color palettes are collections of colors that work well together in design projects.
            They help create visual harmony and consistent branding across applications.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Click on any color swatch to copy its HEX value to your clipboard.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ColorPaletteGenerator;
