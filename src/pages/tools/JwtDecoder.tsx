
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Settings2, Copy, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const JwtDecoder = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [signature, setSignature] = useState("");
  const [expirationStatus, setExpirationStatus] = useState<"valid" | "expired" | "unknown">("unknown");
  const [expiresIn, setExpiresIn] = useState<string>("");

  useEffect(() => {
    if (jwtToken.trim()) {
      decodeJWT(jwtToken);
    } else {
      resetDecodedData();
    }
  }, [jwtToken]);

  const resetDecodedData = () => {
    setHeader(null);
    setPayload(null);
    setSignature("");
    setExpirationStatus("unknown");
    setExpiresIn("");
  };

  const decodeJWT = (token: string) => {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Not a valid JWT format");
      }

      // Decode header and payload
      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));
      
      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setSignature(parts[2]);

      // Check expiration
      checkExpiration(decodedPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      resetDecodedData();
    }
  };

  const checkExpiration = (payload: any) => {
    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      if (expirationTime > currentTime) {
        setExpirationStatus("valid");
        // Calculate time until expiration
        const timeLeft = expirationTime - currentTime;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setExpiresIn(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setExpiresIn(`${hours}h ${minutes}m`);
        } else {
          setExpiresIn(`${minutes}m`);
        }
      } else {
        setExpirationStatus("expired");
        const expiredTime = currentTime - expirationTime;
        const days = Math.floor(expiredTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((expiredTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((expiredTime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setExpiresIn(`${days}d ${hours}h ${minutes}m ago`);
        } else if (hours > 0) {
          setExpiresIn(`${hours}h ${minutes}m ago`);
        } else {
          setExpiresIn(`${minutes}m ago`);
        }
      }
    } else {
      setExpirationStatus("unknown");
      setExpiresIn("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return "Not specified";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const loadExampleJWT = () => {
    // Create example JWT with current time-based values
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = now + 3600; // 1 hour from now
    
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: "1234567890",
      name: "John Doe",
      iat: now,
      exp: expiresIn,
      iss: "example.com",
      aud: "client",
      roles: ["user", "admin"],
      permissions: ["read", "write"]
    };
    
    // Base64 encode header and payload
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    
    // Signature is just a fake for this example
    const signature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    
    const token = `${headerBase64}.${payloadBase64}.${signature}`;
    setJwtToken(token);
  };

  const onClear = () => {
    setJwtToken("");
    resetDecodedData();
  };

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JWT tokens"
      icon={<Settings2 className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">JWT Token</h3>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadExampleJWT}
                  >
                    Load Example
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClear}
                    disabled={!jwtToken}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <Textarea
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="min-h-[100px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {(header || payload) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Header</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(header, null, 2))}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-md">
                    {JSON.stringify(header, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Payload Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payload</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(payload, null, 2))}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-md">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {payload && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Token Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="expiration">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="expiration">Expiration</TabsTrigger>
                  <TabsTrigger value="claims">Claims</TabsTrigger>
                  <TabsTrigger value="signature">Signature</TabsTrigger>
                </TabsList>
                
                <TabsContent value="expiration" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Issue Date (iat)</p>
                          <p className="text-sm text-muted-foreground">
                            {payload.iat ? formatDateTime(payload.iat) : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Expiration Date (exp)</p>
                          <p className="text-sm text-muted-foreground">
                            {payload.exp ? formatDateTime(payload.exp) : "Not specified"}
                          </p>
                        </div>
                      </div>
                      
                      {expirationStatus !== "unknown" && (
                        <Badge 
                          className={
                            expirationStatus === "valid" 
                              ? "bg-green-600" 
                              : "bg-red-600"
                          }
                        >
                          {expirationStatus === "valid" ? "Valid" : "Expired"}
                          {expiresIn && ` - ${expiresIn}`}
                        </Badge>
                      )}
                    </div>
                    
                    {expirationStatus === "expired" && (
                      <div className="flex p-4 bg-red-900/20 border border-red-800/30 rounded-md">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                        <p className="text-sm text-red-400">
                          This token has expired and is no longer valid for authentication.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="claims" className="pt-4">
                  <div className="space-y-4">
                    {payload && Object.entries(payload).map(([key, value]) => (
                      <div key={key} className="p-4 bg-muted/30 rounded-md">
                        <p className="text-sm font-medium">{key}</p>
                        <pre className="text-sm text-muted-foreground mt-1 font-mono">
                          {typeof value === 'object' 
                            ? JSON.stringify(value, null, 2) 
                            : String(value)
                          }
                        </pre>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="signature" className="pt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-md">
                      <p className="text-sm font-medium">Signature (encoded)</p>
                      <p className="text-sm text-muted-foreground mt-2 font-mono break-all">
                        {signature}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
                      <p className="text-sm">
                        The signature is used to verify that the sender of the JWT is who it claims to be and to ensure that the message wasn't changed along the way. It's calculated using the header, the payload, and a secret that is known to both the issuer and the recipient.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default JwtDecoder;
