import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

const EncryptionPlayground = () => {
  // Symmetric encryption states
  const [plaintext, setPlaintext] = useState("");
  const [key, setKey] = useState("");
  const [algorithm, setAlgorithm] = useState("aes");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [textToDecrypt, setTextToDecrypt] = useState("");
  const [keyToDecrypt, setKeyToDecrypt] = useState("");
  const [algorithmToDecrypt, setAlgorithmToDecrypt] = useState("aes");
  const [copied, setCopied] = useState(false);

  // Hashing states
  const [textToHash, setTextToHash] = useState("");
  const [hashAlgorithm, setHashAlgorithm] = useState("sha256");
  const [hashOutput, setHashOutput] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  const getKeySize = (algo: string) => {
    switch (algo) {
      case "aes":
        return 32; // 256 bits
      case "des":
        return 8; // 64 bits
      case "tripledes":
        return 24; // 192 bits
      default:
        return 32;
    }
  };

  const stringToBytes = (str: string) => {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  };

  const bytesToString = (bytes: Uint8Array) => {
    return Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");
  };

  const bytesToHex = (bytes: Uint8Array) => {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const hexToBytes = (hex: string) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  };

  const padKey = (key: string, size: number) => {
    if (key.length >= size) {
      return key.slice(0, size);
    }
    return key.padEnd(size, "0");
  };

  const encrypt = async () => {
    try {
      // Ensure key is correct length
      const keySize = getKeySize(algorithm);
      const paddedKey = padKey(key, keySize);

      // Convert to bytes
      const keyBuffer = stringToBytes(paddedKey);
      const plaintextBuffer = stringToBytes(plaintext);

      // Import key
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {
          name:
            algorithm === "aes"
              ? "AES-CBC"
              : algorithm === "des"
              ? "DES-CBC"
              : "Triple-DES-CBC",
        },
        false,
        ["encrypt"]
      );

      // Generate IV (initialization vector)
      const iv = window.crypto.getRandomValues(
        new Uint8Array(algorithm === "aes" ? 16 : 8)
      );

      // Encrypt
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name:
            algorithm === "aes"
              ? "AES-CBC"
              : algorithm === "des"
              ? "DES-CBC"
              : "Triple-DES-CBC",
          iv,
        },
        cryptoKey,
        plaintextBuffer
      );

      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(
        iv.byteLength + encryptedBuffer.byteLength
      );
      encryptedArray.set(iv);
      encryptedArray.set(new Uint8Array(encryptedBuffer), iv.byteLength);

      // Convert to hex string
      const encryptedHex = bytesToHex(encryptedArray);
      setEncryptedText(encryptedHex);

      toast.success("Text encrypted successfully!");
    } catch (error) {
      console.error("Encryption error:", error);
      toast.error("Encryption failed. Please check your inputs.");
    }
  };

  const decrypt = async () => {
    try {
      if (!textToDecrypt) {
        toast.error("Please enter text to decrypt");
        return;
      }

      // Ensure key is correct length
      const keySize = getKeySize(algorithmToDecrypt);
      const paddedKey = padKey(keyToDecrypt, keySize);

      // Convert to bytes
      const keyBuffer = stringToBytes(paddedKey);
      const encryptedBytes = hexToBytes(textToDecrypt);

      // Extract IV
      const ivSize = algorithmToDecrypt === "aes" ? 16 : 8;
      const iv = encryptedBytes.slice(0, ivSize);
      const encryptedData = encryptedBytes.slice(ivSize);

      // Import key
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {
          name:
            algorithmToDecrypt === "aes"
              ? "AES-CBC"
              : algorithmToDecrypt === "des"
              ? "DES-CBC"
              : "Triple-DES-CBC",
        },
        false,
        ["decrypt"]
      );

      // Decrypt
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name:
            algorithmToDecrypt === "aes"
              ? "AES-CBC"
              : algorithmToDecrypt === "des"
              ? "DES-CBC"
              : "Triple-DES-CBC",
          iv,
        },
        cryptoKey,
        encryptedData
      );

      // Convert to string
      const decryptedText = bytesToString(new Uint8Array(decryptedBuffer));
      setDecryptedText(decryptedText);

      toast.success("Text decrypted successfully!");
    } catch (error) {
      console.error("Decryption error:", error);
      toast.error("Decryption failed. Please check your inputs and key.");
    }
  };

  const generateHash = async () => {
    try {
      if (!textToHash) {
        toast.error("Please enter text to hash");
        return;
      }

      const data = stringToBytes(textToHash);
      const hashBuffer = await window.crypto.subtle.digest(
        hashAlgorithm.toUpperCase(),
        data
      );
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = bytesToHex(hashArray);

      setHashOutput(hashHex);
      toast.success("Hash generated successfully!");
    } catch (error) {
      console.error("Hashing error:", error);
      toast.error("Hashing failed. Please check your inputs.");
    }
  };

  const copyToClipboard = (
    text: string,
    setCopiedState: (state: boolean) => void
  ) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <ToolLayout
      title="Encryption Playground"
      description="Explore and experiment with various encryption methods, decryption, and hashing algorithms."
      icon={<Lock className="h-6 w-6 text-primary" />}
      category="Privacy & Security">
      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          <TabsTrigger value="hash">Hash</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt">
          <Card>
            <CardHeader>
              <CardTitle>Encrypt Text</CardTitle>
              <CardDescription>
                Encrypt your text using various symmetric encryption algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plaintext">Text to Encrypt</Label>
                <Textarea
                  id="plaintext"
                  placeholder="Enter text to encrypt..."
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryption-key">Encryption Key</Label>
                <Input
                  id="encryption-key"
                  type="text"
                  placeholder="Enter a secure key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This key will be padded or truncated to match the required key
                  length.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes">AES-256</SelectItem>
                    <SelectItem value="des">DES</SelectItem>
                    <SelectItem value="tripledes">Triple DES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={encrypt} className="w-full">
                <Lock className="mr-2 h-4 w-4" /> Encrypt
              </Button>

              {encryptedText && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="encrypted-text">Encrypted Result (Hex)</Label>
                  <div className="relative">
                    <Textarea
                      id="encrypted-text"
                      value={encryptedText}
                      readOnly
                      rows={4}
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(encryptedText, setCopied)}>
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt">
          <Card>
            <CardHeader>
              <CardTitle>Decrypt Text</CardTitle>
              <CardDescription>
                Decrypt previously encrypted text using the appropriate key and
                algorithm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-to-decrypt">Encrypted Text (Hex)</Label>
                <Textarea
                  id="text-to-decrypt"
                  placeholder="Enter encrypted text in hex format..."
                  value={textToDecrypt}
                  onChange={(e) => setTextToDecrypt(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="decryption-key">Decryption Key</Label>
                <Input
                  id="decryption-key"
                  type="text"
                  placeholder="Enter the decryption key..."
                  value={keyToDecrypt}
                  onChange={(e) => setKeyToDecrypt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="decrypt-algorithm">Algorithm</Label>
                <Select
                  value={algorithmToDecrypt}
                  onValueChange={setAlgorithmToDecrypt}>
                  <SelectTrigger id="decrypt-algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes">AES-256</SelectItem>
                    <SelectItem value="des">DES</SelectItem>
                    <SelectItem value="tripledes">Triple DES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={decrypt} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Decrypt
              </Button>

              {decryptedText && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="decrypted-text">Decrypted Result</Label>
                  <Textarea
                    id="decrypted-text"
                    value={decryptedText}
                    readOnly
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hash">
          <Card>
            <CardHeader>
              <CardTitle>Hash Generator</CardTitle>
              <CardDescription>
                Generate secure cryptographic hashes of your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-to-hash">Text to Hash</Label>
                <Textarea
                  id="text-to-hash"
                  placeholder="Enter text to hash..."
                  value={textToHash}
                  onChange={(e) => setTextToHash(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hash-algorithm">Hashing Algorithm</Label>
                <Select value={hashAlgorithm} onValueChange={setHashAlgorithm}>
                  <SelectTrigger id="hash-algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha384">SHA-384</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                    <SelectItem value="sha1">
                      SHA-1 (Not Recommended)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateHash} className="w-full">
                Generate Hash
              </Button>

              {hashOutput && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="hash-output">Hash Result</Label>
                  <div className="relative">
                    <Textarea
                      id="hash-output"
                      value={hashOutput}
                      readOnly
                      rows={4}
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(hashOutput, setCopiedHash)
                      }>
                      {copiedHash ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default EncryptionPlayground;
