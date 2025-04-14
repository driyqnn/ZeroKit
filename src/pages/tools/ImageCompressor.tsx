import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Image, Download, Upload } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setOriginalImage(e.target.result as string);
          compressImage(e.target.result as string, quality[0]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (src: string, quality: number) => {
    const img = document.createElement("img");
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      setCompressedImage(compressedDataUrl);
    };
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value);
    if (originalImage) {
      compressImage(originalImage, value[0]);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed_ZeroKit${fileName || "image.jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress and resize your images while maintaining quality."
      icon={<Image className="h-6 w-6 text-primary" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Upload Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">
                Click to upload or drag and drop an image here
              </p>
              <p className="text-xs mt-2 text-muted-foreground">
                Supports: JPG, PNG, WebP, etc.
              </p>
            </div>
          </div>

          {originalImage && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Compression Quality</h2>
              <div className="mb-2 flex justify-between">
                <span className="text-sm">Low quality</span>
                <span className="text-sm font-medium">{quality[0]}%</span>
                <span className="text-sm">High quality</span>
              </div>
              <Slider
                defaultValue={[80]}
                min={1}
                max={100}
                step={1}
                value={quality}
                onValueChange={handleQualityChange}
                className="my-6"
              />

              <Button
                onClick={handleDownload}
                disabled={!compressedImage}
                className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Compressed Image
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {originalImage && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Original</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="max-w-full object-contain"
                    />
                  </div>
                </div>

                {compressedImage && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Compressed ({quality[0]}%)
                    </p>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <img
                        src={compressedImage}
                        alt="Compressed"
                        className="max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default ImageCompressor;
