
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Pencil } from 'lucide-react';
import DrawingBoard from '@/components/drawing-board/DrawingBoard';

const DrawingBoardPage = () => {
  return (
    <ToolLayout
      title="Drawing Board"
      description="Create and save simple drawings"
      icon={<Pencil className="h-6 w-6 text-violet-500" />}
    >
      <div className="p-4">
        <DrawingBoard />
      </div>
    </ToolLayout>
  );
};

export default DrawingBoardPage;
