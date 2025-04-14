
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import ResponsiveTester from '@/components/web-seo/ResponsiveTester';
import { Smartphone } from 'lucide-react';

const ResponsiveTesterPage = () => {
  return (
    <ToolLayout
      title="Responsive Breakpoint Tester"
      description="Preview websites at different device sizes and network speeds"
      icon={<Smartphone className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <ResponsiveTester />
    </ToolLayout>
  );
};

export default ResponsiveTesterPage;
