
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import HtmlValidator from '@/components/web-seo/HtmlValidator';
import { Code2 } from 'lucide-react';

const HtmlValidatorPage = () => {
  return (
    <ToolLayout
      title="HTML Validator"
      description="Validate HTML code and find errors"
      icon={<Code2 className="h-6 w-6 text-primary" />}
      category="Web & SEO"
    >
      <HtmlValidator />
    </ToolLayout>
  );
};

export default HtmlValidatorPage;
