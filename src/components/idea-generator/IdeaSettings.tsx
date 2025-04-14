
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIdeaGenerator } from './IdeaGeneratorContext';

export const IdeaSettings = () => {
  const { 
    category, 
    ideaCount, 
    includeAllCategories,
    setCategory,
    setIdeaCount,
    setIncludeAllCategories,
    setActiveTab,
    generateIdea
  } = useIdeaGenerator();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generator Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="category">Idea Category</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random (All Categories)</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="count">Ideas to Generate: {ideaCount}</Label>
              <Slider
                id="count"
                min={1}
                max={10}
                step={1}
                value={[ideaCount]}
                onValueChange={(values) => setIdeaCount(values[0])}
                className="py-4"
              />
              <span className="text-xs text-muted-foreground">
                Generate between 1 and 10 ideas at once.
              </span>
            </div>
            
            {category !== "random" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-all"
                  checked={includeAllCategories}
                  onCheckedChange={setIncludeAllCategories}
                />
                <Label htmlFor="include-all">Include ideas from all categories</Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Random Idea Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Random Idea Generator helps spark creativity and innovation by providing random ideas across various categories. Use these ideas as inspiration for your next project, business venture, or creative endeavor.
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <Badge variant="outline" className="justify-center">Business</Badge>
            <Badge variant="outline" className="justify-center">Technology</Badge>
            <Badge variant="outline" className="justify-center">Creative</Badge>
            <Badge variant="outline" className="justify-center">Education</Badge>
            <Badge variant="outline" className="justify-center">Lifestyle</Badge>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="outline" onClick={generateIdea}>
              <RefreshCw className="h-4 w-4 mr-2" /> Generate New Ideas Now
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("saved")} className="mt-2">
              <Save className="h-4 w-4 mr-2" /> View Saved Ideas
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
