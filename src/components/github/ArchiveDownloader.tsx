import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Archive, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const ArchiveDownloader = () => {
  const [archiveUrl, setArchiveUrl] = useState("");
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [isArchiveDownloading, setIsArchiveDownloading] = useState(false);

  const downloadArchive = () => {
    if (!archiveUrl) {
      toast.error("Please enter an archive URL");
      return;
    }

    setIsArchiveDownloading(true);

    // Simulate download
    setTimeout(() => {
      try {
        // Create a temporary anchor element to trigger the download
        const a = document.createElement("a");
        a.href = archiveUrl;

        // Extract filename from URL
        const filename = archiveUrl.split("/").pop() || "archive.zip";
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success("Archive download initiated!");

        // Simulate download progress
      } catch (error) {
        toast.error("Failed to download archive");
        console.error(error);
      } finally {
        setIsArchiveDownloading(false);
      }
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archive Downloader</CardTitle>
        <CardDescription>
          Download ZIP, TAR, and other archive files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="archive-url">Archive URL</Label>
          <Input
            id="archive-url"
            placeholder="https://example.com/archive.zip"
            value={archiveUrl}
            onChange={(e) => setArchiveUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Direct link to a ZIP, TAR, RAR, or other archive file
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-subfolders"
            checked={includeSubfolders}
            onCheckedChange={(checked) =>
              setIncludeSubfolders(checked as boolean)
            }
          />
          <Label
            htmlFor="include-subfolders"
            className="text-sm cursor-pointer">
            Include subfolders when extracting
          </Label>
        </div>

        <Alert
          variant="default"
          className="bg-amber-950/20 border-amber-600/50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-400">
            Be careful when downloading archives from untrusted sources as they
            may contain malicious files.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={downloadArchive}
          disabled={isArchiveDownloading || !archiveUrl}>
          {isArchiveDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Archive className="mr-2 h-4 w-4" />
              Download Archive
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
