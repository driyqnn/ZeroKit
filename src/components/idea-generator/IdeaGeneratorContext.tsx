import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

// Idea categories
export const IDEA_CATEGORIES = {
  business: [
    "Create a subscription box service for office supplies",
    "Start a mobile car detailing service",
    "Create an app that connects local farmers to restaurants",
    "Launch a virtual assistant service for small businesses",
    "Start a podcast production company for business professionals",
    "Create a coworking space for parents with childcare included",
    "Develop a meal prep service for fitness enthusiasts",
    "Start a sustainable packaging consulting business",
    "Create a platform connecting local tour guides with tourists",
    "Launch a pet-sitting service with live video updates",
    "Develop a corporate team-building workshop service",
    "Create an eco-friendly cleaning service",
    "Start a pop-up retail space for online brands",
    "Create a financial literacy app for teenagers",
    "Develop a platform for renting professional equipment",
  ],

  technology: [
    "Build an AR app that identifies plants and provides care instructions",
    "Create a smart home device that monitors water usage",
    "Develop a browser extension that summarizes long articles",
    "Build an app that gamifies learning sign language",
    "Create a platform that connects mentors with students in tech",
    "Develop a voice-based cooking assistant for smart speakers",
    "Build a tool that converts handwriting to digital text in real-time",
    "Create an app that generates personalized workout plans with AI",
    "Develop a platform for collaborative music production",
    "Build a system that translates baby cries into needs",
    "Create a blockchain solution for tracking ethical supply chains",
    "Develop a virtual reality meditation experience",
    "Build a platform for crowdsourced environmental monitoring",
    "Create a smart mirror with personalized health insights",
    "Develop an AI assistant for legal document review",
  ],

  creative: [
    "Write a short story that takes place entirely in an elevator",
    "Create a photo series documenting morning rituals across cultures",
    "Design a board game inspired by historical events",
    "Compose a song using only sounds recorded in your kitchen",
    "Create an art installation using recycled electronics",
    "Write a children's book about an unlikely friendship",
    "Design a fashion collection inspired by architecture",
    "Create a documentary about local artisans",
    "Develop a unique cooking technique and document the results",
    "Design a typeface based on your handwriting",
    "Create a series of illustrations based on dreams",
    "Write a play set in an alternative historical timeline",
    "Design a garden that changes appearance with the seasons",
    "Create a podcast exploring obscure music genres",
    "Develop a new form of dance combining multiple styles",
  ],

  education: [
    "Create an interactive timeline of scientific discoveries",
    "Develop a geography game using real satellite imagery",
    "Build a hands-on learning kit for simple electronics",
    "Create an app that teaches foreign language through daily conversations",
    "Develop a storytelling method to teach historical events",
    "Create a peer-to-peer platform for skill sharing in local communities",
    "Build an augmented reality experience for museum exhibits",
    "Develop a game that teaches coding concepts without screens",
    "Create a subscription box for science experiments at home",
    "Design a curriculum that combines art and mathematics",
    "Create a mobile classroom for rural education",
    "Develop an adaptive learning system for different learning styles",
    "Create audio lessons that teach while you commute",
    "Build a platform connecting retired professionals with students",
    "Develop interactive textbooks with embedded simulations",
  ],

  lifestyle: [
    "Create a minimalist challenge program for digital decluttering",
    "Develop a habit-tracking system based on behavioral psychology",
    "Design a home organization method for different personality types",
    "Create a community-based skill sharing network",
    "Develop a method for incorporating mindfulness into daily routines",
    "Create a sustainable fashion rental service for special occasions",
    "Design an urban gardening system for small spaces",
    "Create a personalized meal planning service based on dietary preferences",
    "Develop a family history documentation kit",
    "Create a fitness program combining traditional and modern techniques",
    "Design a zero-waste kitchen transformation plan",
    "Create a travel experience focused on local cultural immersion",
    "Develop a system for creating personalized self-care routines",
    "Create a neighborhood resource sharing network",
    "Design a home-based retreat experience",
  ],
};

