
import React from 'react';
import { useQRCode } from '../QRCodeContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationError } from '../ValidationError';

export const TextContentForm = () => {
  const { data, updateData, validationErrors } = useQRCode();
  
  const getError = (field: string) => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : '';
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-content">Text or URL</Label>
        <Input
          id="text-content"
          placeholder="Enter text or URL..."
          value={data.text}
          onChange={(e) => updateData({ text: e.target.value })}
          className={getError('text') ? "border-red-400" : ""}
          maxLength={500}
        />
        <div className="flex justify-between">
          <ValidationError message={getError('text')} />
          <div className="text-xs text-muted-foreground">
            {data.text.length}/500
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-primary/10 rounded-md">
        <p className="text-sm">
          <strong>Tip:</strong> For URLs, include the full address including 'http://' or 'https://'.
        </p>
      </div>
    </div>
  );
};
