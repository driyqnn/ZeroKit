
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (value: string) => void;
  obfuscationLevel: string;
  setObfuscationLevel: (value: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
  obfuscationLevel,
  setObfuscationLevel
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="level">Obfuscation Level</Label>
        <Select value={obfuscationLevel} onValueChange={setObfuscationLevel}>
          <SelectTrigger id="level">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
