
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, RefreshCw, Hash, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// UUID version options
const uuidVersions = [
  { value: "v4", label: "Version 4 (random)", description: "Random UUID, most commonly used" },
  { value: "v1", label: "Version 1 (time-based)", description: "Based on timestamp and MAC address" },
];

const UUIDGenerator = () => {
  const { toast } = useToast();
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState("v4");
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState("standard"); // standard, uppercase, no-hyphens
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate UUIDs on component mount
  useEffect(() => {
    generateUUIDs();
  }, []);

  // Reset copied status after delay
  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  // Generate v4 UUID (random)
  const generateUUIDv4 = () => {
    return crypto.randomUUID();
  };

  // Generate v1 UUID (time-based)
  const generateUUIDv1 = () => {
    // This is a simple implementation of UUID v1 for demonstration
    // In a real app, you'd use a proper library for v1 UUIDs
    const now = new Date();
    const timestamp = now.getTime();
    const clockSeq = Math.floor(Math.random() * 16384);
    const node = Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    ).join('');
    
    // Format according to UUID v1 specification
    const timeHi = ((timestamp / 4294967296) * 10000 + 0x01b21dd213814000) & 0xffffffff;
    const timeLo = timestamp & 0xffffffff;
    
    const uuid = [
      timeLo.toString(16).padStart(8, '0'),
      (timeHi & 0xffff).toString(16).padStart(4, '0'),
      (((timeHi >> 16) & 0xfff) | 0x1000).toString(16).padStart(4, '0'),
      ((clockSeq & 0x3fff) | 0x8000).toString(16).padStart(4, '0'),
      node
    ].join('-');
    
    return uuid;
  };

  // Generate UUIDs based on selected version and quantity
  const generateUUIDs = () => {
    const newUUIDs = Array.from({ length: quantity }, () => {
      const rawUuid = selectedVersion === "v4" ? generateUUIDv4() : generateUUIDv1();
      return formatUUID(rawUuid);
    });
    
    setGeneratedUUIDs(newUUIDs);
    
    toast({
      title: "UUIDs Generated",
      description: `Generated ${quantity} UUID${quantity > 1 ? 's' : ''}`
    });
  };

  // Format UUID based on user preference
  const formatUUID = (uuid: string) => {
    switch (format) {
      case "uppercase":
        return uuid.toUpperCase();
      case "no-hyphens":
        return uuid.replace(/-/g, "");
      default:
        return uuid;
    }
  };

  // Copy UUID to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index);
        toast({
          title: "Copied to clipboard",
          description: text
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the UUID to clipboard",
          variant: "destructive"
        });
      }
    );
  };

  // Copy all UUIDs to clipboard
  const copyAllToClipboard = () => {
    const allUUIDs = generatedUUIDs.join('\n');
    navigator.clipboard.writeText(allUUIDs).then(
      () => {
        toast({
          title: "All UUIDs copied",
          description: `Copied ${generatedUUIDs.length} UUID${generatedUUIDs.length > 1 ? 's' : ''} to clipboard`
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy UUIDs to clipboard",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate secure UUIDs for development"
      icon={<Hash className="h-6 w-6 text-primary" />}
    >
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* UUID Version */}
            <div className="space-y-2">
              <Label>UUID Version</Label>
              <div className="space-y-2">
                {uuidVersions.map((version) => (
                  <div key={version.value} className="flex items-start">
                    <input
                      type="radio"
                      id={`version-${version.value}`}
                      name="uuidVersion"
                      value={version.value}
                      checked={selectedVersion === version.value}
                      onChange={() => setSelectedVersion(version.value)}
                      className="mt-1 mr-2"
                    />
                    <Label htmlFor={`version-${version.value}`} className="cursor-pointer">
                      <div>{version.label}</div>
                      <div className="text-xs text-muted-foreground">{version.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* UUID Format */}
            <div className="space-y-2">
              <Label>Format</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-standard"
                    name="format"
                    value="standard"
                    checked={format === "standard"}
                    onChange={() => setFormat("standard")}
                    className="mr-2"
                  />
                  <Label htmlFor="format-standard" className="cursor-pointer">
                    Standard (e.g., 550e8400-e29b-41d4-a716-446655440000)
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-uppercase"
                    name="format"
                    value="uppercase"
                    checked={format === "uppercase"}
                    onChange={() => setFormat("uppercase")}
                    className="mr-2"
                  />
                  <Label htmlFor="format-uppercase" className="cursor-pointer">
                    Uppercase (e.g., 550E8400-E29B-41D4-A716-446655440000)
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-no-hyphens"
                    name="format"
                    value="no-hyphens"
                    checked={format === "no-hyphens"}
                    onChange={() => setFormat("no-hyphens")}
                    className="mr-2"
                  />
                  <Label htmlFor="format-no-hyphens" className="cursor-pointer">
                    No hyphens (e.g., 550e8400e29b41d4a716446655440000)
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="max-w-[100px]"
                />
                <Button onClick={generateUUIDs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Generate up to 100 UUIDs at once
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">Generated UUIDs</h2>
        {generatedUUIDs.length > 1 && (
          <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
            <Clipboard className="h-4 w-4 mr-2" />
            Copy All
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {generatedUUIDs.map((uuid, index) => (
          <div key={index} className="flex items-center p-2 bg-muted/20 rounded border border-border hover:border-primary/50 transition-colors">
            <code className="flex-grow font-mono text-sm overflow-x-auto p-2">{uuid}</code>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => copyToClipboard(uuid, index)}
              className="flex-shrink-0"
            >
              {copiedIndex === index ? 
                <Check className="h-4 w-4 text-green-500" /> : 
                <Copy className="h-4 w-4" />
              }
            </Button>
          </div>
        ))}
      </div>
      
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">About UUIDs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Universally Unique Identifiers (UUIDs) are 128-bit identifiers that are guaranteed to be unique across all space and time.
            They are commonly used in software development for creating unique identifiers without a centralized authority.
          </p>
          
          <h4 className="font-medium mb-1">Common Uses:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
            <li>Database primary keys</li>
            <li>Transaction IDs</li>
            <li>Session identifiers</li>
            <li>Distributed systems coordination</li>
            <li>Content addressing</li>
          </ul>
          
          <h4 className="font-medium mb-1">UUID Versions:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li><strong>Version 1:</strong> Time-based UUID using MAC address</li>
            <li><strong>Version 4:</strong> Random UUID (most commonly used)</li>
          </ul>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default UUIDGenerator;
