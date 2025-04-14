import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

// Story scenario templates
export const STORY_TEMPLATES = {
  fantasyAdventure: [
    "A young wizard discovers they can communicate with ancient dragons thought to be extinct.",
    "A portal to a magical realm opens in a city park, causing creatures from fairy tales to enter our world.",
    "A blacksmith's apprentice forges a legendary weapon that gives them unexpected powers.",
    "An amnesiac wakes up in a magical forest with a mysterious artifact and a talking animal companion.",
    "A scholar finds an ancient map leading to a forgotten civilization with magic beyond imagination.",
    "A group of friends discover they each control an elemental power, making them targets of an ancient cult.",
    "A kitchen servant in a royal castle discovers they are the true heir to the throne of a magical kingdom.",
    "A mercenary with a cursed weapon must complete a series of quests to break the curse.",
    "A bookshop owner finds that certain rare books are portals to the worlds described within them.",
    "A magical competition brings together contestants from different magical realms and traditions.",
  ],

  scienceFiction: [
    "A scientist develops an AI that claims to be from the future, warning of an impending catastrophe.",
    "First contact with aliens occurs through mysterious signals received by a home-built radio telescope.",
    "A routine space mission discovers evidence that humans originated from another planet.",
    "A genetic modification meant to cure disease gives people unexpected abilities and complications.",
    "Time travelers arrive from the future, desperately trying to prevent a specific technological advance.",
    "A new technology allows people to share dreams, leading to unexpected consequences.",
    "A space colony loses contact with Earth and must decide whether to return or forge their own destiny.",
    "A person discovers their entire life has been an experiment within a simulated reality.",
    "Humans develop the ability to transfer consciousness into synthetic bodies.",
    "An astronaut returns from a deep space mission to find Earth dramatically changed.",
  ],

  mystery: [
    "A famous painting vanishes from a secure museum without any sign of a break-in.",
    "A detective receives letters predicting crimes that haven't happened yet.",
    "A small town experiences the same mysterious event on the same day each year.",
    "A person inherits a house from a relative they never knew existed, filled with strange clues about their family history.",
    "Several people receive anonymous invitations to a remote location, only to become suspects in a crime.",
    "A detective loses their memory but continues to find evidence they've hidden from themselves.",
    "A series of impossible thefts occurs in which valuable items are replaced with perfect replicas.",
    "A true crime writer moves into a house where an unsolved murder took place, only to experience strange phenomena.",
    "A locked room mystery where the suspect has an airtight alibi but all evidence points to their guilt.",
    "A cold case detective finds connections between seemingly unrelated crimes spanning decades.",
  ],

  romance: [
    "Rivals at work are forced to collaborate on a project that takes them on an unexpected journey.",
    "A chef and food critic fall in love without realizing each other's identities.",
    "Neighbors communicating through notes begin to fall for each other before ever meeting face-to-face.",
    "A chance meeting during a travel delay leads to an unexpected holiday romance.",
    "A wedding planner falls for the reluctant sibling of one of their clients.",
    "Two people who were childhood friends reconnect after years apart, seeing each other in a new light.",
    "A misdelivered package leads to an unexpected correspondence between strangers.",
    "A bookstore owner and an e-book developer find common ground despite their different views on reading.",
    "A tour guide keeps encountering the same tourist in different cities around the world.",
    "Two people stuck in a time loop keep meeting each other in different ways with each reset.",
  ],

  historicalFiction: [
    "A spy during a pivotal historical battle faces a moral dilemma that could change the course of history.",
    "A servant in a grand house becomes entangled in a noble family's dangerous secrets.",
    "An archaeologist uncovers evidence that challenges everything known about an ancient civilization.",
    "A musician struggles to preserve forbidden cultural traditions during a time of oppression.",
    "A doctor develops revolutionary medical techniques far ahead of their time.",
    "A time period told from the perspective of someone whose voice is often missing from historical accounts.",
    "A young person gets caught up in a historical revolution or movement that changes their life.",
    "Two people from opposing sides of a historical conflict develop an unexpected relationship.",
    "A trader traveling ancient routes becomes involved in political intrigue between kingdoms.",
    "The untold story behind a famous historical event, from the perspective of an overlooked participant.",
  ],

  horror: [
    "A house remodeler discovers something disturbing sealed within the walls of an old home.",
    "A small town begins to experience shared nightmares that start coming true.",
    "An ancient artifact brings misfortune to anyone who possesses it.",
    "A person discovers they can see a creature that only appears in the peripheral vision of others.",
    "A remote wilderness retreat becomes a trap when participants begin to change in disturbing ways.",
    "A new social media platform shows users how they will die.",
    "A person realizes their deja vu experiences are warnings about deadly events they must prevent.",
    "A family discovers their new home exists in a place where the barrier between worlds is thin.",
    "An experimental treatment gives a patient the ability to see entities no one else can perceive.",
    "A forgotten ritual accidentally performed awakens something that has been dormant for centuries.",
  ],

  dystopian: [
    "In a world where memories can be traded, someone discovers their most precious memory is actually stolen.",
    "A society where children are raised by the government, and one official begins to question the system.",
    "A world where artistic expression is strictly regulated, and an underground movement fights to create freely.",
    "A society where citizens' worth is determined by a single test taken at age 18.",
    "A future where privacy no longer exists, and someone discovers how to disappear completely.",
    "A world divided into strictly enforced castes based on genetic testing at birth.",
    "A society that has eliminated negative emotions through mandatory medication.",
    "A future where resources are so scarce that people must compete for basic necessities.",
    "A world where aging has been cured, but population control means someone must die for each birth.",
    "A society where dreams are monitored and controlled by the government.",
  ],

  comedy: [
    "A serious professional is mistaken for an expert in a field they know nothing about and must keep up the pretense.",
    "A person who can suddenly hear everyone's inner thoughts discovers people are much weirder than expected.",
    "A small town prepares for a visit from a celebrity who has no intention of actually showing up.",
    "A fake psychic accidentally makes a real prediction and becomes entangled in the consequences.",
    "A family reunion brings together relatives with hilariously incompatible lifestyles and beliefs.",
    "A person tries to impress their date's family but keeps getting caught in increasingly absurd lies.",
    "The world's worst tour guide leads a group of tourists on an unexpectedly memorable adventure.",
    "A case of mistaken identity leads someone to live another person's much more exciting life.",
    "A famous self-help guru desperately tries to hide the fact that their own life is falling apart.",
    "A person's pets conspire to improve their owner's love life.",
  ],
};

