import { create } from 'zustand';

export type ScanItem = {
  id: string;
  value: string;
  type: string;
  createdAt: number;
};

type ScanStore = {
  history: ScanItem[];
  addScan: (item: Omit<ScanItem, 'createdAt'>) => void;
  clearHistory: () => void;
};

const useScanStore = create<ScanStore>((set) => ({
  history: [],

  addScan: (item) =>
    set((state) => ({
      history: [
        { ...item, createdAt: Date.now() },
        ...state.history,
      ],
    })),

  clearHistory: () => set({ history: [] }),
}));

export default useScanStore;
