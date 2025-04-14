
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStoryIdea, STORY_DATA } from '@/contexts/StoryIdeaGeneratorContext';
import { RefreshCw } from 'lucide-react';

export const StoryIdeaSettings: React.FC = () => {
  const { 
    selectedGenre,
    includeCharacters,
    includeTwist,
    includeTheme,
    setSelectedGenre,
    setIncludeCharacters,
    setIncludeTwist,
    setIncludeTheme,
    generateStoryIdea
  } = useStoryIdea();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Story Generator Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select 
                value={selectedGenre} 
                onValueChange={(value) => setSelectedGenre(value as any)}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  {STORY_DATA.genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium">Story Elements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-characters" className="cursor-pointer flex-1">
                    Include Characters
                  </Label>
                  <Switch
                    id="include-characters"
                    checked={includeCharacters}
                    onCheckedChange={setIncludeCharacters}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-twist" className="cursor-pointer flex-1">
                    Include Plot Twist
                  </Label>
                  <Switch
                    id="include-twist"
                    checked={includeTwist}
                    onCheckedChange={setIncludeTwist}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-theme" className="cursor-pointer flex-1">
                    Include Theme
                  </Label>
                  <Switch
                    id="include-theme"
                    checked={includeTheme}
                    onCheckedChange={setIncludeTheme}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={generateStoryIdea} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate Story with These Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About Story Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The Story Idea Generator helps writers overcome writer's block by providing creative story prompts and ideas. 
            Use these ideas as inspiration for your next short story, novel, or creative writing project.
          </p>
          <p className="text-sm text-muted-foreground">
            Each story idea includes a title, genre, premise, protagonist, setting, conflict, and optional plot twist. 
            Customize your story generation by selecting a specific genre and toggling different story elements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
