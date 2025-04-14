import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { File as LucideFile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  accept?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  accept,
  buttonText,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: accept ? { [accept]: [] } : undefined,
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragActive ? "border-primary" : "border-border"
        }`}>
        <input {...getInputProps()} />
        {uploadedFile ? (
          <div className="flex flex-col items-center justify-center">
            <LucideFile className="h-10 w-10 text-primary mb-2" />
            <p className="text-lg font-semibold text-gray-800">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatFileSize(uploadedFile.size)}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveFile}
              className="mt-4">
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <LucideFile className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">
              {isDragActive
                ? "Drop the file here..."
                : buttonText ||
                  "Drag 'n' drop a file here, or click to select a file"}
            </p>
          </div>
        )}
      </div>
      {uploadedFile && (
        <div className="mt-4">
          <Badge variant="secondary">
            Uploaded: {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
          </Badge>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
