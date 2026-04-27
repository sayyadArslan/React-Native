import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

const KEY = "NOTES_APP";

type ContextType = {
  notes: Note[];
  addNote: (note: Omit<Note, "id">) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
};

export const NotesContext = createContext<ContextType>({} as ContextType);

export const NotesProvider = ({ children }: any) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // LOAD
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await AsyncStorage.getItem(KEY);
    if (data) setNotes(JSON.parse(data));
  };

  const saveToStorage = async (data: Note[]) => {
    setNotes(data);
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  };

  const addNote = (note: Omit<Note, "id">) => {
    const newNotes = [
      { ...note, id: Date.now().toString() },
      ...notes,
    ];
    saveToStorage(newNotes);
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    saveToStorage(newNotes);
  };

  const togglePin = (id: string) => {
    const newNotes = notes.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    saveToStorage(newNotes);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, togglePin }}>
      {children}
    </NotesContext.Provider>
  );
};