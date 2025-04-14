import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { generateRandomItem } from "@/lib/utils";

// Types
export type StoryGenre =
  | "fantasy"
  | "sci-fi"
  | "mystery"
  | "romance"
  | "horror"
  | "adventure"
  | "historical"
  | "comedy";

export type CharacterType =
  | "protagonist"
  | "antagonist"
  | "mentor"
  | "sidekick"
  | "love_interest";

export interface StoryIdea {
  id: string;
  title: string;
  genre: StoryGenre;
  premise: string;
  protagonist: string;
  setting: string;
  conflict: string;
  twist?: string;
  timestamp: Date;
}

interface StoryIdeaContextType {
  currentIdea: StoryIdea | null;
  savedIdeas: StoryIdea[];
  historyIdeas: StoryIdea[];
  selectedGenre: StoryGenre | "random";
  includeCharacters: boolean;
  includeTwist: boolean;
  includeTheme: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedGenre: (genre: StoryGenre | "random") => void;
  setIncludeCharacters: (include: boolean) => void;
  setIncludeTwist: (include: boolean) => void;
  setIncludeTheme: (include: boolean) => void;
  generateStoryIdea: () => void;
  saveIdea: (idea: StoryIdea) => void;
  removeIdea: (id: string) => void;
  clearHistory: () => void;
  exportIdeas: () => void;
}

