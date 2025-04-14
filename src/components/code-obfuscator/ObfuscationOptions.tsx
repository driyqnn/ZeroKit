
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ObfuscationOptionsProps {
  renameVariables: boolean;
  setRenameVariables: (value: boolean) => void;
  preserveLineNumbers: boolean;
  setPreserveLineNumbers: (value: boolean) => void;
  controlFlowFlattening: boolean;
  setControlFlowFlattening: (value: boolean) => void;
  stringEncoding: boolean;
  setStringEncoding: (value: boolean) => void;
  deadCodeInjection: boolean;
  setDeadCodeInjection: (value: boolean) => void;
}

export const ObfuscationOptions: React.FC<ObfuscationOptionsProps> = ({
  renameVariables,
  setRenameVariables,
  preserveLineNumbers,
  setPreserveLineNumbers,
  controlFlowFlattening,
  setControlFlowFlattening,
  stringEncoding,
  setStringEncoding,
  deadCodeInjection,
  setDeadCodeInjection
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="rename-vars"
          checked={renameVariables}
          onCheckedChange={setRenameVariables}
        />
        <Label htmlFor="rename-vars" className="cursor-pointer">
          Rename Variables
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="preserve-lines"
          checked={preserveLineNumbers}
          onCheckedChange={setPreserveLineNumbers}
        />
        <Label htmlFor="preserve-lines" className="cursor-pointer">
          Preserve Line Numbers
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="control-flow"
          checked={controlFlowFlattening}
          onCheckedChange={setControlFlowFlattening}
        />
        <Label htmlFor="control-flow" className="cursor-pointer">
          Control Flow Flattening
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="string-encoding"
          checked={stringEncoding}
          onCheckedChange={setStringEncoding}
        />
        <Label htmlFor="string-encoding" className="cursor-pointer">
          String Encoding
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="dead-code"
          checked={deadCodeInjection}
          onCheckedChange={setDeadCodeInjection}
        />
        <Label htmlFor="dead-code" className="cursor-pointer">
          Dead Code Injection
        </Label>
      </div>
    </div>
  );
};
