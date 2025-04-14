
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import SiteDownChecker from '@/components/web-seo/SiteDownChecker';
import { ServerCrash } from 'lucide-react';

const SiteDownCheckerPage = () => {
  return (
    <ToolLayout
      title="Site Down Checker"
      description="Check if a website is down from multiple global locations"
      icon={<ServerCrash className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <SiteDownChecker />
    </ToolLayout>
  );
};

export default SiteDownCheckerPage;
