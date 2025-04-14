import {
  Code,
  FileJson,
  Timer,
  Globe,
  ServerCrash,
  Database,
  FileCode,
  FileCheck,
  Key,
  Webhook,
  TerminalSquare,
  LayoutGrid,
  FileSymlink,
  Cog,
  FlaskConical,
  ScanSearch,
  Github,
  FileDown,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface Category {
  title: string;
  tools: Tool[];
}

export const developerTools: Category = {
  title: "Developer Tools",
  tools: [
    {
      icon: Github,
      title: "GitHub Tools",
      description:
        "Download repositories, archives, directories, and view commits.",
      slug: "github-tools",
      isNew: true,
      isPopular: true,
    },
    {
      icon: FileJson,
      title: "JSON Formatter",
      description:
        "Format, validate, and beautify JSON data with syntax highlighting and structure validation.",
      slug: "json-formatter",
      isPopular: true,
    },
    {
      icon: FileCode,
      title: "SQL Formatter",
      description:
        "Format and beautify SQL queries for better readability and debugging.",
      slug: "sql-formatter",
    },
    {
      icon: Code,
      title: "CSS Minifier",
      description:
        "Minify your CSS code by removing whitespace, comments, and unnecessary characters.",
      slug: "css-minifier",
    },
    {
      icon: ScanSearch,
      title: "Regex Tester",
      description:
        "Test and debug regular expressions with real-time matching and pattern explanation.",
      slug: "regex-tester",
      isPopular: true,
    },
    {
      icon: ServerCrash,
      title: "HTTP Status Codes",
      description:
        "Reference guide for HTTP status codes with explanations and common usage scenarios.",
      slug: "http-status-codes",
    },
    {
      icon: Globe,
      title: "API Tester",
      description:
        "Test API endpoints with custom headers, parameters, and request methods.",
      slug: "api-tester",
      isPopular: true,
    },
    {
      icon: Webhook,
      title: "Webhook Tester",
      description:
        "Debug and test webhooks by creating temporary endpoints to receive and analyze payloads.",
      slug: "webhook-tester",
    },
    {
      icon: Key,
      title: "JWT Decoder",
      description:
        "Decode and verify JSON Web Tokens (JWT) to inspect their contents.",
      slug: "jwt-decoder",
    },
    {
      icon: Timer,
      title: "Cron Generator",
      description:
        "Generate and validate cron expressions with human-readable explanations.",
      slug: "cron-generator",
    },
    {
      icon: LayoutGrid,
      title: "CSS Flexbox/Grid Generator",
      description:
        "Visual tool to create and experiment with CSS flexbox and grid layouts.",
      slug: "css-flexbox-grid-generator",
    },
    {
      icon: FileSymlink,
      title: "HTML Entity Converter",
      description:
        "Convert between HTML entities and characters for web development.",
      slug: "html-entity-converter",
    },
    {
      icon: Cog,
      title: "SVG Optimizer",
      description: "Clean and optimize SVG files for better performance.",
      slug: "svg-optimizer",
    },
    {
      icon: FlaskConical,
      title: "CSS Animation Generator",
      description:
        "Create CSS animations with a visual editor and get ready-to-use code.",
      slug: "css-animation-generator",
    },
    {
      icon: TerminalSquare,
      title: "Lorem Ipsum Generator",
      description: "Generate placeholder text for layouts and design mockups.",
      slug: "lorem-ipsum-generator",
    },
  ],
};
