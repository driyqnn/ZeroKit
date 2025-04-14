
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Terminal, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface MatchResult {
  start: number;
  end: number;
  match: string;
  groups?: string[];
}

const RegexTester = () => {
  const [pattern, setPattern] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const [testText, setTestText] = useState<string>("");
  const [replacementText, setReplacementText] = useState<string>("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [replaced, setReplaced] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // Flag checkboxes
  const [globalFlag, setGlobalFlag] = useState<boolean>(true);
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState<boolean>(false);
  const [multilineFlag, setMultilineFlag] = useState<boolean>(false);
  const [dotAllFlag, setDotAllFlag] = useState<boolean>(false);
  const [unicodeFlag, setUnicodeFlag] = useState<boolean>(false);
  const [stickyFlag, setStickyFlag] = useState<boolean>(false);
  
  // Update flags when checkboxes change
  useEffect(() => {
    let newFlags = "";
    if (globalFlag) newFlags += "g";
    if (caseInsensitiveFlag) newFlags += "i";
    if (multilineFlag) newFlags += "m";
    if (dotAllFlag) newFlags += "s";
    if (unicodeFlag) newFlags += "u";
    if (stickyFlag) newFlags += "y";
    setFlags(newFlags);
  }, [globalFlag, caseInsensitiveFlag, multilineFlag, dotAllFlag, unicodeFlag, stickyFlag]);
  
  // Test the regex when pattern, flags, or text changes
  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);
  
  // Function to test the regex
  const testRegex = () => {
    setError("");
    setMatches([]);
    
    if (!pattern || !testText) return;
    
    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      
      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            start: match.index,
            end: match.index + match[0].length,
            match: match[0],
            groups: match.slice(1)
          });
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          results.push({
            start: match.index,
            end: match.index + match[0].length,
            match: match[0],
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(results);
      
      // Test replacement
      testReplacement();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex');
    }
  };
  
  // Function to test regex replacement
  const testReplacement = () => {
    if (!pattern || !testText) {
      setReplaced("");
      return;
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      const newText = testText.replace(regex, replacementText);
      setReplaced(newText);
    } catch (err) {
      console.error("Replacement error:", err);
    }
  };
  
  // Update replacement when its text changes
  useEffect(() => {
    testReplacement();
  }, [replacementText, pattern, flags, testText]);
  
  // Function to reset fields
  const resetFields = () => {
    setPattern("");
    setFlags("g");
    setTestText("");
    setReplacementText("");
    setMatches([]);
    setReplaced("");
    setError("");
    setGlobalFlag(true);
    setCaseInsensitiveFlag(false);
    setMultilineFlag(false);
    setDotAllFlag(false);
    setUnicodeFlag(false);
    setStickyFlag(false);
  };
  
  // Function to copy matches to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard");
    }).catch(err => {
      console.error("Copy failed:", err);
      toast.error("Failed to copy");
    });
  };

  return (
    <ToolLayout 
      title="Regex Tester" 
      description="Test and debug regular expressions with live matching"
      icon={<Terminal className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="regex-pattern">Regular Expression Pattern</Label>
                <div className="flex gap-2">
                  <div className="text-muted-foreground mt-2">/</div>
                  <Input
                    id="regex-pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern"
                    className="flex-1"
                  />
                  <div className="text-muted-foreground mt-2">/</div>
                  <Input
                    value={flags}
                    readOnly
                    className="w-16 bg-muted/50"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Flags</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-g"
                      checked={globalFlag}
                      onCheckedChange={(checked) => setGlobalFlag(checked === true)}
                    />
                    <Label htmlFor="flag-g">Global (g)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-i"
                      checked={caseInsensitiveFlag}
                      onCheckedChange={(checked) => setCaseInsensitiveFlag(checked === true)}
                    />
                    <Label htmlFor="flag-i">Case Insensitive (i)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-m"
                      checked={multilineFlag}
                      onCheckedChange={(checked) => setMultilineFlag(checked === true)}
                    />
                    <Label htmlFor="flag-m">Multiline (m)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-s"
                      checked={dotAllFlag}
                      onCheckedChange={(checked) => setDotAllFlag(checked === true)}
                    />
                    <Label htmlFor="flag-s">Dot All (s)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-u"
                      checked={unicodeFlag}
                      onCheckedChange={(checked) => setUnicodeFlag(checked === true)}
                    />
                    <Label htmlFor="flag-u">Unicode (u)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flag-y"
                      checked={stickyFlag}
                      onCheckedChange={(checked) => setStickyFlag(checked === true)}
                    />
                    <Label htmlFor="flag-y">Sticky (y)</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-text">Test Text</Label>
                <Textarea
                  id="test-text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to test against the regular expression"
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="replacement-text">Replacement Text</Label>
                <div className="flex gap-2">
                  <Input
                    id="replacement-text"
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                    placeholder="Enter replacement pattern (e.g. $1)"
                  />
                  <Button variant="secondary" onClick={testReplacement}>
                    Replace
                  </Button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={resetFields} 
              className="mt-6"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset All
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Matches ({matches.length})</h3>
                {matches.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(matches.map(m => m.match).join('\n'))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 border rounded-md bg-muted/20">
                      <div className="flex justify-between">
                        <div className="font-medium">Match #{index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Position: {match.start}-{match.end}
                        </div>
                      </div>
                      <div className="mt-1 font-mono text-primary break-all">
                        {match.match}
                      </div>
                      {match.groups && match.groups.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-muted-foreground">Capture Groups:</div>
                          {match.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="text-sm">
                              <span className="font-mono text-muted-foreground">${groupIndex + 1}:</span>{" "}
                              <span className="font-mono">{group}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No matches found.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Replacement Result</h3>
                {replaced && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(replaced)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {replaced ? (
                <div className="p-3 border rounded-md bg-muted/20 min-h-[200px] whitespace-pre-wrap break-all">
                  {replaced}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Enter a replacement pattern to see the result.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Regex Cheat Sheet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Basic Characters</p>
              <ul className="text-muted-foreground">
                <li><code>.</code> - Any character</li>
                <li><code>\d</code> - Digit</li>
                <li><code>\w</code> - Word character</li>
                <li><code>\s</code> - Whitespace</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Quantifiers</p>
              <ul className="text-muted-foreground">
                <li><code>*</code> - 0 or more</li>
                <li><code>+</code> - 1 or more</li>
                <li><code>?</code> - 0 or 1</li>
                <li><code>{"{n}"}</code> - Exactly n</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Groups & Ranges</p>
              <ul className="text-muted-foreground">
                <li><code>(abc)</code> - Capture group</li>
                <li><code>[abc]</code> - Character set</li>
                <li><code>[^abc]</code> - Negative set</li>
                <li><code>[a-z]</code> - Range</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RegexTester;
