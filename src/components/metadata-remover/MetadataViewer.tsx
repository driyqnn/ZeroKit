
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MetadataViewerProps {
  metadata: Record<string, any>;
  cleanedFile?: File;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ metadata, cleanedFile }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Group metadata into categories for better organization
  const groupedMetadata: Record<string, Record<string, any>> = {
    "Basic Information": {},
    "EXIF Data": {},
    "GPS Information": {},
    "Camera Details": {},
    "Document Properties": {},
    "Other Metadata": {},
  };
  
  // Sort metadata into groups
  Object.entries(metadata).forEach(([key, value]) => {
    if (["File Name", "File Type", "File Size", "Last Modified", "Dimensions"].includes(key)) {
      groupedMetadata["Basic Information"][key] = value;
    }
    else if (key.includes("GPS")) {
      groupedMetadata["GPS Information"][key] = value;
    }
    else if (key.includes("Camera") || key.includes("Make") || key.includes("Model") || 
             key.includes("Exposure") || key.includes("Flash") || key.includes("ISO") ||
             key.includes("Focal")) {
      groupedMetadata["Camera Details"][key] = value;
    }
    else if (key.includes("PDF") || key.includes("Document")) {
      groupedMetadata["Document Properties"][key] = value;
    }
    else if (key.includes("EXIF") || key.includes("DateTime") || key.includes("Artist") || 
             key.includes("Copyright") || key.includes("Software")) {
      groupedMetadata["EXIF Data"][key] = value;
    }
    else {
      groupedMetadata["Other Metadata"][key] = value;
    }
  });
  
  // Count total metadata items
  const totalItems = Object.values(metadata).length;
  
  // Filter out empty groups
  const nonEmptyGroups = Object.entries(groupedMetadata)
    .filter(([_, items]) => Object.keys(items).length > 0);
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Metadata ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show All
            </>
          )}
        </Button>
      </div>
      
      <div className={`text-xs space-y-4 max-h-[${expanded ? '500px' : '250px'}] overflow-y-auto border rounded-md p-3 mt-2`}>
        {nonEmptyGroups.map(([groupName, items], groupIndex) => (
          <div key={groupIndex} className="pb-2 last:pb-0">
            <h5 className="font-medium text-xs mb-2 pb-1 border-b">{groupName}</h5>
            <div className="space-y-1">
              {Object.entries(items).map(([key, value], itemIndex) => (
                <div key={`${groupIndex}-${itemIndex}`} className="grid grid-cols-3 gap-2 py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground font-medium">{key}:</span>
                  <span className="col-span-2">
                    {value?.toString() || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {cleanedFile && (
        <p className="text-xs text-emerald-500 mt-3">
          ✓ Metadata removed. File is ready to download.
        </p>
      )}
    </div>
  );
};
