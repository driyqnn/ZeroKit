
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { RepositoryDownloader } from '@/components/github/RepositoryDownloader';
import { ArchiveDownloader } from '@/components/github/ArchiveDownloader';
import { DirectoryDownloader } from '@/components/github/DirectoryDownloader';
import { CommitViewer } from '@/components/github/CommitViewer';

const GithubTools = () => {
  return (
    <ToolLayout
      title="GitHub Tools"
      description="Download repositories, archives, view commits, and more from GitHub"
      icon={<Github className="h-6 w-6 text-primary" />}
      category="Developer Tools"
    >
      <Tabs defaultValue="repository" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="repository">Repository</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="commit">Commit</TabsTrigger>
        </TabsList>
        
        {/* Repository Downloader */}
        <TabsContent value="repository">
          <RepositoryDownloader />
        </TabsContent>
        
        {/* Archive Downloader */}
        <TabsContent value="archive">
          <ArchiveDownloader />
        </TabsContent>
        
        {/* Directory Downloader */}
        <TabsContent value="directory">
          <DirectoryDownloader />
        </TabsContent>
        
        {/* Commit Viewer */}
        <TabsContent value="commit">
          <CommitViewer />
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default GithubTools;
