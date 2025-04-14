
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import WebsitePerformanceAnalyzer from '@/components/web-seo/WebsitePerformanceAnalyzer';
import { LineChart } from 'lucide-react';

const WebsitePerformancePage = () => {
  return (
    <ToolLayout
      title="Website Performance Analyzer"
      description="Test website load time and performance metrics"
      icon={<LineChart className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <WebsitePerformanceAnalyzer />
    </ToolLayout>
  );
};

export default WebsitePerformancePage;
