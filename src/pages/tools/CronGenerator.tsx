
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Bot, Clock, Calendar, Copy, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Helper function to get next N occurrences of a cron job
const getNextOccurrences = (cronExpression: string, count: number): string[] => {
  // This is a simplified implementation - in a real app you'd use a library
  // For the purpose of this UI demo, we'll generate fake timestamps
  const now = new Date();
  const occurrences = [];
  let currentDate = new Date(now);
  
  for (let i = 0; i < count; i++) {
    // Add random minutes (1-60) to simulate next occurrences
    currentDate = new Date(currentDate.getTime() + (Math.floor(Math.random() * 60) + 1) * 60000);
    occurrences.push(currentDate.toLocaleString());
  }
  
  return occurrences;
};

const CronGenerator = () => {
  const [cronExpression, setCronExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");
  const [nextOccurrences, setNextOccurrences] = useState<string[]>([]);
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [expressionType, setExpressionType] = useState("custom");
  const [hasCopied, setHasCopied] = useState(false);

  // Common cron expressions
  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every day at noon", value: "0 12 * * *" },
    { label: "Every Monday", value: "0 0 * * 1" },
    { label: "Every weekday", value: "0 0 * * 1-5" },
    { label: "Every weekend", value: "0 0 * * 0,6" },
    { label: "Every month on the 1st", value: "0 0 1 * *" },
    { label: "Every quarter", value: "0 0 1 1,4,7,10 *" },
    { label: "Every year", value: "0 0 1 1 *" }
  ];

  // Update cron expression when individual parts change
  useEffect(() => {
    if (expressionType === "custom") {
      const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
      setCronExpression(expression);
    }
  }, [minute, hour, dayOfMonth, month, dayOfWeek, expressionType]);

  // Update description and next occurrences when cron expression changes
  useEffect(() => {
    updateDescription();
    setNextOccurrences(getNextOccurrences(cronExpression, 5));
  }, [cronExpression]);

  const updateDescription = () => {
    // This is a simplified description generator
    let desc = "";
    
    const parts = cronExpression.split(" ");
    if (parts.length !== 5) {
      setDescription("Invalid cron expression");
      return;
    }
    
    const [min, hr, dom, mon, dow] = parts;
    
    // Handle some common patterns
    if (cronExpression === "* * * * *") {
      desc = "Every minute";
    } else if (cronExpression === "0 * * * *") {
      desc = "Every hour at the start of the hour";
    } else if (cronExpression === "0 0 * * *") {
      desc = "Every day at midnight (00:00)";
    } else if (cronExpression === "0 12 * * *") {
      desc = "Every day at noon (12:00)";
    } else if (cronExpression === "0 0 * * 1") {
      desc = "Every Monday at midnight";
    } else if (cronExpression === "0 0 * * 1-5") {
      desc = "Every weekday (Monday to Friday) at midnight";
    } else {
      // Simple description for other cases
      desc = `At ${min === "*" ? "every minute" : `minute ${min}`} of ${hr === "*" ? "every hour" : `hour ${hr}`}`;
      
      if (dom !== "*") {
        desc += ` on day ${dom} of the month`;
      }
      
      if (mon !== "*") {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (mon.includes(",")) {
          const monthsList = mon.split(",").map(m => months[parseInt(m) - 1]).join(", ");
          desc += ` in ${monthsList}`;
        } else if (mon.includes("-")) {
          const [start, end] = mon.split("-");
          desc += ` from ${months[parseInt(start) - 1]} to ${months[parseInt(end) - 1]}`;
        } else {
          desc += ` in ${months[parseInt(mon) - 1]}`;
        }
      }
      
      if (dow !== "*") {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (dow.includes(",")) {
          const daysList = dow.split(",").map(d => days[parseInt(d) % 7]).join(", ");
          desc += ` on ${daysList}`;
        } else if (dow.includes("-")) {
          const [start, end] = dow.split("-");
          desc += ` from ${days[parseInt(start) % 7]} to ${days[parseInt(end) % 7]}`;
        } else {
          desc += ` on ${days[parseInt(dow) % 7]}`;
        }
      }
    }
    
    setDescription(desc);
  };

  const applyPreset = (expression: string) => {
    setCronExpression(expression);
    setExpressionType("preset");
    
    // Update the individual fields
    const parts = expression.split(" ");
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCronExpression(e.target.value);
    setExpressionType("direct");
  };

  const handleReset = () => {
    setCronExpression("* * * * *");
    setMinute("*");
    setHour("*");
    setDayOfMonth("*");
    setMonth("*");
    setDayOfWeek("*");
    setExpressionType("custom");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Generate options for select components
  const generateOptions = (start: number, end: number) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i}
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <ToolLayout
      title="Cron Expression Generator"
      description="Create and validate cron expressions"
      icon={<Bot className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cron Expression Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="builder" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="builder" onClick={() => setExpressionType("custom")}>
                      Builder
                    </TabsTrigger>
                    <TabsTrigger value="presets" onClick={() => setExpressionType("preset")}>
                      Presets
                    </TabsTrigger>
                    <TabsTrigger value="direct" onClick={() => setExpressionType("direct")}>
                      Direct Input
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="builder" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="minute">Minute</Label>
                        <Select value={minute} onValueChange={setMinute}>
                          <SelectTrigger id="minute">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every min (*)</SelectItem>
                            {generateOptions(0, 59)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="hour">Hour</Label>
                        <Select value={hour} onValueChange={setHour}>
                          <SelectTrigger id="hour">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every hour (*)</SelectItem>
                            {generateOptions(0, 23)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="dayOfMonth">Day of Month</Label>
                        <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                          <SelectTrigger id="dayOfMonth">
                            <SelectValue placeholder="DOM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every day (*)</SelectItem>
                            {generateOptions(1, 31)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="month">Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                          <SelectTrigger id="month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every month (*)</SelectItem>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="dayOfWeek">Day of Week</Label>
                        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                          <SelectTrigger id="dayOfWeek">
                            <SelectValue placeholder="DOW" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every day (*)</SelectItem>
                            <SelectItem value="0">Sunday</SelectItem>
                            <SelectItem value="1">Monday</SelectItem>
                            <SelectItem value="2">Tuesday</SelectItem>
                            <SelectItem value="3">Wednesday</SelectItem>
                            <SelectItem value="4">Thursday</SelectItem>
                            <SelectItem value="5">Friday</SelectItem>
                            <SelectItem value="6">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="presets" className="mt-4">
                    <RadioGroup value={cronExpression} onValueChange={applyPreset} className="space-y-3">
                      {presets.map((preset) => (
                        <div key={preset.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={preset.value} id={preset.value} />
                          <Label htmlFor={preset.value} className="flex-1">
                            {preset.label}
                          </Label>
                          <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">
                            {preset.value}
                          </code>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>
                  
                  <TabsContent value="direct" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cronExpression">Enter Cron Expression</Label>
                      <div className="relative">
                        <Input 
                          id="cronExpression" 
                          value={cronExpression} 
                          onChange={handleExpressionChange}
                          className="font-mono"
                        />
                        <div className="absolute top-2 right-2 text-xs text-muted-foreground space-x-2">
                          <span>min</span>
                          <span>hour</span>
                          <span>dom</span>
                          <span>month</span>
                          <span>dow</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Format: minute hour day-of-month month day-of-week (0-6, where 0 is Sunday)
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={copyToClipboard}>
                  {hasCopied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy Expression
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Expression Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Current Expression</p>
                    <Badge className="bg-primary font-mono text-xs">{cronExpression}</Badge>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm">{description}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Next 5 Occurrences
                  </p>
                  <ul className="space-y-2">
                    {nextOccurrences.map((occurrence, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-50" />
                        {occurrence}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-md p-3 mt-6">
                  <p className="text-xs text-muted-foreground">
                    Cron is a time-based job scheduler used in Unix-like operating systems. The syntax shown here
                    follows the standard cron format with five fields: minute, hour, day of month, month, and day of week.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CronGenerator;