// Character archetypes for story generation
export const CHARACTER_ARCHETYPES = [
  "The Hero - A courageous protagonist who overcomes obstacles to achieve their goal",
  "The Mentor - A wise guide who provides knowledge and support to the protagonist",
  "The Sidekick - A loyal companion who supports the protagonist throughout their journey",
  "The Anti-Hero - A protagonist with flawed morals who still accomplishes heroic deeds",
  "The Trickster - A mischievous character who uses cunning and deception",
  "The Shadow - A villain or antagonist who opposes the protagonist's goals",
  "The Guardian - A protector who defends something important or sacred",
  "The Innocent - A pure character whose naivety often leads to growth through experience",
  "The Rebel - A character who challenges authority and fights against the established system",
  "The Explorer - A seeker of new experiences, knowledge, and discoveries",
  "The Creator - An innovative character driven to build something new and meaningful",
  "The Ruler - A character who seeks control and creates order from chaos",
  "The Sage - A character driven by wisdom who seeks truth and understanding",
  "The Magician - A transformative character who makes things happen through special knowledge",
  "The Caregiver - A nurturing character who protects and cares for others",
  "The Everyman - A relatable character representing ordinary people facing extraordinary situations",
];

// Plot structures for story generation
export const PLOT_STRUCTURES = [
  "Hero's Journey - The protagonist leaves their ordinary world, faces trials, and returns transformed",
  "Rags to Riches - A character rises from poverty or obscurity to success and fortune",
  "Quest - The protagonist searches for something important, encountering obstacles along the way",
  "Voyage and Return - Characters journey to a strange land, overcome challenges, and return changed",
  "Comedy - Characters overcome a series of escalating misunderstandings leading to a happy resolution",
  "Tragedy - A character's flaws or mistakes lead to their downfall despite their positive qualities",
  "Rebirth - A character undergoes a transformation and becomes a better person through crisis",
  "Overcoming the Monster - The protagonist must defeat a powerful antagonist threatening them or their community",
  "Mystery - Characters uncover clues to solve a puzzle or crime, revealing truth by the end",
  "Fish Out of Water - A character is placed in an unfamiliar environment and must adapt",
  "Coming of Age - A young protagonist matures through challenging experiences",
  "Parallel Lives - Multiple storylines that may eventually intersect or mirror each other",
  "Frame Story - A story within a story, where a narrative is used to organize other narratives",
  "In Medias Res - Beginning in the middle of the action, then filling in background information",
  "Nonlinear - Events told out of chronological order to create specific effects",
];

// Settings for story generation
export const SETTINGS = [
  "Enchanted Forest - A magical woodland filled with mythical creatures and hidden wonders",
  "Cyberpunk Metropolis - A high-tech urban dystopia with advanced technology and social inequality",
  "Medieval Castle - A fortress from the Middle Ages with courts, dungeons, and intrigue",
  "Space Colony - A settlement of humans living on another planet or space station",
  "Underwater City - A civilization that exists beneath the ocean's surface",
  "Post-Apocalyptic Wasteland - A world devastated by some catastrophic event",
  "Victorian London - The fog-filled streets of 19th century England",
  "Ancient Temple - A sacred place of worship with forgotten secrets and traps",
  "Desert Oasis - A fertile haven surrounded by harsh, unforgiving sands",
  "Small Town America - A seemingly idyllic community with hidden secrets",
  "Pirate Ship - A vessel sailing the high seas in search of adventure and treasure",
  "Boarding School - An educational institution where students live during term time",
  "Haunted House - A dwelling place for spirits with a tragic past",
  "Pocket Dimension - A small universe with its own physical laws",
  "Mythological Realm - A world based on legends and folklore traditions",
  "Corporate Headquarters - The center of a powerful business empire",
  "Floating Islands - Landmasses that drift through the sky",
  "Underground Network - A hidden system of caves and tunnels beneath the surface",
  "Arctic Research Station - An isolated facility in the frozen wilderness",
  "Parallel Universe - A reality similar to our own but with critical differences",
];

