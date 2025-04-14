
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Play, Pause, Copy, Check, RotateCcw, SquareCode, Plus, Minus, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Keyframe {
  id: string;
  position: number;
  properties: { [key: string]: string };
}

interface Animation {
  name: string;
  duration: number;
  timingFunction: string;
  delay: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
  keyframes: Keyframe[];
}

const CssAnimationGenerator: React.FC = () => {
  const defaultKeyframes: Keyframe[] = [
    { id: "1", position: 0, properties: { transform: "scale(1)", opacity: "1" } },
    { id: "2", position: 100, properties: { transform: "scale(1.5)", opacity: "0" } },
  ];
  
  const defaultAnimation: Animation = {
    name: "my-animation",
    duration: 1,
    timingFunction: "ease",
    delay: 0,
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "forwards",
    keyframes: defaultKeyframes,
  };
  
  // State management
  const [animation, setAnimation] = useLocalStorage<Animation>("animation_generator", defaultAnimation);
  const [previewActive, setPreviewActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string>("1");
  
  // Common CSS properties
  const commonProperties = [
    { label: "Transform", value: "transform" },
    { label: "Opacity", value: "opacity" },
    { label: "Background Color", value: "backgroundColor" },
    { label: "Width", value: "width" },
    { label: "Height", value: "height" },
    { label: "Border Radius", value: "borderRadius" },
    { label: "Rotate", value: "rotate" },
    { label: "Scale", value: "scale" },
    { label: "Translate", value: "translate" },
    { label: "Color", value: "color" },
    { label: "Font Size", value: "fontSize" },
  ];
  
  // Common transform values
  const transformPresets = {
    scale: ["scale(1)", "scale(1.5)", "scale(2)", "scale(0.5)"],
    rotate: ["rotate(0deg)", "rotate(45deg)", "rotate(90deg)", "rotate(180deg)", "rotate(360deg)"],
    translate: ["translate(0, 0)", "translate(20px, 0)", "translate(0, 20px)", "translate(20px, 20px)"],
  };
  
  // Timing function presets
  const timingFunctions = [
    "ease", "linear", "ease-in", "ease-out", "ease-in-out", 
    "cubic-bezier(0.25, 0.1, 0.25, 1)",
    "cubic-bezier(0.42, 0, 1, 1)",
    "cubic-bezier(0, 0, 0.58, 1)",
    "cubic-bezier(0.42, 0, 0.58, 1)",
  ];
  
  // Update animation property
  const updateAnimation = (key: keyof Animation, value: any) => {
    setAnimation({ ...animation, [key]: value });
  };
  
  // Add a new keyframe
  const addKeyframe = () => {
    // Find a position between existing keyframes
    const positions = animation.keyframes.map(kf => kf.position).sort((a, b) => a - b);
    
    // Find the first gap or append at the end
    let newPosition = 50;
    for (let i = 0; i < positions.length - 1; i++) {
      if (positions[i + 1] - positions[i] > 10) {
        newPosition = Math.floor((positions[i] + positions[i + 1]) / 2);
        break;
      }
    }
    
    const newId = (Math.max(...animation.keyframes.map(kf => parseInt(kf.id))) + 1).toString();
    const newKeyframe: Keyframe = {
      id: newId,
      position: newPosition,
      properties: { transform: "scale(1.25)", opacity: "0.5" },
    };
    
    const updatedKeyframes = [...animation.keyframes, newKeyframe].sort((a, b) => a.position - b.position);
    updateAnimation("keyframes", updatedKeyframes);
    setSelectedKeyframeId(newId);
  };
  
  // Remove a keyframe
  const removeKeyframe = (id: string) => {
    if (animation.keyframes.length <= 2) {
      toast({
        title: "Cannot remove keyframe",
        description: "You need at least two keyframes for an animation",
        variant: "destructive",
      });
      return;
    }
    
    const updatedKeyframes = animation.keyframes.filter(kf => kf.id !== id);
    updateAnimation("keyframes", updatedKeyframes);
    
    // Update selected keyframe if the removed one was selected
    if (selectedKeyframeId === id) {
      setSelectedKeyframeId(updatedKeyframes[0].id);
    }
  };
  
  // Update keyframe position
  const updateKeyframePosition = (id: string, position: number) => {
    const updatedKeyframes = animation.keyframes.map(kf => 
      kf.id === id ? { ...kf, position } : kf
    ).sort((a, b) => a.position - b.position);
    
    updateAnimation("keyframes", updatedKeyframes);
  };
  
  // Add a property to a keyframe
  const addPropertyToKeyframe = (keyframeId: string, property: string, value: string = "") => {
    const updatedKeyframes = animation.keyframes.map(kf => {
      if (kf.id === keyframeId) {
        // Set a default value based on the property
        let defaultValue = "";
        switch (property) {
          case "transform":
            defaultValue = "scale(1)";
            break;
          case "opacity":
            defaultValue = "1";
            break;
          case "backgroundColor":
            defaultValue = "#8b5cf6";
            break;
          case "width":
          case "height":
            defaultValue = "100px";
            break;
          case "borderRadius":
            defaultValue = "0px";
            break;
          case "rotate":
            defaultValue = "rotate(0deg)";
            break;
          case "scale":
            defaultValue = "scale(1)";
            break;
          case "translate":
            defaultValue = "translate(0, 0)";
            break;
          case "color":
            defaultValue = "#ffffff";
            break;
          case "fontSize":
            defaultValue = "16px";
            break;
          default:
            defaultValue = "";
        }
        
        return { 
          ...kf, 
          properties: { 
            ...kf.properties, 
            [property]: value || defaultValue 
          } 
        };
      }
      return kf;
    });
    
    updateAnimation("keyframes", updatedKeyframes);
  };
  
  // Remove a property from a keyframe
  const removePropertyFromKeyframe = (keyframeId: string, property: string) => {
    const updatedKeyframes = animation.keyframes.map(kf => {
      if (kf.id === keyframeId) {
        const newProperties = { ...kf.properties };
        delete newProperties[property];
        return { ...kf, properties: newProperties };
      }
      return kf;
    });
    
    updateAnimation("keyframes", updatedKeyframes);
  };
  
  // Update a property value
  const updatePropertyValue = (keyframeId: string, property: string, value: string) => {
    const updatedKeyframes = animation.keyframes.map(kf => {
      if (kf.id === keyframeId) {
        return { 
          ...kf, 
          properties: { ...kf.properties, [property]: value } 
        };
      }
      return kf;
    });
    
    updateAnimation("keyframes", updatedKeyframes);
  };
  
  // Get the selected keyframe
  const getSelectedKeyframe = () => {
    return animation.keyframes.find(kf => kf.id === selectedKeyframeId) || animation.keyframes[0];
  };
  
  // Generate CSS code
  const generateCSS = () => {
    const keyframesCSS = `@keyframes ${animation.name} {
${animation.keyframes
  .sort((a, b) => a.position - b.position)
  .map(kf => {
    const propertiesCSS = Object.entries(kf.properties)
      .map(([prop, value]) => {
        // Convert camelCase properties to kebab-case
        const kebabProp = prop.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        return `  ${kebabProp}: ${value};`;
      }).join('\n  ');
    
    return `  ${kf.position}% {
  ${propertiesCSS}
  }`;
  }).join('\n')}
}

.animated-element {
  animation-name: ${animation.name};
  animation-duration: ${animation.duration}s;
  animation-timing-function: ${animation.timingFunction};
  animation-delay: ${animation.delay}s;
  animation-iteration-count: ${animation.iterationCount};
  animation-direction: ${animation.direction};
  animation-fill-mode: ${animation.fillMode};
}

/* Shorthand version */
.animated-element-shorthand {
  animation: ${animation.name} ${animation.duration}s ${animation.timingFunction} ${animation.delay}s ${animation.iterationCount} ${animation.direction} ${animation.fillMode};
}`;

    return keyframesCSS;
  };
  
  // Copy CSS to clipboard
  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "CSS animation code has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Reset to default animation
  const resetAnimation = () => {
    setAnimation(defaultAnimation);
    setSelectedKeyframeId("1");
  };
  
  // Toggle preview animation
  const togglePreview = () => {
    setPreviewActive(!previewActive);
  };
  
  return (
    <ToolLayout
      title="CSS Animation Generator"
      description="Create custom CSS animations with an interactive editor"
      icon={<SquareCode className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel: Animation settings */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Animation Settings</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="animation-name">Animation Name</Label>
                    <Input
                      id="animation-name"
                      value={animation.name}
                      onChange={(e) => updateAnimation("name", e.target.value)}
                      placeholder="my-animation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="animation-duration">Duration (seconds)</Label>
                      <span className="text-sm text-muted-foreground">{animation.duration}s</span>
                    </div>
                    <Slider
                      id="animation-duration"
                      value={[animation.duration]}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onValueChange={(val) => updateAnimation("duration", val[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="animation-timing">Timing Function</Label>
                    <Select
                      value={animation.timingFunction}
                      onValueChange={(val) => updateAnimation("timingFunction", val)}
                    >
                      <SelectTrigger id="animation-timing">
                        <SelectValue placeholder="Select timing function" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Basic</SelectLabel>
                          <SelectItem value="ease">ease</SelectItem>
                          <SelectItem value="linear">linear</SelectItem>
                          <SelectItem value="ease-in">ease-in</SelectItem>
                          <SelectItem value="ease-out">ease-out</SelectItem>
                          <SelectItem value="ease-in-out">ease-in-out</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Advanced</SelectLabel>
                          <SelectItem value="cubic-bezier(0.25, 0.1, 0.25, 1)">
                            cubic-bezier (ease)
                          </SelectItem>
                          <SelectItem value="cubic-bezier(0.42, 0, 1, 1)">
                            cubic-bezier (ease-in)
                          </SelectItem>
                          <SelectItem value="cubic-bezier(0, 0, 0.58, 1)">
                            cubic-bezier (ease-out)
                          </SelectItem>
                          <SelectItem value="cubic-bezier(0.42, 0, 0.58, 1)">
                            cubic-bezier (ease-in-out)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="animation-delay">Delay (seconds)</Label>
                      <span className="text-sm text-muted-foreground">{animation.delay}s</span>
                    </div>
                    <Slider
                      id="animation-delay"
                      value={[animation.delay]}
                      min={0}
                      max={5}
                      step={0.1}
                      onValueChange={(val) => updateAnimation("delay", val[0])}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animation-iteration">Iteration Count</Label>
                      <Select
                        value={animation.iterationCount}
                        onValueChange={(val) => updateAnimation("iterationCount", val)}
                      >
                        <SelectTrigger id="animation-iteration">
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infinite">infinite</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="animation-direction">Direction</Label>
                      <Select
                        value={animation.direction}
                        onValueChange={(val) => updateAnimation("direction", val)}
                      >
                        <SelectTrigger id="animation-direction">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">normal</SelectItem>
                          <SelectItem value="reverse">reverse</SelectItem>
                          <SelectItem value="alternate">alternate</SelectItem>
                          <SelectItem value="alternate-reverse">alternate-reverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="animation-fill-mode">Fill Mode</Label>
                    <Select
                      value={animation.fillMode}
                      onValueChange={(val) => updateAnimation("fillMode", val)}
                    >
                      <SelectTrigger id="animation-fill-mode">
                        <SelectValue placeholder="Select fill mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forwards">forwards</SelectItem>
                        <SelectItem value="backwards">backwards</SelectItem>
                        <SelectItem value="both">both</SelectItem>
                        <SelectItem value="none">none</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={resetAnimation} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle panel: Keyframes */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Keyframes</h3>
                  <Button onClick={addKeyframe} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Keyframe
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {animation.keyframes
                    .sort((a, b) => a.position - b.position)
                    .map((keyframe) => (
                    <div
                      key={keyframe.id}
                      className={`flex items-center p-3 rounded border cursor-pointer ${
                        selectedKeyframeId === keyframe.id
                          ? "border-primary bg-primary/10"
                          : "border-muted/50 hover:border-muted/80"
                      }`}
                      onClick={() => setSelectedKeyframeId(keyframe.id)}
                    >
                      <div className="w-14 font-mono text-sm">{keyframe.position}%</div>
                      <div className="flex-1 ml-2">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(keyframe.properties).map(([prop, value]) => (
                            <span 
                              key={prop} 
                              className="inline-block bg-muted/30 text-xs px-2 py-1 rounded font-mono"
                              title={`${prop}: ${value}`}
                            >
                              {prop}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeKeyframe(keyframe.id);
                          }}
                          disabled={animation.keyframes.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Selected keyframe properties */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Keyframe Properties</h3>
                  <span className="text-sm bg-muted/50 px-2 py-1 rounded">
                    Keyframe at {getSelectedKeyframe()?.position}%
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="keyframe-position">Position (%)</Label>
                      <span className="text-sm text-muted-foreground">{getSelectedKeyframe()?.position}%</span>
                    </div>
                    <Slider
                      id="keyframe-position"
                      value={[getSelectedKeyframe()?.position || 0]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => updateKeyframePosition(selectedKeyframeId, val[0])}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label className="text-sm">CSS Properties</Label>
                      <Select
                        onValueChange={(value) => {
                          if (value === "") return;
                          addPropertyToKeyframe(selectedKeyframeId, value);
                        }}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Add property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Common Properties</SelectLabel>
                            {commonProperties.map((prop) => (
                              <SelectItem key={prop.value} value={prop.value}>
                                {prop.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {getSelectedKeyframe() && (
                      <div className="space-y-3">
                        {Object.entries(getSelectedKeyframe()?.properties || {}).map(([property, value]) => (
                          <div key={property} className="flex items-end gap-2">
                            <div className="flex-1">
                              <Label htmlFor={`property-${property}`} className="text-xs mb-1 block">
                                {property}
                              </Label>
                              <Input
                                id={`property-${property}`}
                                value={value}
                                onChange={(e) => updatePropertyValue(selectedKeyframeId, property, e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            
                            {/* Add property specific presets if applicable */}
                            {property === "transform" && (
                              <Select
                                value=""
                                onValueChange={(v) => updatePropertyValue(selectedKeyframeId, property, v)}
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                  <SelectValue placeholder="Presets" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Scale</SelectLabel>
                                    {transformPresets.scale.map((preset) => (
                                      <SelectItem key={preset} value={preset}>
                                        {preset}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                  <SelectGroup>
                                    <SelectLabel>Rotate</SelectLabel>
                                    {transformPresets.rotate.map((preset) => (
                                      <SelectItem key={preset} value={preset}>
                                        {preset}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                  <SelectGroup>
                                    <SelectLabel>Translate</SelectLabel>
                                    {transformPresets.translate.map((preset) => (
                                      <SelectItem key={preset} value={preset}>
                                        {preset}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                            
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => removePropertyFromKeyframe(selectedKeyframeId, property)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right panel: Preview and code */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <Button onClick={togglePreview} variant="outline" size="sm">
                    {previewActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {previewActive ? "Pause" : "Play"}
                  </Button>
                </div>
                
                <div className="border border-muted rounded-md bg-muted/30 h-[250px] flex items-center justify-center">
                  <style>
                    {`
                      @keyframes preview-${animation.name} {
                        ${animation.keyframes
                          .sort((a, b) => a.position - b.position)
                          .map(kf => {
                            const propertiesCSS = Object.entries(kf.properties)
                              .map(([prop, value]) => {
                                // Convert camelCase to kebab-case
                                const kebabProp = prop.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
                                return `${kebabProp}: ${value};`;
                              }).join(' ');
                            
                            return `${kf.position}% { ${propertiesCSS} }`;
                          }).join(' ')}
                      }
                      
                      .preview-element {
                        animation-name: preview-${animation.name};
                        animation-duration: ${animation.duration}s;
                        animation-timing-function: ${animation.timingFunction};
                        animation-delay: ${animation.delay}s;
                        animation-iteration-count: ${animation.iterationCount};
                        animation-direction: ${animation.direction};
                        animation-fill-mode: ${animation.fillMode};
                        ${previewActive ? '' : 'animation-play-state: paused;'}
                      }
                    `}
                  </style>
                  
                  <div 
                    className="preview-element w-24 h-24 bg-violet-500 flex items-center justify-center text-white rounded"
                  >
                    Element
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated CSS</h3>
                  <Button onClick={copyCSS} variant="outline" size="sm">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy CSS"}
                  </Button>
                </div>
                
                <Textarea
                  value={generateCSS()}
                  readOnly
                  className="h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CssAnimationGenerator;
