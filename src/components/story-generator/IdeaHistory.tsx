import React from 'react';
import { Clock, Trash, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoryIdea } from '@/contexts/StoryIdeaGeneratorContext';
import { StoryIdeaCard } from './StoryIdeaCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export const IdeaHistory: React.FC = () => {
  const { 
    historyIdeas,
    clearHistory,
    saveIdea
  } = useStoryIdea();

  const formatDate = (date: Date) => {
    const now = new Date();
    const ideaDate = new Date(date);
    
    // If the date is from today
    if (ideaDate.toDateString() === now.toDateString()) {
      return `Today, ${ideaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If the date is from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (ideaDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${ideaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return `${ideaDate.toLocaleDateString()} ${ideaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Story Ideas</CardTitle>
          {historyIdeas.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash className="h-4 w-4 mr-2" /> Clear History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {historyIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No history yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Generated story ideas will appear in your history</p>
          </div>
        ) : (
          <ScrollArea className="pr-4 h-[600px]">
            <div className="space-y-4">
              {historyIdeas.map((idea) => (
                <Card key={idea.id} className="border border-zinc-800">
                  <CardHeader className="py-3 bg-black/40">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {idea.genre.charAt(0).toUpperCase() + idea.genre.slice(1)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => saveIdea(idea)}
                        className="h-8 w-8"
                      >
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(idea.timestamp)}</p>
                  </CardHeader>
                  <CardContent className="py-3">
                    <StoryIdeaCard idea={idea} compact />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
