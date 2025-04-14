
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Clock, Plus, Trash, ArrowRightLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface TimeZone {
  name: string;
  offset: number;
  zoneName: string;
  currentTime: Date;
}

const TimeZoneConverter = () => {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    { name: "UTC (Coordinated Universal Time)", offset: 0, zoneName: "UTC", currentTime: new Date() },
    { name: "America/New_York (Eastern Time)", offset: -4, zoneName: "America/New_York", currentTime: new Date() }
  ]);

  // List of common time zones for the user to select from
  const availableTimeZones = [
    { name: "UTC (Coordinated Universal Time)", offset: 0, zoneName: "UTC" },
    { name: "America/New_York (Eastern Time)", offset: -4, zoneName: "America/New_York" },
    { name: "America/Chicago (Central Time)", offset: -5, zoneName: "America/Chicago" },
    { name: "America/Denver (Mountain Time)", offset: -6, zoneName: "America/Denver" },
    { name: "America/Los_Angeles (Pacific Time)", offset: -7, zoneName: "America/Los_Angeles" },
    { name: "America/Anchorage (Alaska Time)", offset: -8, zoneName: "America/Anchorage" },
    { name: "Pacific/Honolulu (Hawaii Time)", offset: -10, zoneName: "Pacific/Honolulu" },
    { name: "Europe/London (Greenwich Mean Time)", offset: 1, zoneName: "Europe/London" },
    { name: "Europe/Paris (Central European Time)", offset: 2, zoneName: "Europe/Paris" },
    { name: "Europe/Moscow (Moscow Time)", offset: 3, zoneName: "Europe/Moscow" },
    { name: "Asia/Dubai (Gulf Standard Time)", offset: 4, zoneName: "Asia/Dubai" },
    { name: "Asia/Kolkata (India Standard Time)", offset: 5.5, zoneName: "Asia/Kolkata" },
    { name: "Asia/Shanghai (China Standard Time)", offset: 8, zoneName: "Asia/Shanghai" },
    { name: "Asia/Tokyo (Japan Standard Time)", offset: 9, zoneName: "Asia/Tokyo" },
    { name: "Australia/Sydney (Australian Eastern Time)", offset: 10, zoneName: "Australia/Sydney" },
    { name: "Pacific/Auckland (New Zealand Time)", offset: 12, zoneName: "Pacific/Auckland" },
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      updateAllTimes();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update all times based on the current time
  const updateAllTimes = () => {
    const currentUtc = new Date();
    
    setTimeZones(prevTimeZones => 
      prevTimeZones.map(tz => ({
        ...tz,
        currentTime: calculateTimeInZone(currentUtc, tz.offset)
      }))
    );
  };

  // Calculate time in a specific time zone
  const calculateTimeInZone = (date: Date, offset: number) => {
    // Create a new date object and set it to the UTC time plus the offset hours
    const localTime = new Date(date);
    localTime.setUTCHours(date.getUTCHours() + offset);
    return localTime;
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  // Add a new time zone to the list
  const addTimeZone = (zoneName: string) => {
    const selected = availableTimeZones.find(tz => tz.zoneName === zoneName);
    
    if (!selected) {
      return;
    }
    
    // Check if the time zone is already in the list
    if (timeZones.some(tz => tz.zoneName === selected.zoneName)) {
      toast.error("This time zone is already in your list");
      return;
    }

    const currentUtc = new Date();
    const newTimeZone: TimeZone = {
      ...selected,
      currentTime: calculateTimeInZone(currentUtc, selected.offset)
    };

    setTimeZones([...timeZones, newTimeZone]);
    toast.success(`Added ${selected.name} to your list`);
  };

  // Remove a time zone from the list
  const removeTimeZone = (index: number) => {
    // Don't allow removing the last time zone
    if (timeZones.length <= 1) {
      toast.error("You must keep at least one time zone");
      return;
    }
    
    const newTimeZones = [...timeZones];
    newTimeZones.splice(index, 1);
    setTimeZones(newTimeZones);
  };

  return (
    <ToolLayout
      title="Time Zone Converter"
      description="Convert times across different time zones with real-time updates. Compare multiple time zones at once."
      icon={<Clock className="h-6 w-6 text-primary" />}
    >
      <div className="container max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Time Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="w-full md:flex-1">
                <Label htmlFor="new-timezone" className="mb-2 block">Add a time zone</Label>
                <Select onValueChange={addTimeZone}>
                  <SelectTrigger id="new-timezone">
                    <SelectValue placeholder="Select time zone to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeZones.map((tz) => (
                      <SelectItem key={tz.zoneName} value={tz.zoneName}>
                        {tz.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full md:w-auto mt-2 md:mt-7" onClick={() => updateAllTimes()}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Update All Times
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeZones.map((timeZone, index) => (
                <Card key={index} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeTimeZone(index)}
                    title="Remove this time zone"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">{timeZone.name}</h3>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md font-mono text-lg text-center">
                      {formatTime(timeZone.currentTime)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      GMT{timeZone.offset >= 0 ? "+" : ""}{timeZone.offset}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg mt-6 flex items-center text-sm">
              <Info className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span>
                All times are updated automatically every second. You can add multiple time zones to compare times around the world.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TimeZoneConverter;
