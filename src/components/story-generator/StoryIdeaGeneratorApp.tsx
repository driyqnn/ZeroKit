
import React from 'react';
import { Lightbulb, RefreshCw, Save, Download, Settings, Trash, Clock, History } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoryIdea } from "@/contexts/StoryIdeaGeneratorContext";
import { StoryIdeaSettings } from './StoryIdeaSettings';
import { StoryIdeaCard } from './StoryIdeaCard';
import { SavedIdeas } from './SavedIdeas';
import { IdeaHistory } from './IdeaHistory';

export const StoryIdeaGeneratorApp = () => {
  const { 
    currentIdea, 
    activeTab, 
    setActiveTab,
    generateStoryIdea,
    saveIdea,
  } = useStoryIdea();

  const handleSaveIdea = () => {
    if (currentIdea) {
      saveIdea(currentIdea);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Generator</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span>Saved Ideas</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-8">
          {currentIdea && (
            <Card className="border border-zinc-800 shadow-lg overflow-hidden animate-fade-in">
              <CardHeader className="bg-black/40 pb-6">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary">
                    {currentIdea.genre.charAt(0).toUpperCase() + currentIdea.genre.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{currentIdea.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <StoryIdeaCard idea={currentIdea} />
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-4 pt-2 pb-6 bg-black/20">
                <Button variant="outline" onClick={handleSaveIdea}>
                  <Save className="h-4 w-4 mr-2" /> Save Idea
                </Button>
                <Button onClick={generateStoryIdea}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate New Idea
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button size="lg" onClick={generateStoryIdea} className="px-8">
              <RefreshCw className="h-5 w-5 mr-2" /> Generate Another Story Idea
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedIdeas />
        </TabsContent>
        
        <TabsContent value="history">
          <IdeaHistory />
        </TabsContent>
        
        <TabsContent value="settings">
          <StoryIdeaSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoryIdeaGeneratorApp;
