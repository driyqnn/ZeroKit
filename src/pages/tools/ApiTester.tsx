
import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import ToolLayout from "@/components/ToolLayout";
import RequestForm from "@/components/api-tester/RequestForm";
import ResponsePanel from "@/components/api-tester/ResponsePanel";
import RequestHistory from "@/components/api-tester/RequestHistory";
import SavedRequests from "@/components/api-tester/SavedRequests";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

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

const ApiTester = () => {
  const { toast } = useToast();
  
  // Form state
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [params, setParams] = useState("");
  
  // Response state
  const [response, setResponse] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string> | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // UI state
  const [showHeaders, setShowHeaders] = useState(false);
  const [prettyPrint, setPrettyPrint] = useState(true);
  
  // History state
  const [history, setHistory] = useLocalStorage<RequestHistoryItem[]>("api_tester_history", []);
  const [savedRequests, setSavedRequests] = useLocalStorage<RequestHistoryItem[]>("api_tester_saved", []);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(null);
  
  // Parse headers string into an object
  const parseHeaders = (headersStr: string): Record<string, string> => {
    const headersObj: Record<string, string> = {};
    headersStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmedLine.slice(0, colonIndex).trim();
          const value = trimmedLine.slice(colonIndex + 1).trim();
          headersObj[key] = value;
        }
      }
    });
    return headersObj;
  };
  
  // Parse query parameters string into an object
  const parseParams = (paramsStr: string): Record<string, string> => {
    const paramsObj: Record<string, string> = {};
    paramsStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const equalsIndex = trimmedLine.indexOf('=');
        if (equalsIndex > 0) {
          const key = trimmedLine.slice(0, equalsIndex).trim();
          const value = trimmedLine.slice(equalsIndex + 1).trim();
          paramsObj[key] = value;
        }
      }
    });
    return paramsObj;
  };
  
  // Build the URL with query parameters
  const buildUrl = (baseUrl: string, paramsObj: Record<string, string>): string => {
    const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
    for (const key in paramsObj) {
      url.searchParams.append(key, paramsObj[key]);
    }
    return url.toString();
  };
  
  // Handle sending the request
  const handleSendRequest = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to send a request.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResponse(null);
    setResponseHeaders(null);
    setResponseTime(null);
    setResponseSize(null);
    
    try {
      const headersObj = parseHeaders(headers);
      const paramsObj = parseParams(params);
      
      // Build the final URL with query parameters
      const finalUrl = buildUrl(url, paramsObj);
      
      // Set up request options
      const options: RequestInit = {
        method,
        headers: headersObj,
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && method !== 'HEAD' && body) {
        options.body = body;
      }
      
      // Record start time for performance measurement
      const startTime = performance.now();
      
      // Send the request
      const response = await fetch(finalUrl, options);
      
      // Calculate response time
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setResponseTime(timeTaken);
      
      // Process response headers
      const responseHeadersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeadersObj[key] = value;
      });
      setResponseHeaders(responseHeadersObj);
      
      // Get response body based on content type
      let responseBody: string;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        responseBody = await response.text();
        try {
          // Try to parse as JSON to check validity
          JSON.parse(responseBody);
        } catch (e) {
          // If it's not valid JSON, just treat as text
        }
      } else {
        responseBody = await response.text();
      }
      
      // Set response size
      setResponseSize(responseBody.length);
      setResponse(responseBody);
      
      // Add to history
      const historyItem: RequestHistoryItem = {
        id: uuidv4(),
        url: finalUrl,
        method,
        body: body || undefined,
        headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
        params: Object.keys(paramsObj).length > 0 ? paramsObj : undefined,
        timestamp: new Date(),
        status: response.status,
        responseTime: timeTaken,
        responseSize: responseBody.length
      };
      
      setHistory([historyItem, ...history.slice(0, 19)]);  // Keep only the last 20 items
      
      toast({
        title: `${response.status} ${response.statusText}`,
        description: `Request completed in ${timeTaken}ms`,
        variant: response.ok ? "default" : "destructive"
      });
      
    } catch (error) {
      console.error('Request error:', error);
      
      let errorMessage = 'An error occurred while sending the request.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setResponse(JSON.stringify({
        error: true,
        message: errorMessage
      }));
      
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format time for display in the history
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Format date for display in the saved requests
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Save current request
  const saveCurrentRequest = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to save this request.",
        variant: "destructive"
      });
      return;
    }
    
    const headersObj = parseHeaders(headers);
    const paramsObj = parseParams(params);
    
    const savedRequest: RequestHistoryItem = {
      id: uuidv4(),
      url,
      method,
      body: body || undefined,
      headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
      params: Object.keys(paramsObj).length > 0 ? paramsObj : undefined,
      timestamp: new Date()
    };
    
    setSavedRequests([...savedRequests, savedRequest]);
    
    toast({
      title: "Request Saved",
      description: `${method} ${url}`
    });
  };
  
  // Load request from history or saved requests
  const loadFromHistory = (item: RequestHistoryItem) => {
    setSelectedHistoryItem(item.id);
    setUrl(item.url);
    setMethod(item.method);
    
    // Convert headers object back to string
    if (item.headers) {
      setHeaders(
        Object.entries(item.headers)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      );
    } else {
      setHeaders('');
    }
    
    // Convert params object back to string
    if (item.params) {
      setParams(
        Object.entries(item.params)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n')
      );
    } else {
      setParams('');
    }
    
    setBody(item.body || '');
    
    toast({
      title: "Request Loaded",
      description: `${item.method} ${item.url}`
    });
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Request history has been cleared."
    });
  };
  
  // Delete saved request
  const deleteSavedRequest = (id: string) => {
    setSavedRequests(savedRequests.filter(req => req.id !== id));
    toast({
      title: "Request Deleted",
      description: "Saved request has been deleted."
    });
  };
  
  // Format response for pretty printing
  const formatResponse = (response: any): string => {
    try {
      if (typeof response === 'string') {
        // Try to parse as JSON
        const parsed = JSON.parse(response);
        return JSON.stringify(parsed, null, 2);
      } else {
        return JSON.stringify(response, null, 2);
      }
    } catch (e) {
      // If it's not valid JSON, return as is
      return response;
    }
  };
  
  // Calculate formatted size (B, KB, MB)
  const formattedSize = responseSize ? (
    responseSize < 1024
      ? `${responseSize} B`
      : responseSize < 1024 * 1024
      ? `${(responseSize / 1024).toFixed(2)} KB`
      : `${(responseSize / (1024 * 1024)).toFixed(2)} MB`
  ) : null;
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Response has been copied to clipboard."
    });
  };
  
  return (
    <ToolLayout
      title="API Tester"
      description="Test and debug API endpoints with this interactive REST client."
      icon={<Terminal className="h-6 w-6 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <RequestForm 
            url={url}
            setUrl={setUrl}
            method={method}
            setMethod={setMethod}
            headers={headers}
            setHeaders={setHeaders}
            body={body}
            setBody={setBody}
            params={params}
            setParams={setParams}
            handleSendRequest={handleSendRequest}
            saveCurrentRequest={saveCurrentRequest}
            loading={loading}
          />
          
          <ResponsePanel
            response={response}
            responseHeaders={responseHeaders}
            responseTime={responseTime}
            formattedSize={formattedSize}
            loading={loading}
            showHeaders={showHeaders}
            setShowHeaders={setShowHeaders}
            prettyPrint={prettyPrint}
            setPrettyPrint={setPrettyPrint}
            copyToClipboard={copyToClipboard}
            formatResponse={formatResponse}
          />
        </div>
        
        <div className="space-y-6">
          <SavedRequests
            savedRequests={savedRequests}
            loadFromHistory={loadFromHistory}
            deleteSavedRequest={deleteSavedRequest}
            formatDate={formatDate}
          />
          
          <RequestHistory
            history={history}
            selectedHistoryItem={selectedHistoryItem}
            loadFromHistory={loadFromHistory}
            clearHistory={clearHistory}
            formatTime={formatTime}
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default ApiTester;
