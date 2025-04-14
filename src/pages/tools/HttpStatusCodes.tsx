
import React, { useState, useMemo } from "react";
import { Search, AlertCircle, CheckCircle, Info, XCircle, Cpu, Copy } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// HTTP status code data
const httpStatusCodes = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so." },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet." },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message." },
  
  // 2xx Success
  { code: 200, name: "OK", description: "The request has succeeded." },
  { code: 201, name: "Created", description: "The request has been fulfilled and resulted in a new resource being created." },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed." },
  { code: 203, name: "Non-Authoritative Information", description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response." },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content." },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request, asks that the requester reset its document view, and is not returning any content." },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client." },
  { code: 207, name: "Multi-Status", description: "The message body that follows is by default an XML message and can contain a number of separate response codes." },
  { code: 208, name: "Already Reported", description: "Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly." },
  { code: 226, name: "IM Used", description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." },
  
  // 3xx Redirection
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response. The user-agent or user should choose one of them." },
  { code: 301, name: "Moved Permanently", description: "The URL of the requested resource has been changed permanently. The new URL is given in the response." },
  { code: 302, name: "Found", description: "The URI of requested resource has been changed temporarily. New changes in the URI might be made in the future." },
  { code: 303, name: "See Other", description: "The server sent this response to direct the client to get the requested resource at another URI with a GET request." },
  { code: 304, name: "Not Modified", description: "The client has performed a conditional GET request and access is allowed, but the document has not been modified." },
  { code: 307, name: "Temporary Redirect", description: "The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request." },
  { code: 308, name: "Permanent Redirect", description: "This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header." },
  
  // 4xx Client Errors
  { code: 400, name: "Bad Request", description: "The server cannot or will not process the request due to an apparent client error." },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not yet been provided." },
  { code: 402, name: "Payment Required", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme." },
  { code: 403, name: "Forbidden", description: "The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account." },
  { code: 404, name: "Not Found", description: "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible." },
  { code: 405, name: "Method Not Allowed", description: "A request method is not supported for the requested resource." },
  { code: 406, name: "Not Acceptable", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request." },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy." },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request." },
  { code: 409, name: "Conflict", description: "The request could not be processed because of conflict in the current state of the resource." },
  { code: 410, name: "Gone", description: "The requested resource is no longer available and will not be available again." },
  { code: 411, name: "Length Required", description: "The request did not specify the length of its content, which is required by the requested resource." },
  { code: 412, name: "Precondition Failed", description: "The server does not meet one of the preconditions that the requester put on the request header fields." },
  { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process." },
  { code: 414, name: "URI Too Long", description: "The URI provided was too long for the server to process." },
  { code: 415, name: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support." },
  { code: 416, name: "Range Not Satisfiable", description: "The client has asked for a portion of the file, but the server cannot supply that portion." },
  { code: 417, name: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field." },
  { code: 418, name: "I'm a teapot", description: "The server refuses the attempt to brew coffee with a teapot." },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response." },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors." },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked." },
  { code: 424, name: "Failed Dependency", description: "The request failed because it depended on another request and that request failed." },
  { code: 425, name: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed." },
  { code: 426, name: "Upgrade Required", description: "The client should switch to a different protocol." },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "A server operator has received a legal demand to deny access to a resource or to a set of resources." },
  
  // 5xx Server Errors
  { code: 500, name: "Internal Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable." },
  { code: 501, name: "Not Implemented", description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request." },
  { code: 502, name: "Bad Gateway", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", description: "The server is currently unavailable (because it is overloaded or down for maintenance)." },
  { code: 504, name: "Gateway Timeout", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." },
  { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request." },
  { code: 506, name: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference." },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request." },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request." },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfil it." },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access." },
];

// Group status codes by their category
const groupedStatusCodes = {
  "1xx": httpStatusCodes.filter(code => code.code >= 100 && code.code < 200),
  "2xx": httpStatusCodes.filter(code => code.code >= 200 && code.code < 300),
  "3xx": httpStatusCodes.filter(code => code.code >= 300 && code.code < 400),
  "4xx": httpStatusCodes.filter(code => code.code >= 400 && code.code < 500),
  "5xx": httpStatusCodes.filter(code => code.code >= 500 && code.code < 600),
};

const HttpStatusCodes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredCodes = useMemo(() => {
    if (!searchTerm.trim()) {
      if (activeTab === "all") {
        return httpStatusCodes;
      } else {
        return groupedStatusCodes[activeTab as keyof typeof groupedStatusCodes];
      }
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    const matchingCodes = httpStatusCodes.filter(code => 
      code.code.toString().includes(searchTerm) ||
      code.name.toLowerCase().includes(searchLower) ||
      code.description.toLowerCase().includes(searchLower)
    );
    
    if (activeTab === "all") {
      return matchingCodes;
    }
    
    const codeRange = activeTab === "1xx" ? 100 :
                     activeTab === "2xx" ? 200 :
                     activeTab === "3xx" ? 300 :
                     activeTab === "4xx" ? 400 : 500;
    
    return matchingCodes.filter(code => 
      code.code >= codeRange && code.code < codeRange + 100
    );
  }, [searchTerm, activeTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "HTTP status code information copied to clipboard",
    });
  };

  // Get status code icon based on code range
  const getStatusIcon = (code: number) => {
    if (code >= 100 && code < 200) return <Info className="h-5 w-5 text-blue-400" />;
    if (code >= 200 && code < 300) return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (code >= 300 && code < 400) return <Info className="h-5 w-5 text-amber-400" />;
    if (code >= 400 && code < 500) return <AlertCircle className="h-5 w-5 text-orange-400" />;
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  // Get badge color based on code range
  const getBadgeColor = (code: number) => {
    if (code >= 100 && code < 200) return "bg-blue-900/30 text-blue-400 border-blue-800/30";
    if (code >= 200 && code < 300) return "bg-green-900/30 text-green-400 border-green-800/30";
    if (code >= 300 && code < 400) return "bg-amber-900/30 text-amber-400 border-amber-800/30";
    if (code >= 400 && code < 500) return "bg-orange-900/30 text-orange-400 border-orange-800/30";
    return "bg-red-900/30 text-red-400 border-red-800/30";
  };

  return (
    <ToolLayout
      title="HTTP Status Codes"
      description="Reference for HTTP status codes and their meanings."
      icon={<Cpu className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search status codes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="1xx">1xx</TabsTrigger>
              <TabsTrigger value="2xx">2xx</TabsTrigger>
              <TabsTrigger value="3xx">3xx</TabsTrigger>
              <TabsTrigger value="4xx">4xx</TabsTrigger>
              <TabsTrigger value="5xx">5xx</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Status codes display */}
        <div className="space-y-4">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="text-lg font-medium">No status codes found</p>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            filteredCodes.map((code) => (
              <Card key={code.code} className="transition-all duration-200 hover:shadow-md hover:shadow-primary/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(code.code)}
                      <div className="font-mono text-lg font-bold">{code.code}</div>
                      <Badge className={`${getBadgeColor(code.code)} border`}>{code.name}</Badge>
                    </div>
                    
                    <div className="sm:ml-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(`${code.code} ${code.name}: ${code.description}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-muted-foreground">{code.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default HttpStatusCodes;
