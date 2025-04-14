
import React from 'react';
import { Download, Trash, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoryIdea } from '@/contexts/StoryIdeaGeneratorContext';
import { StoryIdeaCard } from './StoryIdeaCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export const SavedIdeas: React.FC = () => {
  const { 
    savedIdeas,
    removeIdea,
    exportIdeas,
    setActiveTab
  } = useStoryIdea();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saved Story Ideas</CardTitle>
          {savedIdeas.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportIdeas}>
              <Download className="h-4 w-4 mr-2" /> Export All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {savedIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-2">No saved ideas yet</p>
            <p className="text-sm text-muted-foreground mb-6">Generate some story ideas and save them to see them here</p>
            <Button onClick={() => setActiveTab("generator")}>
              Generate Ideas
            </Button>
          </div>
        ) : (
          <ScrollArea className="pr-4 h-[600px]">
            <div className="space-y-6">
              {savedIdeas.map((idea) => (
                <Card key={idea.id} className="border border-zinc-800">
                  <CardHeader className="bg-black/40 pb-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary">
                        {idea.genre.charAt(0).toUpperCase() + idea.genre.slice(1)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeIdea(idea.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold">{idea.title}</h3>
                  </CardHeader>
                  <CardContent className="pt-4 pb-4">
                    <StoryIdeaCard idea={idea} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {savedIdeas.length > 0 && (
        <CardFooter className="border-t border-zinc-800 bg-black/20">
          <div className="flex w-full justify-end">
            <Button onClick={exportIdeas}>
              <Download className="h-4 w-4 mr-2" /> Export All Ideas
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
