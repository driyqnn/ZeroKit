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
import { AlertCircle, FolderDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const DirectoryDownloader = () => {
  const [directoryUrl, setDirectoryUrl] = useState("");
  const [directoryPath, setDirectoryPath] = useState("");
  const [isDirectoryDownloading, setIsDirectoryDownloading] = useState(false);

  const downloadDirectory = () => {
    if (!directoryUrl) {
      toast.error("Please enter a directory URL");
      return;
    }

    setIsDirectoryDownloading(true);

    try {
      // Extract owner, repo and path from URL
      const gitHubUrlPattern =
        /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/?(.*)/;
      const matches = directoryUrl.match(gitHubUrlPattern);

      if (!matches) {
        throw new Error("Invalid GitHub directory URL");
      }

      const [_, owner, repo, branch, path] = matches;

      // Create download URL for the directory using GitHub's API
      // Note: GitHub doesn't allow downloading single directories, so we download the entire repository
      // at the specified branch, which is not ideal but the best GitHub allows without OAuth
      const downloadUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${repo}-${branch}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success(
        "Directory download initiated. The zip will contain the entire repository."
      );
      toast.info(
        "Note: GitHub API doesn't support downloading single directories. The entire repository will be downloaded."
      );

      setIsDirectoryDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download directory. Please check the URL format.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Directory Downloader</CardTitle>
        <CardDescription>
          Download directories from GitHub repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="directory-url">GitHub Directory URL</Label>
          <Input
            id="directory-url"
            placeholder="https://github.com/username/repo/tree/main/src"
            value={directoryUrl}
            onChange={(e) => setDirectoryUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: https://github.com/facebook/react/tree/main/packages
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="directory-path">Save to Path (Optional)</Label>
          <Input
            id="directory-path"
            placeholder="downloads/myfiles"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The browser will handle saving to the default downloads folder
          </p>
        </div>

        <Alert
          variant="default"
          className="bg-amber-950/20 border-amber-600/50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-400">
            GitHub doesn't provide direct download of individual directories.
            The tool will download the entire repository as a ZIP file.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={downloadDirectory}
          disabled={isDirectoryDownloading || !directoryUrl}>
          {isDirectoryDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <FolderDown className="mr-2 h-4 w-4" />
              Download Directory
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
