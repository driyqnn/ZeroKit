
import React from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileNoticeProps {
  toolName: string;
  children: React.ReactNode;
}

const MobileNotice = ({ toolName, children }: MobileNoticeProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) {
    return <>{children}</>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Mobile Device Detected</AlertTitle>
        <AlertDescription>
          {toolName} is designed for desktop screens and may not function properly on mobile devices.
        </AlertDescription>
      </Alert>
      
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          For the best experience, please use a desktop computer or enable "Desktop Site" in your mobile browser.
        </p>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            // This opens the current URL with a flag that might help certain mobile browsers
            // to show the desktop version, but it ultimately depends on the browser
            window.open(window.location.href + "?desktop=1", "_self");
          }}
        >
          <ExternalLink className="h-4 w-4" />
          Try Desktop Mode
        </Button>
        
        <p className="text-sm text-muted-foreground mt-8">
          Note: The "Try Desktop Mode" button may not work in all browsers. 
          You may need to manually enable desktop mode in your browser settings.
        </p>
      </div>
    </div>
  );
};

export default MobileNotice;
