import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

const KEY = "notes";

export const getNotes = async (): Promise<Note[]> => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveNotes = async (notes: Note[]) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(notes));
  } catch (e) {
    console.log("Save error:", e);
  }
};