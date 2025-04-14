
import React from 'react';
import { Lock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  encrypted: boolean;
}

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  onDeleteNote 
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Card className="flex-1">
      <CardHeader className="py-3">
        <CardTitle className="text-base">Your Notes</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[500px]">
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Create your first note!
            </p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-md cursor-pointer flex justify-between items-start hover:bg-muted/50 ${
                    selectedNote?.id === note.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectNote(note)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{note.title}</span>
                      {note.encrypted && (
                        <Lock className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(note.lastModified)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default NotesList;
