import {
  AlignJustify,
  FileCheck,
  Keyboard,
  Book,
  FileText,
  ArrowLeft,
  EyeOff,
} from "lucide-react";

export const writingTools = {
  title: "Text & Writing Tools",
  tools: [
    {
      icon: AlignJustify,
      title: "Word & Character Counter",
      description: "Count words and characters in text.",
      slug: "word-counter",
    },
    {
      icon: Keyboard,
      title: "Typing Speed Test",
      description: "Measure typing accuracy and speed.",
      slug: "typing-speed-test",
    },
    {
      icon: Book,
      title: "Dictionary & Thesaurus",
      description: "Look up word definitions and synonyms.",
      slug: "dictionary-thesaurus",
    },
    {
      icon: FileText,
      title: "Markdown Editor",
      description: "Create and preview Markdown documents.",
      slug: "markdown-editor",
    },
    {
      icon: ArrowLeft,
      title: "Text Case Converter",
      description: "Convert between text cases.",
      slug: "text-case-converter",
    },
    {
      icon: FileText,
      title: "Citation Generator",
      description: "Generate academic citations in various formats.",
      slug: "citation-generator",
    },
    {
      icon: EyeOff,
      title: "Private Notes",
      description: "Create encrypted self-destructing notes.",
      slug: "private-notes",
    },
  ],
};
