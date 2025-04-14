
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  slug?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

const ToolCard = ({ 
  icon: Icon, 
  title, 
  description, 
  category, 
  slug,
  isNew = false,
  isPopular = false,
  isPremium = false
}: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  
  // If no slug, it's a coming soon tool and shouldn't be clickable
  if (!slug) {
    return (
      <div 
        ref={cardRef}
        className={cn(
          "relative bg-card/30 rounded-xl p-5 flex flex-col h-full min-h-[200px] backdrop-blur-sm border border-muted/10",
          "transition-all duration-500 ease-out",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        role="article" 
        aria-label={title}
        style={{
          transitionDelay: "150ms"
        }}
      >
        <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-base font-medium mb-1.5 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground flex-grow mb-4 line-clamp-3">{description}</p>
        <div className="mt-auto">
          <span className="text-muted-foreground/60 text-sm flex items-center gap-1 cursor-not-allowed">
            <span>Coming soon</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    );
  }
  
  // Clickable card with Link wrapping the entire card
  return (
    <Link 
      to={`/tools/${slug}`}
      className="group block h-full" 
      role="article" 
      aria-label={title}
    >
      <div 
        ref={cardRef}
        className={cn(
          "relative bg-card/30 backdrop-blur-sm rounded-xl p-5 flex flex-col h-full min-h-[200px]",
          "transition-all duration-500 ease-out border border-muted/10", 
          "hover:border-primary/30 hover:bg-card/50 hover:shadow-md hover:shadow-primary/5 group-hover:translate-y-[-2px]",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{
          transitionDelay: "150ms"
        }}
      >
        {isNew && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-primary/20 text-primary text-xs">
            New
          </Badge>
        )}
        {isPremium && !isNew && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-xs">
            Premium
          </Badge>
        )}
        {isPopular && !isNew && !isPremium && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-orange-500/20 text-orange-400 text-xs">
            Popular
          </Badge>
        )}
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
          <Icon className="h-5 w-5 text-primary group-hover:text-primary transition-colors" aria-hidden="true" />
        </div>
        <h3 className="text-base font-medium mb-1.5 text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground flex-grow mb-4 line-clamp-3">{description}</p>
        <div className="mt-auto">
          <span className="text-primary text-sm flex items-center gap-1">
            <span>Try it now</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
