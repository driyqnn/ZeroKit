
import React, { useState } from 'react';
import { Unlock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Note } from './NotesList';
import { generateRandomPassword } from "@/lib/utils";
import CryptoJS from "crypto-js";

interface NoteEditorProps {
  selectedNote: Note | null;
  onSave: (title: string, content: string, isEncrypted: boolean) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  selectedNote, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [content, setContent] = useState(selectedNote?.encrypted ? "" : (selectedNote?.content || ""));
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(selectedNote?.encrypted || false);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    if (isEncrypted && !password) {
      toast.error("Please enter a password to encrypt your note");
      return;
    }

    onSave(title, content, isEncrypted);
  };

  const decryptNote = () => {
    if (!selectedNote || !password) return;
    
    try {
      const decrypted = CryptoJS.AES.decrypt(selectedNote.content, password);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (decryptedText) {
        setContent(decryptedText);
        toast.success("Note decrypted successfully");
      } else {
        toast.error("Incorrect password");
      }
    } catch (error) {
      toast.error("Failed to decrypt note. Check your password.");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(12, true, true, true, true);
    setPassword(newPassword);
    toast.success("Random password generated. Make sure to remember it or save it securely!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedNote ? "Edit Note" : "Create New Note"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium mb-1 block">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="text-sm font-medium block">
              Content
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={() => setIsEncrypted(!isEncrypted)}
                  className="rounded border-gray-400"
                />
                Encrypt Note
              </label>
              {isEncrypted && (
                selectedNote?.encrypted && !content ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decryptNote}
                    className="h-7 text-xs"
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    Decrypt
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                    className="h-7 text-xs"
                  >
                    Generate Password
                  </Button>
                )
              )}
            </div>
          </div>
          
          {isEncrypted && (
            <div className="mb-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={selectedNote?.encrypted ? "Enter password to decrypt" : "Set encryption password"}
                className="mb-2"
              />
              <p className="text-xs text-amber-500 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {selectedNote?.encrypted && !content
                  ? "Enter the password to decrypt your note"
                  : "Warning: If you forget this password, you won't be able to recover your note"}
              </p>
            </div>
          )}
          
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              selectedNote?.encrypted && !content
                ? "Enter password and click Decrypt to view content"
                : "Write your note here..."
            }
            className="min-h-[300px]"
            disabled={selectedNote?.encrypted && !content}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Note</Button>
      </CardFooter>
    </Card>
  );
};

export default NoteEditor;
