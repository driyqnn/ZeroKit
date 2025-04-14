
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { FileWithMetadata } from "@/hooks/use-metadata-processor";
import { MetadataViewer } from "./MetadataViewer";

interface FileListProps {
  files: FileWithMetadata[];
  onDownload: (fileData: FileWithMetadata) => void;
  onRemove: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDownload,
  onRemove
}) => {
  // Get appropriate icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6" />;
    }
    return <FileText className="h-6 w-6" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files ({files.length})</CardTitle>
        <CardDescription>
          View metadata and download cleaned files
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No files uploaded. Select files to begin.
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((fileData, index) => (
              <Card key={index} className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(fileData.file.type)}
                      <div>
                        <h3 className="font-medium">{fileData.file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {fileData.file.type} · {fileData.metadata["File Size"]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDownload(fileData)}
                        disabled={!fileData.cleanedFile}
                        title="Download cleaned file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRemove(index)}
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview for images */}
                  {fileData.file.type.startsWith('image/') && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Original</p>
                        <img 
                          src={URL.createObjectURL(fileData.file)} 
                          alt="Original" 
                          className="max-h-40 max-w-full object-contain rounded border border-border"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      </div>
                      
                      {fileData.cleanedUrl && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Cleaned</p>
                          <img 
                            src={fileData.cleanedUrl} 
                            alt="Cleaned" 
                            className="max-h-40 max-w-full object-contain rounded border border-border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Metadata details */}
                  <MetadataViewer metadata={fileData.metadata} cleanedFile={fileData.cleanedFile} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
