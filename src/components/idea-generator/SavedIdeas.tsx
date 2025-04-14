
import React from 'react';
import { Lightbulb, Copy, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIdeaGenerator } from './IdeaGeneratorContext';

export const SavedIdeas = () => {
  const { 
    savedIdeas,
    copyToClipboard,
    removeIdea,
    exportIdeas,
    setActiveTab
  } = useIdeaGenerator();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saved Ideas</CardTitle>
          {savedIdeas.length > 0 && (
            <Badge variant="secondary">{savedIdeas.length} {savedIdeas.length === 1 ? "Idea" : "Ideas"}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {savedIdeas.length === 0 ? (
          <div className="text-center py-10">
            <Lightbulb className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No saved ideas yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Generate and save some ideas to see them here!</p>
            <Button variant="outline" onClick={() => setActiveTab("generator")} className="mt-4">
              Generate Ideas
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedIdeas.map((idea, index) => (
              <div key={index} className="p-4 rounded-lg bg-black/30 border border-zinc-700/30 flex justify-between items-center">
                <p>{idea}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(idea)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeIdea(idea)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {savedIdeas.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button onClick={exportIdeas}>
                  <Download className="h-4 w-4 mr-2" /> Export All Ideas
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
