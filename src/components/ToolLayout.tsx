
import React from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: React.ReactNode;
  category?: string;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  children, 
  title, 
  description,
  icon,
  category
}) => {
  const handleShare = () => {
    // Create a shareable URL to the current tool
    const shareUrl = window.location.href;
    
    // Attempt to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `ZeroKit - ${title}`,
        text: description,
        url: shareUrl,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error("Failed to copy link. Try again.");
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-secondary focus:z-50">
        Skip to main content
      </a>
      
      <main id="main-content" className="flex-grow container max-w-screen-2xl mx-auto px-4 py-8" role="main">
        <div className="flex flex-col mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/" className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Tools</span>
              </Link>
            </Button>
            
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4 mr-1.5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-md bg-primary/20 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {category && (
                <span className="text-sm text-muted-foreground">
                  {category}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
          
          <Separator className="my-6" />
        </div>
        
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default ToolLayout;
