
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { MonitorX, Copy, FileUp, Download, Trash2, ArrowDownUp, Check, ThumbsUp, Scissors, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const CssMinifier = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [compressionRate, setCompressionRate] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);
  const [activeTab, setActiveTab] = useState("minify");
  const [recentFiles, setRecentFiles] = useState<{name: string, content: string}[]>([]);

  // Load recent files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('css_minifier_recent');
    if (savedFiles) {
      try {
        setRecentFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error("Failed to parse saved files", e);
      }
    }
  }, []);

  // Save recent files to localStorage
  useEffect(() => {
    if (recentFiles.length > 0) {
      localStorage.setItem('css_minifier_recent', JSON.stringify(recentFiles));
    }
  }, [recentFiles]);

  // Function to minify CSS
  const minifyCss = (css: string): string => {
    if (!css.trim()) return "";

    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");
    
    // Remove whitespace
    css = css.replace(/\s+/g, " ");
    
    // Remove spaces around brackets, colons, semicolons
    css = css.replace(/\s*([{}:;,])\s*/g, "$1");
    
    // Remove leading and trailing spaces
    css = css.replace(/^\s+|\s+$/g, "");
    
    // Remove spaces after commas
    css = css.replace(/,\s+/g, ",");
    
    // Remove semicolon before closing brace
    css = css.replace(/;\}/g, "}");
    
    // Remove 0 before decimal point
    css = css.replace(/0\./g, ".");
    
    // Remove unnecessary units for zero values
    css = css.replace(/(\s|:)0(px|em|rem|%|in|cm|mm|pc|pt|ex|vh|vw|vmin|vmax)/g, "$10");
    
    return css;
  };

  // Function to prettify CSS
  const prettifyCss = (css: string): string => {
    if (!css.trim()) return "";
    
    // First minify to normalize
    css = minifyCss(css);
    
    // Add new line after closing braces
    css = css.replace(/\}/g, "}\n");
    
    // Add new line after semicolons in rule blocks
    css = css.replace(/;/g, ";\n    ");
    
    // Format the block opening
    css = css.replace(/\{/g, " {\n    ");
    
    // Clean up the final formatting
    css = css.replace(/\s+\n/g, "\n");
    
    return css;
  };

  const processCSS = () => {
    if (!input.trim()) {
      toast("Please enter some CSS to process", {
        duration: 3000,
      });
      return;
    }

    const original = input.trim();
    setOriginalSize(original.length);
    
    let processed = "";
    if (activeTab === "minify") {
      processed = minifyCss(original);
      setMinifiedSize(processed.length);
      
      const savingPercentage = original.length > 0 
        ? Math.round((1 - (processed.length / original.length)) * 100) 
        : 0;
      setCompressionRate(savingPercentage);
      
      toast(`CSS minified! Saved ${savingPercentage}% of the original size.`, {
        duration: 3000,
      });
    } else {
      processed = prettifyCss(original);
      toast("CSS formatted successfully!", {
        duration: 3000,
      });
    }
    
    setOutput(processed);
    
    // Add to recent files if not empty
    if (processed) {
      const newFile = {
        name: `CSS_${new Date().toLocaleTimeString().replace(/:/g, '-')}`,
        content: original
      };
      setRecentFiles(prev => [newFile, ...prev.slice(0, 4)]); // Keep only last 5 files
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", {
      duration: 2000,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's a CSS file
    if (!file.name.endsWith('.css')) {
      toast("Please upload a CSS file", {
        duration: 3000,
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      toast(`File "${file.name}" loaded successfully`, {
        duration: 3000,
      });
    };
    reader.readAsText(file);
  };

  const downloadOutput = () => {
    if (!output) {
      toast("No output to download", {
        duration: 3000,
      });
      return;
    }
    
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab === 'minify' ? 'minified' : 'prettified'}_style_${new Date().getTime()}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast("File downloaded successfully", {
      duration: 3000,
    });
  };

  const clearInput = () => {
    setInput("");
    setOutput("");
    setCompressionRate(0);
    setOriginalSize(0);
    setMinifiedSize(0);
  };

  const loadFromRecent = (content: string) => {
    setInput(content);
    setOutput("");
    toast("Previous CSS loaded", {
      duration: 2000,
    });
  };

  return (
    <ToolLayout
      title="CSS Minifier"
      description="Minify CSS code for production use"
      icon={<MonitorX className="h-6 w-6 text-primary" />}
    >
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>CSS {activeTab === "minify" ? "Minifier" : "Beautifier"}</CardTitle>
                  <Tabs defaultValue="minify" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="minify">
                        <Minimize2 className="mr-2 h-4 w-4" />
                        Minify
                      </TabsTrigger>
                      <TabsTrigger value="prettify">
                        <Maximize2 className="mr-2 h-4 w-4" />
                        Prettify
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Input CSS</p>
                      <div className="flex space-x-2">
                        <label htmlFor="file-upload">
                          <Button variant="outline" size="sm" asChild>
                            <div className="cursor-pointer">
                              <FileUp className="h-4 w-4 mr-1" />
                              Upload
                            </div>
                          </Button>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".css"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button variant="outline" size="sm" onClick={clearInput}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`/* Enter your CSS code here */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f5f5f5;\n}`}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Output CSS</p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(output)}
                          disabled={!output}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadOutput}
                          disabled={!output}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[400px] bg-muted/30 rounded-md">
                      <pre className="p-4 whitespace-pre-wrap font-mono text-sm">{output}</pre>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex space-x-4">
                  {output && activeTab === "minify" && (
                    <>
                      <div className="text-sm">
                        <span className="font-medium">Original:</span>{" "}
                        <span className="text-muted-foreground">{originalSize} bytes</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Minified:</span>{" "}
                        <span className="text-muted-foreground">{minifiedSize} bytes</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Saved:</span>{" "}
                        <span className="text-green-600 dark:text-green-400">{compressionRate}%</span>
                      </div>
                    </>
                  )}
                </div>
                <Button onClick={processCSS} disabled={!input.trim()}>
                  {activeTab === "minify" ? (
                    <>
                      <Scissors className="mr-2 h-4 w-4" />
                      Minify CSS
                    </>
                  ) : (
                    <>
                      <ArrowDownUp className="mr-2 h-4 w-4" />
                      Format CSS
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
              </CardHeader>
              <CardContent>
                {recentFiles.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {recentFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => loadFromRecent(file.content)}
                        >
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm font-medium truncate">{file.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {file.content.substring(0, 40)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center p-4">
                    <Scissors className="h-12 w-12 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">No recent files</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Process some CSS to see your history here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CssMinifier;
