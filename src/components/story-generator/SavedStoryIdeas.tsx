
import React from 'react';
import { Book, Copy, Trash, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStoryGenerator } from './StoryIdeaGeneratorContext';

export const SavedStoryIdeas = () => {
  const { 
    savedStoryIdeas,
    removeStoryIdea,
    exportStoryIdeas,
    copyToClipboard,
    formatStoryIdea,
    setActiveTab
  } = useStoryGenerator();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saved Story Ideas</CardTitle>
          {savedStoryIdeas.length > 0 && (
            <Badge variant="secondary">{savedStoryIdeas.length} {savedStoryIdeas.length === 1 ? "Idea" : "Ideas"}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {savedStoryIdeas.length === 0 ? (
          <div className="text-center py-10">
            <Book className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No saved story ideas yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Generate and save some ideas to see them here!</p>
            <Button variant="outline" onClick={() => setActiveTab("generator")} className="mt-4">
              Generate Ideas
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Accordion type="multiple" className="w-full">
              {savedStoryIdeas.map((idea, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:bg-black/10 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="text-left">
                        {idea.premise.length > 80 ? idea.premise.substring(0, 80) + "..." : idea.premise}
                      </span>
                      <Badge variant="outline" className="capitalize ml-2">
                        {idea.genre.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-black/20 rounded-md mt-2 mb-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Premise</h3>
                          <p>{idea.premise}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Character</h3>
                            <p className="text-sm">{idea.character}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Plot Structure</h3>
                            <p className="text-sm">{idea.plot}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Setting</h3>
                            <p className="text-sm">{idea.setting}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(formatStoryIdea(idea))}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeStoryIdea(index)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {savedStoryIdeas.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button onClick={exportStoryIdeas}>
                  <Download className="h-4 w-4 mr-2" /> Export All Story Ideas
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
