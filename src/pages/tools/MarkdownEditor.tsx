import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Edit, Eye, AlertCircle, FileCode } from "lucide-react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

import { MarkdownToolbar } from "@/components/markdown/MarkdownToolbar";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";

const MarkdownEditor = () => {
  const [markdownContent, setMarkdownContent] =
    useState<string>(`# Welcome to ZeroKit Markdown Editor!

This browser-based editor processes everything locally - your data never leaves your device.

## Basic Formatting

**Bold text** and *italic text* are easy to add.

## Lists

Unordered list:
- Item 1
- Item 2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item

## Links and Images

[Visit ZeroKit](https://zerokit.app)

## Code

Inline \`code\` looks like this.

\`\`\`javascript
// Code block example
function greet() {
  console.log("Hello, world!");
}
\`\`\`

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Enjoy writing with Markdown!
`);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">(
    "split"
  );
  const [htmlContent, setHtmlContent] = useState<string>("");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end);
    const newText = before + selectedText + after;

    setMarkdownContent(
      markdownContent.substring(0, start) +
        newText +
        markdownContent.substring(end)
    );

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertText("**", "**");
        break;
      case "italic":
        insertText("*", "*");
        break;
      case "strikethrough":
        insertText("~~", "~~");
        break;
      case "heading1":
        insertText("# ");
        break;
      case "heading2":
        insertText("## ");
        break;
      case "heading3":
        insertText("### ");
        break;
      case "ul":
        insertText("- ");
        break;
      case "ol":
        insertText("1. ");
        break;
      case "link":
        insertText("[", "](https://example.com)");
        break;
      case "image":
        insertText("![alt text](", ")");
        break;
      case "table":
        insertText(
          "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n\n"
        );
        break;
      case "quote":
        insertText("> ");
        break;
      case "code":
        if (editorRef.current) {
          const textarea = editorRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = markdownContent.substring(start, end);

          // If multiple lines are selected, make a code block
          if (selectedText.includes("\n")) {
            insertText("```\n", "\n```");
          } else {
            // Otherwise, make inline code
            insertText("`", "`");
          }
        }
        break;
      default:
        break;
    }
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "document.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Markdown file downloaded!");
  };

  const downloadHtml = () => {
    // Create an HTML document from the markdown content
    const htmlDoc = document.createElement("div");
    htmlDoc.innerHTML =
      document.querySelector(".markdown-preview-content")?.innerHTML || "";

    // Create a full HTML document structure
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    pre {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 1em;
      overflow-x: auto;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 4px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }
    blockquote {
      border-left: 4px solid #ccc;
      margin-left: 0;
      padding-left: 16px;
      color: #666;
    }
    img {
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${htmlDoc.innerHTML}
</body>
</html>`;

    const element = document.createElement("a");
    const file = new Blob([htmlTemplate], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "document.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("HTML file downloaded!");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(markdownContent)
      .then(() => {
        toast.success("Markdown content copied to clipboard!");
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <ToolLayout
      title="Markdown Editor"
      description="Create and preview Markdown documents with a real-time preview"
      icon={<Edit className="h-6 w-6 text-primary" />}
      category="Text & Content">
      <div className="space-y-4">
        <Card className="p-4">
          <MarkdownToolbar
            onFormatText={formatText}
            onCopyToClipboard={copyToClipboard}
            onDownloadMarkdown={downloadMarkdown}
            onDownloadHtml={downloadHtml}
            markdownContent={markdownContent}
          />
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <Tabs
              defaultValue="split"
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "edit" | "preview" | "split")
              }
              className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="edit" className="flex items-center gap-1.5">
                  <Edit className="h-4 w-4" /> Edit
                </TabsTrigger>
                <TabsTrigger
                  value="split"
                  className="flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Split View
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-0">
                <div className="border rounded-md p-4 min-h-[60vh]">
                  <Textarea
                    ref={editorRef}
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="font-mono min-h-[60vh] h-auto resize-none border-0 focus-visible:ring-0 p-0 w-full"
                    placeholder="Start typing your markdown here..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="split" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[60vh]">
                  <div className="border rounded-md p-4 min-h-[60vh] h-full">
                    <Textarea
                      ref={editorRef}
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      className="font-mono min-h-[60vh] h-full resize-none border-0 focus-visible:ring-0 p-0 w-full"
                      placeholder="Start typing your markdown here..."
                    />
                  </div>
                  <MarkdownPreview markdownContent={markdownContent} />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <MarkdownPreview markdownContent={markdownContent} fullWidth />
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            {/* This empty CardContent is intentionally kept to maintain spacing */}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MarkdownEditor;
