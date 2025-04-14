
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Shield, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// zxcvbn is a password strength estimator
import zxcvbn from "zxcvbn";

const PasswordStrengthTester = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [commonPasswords] = useState([
    "password", "123456", "qwerty", "admin", "welcome", 
    "letmein", "monkey", "abc123", "111111", "password1"
  ]);

  useEffect(() => {
    if (password) {
      const analysis = zxcvbn(password);
      setResult(analysis);
    } else {
      setResult(null);
    }
  }, [password]);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return "bg-red-500";
      case 1: return "bg-red-400";
      case 2: return "bg-yellow-400";
      case 3: return "bg-green-400";
      case 4: return "bg-green-600";
      default: return "bg-gray-300";
    }
  };

  const getScoreText = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "N/A";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      toast.success("Password copied to clipboard");
    }).catch(err => {
      toast.error("Failed to copy password");
    });
  };

  return (
    <ToolLayout
      title="Password Strength Tester"
      description="Analyze the security and complexity of your passwords"
      icon={<Shield className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password to test"
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <Button variant="outline" onClick={generatePassword}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button variant="outline" onClick={copyToClipboard} disabled={!password}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Strength: {getScoreText(result.score)}</span>
                      <span className="text-sm">{result.score}/4</span>
                    </div>
                    <Progress value={(result.score / 4) * 100} className={getScoreColor(result.score)} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Estimated crack time:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">Online attack:</div>
                        <div className="font-medium">{result.crack_times_display.online_throttling_100_per_hour}</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">Offline attack:</div>
                        <div className="font-medium">{result.crack_times_display.offline_fast_hashing_1e10_per_second}</div>
                      </div>
                    </div>
                  </div>
                  
                  {result.feedback.warning && (
                    <div className="p-3 border border-yellow-300/30 bg-yellow-50/30 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">Warning:</p>
                      <p className="text-sm text-yellow-700">{result.feedback.warning}</p>
                    </div>
                  )}
                  
                  {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Suggestions:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {result.feedback.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Common Password Patterns to Avoid</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Sequential characters (abc123, qwerty)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Repeated characters (aaabbb, 111222)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Personal information (name, birthdate)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Common word substitutions (p@ssw0rd)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Dictionary words alone</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Creating Strong Passwords</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use at least 12 characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mix uppercase and lowercase letters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Include numbers and special characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use unrelated words with separators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Consider using a password manager</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PasswordStrengthTester;
