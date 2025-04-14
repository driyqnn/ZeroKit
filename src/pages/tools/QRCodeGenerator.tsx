
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { QrCode, Download, RefreshCw, Type, Image, Map, Wifi, Phone, Mail, Globe, Link, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import QRCode from "qrcode";
import { QRCodeGenerator as QRCodeGeneratorComponent } from "@/components/qr-code/QRCodeGenerator";
import { QRCodeCustomizer } from "@/components/qr-code/QRCodeCustomizer";
import { QRCodeDisplay } from "@/components/qr-code/QRCodeDisplay";
import { QRCodeContextProvider } from "@/components/qr-code/QRCodeContext";

const QRCodeGenerator = () => {
  return (
    <ToolLayout 
      title="QR Code Generator" 
      description="Create custom QR codes with your own colors and style"
      icon={<QrCode className="h-6 w-6 text-primary" />}
    >
      <QRCodeContextProvider>
        <div className="max-w-3xl mx-auto">
          <QRCodeGeneratorComponent />
        </div>
      </QRCodeContextProvider>
    </ToolLayout>
  );
};

export default QRCodeGenerator;
