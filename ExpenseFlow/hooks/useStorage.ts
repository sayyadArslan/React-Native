import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType | 'both';
  color: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM
  spent: number;
}

export interface AppSettings {
  currency: string;
  darkMode: boolean;
  budgetAlerts: boolean;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  TRANSACTIONS: 'ef_transactions',
  CATEGORIES: 'ef_categories',
  BUDGET_GOALS: 'ef_budget_goals',
  SETTINGS: 'ef_settings',
};

// ─── Default Categories ───────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1',  name: 'Food & Dining',    icon: '🍔', type: 'expense', color: '#EF5350' },
  { id: 'c2',  name: 'Transport',        icon: '🚗', type: 'expense', color: '#FF9800' },
  { id: 'c3',  name: 'Shopping',         icon: '🛍️', type: 'expense', color: '#E91E63' },
  { id: 'c4',  name: 'Bills & Utilities',icon: '💡', type: 'expense', color: '#9C27B0' },
  { id: 'c5',  name: 'Health',           icon: '🏥', type: 'expense', color: '#2196F3' },
  { id: 'c6',  name: 'Entertainment',   icon: '🎮', type: 'expense', color: '#00BCD4' },
  { id: 'c7',  name: 'Education',        icon: '📚', type: 'expense', color: '#3F51B5' },
  { id: 'c8',  name: 'Rent',             icon: '🏠', type: 'expense', color: '#795548' },
  { id: 'c9',  name: 'Salary',           icon: '💼', type: 'income',  color: '#4CAF50' },
  { id: 'c10', name: 'Freelance',        icon: '💻', type: 'income',  color: '#8BC34A' },
  { id: 'c11', name: 'Business',         icon: '📈', type: 'income',  color: '#CDDC39' },
  { id: 'c12', name: 'Investment',       icon: '💹', type: 'income',  color: '#D4AF37' },
  { id: 'c13', name: 'Gift',             icon: '🎁', type: 'both',    color: '#FF5722' },
  { id: 'c14', name: 'Other',            icon: '📌', type: 'both',    color: '#607D8B' },
];

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'PKR',
  darkMode: true,
  budgetAlerts: true,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function useStorage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories]     = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budgetGoals, setBudgetGoals]   = useState<BudgetGoal[]>([]);
  const [settings, setSettings]         = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading]           = useState(true);

  // ── Load All ───────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    try {
      const [txRaw, catRaw, budgetRaw, settingsRaw] = await Promise.all([
        AsyncStorage.getItem(KEYS.TRANSACTIONS),
        AsyncStorage.getItem(KEYS.CATEGORIES),
        AsyncStorage.getItem(KEYS.BUDGET_GOALS),
        AsyncStorage.getItem(KEYS.SETTINGS),
      ]);
      if (txRaw)       setTransactions(JSON.parse(txRaw));
      if (catRaw)      setCategories(JSON.parse(catRaw));
      else             await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      if (budgetRaw)   setBudgetGoals(JSON.parse(budgetRaw));
      if (settingsRaw) setSettings(JSON.parse(settingsRaw));
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Transactions ───────────────────────────────────────────────────────────

  const addTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    return newTx;
  }, [transactions]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...data } : t);
    setTransactions(updated);
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
  }, [transactions]);

  // ── Categories ─────────────────────────────────────────────────────────────

  const addCategory = useCallback(async (data: Omit<Category, 'id'>) => {
    const newCat: Category = { ...data, id: generateId() };
    const updated = [...categories, newCat];
    setCategories(updated);
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
  }, [categories]);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...data } : c);
    setCategories(updated);
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
  }, [categories]);

  const deleteCategory = useCallback(async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
  }, [categories]);

  // ── Budget Goals ───────────────────────────────────────────────────────────

  const addBudgetGoal = useCallback(async (data: Omit<BudgetGoal, 'id' | 'spent'>) => {
    const newGoal: BudgetGoal = { ...data, id: generateId(), spent: 0 };
    const updated = [...budgetGoals, newGoal];
    setBudgetGoals(updated);
    await AsyncStorage.setItem(KEYS.BUDGET_GOALS, JSON.stringify(updated));
  }, [budgetGoals]);

  const updateBudgetGoal = useCallback(async (id: string, data: Partial<BudgetGoal>) => {
    const updated = budgetGoals.map(g => g.id === id ? { ...g, ...data } : g);
    setBudgetGoals(updated);
    await AsyncStorage.setItem(KEYS.BUDGET_GOALS, JSON.stringify(updated));
  }, [budgetGoals]);

  const deleteBudgetGoal = useCallback(async (id: string) => {
    const updated = budgetGoals.filter(g => g.id !== id);
    setBudgetGoals(updated);
    await AsyncStorage.setItem(KEYS.BUDGET_GOALS, JSON.stringify(updated));
  }, [budgetGoals]);

  // ── Settings ───────────────────────────────────────────────────────────────

  const updateSettings = useCallback(async (data: Partial<AppSettings>) => {
    const updated = { ...settings, ...data };
    setSettings(updated);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  }, [settings]);

  // ── Backup & Restore ───────────────────────────────────────────────────────

  const exportBackup = useCallback(async (): Promise<string> => {
    const backup = {
      transactions, categories, budgetGoals, settings,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(backup, null, 2);
  }, [transactions, categories, budgetGoals, settings]);

  const importBackup = useCallback(async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions) {
        setTransactions(data.transactions);
        await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      }
      if (data.categories) {
        setCategories(data.categories);
        await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
      }
      if (data.budgetGoals) {
        setBudgetGoals(data.budgetGoals);
        await AsyncStorage.setItem(KEYS.BUDGET_GOALS, JSON.stringify(data.budgetGoals));
      }
      if (data.settings) {
        setSettings(data.settings);
        await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      return true;
    } catch { return false; }
  }, []);

  const clearAllData = useCallback(async () => {
    await AsyncStorage.multiRemove([KEYS.TRANSACTIONS, KEYS.BUDGET_GOALS]);
    setTransactions([]);
    setBudgetGoals([]);
  }, []);

  // ── Computed ───────────────────────────────────────────────────────────────

  const getMonthTransactions = useCallback((year: number, month: number) => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions]);

  const getMonthSummary = useCallback((year: number, month: number) => {
    const txs = getMonthTransactions(year, month);
    const income  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense, transactions: txs };
  }, [getMonthTransactions]);

  const getTotalBalance = useCallback(() => {
    const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return {
    transactions, categories, budgetGoals, settings, loading,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, updateCategory, deleteCategory,
    addBudgetGoal, updateBudgetGoal, deleteBudgetGoal,
    updateSettings,
    exportBackup, importBackup, clearAllData,
    getMonthTransactions, getMonthSummary, getTotalBalance,
    reload: loadAll,
  };
}