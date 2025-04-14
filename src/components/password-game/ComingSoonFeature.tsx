
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar } from "lucide-react";

interface ComingSoonFeatureProps {
  title: string;
  description: string;
  estimatedRelease?: string;
}

const ComingSoonFeature = ({ 
  title, 
  description, 
  estimatedRelease 
}: ComingSoonFeatureProps) => {
  return (
    <Card className="border border-zinc-700/50 bg-black/50 mt-6">
      <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
        <div className="bg-primary/20 p-4 rounded-full mb-4">
          <Sparkles className="h-6 w-6 text-primary" stroke="1.5" />
        </div>
        
        <Badge className="mb-3 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30">
          Coming Soon
        </Badge>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <p className="text-muted-foreground max-w-lg text-sm">
          {description}
        </p>
        
        {estimatedRelease && (
          <div className="flex items-center gap-2 mt-4 text-amber-300/80 bg-amber-900/10 px-3 py-1.5 rounded-md text-sm">
            <Calendar className="h-3.5 w-3.5" stroke="1.5" />
            <span>Estimated: {estimatedRelease}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComingSoonFeature;
