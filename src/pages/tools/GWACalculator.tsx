
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Calculator, Plus, Trash, Save, MoveUp, MoveDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface GradeEntry {
  id: string;
  name: string;
  grade: string;
  units: string;
}

// Philippine grading scale (1.0-5.0)
const gradeScaleOptions = [
  { value: "1.0", label: "1.0 (Excellent)" },
  { value: "1.25", label: "1.25" },
  { value: "1.5", label: "1.5 (Very Good)" },
  { value: "1.75", label: "1.75" },
  { value: "2.0", label: "2.0 (Good)" },
  { value: "2.25", label: "2.25" },
  { value: "2.5", label: "2.5 (Satisfactory)" },
  { value: "2.75", label: "2.75" },
  { value: "3.0", label: "3.0 (Passing)" },
  { value: "5.0", label: "5.0 (Failed)" },
  { value: "INC", label: "INC (Incomplete)" },
  { value: "DRP", label: "DRP (Dropped)" },
];

const GWACalculator = () => {
  const [courses, setCourses] = useState<GradeEntry[]>([]);
  const [gwa, setGwa] = useState<number | null>(null);
  const [savedSets, setSavedSets] = useState<{ name: string; courses: GradeEntry[] }[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const [totalUnits, setTotalUnits] = useState(0);
  const [passedUnits, setPassedUnits] = useState(0);
  const [includeNonNumerical, setIncludeNonNumerical] = useState(false);

  // Add initial course row on first load
  useEffect(() => {
    if (courses.length === 0) {
      handleAddCourse();
    }
  }, []);

  // Load saved sets from localStorage on component mount
  useEffect(() => {
    try {
      const savedSetsData = localStorage.getItem("savedGwaSets");
      if (savedSetsData) {
        setSavedSets(JSON.parse(savedSetsData));
      }
    } catch (error) {
      console.error("Error loading saved sets:", error);
    }
  }, []);

  const handleAddCourse = () => {
    const newCourse: GradeEntry = {
      id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      grade: "1.0",
      units: "3",
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, field: keyof GradeEntry, value: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === id) {
        // Validate units field
        if (field === "units" && value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue <= 0) {
            return course;
          }
        }
        return { ...course, [field]: value };
      }
      return course;
    });
    setCourses(updatedCourses);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length === 1) {
      toast.error("You must have at least one course");
      return;
    }
    setCourses(courses.filter(course => course.id !== id));
  };

  const handleMoveCourse = (id: string, direction: "up" | "down") => {
    const index = courses.findIndex(course => course.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === courses.length - 1)
    ) {
      return;
    }

    const newCourses = [...courses];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newCourses[index], newCourses[targetIndex]] = [newCourses[targetIndex], newCourses[index]];
    setCourses(newCourses);
  };

  const calculateGWA = () => {
    // Validate inputs
    const incompleteCourses = courses.filter(
      course => !course.name || !course.units
    );
    
    if (incompleteCourses.length > 0) {
      toast.error("Please fill in all course names and units");
      return;
    }

    let weightedSum = 0;
    let totalUnitCount = 0;
    let passedUnitCount = 0;
    
    courses.forEach(course => {
      const units = parseFloat(course.units);
      if (isNaN(units)) return;
      
      // Skip non-numerical grades if includeNonNumerical is false
      if (course.grade === "INC" || course.grade === "DRP") {
        if (includeNonNumerical) {
          totalUnitCount += units;
        }
        return;
      }
      
      const gradeValue = parseFloat(course.grade);
      if (!isNaN(gradeValue)) {
        weightedSum += gradeValue * units;
        totalUnitCount += units;
        
        // Count passed units (grade < 4.0 in Philippine system)
        if (gradeValue < 4.0) {
          passedUnitCount += units;
        }
      }
    });

    if (totalUnitCount === 0) {
      toast.error("No valid courses to calculate GWA");
      setGwa(null);
      setTotalUnits(0);
      setPassedUnits(0);
      return;
    }

    const calculatedGwa = weightedSum / totalUnitCount;
    setGwa(calculatedGwa);
    setTotalUnits(totalUnitCount);
    setPassedUnits(passedUnitCount);
  };

  const handleSaveSet = () => {
    if (!newSetName.trim()) {
      toast.error("Please enter a name for this set");
      return;
    }
    
    if (courses.some(course => !course.name)) {
      toast.error("Please fill in all course names before saving");
      return;
    }
    
    const newSavedSets = [...savedSets, { name: newSetName, courses: [...courses] }];
    setSavedSets(newSavedSets);
    setNewSetName("");
    
    // Save to localStorage
    try {
      localStorage.setItem("savedGwaSets", JSON.stringify(newSavedSets));
      toast.success(`Saved set "${newSetName}"`);
    } catch (error) {
      toast.error("Failed to save set to storage");
    }
  };

  const handleLoadSet = (setIndex: number) => {
    setCourses([...savedSets[setIndex].courses]);
    toast.success(`Loaded set "${savedSets[setIndex].name}"`);
  };

  const handleRemoveSet = (setIndex: number) => {
    const newSavedSets = savedSets.filter((_, index) => index !== setIndex);
    setSavedSets(newSavedSets);
    
    // Update localStorage
    try {
      localStorage.setItem("savedGwaSets", JSON.stringify(newSavedSets));
      toast.success("Set removed");
    } catch (error) {
      toast.error("Failed to update storage");
    }
  };

  const getGWADescription = (gwa: number): string => {
    if (gwa >= 1.0 && gwa <= 1.25) return "Excellent";
    if (gwa > 1.25 && gwa <= 1.75) return "Very Good";
    if (gwa > 1.75 && gwa <= 2.25) return "Good";
    if (gwa > 2.25 && gwa <= 2.75) return "Satisfactory";
    if (gwa > 2.75 && gwa < 3.0) return "Passing";
    if (gwa === 3.0) return "Passed";
    return "Unsatisfactory";
  };

  const copyResults = () => {
    if (gwa === null) return;
    
    let resultText = "GWA Calculation Results\n\n";
    
    courses.forEach(course => {
      resultText += `${course.name}: ${course.grade} (${course.units} units)\n`;
    });
    
    resultText += "\n";
    resultText += `GWA: ${gwa.toFixed(2)} - ${getGWADescription(gwa)}\n`;
    resultText += `Total Units: ${totalUnits}\n`;
    resultText += `Passed Units: ${passedUnits}\n`;
    
    navigator.clipboard.writeText(resultText).then(() => {
      toast.success("Results copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy results");
    });
  };

  return (
    <ToolLayout
      title="GWA Calculator"
      description="Calculate your General Weighted Average using the Philippine grading system"
      icon={<Calculator className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                  <Label htmlFor="includeNonNumerical" className="flex items-center space-x-2">
                    <input
                      id="includeNonNumerical"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={includeNonNumerical}
                      onChange={(e) => setIncludeNonNumerical(e.target.checked)}
                    />
                    <span>Include INC/DRP courses in total units</span>
                  </Label>
                </div>
                <Button onClick={handleAddCourse}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course, index) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <Input
                            value={course.name}
                            onChange={(e) => handleUpdateCourse(course.id, "name", e.target.value)}
                            placeholder="Course name"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={course.grade}
                            onValueChange={(value) => handleUpdateCourse(course.id, "grade", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeScaleOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={course.units}
                            onChange={(e) => handleUpdateCourse(course.id, "units", e.target.value)}
                            placeholder="Units"
                            type="number"
                            min="0.5"
                            step="0.5"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveCourse(course.id, "up")}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveCourse(course.id, "down")}
                              disabled={index === courses.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveCourse(course.id)}
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
                      placeholder="Name this semester/term"
                    />
                    <Button variant="outline" onClick={handleSaveSet} disabled={!newSetName.trim()}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
                <Button onClick={calculateGWA} className="flex-1">Calculate GWA</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {gwa !== null && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <h3 className="text-xl font-medium mb-4">Results</h3>
                <Button variant="outline" size="sm" onClick={copyResults}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Results
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">General Weighted Average (GWA):</p>
                  <p className="text-3xl font-bold">{gwa.toFixed(2)}</p>
                  <p className="mt-1 text-lg">{getGWADescription(gwa)}</p>
                </div>
                
                <div className="p-6 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Units:</p>
                  <p className="text-3xl font-bold">{totalUnits}</p>
                </div>
                
                <div className="p-6 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Passed Units:</p>
                  <p className="text-3xl font-bold">{passedUnits}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((passedUnits / totalUnits) * 100).toFixed(1)}% completion rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {savedSets.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Saved Semesters/Terms</h3>
              <div className="space-y-3">
                {savedSets.map((set, index) => (
                  <div 
                    key={`${set.name}-${index}`} 
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{set.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {set.courses.length} courses
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
            <h3 className="text-lg font-medium mb-4">Philippine Grading System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  The Philippine GWA system typically uses a scale from 1.0 to 5.0, where 1.0 is the highest grade and 3.0 is the minimum passing grade.
                </p>
                <div className="mt-3 p-3 bg-muted/30 rounded-md">
                  <p className="text-sm font-medium">Formula:</p>
                  <p className="mt-1 text-sm">
                    GWA = Σ(Grade × Units) ÷ Total Units
                  </p>
                </div>
              </div>
              <div className="overflow-hidden">
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1.00</TableCell>
                      <TableCell>Excellent</TableCell>
                      <TableCell>97-100%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1.25 - 1.5</TableCell>
                      <TableCell>Very Good</TableCell>
                      <TableCell>92-96%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1.75 - 2.0</TableCell>
                      <TableCell>Good</TableCell>
                      <TableCell>86-91%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2.25 - 2.5</TableCell>
                      <TableCell>Satisfactory</TableCell>
                      <TableCell>80-85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2.75 - 3.0</TableCell>
                      <TableCell>Passing</TableCell>
                      <TableCell>75-79%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5.0</TableCell>
                      <TableCell>Failed</TableCell>
                      <TableCell>Below 75%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default GWACalculator;
