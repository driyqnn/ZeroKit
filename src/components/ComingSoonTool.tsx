
import React from "react";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ToolLayout from "@/components/ToolLayout";

interface ComingSoonToolProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  estimatedRelease?: string;
}

const ComingSoonTool = ({
  title,
  description,
  icon = <Clock className="h-6 w-6 text-primary" />,
  estimatedRelease,
}: ComingSoonToolProps) => {
  return (
    <ToolLayout
      title={title}
      description={description}
      icon={icon}
    >
      <div className="max-w-2xl mx-auto">
        <Card className="border border-zinc-700/50 bg-black/50">
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-6 rounded-full mb-6">
              <Clock className="h-12 w-12 text-primary" stroke="1.5" />
            </div>
            
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30">
              Coming Soon
            </Badge>
            
            <h2 className="text-2xl font-bold mb-4">{title} is under development</h2>
            
            <p className="text-muted-foreground max-w-lg">
              We're working hard to bring you this new tool. Thanks for your patience!
            </p>
            
            {estimatedRelease && (
              <div className="flex items-center gap-2 mt-6 text-amber-300/80 bg-amber-900/10 px-4 py-2 rounded-md">
                <Calendar className="h-4 w-4" stroke="1.5" />
                <span className="text-sm">Estimated release: {estimatedRelease}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ComingSoonTool;
