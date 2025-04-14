
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image, 
  Code, 
  Heading1, 
  Heading2, 
  Table, 
  Quote, 
  Copy, 
  FileDown, 
  Heading3,
  Underline,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Strikethrough,
  FileCode 
} from "lucide-react";

interface MarkdownToolbarProps {
  onFormatText: (type: string) => void;
  onCopyToClipboard: () => void;
  onDownloadMarkdown: () => void;
  onDownloadHtml?: () => void;
  markdownContent: string;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ 
  onFormatText, 
  onCopyToClipboard, 
  onDownloadMarkdown,
  onDownloadHtml,
  markdownContent
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <div className="flex flex-wrap gap-2">
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={() => onFormatText('heading1')} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('heading2')} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('heading3')} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={() => onFormatText('bold')} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('italic')} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('strikethrough')} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={() => onFormatText('ul')} title="Unordered List">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('ol')} title="Ordered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('quote')} title="Quote">
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={() => onFormatText('link')} title="Link">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('image')} title="Image">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('code')} title="Code">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onFormatText('table')} title="Table">
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-1">
        <Button variant="outline" onClick={onCopyToClipboard} className="flex items-center gap-1.5" disabled={!markdownContent}>
          <Copy className="h-4 w-4" /> 
          <span className="hidden sm:inline">Copy</span>
        </Button>
        <Button variant="outline" onClick={onDownloadMarkdown} className="flex items-center gap-1.5" disabled={!markdownContent}>
          <FileDown className="h-4 w-4" /> 
          <span className="hidden sm:inline">Download MD</span>
        </Button>
        {onDownloadHtml && (
          <Button variant="default" onClick={onDownloadHtml} className="flex items-center gap-1.5" disabled={!markdownContent}>
            <FileCode className="h-4 w-4" /> 
            <span className="hidden sm:inline">Export HTML</span>
          </Button>
        )}
      </div>
    </div>
  );
};
