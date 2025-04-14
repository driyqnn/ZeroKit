
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQRCode } from '../QRCodeContext';
import { ValidationError } from '../ValidationError';

export const LocationForm = () => {
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
            <Label htmlFor="latitude">Latitude</Label>
            <Input 
              id="latitude" 
              placeholder="37.7749"
              value={data.latitude}
              onChange={(e) => updateData({ latitude: e.target.value })}
              className={getError('latitude') ? "border-red-400" : ""}
              maxLength={20}
            />
            <ValidationError message={getError('latitude')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input 
              id="longitude" 
              placeholder="-122.4194"
              value={data.longitude}
              onChange={(e) => updateData({ longitude: e.target.value })}
              className={getError('longitude') ? "border-red-400" : ""}
              maxLength={20}
            />
            <ValidationError message={getError('longitude')} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
