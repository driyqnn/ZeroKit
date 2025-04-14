
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQRCode } from '../QRCodeContext';
import { ValidationError } from '../ValidationError';

export const EventForm = () => {
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
            <Label htmlFor="event-title">Event Title</Label>
            <Input 
              id="event-title" 
              placeholder="Birthday Party"
              value={data.eventTitle}
              onChange={(e) => updateData({ eventTitle: e.target.value })}
              className={getError('eventTitle') ? "border-red-400" : ""}
              maxLength={100}
            />
            <ValidationError message={getError('eventTitle')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input 
              id="event-location" 
              placeholder="123 Main St, City"
              value={data.eventLocation}
              onChange={(e) => updateData({ eventLocation: e.target.value })}
              maxLength={150}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-start">Start Date & Time</Label>
            <Input 
              id="event-start" 
              type="datetime-local"
              value={data.eventStart}
              onChange={(e) => updateData({ eventStart: e.target.value })}
              className={getError('eventStart') ? "border-red-400" : ""}
            />
            <ValidationError message={getError('eventStart')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-end">End Date & Time</Label>
            <Input 
              id="event-end" 
              type="datetime-local"
              value={data.eventEnd}
              onChange={(e) => updateData({ eventEnd: e.target.value })}
              className={getError('eventEnd') ? "border-red-400" : ""}
            />
            <ValidationError message={getError('eventEnd')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-description">Description</Label>
            <Input 
              id="event-description" 
              placeholder="Join us for a celebration!"
              value={data.eventDescription}
              onChange={(e) => updateData({ eventDescription: e.target.value })}
              maxLength={200}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
