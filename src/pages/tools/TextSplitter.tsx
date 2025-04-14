import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Scissors, Copy, Download, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const TextSplitter = () => {
  const [inputText, setInputText] = useState("");
  const [splitResult, setSplitResult] = useState<string[]>([]);
  const [splitMethod, setSplitMethod] = useState<string>("characters");
  const [chunkSize, setChunkSize] = useState<number>(100);
  const [separator, setSeparator] = useState<string>("");
  const [addNumbering, setAddNumbering] = useState<boolean>(true);
  const [preserveWords, setPreserveWords] = useState<boolean>(true);
  const [preserveParagraphs, setPreserveParagraphs] = useState<boolean>(false);

  // Split by characters
  const splitByCharacters = (text: string, size: number) => {
    if (preserveWords) {
      const words = text.split(/\s+/);
      const chunks: string[] = [];
      let currentChunk: string[] = [];
      let currentLength = 0;

      for (const word of words) {
        // If adding this word would exceed chunk size, start a new chunk
        if (
          currentLength + word.length + (currentLength > 0 ? 1 : 0) > size &&
          currentLength > 0
        ) {
          chunks.push(currentChunk.join(" "));
          currentChunk = [word];
          currentLength = word.length;
        } else {
          // Add the word to the current chunk
          if (currentLength > 0) {
            currentLength += 1; // account for space
          }
          currentLength += word.length;
          currentChunk.push(word);
        }
      }

      // Add the last chunk if it's not empty
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
      }

      return chunks;
    } else {
      // Simple character split
      const chunks: string[] = [];
      for (let i = 0; i < text.length; i += size) {
        chunks.push(text.substring(i, i + size));
      }
      return chunks;
    }
  };

  // Split by words
  const splitByWords = (text: string, wordCount: number) => {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += wordCount) {
      chunks.push(words.slice(i, i + wordCount).join(" "));
    }

    return chunks;
  };

  // Split by lines
  const splitByLines = (text: string, lineCount: number) => {
    const lines = text.split("\n");
    const chunks: string[] = [];

    for (let i = 0; i < lines.length; i += lineCount) {
      chunks.push(lines.slice(i, i + lineCount).join("\n"));
    }

    return chunks;
  };

  // Split by paragraphs
  const splitByParagraphs = (text: string, paraCount: number) => {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];

    for (let i = 0; i < paragraphs.length; i += paraCount) {
      chunks.push(paragraphs.slice(i, i + paraCount).join("\n\n"));
    }

    return chunks;
  };

  // Split by custom separator
  const splitByCustom = (text: string) => {
    if (!separator) return [text];
    return text.split(separator).filter((chunk) => chunk.trim() !== "");
  };

  const handleTextSplit = () => {
    if (!inputText.trim()) {
      toast.error("Please enter text to split");
      return;
    }

    let result: string[] = [];

    try {
      switch (splitMethod) {
        case "characters":
          result = splitByCharacters(inputText, chunkSize);
          break;
        case "words":
          result = splitByWords(inputText, chunkSize);
          break;
        case "lines":
          result = splitByLines(inputText, chunkSize);
          break;
        case "paragraphs":
          result = splitByParagraphs(inputText, chunkSize);
          break;
        case "custom":
          result = splitByCustom(inputText);
          break;
      }

      setSplitResult(result);

      if (result.length > 0) {
        toast.success(`Text split into ${result.length} chunks`);
      }
    } catch (error) {
      console.error("Error splitting text:", error);
      toast.error("Failed to split text");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const downloadResults = () => {
    if (splitResult.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const content = splitResult
      .map(
        (chunk, i) =>
          `${addNumbering ? `[Chunk ${i + 1}]\n` : ""}${chunk}${
            i < splitResult.length - 1 ? "\n\n----------\n\n" : ""
          }`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `split-text_ZeroKit${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Text Splitter"
      description="Split large text into smaller chunks by characters, words, or lines"
      icon={<Scissors className="h-6 w-6 text-primary" />}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <Card className="bg-black/50 border-zinc-800 h-full">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="input-text">Input Text</Label>
                      <span className="text-xs text-muted-foreground">
                        {inputText.length} characters
                      </span>
                    </div>
                    <Textarea
                      id="input-text"
                      placeholder="Paste your text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-black/50 border-zinc-800 h-full">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Split Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="split-method">Split Method</Label>
                    <Select value={splitMethod} onValueChange={setSplitMethod}>
                      <SelectTrigger id="split-method">
                        <SelectValue placeholder="Select split method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="characters">
                          By Characters
                        </SelectItem>
                        <SelectItem value="words">By Words</SelectItem>
                        <SelectItem value="lines">By Lines</SelectItem>
                        <SelectItem value="paragraphs">
                          By Paragraphs
                        </SelectItem>
                        <SelectItem value="custom">
                          By Custom Separator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {splitMethod !== "custom" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="chunk-size">
                          {splitMethod === "characters"
                            ? "Characters"
                            : splitMethod === "words"
                            ? "Words"
                            : splitMethod === "lines"
                            ? "Lines"
                            : "Paragraphs"}{" "}
                          per chunk
                        </Label>
                        <span className="text-muted-foreground">
                          {chunkSize}
                        </span>
                      </div>
                      <Slider
                        id="chunk-size"
                        value={[chunkSize]}
                        min={1}
                        max={
                          splitMethod === "characters"
                            ? 1000
                            : splitMethod === "words"
                            ? 100
                            : splitMethod === "lines"
                            ? 50
                            : 10
                        }
                        step={1}
                        onValueChange={(vals) => setChunkSize(vals[0])}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="separator">Custom Separator</Label>
                      <Input
                        id="separator"
                        placeholder="E.g. ,|;|---"
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                      />
                    </div>
                  )}

                  {splitMethod === "characters" && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-words"
                        checked={preserveWords}
                        onCheckedChange={setPreserveWords}
                      />
                      <Label htmlFor="preserve-words">Preserve words</Label>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="add-numbering"
                      checked={addNumbering}
                      onCheckedChange={setAddNumbering}
                    />
                    <Label htmlFor="add-numbering">Add chunk numbering</Label>
                  </div>

                  <Button
                    onClick={handleTextSplit}
                    className="w-full bg-primary/80 hover:bg-primary"
                    disabled={!inputText.trim()}>
                    <Scissors className="mr-2 h-4 w-4" />
                    Split Text
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-black/50 border-zinc-800 mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Split Results</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadResults}
                  disabled={splitResult.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            {splitResult.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlignJustify className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No results yet. Split your text to see chunks here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-zinc-900/50 px-3 py-1.5 rounded-md flex justify-between">
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/30">
                    {splitResult.length} Chunks
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Total:{" "}
                    {splitResult.reduce(
                      (total, chunk) => total + chunk.length,
                      0
                    )}{" "}
                    characters
                  </span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {splitResult.map((chunk, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/50 p-4 rounded-md border border-zinc-800/50 relative group">
                      {addNumbering && (
                        <div className="absolute -top-2 -left-2 bg-primary/80 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                      <pre className="text-sm whitespace-pre-wrap font-mono break-all">
                        {chunk}
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(chunk)}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-black/30 border border-zinc-800/50 rounded-lg">
          <h3 className="font-medium mb-2">About Text Splitting</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Text splitting is useful for breaking large documents into smaller,
            manageable chunks for analysis, processing, or when working with
            text that has character limits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-white mb-1">Common Use Cases:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Breaking text for social media posts with character limits
                </li>
                <li>
                  Preparing content for AI processing with token limitations
                </li>
                <li>Creating manageable sections for translation or editing</li>
                <li>Splitting code into smaller functions or modules</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Tips:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Use "Preserve words" when splitting by characters to avoid
                  cutting words in half
                </li>
                <li>
                  For programming code, splitting by lines often makes more
                  sense
                </li>
                <li>
                  For essays or articles, splitting by paragraphs maintains
                  readability
                </li>
                <li>
                  Use custom separators for CSV data or other structured formats
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextSplitter;
