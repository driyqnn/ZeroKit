import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CryptoJS from "crypto-js";
import NotesList, { Note } from "@/components/notes/NotesList";
import NoteEditor from "@/components/notes/NoteEditor";

const PrivateNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("private-notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to parse saved notes", error);
        toast.error("Failed to load saved notes");
      }
    }
  }, []);

  // Save notes to local storage when they change
  useEffect(() => {
    localStorage.setItem("private-notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    setSelectedNote(null);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const saveNote = (title: string, content: string, isEncrypted: boolean) => {
    const timestamp = Date.now();
    let noteContent = content;

    // Encrypt content if needed
    if (isEncrypted) {
      try {
        // The password is validated and handled in the NoteEditor component
        const password = document.querySelector(
          'input[type="password"]'
        ) as HTMLInputElement;
        if (!password?.value) {
          toast.error("Password is required for encryption");
          return;
        }
        noteContent = CryptoJS.AES.encrypt(content, password.value).toString();
      } catch (error) {
        toast.error("Encryption failed");
        console.error("Encryption error:", error);
        return;
      }
    }

    if (selectedNote) {
      // Update existing note
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title,
              content: noteContent,
              lastModified: timestamp,
              encrypted: isEncrypted,
            }
          : note
      );
      setNotes(updatedNotes);
      toast.success("Note updated successfully");
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content: noteContent,
        lastModified: timestamp,
        encrypted: isEncrypted,
      };
      setNotes([...notes, newNote]);
      toast.success("Note saved successfully");
    }

    setSelectedNote(null);
  };

  const deleteNote = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      const noteToDelete = notes.find((note) => note.id === id);
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);

      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }

      toast.success("Note deleted");
    }
  };

  return (
    <ToolLayout
      title="Private Notes"
      description="Create and store encrypted notes securely in your browser"
      icon={<FileText className="h-6 w-6 text-primary" />}>
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="flex flex-col">
          <Button
            className="mb-4 flex items-center gap-2"
            onClick={createNewNote}>
            <PlusCircle className="h-4 w-4" />
            New Note
          </Button>

          <NotesList
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={selectNote}
            onDeleteNote={deleteNote}
          />
        </div>

        <NoteEditor
          selectedNote={selectedNote}
          onSave={saveNote}
          onCancel={() => setSelectedNote(null)}
        />
      </div>
    </ToolLayout>
  );
};

export default PrivateNotes;
