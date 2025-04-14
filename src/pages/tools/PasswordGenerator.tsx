
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Key, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // If no character set is selected, default to lowercase
    if (!charset) {
      charset = "abcdefghijklmnopqrstuvwxyz";
      setIncludeLowercase(true);
    }
    
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Password copied!",
          description: "Password has been copied to clipboard",
          className: "bg-privy-teal text-privy-offwhite",
          duration: 2000,
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually",
          className: "bg-privy-crimson text-privy-offwhite",
          duration: 3000,
        });
      });
  };

  return (
    <ToolLayout 
      title="Password Generator" 
      description="Create strong, secure passwords with custom rules. All generation happens in your browser—nothing is sent to a server."
      icon={<Key className="h-6 w-6 text-privy-teal" />}
    >
      <div className="max-w-3xl mx-auto">
        {/* Password Display */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="py-4 px-6 flex-grow overflow-x-auto whitespace-nowrap font-mono text-xl">
                {password}
              </div>
              <Button
                variant="ghost" 
                size="icon"
                className="mr-2 h-12 w-12"
                onClick={copyToClipboard}
                aria-label="Copy password"
              >
                {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                className="mr-4 h-12 w-12"
                onClick={generatePassword}
                aria-label="Generate new password"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <div className="space-y-8">
          {/* Password Length */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="password-length">Password Length</Label>
              <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{length}</span>
            </div>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              aria-label="Password length"
            />
          </div>

          {/* Character Types */}
          <div className="grid gap-y-4 sm:grid-cols-2">
            <div className="flex items-center space-x-4">
              <Switch 
                id="include-uppercase" 
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
              <Label htmlFor="include-uppercase">Uppercase Letters (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch 
                id="include-lowercase" 
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
              <Label htmlFor="include-lowercase">Lowercase Letters (a-z)</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch 
                id="include-numbers" 
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
              <Label htmlFor="include-numbers">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch 
                id="include-symbols" 
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
              <Label htmlFor="include-symbols">Special Characters (!@#$...)</Label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <Button 
            size="lg" 
            className="bg-privy-teal hover:bg-privy-teal/90"
            onClick={generatePassword}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Generate New Password
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PasswordGenerator;
