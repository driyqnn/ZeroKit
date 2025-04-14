
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQRCode } from '../QRCodeContext';
import { ValidationError } from '../ValidationError';

export const ContactForm = () => {
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
            <Label htmlFor="vcard-name">Full Name</Label>
            <Input 
              id="vcard-name" 
              placeholder="John Doe" 
              value={data.vcardName}
              onChange={(e) => updateData({ vcardName: e.target.value })}
              className={getError('vcardName') ? "border-red-400" : ""}
              maxLength={50}
            />
            <ValidationError message={getError('vcardName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vcard-email">Email</Label>
            <Input 
              id="vcard-email" 
              placeholder="john@example.com" 
              value={data.vcardEmail}
              onChange={(e) => updateData({ vcardEmail: e.target.value })}
              className={getError('vcardEmail') ? "border-red-400" : ""}
              maxLength={100}
            />
            <ValidationError message={getError('vcardEmail')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vcard-phone">Phone</Label>
            <Input 
              id="vcard-phone" 
              placeholder="+1 (555) 123-4567"
              value={data.vcardPhone}
              onChange={(e) => updateData({ vcardPhone: e.target.value })}
              className={getError('vcardPhone') ? "border-red-400" : ""}
              maxLength={20}
            />
            <ValidationError message={getError('vcardPhone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vcard-company">Company</Label>
            <Input 
              id="vcard-company" 
              placeholder="Company LLC"
              value={data.vcardCompany}
              onChange={(e) => updateData({ vcardCompany: e.target.value })}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vcard-title">Job Title</Label>
            <Input 
              id="vcard-title" 
              placeholder="Software Developer"
              value={data.vcardTitle}
              onChange={(e) => updateData({ vcardTitle: e.target.value })}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vcard-website">Website</Label>
            <Input 
              id="vcard-website" 
              placeholder="https://example.com"
              value={data.vcardWebsite}
              onChange={(e) => updateData({ vcardWebsite: e.target.value })}
              className={getError('vcardWebsite') ? "border-red-400" : ""}
              maxLength={100}
            />
            <ValidationError message={getError('vcardWebsite')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="vcard-address">Address</Label>
            <Input 
              id="vcard-address" 
              placeholder="123 Main St, City, Country"
              value={data.vcardAddress}
              onChange={(e) => updateData({ vcardAddress: e.target.value })}
              maxLength={150}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
