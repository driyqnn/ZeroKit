import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onScrollToTools: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToTools,
}) => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container max-w-screen-2xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent">
              ZeroKit
            </h1>
          </div>

          <p className="text-lg md:text-2xl font-semibold mb-3 text-white/90">
            No logins. No servers. Just tools that work — right in your browser.
          </p>

          <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            A collection of useful tools, all running directly in your browser.
            No installs, no dependencies, just click and go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={onScrollToTools}>
              Explore Tools
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open("/about-privacy", "_blank")}>
              About Privacy
            </Button>
          </div>
        </div>

        <FeaturedTools />

        {/* Scroll down button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
      </div>

      {/* Background gradient */}
      <div className="absolute -top-24 -right-20 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl opacity-20"></div>
    </section>
  );
};

export const FeaturedTools = () => {
  const featuredTools = [
    {
      icon: <Star className="h-5 w-5 text-amber-400 mr-2" />,
      title: "Market Rush",
      description:
        "Trading simulator: buy low, sell high over 30 days to maximize your profits",
      path: "/tools/market-rush",
    },
    {
      icon: <Star className="h-5 w-5 text-amber-400 mr-2" />,
      title: "QR Code Generator",
      description: "Create customized QR codes for any type of content",
      path: "/tools/qr-code-generator",
    },
    {
      icon: <Star className="h-5 w-5 text-amber-400 mr-2" />,
      title: "Responsive Breakpoint Tester",
      description:
        "Preview websites at different device sizes and network speeds",
      path: "/tools/responsive-tester",
    },
    {
      icon: <Star className="h-5 w-5 text-amber-400 mr-2" />,
      title: "Markdown Editor",
      description: "Write and preview Markdown content in real-time",
      path: "/tools/markdown-editor",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      {featuredTools.map((tool, index) => (
        <Link
          key={index}
          to={tool.path}
          className="bg-secondary/40 border border-border p-6 rounded-lg hover:border-primary/30 hover:bg-black/30 transition-all duration-300 group">
          <div className="flex items-center mb-4">
            {tool.icon}
            <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
        </Link>
      ))}
    </div>
  );
};
