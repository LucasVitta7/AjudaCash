export type AppPage =
  | 'home'
  | 'add'
  | 'qr'
  | 'history'
  | 'profile'
  | 'statistics'
  | 'goals'
  | 'categories'
  | 'settings'
  | 'notifications'
  | 'reports';

export type NavigationPage = 'home' | 'add' | 'qr' | 'history' | 'profile';

export type ThemeMode = 'dark' | 'light';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  source?: 'manual' | 'qr';
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
};

export type AppData = {
  transactions: Transaction[];
  goals: Goal[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

