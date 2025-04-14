
import React, { useState } from "react";
import { AlignJustify, Copy, BarChart, FileText, Check, X } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const CharacterCounter = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("stats");

  const textStats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
    sentences: text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length,
    lines: text.trim() === "" ? 0 : text.split(/\n/).length
  };

  const charactersFrequency = () => {
    if (!text) return [];
    
    const charMap: Record<string, number> = {};
    const cleanText = text.toLowerCase();
    
    for (let char of cleanText) {
      if (char !== ' ' && char !== '\n') {
        charMap[char] = (charMap[char] || 0) + 1;
      }
    }
    
    return Object.entries(charMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText("");
    toast({
      title: "Text Cleared",
      description: "The text area has been cleared",
    });
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Pasted!",
        description: "Text pasted from clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Paste Failed",
        description: "Could not access clipboard",
      });
    }
  };

  // Calculate averages
  const averageWordLength = textStats.words === 0 
    ? 0 
    : (textStats.charactersNoSpaces / textStats.words).toFixed(1);
    
  const averageSentenceLength = textStats.sentences === 0 
    ? 0 
    : (textStats.words / textStats.sentences).toFixed(1);

  // Sample texts for the examples tab
  const sampleTexts = [
    {
      name: "Lorem Ipsum",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nisl nunc vitae nunc. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nisl nunc vitae nunc."
    },
    {
      name: "Short Paragraph",
      text: "This is a short paragraph to demonstrate the character counter tool. It contains a few sentences and should provide some basic statistics."
    },
    {
      name: "Multiple Paragraphs",
      text: "This is the first paragraph.\n\nThis is the second paragraph.\n\nAnd this is the third paragraph with multiple sentences. It demonstrates how the tool counts paragraphs and lines."
    }
  ];

  return (
    <ToolLayout
      title="Character Counter"
      description="Count characters, words, and analyze your text"
      icon={<AlignJustify className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Text</CardTitle>
              <CardDescription>Enter or paste text below to analyze</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePaste}>
                Paste
              </Button>
              <Button variant="outline" size="sm" onClick={clearText}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your text here..."
              className="min-h-[200px] font-mono text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {textStats.characters} characters, {textStats.words} words
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!text}
                className="flex gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="frequency">Character Frequency</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Text Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Characters</h3>
                    <div className="text-2xl font-bold">{textStats.characters}</div>
                    <Progress value={Math.min(100, (textStats.characters / 10))} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Characters (no spaces)</h3>
                    <div className="text-2xl font-bold">{textStats.charactersNoSpaces}</div>
                    <Progress value={Math.min(100, (textStats.charactersNoSpaces / 10))} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Words</h3>
                    <div className="text-2xl font-bold">{textStats.words}</div>
                    <Progress value={Math.min(100, (textStats.words / 5))} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sentences</h3>
                    <div className="text-2xl font-bold">{textStats.sentences}</div>
                    <Progress value={Math.min(100, (textStats.sentences / 2))} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Paragraphs</h3>
                    <div className="text-2xl font-bold">{textStats.paragraphs}</div>
                    <Progress value={Math.min(100, (textStats.paragraphs / 1))} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lines</h3>
                    <div className="text-2xl font-bold">{textStats.lines}</div>
                    <Progress value={Math.min(100, (textStats.lines / 2))} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-4">Averages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-md bg-muted/10 border">
                      <div className="text-sm text-muted-foreground">Avg. Word Length</div>
                      <div className="text-xl font-medium mt-1">{averageWordLength} characters</div>
                    </div>
                    <div className="p-4 rounded-md bg-muted/10 border">
                      <div className="text-sm text-muted-foreground">Avg. Sentence Length</div>
                      <div className="text-xl font-medium mt-1">{averageSentenceLength} words</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="frequency">
            <Card>
              <CardHeader>
                <CardTitle>Character Frequency</CardTitle>
                <CardDescription>Most frequent characters in your text</CardDescription>
              </CardHeader>
              <CardContent>
                {text.length > 0 ? (
                  <div className="space-y-4">
                    {charactersFrequency().map(([char, count], index) => (
                      <div key={index} className="flex items-center">
                        <div className="min-w-[40px] w-[40px] text-lg font-mono text-center mr-4 p-2 rounded bg-muted/20">
                          {char === "\n" ? "↵" : char}
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={(count / text.length) * 100} 
                            className="h-4" 
                          />
                        </div>
                        <span className="ml-4 min-w-[60px] text-right font-mono text-sm">
                          {count} ({((count / text.length) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <BarChart className="h-16 w-16 mb-4 opacity-20" />
                    <p>Enter some text to see character frequency analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Example Texts</CardTitle>
                <CardDescription>Click on any example to load it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTexts.map((sample, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-md border hover:bg-muted/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setText(sample.text);
                        setTab("stats");
                        toast({
                          title: "Example Loaded",
                          description: `Loaded "${sample.name}" example`,
                        });
                      }}
                    >
                      <h3 className="font-medium mb-1 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {sample.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{sample.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default CharacterCounter;
