
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Calculator, Plus, Trash, Save, MoveUp, MoveDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface SubjectEntry {
  id: string;
  name: string;
  grade: string;
  units: string;
  weight: string;
}

const GeneralAverageCalculator = () => {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [weightedAverage, setWeightedAverage] = useState<number | null>(null);
  const [calculationType, setCalculationType] = useState<"simple" | "weighted">("weighted");
  const [savedSets, setSavedSets] = useState<{ name: string; subjects: SubjectEntry[] }[]>([]);
  const [newSetName, setNewSetName] = useState("");

  // Add initial subject row on first load
  useEffect(() => {
    if (subjects.length === 0) {
      handleAddSubject();
    }
  }, []);

  const handleAddSubject = () => {
    const newSubject: SubjectEntry = {
      id: `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      grade: "",
      units: "3",
      weight: "1",
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleUpdateSubject = (id: string, field: keyof SubjectEntry, value: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === id) {
        // Validate numeric fields
        if ((field === "grade" || field === "units" || field === "weight") && value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            return subject;
          }
          // Grade validation
          if (field === "grade" && (numValue < 0 || numValue > 100)) {
            return subject;
          }
        }
        return { ...subject, [field]: value };
      }
      return subject;
    });
    setSubjects(updatedSubjects);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length === 1) {
      toast.error("You must have at least one subject");
      return;
    }
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleMoveSubject = (id: string, direction: "up" | "down") => {
    const index = subjects.findIndex(subject => subject.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === subjects.length - 1)
    ) {
      return;
    }

    const newSubjects = [...subjects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSubjects[index], newSubjects[targetIndex]] = [newSubjects[targetIndex], newSubjects[index]];
    setSubjects(newSubjects);
  };

  const calculateAverage = () => {
    // Validate fields
    const incompleteSubjects = subjects.filter(
      subject => !subject.name || !subject.grade || (calculationType === "weighted" && (!subject.units || !subject.weight))
    );
    
    if (incompleteSubjects.length > 0) {
      toast.error("Please fill in all required fields for each subject");
      return;
    }

    if (calculationType === "simple") {
      // Simple average (not weighted)
      const validGrades = subjects
        .map(subject => parseFloat(subject.grade))
        .filter(grade => !isNaN(grade));
        
      if (validGrades.length === 0) {
        toast.error("No valid grades to calculate");
        return;
      }
      
      const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
      const calculatedAverage = sum / validGrades.length;
      setAverage(calculatedAverage);
      setWeightedAverage(null); // Clear weighted average
    } else {
      // Weighted average calculation
      let totalWeightedGrade = 0;
      let totalWeightedUnits = 0;
      
      subjects.forEach(subject => {
        const grade = parseFloat(subject.grade);
        const units = parseFloat(subject.units);
        const weight = parseFloat(subject.weight);
        
        if (!isNaN(grade) && !isNaN(units) && !isNaN(weight)) {
          totalWeightedGrade += grade * units * weight;
          totalWeightedUnits += units * weight;
        }
      });
      
      if (totalWeightedUnits === 0) {
        toast.error("No valid weighted units to calculate");
        return;
      }
      
      const calculatedWeightedAverage = totalWeightedGrade / totalWeightedUnits;
      setWeightedAverage(calculatedWeightedAverage);
      
      // Also calculate simple average for comparison
      const validGrades = subjects
        .map(subject => parseFloat(subject.grade))
        .filter(grade => !isNaN(grade));
        
      if (validGrades.length > 0) {
        const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
        setAverage(sum / validGrades.length);
      }
    }
  };

  const handleSaveSet = () => {
    if (!newSetName.trim()) {
      toast.error("Please enter a name for this set");
      return;
    }
    
    if (subjects.some(subject => !subject.name || !subject.grade)) {
      toast.error("Please fill in all subject names and grades before saving");
      return;
    }
    
    const newSavedSets = [...savedSets, { name: newSetName, subjects: [...subjects] }];
    setSavedSets(newSavedSets);
    setNewSetName("");
    
    // Save to localStorage
    try {
      localStorage.setItem("savedGradeSets", JSON.stringify(newSavedSets));
      toast.success(`Saved set "${newSetName}"`);
    } catch (error) {
      toast.error("Failed to save set to storage");
    }
  };

  const handleLoadSet = (setIndex: number) => {
    setSubjects([...savedSets[setIndex].subjects]);
    toast.success(`Loaded set "${savedSets[setIndex].name}"`);
  };

  const handleRemoveSet = (setIndex: number) => {
    const newSavedSets = savedSets.filter((_, index) => index !== setIndex);
    setSavedSets(newSavedSets);
    
    // Update localStorage
    try {
      localStorage.setItem("savedGradeSets", JSON.stringify(newSavedSets));
      toast.success("Set removed");
    } catch (error) {
      toast.error("Failed to update storage");
    }
  };

  // Load saved sets from localStorage on component mount
  useEffect(() => {
    try {
      const savedSetsData = localStorage.getItem("savedGradeSets");
      if (savedSetsData) {
        setSavedSets(JSON.parse(savedSetsData));
      }
    } catch (error) {
      console.error("Error loading saved sets:", error);
    }
  }, []);

  const getLetterGrade = (numericalGrade: number): string => {
    if (numericalGrade >= 97) return "A+";
    if (numericalGrade >= 93) return "A";
    if (numericalGrade >= 90) return "A-";
    if (numericalGrade >= 87) return "B+";
    if (numericalGrade >= 83) return "B";
    if (numericalGrade >= 80) return "B-";
    if (numericalGrade >= 77) return "C+";
    if (numericalGrade >= 73) return "C";
    if (numericalGrade >= 70) return "C-";
    if (numericalGrade >= 67) return "D+";
    if (numericalGrade >= 63) return "D";
    if (numericalGrade >= 60) return "D-";
    return "F";
  };

  const copyResults = () => {
    let resultText = "General Average Calculation Results\n\n";
    
    subjects.forEach(subject => {
      resultText += `${subject.name}: ${subject.grade}`;
      if (calculationType === "weighted") {
        resultText += ` (${subject.units} units, weight: ${subject.weight})`;
      }
      resultText += "\n";
    });
    
    resultText += "\n";
    
    if (calculationType === "weighted" && weightedAverage !== null) {
      resultText += `Weighted Average: ${weightedAverage.toFixed(2)}`;
    }
    
    if (average !== null) {
      resultText += `\nSimple Average: ${average.toFixed(2)}`;
    }
    
    navigator.clipboard.writeText(resultText).then(() => {
      toast.success("Results copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy results");
    });
  };

  return (
    <ToolLayout
      title="General Average Calculator"
      description="Calculate academic grade averages with weighted or simple methods"
      icon={<Calculator className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <Label htmlFor="calculation-type" className="mb-2 block">Calculation Method</Label>
                  <Select
                    value={calculationType}
                    onValueChange={(value: "simple" | "weighted") => setCalculationType(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple Average</SelectItem>
                      <SelectItem value="weighted">Weighted Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSubject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Grade</TableHead>
                      {calculationType === "weighted" && (
                        <>
                          <TableHead>Units/Credits</TableHead>
                          <TableHead>Weight</TableHead>
                        </>
                      )}
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject, index) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <Input
                            value={subject.name}
                            onChange={(e) => handleUpdateSubject(subject.id, "name", e.target.value)}
                            placeholder="Subject name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={subject.grade}
                            onChange={(e) => handleUpdateSubject(subject.id, "grade", e.target.value)}
                            placeholder="0-100"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </TableCell>
                        {calculationType === "weighted" && (
                          <>
                            <TableCell>
                              <Input
                                value={subject.units}
                                onChange={(e) => handleUpdateSubject(subject.id, "units", e.target.value)}
                                placeholder="Units"
                                type="number"
                                min="0"
                                step="0.5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={subject.weight}
                                onChange={(e) => handleUpdateSubject(subject.id, "weight", e.target.value)}
                                placeholder="Weight"
                                type="number"
                                min="0"
                                step="0.1"
                              />
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveSubject(subject.id, "up")}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveSubject(subject.id, "down")}
                              disabled={index === subjects.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveSubject(subject.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-3">
                    <Input
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                      placeholder="Name this set of grades"
                    />
                    <Button variant="outline" onClick={handleSaveSet} disabled={!newSetName.trim()}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
                <Button onClick={calculateAverage} className="flex-1">Calculate Average</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {(average !== null || weightedAverage !== null) && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <h3 className="text-xl font-medium mb-4">Results</h3>
                <Button variant="outline" size="sm" onClick={copyResults}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Results
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {weightedAverage !== null && calculationType === "weighted" && (
                  <div className="p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Weighted Average:</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold">{weightedAverage.toFixed(2)}</p>
                      <p className="ml-2 text-lg font-medium text-muted-foreground">/ 100</p>
                    </div>
                    <p className="mt-1 text-lg">Letter Grade: {getLetterGrade(weightedAverage)}</p>
                  </div>
                )}
                
                {average !== null && (
                  <div className={`p-6 ${calculationType === "simple" ? "bg-primary/10" : "bg-muted/30"} rounded-lg`}>
                    <p className="text-sm text-muted-foreground">Simple Average:</p>
                    <div className="flex items-baseline">
                      <p className={`text-3xl font-bold ${calculationType === "weighted" ? "text-muted-foreground" : ""}`}>
                        {average.toFixed(2)}
                      </p>
                      <p className="ml-2 text-lg font-medium text-muted-foreground">/ 100</p>
                    </div>
                    <p className="mt-1 text-lg">Letter Grade: {getLetterGrade(average)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {savedSets.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Saved Grade Sets</h3>
              <div className="space-y-3">
                {savedSets.map((set, index) => (
                  <div 
                    key={`${set.name}-${index}`} 
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{set.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {set.subjects.length} subjects
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleLoadSet(index)}>
                        Load
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveSet(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">About Grade Calculations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Simple Average</h4>
                <p className="text-sm text-muted-foreground">
                  A simple average adds all grades together and divides by the number of subjects.
                  Each subject has equal importance in the final result.
                </p>
                <div className="mt-3 p-3 bg-muted/30 rounded-md">
                  <p className="text-sm font-medium">Formula:</p>
                  <p className="mt-1 text-sm">
                    Simple Average = (Grade₁ + Grade₂ + ... + Gradeₙ) ÷ n
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Weighted Average</h4>
                <p className="text-sm text-muted-foreground">
                  A weighted average takes into account the units/credits and importance of each subject.
                  Subjects with more units or higher weights have more influence on the final average.
                </p>
                <div className="mt-3 p-3 bg-muted/30 rounded-md">
                  <p className="text-sm font-medium">Formula:</p>
                  <p className="mt-1 text-sm">
                    Weighted Average = Σ(Grade × Units × Weight) ÷ Σ(Units × Weight)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default GeneralAverageCalculator;
