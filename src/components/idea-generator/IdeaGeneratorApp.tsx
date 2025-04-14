
import React from 'react';
import { 
  Lightbulb, RefreshCw, Copy, Save, Download, Check, 
  ListFilter, Settings, Share2, Zap, ArrowRightLeft 
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIdeaGenerator } from './IdeaGeneratorContext';
import { IdeaSettings } from './IdeaSettings';
import { SavedIdeas } from './SavedIdeas';

export const IdeaGeneratorApp = () => {
  const { 
    currentIdea, 
    generatedIdeas, 
    activeTab, 
    setActiveTab,
    generateIdea,
    saveIdea,
    copyToClipboard
  } = useIdeaGenerator();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Idea Generator</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("saved")}
                >
                  <Save className="h-4 w-4 mr-1" /> Saved Ideas
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-1" /> Settings
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Generator</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span>Saved Ideas</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Your Random Idea</CardTitle>
            </CardHeader>
            <CardContent>
              {currentIdea && (
                <div className="p-6 rounded-lg bg-black/40 border border-zinc-700/50 text-center">
                  <p className="text-xl font-medium">{currentIdea}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => saveIdea(currentIdea)}>
                <Save className="h-4 w-4 mr-2" /> Save Idea
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(currentIdea)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button onClick={generateIdea}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate New Idea
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {generatedIdeas.length > 1 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Additional Ideas ({generatedIdeas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedIdeas.slice(1).map((idea, index) => (
                    <div key={index} className="p-4 rounded-lg bg-black/30 border border-zinc-700/30 flex justify-between items-center">
                      <p>{idea}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(idea)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => saveIdea(idea)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedIdeas />
        </TabsContent>
        
        <TabsContent value="settings">
          <IdeaSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
