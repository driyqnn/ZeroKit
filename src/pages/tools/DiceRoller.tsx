
import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from "@/components/ToolLayout";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Plus, Minus, Play, RefreshCcw, BookCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AnimatePresence, motion } from "framer-motion";

interface DiceResult {
  id: number;
  sides: number;
  result: number;
  timestamp: number;
}

interface HistoryEntry {
  id: number;
  dice: number[];
  sides: number;
  results: number[];
  sum: number;
  timestamp: number;
}

// Map dice value to components
const DiceIcons: Record<number, React.ReactNode> = {
  1: <Dice1 className="h-12 w-12 text-white" />,
  2: <Dice2 className="h-12 w-12 text-white" />,
  3: <Dice3 className="h-12 w-12 text-white" />,
  4: <Dice4 className="h-12 w-12 text-white" />,
  5: <Dice5 className="h-12 w-12 text-white" />,
  6: <Dice6 className="h-12 w-12 text-white" />
};

const DiceRoller = () => {
  const { toast } = useToast();
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceSides, setDiceSides] = useState<number>(6);
  const [results, setResults] = useState<DiceResult[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [totalSum, setTotalSum] = useState<number | null>(null);

  const handleRollDice = () => {
    if (diceCount <= 0) {
      toast({
        title: "Invalid dice count",
        description: "Please select at least one die to roll",
        variant: "destructive"
      });
      return;
    }

    setIsRolling(true);
    setResults([]);

    const tempResults: DiceResult[] = Array.from({ length: diceCount }, (_, i) => ({
      id: i,
      sides: diceSides,
      result: 1,
      timestamp: Date.now()
    }));
    setResults(tempResults);

    const rollDuration = 1000;
    const animationFrames = 10;
    let frame = 0;

    const animateRoll = () => {
      if (frame < animationFrames) {
        setResults(prevResults => 
          prevResults.map(die => ({
            ...die,
            result: Math.floor(Math.random() * diceSides) + 1
          }))
        );
        frame++;
        setTimeout(animateRoll, rollDuration / animationFrames);
      } else {
        // Final results
        const finalResults = Array.from({ length: diceCount }, (_, i) => ({
          id: i,
          sides: diceSides,
          result: Math.floor(Math.random() * diceSides) + 1,
          timestamp: Date.now()
        }));

        setResults(finalResults);
        
        const sum = finalResults.reduce((acc, die) => acc + die.result, 0);
        setTotalSum(sum);
        
        const newHistoryEntry: HistoryEntry = {
          id: Date.now(),
          dice: Array(diceCount).fill(1),
          sides: diceSides,
          results: finalResults.map(r => r.result),
          sum,
          timestamp: Date.now()
        };
        
        setHistory(prevHistory => [newHistoryEntry, ...prevHistory].slice(0, 10));
        
        // Important: Set isRolling to false BEFORE showing the toast
        setIsRolling(false);
        
        toast({
          title: `Rolled ${diceCount}d${diceSides}`,
          description: `Total: ${sum}`
        });
      }
    };

    animateRoll();
  };

  const handleCustomRoll = (sides: number) => {
    setDiceSides(sides);
    setDiceCount(1);
    setTimeout(() => {
      handleRollDice();
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History cleared",
      description: "Roll history has been cleared"
    });
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dice-container {
        perspective: 600px;
      }
      
      .dice {
        position: relative;
        width: 60px;
        height: 60px;
        background: linear-gradient(145deg, #8B5CF6, #7C3AED);
        border-radius: 10%;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        display: grid;
        grid-template: repeat(3, 1fr) / repeat(3, 1fr);
        padding: 8px;
      }
      
      .dot {
        background-color: white;
        border-radius: 50%;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      }
      
      .d6 .center { grid-area: 2 / 2 / 3 / 3; }
      .d6 .top-left { grid-area: 1 / 1 / 2 / 2; }
      .d6 .top-right { grid-area: 1 / 3 / 2 / 4; }
      .d6 .middle-left { grid-area: 2 / 1 / 3 / 2; }
      .d6 .middle-right { grid-area: 2 / 3 / 3 / 4; }
      .d6 .bottom-left { grid-area: 3 / 1 / 4 / 2; }
      .d6 .bottom-right { grid-area: 3 / 3 / 4 / 4; }
      
      .dice-rolling {
        animation: roll 0.5s infinite;
      }
      
      @keyframes roll {
        0% { transform: rotateX(0deg) rotateY(0deg); }
        25% { transform: rotateX(90deg) rotateY(45deg); }
        50% { transform: rotateX(180deg) rotateY(90deg); }
        75% { transform: rotateX(270deg) rotateY(135deg); }
        100% { transform: rotateX(360deg) rotateY(180deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ToolLayout
      title="Dice Roller"
      description="Roll virtual dice for games and decisions"
      icon={<Dice1 className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border border-zinc-700/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Dice Settings</h3>
                
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    Number of Dice: <span className="font-bold">{diceCount}</span>
                  </Label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                      disabled={diceCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Slider
                      className="mx-4"
                      value={[diceCount]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setDiceCount(value[0])}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setDiceCount(Math.min(10, diceCount + 1))}
                      disabled={diceCount >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diceSides">Dice Type</Label>
                  <Select 
                    value={diceSides.toString()} 
                    onValueChange={(value) => setDiceSides(Number(value))}
                  >
                    <SelectTrigger id="diceSides">
                      <SelectValue placeholder="Select dice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">D4 - Four sided</SelectItem>
                      <SelectItem value="6">D6 - Six sided</SelectItem>
                      <SelectItem value="8">D8 - Eight sided</SelectItem>
                      <SelectItem value="10">D10 - Ten sided</SelectItem>
                      <SelectItem value="12">D12 - Twelve sided</SelectItem>
                      <SelectItem value="20">D20 - Twenty sided</SelectItem>
                      <SelectItem value="100">D100 - Hundred sided</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    onClick={handleRollDice}
                    disabled={isRolling}
                  >
                    {isRolling ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Rolling...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" /> Roll Dice
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleCustomRoll(6)} title="Roll a D6">D6</Button>
                  <Button variant="outline" size="sm" onClick={() => handleCustomRoll(20)} title="Roll a D20">D20</Button>
                  <Button variant="outline" size="sm" onClick={() => handleCustomRoll(100)} title="Roll a D100">D100</Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Current Roll</h3>
                <div className="flex flex-wrap justify-center gap-4 min-h-[150px] items-center">
                  <AnimatePresence mode="wait">
                    {results.length > 0 ? (
                      results.map((die) => (
                        <motion.div 
                          key={die.id}
                          initial={{ y: -50, opacity: 0, rotateX: 0, rotateY: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1, 
                            rotateX: isRolling ? [0, 90, 180, 270, 360] : 0,
                            rotateY: isRolling ? [0, 90, 180, 270, 360] : 0
                          }}
                          exit={{ y: 50, opacity: 0 }}
                          transition={{ 
                            type: "spring",
                            duration: isRolling ? 0.5 : 0.3,
                            repeat: isRolling ? Infinity : 0
                          }}
                          className="dice-container"
                        >
                          {die.sides === 6 && die.result >= 1 && die.result <= 6 ? (
                            <div className={`relative w-[60px] h-[60px] flex items-center justify-center bg-gradient-to-br from-primary to-primary-foreground/80 rounded-xl shadow-lg ${isRolling ? 'dice-rolling' : ''}`}>
                              {DiceIcons[die.result]}
                            </div>
                          ) : (
                            <div className="relative w-[60px] h-[60px] flex items-center justify-center bg-gradient-to-br from-primary to-primary-foreground/80 rounded-full shadow-lg">
                              <span className="text-lg font-bold text-white">{die.result}</span>
                              <span className="absolute -bottom-6 text-xs text-center w-full">D{die.sides}</span>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Click "Roll Dice" to start
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                
                {totalSum !== null && results.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6"
                  >
                    <div className="text-lg font-medium">
                      Total: <span className="font-bold text-primary text-2xl">{totalSum}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {results.map(r => r.result).join(' + ')} = {totalSum}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-700/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Roll History</h3>
              <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
            
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No roll history yet
                </div>
              ) : (
                history.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-3 border border-zinc-700/50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">
                        {entry.dice.length}d{entry.sides}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Results: {entry.results.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        Total: {entry.sum}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted/30 rounded-md border border-zinc-700/50">
          <h3 className="font-medium flex items-center gap-2">
            <BookCopy className="h-5 w-5" />
            About Dice Notation
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Dice notation, such as <span className="font-mono text-primary">3d6</span>, is a system used in tabletop RPGs where the number before 'd' indicates how many dice to roll, and the number after 'd' indicates the number of sides on each die. So <span className="font-mono text-primary">3d6</span> means "roll three six-sided dice and add the results together".
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};

export default DiceRoller;
