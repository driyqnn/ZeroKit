
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash } from "lucide-react";

interface RequestHistoryItem {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timestamp: Date;
  status?: number;
  responseTime?: number;
  responseSize?: number;
}

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  selectedHistoryItem: string | null;
  loadFromHistory: (item: RequestHistoryItem) => void;
  clearHistory: () => void;
  formatTime: (date: Date) => string;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({
  history,
  selectedHistoryItem,
  loadFromHistory,
  clearHistory,
  formatTime
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Request History</CardTitle>
          {history.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearHistory}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedHistoryItem === item.id
                      ? 'bg-muted/80 border border-border'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{item.method}</Badge>
                    <div className="flex items-center space-x-2">
                      {item.status && (
                        <Badge 
                          variant={item.status >= 200 && item.status < 300 ? "outline" : "destructive"}
                          className={item.status >= 200 && item.status < 300 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
                        >
                          {item.status}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate">{item.url}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    {item.responseTime && (
                      <span className="flex items-center mr-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.responseTime}ms
                      </span>
                    )}
                    {item.responseSize && (
                      <span>
                        {item.responseSize < 1024
                          ? `${item.responseSize} B`
                          : item.responseSize < 1024 * 1024
                          ? `${(item.responseSize / 1024).toFixed(2)} KB`
                          : `${(item.responseSize / (1024 * 1024)).toFixed(2)} MB`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground">No request history</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your recent requests will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestHistory;
