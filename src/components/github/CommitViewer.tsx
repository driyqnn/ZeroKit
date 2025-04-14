import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CommitViewer = () => {
  const [commitUrl, setCommitUrl] = useState("");
  const [commitData, setCommitData] = useState<any>(null);
  const [isLoadingCommit, setIsLoadingCommit] = useState(false);

  const viewCommit = () => {
    if (!commitUrl) {
      toast.error("Please enter a commit URL");
      return;
    }

    setIsLoadingCommit(true);

    // Extract commit info from URL
    let owner, repo, commitHash;
    try {
      const urlParts = commitUrl.replace("https://github.com/", "").split("/");
      owner = urlParts[0];
      repo = urlParts[1];

      // Find commit hash - it can be after /commit/ or /commits/
      const commitIndex = urlParts.findIndex(
        (part) => part === "commit" || part === "commits"
      );
      if (commitIndex > -1 && urlParts.length > commitIndex + 1) {
        commitHash = urlParts[commitIndex + 1];
      } else {
        throw new Error("Commit hash not found in URL");
      }
    } catch (error) {
      toast.error("Invalid commit URL format");
      setIsLoadingCommit(false);
      return;
    }

    // In a real implementation, we'd call the GitHub API
    // For this demo, we'll create mock data
    setTimeout(() => {
      const mockCommitData = {
        sha: commitHash,
        author: "GitHub User",
        date: new Date().toISOString(),
        message: "This is a mock commit message for demonstration purposes.",
        stats: {
          additions: Math.floor(Math.random() * 100),
          deletions: Math.floor(Math.random() * 20),
          files_changed: Math.floor(Math.random() * 10) + 1,
        },
      };

      setCommitData(mockCommitData);

      setIsLoadingCommit(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Viewer</CardTitle>
        <CardDescription>
          View GitHub commit details and changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="commit-url">GitHub Commit URL</Label>
          <Input
            id="commit-url"
            placeholder="https://github.com/username/repo/commit/hash"
            value={commitUrl}
            onChange={(e) => setCommitUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: https://github.com/facebook/react/commit/abcdef1234567890
          </p>
        </div>

        <Button
          onClick={viewCommit}
          disabled={isLoadingCommit || !commitUrl}
          className="w-full">
          {isLoadingCommit ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Commit...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              View Commit
            </>
          )}
        </Button>

        {commitData && (
          <div className="mt-4 space-y-4 border rounded-lg p-4">
            <div>
              <h3 className="font-semibold">
                Commit: {commitData.sha.substring(0, 7)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Author: {commitData.author} •{" "}
                {new Date(commitData.date).toLocaleString()}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium">Message:</h4>
              <p className="text-sm mt-1 whitespace-pre-wrap">
                {commitData.message}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-green-950/20 rounded-md">
                <span className="text-sm font-semibold text-green-500">
                  +{commitData.stats.additions}
                </span>
                <span className="text-xs text-muted-foreground">Additions</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-red-950/20 rounded-md">
                <span className="text-sm font-semibold text-red-500">
                  -{commitData.stats.deletions}
                </span>
                <span className="text-xs text-muted-foreground">Deletions</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-blue-950/20 rounded-md">
                <span className="text-sm font-semibold text-blue-500">
                  {commitData.stats.files_changed}
                </span>
                <span className="text-xs text-muted-foreground">
                  Files Changed
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
