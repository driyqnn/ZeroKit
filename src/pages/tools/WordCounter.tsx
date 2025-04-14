
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { AlignJustify, Copy, Trash, Clock, FileText, BarChart3, Calculator, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  mostCommonWords: { word: string; count: number }[];
  readability: {
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    smogIndex: number;
    automatedReadabilityIndex: number;
    colemanLiauIndex: number;
    gunningFog: number;
  };
  density: {
    charsPerWord: number;
    wordsPerSentence: number;
    sentencesPerParagraph: number;
  };
  wordLengthDistribution: Record<number, number>;
}

// Readability scoring utilities
const calculateReadabilityScores = (text: string, wordCount: number, sentenceCount: number, syllableCount: number): Stats['readability'] => {
  if (wordCount === 0 || sentenceCount === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      smogIndex: 0,
      automatedReadabilityIndex: 0,
      colemanLiauIndex: 0,
      gunningFog: 0
    };
  }

  // Count characters
  const charCount = text.length;
  
  // Calculate Flesch Reading Ease
  const fleschReadingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  
  // Calculate Flesch-Kincaid Grade Level
  const fleschKincaidGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  
  // Calculate SMOG Index
  const smogIndex = 1.043 * Math.sqrt(syllableCount * (30 / sentenceCount)) + 3.1291;
  
  // Calculate Automated Readability Index
  const automatedReadabilityIndex = 4.71 * (charCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
  
  // Calculate Coleman-Liau Index
  const colemanLiauIndex = 5.88 * (charCount / wordCount) - 29.6 * (sentenceCount / wordCount) - 15.8;
  
  // Calculate Gunning Fog
  const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (syllableCount / wordCount));
  
  return {
    fleschReadingEase: Math.max(0, Math.min(100, Number(fleschReadingEase.toFixed(1)))),
    fleschKincaidGrade: Math.max(0, Number(fleschKincaidGrade.toFixed(1))),
    smogIndex: Math.max(0, Number(smogIndex.toFixed(1))),
    automatedReadabilityIndex: Math.max(0, Number(automatedReadabilityIndex.toFixed(1))),
    colemanLiauIndex: Math.max(0, Number(colemanLiauIndex.toFixed(1))),
    gunningFog: Math.max(0, Number(gunningFog.toFixed(1)))
  };
};

// Count syllables in a word
const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  
  // Special cases
  if (word.length <= 3) return 1;
  
  // Remove trailing 'e'
  word = word.replace(/e$/, '');
  
  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
};

