
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  markdownContent: string;
  fullWidth?: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdownContent, fullWidth = false }) => {
  return (
    <div 
      className={`border rounded-md p-6 prose prose-invert dark:prose-invert max-w-none ${fullWidth ? 'w-full' : ''} min-h-[60vh] overflow-auto`}
    >
      <div className="markdown-preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-3 mb-1" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-2 mb-1" {...props} />,
            h5: ({ node, ...props }) => <h5 className="text-sm font-bold mt-2 mb-1" {...props} />,
            h6: ({ node, ...props }) => <h6 className="text-xs font-bold mt-2 mb-1" {...props} />,
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2" {...props} />,
            table: ({ node, ...props }) => <table className="border-collapse table-auto w-full my-4" {...props} />,
            thead: ({ node, ...props }) => <thead {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => <tr className="border-b border-gray-700" {...props} />,
            th: ({ node, ...props }) => <th className="p-2 text-left font-bold" {...props} />,
            td: ({ node, ...props }) => <td className="p-2" {...props} />,
            img: ({ node, ...props }) => <img className="max-w-full my-2" {...props} />,
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  className="my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-800 px-1 rounded" {...props}>
                  {children}
                </code>
              );
            },
            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            hr: () => <hr className="my-4 border-t border-gray-700" />,
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};
