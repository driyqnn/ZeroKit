
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, RefreshCw } from "lucide-react";

interface FileUploaderProps {
  onFilesAdded: (files: FileList | null) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  onProcess,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilesAdded(e.target.files);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>
          Select files to view and remove metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-md p-6 text-center bg-muted/20">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            />
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center"
              onClick={handleFileInputClick}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-sm font-medium mb-1">Click to upload files</span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, GIF, PDF, DOCX, XLSX, PPTX
              </span>
            </Label>
          </div>
          
          <Tabs defaultValue="images">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="images" className="mt-4">
              <div className="text-sm space-y-2">
                <p>Supported image formats:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>JPEG/JPG</li>
                  <li>PNG</li>
                  <li>GIF</li>
                  <li>WebP</li>
                  <li>TIFF</li>
                </ul>
                <p className="text-xs mt-2">
                  JPEG images often contain EXIF data including GPS coordinates, camera details, and timestamps.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="mt-4">
              <div className="text-sm space-y-2">
                <p>Supported document formats:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>PDF</li>
                  <li>Word (DOC, DOCX)</li>
                  <li>Excel (XLS, XLSX)</li>
                  <li>PowerPoint (PPT, PPTX)</li>
                </ul>
                <p className="text-xs mt-2">
                  Documents often contain author information, edit history, and other sensitive details.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="w-full" 
            onClick={onProcess}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Remove Metadata'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
