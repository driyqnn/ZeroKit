
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { ToolsSection } from "@/components/home/ToolsSection";

const Index = () => {
  // Scroll to tools section
  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <Header />
      
      <main>
        <HeroSection onScrollToTools={scrollToTools} />
        <Separator />
        <ToolsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
