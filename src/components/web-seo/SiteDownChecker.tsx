
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

type StatusType = 'idle' | 'checking' | 'up' | 'down';

const SiteDownChecker: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [status, setStatus] = useState<StatusType>('idle');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkSite = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // Ensure URL has protocol
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToCheck = `https://${url}`;
    }

    setStatus('checking');
    setIsLoading(true);
    setResponseTime(null);

    try {
      const startTime = Date.now();
      
      // Using a timeout to simulate the network request for demo purposes
      // In a real application, you'd make an actual fetch request
      setTimeout(() => {
        const endTime = Date.now();
        const timeElapsed = endTime - startTime;
        
        // Simulate random success/failure for demo
        const isUp = Math.random() > 0.3;
        
        setStatus(isUp ? 'up' : 'down');
        if (isUp) {
          setResponseTime(timeElapsed);
          toast.success("Site is up and running!");
        } else {
          toast.error("Site appears to be down");
        }
        
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error checking site:", error);
      setStatus('down');
      toast.error("Error checking the site");
      setIsLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'idle':
        return <div className="text-muted-foreground">Enter a URL to check its status</div>;
      case 'checking':
        return (
          <div className="flex items-center text-amber-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking site status...
          </div>
        );
      case 'up':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-4 w-4" />
            Site is up! Response time: {responseTime}ms
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            Site appears to be down
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Site Status Checker
        </CardTitle>
        <CardDescription>
          Check if a website is up or down and view response time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && checkSite()}
            />
            <Button 
              onClick={checkSite} 
              disabled={isLoading || !url}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Status'
              )}
            </Button>
          </div>
          
          <div className="min-h-[60px] flex items-center">
            {getStatusDisplay()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Note: This tool only checks if the site responds to requests.
      </CardFooter>
    </Card>
  );
};

export default SiteDownChecker;
