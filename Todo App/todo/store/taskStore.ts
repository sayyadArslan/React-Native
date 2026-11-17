import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

interface TaskState {
  tasks: Task[];

  loadTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const STORAGE_KEY = "TASKS_APP";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  // 🔥 LOAD ON START
  loadTasks: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      set({ tasks: JSON.parse(data) });
    }
  },

  // 🔥 ADD TASK + SAVE
  addTask: async (title) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    const updated = [...get().tasks, newTask];

    set({ tasks: updated });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  },

  // 🔥 TOGGLE
  toggleTask: async (id) => {
    const updated = get().tasks.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed }
        : t
    );

    set({ tasks: updated });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  },

  // 🔥 DELETE
  deleteTask: async (id) => {
    const updated = get().tasks.filter(
      (t) => t.id !== id
    );

    set({ tasks: updated });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  },
}));