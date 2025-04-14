
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQRCode } from '../QRCodeContext';
import { ValidationError } from '../ValidationError';

export const WifiForm = () => {
  const { data, updateData, validationErrors } = useQRCode();
  
  const getError = (field: string) => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : '';
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
            <Input 
              id="wifi-ssid" 
              placeholder="WiFi Network"
              value={data.wifiSsid}
              onChange={(e) => updateData({ wifiSsid: e.target.value })}
              className={getError('wifiSsid') ? "border-red-400" : ""}
              maxLength={50}
            />
            <ValidationError message={getError('wifiSsid')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wifi-password">Password</Label>
            <Input 
              id="wifi-password" 
              type="password" 
              placeholder="Password"
              value={data.wifiPassword}
              onChange={(e) => updateData({ wifiPassword: e.target.value })}
              className={getError('wifiPassword') ? "border-red-400" : ""}
              maxLength={64}
            />
            <ValidationError message={getError('wifiPassword')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wifi-encryption">Encryption</Label>
            <Select 
              value={data.wifiEncryption} 
              onValueChange={(value: any) => updateData({ wifiEncryption: value })}
            >
              <SelectTrigger id="wifi-encryption">
                <SelectValue placeholder="Select encryption type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex items-center pt-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="wifi-hidden"
                checked={data.wifiHidden}
                onCheckedChange={(checked) => updateData({ wifiHidden: checked })}
              />
              <Label htmlFor="wifi-hidden">Hidden Network</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
