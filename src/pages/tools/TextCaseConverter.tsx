
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ArrowLeft, Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TextCaseConverter = () => {
  const [text, setText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [selectedCase, setSelectedCase] = useState("lowercase");

  const handleClear = () => {
    setText("");
    setConvertedText("");
  };

  const handleCopy = () => {
    if (convertedText) {
      navigator.clipboard.writeText(convertedText).then(() => {
        toast.success("Text copied to clipboard");
      }).catch(() => {
        toast.error("Failed to copy text");
      });
    }
  };

  const handleConvert = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }

    let result = "";
    switch (selectedCase) {
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "capitalize":
        result = text
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "sentence":
        result = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
        break;
      case "alternating":
        result = text
          .split("")
          .map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join("");
        break;
      case "title":
        // Title case excludes articles, conjunctions, and prepositions unless they're the first word
        const exclusions = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
        result = text
          .toLowerCase()
          .split(" ")
          .map((word, index) => {
            if (index === 0 || !exclusions.includes(word)) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
          })
          .join(" ");
        break;
      case "snake":
        result = text
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
        break;
      case "kebab":
        result = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        break;
      case "camel":
        result = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, match => match.toLowerCase());
        break;
      case "pascal":
        result = text
          .toLowerCase()
          .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
          .replace(/\s+/g, "");
        break;
      default:
        result = text;
    }
    
    setConvertedText(result);
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert between different text cases: uppercase, lowercase, title case, and more"
      icon={<ArrowLeft className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                className="min-h-[150px] resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={selectedCase}
                  onValueChange={(value) => setSelectedCase(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
                    <SelectItem value="sentence">Sentence case</SelectItem>
                    <SelectItem value="alternating">aLtErNaTiNg cAsE</SelectItem>
                    <SelectItem value="title">Title Case</SelectItem>
                    <SelectItem value="snake">snake_case</SelectItem>
                    <SelectItem value="kebab">kebab-case</SelectItem>
                    <SelectItem value="camel">camelCase</SelectItem>
                    <SelectItem value="pascal">PascalCase</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleConvert} className="flex-grow">Convert</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {convertedText && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">Result:</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      <Trash className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-md min-h-[100px] whitespace-pre-wrap break-all">
                  {convertedText}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">What are Text Cases?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Common Text Cases:</h4>
                <ul className="list-disc ml-5 space-y-1 mt-2">
                  <li><strong>lowercase:</strong> all characters in lowercase</li>
                  <li><strong>UPPERCASE:</strong> all characters in uppercase</li>
                  <li><strong>Sentence case:</strong> first letter of sentence capitalized</li>
                  <li><strong>Title Case:</strong> major words capitalized as in a title</li>
                  <li><strong>Capitalize Each Word:</strong> first letter of each word capitalized</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Programming Text Cases:</h4>
                <ul className="list-disc ml-5 space-y-1 mt-2">
                  <li><strong>camelCase:</strong> no spaces, first word lowercase, other words capitalized</li>
                  <li><strong>PascalCase:</strong> no spaces, all words capitalized</li>
                  <li><strong>snake_case:</strong> lowercase with underscores</li>
                  <li><strong>kebab-case:</strong> lowercase with hyphens</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TextCaseConverter;
