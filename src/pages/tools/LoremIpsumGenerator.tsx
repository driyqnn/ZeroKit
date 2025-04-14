import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Repeat, Copy, FileText, Columns, List, AlignLeft, Download, Heading1, Heading2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Word bank for generating lorem ipsum
const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", 
  "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", 
  "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", 
  "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", 
  "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", 
  "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const STARTING_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

// Different formats for output
interface LoremFormats {
  [key: string]: (text: string, params: any) => string;
}

// Helper functions to generate different formats of lorem ipsum text
const generateTextWithParagraphs = (words: string[], paragraphs: number, wordsPerParagraph: number): string => {
  let result = "";
  
  for (let i = 0; i < paragraphs; i++) {
    let paragraph = "";
    let sentenceLength = 0;
    let currentSentence = "";
    
    for (let j = 0; j < wordsPerParagraph; j++) {
      const word = words[Math.floor(Math.random() * words.length)];
      
      // Start a new sentence with capital letter
      if (sentenceLength === 0) {
        currentSentence = word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        currentSentence += " " + word;
      }
      
      sentenceLength++;
      
      // End sentence after 6-12 words
      if (sentenceLength > 5 && (sentenceLength > 11 || Math.random() < 0.3)) {
        paragraph += currentSentence + ". ";
        sentenceLength = 0;
        currentSentence = "";
      }
    }
    
    // Add any remaining sentence
    if (currentSentence) {
      paragraph += currentSentence + ".";
    }
    
    result += paragraph.trim() + "\n\n";
  }
  
  return result.trim();
};

