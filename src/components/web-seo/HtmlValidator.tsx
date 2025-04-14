
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, Code, FileWarning } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
}

interface ValidationWarning {
  line: number;
  column: number;
  message: string;
}

const HtmlValidator: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('url');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Mock validation function - in a real app, this would call an API
  const validateHtml = (htmlContent: string): ValidationResult => {
    // This is a simplified mock validation
    // In a real app, you'd call an external API or use a validation library
    const hasDoctype = htmlContent.toLowerCase().includes('<!doctype html>');
    const hasTitleTag = /<title>.*<\/title>/i.test(htmlContent);
    const hasHtmlTag = /<html.*>.*<\/html>/is.test(htmlContent);
    const hasBodyTag = /<body.*>.*<\/body>/is.test(htmlContent);
    const hasHeadTag = /<head.*>.*<\/head>/is.test(htmlContent);
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    if (!hasDoctype) {
      errors.push({ 
        line: 1, 
        column: 1, 
        message: 'Missing DOCTYPE declaration'
      });
    }
    
    if (!hasHtmlTag) {
      errors.push({ 
        line: 1, 
        column: 1, 
        message: 'Missing <html> tag'
      });
    }
    
    if (!hasHeadTag) {
      errors.push({ 
        line: 2, 
        column: 1, 
        message: 'Missing <head> tag'
      });
    }
    
    if (!hasBodyTag) {
      errors.push({ 
        line: 3, 
        column: 1, 
        message: 'Missing <body> tag'
      });
    }
    
    if (!hasTitleTag) {
      warnings.push({ 
        line: 2, 
        column: 2, 
        message: 'Missing <title> tag'
      });
    }
    
    // Add more validation rules as needed
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleUrlValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, you would fetch the HTML from the URL
    // For now, we'll simulate it
    setTimeout(() => {
      // Simulate fetching HTML content from URL
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <!-- Missing title tag (warning) -->
          </head>
          <body>
            <h1>Hello World</h1>
            <p>This is a sample HTML document.</p>
            <div>
              <p>This paragraph is missing a closing tag.
            </div>
          </body>
        </html>
      `;
      
      const result = validateHtml(mockHtml);
      setValidationResult(result);
      setIsLoading(false);
    }, 1500);
  };

  const handleCodeValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const result = validateHtml(html);
      setValidationResult(result);
      setIsLoading(false);
    }, 1000);
  };

  const getResultIcon = () => {
    if (!validationResult) return null;
    
    if (validationResult.valid && validationResult.warnings.length === 0) {
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    } else if (validationResult.valid) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    } else {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getResultText = () => {
    if (!validationResult) return '';
    
    if (validationResult.valid && validationResult.warnings.length === 0) {
      return 'HTML is valid';
    } else if (validationResult.valid) {
      return 'HTML is valid with warnings';
    } else {
      return 'HTML is invalid';
    }
  };

  const getResultColor = () => {
    if (!validationResult) return '';
    
    if (validationResult.valid && validationResult.warnings.length === 0) {
      return 'text-green-500';
    } else if (validationResult.valid) {
      return 'text-yellow-500';
    } else {
      return 'text-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HTML Validator</CardTitle>
          <CardDescription>
            Validate your HTML code for errors and warnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="url">Validate URL</TabsTrigger>
              <TabsTrigger value="code">Validate HTML Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <form onSubmit={handleUrlValidation}>
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="url"
                      placeholder="Enter website URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button type="submit" disabled={!url || isLoading}>
                      {isLoading ? 'Validating...' : 'Validate'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to validate the HTML of the website
                  </p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="code" className="space-y-4">
              <form onSubmit={handleCodeValidation}>
                <div className="space-y-2">
                  <Label htmlFor="html">HTML Code</Label>
                  <textarea
                    id="html"
                    placeholder="Paste your HTML code here"
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full h-48 p-3 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!html || isLoading}>
                      {isLoading ? 'Validating...' : 'Validate'}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Progress value={33} />
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : validationResult ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Validation Results
              </CardTitle>
              <div className="flex items-center gap-2">
                {getResultIcon()}
                <span className={`font-medium ${getResultColor()}`}>{getResultText()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">{validationResult.errors.length} Errors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">{validationResult.warnings.length} Warnings</span>
              </div>
            </div>

            {validationResult.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-red-500" />
                  Errors
                </h3>
                <div className="rounded-md border overflow-hidden">
                  {validationResult.errors.map((error, index) => (
                    <div key={index} className={`p-4 ${index > 0 ? 'border-t' : ''}`}>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Line {error.line}, Column {error.column}
                        </span>
                      </div>
                      <p className="mt-1">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Warnings
                </h3>
                <div className="rounded-md border overflow-hidden">
                  {validationResult.warnings.map((warning, index) => (
                    <div key={index} className={`p-4 ${index > 0 ? 'border-t' : ''}`}>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Line {warning.line}, Column {warning.column}
                        </span>
                      </div>
                      <p className="mt-1">{warning.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default HtmlValidator;
