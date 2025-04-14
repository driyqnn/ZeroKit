
import { useState } from "react";
import { Database, Copy, Check, Code, FileSpreadsheet } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";

const SqlFormatter = () => {
  const { toast } = useToast();
  const [sqlInput, setSqlInput] = useState("");
  const [formattedSql, setFormattedSql] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentation, setIndentation] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [activeTab, setActiveTab] = useState("standard");

  const formatSQL = () => {
    if (!sqlInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter some SQL to format.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Basic SQL formatting logic
      let formatted = sqlInput;
      
      // Replace multiple spaces with a single space
      formatted = formatted.replace(/\s+/g, " ");
      
      // Format SQL keywords (very basic implementation)
      const keywords = [
        "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
        "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT", "UPDATE", "DELETE",
        "CREATE", "ALTER", "DROP", "TABLE", "VIEW", "INDEX", "PROCEDURE",
        "FUNCTION", "TRIGGER", "AND", "OR", "NOT", "IN", "EXISTS", "UNION",
        "ALL", "DISTINCT", "AS", "ON", "SET", "VALUES", "INTO"
      ];
      
      // Convert keywords to uppercase if option is selected
      if (uppercase) {
        for (const keyword of keywords) {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi");
          formatted = formatted.replace(regex, keyword);
        }
      }

      // Add line breaks and indentation
      const indent = " ".repeat(indentation);
      
      // Basic formatting for the selected style
      if (activeTab === "standard") {
        // Standard formatting
        formatted = formatted
          // Add line breaks after major clauses
          .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT)\b/gi, "\n$1")
          // Add line breaks and indentation for JOINs
          .replace(/\b(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN)\b/gi, `\n${indent}$1`);
      } else if (activeTab === "compact") {
        // Compact formatting with fewer line breaks
        formatted = formatted
          .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY)\b/gi, "\n$1");
      } else if (activeTab === "expanded") {
        // Expanded formatting with more line breaks
        formatted = formatted
          .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|AND|OR)\b/gi, "\n$1")
          // Add indentation for columns in SELECT
          .replace(/\bSELECT\b(.*?)(?=\bFROM\b)/gis, (match) => {
            return match.replace(/,\s*/g, `,\n${indent}`);
          });
      }
      
      // Format commas in specific contexts (like SELECT lists)
      if (activeTab === "expanded") {
        // Leave commas as is - they're already handled
      } else {
        formatted = formatted.replace(/,\s*/g, ", ");
      }
      
      // Clean up multiple line breaks and add initial capital
      formatted = formatted.trim().replace(/\n+/g, "\n");
      
      // If the formatted SQL doesn't start with a newline, add one
      if (!formatted.startsWith("\n")) {
        formatted = "\n" + formatted;
      }
      
      setFormattedSql(formatted);
      
      toast({
        title: "SQL Formatted",
        description: "Your SQL query has been formatted successfully.",
      });
    } catch (error) {
      toast({
        title: "Formatting Error",
        description: "There was an error formatting your SQL.",
        variant: "destructive",
      });
      console.error("SQL formatting error:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "SQL copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setSqlInput(
      `select id, name, email, created_at from users where status = 'active' and created_at > '2023-01-01' order by created_at desc limit 100;`
    );
  };

  return (
    <ToolLayout
      title="SQL Formatter"
      description="Format and beautify your SQL queries for better readability."
      icon={<Database className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Enter SQL Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your SQL query here..."
              className="font-mono text-sm h-48 resize-y"
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              spellCheck={false}
            />
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Toggle
                  pressed={uppercase}
                  onPressedChange={setUppercase}
                  aria-label="Toggle uppercase keywords"
                >
                  Uppercase Keywords
                </Toggle>
                
                <Button variant="outline" size="sm" onClick={loadExample}>
                  Load Example
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Tabs
                  value={String(indentation)}
                  onValueChange={(value) => setIndentation(Number(value))}
                  className="w-fit"
                >
                  <TabsList>
                    <TabsTrigger value="2">2 spaces</TabsTrigger>
                    <TabsTrigger value="4">4 spaces</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button onClick={formatSQL}>Format SQL</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Output Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Formatted SQL</CardTitle>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-fit"
            >
              <TabsList>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="compact">Compact</TabsTrigger>
                <TabsTrigger value="expanded">Expanded</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {formattedSql ? (
              <div className="relative">
                <pre className="font-mono text-sm bg-muted/10 border border-muted/20 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {formattedSql}
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileSpreadsheet className="h-16 w-16 mb-4 opacity-20" />
                <p>Your formatted SQL will appear here</p>
                <p className="text-sm mt-2">Format a query to see the result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SqlFormatter;