const LoremIpsumGenerator = () => {
  const [count, setCount] = useState<number>(5);
  const [unit, setUnit] = useState<string>("paragraphs");
  const [format, setFormat] = useState<string>("plain");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [minWordsPerSentence, setMinWordsPerSentence] = useState<number>(5);
  const [maxWordsPerSentence, setMaxWordsPerSentence] = useState<number>(15);
  const [wordsPerParagraph, setWordsPerParagraph] = useState<number>(50);
  const [customWordBank, setCustomWordBank] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [recentOutputs, setRecentOutputs] = useState<string[]>([]);

  // Format processors
  const formats: LoremFormats = {
    plain: (text: string) => text,
    html: (text: string, { unit }) => {
      if (unit === "paragraphs") {
        return text.split("\n\n").map(p => `<p>${p}</p>`).join("\n");
      } else if (unit === "sentences") {
        return `<p>${text}</p>`;
      } else {
        return text.split(" ").map(w => `<span>${w}</span>`).join(" ");
      }
    },
    markdown: (text: string, { unit }) => {
      if (unit === "paragraphs") {
        return text;
      } else if (unit === "sentences") {
        return text;
      } else {
        return text;
      }
    },
    json: (text: string, { unit }) => {
      if (unit === "paragraphs") {
        const paragraphs = text.split("\n\n");
        return JSON.stringify({ paragraphs }, null, 2);
      } else if (unit === "sentences") {
        const sentences = text.split(". ").map(s => s.endsWith(".") ? s : s + ".");
        return JSON.stringify({ sentences }, null, 2);
      } else {
        const words = text.split(" ");
        return JSON.stringify({ words }, null, 2);
      }
    }
  };

  const generateRandomText = () => {
    // Determine which word bank to use
    const wordBank = customWordBank.trim() ? 
      customWordBank.split(/\s+/).filter(word => word.trim().length > 0) : 
      WORDS;
    
    let result = "";
    
    // Always start with the classic Lorem ipsum if the option is selected
    const startingWords = startWithLorem ? STARTING_TEXT.split(" ") : [];
    let remainingCount = count;
    
    if (unit === "paragraphs") {
      const wordsNeeded = remainingCount * wordsPerParagraph;
      
      // If starting with Lorem ipsum and generating paragraphs
      if (startWithLorem) {
        result = generateTextWithParagraphs(
          [...startingWords, ...wordBank], 
          remainingCount, 
          wordsPerParagraph
        );
      } else {
        result = generateTextWithParagraphs(
          wordBank, 
          remainingCount, 
          wordsPerParagraph
        );
      }
    } else if (unit === "sentences") {
      let sentences = [];
      
      // Add the starting sentence if needed
      if (startWithLorem && remainingCount > 0) {
        sentences.push(STARTING_TEXT + ".");
        remainingCount--;
      }
      
      // Generate remaining sentences
      for (let i = 0; i < remainingCount; i++) {
        const sentenceLength = Math.floor(
          Math.random() * (maxWordsPerSentence - minWordsPerSentence + 1) + minWordsPerSentence
        );
        
        let sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
          sentence.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
        }
        
        // Capitalize first letter
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        sentences.push(sentence.join(" ") + ".");
      }
      
      result = sentences.join(" ");
    } else { // words
      let words = startWithLorem ? [...startingWords] : [];
      
      // Add remaining words
      while (words.length < count) {
        words.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
      }
      
      // Trim to exact count
      words = words.slice(0, count);
      
      result = words.join(" ");
    }
    
    // Apply formatting
    const formattedResult = formats[format](result, { unit });
    setOutput(formattedResult);
    
    // Add to recent outputs (keep only the last 5)
    setRecentOutputs(prev => [formattedResult, ...prev].slice(0, 5));
    
    toast("Lorem ipsum text generated!", {
      duration: 2000,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast("Copied to clipboard!", {
      duration: 2000,
    });
  };

  const downloadOutput = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    // Set filename based on format
    let extension = "txt";
    if (format === "html") extension = "html";
    else if (format === "markdown") extension = "md";
    else if (format === "json") extension = "json";
    
    a.download = `lorem-ipsum.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast("Text downloaded successfully!", {
      duration: 2000,
    });
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for designs"
      icon={<Repeat className="h-6 w-6 text-primary" />}
    >
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lorem Ipsum Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="count">Count</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        max="100"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <RadioGroup 
                        value={unit} 
                        onValueChange={setUnit}
                        className="flex space-x-2"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="paragraphs" id="paragraphs" />
                          <Label htmlFor="paragraphs">Paragraphs</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="sentences" id="sentences" />
                          <Label htmlFor="sentences">Sentences</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="words" id="words" />
                          <Label htmlFor="words">Words</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="format">Output Format</Label>
                    <Tabs defaultValue={format} value={format} onValueChange={setFormat} className="mt-2">
                      <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="plain">
                          <AlignLeft className="h-4 w-4 mr-1" />
                          Plain
                        </TabsTrigger>
                        <TabsTrigger value="html">
                          <FileText className="h-4 w-4 mr-1" />
                          HTML
                        </TabsTrigger>
                        <TabsTrigger value="markdown">
                          <List className="h-4 w-4 mr-1" />
                          MD
                        </TabsTrigger>
                        <TabsTrigger value="json">
                          <Columns className="h-4 w-4 mr-1" />
                          JSON
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="startWithLorem" 
                        checked={startWithLorem} 
                        onCheckedChange={(checked) => setStartWithLorem(checked === true)}
                      />
                      <Label htmlFor="startWithLorem">Start with "Lorem ipsum"</Label>
                    </div>
                    <Button 
                      onClick={generateRandomText} 
                      className="w-full mt-4"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Advanced Options</Label>
                  
                  <div className="space-y-4 rounded-md border p-4">
                    {unit === "paragraphs" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="wordsPerParagraph">Words per paragraph: {wordsPerParagraph}</Label>
                        </div>
                        <Slider 
                          id="wordsPerParagraph"
                          min={10} 
                          max={100} 
                          step={5}
                          value={[wordsPerParagraph]} 
                          onValueChange={(value) => setWordsPerParagraph(value[0])}
                        />
                      </div>
                    )}
                    
                    {unit === "sentences" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="minWords">Min words per sentence: {minWordsPerSentence}</Label>
                          </div>
                          <Slider 
                            id="minWords"
                            min={3} 
                            max={20} 
                            step={1}
                            value={[minWordsPerSentence]} 
                            onValueChange={(value) => {
                              const newMin = value[0];
                              setMinWordsPerSentence(newMin);
                              if (newMin > maxWordsPerSentence) {
                                setMaxWordsPerSentence(newMin);
                              }
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="maxWords">Max words per sentence: {maxWordsPerSentence}</Label>
                          </div>
                          <Slider 
                            id="maxWords"
                            min={3} 
                            max={30} 
                            step={1}
                            value={[maxWordsPerSentence]} 
                            onValueChange={(value) => {
                              const newMax = value[0];
                              setMaxWordsPerSentence(newMax);
                              if (newMax < minWordsPerSentence) {
                                setMinWordsPerSentence(newMax);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="customWordBank">Custom Word Bank (leave empty for default Lorem Ipsum)</Label>
                      <Textarea 
                        id="customWordBank"
                        placeholder="Enter custom words separated by spaces..."
                        value={customWordBank}
                        onChange={(e) => setCustomWordBank(e.target.value)}
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Generated Text</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyToClipboard}
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
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {format === "plain" || format === "markdown" ? (
                    <div className="whitespace-pre-wrap">{output}</div>
                  ) : format === "html" ? (
                    <pre className="text-sm font-mono">{output}</pre>
                  ) : (
                    <pre className="text-sm font-mono">{output}</pre>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOutputs.length > 0 ? (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {recentOutputs.map((text, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">Generated #{index + 1}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setOutput(text);
                                toast("Restored previous generation", {
                                  duration: 2000,
                                });
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-5 whitespace-pre-wrap">
                            {text.substring(0, 200)}{text.length > 200 ? "..." : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[600px] flex flex-col items-center justify-center text-center">
                    <Repeat className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No recent generations</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generate some Lorem Ipsum text to see your history here
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

export default LoremIpsumGenerator;
