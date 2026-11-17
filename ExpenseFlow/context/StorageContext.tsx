import React, { createContext, useContext } from 'react';
import { useStorage } from '../hooks/useStorage';

const StorageContext = createContext<any>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const storage = useStorage();

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageContext() {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error('useStorageContext must be used inside StorageProvider');
  }

  return context;
}