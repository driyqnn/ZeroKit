
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Code, Copy, ArrowDownUp, Check, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

const HtmlEntityConverter: React.FC = () => {
  const [inputText, setInputText] = useLocalStorage<string>("html_entity_input", "");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useLocalStorage<"encode" | "decode">("html_entity_mode", "encode");
  const [copied, setCopied] = useState(false);
  const [autoConvert, setAutoConvert] = useLocalStorage<boolean>("html_entity_auto_convert", true);
  const [namedEntities, setNamedEntities] = useLocalStorage<boolean>("html_entity_named", true);
  
  // Common HTML named entities
  const namedEntityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
    '¢': '&cent;',
    '£': '&pound;',
    '¥': '&yen;',
    '€': '&euro;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    ' ': '&nbsp;',
    '§': '&sect;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
  };
  
  const numericEntityMap: Record<string, string> = {};
  Object.keys(namedEntityMap).forEach(key => {
    numericEntityMap[key] = `&#${key.charCodeAt(0)};`;
  });
  
  // Add more characters for numeric encoding (basic Latin + common symbols)
  for (let i = 32; i <= 255; i++) {
    const char = String.fromCharCode(i);
    if (!numericEntityMap[char]) {
      numericEntityMap[char] = `&#${i};`;
    }
  }
  
  // Reverse maps for decoding
  const reverseNamedEntityMap: Record<string, string> = {};
  Object.entries(namedEntityMap).forEach(([key, value]) => {
    reverseNamedEntityMap[value] = key;
  });
  
  // Encode text to HTML entities
  const encodeText = (text: string): string => {
    const entityMap = namedEntities ? namedEntityMap : numericEntityMap;
    
    return text.split('').map(char => {
      return entityMap[char] || char;
    }).join('');
  };
  
  // Decode HTML entities to text
  const decodeText = (text: string): string => {
    // Handle named entities
    let result = text.replace(/&[a-zA-Z0-9]+;/g, match => {
      return reverseNamedEntityMap[match] || match;
    });
    
    // Handle numeric entities
    result = result.replace(/&#(\d+);/g, (_, code) => {
      return String.fromCharCode(Number(code));
    });
    
    // Handle hex entities
    result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    return result;
  };
  
  // Process the text based on the current mode
  const processText = () => {
    if (inputText.trim() === "") {
      setOutputText("");
      return;
    }
    
    try {
      if (mode === "encode") {
        setOutputText(encodeText(inputText));
      } else {
        setOutputText(decodeText(inputText));
      }
    } catch (error) {
      console.error("Error processing text:", error);
      toast({
        title: "Error",
        description: "There was an error processing your text",
        variant: "destructive",
      });
    }
  };
  
  // Toggle between encode and decode modes
  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    
    // Swap input and output
    setInputText(outputText);
    setOutputText(inputText);
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Reset everything
  const reset = () => {
    setInputText("");
    setOutputText("");
  };
  
  // Process text when input or mode changes (if auto-convert is enabled)
  useEffect(() => {
    if (autoConvert) {
      processText();
    }
  }, [inputText, mode, namedEntities]);
  
  return (
    <ToolLayout
      title="HTML Entity Converter"
      description="Convert special characters to HTML entities and vice versa"
      icon={<Code className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
                <TabsList>
                  <TabsTrigger value="encode">Encode</TabsTrigger>
                  <TabsTrigger value="decode">Decode</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-4">
                {mode === "encode" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="named-entities"
                      checked={namedEntities}
                      onCheckedChange={setNamedEntities}
                    />
                    <Label htmlFor="named-entities">Use named entities</Label>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-convert"
                    checked={autoConvert}
                    onCheckedChange={setAutoConvert}
                  />
                  <Label htmlFor="auto-convert">Auto-convert</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">{mode === "encode" ? "Text to Encode" : "HTML Entities to Decode"}</Label>
                <Textarea
                  id="input-text"
                  placeholder={mode === "encode" ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to plain text"}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="output-text">{mode === "encode" ? "HTML Entities" : "Decoded Text"}</Label>
                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  className="min-h-[200px] font-mono"
                />
                
                <div className="absolute right-2 bottom-2 flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="secondary"
                    size="sm"
                    disabled={!outputText}
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4 gap-4">
              <Button onClick={toggleMode} variant="outline">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Swap
              </Button>
              
              {!autoConvert && (
                <Button onClick={processText} variant="default">
                  {mode === "encode" ? "Encode" : "Decode"}
                </Button>
              )}
              
              <Button onClick={reset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">About HTML Entities</h3>
            
            <p className="mb-4 text-muted-foreground">
              HTML entities are special codes used to represent characters that have special meaning in HTML
              or characters that are difficult to type directly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Common HTML Entities</h4>
                <div className="border border-border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left">Character</th>
                        <th className="px-4 py-2 text-left">Entity Name</th>
                        <th className="px-4 py-2 text-left">Entity Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { char: '&', name: '&amp;', num: '&#38;' },
                        { char: '<', name: '&lt;', num: '&#60;' },
                        { char: '>', name: '&gt;', num: '&#62;' },
                        { char: '"', name: '&quot;', num: '&#34;' },
                        { char: "'", name: '&apos;', num: '&#39;' },
                        { char: ' ', name: '&nbsp;', num: '&#160;' },
                        { char: '©', name: '&copy;', num: '&#169;' },
                        { char: '®', name: '&reg;', num: '&#174;' },
                      ].map((entity, index) => (
                        <tr key={index} className="hover:bg-muted/20">
                          <td className="px-4 py-2">{entity.char}</td>
                          <td className="px-4 py-2 font-mono text-xs">{entity.name}</td>
                          <td className="px-4 py-2 font-mono text-xs">{entity.num}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">When to Use HTML Entities</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>When you need to display special characters that have meaning in HTML (like &lt; and &gt;)</li>
                  <li>For characters not available on your keyboard</li>
                  <li>To ensure consistent character rendering across browsers</li>
                  <li>When you need to preserve whitespace formatting</li>
                  <li>For special symbols and characters in different languages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default HtmlEntityConverter;