// Story content data
export const STORY_DATA = {
  genres: [
    "fantasy",
    "sci-fi",
    "mystery",
    "romance",
    "horror",
    "adventure",
    "historical",
    "comedy",
  ],

  characters: {
    protagonist: [
      "A reluctant hero with a hidden past",
      "An ambitious young prodigy with something to prove",
      "A retired veteran forced back into action",
      "A outcast with unique abilities",
      "An ordinary person thrust into extraordinary circumstances",
      "A disgraced professional seeking redemption",
      "A skilled thief with a moral code",
      "A royal heir unaware of their true identity",
      "An unlikely leader who rises to the occasion",
      "A genius with social awkwardness",
      "A character with amnesia discovering troubling truths about their past",
      "A privileged person experiencing the world's harsh realities",
    ],

    antagonist: [
      "A charismatic villain who believes they're doing the right thing",
      "A corrupt authority figure abusing their power",
      "A former friend turned bitter rival",
      "A shadowy organization with unclear motives",
      "A powerful entity with godlike abilities",
      "A mirror image of the protagonist with opposite values",
      "A once-hero corrupted by power or tragedy",
      "An ancient evil awakened in modern times",
      "A brilliant mastermind always several steps ahead",
      "A loved one secretly working against the protagonist",
      "A system or society rather than a single person",
      "An artificial intelligence that has evolved beyond its programming",
    ],
  },

  settings: {
    fantasy: [
      "A floating city among the clouds",
      "A kingdom where magic is forbidden",
      "A forest where the trees are sentient",
      "A world where night never ends",
      "A city built on the back of a giant creature",
      "A realm where dreams become reality",
      "An archipelago where each island has different magical properties",
      "A land where seasons last for decades",
    ],
    "sci-fi": [
      "A colony on a distant planet with unusual properties",
      "Earth after a technological apocalypse",
      "A generation ship traveling to a new solar system",
      "A dystopian megacity controlled by corporations",
      "A space station at the edge of a black hole",
      "A world where humans have merged with technology",
      "An alternate timeline where technology developed differently",
      "A research facility on a hostile alien world",
    ],
    mystery: [
      "A small town with dark secrets",
      "An isolated mansion with a troubled history",
      "A prestigious academy where students are disappearing",
      "A cruise ship where a murder has occurred",
      "An ancient library with forbidden knowledge",
      "A city neighborhood where strange phenomena occur",
      "A remote research facility that's gone silent",
      "A seemingly perfect community with sinister undertones",
    ],
    romance: [
      "A picturesque coastal town where two strangers meet",
      "A bustling city where careers and love collide",
      "A destination wedding bringing old flames together",
      "A traditional family setting challenged by an unlikely relationship",
      "A workplace where professional and personal boundaries blur",
      "A vacation resort that changes lives",
      "A historical setting where social norms restrict relationships",
      "A community rebuilding after a natural disaster",
    ],
    horror: [
      "An abandoned asylum with a troubled past",
      "A forest cabin miles from civilization",
      "A small town beset by a ancient curse",
      "A house where the architecture defies physics",
      "A scientific facility where an experiment went wrong",
      "A remote island cut off by a violent storm",
      "A suburban neighborhood where something is not quite right",
      "A historical setting during a time of superstition and fear",
    ],
    adventure: [
      "A treacherous mountain range hiding a legendary treasure",
      "An uncharted jungle concealing ancient ruins",
      "A network of caves with unexplored depths",
      "A desert landscape with nomadic tribes and lost cities",
      "An archipelago where each island holds different dangers",
      "A frontier territory during a gold rush",
      "A polar expedition facing extreme conditions",
      "A route along an ancient trading path",
    ],
    historical: [
      "A capital city during a pivotal revolution",
      "A small village during a time of significant societal change",
      "A trading port at the height of exploration",
      "A royal court filled with intrigue and conspiracy",
      "A battlefield during a momentous war",
      "A settlement on a new frontier",
      "An ancient civilization on the verge of collapse",
      "A cultural renaissance in a major city",
    ],
    comedy: [
      "A dysfunctional workplace with eccentric employees",
      "A family reunion bringing together conflicting personalities",
      "A vacation where everything that can go wrong does",
      "A small town with quirky local customs",
      "A fish-out-of-water scenario in an unfamiliar culture",
      "A competition bringing together unlikely contestants",
      "A mistaken identity leading to escalating complications",
      "A wedding bringing together incompatible families",
    ],
  },

  conflicts: {
    fantasy: [
      "A prophecy that foretells doom unless a specific quest is completed",
      "An imbalance in magical forces threatening the world",
      "A usurper to the throne with powerful dark magic",
      "A forbidden magical artifact that must be destroyed",
      "An ancient pact with supernatural beings that comes due",
      "A rift between parallel worlds that threatens both",
      "A magical curse affecting the land and its people",
    ],
    "sci-fi": [
      "A technological singularity threatening humanity",
      "First contact with an alien civilization that has uncertain intentions",
      "A corporate conspiracy to control a revolutionary technology",
      "An environmental disaster requiring an exodus from Earth",
      "A time paradox that must be resolved",
      "A rogue AI gaining control of crucial systems",
      "A pandemic of a lab-created virus with unusual effects",
    ],
    mystery: [
      "A series of seemingly unconnected deaths with a hidden pattern",
      "A valuable object vanishing from a secure location",
      "A person of importance disappearing under suspicious circumstances",
      "An identity theft with far-reaching implications",
      "A cold case reopened due to new evidence",
      "A crime witnessed but with conflicting accounts",
      "A cipher or puzzle that must be solved to prevent disaster",
    ],
    romance: [
      "Professional rivals forced to work together",
      "A relationship forbidden by family or society",
      "A choice between love and career or personal growth",
      "A time-limited relationship (terminal illness, moving away, etc.)",
      "Cultural or social differences creating misunderstandings",
      "A secret that could destroy a budding relationship",
      "Former lovers reunited after years apart",
    ],
    horror: [
      "An ancient evil awakening after centuries of dormancy",
      "A malevolent entity targeting a specific person or family",
      "A town gradually influenced by a corrupting presence",
      "A curse passed from victim to victim",
      "Survivors trying to escape a hunting predator or killer",
      "Reality itself becoming unstable or threatening",
      "An isolation scenario where help cannot arrive",
    ],
    adventure: [
      "A race against rivals to find a valuable treasure or artifact",
      "A rescue mission into dangerous territory",
      "A journey to deliver a crucial item against overwhelming odds",
      "Survival in a hostile environment after a disaster",
      "An expedition to map unknown territory with unexpected discoveries",
      "A quest to fulfill a personal vow or family obligation",
      "A mission to clear one's name or restore honor",
    ],
    historical: [
      "Political intrigue during a time of succession or regime change",
      "Adaptation to massive societal changes during a pivotal era",
      "Resistance against an occupying force or oppressive rule",
      "Maintaining integrity during a morally corrupt period",
      "A clash of cultures as different societies come into contact",
      "Survival during a significant historical disaster or plague",
      "Innovation facing opposition from traditional powers",
    ],
    comedy: [
      "A simple misunderstanding that snowballs out of control",
      "A bet or dare that leads to increasingly complicated situations",
      "Attempting to maintain an elaborate deception",
      "Trying to plan a perfect event despite constant setbacks",
      "Adjusting to a drastic life change with humorous results",
      "Multiple characters pursuing the same goal at cross purposes",
      "A fish out of water trying to blend into an unfamiliar world",
    ],
  },

  twists: [
    "The protagonist and antagonist must work together against a greater threat",
    "A trusted ally has been working against the protagonist all along",
    "The protagonist's actions have actually been causing the very problem they're trying to solve",
    "A character who was believed dead returns at a crucial moment",
    "The antagonist is revealed to be related to the protagonist",
    "The entire adventure has been a test or simulation",
    "A secondary character is revealed to be the true protagonist of the story",
    "The conflict was based on a misunderstanding or false information",
    "A character is not who or what they appear to be",
    "The setting is not what it seems (different time period, virtual reality, afterlife, etc.)",
    "The protagonist's mentor has been manipulating events for their own purposes",
    "A seemingly unimportant object or detail turns out to be crucial",
    "The antagonist's motives are revealed to be justified or sympathetic",
    "A prophecy or prediction comes true but in an unexpected way",
    "The resolution requires sacrificing what the protagonist has been seeking all along",
  ],

  themes: [
    "Redemption and forgiveness",
    "The price of power",
    "Finding identity and purpose",
    "The conflict between tradition and progress",
    "The nature of good and evil",
    "Individual freedom versus collective security",
    "The consequences of playing god",
    "The loss of innocence",
    "The strength found in diversity",
    "Truth versus comfortable lies",
    "The meaning of justice in an unjust world",
    "The bonds of family (both blood and chosen)",
    "The corrupting influence of fear",
    "Overcoming prejudice and intolerance",
    "Finding hope in darkness",
  ],

  titles: {
    fantasy: [
      "Crown of {noun}",
      "The Last {role}",
      "Shadow of the {noun}",
      "{noun} of Ash and {noun}",
      "The {adjective} Kingdom",
      "Prophecy of {noun}",
      "{noun}'s Legacy",
      "The {adjective} Blade",
    ],
    "sci-fi": [
      "Beyond the {noun} Horizon",
      "The {noun} Protocol",
      "Quantum {noun}",
      "{planet} Rising",
      "The Last {noun} Fleet",
      "Echoes of {noun}",
      "{adjective} Sky",
      "The {noun} Algorithm",
    ],
    mystery: [
      "The {location} Mystery",
      "The Case of the {adjective} {noun}",
      "Whispers in {location}",
      "The {noun} Conspiracy",
      "Missing in {location}",
      "The {adjective} Truth",
      "Shadows of {location}",
      "The {adjective} Detective",
    ],
    romance: [
      "Love Under the {noun}",
      "The {adjective} Proposal",
      "Hearts in {location}",
      "Until We {verb} Again",
      "When {noun} Meets {noun}",
      "The {season} Affair",
      "Beyond {verb}ing You",
      "The {occupation}'s Heart",
    ],
    horror: [
      "Whispers in the {noun}",
      "The {location} Haunting",
      "Beneath {location}",
      "The {adjective} Ones",
      "When {noun}s Walk",
      "The {noun} Experiment",
      "Shadows of {noun}",
      "The {verb}ing House",
    ],
    adventure: [
      "Quest for the {noun}",
      "The {adjective} Explorer",
      "Journey to {location}",
      "Beyond the {adjective} {noun}",
      "The Last {occupation}",
      "Thieves of {noun}",
      "{location}'s Secret",
      "The {noun} Hunters",
    ],
    historical: [
      "The {occupation} of {location}",
      "{historical period} Songs",
      "Daughter of {location}",
      "The {adjective} Court",
      "Empire of {noun}",
      "The {historical figure}'s Secret",
      "The Last Days of {location}",
      "Blood and {noun}",
    ],
    comedy: [
      "The Ridiculous {noun}",
      "My {adjective} Life",
      "How to {verb} in 10 Days",
      "The {occupation}'s Guide to {verb}ing",
      "Help! I'm a {occupation}!",
      "The Day Everything Went {adverb}",
      "The {adjective} Family",
      "Once Upon a {noun} in {location}",
    ],
  },

  titleWords: {
    noun: [
      "Dream",
      "Shadow",
      "Secret",
      "Heart",
      "Light",
      "Sword",
      "Storm",
      "Star",
      "Crystal",
      "Flame",
      "Moon",
      "Throne",
      "Memory",
      "Truth",
      "Lie",
      "City",
      "Forest",
      "Mountain",
      "Ocean",
      "Key",
      "Door",
      "Mask",
      "Gift",
      "Song",
      "Whisper",
      "Promise",
      "Journey",
      "Tower",
      "Island",
      "Gate",
      "Path",
      "Mirror",
      "Ghost",
      "Legend",
      "Destiny",
    ],
    adjective: [
      "Lost",
      "Hidden",
      "Eternal",
      "Ancient",
      "Final",
      "First",
      "Broken",
      "Forgotten",
      "Silent",
      "Mystic",
      "Dark",
      "Bright",
      "Fallen",
      "Rising",
      "Endless",
      "Wild",
      "Shattered",
      "Secret",
      "Sacred",
      "Cursed",
      "Blessed",
      "Haunted",
      "Magical",
      "Deadly",
      "Royal",
      "Golden",
      "Silver",
      "Iron",
      "Velvet",
      "Crystal",
    ],
    verb: [
      "Find",
      "Lose",
      "Save",
      "Break",
      "Build",
      "Love",
      "Hate",
      "Remember",
      "Forget",
      "Dream",
      "Wake",
      "Hide",
      "Seek",
      "Begin",
      "End",
      "Fight",
      "Fall",
      "Rise",
      "Escape",
      "Return",
      "Create",
      "Destroy",
      "Dance",
      "Sing",
      "Whisper",
      "Shout",
      "Journey",
      "Discover",
      "Betray",
      "Trust",
    ],
    adverb: [
      "Quickly",
      "Slowly",
      "Suddenly",
      "Mysteriously",
      "Horrifically",
      "Beautifully",
      "Terribly",
      "Wonderfully",
      "Disastrously",
      "Perfectly",
      "Awkwardly",
      "Gracefully",
      "Clumsily",
      "Surprisingly",
      "Predictably",
      "Unexpectedly",
      "Magically",
      "Tragically",
      "Comically",
      "Ironically",
    ],
    location: [
      "Castle",
      "Village",
      "City",
      "Kingdom",
      "Forest",
      "Mountain",
      "Valley",
      "Lake",
      "Ocean",
      "Island",
      "Desert",
      "Mansion",
      "Tower",
      "Ruin",
      "Cavern",
      "Temple",
      "Palace",
      "Battlefield",
      "School",
      "Library",
      "Hospital",
      "Laboratory",
      "Prison",
      "Graveyard",
      "Garden",
      "Market",
      "Arena",
      "Wilderness",
    ],
    role: [
      "King",
      "Queen",
      "Knight",
      "Wizard",
      "Witch",
      "Thief",
      "Assassin",
      "Hunter",
      "Healer",
      "Scholar",
      "Warrior",
      "Prince",
      "Princess",
      "Emperor",
      "Empress",
      "Guard",
      "Spy",
      "Explorer",
      "Merchant",
      "Pirate",
      "Ghost",
      "Detective",
      "Doctor",
      "Scientist",
      "Artist",
      "Musician",
      "Writer",
      "Farmer",
      "Smith",
    ],
    planet: [
      "Mars",
      "Venus",
      "Jupiter",
      "Saturn",
      "Titan",
      "Europa",
      "Luna",
      "Enceladus",
      "Callisto",
      "Oberon",
      "Triton",
      "Pluto",
      "Ceres",
      "Eris",
      "Kepler",
      "Proxima",
      "Nova",
      "Zenith",
      "Nadir",
      "Orion",
      "Andromeda",
      "Centauri",
      "Arcturus",
      "Vega",
      "Altair",
    ],
    season: [
      "Summer",
      "Winter",
      "Spring",
      "Autumn",
      "Harvest",
      "Solstice",
      "Equinox",
      "Frost",
      "Thaw",
      "Monsoon",
      "Drought",
      "Flood",
      "Storm",
      "Calm",
    ],
    occupation: [
      "Doctor",
      "Detective",
      "Artist",
      "Chef",
      "Soldier",
      "Scholar",
      "Captain",
      "Hunter",
      "Thief",
      "Spy",
      "Assassin",
      "Merchant",
      "Farmer",
      "Miner",
      "Guard",
      "Knight",
      "Wizard",
      "Witch",
      "Priest",
      "Monk",
      "Explorer",
      "Inventor",
      "Musician",
      "Actor",
      "Writer",
      "Sailor",
    ],
    historical_period: [
      "Victorian",
      "Medieval",
      "Renaissance",
      "Ancient",
      "Colonial",
      "Imperial",
      "Revolutionary",
      "Prehistoric",
      "Classical",
      "Feudal",
      "Industrial",
      "Modern",
      "Post-modern",
      "Interwar",
      "Post-war",
    ],
    historical_figure: [
      "Emperor",
      "Empress",
      "King",
      "Queen",
      "General",
      "Prophet",
      "Philosopher",
      "Scientist",
      "Explorer",
      "Artist",
      "Revolutionary",
      "Tyrant",
      "Diplomat",
      "Spy",
    ],
  },
};

