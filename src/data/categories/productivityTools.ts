
import { Tool } from "@/types/tool";
import { 
  QrCode, 
  StickyNote, 
  Lightbulb, 
  ListTodo 
} from "lucide-react";

// Define the productivity tools category and its tools
export const productivityTools = {
  name: "Productivity Tools",
  description: "Boost your productivity with these privacy-focused tools",
  tools: [
    {
      icon: QrCode,
      title: "QR Code Generator",
      description: "Generate QR codes for links, text, and contact information without sending data to a server.",
      slug: "qr-code-generator",
      isNew: false,
      isPopular: true,
    },
    {
      icon: StickyNote,
      title: "Private Notes",
      description: "Create encrypted notes that are stored only in your browser. No data is sent to any server.",
      slug: "private-notes",
      isNew: false,
      isPopular: false,
    },
    {
      icon: Lightbulb,
      title: "Idea Generator",
      description: "Generate random ideas for projects, writing, or brainstorming sessions.",
      slug: "idea-generator",
      isNew: true,
      isPopular: false,
    },
    {
      icon: ListTodo,
      title: "Todo List",
      description: "A simple, privacy-focused todo list that stores your tasks only in your browser.",
      slug: "todo-list",
      isNew: false,
      isPopular: true,
    }
  ]
};