const WordCounter = () => {
  const [text, setText] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    mostCommonWords: [],
    readability: {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      smogIndex: 0,
      automatedReadabilityIndex: 0,
      colemanLiauIndex: 0,
      gunningFog: 0
    },
    density: {
      charsPerWord: 0,
      wordsPerSentence: 0,
      sentencesPerParagraph: 0
    },
    wordLengthDistribution: {}
  });
  const [autoCount, setAutoCount] = useState<boolean>(true);

  // Use useEffect to calculate stats whenever text changes and autoCount is true
  useEffect(() => {
    if (autoCount) {
      calculateStats();
    }
  }, [text, autoCount]);

  const calculateStats = () => {
    // Characters (with and without spaces)
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Words
    const wordsArray = text.trim() === "" ? [] : text.trim().split(/\s+/);
    const words = wordsArray.length;

    // Sentences (basic approximation)
    const sentencesArray = text.trim() === "" ? [] : text.split(/[.!?]+/).filter(Boolean);
    const sentences = sentencesArray.length;

    // Paragraphs
    const paragraphsArray = text.trim() === "" ? [] : text.split(/\n+/).filter(s => s.trim().length > 0);
    const paragraphs = paragraphsArray.length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words / 200));
    
    // Speaking time (average 130 words per minute)
    const speakingTime = Math.max(1, Math.ceil(words / 130));

    // Calculate syllables for readability formulas
    let totalSyllables = 0;
    const wordLengthDistribution: Record<number, number> = {};
    
    if (words > 0) {
      wordsArray.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9]/gi, "");
        const syllables = countSyllables(cleanWord);
        totalSyllables += syllables;
        
        // Track word length distribution
        const length = cleanWord.length;
        if (length > 0) {
          wordLengthDistribution[length] = (wordLengthDistribution[length] || 0) + 1;
        }
      });
    }

    // Calculate readability scores
    const readabilityScores = calculateReadabilityScores(text, words, sentences, totalSyllables);

    // Most common words (excluding very common ones)
    const commonStopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "to", "for", "of", "with", 
      "by", "as", "is", "are", "was", "were", "be", "been", "being", 
      "have", "has", "had", "do", "does", "did", "but", "or", "so", "not", "no", "this", "that"
    ]);

    const wordFrequency: Record<string, number> = {};
    if (text.trim() !== "") {
      text.trim().toLowerCase()
        .split(/\s+/)
        .filter(word => {
          const cleanWord = word.replace(/[^a-z0-9]/gi, "");
          return cleanWord.length > 2 && !commonStopWords.has(cleanWord.toLowerCase());
        })
        .forEach(word => {
          const cleanWord = word.replace(/[^a-z0-9]/gi, "").toLowerCase();
          if (cleanWord) {
            wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
          }
        });
    }

    const mostCommonWords = Object.entries(wordFrequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate text density metrics
    const charsPerWord = words > 0 ? characters / words : 0;
    const wordsPerSentence = sentences > 0 ? words / sentences : 0;
    const sentencesPerParagraph = paragraphs > 0 ? sentences / paragraphs : 0;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      mostCommonWords,
      readability: readabilityScores,
      density: {
        charsPerWord,
        wordsPerSentence,
        sentencesPerParagraph
      },
      wordLengthDistribution
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    if (text.trim() === "") return;
    if (confirm("Are you sure you want to clear all text?")) {
      setText("");
      toast.success("Text cleared");
    }
  };

  const copyText = () => {
    if (text.trim() === "") return;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  // Render a readability score bar with color based on the score value
  const renderScoreBar = (score: number, max: number = 100, reverse: boolean = false) => {
    const percentage = Math.min(100, (score / max) * 100);
    
    let colorClass = "bg-yellow-500";
    if (reverse) {
      if (percentage < 30) colorClass = "bg-green-500";
      else if (percentage < 70) colorClass = "bg-yellow-500";
      else colorClass = "bg-red-500";
    } else {
      if (percentage > 70) colorClass = "bg-green-500";
      else if (percentage > 30) colorClass = "bg-yellow-500";
      else colorClass = "bg-red-500";
    }
    
    return (
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    );
  };

  // Get descriptive text for Flesch Reading Ease score
  const getFleschReadingEaseDescription = (score: number): string => {
    if (score >= 90) return "Very Easy - 5th Grade";
    if (score >= 80) return "Easy - 6th Grade";
    if (score >= 70) return "Fairly Easy - 7th Grade";
    if (score >= 60) return "Standard - 8th-9th Grade";
    if (score >= 50) return "Fairly Difficult - 10th-12th Grade";
    if (score >= 30) return "Difficult - College";
    return "Very Difficult - College Graduate";
  };

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, and analyze text statistics"
      icon={<AlignJustify className="h-6 w-6 text-violet-500" />}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Text Input</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={copyText} disabled={text.length === 0}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearText} disabled={text.length === 0}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <textarea
                  className="w-full h-64 rounded-md border border-border p-3 font-mono text-sm bg-muted/20 focus:border-violet-500 focus:ring-violet-500 outline-none resize-none"
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={handleTextChange}
                  spellCheck={true}
                />
                <div className="flex justify-between mt-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autocount"
                      checked={autoCount}
                      onCheckedChange={setAutoCount}
                    />
                    <Label htmlFor="autocount">Auto-count</Label>
                  </div>
                  {!autoCount && (
                    <Button size="sm" onClick={calculateStats}>
                      Count Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Words</div>
                    <div className="font-medium text-xl">{stats.words}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Characters</div>
                    <div className="font-medium text-xl">{stats.characters}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Sentences</div>
                    <div className="font-medium text-xl">{stats.sentences}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                    <div className="font-medium text-xl">{stats.paragraphs}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Reading Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Reading Time</div>
                      <div className="text-sm text-muted-foreground">~{stats.readingTime} minute{stats.readingTime !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Speaking Time</div>
                      <div className="text-sm text-muted-foreground">~{stats.speakingTime} minute{stats.speakingTime !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Readability</div>
                      <div className="text-sm text-muted-foreground">
                        {stats.readability.fleschReadingEase > 0 
                          ? getFleschReadingEaseDescription(stats.readability.fleschReadingEase)
                          : "Add more text for analysis"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="detailed" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detailed">Detailed Statistics</TabsTrigger>
            <TabsTrigger value="readability">Readability Analysis</TabsTrigger>
            <TabsTrigger value="frequency">Word Frequency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detailed">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Detailed Text Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Characters (with spaces)</div>
                    <div className="font-medium">{stats.characters}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
                    <div className="font-medium">{stats.charactersNoSpaces}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Words</div>
                    <div className="font-medium">{stats.words}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Sentences</div>
                    <div className="font-medium">{stats.sentences}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                    <div className="font-medium">{stats.paragraphs}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="text-sm text-muted-foreground">Avg words per sentence</div>
                    <div className="font-medium">
                      {stats.sentences ? (stats.words / stats.sentences).toFixed(1) : 0}
                    </div>
                  </div>
                </div>
                
                {text.trim() !== "" && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Text Density</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Characters per word</span>
                          <span>{stats.density.charsPerWord.toFixed(1)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500" 
                            style={{ width: `${Math.min(100, (stats.density.charsPerWord / 10) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Words per sentence</span>
                          <span>{stats.density.wordsPerSentence.toFixed(1)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500" 
                            style={{ width: `${Math.min(100, (stats.density.wordsPerSentence / 30) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sentences per paragraph</span>
                          <span>{stats.density.sentencesPerParagraph.toFixed(1)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500" 
                            style={{ width: `${Math.min(100, (stats.density.sentencesPerParagraph / 10) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {Object.keys(stats.wordLengthDistribution).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Word Length Distribution</h4>
                    <div className="flex h-40 items-end gap-1">
                      {Object.entries(stats.wordLengthDistribution)
                        .sort(([lengthA], [lengthB]) => Number(lengthA) - Number(lengthB))
                        .map(([length, count]) => {
                          const maxCount = Math.max(...Object.values(stats.wordLengthDistribution));
                          const percentage = (count / maxCount) * 100;
                          return (
                            <div 
                              key={length} 
                              className="relative flex-1 bg-violet-500/20 hover:bg-violet-500/40 transition-colors"
                              style={{ height: `${percentage}%` }}
                            >
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs">{length}</div>
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-75">{count}</div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                      Word length (top) and frequency (bottom)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="readability">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Readability Analysis</h3>
                
                {stats.words < 10 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Add more text (at least 10 words) for readability analysis.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <div>
                            <span className="font-medium">Flesch Reading Ease: </span>
                            <span className="text-lg">{stats.readability.fleschReadingEase}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {getFleschReadingEaseDescription(stats.readability.fleschReadingEase)}
                          </span>
                        </div>
                        {renderScoreBar(stats.readability.fleschReadingEase)}
                        <p className="text-xs text-muted-foreground mt-1">
                          Higher score means easier to read (0-100)
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Flesch-Kincaid Grade Level: </span>
                            <span>{stats.readability.fleschKincaidGrade}</span>
                          </div>
                        </div>
                        {renderScoreBar(stats.readability.fleschKincaidGrade, 18, true)}
                        <p className="text-xs text-muted-foreground mt-1">
                          U.S. grade level needed to understand the text
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">SMOG Index: </span>
                            <span>{stats.readability.smogIndex}</span>
                          </div>
                        </div>
                        {renderScoreBar(stats.readability.smogIndex, 18, true)}
                        <p className="text-xs text-muted-foreground mt-1">
                          Years of education needed to understand the text
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Coleman-Liau Index: </span>
                            <span>{stats.readability.colemanLiauIndex}</span>
                          </div>
                        </div>
                        {renderScoreBar(stats.readability.colemanLiauIndex, 18, true)}
                        <p className="text-xs text-muted-foreground mt-1">
                          U.S. grade level needed (based on character count)
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Automated Readability Index: </span>
                            <span>{stats.readability.automatedReadabilityIndex}</span>
                          </div>
                        </div>
                        {renderScoreBar(stats.readability.automatedReadabilityIndex, 18, true)}
                        <p className="text-xs text-muted-foreground mt-1">
                          U.S. grade level to understand text (character-based)
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Gunning Fog Index: </span>
                            <span>{stats.readability.gunningFog}</span>
                          </div>
                        </div>
                        {renderScoreBar(stats.readability.gunningFog, 18, true)}
                        <p className="text-xs text-muted-foreground mt-1">
                          Years of formal education needed to understand text
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="h-5 w-5 text-violet-500" />
                        <h4 className="font-medium">About Readability Scores</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Readability scores help assess how easy or difficult a text is to read.
                        Higher Flesch Reading Ease scores indicate easier text, while lower grade levels
                        suggest broader accessibility. Most popular content aims for a Flesch score of 60-70,
                        equivalent to 8th-9th grade level.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="frequency">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Word Frequency Analysis</h3>
                
                {stats.mostCommonWords.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No word frequency data available. Add more text to analyze.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium">Most Common Words</h4>
                    <div className="space-y-2">
                      {stats.mostCommonWords.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-28 text-sm truncate">{item.word}</div>
                          <div className="flex-grow">
                            <div className="h-6 bg-violet-500/20 rounded-sm" style={{ width: `${(item.count / stats.mostCommonWords[0].count) * 100}%` }}>
                              <div className="h-full bg-violet-500/40 flex items-center px-2 text-xs">
                                {item.count}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-md mt-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        <h4 className="font-medium">Distribution</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        This analysis excludes common stop words like "the", "and", "of", etc. to focus on more meaningful content words.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="p-4 bg-muted/30 rounded-lg mt-6">
          <h3 className="font-medium mb-2">About Text Analysis</h3>
          <p className="text-sm text-muted-foreground">
            This tool counts words, characters, sentences, and paragraphs in your text, and analyzes readability using various formulas
            including Flesch Reading Ease, Flesch-Kincaid Grade Level, and more. It also calculates estimated reading and speaking times
            based on average rates (200 and 130 words per minute, respectively). Use it for essays, articles, blog posts, and content optimization.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default WordCounter;
