
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Link2, ExternalLink, AlertCircle } from 'lucide-react';

interface UrlComponents {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

const UrlParser: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [urlComponents, setUrlComponents] = useState<UrlComponents | null>(null);

  const parseUrl = (input: string) => {
    try {
      // Handle URLs without protocol
      let formattedUrl = input;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      const parsedUrl = new URL(formattedUrl);
      
      // Parse query parameters
      const params: Record<string, string> = {};
      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || '',
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        params
      };
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const parsed = parseUrl(url);
      
      if (parsed) {
        setUrlComponents(parsed);
        setIsValidUrl(true);
      } else {
        setUrlComponents(null);
        setIsValidUrl(false);
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleOpenUrl = () => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Parser</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Enter URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="Enter a URL (e.g., example.com or https://example.com/path)"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setIsValidUrl(true);
                  }}
                  className={!isValidUrl ? 'border-red-500' : ''}
                />
                <Button type="submit" disabled={!url}>Parse</Button>
                {url && (
                  <Button type="button" variant="outline" onClick={handleOpenUrl}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {!isValidUrl && (
                <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please enter a valid URL</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : urlComponents ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              URL Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Protocol</Label>
                <div className="p-2 bg-secondary/50 rounded-md">{urlComponents.protocol}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Hostname</Label>
                <div className="p-2 bg-secondary/50 rounded-md">{urlComponents.hostname}</div>
              </div>
              
              {urlComponents.port && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Port</Label>
                  <div className="p-2 bg-secondary/50 rounded-md">{urlComponents.port}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Path</Label>
                <div className="p-2 bg-secondary/50 rounded-md overflow-x-auto">
                  {urlComponents.pathname || '/'}
                </div>
              </div>
              
              {urlComponents.search && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-muted-foreground">Query String</Label>
                  <div className="p-2 bg-secondary/50 rounded-md overflow-x-auto">
                    {urlComponents.search}
                  </div>
                </div>
              )}
              
              {urlComponents.hash && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-muted-foreground">Hash Fragment</Label>
                  <div className="p-2 bg-secondary/50 rounded-md overflow-x-auto">
                    {urlComponents.hash}
                  </div>
                </div>
              )}
            </div>
            
            {Object.keys(urlComponents.params).length > 0 && (
              <div className="pt-4 space-y-2">
                <Label className="text-muted-foreground">Query Parameters</Label>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left">Parameter</th>
                        <th className="px-4 py-2 text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(urlComponents.params).map(([key, value]) => (
                        <tr key={key} className="border-t">
                          <td className="px-4 py-2 font-mono text-sm">{key}</td>
                          <td className="px-4 py-2 font-mono text-sm break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : url ? (
        <Card className="py-12">
          <CardContent className="text-center text-muted-foreground">
            {isValidUrl ? 'Enter a URL and click Parse' : 'Please enter a valid URL'}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default UrlParser;
