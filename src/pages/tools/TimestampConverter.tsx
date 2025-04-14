
import React, { useState, useEffect } from "react";
import { Clock, Copy, Check, RefreshCw, Calendar } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const TimestampConverter = () => {
  const { toast } = useToast();
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateObject, setDateObject] = useState<Date>(new Date());
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("unix-to-date");
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(false);
  
  // Format options for displaying dates
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: use24HourFormat ? '2-digit' : 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24HourFormat
  };

  // Calculate the timezone offset
  const getTimezoneOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const sign = offset < 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${minutes}`;
  };

  // Update date object when timestamp changes in UNIX to Date mode
  useEffect(() => {
    if (activeTab === "unix-to-date") {
      try {
        // Convert seconds to milliseconds
        const milliseconds = parseInt(timestamp) * 1000;
        const date = new Date(milliseconds);
        
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          setDateObject(date);
        }
      } catch (error) {
        console.error("Error parsing timestamp:", error);
      }
    }
  }, [timestamp, activeTab]);

  // Update timestamp when date object changes in Date to UNIX mode
  useEffect(() => {
    if (activeTab === "date-to-unix") {
      const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
      setTimestamp(unixTimestamp.toString());
    }
  }, [dateObject, activeTab]);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestamp(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const newDate = new Date(dateObject);
    
    switch (name) {
      case 'year':
        newDate.setFullYear(parseInt(value));
        break;
      case 'month':
        newDate.setMonth(parseInt(value) - 1); // Month is 0-indexed
        break;
      case 'day':
        newDate.setDate(parseInt(value));
        break;
      case 'hour':
        newDate.setHours(parseInt(value));
        break;
      case 'minute':
        newDate.setMinutes(parseInt(value));
        break;
      case 'second':
        newDate.setSeconds(parseInt(value));
        break;
      default:
        break;
    }
    
    setDateObject(newDate);
  };

  const handleNowButtonClick = () => {
    const now = new Date();
    if (activeTab === "unix-to-date") {
      setTimestamp(Math.floor(now.getTime() / 1000).toString());
    } else {
      setDateObject(now);
    }
    
    toast({
      title: "Current Time Set",
      description: "Set to current time",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  // Format time since or until
  const getRelativeTime = () => {
    const now = new Date();
    const diff = dateObject.getTime() - now.getTime();
    
    const isInPast = diff < 0;
    const absDiff = Math.abs(diff);
    
    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;
    
    if (years > 0) {
      return `${isInPast ? 'was ' : 'will be in '} ${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else if (months > 0) {
      return `${isInPast ? 'was ' : 'will be in '} ${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    } else if (days > 0) {
      return `${isInPast ? 'was ' : 'will be in '} ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${isInPast ? 'was ' : 'will be in '} ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${isInPast ? 'was ' : 'will be in '} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${isInPast ? 'was ' : 'will be in '} ${seconds} second${seconds > 1 || seconds === 0 ? 's' : ''}`;
    }
  };

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates"
      icon={<Clock className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="unix-to-date" className="flex-1">Unix to Date</TabsTrigger>
            <TabsTrigger value="date-to-unix" className="flex-1">Date to Unix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unix-to-date">
            <Card>
              <CardHeader>
                <CardTitle>Unix Timestamp to Date</CardTitle>
                <CardDescription>
                  Enter a Unix timestamp in seconds to convert it to a human-readable date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="unix-timestamp">Unix Timestamp (seconds)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="unix-timestamp"
                        type="text"
                        placeholder="e.g., 1625097600"
                        value={timestamp}
                        onChange={handleTimestampChange}
                        className="pr-10"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => copyToClipboard(timestamp, 'Unix timestamp')}
                      >
                        {copied === 'Unix timestamp' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button onClick={handleNowButtonClick}>Now</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Converted Date</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">24-hour</span>
                      <Switch
                        checked={use24HourFormat}
                        onCheckedChange={setUse24HourFormat}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-muted/10">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{getTimezoneOffset()}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(dateObject.toLocaleString(undefined, dateFormatOptions), 'Formatted date')}
                        >
                          {copied === 'Formatted date' ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <p className="text-xl font-medium mt-2">
                        {dateObject.toLocaleString(undefined, dateFormatOptions)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getRelativeTime()}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">ISO 8601</Label>
                        <div className="relative mt-1">
                          <Input
                            value={dateObject.toISOString()}
                            readOnly
                            className="font-mono text-sm pr-9"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-8 w-8"
                            onClick={() => copyToClipboard(dateObject.toISOString(), 'ISO format')}
                          >
                            {copied === 'ISO format' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">UTC String</Label>
                        <div className="relative mt-1">
                          <Input
                            value={dateObject.toUTCString()}
                            readOnly
                            className="font-mono text-sm pr-9"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-8 w-8"
                            onClick={() => copyToClipboard(dateObject.toUTCString(), 'UTC format')}
                          >
                            {copied === 'UTC format' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="date-to-unix">
            <Card>
              <CardHeader>
                <CardTitle>Date to Unix Timestamp</CardTitle>
                <CardDescription>
                  Select a date and time to convert to a Unix timestamp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      placeholder="YYYY"
                      value={dateObject.getFullYear()}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      name="month"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="MM"
                      value={dateObject.getMonth() + 1}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Input
                      id="day"
                      name="day"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="DD"
                      value={dateObject.getDate()}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hour">Hour</Label>
                    <Input
                      id="hour"
                      name="hour"
                      type="number"
                      min="0"
                      max="23"
                      placeholder="HH"
                      value={dateObject.getHours()}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minute">Minute</Label>
                    <Input
                      id="minute"
                      name="minute"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={dateObject.getMinutes()}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second">Second</Label>
                    <Input
                      id="second"
                      name="second"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="SS"
                      value={dateObject.getSeconds()}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={handleNowButtonClick}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Set to Now
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const newDate = new Date(0); // January 1, 1970
                    setDateObject(newDate);
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Unix Timestamp</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-muted/10">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">Seconds</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(timestamp, 'Unix timestamp seconds')}
                        >
                          {copied === 'Unix timestamp seconds' ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <p className="text-xl font-mono mt-2">
                        {timestamp}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getRelativeTime()}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Milliseconds</Label>
                        <div className="relative mt-1">
                          <Input
                            value={(parseInt(timestamp) * 1000).toString()}
                            readOnly
                            className="font-mono text-sm pr-9"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-8 w-8"
                            onClick={() => copyToClipboard((parseInt(timestamp) * 1000).toString(), 'Unix timestamp ms')}
                          >
                            {copied === 'Unix timestamp ms' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">ISO 8601</Label>
                        <div className="relative mt-1">
                          <Input
                            value={dateObject.toISOString()}
                            readOnly
                            className="font-mono text-sm pr-9"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-8 w-8"
                            onClick={() => copyToClipboard(dateObject.toISOString(), 'ISO format')}
                          >
                            {copied === 'ISO format' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Common Unix Timestamps</CardTitle>
            <CardDescription>Frequently used reference timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { timestamp: "0", label: "Unix Epoch Start", description: "January 1, 1970 00:00:00 UTC" },
                { timestamp: "1000000000", label: "One Billion Seconds", description: "September 9, 2001 01:46:40 UTC" },
                { timestamp: "1500000000", label: "1.5 Billion Seconds", description: "July 14, 2017 07:40:00 UTC" },
                { timestamp: "2000000000", label: "Two Billion Seconds", description: "May 18, 2033 03:33:20 UTC" },
                { timestamp: "2147483647", label: "32-bit Unix Time End", description: "January 19, 2038 03:14:07 UTC" },
                { timestamp: Math.floor(Date.now() / 1000).toString(), label: "Current Time", description: new Date().toLocaleString() }
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-md border flex justify-between items-center hover:bg-muted/10">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTimestamp(item.timestamp);
                      setActiveTab("unix-to-date");
                    }}
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TimestampConverter;
