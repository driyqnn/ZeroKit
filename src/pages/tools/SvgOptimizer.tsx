import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Image, Upload, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

interface OptimizationOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  removeDimensions: boolean;
  cleanupIds: boolean;
  removeUnusedNS: boolean;
  collapseGroups: boolean;
  optimizationLevel: number;
}

const SvgOptimizer = () => {
  const [svgInput, setSvgInput] = useState<string>("");
  const [svgOutput, setSvgOutput] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<{
    originalSize: number;
    optimizedSize: number;
    savings: number;
  } | null>(null);

  const [options, setOptions] = useState<OptimizationOptions>({
    removeComments: true,
    removeMetadata: true,
    removeDimensions: false,
    cleanupIds: true,
    removeUnusedNS: true,
    collapseGroups: true,
    optimizationLevel: 2,
  });

  const handleFileSelected = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please select an SVG file");
      return;
    }

    setFileName(file.name);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgInput(content);
      setSvgOutput("");
      setOptimizationResult(null);

      // reader.readAsText(file);
    };
    reader.readAsText(file);
  };

  const handleFileUploaded = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please select an SVG file");
      return;
    }

    setFileName(file.name);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgInput(content);
      setSvgOutput("");
      setOptimizationResult(null);
    };
    reader.readAsText(file);
  };

  const optimizeSvg = () => {
    if (!svgInput) {
      toast.error("Please upload an SVG file first");
      return;
    }

    setIsOptimizing(true);
    setProgress(0);

    // Simulate optimization progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    // Simple SVG optimization (in a real app, this would be more comprehensive)
    setTimeout(() => {
      try {
        let optimized = svgInput;

        // Apply basic optimizations based on selected options
        if (options.removeComments) {
          optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");
        }

        if (options.removeMetadata) {
          optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/g, "");
        }

        if (options.cleanupIds) {
          // This is a simplified version; a real implementation would be more complex
          optimized = optimized.replace(/\s+id="[^"]*"/g, "");
        }

        if (options.removeUnusedNS) {
          // Remove unused namespace declarations (simplified)
          optimized = optimized.replace(/\s+xmlns:[a-z0-9]+="[^"]*"/g, "");
        }

        // Remove whitespace based on optimization level
        if (options.optimizationLevel > 0) {
          optimized = optimized.replace(/>\s+</g, "><");
          if (options.optimizationLevel > 1) {
            optimized = optimized.replace(/\s{2,}/g, " ");
          }
        }

        // Calculate size savings
        const originalSize = svgInput.length;
        const optimizedSize = optimized.length;
        const savings = (
          ((originalSize - optimizedSize) / originalSize) *
          100
        ).toFixed(1);

        setSvgOutput(optimized);
        setOptimizationResult({
          originalSize,
          optimizedSize,
          savings: parseFloat(savings),
        });

        setProgress(100);
        toast.success("SVG optimization complete!");
      } catch (error) {
        toast.error("Error optimizing SVG");
        console.error("Optimization error:", error);
      } finally {
        clearInterval(interval);
        setIsOptimizing(false);
      }
    }, 1500);
  };

  const handleDownload = () => {
    if (!svgOutput) return;

    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Generate download filename with ZeroKit attribution
    const nameParts = fileName.split(".");
    const extension = nameParts.pop() || "svg";
    const baseName = nameParts.join(".");
    const downloadName = baseName.includes("_ZeroKit-by-@driyqnn")
      ? `${baseName}_optimized.${extension}`
      : `${baseName}_optimized_ZeroKit.${extension}`;

    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("SVG downloaded successfully");
  };

  const renderSvgPreview = (svg: string) => {
    try {
      return (
        <div
          className="bg-white rounded-md flex items-center justify-center p-4 h-full min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      );
    } catch {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px] bg-muted/30 rounded-md">
          <p className="text-muted-foreground">SVG Preview</p>
        </div>
      );
    }
  };

  return (
    <ToolLayout
      title="SVG Optimizer"
      description="Optimize and clean up SVG files to reduce file size"
      icon={<Image className="h-6 w-6 text-primary" />}>
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Upload SVG</h3>
                  <FileUpload onFileUploaded={handleFileUploaded} />
                </div>

                {svgInput && (
                  <>
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        Optimization Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="remove-comments">
                            Remove Comments
                          </Label>
                          <Switch
                            id="remove-comments"
                            checked={options.removeComments}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                removeComments: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="remove-metadata">
                            Remove Metadata
                          </Label>
                          <Switch
                            id="remove-metadata"
                            checked={options.removeMetadata}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                removeMetadata: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="cleanup-ids">Clean up IDs</Label>
                          <Switch
                            id="cleanup-ids"
                            checked={options.cleanupIds}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                cleanupIds: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="remove-unused-ns">
                            Remove Unused Namespaces
                          </Label>
                          <Switch
                            id="remove-unused-ns"
                            checked={options.removeUnusedNS}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                removeUnusedNS: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="pt-2">
                          <Label
                            htmlFor="optimization-level"
                            className="mb-2 block">
                            Optimization Level: {options.optimizationLevel}
                          </Label>
                          <Slider
                            id="optimization-level"
                            min={1}
                            max={3}
                            step={1}
                            value={[options.optimizationLevel]}
                            onValueChange={(value) =>
                              setOptions((prev) => ({
                                ...prev,
                                optimizationLevel: value[0],
                              }))
                            }
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6"
                      onClick={optimizeSvg}
                      disabled={isOptimizing || !svgInput}>
                      {isOptimizing ? "Optimizing..." : "Optimize SVG"}
                    </Button>

                    {isOptimizing && (
                      <Progress value={progress} className="mt-4" />
                    )}
                  </>
                )}
              </div>

              <div className="flex-1">
                {svgInput && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Original SVG</h3>
                    {renderSvgPreview(svgInput)}
                    <p className="text-sm text-muted-foreground mt-2">
                      Size: {svgInput.length.toLocaleString()} bytes
                    </p>
                  </div>
                )}

                {svgOutput && (
                  <>
                    <Separator className="my-6" />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">Optimized SVG</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>

                      {renderSvgPreview(svgOutput)}

                      {optimizationResult && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Optimization complete!</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Original
                              </p>
                              <p className="font-medium">
                                {optimizationResult.originalSize.toLocaleString()}{" "}
                                B
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Optimized
                              </p>
                              <p className="font-medium">
                                {optimizationResult.optimizedSize.toLocaleString()}{" "}
                                B
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Saved
                              </p>
                              <p className="font-medium text-green-500">
                                {optimizationResult.savings}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SvgOptimizer;
