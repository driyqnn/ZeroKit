
import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileX, Upload, Download, Trash2, Info, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataViewer } from "@/components/metadata-remover/MetadataViewer";
import { FileUploader } from "@/components/metadata-remover/FileUploader";
import { FileList } from "@/components/metadata-remover/FileList";
import { PrivacyInfo } from "@/components/metadata-remover/PrivacyInfo";
import { useMetadataProcessor } from "@/hooks/use-metadata-processor";

const MetadataRemover = () => {
  const { toast } = useToast();
  const { 
    files, 
    addFiles,
    processFiles,
    downloadFile,
    removeFile,
    isProcessing
  } = useMetadataProcessor();
  
  return (
    <ToolLayout
      title="Metadata Viewer & Remover"
      description="View and strip sensitive data from files"
      icon={<FileX className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-6xl mx-auto">
        <Alert className="mb-6">
          <Info className="h-5 w-5" />
          <AlertTitle>About Metadata</AlertTitle>
          <AlertDescription>
            <p className="mt-1">
              Files often contain hidden metadata like location coordinates, device information, author details, and timestamps. This tool helps you view and remove this information.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - File Uploader */}
          <div className="md:col-span-1">
            <FileUploader 
              onFilesAdded={addFiles} 
              onProcess={processFiles}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Column - File List & Details */}
          <div className="md:col-span-2">
            <FileList 
              files={files}
              onDownload={downloadFile}
              onRemove={removeFile}
            />
          </div>
        </div>

        <PrivacyInfo />
      </div>
    </ToolLayout>
  );
};

export default MetadataRemover;
