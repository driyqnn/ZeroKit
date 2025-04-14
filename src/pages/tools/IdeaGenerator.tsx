import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Lightbulb,
  RefreshCw,
  Check,
  BookmarkPlus,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

type IdeaCategory =
  | "app"
  | "business"
  | "creative"
  | "project"
  | "game"
  | "gift";

interface IdeaItem {
  id: string;
  text: string;
  category: IdeaCategory;
  tags: string[];
  favorite?: boolean;
  saved?: boolean;
}

const IdeaGenerator: React.FC = () => {
  const [category, setCategory] = useState<IdeaCategory>("app");
  const [currentIdea, setCurrentIdea] = useState<IdeaItem | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<IdeaItem[]>([]);
  const [favoriteIdeas, setFavoriteIdeas] = useState<IdeaItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const ideaDatabase: Record<IdeaCategory, string[]> = {
    app: [
      "A journal app that asks questions based on your day's events",
      "A meal planning app that suggests recipes based on what's in your fridge",
      "A wellness app that helps you track your water intake, sleep, and exercise",
      "A language learning app that uses your camera to identify objects and teach you their names",
      "A social media app for book lovers to share and discuss their reading lists",
      "A budgeting app that gives you personalized saving challenges",
      "A habit tracking app with visual growth of a virtual plant or pet",
      "A co-working app that pairs remote workers for virtual work sessions",
      "A meditation app with binaural beats that adapt to your heart rate",
      "An app that turns your daily commute into a game or story",
      "A productivity app that blocks distractions and rewards focused work",
      "A recipes app that adjusts serving sizes and measurements automatically",
      "A smart home control app with voice-activated routines",
      "A personal safety app with location sharing and automated check-ins",
      "A memory training app with personalized exercises based on your progress",
      "A parking spot finder app that uses crowdsourced data",
      "A digital decluttering app that helps organize your files and photos",
      "An eco-conscious shopping assistant that rates products' sustainability",
      "A fitness app that generates workouts based on available equipment",
      "A personal finance education app with simulated investment scenarios",
    ],
    business: [
      "A subscription box service for sustainable home products",
      "A mobile pet grooming service that comes to clients' homes",
      "A digital marketing agency specializing in small local businesses",
      "A coworking space for parents with built-in childcare",
      "A zero-waste grocery delivery service using reusable containers",
      "A virtual reality fitness studio with custom workout programs",
      "A tech repair service that specializes in extending device lifespan",
      "A consulting firm that helps businesses reduce their carbon footprint",
      "A meal prep service focusing on dietary restrictions and preferences",
      "A sustainable fashion rental service for everyday clothing",
      "A wellness retreat planning service for corporate team building",
      "A specialized cleaning service for elderly and mobility-impaired clients",
      "An equipment rental platform for occasional DIY projects",
      "A financial literacy coaching service for young professionals",
      "A virtual personal assistant service for small business owners",
      "A peer-to-peer skills exchange platform for local communities",
      "A specialized moving service for seniors downsizing homes",
      "A popup restaurant concept that features rotating guest chefs",
      "A drone photography service for real estate and events",
      "An educational workshop series teaching practical life skills",
    ],
    creative: [
      "Create a series of paintings inspired by music genres",
      "Design a board game based on your favorite historical period",
      "Write a children's book that explains complex scientific concepts",
      "Develop a podcast interviewing people with unusual occupations",
      "Create a photographic essay documenting local small businesses",
      "Design a collection of upcycled furniture from salvaged materials",
      "Create a comic series based on everyday life observations",
      "Compose music that represents the feeling of different seasons",
      "Design wearable art pieces that transform with movement",
      "Create a cookbook featuring family recipes with their histories",
      "Build interactive sculptures that respond to sound or touch",
      "Develop a series of short films exploring different human emotions",
      "Create digital art that combines traditional techniques with technology",
      "Design a tarot deck with modern interpretations of archetypes",
      "Write poetry inspired by urban landscapes and architecture",
      "Create a line of handmade paper products with embedded seeds",
      "Design personalized typefaces based on individual handwriting",
      "Develop a stop-motion animation using everyday objects",
      "Create a series of illustrated maps highlighting local hidden gems",
      "Design a collection of jewelry inspired by natural ecosystems",
    ],
    project: [
      "Create a vertical garden system for small spaces",
      "Build a mini library exchange box for your neighborhood",
      "Design and code a personal portfolio website from scratch",
      "Create a documentary about local history using interviews with residents",
      "Build a weather station that reports to a custom dashboard",
      "Create a series of educational videos on a topic you're knowledgeable about",
      "Design a custom board game based on inside jokes with friends or family",
      "Restore an old piece of furniture with modern techniques",
      "Create a digital or physical cookbook of family recipes with stories",
      "Build a home automation system using Raspberry Pi or Arduino",
      "Start a community compost program for your neighborhood",
      "Design and sew a collection of clothes based on a specific theme",
      "Create a detailed guide to local wildlife with your own photography",
      "Build a customized standing desk with specific storage solutions",
      "Design a series of printable wall art based on mathematical concepts",
      "Create a comprehensive emergency preparedness kit with custom guides",
      "Build a solar-powered charging station for mobile devices",
      "Create a daily photography project focusing on a specific theme",
      "Design and build a custom gaming table with storage for accessories",
      "Create a digital archive of family photos and documents with metadata",
    ],
    game: [
      "A game where players must navigate as different colors that each interact uniquely with the environment",
      "A cooperative storytelling game where each player controls a character in an evolving narrative",
      "A puzzle platformer where the player can manipulate time for specific objects",
      "A strategy game where the goal is ecological balance rather than conquest",
      "A city-building game where resources fluctuate based on climate change effects",
      "A detective game where the player analyzes conversations for psychological clues",
      "A card game where the rules gradually change based on cards played",
      "A role-playing game set in a world where magic is fueled by memories",
      "A platformer where gravity direction can be changed at will",
      "A survival game set in a world of sentient plants with unique abilities",
      "A puzzle game where players manipulate sound waves to navigate",
      "A simulation game about running an interstellar trading company",
      "A stealth game where players control a shapeshifting creature",
      "A racing game where the track transforms based on music rhythm",
      "A tower defense game where defenses can be reprogrammed during waves",
      "A cooking game where flavor combinations create magical effects",
      "A management sim about running a sanctuary for mythical creatures",
      "A puzzle game where players manipulate light and shadows to progress",
      "A narrative game that adapts its story based on the player's real-time emotions",
      "A cooperative game where each player experiences a different sensory version of the same world",
    ],
    gift: [
      "A custom star map showing the night sky from a meaningful date and location",
      "A subscription box tailored to their specific hobby or interest",
      "A digital picture frame preloaded with photos of shared memories",
      "A personalized recipe book with family favorites and new suggestions",
      "A custom board game based on inside jokes and shared experiences",
      "A set of custom cocktail ingredients with recipe cards for their favorite drinks",
      "A commissioned piece of art depicting their favorite place or memory",
      "A self-care kit with items specific to their preferences and needs",
      "A digital time capsule with messages from friends and family",
      "A custom puzzle featuring a meaningful photo or artwork",
      "A garden kit with seeds of their favorite plants or herbs",
      "A personalized audiobook or playlist with a meaningful introduction",
      "A custom map highlighting all the places you've been together",
      "A subscription to an online class related to a skill they want to learn",
      "A memory jar filled with notes about favorite shared moments",
      "A custom calendar featuring photos from the past year",
      "A DIY kit for a craft or hobby they've expressed interest in",
      "A set of personalized stationery or journaling supplies",
      "A curated collection of books based on their reading preferences",
      "A custom phone case or laptop skin featuring meaningful artwork",
    ],
  };

  const categoryTags: Record<IdeaCategory, string[]> = {
    app: [
      "Productivity",
      "Health",
      "Entertainment",
      "Education",
      "Social",
      "Utility",
    ],
    business: [
      "Service",
      "Product",
      "B2B",
      "B2C",
      "Local",
      "Tech",
      "Sustainable",
    ],
    creative: [
      "Art",
      "Music",
      "Writing",
      "Design",
      "Photography",
      "Craft",
      "Digital",
    ],
    project: [
      "DIY",
      "Tech",
      "Home",
      "Community",
      "Digital",
      "Craft",
      "Learning",
    ],
    game: [
      "Adventure",
      "Strategy",
      "Puzzle",
      "Simulation",
      "RPG",
      "Casual",
      "Innovative",
    ],
    gift: [
      "Personalized",
      "Experience",
      "Handmade",
      "Digital",
      "Subscription",
      "Practical",
      "Sentimental",
    ],
  };

  const generateIdea = () => {
    setGenerating(true);

    setTimeout(() => {
      const ideas = ideaDatabase[category];
      const randomIndex = Math.floor(Math.random() * ideas.length);
      const ideaText = ideas[randomIndex];

      const availableTags = [...categoryTags[category]];
      const shuffledTags = availableTags.sort(() => 0.5 - Math.random());
      const numTags = Math.floor(Math.random() * 2) + 2;
      const selectedTags = shuffledTags.slice(0, numTags);

      const newIdea: IdeaItem = {
        id: crypto.randomUUID(),
        text: ideaText,
        category,
        tags: selectedTags,
      };

      setCurrentIdea(newIdea);
      setGenerating(false);
    }, 600);
  };

  const saveIdea = () => {
    if (!currentIdea) return;

    if (savedIdeas.some((idea) => idea.id === currentIdea.id)) {
      toast.info("This idea is already saved");
      return;
    }

    const ideaToSave = { ...currentIdea, saved: true };
    setSavedIdeas([ideaToSave, ...savedIdeas]);
    setCurrentIdea(ideaToSave);

    toast.success("Idea saved to your collection");
  };

  const toggleFavorite = () => {
    if (!currentIdea) return;

    const isFavorite = currentIdea.favorite || false;
    const updatedIdea = { ...currentIdea, favorite: !isFavorite };

    setCurrentIdea(updatedIdea);

    setSavedIdeas(
      savedIdeas.map((idea) =>
        idea.id === currentIdea.id ? updatedIdea : idea
      )
    );

    if (!isFavorite) {
      setFavoriteIdeas([updatedIdea, ...favoriteIdeas]);
      toast.success("Added to favorites");
    } else {
      setFavoriteIdeas(
        favoriteIdeas.filter((idea) => idea.id !== currentIdea.id)
      );
      toast.info("Removed from favorites");
    }
  };

  const removeSavedIdea = (id: string) => {
    setSavedIdeas(savedIdeas.filter((idea) => idea.id !== id));
    setFavoriteIdeas(favoriteIdeas.filter((idea) => idea.id !== id));

    if (currentIdea && currentIdea.id === id) {
      setCurrentIdea(null);
    }

    toast.info("Idea removed");
  };

  const copyIdeaToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    });
  };

  return (
    <ToolLayout
      title="Idea Generator"
      description="Generate creative ideas for apps, businesses, projects, games, and more"
      icon={<Lightbulb className="h-6 w-6 text-primary" />}
      category="Creativity & Design">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Ideas</CardTitle>
              <CardDescription>
                Choose a category and generate creative ideas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Select
                  value={category}
                  onValueChange={(value: IdeaCategory) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">App Ideas</SelectItem>
                    <SelectItem value="business">Business Ideas</SelectItem>
                    <SelectItem value="creative">Creative Projects</SelectItem>
                    <SelectItem value="project">DIY Projects</SelectItem>
                    <SelectItem value="game">Game Concepts</SelectItem>
                    <SelectItem value="gift">Gift Ideas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[12rem] flex flex-col items-center justify-center p-6 border rounded-lg">
                {currentIdea ? (
                  <div className="text-center">
                    <p className="text-lg font-medium mb-4">
                      {currentIdea.text}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {currentIdea.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyIdeaToClipboard(currentIdea.text)}>
                        {copied ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant={currentIdea.favorite ? "default" : "outline"}
                        size="sm"
                        onClick={toggleFavorite}>
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            currentIdea.favorite ? "fill-current" : ""
                          }`}
                        />
                        {currentIdea.favorite ? "Favorited" : "Favorite"}
                      </Button>
                      <Button
                        variant={currentIdea.saved ? "default" : "outline"}
                        size="sm"
                        onClick={saveIdea}
                        disabled={currentIdea.saved}>
                        <BookmarkPlus className="h-4 w-4 mr-1" />
                        {currentIdea.saved ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click generate to get a new {category} idea</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={generateIdea}
                disabled={generating}>
                {generating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Idea...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate New Idea
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="saved">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved">Saved Ideas</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Ideas</CardTitle>
                  <CardDescription>
                    Your collection of saved ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedIdeas.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {savedIdeas.map((idea) => (
                        <div
                          key={idea.id}
                          className="p-3 border rounded-md hover:border-primary/50 transition-colors group relative"
                          onClick={() => setCurrentIdea(idea)}>
                          <p className="text-sm mb-2 pr-7">{idea.text}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {idea.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                              {idea.tags.length > 2 && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                                  +{idea.tags.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {idea.category}
                            </span>
                          </div>

                          <button
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedIdea(idea.id);
                            }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>

                          {idea.favorite && (
                            <span className="absolute top-3 right-8 text-primary">
                              <Heart className="h-4 w-4 fill-current" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                      <BookmarkPlus className="h-10 w-10 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">
                        No saved ideas yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Generate ideas and save them to see them here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Ideas</CardTitle>
                  <CardDescription>
                    Your favorite ideas for quick access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteIdeas.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {favoriteIdeas.map((idea) => (
                        <div
                          key={idea.id}
                          className="p-3 border rounded-md hover:border-primary/50 transition-colors group relative"
                          onClick={() => setCurrentIdea(idea)}>
                          <p className="text-sm mb-2 pr-7">{idea.text}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {idea.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                              {idea.tags.length > 2 && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                                  +{idea.tags.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {idea.category}
                            </span>
                          </div>

                          <button
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedIdea(idea.id);
                            }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                      <Heart className="h-10 w-10 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">
                        No favorite ideas yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mark ideas as favorites to see them here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
};

export default IdeaGenerator;
