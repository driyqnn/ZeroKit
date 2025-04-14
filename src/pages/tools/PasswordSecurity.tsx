import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Check,
  Copy,
  Key,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Info,
  SquareCode,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

const PasswordSecurity = () => {
  // Password Strength Checker states
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [timeToBreak, setTimeToBreak] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password Generator states
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState<number[]>([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  // Key Generator states
  const [keyType, setKeyType] = useState<string>("api");
  const [keyLength, setKeyLength] = useState<number[]>([32]);
  const [keyPrefix, setKeyPrefix] = useState<string>("");
  const [includeDashes, setIncludeDashes] = useState(true);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [keyCopied, setKeyCopied] = useState(false);

  // Initialize password strength
  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  // Check password strength
  const checkPasswordStrength = (pass: string) => {
    if (!pass) {
      setStrength(0);
      setFeedback([]);
      setTimeToBreak("");
      return;
    }

    // Calculate base score
    let score = 0;
    const feedbackItems: string[] = [];

    // Length check
    if (pass.length < 8) {
      feedbackItems.push("Password is too short (minimum 8 characters)");
    } else {
      score += Math.min(10, pass.length * 0.5); // Up to 10 points for length
    }

    // Character variety
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSymbols = /[^A-Za-z0-9]/.test(pass);

    if (hasUpperCase) score += 10;
    if (hasLowerCase) score += 10;
    if (hasNumbers) score += 10;
    if (hasSymbols) score += 15;

    // Variety feedback
    if (!hasUpperCase) feedbackItems.push("Add uppercase letters");
    if (!hasLowerCase) feedbackItems.push("Add lowercase letters");
    if (!hasNumbers) feedbackItems.push("Add numbers");
    if (!hasSymbols) feedbackItems.push("Add special characters");

    // Common patterns and weaknesses
    if (/(.)\1{2,}/.test(pass)) {
      score -= 10;
      feedbackItems.push("Avoid repeating characters");
    }

    if (/^(?:123|abc|qwerty|password|admin|letmein)/i.test(pass)) {
      score -= 20;
      feedbackItems.push("Avoid common password patterns");
    }

    // Calculate estimated crack time
    let crackTime = "Less than a second";
    const entropy = calculateEntropy(pass);

    if (entropy > 80) {
      crackTime = "Centuries";
    } else if (entropy > 70) {
      crackTime = "Decades";
    } else if (entropy > 60) {
      crackTime = "Years";
    } else if (entropy > 50) {
      crackTime = "Months";
    } else if (entropy > 40) {
      crackTime = "Weeks";
    } else if (entropy > 30) {
      crackTime = "Days";
    } else if (entropy > 20) {
      crackTime = "Hours";
    } else if (entropy > 10) {
      crackTime = "Minutes";
    }

    // Normalize score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    setStrength(score);
    setFeedback(feedbackItems);
    setTimeToBreak(crackTime);
  };

  // Calculate password entropy
  const calculateEntropy = (pass: string) => {
    const charsetSize =
      (/[A-Z]/.test(pass) ? 26 : 0) +
      (/[a-z]/.test(pass) ? 26 : 0) +
      (/\d/.test(pass) ? 10 : 0) +
      (/[^A-Za-z0-9]/.test(pass) ? 33 : 0);
    return Math.log2(Math.pow(charsetSize, pass.length));
  };

  // Generate a new password
  const generatePassword = () => {
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      toast.error("Please select at least one character type");
      return;
    }

    const length = passwordLength[0];
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_-+={}[]|:;<>,.?/~";

    let chars = "";
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    let result = "";
    const charactersLength = chars.length;

    // Ensure we have at least one character from each selected type
    let mustInclude = "";
    if (includeUppercase)
      mustInclude += uppercaseChars.charAt(
        Math.floor(Math.random() * uppercaseChars.length)
      );
    if (includeLowercase)
      mustInclude += lowercaseChars.charAt(
        Math.floor(Math.random() * lowercaseChars.length)
      );
    if (includeNumbers)
      mustInclude += numberChars.charAt(
        Math.floor(Math.random() * numberChars.length)
      );
    if (includeSymbols)
      mustInclude += symbolChars.charAt(
        Math.floor(Math.random() * symbolChars.length)
      );

    // Add characters from each required category
    result = mustInclude;

    // Fill the rest with random characters
    for (let i = result.length; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }

    // Shuffle the result to avoid patterns
    result = result
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setGeneratedPassword(result);
  };

  // Generate a key
  const generateKey = () => {
    const length = keyLength[0];
    const chars = {
      api: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      hex: "0123456789ABCDEF",
      base64:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      numeric: "0123456789",
      alphanumeric:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    };

    // Select character set
    const charSet = chars[keyType as keyof typeof chars];
    let result = "";

    // Generate random string
    for (let i = 0; i < length; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    // Add prefix if specified
    if (keyPrefix) {
      result = keyPrefix + (keyPrefix.endsWith("_") ? "" : "_") + result;
    }

    // Add dashes if enabled (every 8 characters)
    if (includeDashes && keyType !== "base64") {
      let formattedResult = "";
      for (let i = 0; i < result.length; i++) {
        if (i > 0 && i % 8 === 0) {
          formattedResult += "-";
        }
        formattedResult += result[i];
      }
      result = formattedResult;
    }

    setGeneratedKey(result);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
        console.error("Copy failed", err);
      });
  };

  // Get strength class for color
  const getStrengthClass = () => {
    if (strength <= 25) return "bg-destructive";
    if (strength <= 50) return "bg-amber-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get strength label
  const getStrengthLabel = () => {
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  useEffect(() => {
    // Generate initial password and key on component mount
    generatePassword();
    generateKey();
  }, []);

  return (
    <ToolLayout
      title="Password Security"
      description="Check password strength, generate secure passwords, and create API keys"
      icon={<ShieldCheck className="h-6 w-6 text-primary" />}
      category="Privacy & Security">
      <Tabs defaultValue="check" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="check">Check Strength</TabsTrigger>
          <TabsTrigger value="generate">Password Generator</TabsTrigger>
          <TabsTrigger value="keygen">Key Generator</TabsTrigger>
        </TabsList>

        {/* Password Strength Checker */}
        <TabsContent value="check">
          <Card>
            <CardHeader>
              <CardTitle>Password Strength Checker</CardTitle>
              <CardDescription>
                Evaluate the security of your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Enter Password
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="show-password" className="text-sm">
                      Show
                    </Label>
                    <Switch
                      id="show-password"
                      checked={showPassword}
                      onCheckedChange={setShowPassword}
                    />
                  </div>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {password && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Strength: {getStrengthLabel()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {strength}%
                      </span>
                    </div>
                    <Progress value={strength} className={getStrengthClass()} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Time to crack:{" "}
                      </span>
                      <span className="text-sm">{timeToBreak}</span>
                    </div>
                  </div>

                  {feedback.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">
                        Recommendations:
                      </span>
                      <ul className="space-y-1">
                        {feedback.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Password Safety</p>
                    <p className="text-xs text-muted-foreground">
                      This tool runs entirely in your browser. Your password is
                      never transmitted or stored anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Generator */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Password Generator</CardTitle>
              <CardDescription>Create strong, secure passwords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={generatedPassword}
                  readOnly
                  className="font-mono"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(generatedPassword, "password")
                    }>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generatePassword}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label
                    htmlFor="password-length"
                    className="text-sm font-medium">
                    Password Length: {passwordLength[0]}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    8-64 characters
                  </span>
                </div>
                <Slider
                  id="password-length"
                  min={8}
                  max={64}
                  step={1}
                  value={passwordLength}
                  onValueChange={setPasswordLength}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                  <Label
                    htmlFor="uppercase"
                    className="text-sm cursor-pointer select-none">
                    Uppercase (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                  <Label
                    htmlFor="lowercase"
                    className="text-sm cursor-pointer select-none">
                    Lowercase (a-z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                  <Label
                    htmlFor="numbers"
                    className="text-sm cursor-pointer select-none">
                    Numbers (0-9)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                  <Label
                    htmlFor="symbols"
                    className="text-sm cursor-pointer select-none">
                    Symbols (!@#$%^&*)
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={generatePassword}>
                <Key className="mr-2 h-4 w-4" /> Generate New Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Key Generator */}
        <TabsContent value="keygen">
          <Card>
            <CardHeader>
              <CardTitle>Key Generator</CardTitle>
              <CardDescription>
                Create secure API keys, tokens, and other cryptographic keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <Input
                  type="text"
                  value={generatedKey}
                  readOnly
                  className="font-mono"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedKey, "key")}>
                    {keyCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={generateKey}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-type">Key Type</Label>
                    <Select value={keyType} onValueChange={setKeyType}>
                      <SelectTrigger id="key-type">
                        <SelectValue placeholder="Select key type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Key</SelectItem>
                        <SelectItem value="hex">Hexadecimal</SelectItem>
                        <SelectItem value="base64">Base64</SelectItem>
                        <SelectItem value="numeric">Numeric</SelectItem>
                        <SelectItem value="alphanumeric">
                          Alphanumeric
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="key-prefix">Key Prefix (Optional)</Label>
                    <Input
                      id="key-prefix"
                      type="text"
                      placeholder="e.g., sk_live or pk_"
                      value={keyPrefix}
                      onChange={(e) => setKeyPrefix(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="key-length" className="text-sm font-medium">
                      Key Length: {keyLength[0]}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {keyType === "base64" ? "16-64" : "8-64"} characters
                    </span>
                  </div>
                  <Slider
                    id="key-length"
                    min={keyType === "base64" ? 16 : 8}
                    max={64}
                    step={1}
                    value={keyLength}
                    onValueChange={setKeyLength}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-dashes"
                    checked={includeDashes}
                    onCheckedChange={setIncludeDashes}
                    disabled={keyType === "base64"}
                  />
                  <Label
                    htmlFor="include-dashes"
                    className="text-sm cursor-pointer select-none">
                    Include dashes (every 8 characters)
                    {keyType === "base64" && (
                      <span className="text-muted-foreground ml-2">
                        (Not available for Base64)
                      </span>
                    )}
                  </Label>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <SquareCode className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Common Key Formats</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>
                        <strong>API Key:</strong> General-purpose keys (e.g.,
                        pk_live_rGiP1Rs7YSn5pAQw)
                      </p>
                      <p>
                        <strong>Hex:</strong> Used for cryptographic keys and
                        hashes (e.g., 8F4A07B2C1E9)
                      </p>
                      <p>
                        <strong>Base64:</strong> Used for encoding binary data
                        (e.g., aGVsbG8gd29ybGQ=)
                      </p>
                      <p>
                        <strong>Numeric:</strong> For numeric-only identifiers
                        (e.g., 3847591062)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={generateKey}>
                <Key className="mr-2 h-4 w-4" /> Generate New Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

// Eye icon component
const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// EyeOff icon component
const EyeOff = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export default PasswordSecurity;
