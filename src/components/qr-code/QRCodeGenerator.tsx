
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Map, Wifi, Phone, Calendar } from "lucide-react";
import { useQRCode } from './QRCodeContext';
import { TextContentForm } from './forms/TextContentForm';
import { ContactForm } from './forms/ContactForm';
import { WifiForm } from './forms/WifiForm';
import { EventForm } from './forms/EventForm';
import { LocationForm } from './forms/LocationForm';
import { QRCodeCustomizer } from './QRCodeCustomizer';
import { QRCodeDisplay } from './QRCodeDisplay';

export const QRCodeGenerator = () => {
  const { activeTab, setActiveTab } = useQRCode();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <Tabs defaultValue="text" className="mb-6" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 md:grid-cols-5">
          <TabsTrigger value="text" className="flex items-center gap-1">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Text/URL</span>
          </TabsTrigger>
          <TabsTrigger value="vcard" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="wifi" className="flex items-center gap-1">
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Wi-Fi</span>
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Event</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Location</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <TextContentForm />
        </TabsContent>
        
        <TabsContent value="vcard" className="mt-4">
          <ContactForm />
        </TabsContent>
        
        <TabsContent value="wifi" className="mt-4">
          <WifiForm />
        </TabsContent>
        
        <TabsContent value="event" className="mt-4">
          <EventForm />
        </TabsContent>
        
        <TabsContent value="location" className="mt-4">
          <LocationForm />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <QRCodeCustomizer />
        <QRCodeDisplay />
      </div>
      
      <div className="mt-8 p-6 bg-black/30 border border-zinc-800/50 rounded-lg">
        <h3 className="font-medium mb-2">About QR Codes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          QR codes (Quick Response codes) can store various types of data, including URLs, 
          text, contact information (vCard), Wi-Fi network credentials, geolocation coordinates, and calendar events.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> For better scanning results, ensure high contrast between 
          the QR code and background colors. Adding a custom frame or logo can make your QR codes more distinctive
          and branded, but be careful not to obscure too much of the code pattern.
        </p>
      </div>
    </>
  );
};
