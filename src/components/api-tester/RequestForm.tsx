
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Save } from "lucide-react";

interface RequestFormProps {
  url: string;
  setUrl: (url: string) => void;
  method: string;
  setMethod: (method: string) => void;
  headers: string;
  setHeaders: (headers: string) => void;
  body: string;
  setBody: (body: string) => void;
  params: string;
  setParams: (params: string) => void;
  handleSendRequest: () => void;
  saveCurrentRequest: () => void;
  loading: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({
  url,
  setUrl,
  method,
  setMethod,
  headers,
  setHeaders,
  body,
  setBody,
  params,
  setParams,
  handleSendRequest,
  saveCurrentRequest,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <Label htmlFor="method">Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="method" className="w-full">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-3/4">
            <Label htmlFor="url">URL</Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1"
              />
              <Button onClick={saveCurrentRequest} variant="outline" size="icon" title="Save Request">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="params">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="params">Query Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body" disabled={method === "GET" || method === "HEAD"}>Body</TabsTrigger>
          </TabsList>
          
          <TabsContent value="params" className="space-y-2">
            <Label htmlFor="params">Query Parameters (key=value, one per line)</Label>
            <Textarea
              id="params"
              placeholder="param1=value1
param2=value2"
              className="font-mono text-sm h-40"
              value={params}
              onChange={(e) => setParams(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="headers" className="space-y-2">
            <Label htmlFor="headers">Headers (key: value, one per line)</Label>
            <Textarea
              id="headers"
              placeholder="Content-Type: application/json
Authorization: Bearer YOUR_TOKEN"
              className="font-mono text-sm h-40"
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="body" className="space-y-2">
            <Label htmlFor="body">Request Body</Label>
            <Textarea
              id="body"
              placeholder={`{\n  "key": "value"\n}`}
              className="font-mono text-sm h-40"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={method === "GET" || method === "HEAD"}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendRequest} disabled={loading || !url} className="w-full">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  );
};

export default RequestForm;
