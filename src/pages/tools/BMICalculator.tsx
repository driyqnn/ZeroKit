
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { User, Scale, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  healthRisk: string;
}

const BMICalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [historyList, setHistoryList] = useState<Array<{ date: string; bmi: number }>>([]);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem("bmi_history");
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading BMI history:", e);
      }
    }
  }, []);

  // Save history to local storage
  const saveToHistory = (bmi: number) => {
    const newEntry = { date: new Date().toLocaleDateString(), bmi };
    const updatedHistory = [...historyList, newEntry].slice(-10); // Keep only last 10 entries
    setHistoryList(updatedHistory);
    localStorage.setItem("bmi_history", JSON.stringify(updatedHistory));
  };

  const calculateBMI = () => {
    if (!height || !weight) {
      toast.error("Please enter both height and weight");
      return;
    }
    
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    
    if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
      toast.error("Please enter valid values for height and weight");
      return;
    }
    
    let bmiValue: number;
    
    if (unit === "metric") {
      // Formula: weight (kg) / [height (m)]^2
      bmiValue = weightValue / ((heightValue / 100) * (heightValue / 100));
    } else {
      // Formula: [weight (lbs) / height (in)^2] × 703
      bmiValue = (weightValue / (heightValue * heightValue)) * 703;
    }
    
    bmiValue = parseFloat(bmiValue.toFixed(1));
    
    // Determine BMI category
    let category: string;
    let color: string;
    let healthRisk: string;
    
    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "bg-blue-500";
      healthRisk = "Malnutrition risk";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = "Normal weight";
      color = "bg-green-500";
      healthRisk = "Low risk";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = "Overweight";
      color = "bg-yellow-500";
      healthRisk = "Enhanced risk";
    } else if (bmiValue >= 30 && bmiValue < 35) {
      category = "Obese Class I";
      color = "bg-orange-500";
      healthRisk = "Moderate risk";
    } else if (bmiValue >= 35 && bmiValue < 40) {
      category = "Obese Class II";
      color = "bg-red-400";
      healthRisk = "High risk";
    } else {
      category = "Obese Class III";
      color = "bg-red-600";
      healthRisk = "Very high risk";
    }
    
    setResult({ bmi: bmiValue, category, color, healthRisk });
    saveToHistory(bmiValue);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resetForm = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setGender("male");
    setResult(null);
  };

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index and track changes over time"
      icon={<User className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="calculator" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Units</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant={unit === "metric" ? "default" : "outline"} 
                      onClick={() => setUnit("metric")}
                      className="w-full"
                    >
                      Metric (cm/kg)
                    </Button>
                    <Button 
                      variant={unit === "imperial" ? "default" : "outline"} 
                      onClick={() => setUnit("imperial")}
                      className="w-full"
                    >
                      Imperial (in/lbs)
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="height">
                        Height ({unit === "metric" ? "cm" : "inches"})
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">
                        Weight ({unit === "metric" ? "kg" : "lbs"})
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder={unit === "metric" ? "e.g., 70" : "e.g., 160"}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="age">Age (optional)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 35"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender" className="mb-2 block">
                        Gender (optional)
                      </Label>
                      <RadioGroup
                        id="gender"
                        value={gender}
                        onValueChange={(value) => setGender(value as "male" | "female")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={calculateBMI} className="flex-1">
                    Calculate BMI
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    <RefreshCw size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {result && (
              <Card id="results-section">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Your Results</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-muted/30 border-4 border-primary">
                      <div className="text-center">
                        <span className="text-3xl font-bold">{result.bmi}</span>
                        <p className="text-sm text-muted-foreground">BMI</p>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-xl mb-2">
                        {result.category}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Health risk: {result.healthRisk}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Underweight</span>
                          <span>Obese</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${result.color}`} 
                            style={{ 
                              width: `${Math.min(100, (result.bmi / 40) * 100)}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>16</span>
                          <span>18.5</span>
                          <span>25</span>
                          <span>30</span>
                          <span>35</span>
                          <span>40</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-2">What does this mean?</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.bmi < 18.5 && "A BMI below 18.5 indicates that you may be underweight. Consider consulting a healthcare professional to ensure you're getting adequate nutrition."}
                      {result.bmi >= 18.5 && result.bmi < 25 && "Your BMI is within the healthy weight range. Maintaining a balanced diet and regular physical activity will help you stay in this range."}
                      {result.bmi >= 25 && result.bmi < 30 && "A BMI between 25 and 30 indicates that you're in the overweight category. Consider making some lifestyle changes to reduce potential health risks."}
                      {result.bmi >= 30 && "A BMI of 30 or higher indicates obesity. This can lead to various health problems. Consider consulting a healthcare professional for advice."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Note: BMI is a screening tool and doesn't diagnose body fatness or health. Factors like muscle mass can affect results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">BMI History</h3>
                
                {historyList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No BMI measurements recorded yet</p>
                    <Button variant="outline" onClick={() => document.querySelector('[value="calculator"]')?.dispatchEvent(new Event('click'))}>
                      Take First Measurement <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 font-medium text-sm py-2 border-b">
                      <div>Date</div>
                      <div>BMI</div>
                      <div>Category</div>
                    </div>
                    
                    {historyList.map((entry, index) => {
                      let category = "";
                      let color = "";
                      
                      if (entry.bmi < 18.5) {
                        category = "Underweight";
                        color = "text-blue-500";
                      } else if (entry.bmi >= 18.5 && entry.bmi < 25) {
                        category = "Normal";
                        color = "text-green-500";
                      } else if (entry.bmi >= 25 && entry.bmi < 30) {
                        category = "Overweight";
                        color = "text-yellow-500";
                      } else if (entry.bmi >= 30) {
                        category = "Obese";
                        color = "text-red-500";
                      }
                      
                      return (
                        <div key={index} className="grid grid-cols-3 text-sm py-3 border-b border-border/50">
                          <div>{entry.date}</div>
                          <div>{entry.bmi}</div>
                          <div className={color}>{category}</div>
                        </div>
                      );
                    })}
                    
                    {historyList.length >= 2 && (
                      <div className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Progress Chart</h4>
                        <div className="h-40 relative">
                          <div className="absolute inset-0 flex items-end">
                            {historyList.map((entry, index) => {
                              const height = ((entry.bmi - 10) / 30) * 100;
                              const clampedHeight = Math.max(10, Math.min(100, height));
                              
                              let barColor = "bg-green-500";
                              if (entry.bmi < 18.5) barColor = "bg-blue-500";
                              else if (entry.bmi >= 25 && entry.bmi < 30) barColor = "bg-yellow-500";
                              else if (entry.bmi >= 30) barColor = "bg-red-500";
                              
                              const width = `calc(${100 / historyList.length}% - 4px)`;
                              
                              return (
                                <div key={index} style={{ width }} className="mx-1 flex flex-col items-center">
                                  <div className={`w-full ${barColor} rounded-t-sm`} style={{ height: `${clampedHeight}%` }} />
                                  <span className="text-xs mt-1 text-muted-foreground">
                                    {entry.date.split('/')[1]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          localStorage.removeItem("bmi_history");
                          setHistoryList([]);
                          toast.success("History cleared");
                        }}
                      >
                        Clear History
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">BMI Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="font-medium">Below 18.5:</span>
                  <span className="ml-2 text-muted-foreground">Underweight</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">18.5 - 24.9:</span>
                  <span className="ml-2 text-muted-foreground">Normal weight</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="font-medium">25 - 29.9:</span>
                  <span className="ml-2 text-muted-foreground">Overweight</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="font-medium">30 - 34.9:</span>
                  <span className="ml-2 text-muted-foreground">Obesity (Class 1)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="font-medium">35 - 39.9:</span>
                  <span className="ml-2 text-muted-foreground">Obesity (Class 2)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                  <span className="font-medium">40 and above:</span>
                  <span className="ml-2 text-muted-foreground">Obesity (Class 3)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">BMI Limitations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Doesn't account for muscle mass, bone density, or body composition</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>May overestimate body fat in athletes and those with muscular builds</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>May underestimate body fat in older persons and those who have lost muscle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Doesn't account for differences in various ethnic and racial groups</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default BMICalculator;
