
import { LucideIcon } from "lucide-react";
import ToolCard from "./ToolCard";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Tool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

interface CategorySectionProps {
  title: string;
  tools: Tool[];
  id?: string;
}

const CategorySection = ({ title, tools, id }: CategorySectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  // Don't render categories with no tools
  if (tools.length === 0) return null;
  
  // Generate a unique ID for this section based on the title
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <section 
      className={cn(
        "mt-16 first:mt-8 scroll-mt-24",
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100" : "opacity-0"
      )}
      id={sectionId} 
      aria-labelledby={`${sectionId}-heading`}
      ref={sectionRef}
    >
      <h2 
        id={`${sectionId}-heading`} 
        className={cn(
          "text-2xl font-bold mb-6",
          "bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent",
          "transition-all duration-700 delay-100",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {title}
      </h2>
      <div className="tool-grid">
        {tools.map((tool, index) => (
          <div 
            key={tool.title + index} 
            style={{ 
              animationDelay: `${(index * 0.05) + 0.2}s`,
              transitionDelay: `${(index * 0.05) + 0.2}s`
            }}
          >
            <ToolCard
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              category={title}
              slug={tool.slug}
              isNew={tool.isNew}
              isPopular={tool.isPopular}
              isPremium={tool.isPremium}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