// Helper functions
const generateTitle = (genre: StoryGenre): string => {
  const templates = STORY_DATA.titles[genre];
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Replace placeholders with random words from the categories
  return template.replace(/\{(\w+)\}/g, (_: string, category: string) => {
    const words =
      STORY_DATA.titleWords[category as keyof typeof STORY_DATA.titleWords];
    return words ? words[Math.floor(Math.random() * words.length)] : category;
  });
};

// Create the context
const StoryIdeaContext = createContext<StoryIdeaContextType | undefined>(
  undefined
);

// Custom hook to use the context
export const useStoryIdea = () => {
  const context = useContext(StoryIdeaContext);
  if (!context) {
    throw new Error("useStoryIdea must be used within a StoryIdeaProvider");
  }
  return context;
};

// Context provider component
export const StoryIdeaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentIdea, setCurrentIdea] = useState<StoryIdea | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<StoryIdea[]>([]);
  const [historyIdeas, setHistoryIdeas] = useState<StoryIdea[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<StoryGenre | "random">(
    "random"
  );
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(true);
  const [includeTwist, setIncludeTwist] = useState<boolean>(true);
  const [includeTheme, setIncludeTheme] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("generator");

  // Generate a unique ID
  const generateId = (): string => {
    return `story-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Generate a new story idea
  const generateStoryIdea = () => {
    // Determine genre
    const genre =
      selectedGenre === "random"
        ? (STORY_DATA.genres[
            Math.floor(Math.random() * STORY_DATA.genres.length)
          ] as StoryGenre)
        : selectedGenre;

    // Generate story elements
    const title = generateTitle(genre);
    const setting = generateRandomItem(STORY_DATA.settings[genre]);
    const conflict = generateRandomItem(STORY_DATA.conflicts[genre]);
    const protagonist = includeCharacters
      ? generateRandomItem(STORY_DATA.characters.protagonist)
      : "";
    const twist = includeTwist
      ? generateRandomItem(STORY_DATA.twists)
      : undefined;

    // Generate premise
    let premise = `In ${setting}, ${conflict}.`;
    if (includeCharacters) {
      premise = `In ${setting}, ${protagonist} must face ${conflict}.`;
    }
    if (includeTwist) {
      premise += ` ${twist}`;
    }
    if (includeTheme) {
      const theme = generateRandomItem(STORY_DATA.themes);
      premise += ` The story explores themes of ${theme}.`;
    }

    // Create the story idea
    const newIdea: StoryIdea = {
      id: generateId(),
      title,
      genre,
      premise,
      protagonist: includeCharacters ? protagonist : "",
      setting,
      conflict,
      twist: includeTwist ? twist : undefined,
      timestamp: new Date(),
    };

    setCurrentIdea(newIdea);
    setHistoryIdeas((prev) => [newIdea, ...prev].slice(0, 10)); // Keep last 10 ideas

    toast.success("New story idea generated!");
  };

  // Save an idea
  const saveIdea = (idea: StoryIdea) => {
    if (!idea) return;

    // Check if already saved
    if (savedIdeas.some((saved) => saved.id === idea.id)) {
      toast("This idea is already saved");
      return;
    }

    setSavedIdeas((prev) => [idea, ...prev]);
    toast.success("Story idea saved!");
  };

  // Remove an idea from saved ideas
  const removeIdea = (id: string) => {
    setSavedIdeas((prev) => prev.filter((idea) => idea.id !== id));
    toast("Idea removed from saved list");
  };

  // Clear history
  const clearHistory = () => {
    if (historyIdeas.length === 0) {
      toast("History is already empty");
      return;
    }

    setHistoryIdeas([]);
    toast("History cleared");
  };

  // Export ideas
  const exportIdeas = () => {
    if (savedIdeas.length === 0) {
      toast("No saved ideas to export");
      return;
    }

    const content = savedIdeas
      .map((idea) => {
        let text = `TITLE: ${idea.title}\n`;
        text += `GENRE: ${idea.genre}\n`;
        text += `PREMISE: ${idea.premise}\n`;
        if (idea.protagonist) text += `PROTAGONIST: ${idea.protagonist}\n`;
        text += `SETTING: ${idea.setting}\n`;
        text += `CONFLICT: ${idea.conflict}\n`;
        if (idea.twist) text += `TWIST: ${idea.twist}\n`;
        text += "\n---\n\n";
        return text;
      })
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "story_ideas_ZeroKit.txt";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Ideas exported to text file");
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSavedIdeas = localStorage.getItem("zerokitSavedStoryIdeas");
    if (storedSavedIdeas) {
      setSavedIdeas(JSON.parse(storedSavedIdeas));
    }

    // Generate initial idea
    generateStoryIdea();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (savedIdeas.length > 0) {
      localStorage.setItem(
        "zerokitSavedStoryIdeas",
        JSON.stringify(savedIdeas)
      );
    }
  }, [savedIdeas]);

  const value = {
    currentIdea,
    savedIdeas,
    historyIdeas,
    selectedGenre,
    includeCharacters,
    includeTwist,
    includeTheme,
    activeTab,
    setActiveTab,
    setSelectedGenre,
    setIncludeCharacters,
    setIncludeTwist,
    setIncludeTheme,
    generateStoryIdea,
    saveIdea,
    removeIdea,
    clearHistory,
    exportIdeas,
  };

  return (
    <StoryIdeaContext.Provider value={value}>
      {children}
    </StoryIdeaContext.Provider>
  );
};
