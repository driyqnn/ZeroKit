import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileJson, Copy, Check, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const formatJson = () => {
    try {
      if (!inputJson.trim()) {
        setError("Please enter JSON to format");
        setOutputJson("");
        return;
      }

      const parsedJson = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(parsedJson, null, indentSize);
      setOutputJson(formattedJson);
      setError("");
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`
      );
      setOutputJson("");
    }
  };

  const minifyJson = () => {
    try {
      if (!inputJson.trim()) {
        setError("Please enter JSON to minify");
        setOutputJson("");
        return;
      }

      const parsedJson = JSON.parse(inputJson);
      const minifiedJson = JSON.stringify(parsedJson);
      setOutputJson(minifiedJson);
      setError("");

      // Track minification
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`
      );
      setOutputJson("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInputJson(event.target.result.toString());
        setError("");
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const filename = "formatted_json_ZeroKit-by-@driyqnn.json";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("JSON downloaded successfully");
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format and validate your JSON data with this easy-to-use tool."
      icon={<FileJson className="h-6 w-6 text-primary" />}>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <label htmlFor="json-input" className="text-sm font-medium">
            Input JSON
          </label>
          <div className="flex flex-col gap-2">
            <Textarea
              id="json-input"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON here..."
              className="min-h-[200px] font-mono"
            />
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center gap-2">
                <DownloadCloud className="h-4 w-4" />
                Upload JSON
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="rounded-md border border-border px-3 py-1.5 text-sm">
                {[2, 4, 6, 8].map((size) => (
                  <option key={size} value={size}>
                    {size} spaces
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tabs defaultValue="format" className="flex-1">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="format" onClick={formatJson}>
                Format JSON
              </TabsTrigger>
              <TabsTrigger value="minify" onClick={minifyJson}>
                Minify JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
            {error}
          </div>
        )}

        {outputJson && (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="json-output" className="text-sm font-medium">
                Output JSON
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={copied}
                  className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-1">
                  <DownloadCloud className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              id="json-output"
              value={outputJson}
              readOnly
              className="min-h-[200px] font-mono"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default JsonFormatter;
