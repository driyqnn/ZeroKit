import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Send,
  Trash,
  Copy,
  Link,
  Clock,
  Grid,
  SquareSlash,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

interface WebhookRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  sentAt: Date;
  response?: {
    status: number;
    statusText: string;
    body: string;
    headers: Record<string, string>;
    receivedAt: Date;
  };
  error?: string;
}

interface PresetWebhook {
  id: string;
  name: string;
  url: string;
  description: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  icon: React.ReactNode;
}

const WebhookTester = () => {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("POST");
  const [headers, setHeaders] = useState<string>(
    "Content-Type: application/json"
  );
  const [body, setBody] = useState<string>(
    JSON.stringify(
      { message: "Test webhook message", timestamp: new Date().toISOString() },
      null,
      2
    )
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [showResponse, setShowResponse] = useState<string | null>(null);
  const [useCors, setUseCors] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const webhookPresets: PresetWebhook[] = [
    {
      id: "discord",
      name: "Discord",
      url: "https://discord.com/api/webhooks/your-webhook-id/your-token",
      description: "Send messages to Discord channels via webhooks",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          content: "Hello from ZeroKit Webhook Tester!",
          embeds: [
            {
              title: "Webhook Test",
              description: "This is a test message sent from ZeroKit",
              color: 7506394,
              timestamp: new Date().toISOString(),
            },
          ],
        },
        null,
        2
      ),
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: "slack",
      name: "Slack",
      url: "https://hooks.slack.com/services/your-workspace-id/your-channel-id/your-token",
      description: "Send messages to Slack channels via incoming webhooks",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          text: "Hello from ZeroKit Webhook Tester!",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Test Message*\nThis is a test message sent from ZeroKit.",
              },
            },
          ],
        },
        null,
        2
      ),
      icon: <Grid className="h-4 w-4" />,
    },
    {
      id: "zapier",
      name: "Zapier",
      url: "https://hooks.zapier.com/hooks/catch/your-zap-id/your-hook-id/",
      description: "Trigger Zapier workflows via webhooks",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          event: "test_event",
          data: {
            message: "Test webhook from ZeroKit",
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      ),
      icon: <Link className="h-4 w-4" />,
    },
    {
      id: "n8n",
      name: "n8n",
      url: "https://your-n8n-instance/webhook/your-webhook-id",
      description: "Trigger n8n workflows via webhooks",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          event: "test_event",
          data: {
            message: "Test webhook from ZeroKit",
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      ),
      icon: <SquareSlash className="h-4 w-4" />,
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://api.github.com/repos/owner/repo/dispatches",
      description: "Trigger GitHub repository dispatch events",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        Authorization: "token YOUR_GITHUB_TOKEN",
      },
      body: JSON.stringify(
        {
          event_type: "webhook_test",
          client_payload: {
            message: "Test from ZeroKit",
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      ),
      icon: <Link className="h-4 w-4" />,
    },
  ];

  const parseHeaders = (headerString: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    headerString.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const separatorIndex = trimmedLine.indexOf(":");
        if (separatorIndex > 0) {
          const key = trimmedLine.substring(0, separatorIndex).trim();
          const value = trimmedLine.substring(separatorIndex + 1).trim();
          headers[key] = value;
        }
      }
    });
    return headers;
  };

  const formatHeaders = (headers: Record<string, string>): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  };

  const selectPreset = (presetId: string) => {
    const preset = webhookPresets.find((p) => p.id === presetId);
    if (preset) {
      setMethod(preset.method);
      setHeaders(formatHeaders(preset.headers));
      setBody(preset.body);
      setUrl(preset.url);
      setActivePreset(presetId);
    }
  };

  const resetForm = () => {
    setUrl("");
    setMethod("POST");
    setHeaders("Content-Type: application/json");
    setBody(
      JSON.stringify(
        {
          message: "Test webhook message",
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
    setActivePreset(null);
  };

  const sendWebhook = async () => {
    if (!url) {
      toast.error("Please enter a webhook URL");
      return;
    }

    setLoading(true);
    const requestId = Math.random().toString(36).substring(2, 15);
    const parsedHeaders = parseHeaders(headers);
    const request: WebhookRequest = {
      id: requestId,
      url,
      method,
      headers: parsedHeaders,
      body,
      sentAt: new Date(),
    };

    try {
      const requestOptions: RequestInit = {
        method,
        headers: parsedHeaders,
        credentials: "omit",
        mode: useCors ? "cors" : "no-cors",
      };

      if (method !== "GET" && method !== "HEAD") {
        requestOptions.body = body;
      }

      const fetchResponse = await fetch(url, requestOptions);

      let responseBody = "";
      let responseHeaders: Record<string, string> = {};

      if (useCors) {
        try {
          responseBody = await fetchResponse.text();
          try {
            const jsonBody = JSON.parse(responseBody);
            responseBody = JSON.stringify(jsonBody, null, 2);
          } catch (e) {
            responseBody =
              "Response details unavailable when using no-cors mode. Check your webhook service for confirmation.";
          }

          fetchResponse.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      } else {
        responseBody =
          "Response details unavailable when using no-cors mode. Check your webhook service for confirmation.";
      }

      request.response = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        body: responseBody,
        headers: responseHeaders,
        receivedAt: new Date(),
      };

      setRequests((prev) => [request, ...prev]);
      setShowResponse(requestId);

      if (useCors) {
        toast.success(
          `Webhook sent successfully (${fetchResponse.status} ${fetchResponse.statusText})`
        );
      } else {
        toast.success("Webhook request sent (no-cors mode)");
      }
    } catch (error) {
      console.error("Webhook error:", error);
      request.error = error instanceof Error ? error.message : String(error);
      setRequests((prev) => [request, ...prev]);
      setShowResponse(requestId);
      toast.error("Error sending webhook, see details in the response panel");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setRequests([]);
    setShowResponse(null);
    toast.success("Request history cleared");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const formatJson = (jsonString: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <ToolLayout
      title="Webhook Tester"
      description="Test and debug webhooks with different HTTP methods, headers, and payloads"
      icon={<Send className="h-6 w-6 text-primary" />}
      category="Developer Tools">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configurator</CardTitle>
              <CardDescription>
                Configure and send webhook requests to test your endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {webhookPresets.map((preset) => (
                  <Card
                    key={preset.id}
                    className={`cursor-pointer hover:border-primary transition-all ${
                      activePreset === preset.id
                        ? "border-primary bg-primary/10"
                        : ""
                    }`}
                    onClick={() => selectPreset(preset.id)}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="rounded-full bg-muted/50 p-2 mb-2 mt-2">
                        {preset.icon}
                      </div>
                      <h3 className="font-medium text-sm">{preset.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {preset.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  placeholder="https://webhook.site/your-unique-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 w-full sm:w-1/3">
                  <Label htmlFor="method">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger id="method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-full sm:w-2/3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cors-mode">CORS Settings</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cors-mode"
                        checked={useCors}
                        onCheckedChange={setUseCors}
                      />
                      <Label htmlFor="cors-mode" className="text-sm">
                        {useCors ? "CORS" : "No-CORS"}
                      </Label>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {useCors
                      ? "Use CORS mode for full response data if the endpoint supports it."
                      : "Use No-CORS mode for endpoints that don't support CORS (Discord, Slack, etc). Limited response data."}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="headers">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger
                    value="body"
                    disabled={method === "GET" || method === "HEAD"}>
                    Body
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="headers" className="space-y-2 pt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="headers">
                      Request Headers (one per line as "Key: Value")
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        setHeaders(
                          formatHeaders({
                            "Content-Type": "application/json",
                          })
                        )
                      }>
                      Reset
                    </Button>
                  </div>
                  <Textarea
                    id="headers"
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder="Content-Type: application/json"
                    className="font-mono text-sm min-h-[150px]"
                  />
                </TabsContent>

                <TabsContent value="body" className="space-y-2 pt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="body">Request Body</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          try {
                            setBody(formatJson(body));
                          } catch (e) {
                            toast.error("Failed to format JSON");
                          }
                        }}>
                        Format JSON
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setBody(
                            JSON.stringify(
                              {
                                message: "Test webhook message",
                                timestamp: new Date().toISOString(),
                              },
                              null,
                              2
                            )
                          )
                        }>
                        Reset
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm min-h-[150px]"
                    disabled={method === "GET" || method === "HEAD"}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button onClick={sendWebhook} disabled={loading || !url}>
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Request
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {showResponse && requests.find((r) => r.id === showResponse) && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Response</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResponse(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const request = requests.find((r) => r.id === showResponse);
                  if (!request) return null;

                  if (request.error) {
                    return (
                      <div className="space-y-4">
                        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md">
                          <h3 className="font-medium text-destructive mb-2">
                            Error
                          </h3>
                          <p className="text-sm">{request.error}</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Request Details
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-muted/30 rounded-md">
                              <span className="font-medium">URL:</span>{" "}
                              {request.url}
                            </div>
                            <div className="p-2 bg-muted/30 rounded-md">
                              <span className="font-medium">Method:</span>{" "}
                              {request.method}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {request.response && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                request.response.status >= 200 &&
                                request.response.status < 300
                                  ? "default"
                                  : "destructive"
                              }>
                              {request.response.status}{" "}
                              {request.response.statusText}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {formatTime(request.response.receivedAt)}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              copyToClipboard(request.response.body)
                            }
                            className="h-7">
                            <Copy className="mr-1 h-3 w-3" /> Copy
                          </Button>
                        </div>
                      )}

                      <Tabs defaultValue="response">
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="response">Response</TabsTrigger>
                          <TabsTrigger value="headers">Headers</TabsTrigger>
                          <TabsTrigger value="request">Request</TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="response"
                          className="space-y-2 pt-4">
                          {request.response ? (
                            <Textarea
                              readOnly
                              value={request.response.body}
                              className="font-mono text-sm min-h-[200px]"
                            />
                          ) : (
                            <div className="text-center p-6 text-muted-foreground">
                              No response data available
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="headers" className="space-y-2 pt-4">
                          {request.response &&
                          Object.keys(request.response.headers).length > 0 ? (
                            <div className="border rounded-md p-4">
                              {Object.entries(request.response.headers).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex flex-wrap mb-2 last:mb-0">
                                    <span className="font-medium mr-2">
                                      {key}:
                                    </span>
                                    <span className="text-muted-foreground break-all">
                                      {value}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center p-6 text-muted-foreground">
                              No header data available
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="request" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">URL</h3>
                            <div className="p-2 bg-muted/30 rounded-md overflow-auto">
                              <code className="text-xs">{request.url}</code>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Headers</h3>
                            <div className="border rounded-md p-4">
                              {Object.entries(request.headers).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex flex-wrap mb-2 last:mb-0">
                                    <span className="font-medium mr-2">
                                      {key}:
                                    </span>
                                    <span className="text-muted-foreground break-all">
                                      {value}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {method !== "GET" && method !== "HEAD" && (
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Body</h3>
                              <Textarea
                                readOnly
                                value={request.body}
                                className="font-mono text-sm min-h-[150px]"
                              />
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Request History</CardTitle>
                {requests.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        showResponse === request.id
                          ? "bg-muted border"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => setShowResponse(request.id)}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">{request.method}</Badge>
                        <div className="flex items-center space-x-2">
                          {request.response && (
                            <Badge
                              variant={
                                request.response.status >= 200 &&
                                request.response.status < 300
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs h-5">
                              {request.response.status}
                            </Badge>
                          )}
                          {request.error && (
                            <Badge
                              variant="destructive"
                              className="text-xs h-5">
                              Error
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(request.sentAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-medium truncate">
                        {request.url}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Send className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No requests yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send a webhook request to see history
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <p className="font-medium">Discord Webhooks:</p>
                <p className="text-muted-foreground text-xs">
                  Use the Discord preset with No-CORS mode. Format JSON for
                  proper message formatting.
                </p>
              </div>
              <div>
                <p className="font-medium">Slack Webhooks:</p>
                <p className="text-muted-foreground text-xs">
                  Use the Slack preset with No-CORS mode. Include a "text" field
                  at minimum.
                </p>
              </div>
              <div>
                <p className="font-medium">Testing with webhook.site:</p>
                <p className="text-muted-foreground text-xs">
                  Use{" "}
                  <a
                    href="https://webhook.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary">
                    webhook.site
                  </a>{" "}
                  to get a temporary URL for testing.
                </p>
              </div>
              <div>
                <p className="font-medium">No response data?</p>
                <p className="text-muted-foreground text-xs">
                  For third-party services, switch to No-CORS mode but note that
                  response details won't be available.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default WebhookTester;
