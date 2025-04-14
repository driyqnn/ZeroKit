
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import { BookOpenCheck } from "lucide-react";
import ReadabilityCheckerContent from "@/components/readability-checker/ReadabilityCheckerContent";

const ReadabilityScoreChecker = () => {
  return (
    <ToolLayout
      title="Readability Score Checker"
      description="Analyze the reading level and complexity of your text"
      icon={<BookOpenCheck className="h-6 w-6 text-indigo-500" />}
    >
      <ReadabilityCheckerContent />
    </ToolLayout>
  );
};

export default ReadabilityScoreChecker;
