
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileJson, RefreshCw, Copy, Download, Trash, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// We'll use js-yaml for YAML conversion
import yaml from "js-yaml";

const JsonYamlConverter = () => {
  const [jsonContent, setJsonContent] = useState("");
  const [yamlContent, setYamlContent] = useState("");
  const [activeTab, setActiveTab] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [conversionError, setConversionError] = useState("");
  
  const convertJsonToYaml = () => {
    try {
      setConversionError("");
      
      if (!jsonContent.trim()) {
        toast.error("Please enter JSON content first");
        return;
      }
      
      // Parse JSON content
      const jsonObject = JSON.parse(jsonContent);
      
      // Convert to YAML
      const yamlResult = yaml.dump(jsonObject, {
        indent: 2,
        noRefs: true,
        lineWidth: 120
      });
      
      setYamlContent(yamlResult);
      toast.success("Successfully converted JSON to YAML");
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
      setConversionError(error instanceof Error ? error.message : "Invalid JSON format");
      toast.error("Failed to convert: Invalid JSON");
    }
  };
  
  const convertYamlToJson = () => {
    try {
      setConversionError("");
      
      if (!yamlContent.trim()) {
        toast.error("Please enter YAML content first");
        return;
      }
      
      // Parse YAML content
      const yamlObject = yaml.load(yamlContent);
      
      // Convert to JSON
      const jsonResult = JSON.stringify(yamlObject, null, 2);
      
      setJsonContent(jsonResult);
      toast.success("Successfully converted YAML to JSON");
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
      setConversionError(error instanceof Error ? error.message : "Invalid YAML format");
      toast.error("Failed to convert: Invalid YAML");
    }
  };

  const swapConversionDirection = () => {
    setActiveTab(activeTab === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
  };
  
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };
  
  const downloadContent = (content: string, fileType: "json" | "yaml") => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileType === "json" ? "converted.json" : "converted.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${fileType.toUpperCase()} file`);
  };
  
  const clearContent = (type: "json" | "yaml") => {
    if (type === "json") {
      setJsonContent("");
    } else {
      setYamlContent("");
    }
    setConversionError("");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "json-to-yaml" | "yaml-to-json");
    setConversionError("");
  };

  return (
    <ToolLayout
      title="JSON/YAML Converter"
      description="Convert between JSON and YAML formats with ease"
      icon={<FileJson className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
              <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={swapConversionDirection} 
            title="Swap conversion direction"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Panel: Input */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                {activeTab === "json-to-yaml" ? "JSON Input" : "YAML Input"}
              </h3>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearContent(activeTab === "json-to-yaml" ? "json" : "yaml")}
                  title="Clear"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(activeTab === "json-to-yaml" ? jsonContent : yamlContent)}
                  title="Copy to clipboard"
                  disabled={!(activeTab === "json-to-yaml" ? jsonContent : yamlContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={activeTab === "json-to-yaml" ? jsonContent : yamlContent}
              onChange={(e) => activeTab === "json-to-yaml" ? setJsonContent(e.target.value) : setYamlContent(e.target.value)}
              placeholder={activeTab === "json-to-yaml" ? "Paste your JSON here..." : "Paste your YAML here..."}
              className="w-full h-96 rounded-md border border-border p-3 font-mono text-sm bg-muted/20 focus:border-primary focus:ring-primary outline-none"
              spellCheck={false}
            />
          </div>
          
          {/* Right Panel: Output */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                {activeTab === "json-to-yaml" ? "YAML Output" : "JSON Output"}
              </h3>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(activeTab === "json-to-yaml" ? yamlContent : jsonContent)}
                  title="Copy to clipboard"
                  disabled={!(activeTab === "json-to-yaml" ? yamlContent : jsonContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => downloadContent(
                    activeTab === "json-to-yaml" ? yamlContent : jsonContent, 
                    activeTab === "json-to-yaml" ? "yaml" : "json"
                  )}
                  title="Download"
                  disabled={!(activeTab === "json-to-yaml" ? yamlContent : jsonContent)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={activeTab === "json-to-yaml" ? yamlContent : jsonContent}
              readOnly
              placeholder={activeTab === "json-to-yaml" ? "YAML result will appear here..." : "JSON result will appear here..."}
              className="w-full h-96 rounded-md border border-border p-3 font-mono text-sm bg-muted/10 focus:border-primary focus:ring-primary outline-none"
              spellCheck={false}
            />
          </div>
        </div>
        
        {conversionError && (
          <div className="mt-4 p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive text-sm">
            <strong>Error:</strong> {conversionError}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={activeTab === "json-to-yaml" ? convertJsonToYaml : convertYamlToJson}
            className="w-64"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {activeTab === "json-to-yaml" ? "Convert JSON to YAML" : "Convert YAML to JSON"}
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">About JSON and YAML</h3>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>JSON (JavaScript Object Notation)</strong> is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate.
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>YAML (YAML Ain't Markup Language)</strong> is a human-friendly data serialization standard that is commonly used for configuration files and data exchange applications.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> YAML is a superset of JSON, so any valid JSON is also valid YAML. However, YAML has additional features like comments and anchors that JSON doesn't support.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default JsonYamlConverter;
