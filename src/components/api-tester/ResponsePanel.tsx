
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileJson, Network, Copy } from "lucide-react";

interface ResponsePanelProps {
  response: string | null;
  responseHeaders: Record<string, string> | null;
  responseTime: number | null;
  formattedSize: string | null;
  loading: boolean;
  showHeaders: boolean;
  setShowHeaders: (show: boolean) => void;
  prettyPrint: boolean;
  setPrettyPrint: (pretty: boolean) => void;
  copyToClipboard: (text: string) => void;
  formatResponse: (response: any) => string;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({
  response,
  responseHeaders,
  responseTime,
  formattedSize,
  loading,
  showHeaders,
  setShowHeaders,
  prettyPrint,
  setPrettyPrint,
  copyToClipboard,
  formatResponse
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center space-x-4">
            {responseTime !== null && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{responseTime}ms</span>
              </div>
            )}
            {response && (
              <div className="flex items-center">
                <FileJson className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formattedSize}</span>
              </div>
            )}
            {responseHeaders && (
              <Badge variant="outline" className={responseHeaders?.['content-type']?.includes('application/json') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}>
                {responseHeaders?.['content-type']?.split(';')[0] || 'Unknown'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-headers"
                  checked={showHeaders}
                  onCheckedChange={setShowHeaders}
                />
                <Label htmlFor="show-headers">Headers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pretty-print"
                  checked={prettyPrint}
                  onCheckedChange={setPrettyPrint}
                />
                <Label htmlFor="pretty-print">Pretty</Label>
              </div>
            </div>
            {response && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(typeof response === 'string' ? response : JSON.stringify(response))}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            )}
          </div>

          {showHeaders && responseHeaders && (
            <div className="rounded-md bg-muted p-4 mb-4">
              <h4 className="text-sm font-medium mb-2">Response Headers</h4>
              <ScrollArea className="h-40 rounded-md border">
                <div className="p-4 font-mono text-sm">
                  {Object.entries(responseHeaders).map(([key, value]) => (
                    <div key={key} className="pb-2">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="rounded-md bg-muted">
            {response ? (
              <ScrollArea className="h-96 rounded-md font-mono text-sm">
                <pre className="p-4 whitespace-pre-wrap break-words">
                  {prettyPrint ? formatResponse(response) : (typeof response === 'string' ? response : JSON.stringify(response))}
                </pre>
              </ScrollArea>
            ) : (
              <div className="h-80 flex items-center justify-center p-4 text-muted-foreground text-center">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-muted-foreground mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Waiting for response...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Network className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p>Send a request to see the response here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsePanel;
