
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Book as BookIcon, Search, ArrowRight, Copy, VolumeIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Interfaces for API responses
interface Phonetic {
  text?: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
  license?: {
    name: string;
    url: string;
  };
}

// API function
const fetchWordDefinition = async (word: string): Promise<DictionaryResponse[]> => {
  if (!word || word.trim() === "") {
    throw new Error("Please enter a word to search");
  }

  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No definitions found for this word");
    }
    throw new Error("Failed to fetch word definition");
  }
  
  return response.json();
};

const DictionaryThesaurus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordToSearch, setWordToSearch] = useState("");
  
  // Query for word definition
  const { 
    data: apiResponse, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['dictionary', wordToSearch],
    queryFn: () => fetchWordDefinition(wordToSearch),
    enabled: !!wordToSearch,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setWordToSearch(searchTerm.trim());
    } else {
      toast.error("Please enter a word to search");
    }
  };
  
  const handleWordClick = (word: string) => {
    setSearchTerm(word);
    setWordToSearch(word);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };
  
  const playPronunciation = (url: string) => {
    if (!url) {
      toast.error("No pronunciation audio available");
      return;
    }
    
    const audio = new Audio(url);
    audio.play().catch(error => {
      console.error("Failed to play audio:", error);
      toast.error("Failed to play pronunciation");
    });
  };
  
  return (
    <ToolLayout
      title="Dictionary & Thesaurus"
      description="Look up definitions, pronunciations, synonyms, and related words"
      icon={<BookIcon className="h-6 w-6 text-violet-500" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Enter a word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSearchTerm("")}
                  >
                    &times;
                  </button>
                )}
              </div>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {isLoading && (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-muted-foreground">Fetching word information...</p>
          </div>
        )}
        
        {isError && (
          <Card className="mb-6 border-red-500/30">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error fetching word information</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "Unknown error occurred"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {apiResponse && !isLoading && apiResponse.length > 0 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{apiResponse[0].word}</h1>
                    {apiResponse[0].phonetic && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        {apiResponse[0].phonetic}
                        {apiResponse[0].phonetics && apiResponse[0].phonetics.length > 0 && 
                          apiResponse[0].phonetics.some(p => p.audio) && (
                          <button 
                            className="p-1 hover:bg-muted/50 rounded-full transition-colors"
                            onClick={() => playPronunciation(apiResponse[0].phonetics.find(p => p.audio)?.audio || '')}
                          >
                            <VolumeIcon className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="definitions">
                  <TabsList className="mb-4">
                    <TabsTrigger value="definitions">Definitions</TabsTrigger>
                    <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
                    <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="definitions">
                    {apiResponse[0].meanings && apiResponse[0].meanings.length > 0 ? (
                      <div className="space-y-6">
                        {apiResponse[0].meanings.map((meaning, mIndex) => (
                          <div key={mIndex} className="mb-4">
                            <h3 className="text-lg font-medium mb-2 capitalize">
                              {meaning.partOfSpeech}
                            </h3>
                            
                            <Accordion type="single" collapsible className="w-full">
                              {meaning.definitions.map((def, dIndex) => (
                                <AccordionItem value={`def-${mIndex}-${dIndex}`} key={dIndex}>
                                  <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center text-left">
                                      <span className="mr-3 text-muted-foreground">
                                        {dIndex + 1}.
                                      </span>
                                      <span>{def.definition.length > 80 ? `${def.definition.substring(0, 80)}...` : def.definition}</span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-8 space-y-3">
                                      <p className="text-sm">{def.definition}</p>
                                      {def.example && (
                                        <div className="p-3 bg-muted/20 rounded-md">
                                          <p className="italic text-sm">"{def.example}"</p>
                                        </div>
                                      )}
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs"
                                        onClick={() => copyToClipboard(def.definition)}
                                      >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy
                                      </Button>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No definitions available for this word.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="synonyms">
                    {apiResponse[0].meanings && apiResponse[0].meanings.some(m => m.synonyms && m.synonyms.length > 0) ? (
                      <div className="space-y-6">
                        {apiResponse[0].meanings
                          .filter(m => m.synonyms && m.synonyms.length > 0)
                          .map((meaning, idx) => (
                            <div key={idx}>
                              <h3 className="text-lg font-medium mb-3 capitalize">
                                {meaning.partOfSpeech}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {meaning.synonyms!.map((word, widx) => (
                                  <Button
                                    key={widx}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => handleWordClick(word)}
                                  >
                                    {word}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No synonyms found for this word.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="antonyms">
                    {apiResponse[0].meanings && apiResponse[0].meanings.some(m => m.antonyms && m.antonyms.length > 0) ? (
                      <div className="space-y-6">
                        {apiResponse[0].meanings
                          .filter(m => m.antonyms && m.antonyms.length > 0)
                          .map((meaning, idx) => (
                            <div key={idx}>
                              <h3 className="text-lg font-medium mb-3 capitalize">
                                {meaning.partOfSpeech}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {meaning.antonyms!.map((word, widx) => (
                                  <Button
                                    key={widx}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => handleWordClick(word)}
                                  >
                                    {word}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No antonyms found for this word.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <span>Powered by Free Dictionary API</span>
                  </div>
                  {apiResponse[0].sourceUrls && apiResponse[0].sourceUrls.length > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={apiResponse[0].sourceUrls[0]}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Source
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {!wordToSearch && !isLoading && !isError && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center max-w-md mx-auto">
                <BookIcon className="h-12 w-12 text-violet-500/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Dictionary & Thesaurus</h3>
                <p className="text-muted-foreground mb-6">
                  Search for a word to see its definitions, pronunciations, synonyms, and antonyms.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Try these words:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["privacy", "tool", "example"].map(word => (
                      <Button 
                        key={word} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleWordClick(word)}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default DictionaryThesaurus;
