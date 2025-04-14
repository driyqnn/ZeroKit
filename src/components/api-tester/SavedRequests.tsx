
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash } from "lucide-react";

interface SavedRequestItem {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timestamp: Date;
}

interface SavedRequestsProps {
  savedRequests: SavedRequestItem[];
  loadFromHistory: (item: SavedRequestItem) => void;
  deleteSavedRequest: (id: string) => void;
  formatDate: (date: Date) => string;
}

const SavedRequests: React.FC<SavedRequestsProps> = ({
  savedRequests,
  loadFromHistory,
  deleteSavedRequest,
  formatDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {savedRequests.length > 0 ? (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {savedRequests.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">{item.method}</Badge>
                      <p className="text-sm font-medium truncate">{item.url}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedRequest(item.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Save className="h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground">No saved requests</p>
            <p className="text-xs text-muted-foreground mt-1">
              Save your frequently used requests for quick access
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedRequests;
