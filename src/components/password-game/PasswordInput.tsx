
import React, { forwardRef } from 'react';
import { Input } from "@/components/ui/input";

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Enter your password..."}
        className={className}
        autoComplete="off"
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
