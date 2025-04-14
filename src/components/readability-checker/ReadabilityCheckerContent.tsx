
import React, { useState, useEffect } from "react";
import { Calculator, BookText, BarChart3, BrainCircuit, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  gunningFog: number;
  daleChall: number;
  textStandard: string;
}

interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  readingTime: number;
  speakingTime: number;
}

const ReadabilityCheckerContent: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [readabilityScores, setReadabilityScores] = useState<ReadabilityScores>({
    fleschReadingEase: 0,
    fleschKincaidGrade: 0,
    smogIndex: 0,
    automatedReadabilityIndex: 0,
    colemanLiauIndex: 0,
    gunningFog: 0,
    daleChall: 0,
    textStandard: ""
  });
  const [textStats, setTextStats] = useState<TextStatistics>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    avgWordsPerSentence: 0,
    avgSyllablesPerWord: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [analyzeAfterTyping, setAnalyzeAfterTyping] = useState<boolean>(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Automatically analyze text after typing stops
  useEffect(() => {
    if (!analyzeAfterTyping) return;
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    if (text.trim().length > 0) {
      const timeout = setTimeout(() => {
        analyzeText();
      }, 1000); // 1-second delay
      
      setTypingTimeout(timeout);
    } else {
      // Clear results if text is empty
      resetScores();
    }
    
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [text, analyzeAfterTyping]);

  // Function to count syllables in a word
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

  // Calculate readability scores
  const analyzeText = () => {
    if (text.trim() === "") {
      resetScores();
      return;
    }

    // Basic text statistics
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Split into sentences
    const sentencesArray = text.trim().split(/[.!?]+/).filter(Boolean);
    const sentences = sentencesArray.length;
    
    // Split into words
    const wordsArray = text.trim().split(/\s+/);
    const words = wordsArray.length;
    
    // Split into paragraphs
    const paragraphsArray = text.trim().split(/\n+/).filter(s => s.trim().length > 0);
    const paragraphs = paragraphsArray.length;
    
    // Calculate average words per sentence
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    
    // Count syllables
    let totalSyllables = 0;
    let complexWords = 0; // Words with 3+ syllables
    
    wordsArray.forEach(word => {
      const syllables = countSyllables(word);
      totalSyllables += syllables;
      if (syllables >= 3) complexWords++;
    });
    
    const avgSyllablesPerWord = words > 0 ? totalSyllables / words : 0;
    
    // Calculate reading time (200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words / 200));
    
    // Calculate speaking time (130 words per minute)
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    
    // Calculate Flesch Reading Ease
    const fleschReadingEase = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * (totalSyllables / words)
    ));
    
    // Calculate Flesch-Kincaid Grade Level
    const fleschKincaidGrade = Math.max(0, 
      0.39 * avgWordsPerSentence + 11.8 * (totalSyllables / words) - 15.59
    );
    
    // Calculate SMOG Index
    const smogIndex = Math.max(0, 
      1.043 * Math.sqrt(complexWords * (30 / sentences)) + 3.1291
    );
    
    // Calculate Automated Readability Index
    const automatedReadabilityIndex = Math.max(0, 
      4.71 * (characters / words) + 0.5 * avgWordsPerSentence - 21.43
    );
    
    // Calculate Coleman-Liau Index
    const L = (characters / words) * 100; // Letters per 100 words
    const S = (sentences / words) * 100; // Sentences per 100 words
    const colemanLiauIndex = Math.max(0, 
      0.0588 * L - 0.296 * S - 15.8
    );
    
    // Calculate Gunning Fog Index
    const gunningFog = Math.max(0, 
      0.4 * (avgWordsPerSentence + 100 * (complexWords / words))
    );
    
    // Calculate Dale-Chall Score (simplified approximation)
    const daleChall = Math.max(0, 
      0.1579 * (complexWords / words * 100) + 0.0496 * avgWordsPerSentence + 3.6365
    );
    
    // Determine approximate grade level
    const grades = [
      fleschKincaidGrade,
      smogIndex,
      colemanLiauIndex,
      automatedReadabilityIndex,
      gunningFog
    ].filter(score => score <= 22); // Filter out unreasonable high scores
    
    // Average the grade levels
    const textStandard = grades.length > 0 
      ? `${Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)}th Grade`
      : "College Graduate";
    
    // Update state with calculated scores
    setReadabilityScores({
      fleschReadingEase: Number(fleschReadingEase.toFixed(1)),
      fleschKincaidGrade: Number(fleschKincaidGrade.toFixed(1)),
      smogIndex: Number(smogIndex.toFixed(1)),
      automatedReadabilityIndex: Number(automatedReadabilityIndex.toFixed(1)),
      colemanLiauIndex: Number(colemanLiauIndex.toFixed(1)),
      gunningFog: Number(gunningFog.toFixed(1)),
      daleChall: Number(daleChall.toFixed(1)),
      textStandard
    });
    
    setTextStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
      avgSyllablesPerWord: Number(avgSyllablesPerWord.toFixed(2)),
      readingTime,
      speakingTime
    });
  };

  const resetScores = () => {
    setReadabilityScores({
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      smogIndex: 0,
      automatedReadabilityIndex: 0,
      colemanLiauIndex: 0,
      gunningFog: 0,
      daleChall: 0,
      textStandard: ""
    });
    
    setTextStats({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      readingTime: 0,
      speakingTime: 0
    });
  };

  const clearText = () => {
    if (text.trim() === "") return;
    if (confirm("Are you sure you want to clear all text?")) {
      setText("");
      resetScores();
      toast.success("Text cleared");
    }
  };

  const copyText = () => {
    if (text.trim() === "") return;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  // Get a description for the Flesch Reading Ease score
  const getFleschReadingEaseDescription = (score: number): string => {
    if (score >= 90) return "Very Easy - 5th Grade";
    if (score >= 80) return "Easy - 6th Grade";
    if (score >= 70) return "Fairly Easy - 7th Grade";
    if (score >= 60) return "Standard - 8th-9th Grade";
    if (score >= 50) return "Fairly Difficult - 10th-12th Grade";
    if (score >= 30) return "Difficult - College";
    return "Very Difficult - College Graduate";
  };

  // Utility to render score bars with appropriate colors
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Text Analyzer</CardTitle>
              <CardDescription>
                Enter text to analyze its readability level and get recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <Badge variant="outline" className="mr-2">
                    Words: {textStats.words}
                  </Badge>
                  <Badge variant="outline">
                    Sentences: {textStats.sentences}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyText} disabled={text.length === 0}>
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearText} disabled={text.length === 0}>
                    Clear
                  </Button>
                </div>
              </div>
              <textarea
                className="w-full h-64 rounded-md border border-border p-3 font-mono text-sm bg-muted/20 focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Type or paste your text here to analyze its readability..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-analyze"
                    className="mr-2"
                    checked={analyzeAfterTyping}
                    onChange={(e) => setAnalyzeAfterTyping(e.target.checked)}
                  />
                  <label htmlFor="auto-analyze" className="text-sm">
                    Analyze automatically after typing
                  </label>
                </div>
                
                {!analyzeAfterTyping && (
                  <Button onClick={analyzeText} disabled={text.trim() === ""}>
                    Analyze Text
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                Readability Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {textStats.words === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  Enter text to view readability scores
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Education Level Required
                    </div>
                    <div className="text-3xl font-bold text-indigo-500">
                      {readabilityScores.textStandard}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Flesch Reading Ease</span>
                        <span className="font-medium">{readabilityScores.fleschReadingEase}</span>
                      </div>
                      {renderScoreBar(readabilityScores.fleschReadingEase)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getFleschReadingEaseDescription(readabilityScores.fleschReadingEase)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reading Time</span>
                        <span>{textStats.readingTime} min</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${Math.min(100, (textStats.readingTime / 10) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Text Complexity</div>
                    <div className="text-sm text-muted-foreground">
                      {textStats.avgWordsPerSentence === 0 ? "No data" : 
                        textStats.avgWordsPerSentence <= 14 ? "Simple" :
                        textStats.avgWordsPerSentence <= 18 ? "Standard" : "Complex"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Words per Sentence</div>
                    <div className="text-sm text-muted-foreground">
                      {textStats.avgWordsPerSentence || 0}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Syllables per Word</div>
                    <div className="text-sm text-muted-foreground">
                      {textStats.avgSyllablesPerWord || 0}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scores">Detailed Scores</TabsTrigger>
          <TabsTrigger value="statistics">Text Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scores">
          <Card>
            <CardContent className="pt-6">
              {textStats.words === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  Enter text to view detailed readability scores
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-3">Readability Formulas</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Flesch Reading Ease: {readabilityScores.fleschReadingEase}</h4>
                      {renderScoreBar(readabilityScores.fleschReadingEase)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Scores between 60-70 are considered optimal for general audiences. Higher scores indicate easier text.
                        The score of {readabilityScores.fleschReadingEase} suggests your text is {' '}
                        {readabilityScores.fleschReadingEase >= 90 ? "very easy to read" :
                          readabilityScores.fleschReadingEase >= 80 ? "easy to read" :
                          readabilityScores.fleschReadingEase >= 70 ? "fairly easy to read" :
                          readabilityScores.fleschReadingEase >= 60 ? "standard difficulty" :
                          readabilityScores.fleschReadingEase >= 50 ? "fairly difficult" :
                          readabilityScores.fleschReadingEase >= 30 ? "difficult" : "very difficult"}.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Flesch-Kincaid Grade Level: {readabilityScores.fleschKincaidGrade}</h4>
                      {renderScoreBar(readabilityScores.fleschKincaidGrade, 18, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Indicates the U.S. grade level needed to understand your text. A score of {readabilityScores.fleschKincaidGrade} means
                        the text is appropriate for {readabilityScores.fleschKincaidGrade < 13 ? 
                          `grade ${Math.ceil(readabilityScores.fleschKincaidGrade)}` : 
                          "college-level"} readers.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">SMOG Index: {readabilityScores.smogIndex}</h4>
                      {renderScoreBar(readabilityScores.smogIndex, 18, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Estimates the years of education needed to understand the text. SMOG is often used for health materials.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Coleman-Liau Index: {readabilityScores.colemanLiauIndex}</h4>
                      {renderScoreBar(readabilityScores.colemanLiauIndex, 18, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on character count rather than syllables. Designed to be easily computed mechanically.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Automated Readability Index: {readabilityScores.automatedReadabilityIndex}</h4>
                      {renderScoreBar(readabilityScores.automatedReadabilityIndex, 18, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Uses characters per word and words per sentence to estimate grade level.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Gunning Fog Index: {readabilityScores.gunningFog}</h4>
                      {renderScoreBar(readabilityScores.gunningFog, 18, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Estimates the years of formal education needed to understand text on first reading.
                        Scores greater than 12 indicate complex text.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Dale-Chall Score: {readabilityScores.daleChall}</h4>
                      {renderScoreBar(readabilityScores.daleChall, 10, true)}
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on word familiarity and sentence length. Scores above 9.0 indicate college-level text.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card>
            <CardContent className="pt-6">
              {textStats.words === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  Enter text to view text statistics
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-3">Text Analysis</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Characters</div>
                      <div className="font-medium">{textStats.characters}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
                      <div className="font-medium">{textStats.charactersNoSpaces}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Words</div>
                      <div className="font-medium">{textStats.words}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Sentences</div>
                      <div className="font-medium">{textStats.sentences}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Paragraphs</div>
                      <div className="font-medium">{textStats.paragraphs}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">Avg. Word Length</div>
                      <div className="font-medium">
                        {textStats.words > 0 ? (textStats.charactersNoSpaces / textStats.words).toFixed(1) : "0"} chars
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">Reading Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/20 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5 text-indigo-500" />
                          <div className="font-medium">Reading Time</div>
                        </div>
                        <div className="text-3xl font-semibold">
                          {textStats.readingTime} <span className="text-lg text-muted-foreground">min</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Based on 200 words per minute
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted/20 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator className="h-5 w-5 text-indigo-500" />
                          <div className="font-medium">Text Complexity</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm">Words per sentence:</div>
                            <div className="font-medium">{textStats.avgWordsPerSentence}</div>
                          </div>
                          <div className="h-10 w-px bg-muted-foreground/30"></div>
                          <div>
                            <div className="text-sm">Syllables per word:</div>
                            <div className="font-medium">{textStats.avgSyllablesPerWord}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-500/10 rounded-lg mt-4">
                    <div className="flex items-start gap-2">
                      <BrainCircuit className="h-5 w-5 mt-0.5 text-indigo-500" />
                      <div>
                        <h4 className="text-sm font-medium">Recommendations</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {textStats.avgWordsPerSentence > 20 ? 
                            "Consider using shorter sentences to improve readability. Aim for an average of 15-20 words per sentence." :
                            "Your sentence length is good for readability."}
                          {' '}
                          {textStats.avgSyllablesPerWord > 1.7 ?
                            "Try using simpler words with fewer syllables where possible." :
                            "Your word choice has a good balance of simplicity and precision."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadabilityCheckerContent;
