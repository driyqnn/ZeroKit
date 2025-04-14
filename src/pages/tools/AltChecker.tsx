
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import ImageAltChecker from '@/components/web-seo/ImageAltChecker';
import { Image } from 'lucide-react';

const AltCheckerPage = () => {
  return (
    <ToolLayout
      title="Image ALT Checker"
      description="Check images on a page for proper alt text"
      icon={<Image className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <ImageAltChecker />
    </ToolLayout>
  );
};

export default AltCheckerPage;
