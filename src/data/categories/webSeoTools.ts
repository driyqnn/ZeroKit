import {
  Globe,
  Code2,
  Share2,
  Smartphone,
  ServerCrash,
  LineChart,
  MessageSquare,
  Image,
  Link2,
  SearchCheck,
} from "lucide-react";

export const webSeoTools = {
  title: "Web & SEO Tools",
  slug: "web-seo",
  tools: [
    {
      icon: SearchCheck,
      title: "Meta Tag Previewer",
      description: "See how a page appears on Google/Twitter/Facebook",
      slug: "meta-tag-previewer",
      isNew: true,
    },
    {
      icon: Share2,
      title: "OpenGraph Tag Generator",
      description: "Generate social media preview tags for your website",
      slug: "opengraph-generator",
      isNew: true,
    },
    {
      icon: Smartphone,
      title: "Responsive Breakpoint Tester",
      description:
        "Preview websites at different device sizes and network speeds",
      slug: "responsive-tester",
      isNew: true,
    },
    {
      icon: ServerCrash,
      title: "Site Down Checker",
      description: "Check if a website is down from multiple locations",
      slug: "site-down-checker",
      isNew: true,
    },
    {
      icon: Link2,
      title: "URL Parser",
      description: "Parse and analyze URL parameters, path, and components",
      slug: "url-parser",
    },
    {
      icon: Code2,
      title: "HTML Validator",
      description: "Validate HTML code and find errors",
      slug: "html-validator",
    },
    {
      icon: LineChart,
      title: "Website Performance Analyzer",
      description: "Test website load time and performance metrics",
      slug: "website-performance",
    },
    {
      icon: MessageSquare,
      title: "Schema Markup Generator",
      description: "Create structured data markup for better SEO",
      slug: "schema-generator",
    },
  ],
};
