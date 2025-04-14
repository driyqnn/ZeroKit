import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from 'lucide-react';

const deviceSizes = [
  { name: 'Mobile Small', width: 320, height: 568, icon: <Smartphone className="h-4 w-4" /> },
  { name: 'Mobile Medium', width: 375, height: 667, icon: <Smartphone className="h-4 w-4" /> },
  { name: 'Mobile Large', width: 414, height: 736, icon: <Smartphone className="h-4 w-4" /> },
  { name: 'Tablet', width: 768, height: 1024, icon: <Tablet className="h-4 w-4" /> },
  { name: 'Laptop', width: 1366, height: 768, icon: <Monitor className="h-4 w-4" /> },
  { name: 'Desktop', width: 1920, height: 1080, icon: <Monitor className="h-4 w-4" /> },
];

const networkSpeeds = [
  { name: 'Fast 4G', value: 'fast', downloadSpeed: '20 Mbps', latency: '50ms' },
  { name: 'Slow 4G', value: 'medium', downloadSpeed: '5 Mbps', latency: '100ms' },
  { name: 'Slow 3G', value: 'slow', downloadSpeed: '1 Mbps', latency: '300ms' },
];

const ResponsiveTester: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('Mobile Medium');
  const [networkSpeed, setNetworkSpeed] = useState<string>('fast');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  
  const isMobile = useIsMobile();

  const validateUrl = (input: string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return pattern.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    if (validateUrl(formattedUrl)) {
      setIsLoading(true);
      setIsValidUrl(true);
      setTimeout(() => {
        setActiveUrl(formattedUrl);
        setIsLoading(false);
      }, 500);
    } else {
      setIsValidUrl(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveUrl('');
      setTimeout(() => setActiveUrl(activeUrl), 10);
    }, 500);
  };

  const handleOpenInNewTab = () => {
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  const getSelectedDeviceSize = () => {
    return deviceSizes.find(device => device.name === selectedDevice) || deviceSizes[1];
  };
  
  const deviceSize = getSelectedDeviceSize();
  
  const getNetworkSpeedClass = () => {
    switch (networkSpeed) {
      case 'slow': return 'animate-[fadeIn_3s]';
      case 'medium': return 'animate-[fadeIn_1.5s]';
      case 'fast': return 'animate-[fadeIn_0.5s]';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Responsive Breakpoint Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    placeholder="Enter website URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setIsValidUrl(true);
                    }}
                    className={`flex-1 ${!isValidUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <Button type="submit" disabled={!url}>
                    Test
                  </Button>
                </div>
                {!isValidUrl && <p className="text-xs text-red-500">Please enter a valid URL</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device">Device Size</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger id="device">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceSizes.map(device => (
                      <SelectItem key={device.name} value={device.name}>
                        <div className="flex items-center gap-2">
                          {device.icon}
                          <span>{device.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="network">Network Speed</Label>
                <Select value={networkSpeed} onValueChange={setNetworkSpeed}>
                  <SelectTrigger id="network">
                    <SelectValue placeholder="Select network speed" />
                  </SelectTrigger>
                  <SelectContent>
                    {networkSpeeds.map(speed => (
                      <SelectItem key={speed.value} value={speed.value}>
                        {speed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {activeUrl && (
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Size:</span> {deviceSize.width}×{deviceSize.height}px
                  {' • '}
                  <span className="font-medium">Network:</span> {networkSpeeds.find(speed => speed.value === networkSpeed)?.downloadSpeed}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleOpenInNewTab}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      {activeUrl ? (
        <div className={`relative mx-auto border-4 border-gray-800 rounded-2xl ${isMobile ? 'w-full' : ''}`} style={{
          maxWidth: `${deviceSize.width + 30}px`,
          height: `${isMobile ? 'auto' : `${Math.min(deviceSize.height, 600) + 30}px`}`,
        }}>
          <div className="absolute inset-x-0 top-0 h-6 bg-gray-800 flex items-center justify-center rounded-t-lg">
            <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
          
          <div className="relative pt-6" style={isMobile ? {} : { height: `${Math.min(deviceSize.height, 600) + 30}px` }}>
            {isLoading ? (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className={getNetworkSpeedClass()}>
                <iframe
                  src={activeUrl}
                  title="Website Preview"
                  className="w-full border-none bg-white"
                  style={{
                    width: `${deviceSize.width}px`,
                    height: isMobile ? '500px' : `${Math.min(deviceSize.height, 560)}px`,
                  }}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-muted-foreground">Enter a URL above to test how it looks on different devices</p>
          </CardContent>
        </Card>
      )}
      
      {activeUrl && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {networkSpeeds.map(speed => (
            <Card key={speed.value} className={`${networkSpeed === speed.value ? 'border-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{speed.name}</h3>
                  <div className="text-sm">
                    {Array(3).fill(0).map((_, i) => (
                      <span key={i} className={`inline-block w-2 h-4 mx-0.5 rounded-sm ${i < { slow: 1, medium: 2, fast: 3 }[speed.value] ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Download: {speed.downloadSpeed}</div>
                  <div>Latency: {speed.latency}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveTester;
