
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { useStoryGenerator } from './StoryIdeaGeneratorContext';

export const StorySettings = () => {
  const { 
    selectedGenre,
    setSelectedGenre,
    generateStoryIdea
  } = useStoryGenerator();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generator Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Story Genre</label>
              <Select 
                value={selectedGenre} 
                onValueChange={setSelectedGenre}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random (Any Genre)</SelectItem>
                  <SelectItem value="fantasyAdventure">Fantasy Adventure</SelectItem>
                  <SelectItem value="scienceFiction">Science Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="historicalFiction">Historical Fiction</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="dystopian">Dystopian</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Select a specific genre or choose "Random" to get ideas from all genres.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Story Idea Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Story Idea Generator helps spark creativity by providing random story premises, character archetypes, plot structures, and settings. Use these elements as building blocks for your next writing project, novel, screenplay, or creative storytelling.
          </p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="outline" className="justify-center">Premise</Badge>
            <Badge variant="outline" className="justify-center">Character</Badge>
            <Badge variant="outline" className="justify-center">Plot</Badge>
            <Badge variant="outline" className="justify-center">Setting</Badge>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Available Genres</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Badge variant="secondary" className="justify-center">Fantasy Adventure</Badge>
              <Badge variant="secondary" className="justify-center">Science Fiction</Badge>
              <Badge variant="secondary" className="justify-center">Mystery</Badge>
              <Badge variant="secondary" className="justify-center">Romance</Badge>
              <Badge variant="secondary" className="justify-center">Historical Fiction</Badge>
              <Badge variant="secondary" className="justify-center">Horror</Badge>
              <Badge variant="secondary" className="justify-center">Dystopian</Badge>
              <Badge variant="secondary" className="justify-center">Comedy</Badge>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" onClick={generateStoryIdea} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate New Story Idea
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
