
import React, { useEffect } from 'react';
import { RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQRCode } from './QRCodeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const QR_FRAME_STYLES = {
  "none": { name: "No Frame", value: "none" },
  "square": { name: "Square Frame", value: "square" },
  "rounded": { name: "Rounded Frame", value: "rounded" },
  "dot": { name: "Dot Pattern", value: "dot" },
  "circle": { name: "Circle Frame", value: "circle" },
};

export const QRCodeCustomizer = () => {
  const { settings, updateSettings, generateQRCode } = useQRCode();
  const [isMobile, setIsMobile] = React.useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Ensure size doesn't exceed limits when device type changes
  useEffect(() => {
    if (isMobile && settings.size > 240) {
      updateSettings({ size: 240 });
    }
  }, [isMobile, settings.size, updateSettings]);
  
  return (
    <Card className="bg-black/50 border-zinc-800">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Customization</h3>
        
        <Tabs defaultValue="style" className="w-full mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-size" className="flex items-center">
                QR Code Size: {settings.size}px
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Maximum size: 240px on mobile, 300px on desktop
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="qr-size"
                  type="range"
                  min="120"
                  max={isMobile ? "240" : "300"}
                  step="10"
                  value={settings.size}
                  onChange={(e) => updateSettings({ size: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qr-color">QR Code Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-md border" 
                    style={{ backgroundColor: settings.qrColor }} 
                  />
                  <Input
                    id="qr-color"
                    type="color"
                    value={settings.qrColor}
                    onChange={(e) => updateSettings({ qrColor: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-md border" 
                    style={{ backgroundColor: settings.bgColor }} 
                  />
                  <Input
                    id="bg-color"
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => updateSettings({ bgColor: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frame-style">Frame Style</Label>
              <Select 
                value={settings.frameStyle} 
                onValueChange={(value) => updateSettings({ frameStyle: value as any })}
              >
                <SelectTrigger id="frame-style">
                  <SelectValue placeholder="Select a frame style" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QR_FRAME_STYLES).map(([key, style]) => (
                    <SelectItem key={key} value={style.value}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="corner-style">Corner Style</Label>
              <Select 
                value={settings.cornerStyle} 
                onValueChange={(value) => updateSettings({ cornerStyle: value as any })}
              >
                <SelectTrigger id="corner-style">
                  <SelectValue placeholder="Select a corner style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="error-correction" className="flex items-center">
                Error Correction Level
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Higher levels provide better error correction but make the QR code more complex.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={settings.errorCorrectionLevel} 
                onValueChange={(value) => updateSettings({ errorCorrectionLevel: value as any })}
              >
                <SelectTrigger id="error-correction">
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button onClick={generateQRCode} className="w-full bg-primary/80 hover:bg-primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
      </CardContent>
    </Card>
  );
};
