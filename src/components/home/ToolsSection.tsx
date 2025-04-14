
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategorySection from "@/components/CategorySection";

// Import tool categories
import { developerTools } from "@/data/categories/developerTools";
import { designMediaTools } from "@/data/categories/designMediaTools";
import { convertersCalculators } from "@/data/categories/convertersCalculators";
import { academicTools } from "@/data/categories/academicTools"; 
import { lifestyleTools } from "@/data/categories/lifestyleTools";
import { engineeringTools } from "@/data/categories/engineeringTools";
import { webSeoTools } from "@/data/categories/webSeoTools";
import { writingTools } from "@/data/categories/writingTools";
import { privacySecurityTools } from "@/data/categories/privacySecurityTools";
import { productivityTools } from "@/data/categories/productivityTools";

export const ToolsSection: React.FC = () => {
  return (
    <section id="tools-section" className="py-16 scroll-mt-16">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Browse Our Tools
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl">
            Choose from our collection of privacy-focused tools for developers, designers, students, and everyday users.
          </p>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-8 flex flex-wrap w-full justify-center border-b pb-px bg-transparent h-auto">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              All Tools
            </TabsTrigger>
            <TabsTrigger 
              value="dev"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Developer
            </TabsTrigger>
            <TabsTrigger 
              value="web-seo"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Web & SEO
            </TabsTrigger>
            <TabsTrigger 
              value="engineering"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Engineering
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Privacy & Security
            </TabsTrigger>
            <TabsTrigger 
              value="design"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Design & Media
            </TabsTrigger>
            <TabsTrigger 
              value="writing"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Text & Writing
            </TabsTrigger>
            <TabsTrigger 
              value="productivity"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Productivity
            </TabsTrigger>
            <TabsTrigger 
              value="converters"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Converters
            </TabsTrigger>
            <TabsTrigger 
              value="academic"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Academic
            </TabsTrigger>
            <TabsTrigger 
              value="lifestyle"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
            >
              Lifestyle
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <CategorySection 
              title="Developer Tools" 
              tools={developerTools.tools} 
              id="dev-tools"
            />
            <CategorySection 
              title="Web & SEO Tools" 
              tools={webSeoTools.tools}
              id="web-seo-tools" 
            />
            <CategorySection 
              title="Engineering Tools" 
              tools={engineeringTools.tools} 
              id="engineering-tools"
            />
            <CategorySection 
              title="Privacy & Security Tools" 
              tools={privacySecurityTools.tools}
              id="privacy-security-tools" 
            />
            <CategorySection 
              title="Design & Media Tools" 
              tools={designMediaTools.tools}
              id="design-media" 
            />
            <CategorySection 
              title="Text & Writing Tools" 
              tools={writingTools.tools}
              id="writing-tools" 
            />
            <CategorySection 
              title="Productivity Tools" 
              tools={productivityTools.tools}
              id="productivity-tools" 
            />
            <CategorySection 
              title="Converters & Calculators" 
              tools={convertersCalculators.tools}
              id="converters" 
            />
            <CategorySection 
              title="Academic Tools" 
              tools={academicTools.tools}
              id="academic-tools" 
            />
            <CategorySection 
              title="Lifestyle & Productivity" 
              tools={lifestyleTools.tools}
              id="lifestyle-tools" 
            />
          </TabsContent>
          
          <TabsContent value="dev" className="mt-0">
            <CategorySection 
              title="Developer Tools" 
              tools={developerTools.tools} 
            />
          </TabsContent>
          
          <TabsContent value="web-seo" className="mt-0">
            <CategorySection 
              title="Web & SEO Tools" 
              tools={webSeoTools.tools} 
            />
          </TabsContent>
          
          <TabsContent value="engineering" className="mt-0">
            <CategorySection 
              title="Engineering Tools" 
              tools={engineeringTools.tools}
            />
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-0">
            <CategorySection 
              title="Privacy & Security Tools" 
              tools={privacySecurityTools.tools}
            />
          </TabsContent>
          
          <TabsContent value="design" className="mt-0">
            <CategorySection 
              title="Design & Media" 
              tools={designMediaTools.tools} 
            />
          </TabsContent>
          
          <TabsContent value="writing" className="mt-0">
            <CategorySection 
              title="Text & Writing Tools" 
              tools={writingTools.tools}
            />
          </TabsContent>
          
          <TabsContent value="productivity" className="mt-0">
            <CategorySection 
              title="Productivity Tools" 
              tools={productivityTools.tools}
            />
          </TabsContent>
          
          <TabsContent value="converters" className="mt-0">
            <CategorySection 
              title="Converters & Calculators" 
              tools={convertersCalculators.tools} 
            />
          </TabsContent>
          
          <TabsContent value="academic" className="mt-0">
            <CategorySection 
              title="Academic Tools" 
              tools={academicTools.tools} 
            />
          </TabsContent>
          
          <TabsContent value="lifestyle" className="mt-0">
            <CategorySection 
              title="Lifestyle & Productivity" 
              tools={lifestyleTools.tools} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