// Function to get random item from an array
const getRandomItem = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export interface StoryIdea {
  genre: string;
  premise: string;
  character: string;
  plot: string;
  setting: string;
}

export interface StoryGeneratorContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentStoryIdea: StoryIdea | null;
  savedStoryIdeas: StoryIdea[];
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  generateStoryIdea: () => void;
  saveStoryIdea: (idea: StoryIdea) => void;
  removeStoryIdea: (index: number) => void;
  exportStoryIdeas: () => void;
  copyToClipboard: (text: string) => void;
  formatStoryIdea: (idea: StoryIdea) => string;
}

const StoryIdeaGeneratorContext = createContext<
  StoryGeneratorContextType | undefined
>(undefined);

export const useStoryGenerator = () => {
  const context = useContext(StoryIdeaGeneratorContext);
  if (!context) {
    throw new Error(
      "useStoryGenerator must be used within a StoryIdeaGeneratorProvider"
    );
  }
  return context;
};

export const StoryIdeaGeneratorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [currentStoryIdea, setCurrentStoryIdea] = useState<StoryIdea | null>(
    null
  );
  const [savedStoryIdeas, setSavedStoryIdeas] = useState<StoryIdea[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("random");

  // Generate a story idea
  const generateStoryIdea = () => {
    // Determine genre
    let genre: string;
    const genres = Object.keys(STORY_TEMPLATES);

    if (selectedGenre === "random") {
      genre = genres[Math.floor(Math.random() * genres.length)];
    } else {
      genre = selectedGenre;
    }

    // Get random elements
    const premise = getRandomItem(
      STORY_TEMPLATES[genre as keyof typeof STORY_TEMPLATES]
    );
    const character = getRandomItem(CHARACTER_ARCHETYPES);
    const plot = getRandomItem(PLOT_STRUCTURES);
    const setting = getRandomItem(SETTINGS);

    // Create story idea
    const storyIdea: StoryIdea = {
      genre,
      premise,
      character,
      plot,
      setting,
    };

    setCurrentStoryIdea(storyIdea);
    toast.success("New story idea generated!");
  };

  // Save a story idea
  const saveStoryIdea = (idea: StoryIdea) => {
    setSavedStoryIdeas([...savedStoryIdeas, idea]);
    toast.success("Story idea saved!");
  };

  // Remove a saved story idea
  const removeStoryIdea = (index: number) => {
    const newSavedIdeas = [...savedStoryIdeas];
    newSavedIdeas.splice(index, 1);
    setSavedStoryIdeas(newSavedIdeas);
    toast("Story idea removed");
  };

  // Format a story idea for display or export
  const formatStoryIdea = (idea: StoryIdea) => {
    const genreDisplay =
      idea.genre.charAt(0).toUpperCase() +
      idea.genre
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim();

    return `# ${genreDisplay} Story Idea

## Premise
${idea.premise}

## Character Archetype
${idea.character}

## Plot Structure
${idea.plot}

## Setting
${idea.setting}`;
  };

  // Export all saved story ideas
  const exportStoryIdeas = () => {
    if (savedStoryIdeas.length === 0) {
      toast("No saved story ideas to export", {
        description: "Save some ideas first!",
      });
      return;
    }

    const content = savedStoryIdeas
      .map((idea, index) => `${formatStoryIdea(idea)}\n\n${"-".repeat(50)}\n\n`)
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "story-ideas_ZeroKit.txt";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Story ideas exported successfully!");
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  // Generate an initial story idea
  useEffect(() => {
    generateStoryIdea();
  }, []);

  // Load saved story ideas from localStorage
  useEffect(() => {
    const storedIdeas = localStorage.getItem("zerokitSavedStoryIdeas");
    if (storedIdeas) {
      setSavedStoryIdeas(JSON.parse(storedIdeas));
    }
  }, []);

  // Save to localStorage when savedStoryIdeas changes
  useEffect(() => {
    if (savedStoryIdeas.length > 0) {
      localStorage.setItem(
        "zerokitSavedStoryIdeas",
        JSON.stringify(savedStoryIdeas)
      );
    }
  }, [savedStoryIdeas]);

  const value = {
    activeTab,
    setActiveTab,
    currentStoryIdea,
    savedStoryIdeas,
    selectedGenre,
    setSelectedGenre,
    generateStoryIdea,
    saveStoryIdea,
    removeStoryIdea,
    exportStoryIdeas,
    copyToClipboard,
    formatStoryIdea,
  };

  return (
    <StoryIdeaGeneratorContext.Provider value={value}>
      {children}
    </StoryIdeaGeneratorContext.Provider>
  );
};