// Function to get random item from an array
const getRandomItem = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to get multiple random items from an array
const getMultipleRandomItems = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface IdeaGeneratorContextType {
  currentIdea: string;
  generatedIdeas: string[];
  savedIdeas: string[];
  category: string;
  ideaCount: number;
  activeTab: string;
  includeAllCategories: boolean;
  setActiveTab: (tab: string) => void;
  setCategory: (category: string) => void;
  setIdeaCount: (count: number) => void;
  setIncludeAllCategories: (include: boolean) => void;
  generateIdea: () => void;
  saveIdea: (idea: string) => void;
  removeIdea: (idea: string) => void;
  copyToClipboard: (idea: string) => void;
  exportIdeas: () => void;
}

const IdeaGeneratorContext = createContext<
  IdeaGeneratorContextType | undefined
>(undefined);

export const useIdeaGenerator = () => {
  const context = useContext(IdeaGeneratorContext);
  if (!context) {
    throw new Error(
      "useIdeaGenerator must be used within an IdeaGeneratorProvider"
    );
  }
  return context;
};

export const IdeaGeneratorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentIdea, setCurrentIdea] = useState<string>("");
  const [category, setCategory] = useState<string>("random");
  const [ideaCount, setIdeaCount] = useState<number>(1);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [includeAllCategories, setIncludeAllCategories] =
    useState<boolean>(true);

  // Generate a new idea
  const generateIdea = () => {
    let availableCategories: string[] = [];

    if (category === "random" || includeAllCategories) {
      // Get all category names
      availableCategories = Object.keys(IDEA_CATEGORIES);
    } else {
      availableCategories = [category];
    }

    // Randomly select a category if "random" is selected
    const selectedCategory =
      category === "random"
        ? availableCategories[
            Math.floor(Math.random() * availableCategories.length)
          ]
        : category;

    // Get ideas from the selected category
    const categoryIdeas =
      IDEA_CATEGORIES[selectedCategory as keyof typeof IDEA_CATEGORIES];

    if (ideaCount === 1) {
      // Get a single idea
      const newIdea = getRandomItem(categoryIdeas);
      setCurrentIdea(newIdea);
      setGeneratedIdeas([newIdea]);
    } else {
      // Get multiple ideas
      const multipleIdeas = getMultipleRandomItems(categoryIdeas, ideaCount);
      setCurrentIdea(multipleIdeas[0] || "");
      setGeneratedIdeas(multipleIdeas);
    }

    toast.success(
      `${ideaCount > 1 ? ideaCount + " ideas" : "Idea"} generated!`
    );
  };

  // Copy idea to clipboard
  const copyToClipboard = (idea: string) => {
    navigator.clipboard
      .writeText(idea)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  // Save an idea to the saved list
  const saveIdea = (idea: string) => {
    if (!savedIdeas.includes(idea)) {
      setSavedIdeas([...savedIdeas, idea]);
      toast.success("Idea saved!");
    } else {
      toast("This idea is already saved", {
        description: "Try generating a new idea instead.",
      });
    }
  };

  // Remove idea from saved list
  const removeIdea = (ideaToRemove: string) => {
    setSavedIdeas(savedIdeas.filter((idea) => idea !== ideaToRemove));
    toast("Idea removed from saved list");
  };

  // Export saved ideas
  const exportIdeas = () => {
    if (savedIdeas.length === 0) {
      toast("No saved ideas to export", {
        description: "Save some ideas first!",
      });
      return;
    }

    const content = savedIdeas.join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "my-ideas_ZeroKit.txt";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Ideas exported successfully!");
  };

  // Generate an initial idea when component mounts
  useEffect(() => {
    generateIdea();
  }, []);

  // Load saved ideas from localStorage
  useEffect(() => {
    const storedIdeas = localStorage.getItem("zerokitSavedIdeas");
    if (storedIdeas) {
      setSavedIdeas(JSON.parse(storedIdeas));
    }
  }, []);

  // Save to localStorage when savedIdeas changes
  useEffect(() => {
    if (savedIdeas.length > 0) {
      localStorage.setItem("zerokitSavedIdeas", JSON.stringify(savedIdeas));
    }
  }, [savedIdeas]);

  const value = {
    currentIdea,
    generatedIdeas,
    savedIdeas,
    category,
    ideaCount,
    activeTab,
    includeAllCategories,
    setActiveTab,
    setCategory,
    setIdeaCount,
    setIncludeAllCategories,
    generateIdea,
    saveIdea,
    removeIdea,
    copyToClipboard,
    exportIdeas,
  };

  return (
    <IdeaGeneratorContext.Provider value={value}>
      {children}
    </IdeaGeneratorContext.Provider>
  );
};
