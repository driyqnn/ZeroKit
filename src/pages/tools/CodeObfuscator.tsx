import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Copy, Check, Code, RefreshCw, Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

import { LanguageSelector } from "@/components/code-obfuscator/LanguageSelector";
import { ObfuscationOptions } from "@/components/code-obfuscator/ObfuscationOptions";
import { obfuscateCode } from "@/components/code-obfuscator/ObfuscationEngine";

const CodeObfuscator = () => {
  const [code, setCode] = useState("");
  const [obfuscatedCode, setObfuscatedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [obfuscationLevel, setObfuscationLevel] = useState("medium");
  const [preserveLineNumbers, setPreserveLineNumbers] = useState(true);
  const [renameVariables, setRenameVariables] = useState(true);
  const [controlFlowFlattening, setControlFlowFlattening] = useState(true);
  const [deadCodeInjection, setDeadCodeInjection] = useState(false);
  const [stringEncoding, setStringEncoding] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isObfuscating, setIsObfuscating] = useState(false);

  const performObfuscation = () => {
    if (!code) {
      toast.error("Please enter code to obfuscate");
      return;
    }

    setIsObfuscating(true);

    setTimeout(() => {
      try {
        const options = {
          renameVariables,
          preserveLineNumbers,
          controlFlowFlattening,
          deadCodeInjection,
          stringEncoding,
          obfuscationLevel,
        };

        const result = obfuscateCode(code, language, options);

        setObfuscatedCode(result);
        toast.success("Code obfuscated successfully!");
      } catch (error) {
        console.error("Obfuscation error:", error);
        toast.error("Failed to obfuscate code");
      } finally {
        setIsObfuscating(false);
      }
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(obfuscatedCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Obfuscated code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const clearFields = () => {
    setCode("");
    setObfuscatedCode("");
    toast.info("Fields cleared");
  };

  return (
    <ToolLayout
      title="Code Obfuscator"
      description="Obfuscate your code to make it harder to read and understand"
      icon={<Code className="h-6 w-6 text-primary" />}
      category="Developer Tools">
      <Tabs defaultValue="obfuscator" className="w-full">
        <TabsList className="grid grid-cols-1 mb-4">
          <TabsTrigger value="obfuscator">Code Obfuscator</TabsTrigger>
        </TabsList>

        <TabsContent value="obfuscator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Original Code</CardTitle>
                <CardDescription>
                  Enter the code you want to obfuscate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono min-h-[300px]"
                />

                <LanguageSelector
                  language={language}
                  setLanguage={setLanguage}
                  obfuscationLevel={obfuscationLevel}
                  setObfuscationLevel={setObfuscationLevel}
                />
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <Button variant="outline" onClick={clearFields}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>

                <Button
                  onClick={performObfuscation}
                  disabled={isObfuscating || !code}>
                  {isObfuscating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Obfuscating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Obfuscate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Obfuscated Code</CardTitle>
                <CardDescription>
                  The obfuscated version of your code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={obfuscatedCode}
                  readOnly
                  className="font-mono min-h-[300px]"
                  placeholder="Obfuscated code will appear here..."
                />

                <ObfuscationOptions
                  renameVariables={renameVariables}
                  setRenameVariables={setRenameVariables}
                  preserveLineNumbers={preserveLineNumbers}
                  setPreserveLineNumbers={setPreserveLineNumbers}
                  controlFlowFlattening={controlFlowFlattening}
                  setControlFlowFlattening={setControlFlowFlattening}
                  stringEncoding={stringEncoding}
                  setStringEncoding={setStringEncoding}
                  deadCodeInjection={deadCodeInjection}
                  setDeadCodeInjection={setDeadCodeInjection}
                />

                <Alert
                  variant="default"
                  className="bg-amber-950/20 border-amber-600/50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-400">
                    Obfuscation may affect code functionality. Test thoroughly
                    before using in production.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={copyToClipboard}
                  disabled={!obfuscatedCode}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Obfuscated Code
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default CodeObfuscator;
