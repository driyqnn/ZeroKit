
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { Lightbulb } from "lucide-react";
import { StoryIdeaGeneratorApp } from "@/components/story-generator/StoryIdeaGeneratorApp";
import { StoryIdeaProvider } from "@/contexts/StoryIdeaGeneratorContext";

const StoryIdeaGenerator = () => {
  return (
    <StoryIdeaProvider>
      <ToolLayout
        title="Story Idea Generator"
        description="Generate creative story ideas, complete with title, premise, characters, setting, and more"
        icon={<Lightbulb className="h-6 w-6 text-primary" />}
        category="Creative Tools"
      >
        <StoryIdeaGeneratorApp />
      </ToolLayout>
    </StoryIdeaProvider>
  );
};

export default StoryIdeaGenerator;
