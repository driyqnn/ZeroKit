
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import UrlParser from '@/components/web-seo/UrlParser';
import { Link2 } from 'lucide-react';

const UrlParserPage = () => {
  return (
    <ToolLayout
      title="URL Parser"
      description="Parse and analyze URL parameters, path, and components"
      icon={<Link2 className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <UrlParser />
    </ToolLayout>
  );
};

export default UrlParserPage;
