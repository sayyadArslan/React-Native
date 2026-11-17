export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate?: string;
  reminder?: string;
  favorite?: boolean;
}