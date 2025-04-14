
import React, { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Keyboard, RefreshCw, Clock, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Sample texts for typing test
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the process of creating instructions that tell a computer how to perform a task.",
  "Learning to type quickly and accurately is an essential skill for productivity in the digital age.",
  "Artificial intelligence is transforming how we interact with technology.",
  "Cloud computing has revolutionized how businesses store data and scale operations.",
  "Cybersecurity is increasingly important as more of our lives move to digital platforms.",
  "Responsive design ensures websites look good on all devices.",
  "The best way to predict the future is to invent it.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
];

interface Stats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}

const TypingSpeedTest = () => {
  const [text, setText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    timeElapsed: 0
  });
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeLimit, setTimeLimit] = useState<number>(60); // in seconds
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [highscores, setHighscores] = useState<{ wpm: number, accuracy: number, date: string }[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize with a random text
  useEffect(() => {
    pickRandomText();
    loadHighscores();
  }, []);
  
  const loadHighscores = () => {
    const savedScores = localStorage.getItem('typing-test-highscores');
    if (savedScores) {
      try {
        const scores = JSON.parse(savedScores);
        setHighscores(scores);
      } catch (e) {
        console.error("Error loading highscores:", e);
      }
    }
  };
  
  const saveHighscore = (score: { wpm: number, accuracy: number, date: string }) => {
    const newScores = [...highscores, score].sort((a, b) => b.wpm - a.wpm).slice(0, 5);
    setHighscores(newScores);
    localStorage.setItem('typing-test-highscores', JSON.stringify(newScores));
  };

  const pickRandomText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
  };
  
  const startTest = () => {
    setIsStarted(true);
    setIsFinished(false);
    setUserInput("");
    startTimeRef.current = Date.now();
    setTimeLeft(timeLimit);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Focus the input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const resetTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setUserInput("");
    pickRandomText();
    setTimeLeft(timeLimit);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const finishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsFinished(true);
    setIsStarted(false);
    
    // Calculate statistics
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
    
    let correctChars = 0;
    let incorrectChars = 0;
    
    // Count correct and incorrect characters
    const minLength = Math.min(userInput.length, text.length);
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }
    
    // Count remaining characters as incorrect if input is shorter than text
    if (userInput.length < text.length) {
      incorrectChars += text.length - userInput.length;
    }
    
    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    
    // Words per minute: we consider a word to be 5 characters
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    
    const newStats = {
      wpm,
      accuracy: Math.round(accuracy),
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed: Math.round(timeElapsed)
    };
    
    setStats(newStats);
    
    // Save highscore if it's better than any existing ones or if we have less than 5
    if (highscores.length < 5 || highscores.some(score => score.wpm < wpm)) {
      saveHighscore({
        wpm,
        accuracy: Math.round(accuracy),
        date: new Date().toLocaleDateString()
      });
      toast.success("New high score!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setUserInput(input);
    
    // If the user has typed the entire text, finish the test
    if (input === text) {
      finishTest();
    }
  };
  
  const getProgressPercentage = () => {
    if (userInput.length === 0) return 0;
    return (userInput.length / text.length) * 100;
  };
  
  const setDifficultyLevel = (level: "easy" | "medium" | "hard") => {
    setDifficulty(level);
    switch (level) {
      case "easy":
        setTimeLimit(90);
        setTimeLeft(90);
        break;
      case "medium":
        setTimeLimit(60);
        setTimeLeft(60);
        break;
      case "hard":
        setTimeLimit(30);
        setTimeLeft(30);
        break;
    }
  };

  // Render each character with correct/incorrect highlighting
  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = "text-muted-foreground";
      
      if (index < userInput.length) {
        if (char === userInput[index]) {
          className = "text-green-600 font-medium";
        } else {
          className = "text-red-600 bg-red-100 font-medium";
        }
      } else if (index === userInput.length) {
        className = "text-foreground bg-blue-100";
      }
      
      return (
        <span key={index} className={className}>
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  const getWpmRating = (wpm: number) => {
    if (wpm < 20) return "Beginner";
    if (wpm < 40) return "Average";
    if (wpm < 60) return "Intermediate";
    if (wpm < 80) return "Fast";
    if (wpm < 100) return "Advanced";
    return "Professional";
  };

  return (
    <ToolLayout
      title="Typing Speed Test"
      description="Test and improve your typing speed and accuracy"
      icon={<Keyboard className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-3xl mx-auto">
        {/* Timer and Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="font-medium">
                Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            {isStarted && (
              <div>
                <span className="text-sm text-muted-foreground">Progress:</span>
              </div>
            )}
          </div>
          {isStarted && <Progress value={getProgressPercentage()} />}
        </div>
        
        {/* Test Area */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {!isStarted && !isFinished ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-4">Ready to Test Your Typing Speed?</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a difficulty level and click "Start Test" when you're ready.
                </p>
                
                <div className="flex justify-center gap-3 mb-6">
                  <Button 
                    variant={difficulty === "easy" ? "default" : "outline"} 
                    onClick={() => setDifficultyLevel("easy")}
                  >
                    Easy (90s)
                  </Button>
                  <Button 
                    variant={difficulty === "medium" ? "default" : "outline"} 
                    onClick={() => setDifficultyLevel("medium")}
                  >
                    Medium (60s)
                  </Button>
                  <Button 
                    variant={difficulty === "hard" ? "default" : "outline"} 
                    onClick={() => setDifficultyLevel("hard")}
                  >
                    Hard (30s)
                  </Button>
                </div>
                
                <Button onClick={startTest} size="lg">
                  Start Test
                </Button>
              </div>
            ) : isFinished ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2">Test Completed!</h3>
                <div className="inline-flex items-center gap-2 mb-6">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">{stats.wpm} WPM</span>
                  <span className="text-lg">-</span>
                  <span className="text-lg font-medium">{getWpmRating(stats.wpm)}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-xl font-bold">{stats.accuracy}%</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="text-xl font-bold">{stats.timeElapsed}s</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Correct</div>
                    <div className="text-xl font-bold text-green-600">{stats.correctChars}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-sm text-muted-foreground">Errors</div>
                    <div className="text-xl font-bold text-red-600">{stats.incorrectChars}</div>
                  </div>
                </div>
                
                <Button onClick={resetTest} size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fixed text display with word-wrap to prevent overflow */}
                <div className="p-4 border rounded-md bg-muted/10 font-mono text-base leading-relaxed break-words whitespace-pre-wrap">
                  {renderText()}
                </div>
                
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full h-32 p-4 border rounded-md font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Start typing here..."
                  autoFocus
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Highscores */}
        {highscores.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                <h3 className="text-lg font-medium">Top Scores</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Rank</th>
                      <th className="text-left py-2">WPM</th>
                      <th className="text-left py-2">Accuracy</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highscores.map((score, index) => (
                      <tr key={index} className={cn("border-b", index === 0 && "bg-yellow-50/30")}>
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2 font-medium">{score.wpm}</td>
                        <td className="py-2">{score.accuracy}%</td>
                        <td className="py-2 text-muted-foreground">{score.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tips */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Typing Tips</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Keep your fingers on the home row (ASDF and JKL;)</li>
            <li>Look at the screen, not at your keyboard</li>
            <li>Use all ten fingers, with each one responsible for specific keys</li>
            <li>Practice regularly to build muscle memory</li>
            <li>Focus on accuracy first, then speed will come naturally</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TypingSpeedTest;
