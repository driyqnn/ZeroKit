
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import OgTagGenerator from '@/components/web-seo/OgTagGenerator';
import { Share2 } from 'lucide-react';

const OpengraphGenerator = () => {
  return (
    <ToolLayout
      title="OpenGraph Tag Generator"
      description="Create optimized meta tags for social media sharing of your content"
      icon={<Share2 className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <OgTagGenerator />
    </ToolLayout>
  );
};

export default OpengraphGenerator;
