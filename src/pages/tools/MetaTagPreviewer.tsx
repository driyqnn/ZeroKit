
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import MetaTagPreview from '@/components/web-seo/MetaTagPreview';
import { SearchCheck } from 'lucide-react';

const MetaTagPreviewer = () => {
  return (
    <ToolLayout
      title="Meta Tag Previewer"
      description="See how your webpage appears on Google, Twitter, and Facebook with customizable meta tags"
      icon={<SearchCheck className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <MetaTagPreview />
    </ToolLayout>
  );
};

export default MetaTagPreviewer;
