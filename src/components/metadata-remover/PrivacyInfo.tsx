
import React from "react";

export const PrivacyInfo: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-md">
      <h2 className="text-lg font-medium mb-4">Privacy Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">How This Tool Works</h3>
          <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
            <li>Images are processed by re-drawing them on a canvas, which strips EXIF data</li>
            <li>All processing happens locally in your browser - files are never uploaded to a server</li>
            <li>Original file metadata is shown so you know what's being removed</li>
            <li>The downloaded file has embedded metadata removed</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Common Metadata Types</h3>
          <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
            <li><span className="font-medium">EXIF Data:</span> GPS coordinates, camera details, date/time</li>
            <li><span className="font-medium">Document Properties:</span> Author, organization, edit history</li>
            <li><span className="font-medium">XMP Data:</span> Rights management, descriptive information</li>
            <li><span className="font-medium">IPTC Data:</span> Copyright, captions, keywords</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
