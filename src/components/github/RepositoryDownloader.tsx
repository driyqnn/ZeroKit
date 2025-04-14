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
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const RepositoryDownloader = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadRepository = () => {
    if (!repoUrl) {
      toast.error("Please enter a repository URL");
      return;
    }

    // Extract owner and repo name from URL
    let owner, repo;
    try {
      const urlParts = repoUrl.replace("https://github.com/", "").split("/");
      owner = urlParts[0];
      repo = urlParts[1];
    } catch (error) {
      toast.error("Invalid repository URL format");
      return;
    }

    setIsDownloading(true);
    setProgress(10);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    // In a real implementation, we'd use the GitHub API
    // For now, we'll redirect to the GitHub download link
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // Generate download URL
      const branchParam = branch ? `ref=${branch}` : "";
      const downloadUrl = `https://github.com/${owner}/${repo}/archive/${
        branchParam ? branch : "main"
      }.zip`;

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${repo}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Repository download initiated!");
  

      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Downloader</CardTitle>
        <CardDescription>
          Download GitHub repositories as ZIP archives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repo-url">GitHub Repository URL</Label>
          <Input
            id="repo-url"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: https://github.com/facebook/react
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch (Optional)</Label>
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for the default branch
          </p>
        </div>

        {isDownloading && (
          <div className="space-y-2">
            <Label className="text-sm">Download Progress</Label>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Alert
          variant="default"
          className="bg-amber-950/20 border-amber-600/50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-400">
            GitHub repository files are subject to their respective licenses.
            Please respect the terms of use.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={downloadRepository}
          disabled={isDownloading || !repoUrl}>
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Repository
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
