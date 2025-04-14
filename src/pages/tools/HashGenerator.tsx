
import React, { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Hash, Copy, Upload, Loader2, Info, FileDigit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CryptoJS from 'crypto-js';

type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512" | "sha3" | "ripemd160";

const HashGenerator = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>("sha256");
  const [hashResult, setHashResult] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [fileHashing, setFileHashing] = useState(false);

  // Function to generate hash from text
  const generateTextHash = useCallback(() => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter text to hash",
        variant: "destructive"
      });
      return;
    }

    setIsHashing(true);
    
    try {
      let hash: string;
      
      switch (hashAlgorithm) {
        case "md5":
          hash = CryptoJS.MD5(text).toString();
          break;
        case "sha1":
          hash = CryptoJS.SHA1(text).toString();
          break;
        case "sha256":
          hash = CryptoJS.SHA256(text).toString();
          break;
        case "sha512":
          hash = CryptoJS.SHA512(text).toString();
          break;
        case "sha3":
          hash = CryptoJS.SHA3(text).toString();
          break;
        case "ripemd160":
          hash = CryptoJS.RIPEMD160(text).toString();
          break;
        default:
          hash = CryptoJS.SHA256(text).toString();
      }
      
      setHashResult(hash);
      toast({
        title: "Hash generated",
        description: `${hashAlgorithm.toUpperCase()} hash created successfully`
      });
    } catch (error) {
      console.error("Hash error:", error);
      toast({
        title: "Failed to generate hash",
        description: "An error occurred while generating the hash",
        variant: "destructive"
      });
    } finally {
      setIsHashing(false);
    }
  }, [text, hashAlgorithm, toast]);

  // Function to handle file hash generation
  const generateFileHash = useCallback(async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to hash",
        variant: "destructive"
      });
      return;
    }

    setFileHashing(true);
    
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        const binary = event.target?.result;
        if (!binary) return;
        
        let hash: string;
        
        switch (hashAlgorithm) {
          case "md5":
            hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          case "sha1":
            hash = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          case "sha256":
            hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          case "sha512":
            hash = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          case "sha3":
            hash = CryptoJS.SHA3(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          case "ripemd160":
            hash = CryptoJS.RIPEMD160(CryptoJS.lib.WordArray.create(binary as any)).toString();
            break;
          default:
            hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(binary as any)).toString();
        }
        
        setHashResult(hash);
        setFileHashing(false);
        
        toast({
          title: "File hash generated",
          description: `${hashAlgorithm.toUpperCase()} hash for "${file.name}" created successfully`
        });
      };
      
      fileReader.onerror = () => {
        setFileHashing(false);
        toast({
          title: "Failed to read file",
          description: "An error occurred while reading the file",
          variant: "destructive"
        });
      };
      
      // Read file as array buffer
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File hash error:", error);
      setFileHashing(false);
      toast({
        title: "Failed to generate hash",
        description: "An error occurred while generating the file hash",
        variant: "destructive"
      });
    }
  }, [file, hashAlgorithm, toast]);

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setHashResult("");
  };

  // Copy hash result to clipboard
  const copyToClipboard = () => {
    if (!hashResult) return;
    
    navigator.clipboard.writeText(hashResult)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Hash value has been copied to clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate various hash values from text or files"
      icon={<Hash className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="text" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Hash</TabsTrigger>
            <TabsTrigger value="file">File Hash</TabsTrigger>
          </TabsList>
          
          {/* Text Hash Tab */}
          <TabsContent value="text">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hashAlgorithm">Hash Algorithm</Label>
                    <Select
                      value={hashAlgorithm}
                      onValueChange={(value) => setHashAlgorithm(value as HashAlgorithm)}
                    >
                      <SelectTrigger id="hashAlgorithm">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="sha1">SHA-1</SelectItem>
                        <SelectItem value="sha256">SHA-256</SelectItem>
                        <SelectItem value="sha512">SHA-512</SelectItem>
                        <SelectItem value="sha3">SHA-3</SelectItem>
                        <SelectItem value="ripemd160">RIPEMD-160</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inputText">Text to Hash</Label>
                    <textarea
                      id="inputText"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text to hash..."
                      className="w-full h-32 rounded-md border border-input p-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={generateTextHash} disabled={isHashing || !text.trim()} className="min-w-[150px]">
                      {isHashing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Hash"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* File Hash Tab */}
          <TabsContent value="file">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hashAlgorithm">Hash Algorithm</Label>
                    <Select
                      value={hashAlgorithm}
                      onValueChange={(value) => setHashAlgorithm(value as HashAlgorithm)}
                    >
                      <SelectTrigger id="hashAlgorithm">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="sha1">SHA-1</SelectItem>
                        <SelectItem value="sha256">SHA-256</SelectItem>
                        <SelectItem value="sha512">SHA-512</SelectItem>
                        <SelectItem value="sha3">SHA-3</SelectItem>
                        <SelectItem value="ripemd160">RIPEMD-160</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fileInput">Select File</Label>
                    <div className="border-2 border-dashed border-border rounded-md p-8 text-center bg-muted/30">
                      <Input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium mb-1">
                          {file ? file.name : "Click to select a file"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {file 
                            ? `${(file.size / 1024).toFixed(2)} KB` 
                            : "Maximum file size: 100MB"}
                        </span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={generateFileHash} disabled={fileHashing || !file} className="min-w-[150px]">
                      {fileHashing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Generate Hash"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Hash Result */}
        {hashResult && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Hash Result ({hashAlgorithm.toUpperCase()})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
                <div className="bg-muted/20 p-4 rounded-md font-mono text-sm break-all">
                  {hashResult}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Alert className="bg-muted/30 mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>About Hash Functions</AlertTitle>
          <AlertDescription>
            <div className="text-sm space-y-2 mt-2">
              <p>
                <strong>What are hash functions?</strong> Hash functions are cryptographic algorithms that transform input data of any size into a fixed-size output (hash value). The same input always produces the same output, but changing even one character of the input produces a completely different hash.
              </p>
              <p className="text-amber-500">
                <strong>Warning:</strong> Some hash algorithms (MD5, SHA-1) are no longer considered secure for cryptographic purposes and should not be used for sensitive applications.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <FileDigit className="h-5 w-5 mr-2" />
                Hash Algorithm Security
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">SHA-256/SHA-512:</span> Currently considered secure and widely used for most applications requiring strong cryptographic security.
                </p>
                <p>
                  <span className="font-medium text-foreground">SHA-3:</span> The newest member of the SHA family with improved security design, resistant to attacks that work against SHA-2.
                </p>
                <p>
                  <span className="font-medium text-foreground">RIPEMD-160:</span> A 160-bit hash function that was designed as an alternative to SHA-1.
                </p>
                <p>
                  <span className="font-medium text-foreground text-amber-500">SHA-1:</span> No longer considered secure against well-funded attackers. Avoid for new applications.
                </p>
                <p>
                  <span className="font-medium text-foreground text-amber-500">MD5:</span> Cryptographically broken and unsuitable for further use. Not recommended for security purposes.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Common Hash Uses
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">File Integrity:</span> Verify that files haven't been altered during transfer or storage.
                </p>
                <p>
                  <span className="font-medium text-foreground">Digital Signatures:</span> Used as part of the digital signature process for documents.
                </p>
                <p>
                  <span className="font-medium text-foreground">Data Identification:</span> Generate unique identifiers for data records.
                </p>
                <p>
                  <span className="font-medium text-foreground">Password Storage:</span> Store password hashes instead of plaintext passwords (with proper salting and specialized algorithms like bcrypt).
                </p>
                <p>
                  <span className="font-medium text-foreground">Blockchain:</span> Secure and verify transactions in cryptocurrency and blockchain applications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default HashGenerator;
