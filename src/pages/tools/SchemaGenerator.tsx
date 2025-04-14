
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import SchemaMarkupGenerator from '@/components/web-seo/SchemaMarkupGenerator';
import { MessageSquare } from 'lucide-react';

const SchemaGeneratorPage = () => {
  return (
    <ToolLayout
      title="Schema Markup Generator"
      description="Create structured data markup for better SEO"
      icon={<MessageSquare className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <SchemaMarkupGenerator />
    </ToolLayout>
  );
};

export default SchemaGeneratorPage;
