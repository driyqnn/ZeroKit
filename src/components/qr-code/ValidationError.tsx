
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorProps {
  message: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center mt-1 text-red-500 text-xs">
      <AlertCircle className="h-3 w-3 mr-1" />
      <span>{message}</span>
    </div>
  );
};
