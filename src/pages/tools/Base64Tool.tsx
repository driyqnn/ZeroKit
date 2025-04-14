import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileDown, UploadCloud, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);

      toast.success("Text encoded successfully");
    } catch (error) {
      toast.error("Encoding failed. Make sure you're using valid text.");
      console.error(error);
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);

      toast.success("Base64 decoded successfully");
    } catch (error) {
      toast.error(
        "Decoding failed. Make sure you're using a valid Base64 string."
      );
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setInput(reader.result);
      }
    };

    if (mode === "encode") {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${
      mode === "encode" ? "encoded" : "decoded"
    }_base64_ZeroKit-by-@driyqnn.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("File downloaded");
  };

  const handleSwapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    toast.info(`Switched to ${mode === "encode" ? "decode" : "encode"} mode`);
  };

  const handleClearAll = () => {
    setInput("");
    setOutput("");
    toast.info("Cleared all fields");
  };

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Convert text to Base64 encoding or decode Base64 strings"
      icon={<FileDown className="h-6 w-6 text-primary" />}>
      <div className="grid gap-6">
        <Tabs
          defaultValue="encode"
          value={mode}
          onValueChange={(v) => setMode(v as "encode" | "decode")}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4">
          <label className="text-sm font-medium">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <Textarea
            placeholder={
              mode === "encode"
                ? "Enter text to convert to Base64..."
                : "Enter Base64 string to decode..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] font-mono"
          />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={mode === "encode" ? handleEncode : handleDecode}
              disabled={!input}>
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleSwapMode}
              disabled={!output}>
              <RefreshCw className="h-4 w-4" />
              Swap
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={!input && !output}>
              Clear All
            </Button>

            <label className="cursor-pointer">
              <Button variant="secondary" asChild>
                <span className="flex gap-2 items-center">
                  <UploadCloud className="h-4 w-4" />
                  Upload File
                </span>
              </Button>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {output && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="flex gap-1 items-center">
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
                    size="sm"
                    variant="ghost"
                    onClick={handleDownload}
                    className="flex gap-1 items-center">
                    <FileDown className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                readOnly
                value={output}
                className="min-h-[120px] font-mono"
              />
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default Base64Tool;
