import { demoGoals, demoTransactions } from './demo-data';
import { isSupabaseConfigured, supabase } from './supabase';
import { AppData, AppUser, Goal, LoginInput, RegisterInput, ThemeMode, Transaction } from './types';

type LocalStoredUser = AppUser & {
  password: string;
};

const USERS_KEY = 'ajudacash:users';
const SESSION_KEY = 'ajudacash:session';
const WELCOME_KEY = 'ajudacash:welcome-seen';
const THEME_KEY = 'ajudacash:theme';
const VIBRATION_KEY = 'ajudacash:vibration';
const DATA_PREFIX = 'ajudacash:data:';

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const getUsers = () => readJson<LocalStoredUser[]>(USERS_KEY, []);

const saveUsers = (users: LocalStoredUser[]) => writeJson(USERS_KEY, users);

const getDataKey = (userId: string) => `${DATA_PREFIX}${userId}`;

const ensureLocalData = (userId: string): AppData => {
  const data = readJson<AppData | null>(getDataKey(userId), null);
  if (data) {
    return data;
  }

  const seeded = {
    transactions: demoTransactions(),
    goals: demoGoals(),
  };
  writeJson(getDataKey(userId), seeded);
  return seeded;
};

const saveLocalData = (userId: string, data: AppData) => {
  writeJson(getDataKey(userId), data);
};

const toAppUser = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AppUser => ({
  id: user.id,
  email: user.email ?? '',
  name: typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim().length > 0
    ? user.user_metadata.full_name
    : (user.email ?? 'Usuario'),
});

const getSupabaseDisplayName = async (user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<AppUser> => {
  const metadataName =
    typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';

  if (metadataName) {
    return {
      id: user.id,
      email: user.email ?? '',
      name: metadataName,
    };
  }

  if (!supabase) {
    return toAppUser(user);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && typeof data?.full_name === 'string' && data.full_name.trim().length > 0) {
      return {
        id: user.id,
        email: user.email ?? '',
        name: data.full_name.trim(),
      };
    }
  } catch {
    // Mantem fallback para nao bloquear o fluxo caso o perfil nao esteja disponivel.
  }

  return toAppUser(user);
};

export const getStoredTheme = (): ThemeMode => {
  const theme = readJson<ThemeMode | null>(THEME_KEY, null);
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }

  return 'dark';
};

export const saveTheme = (theme: ThemeMode) => {
  writeJson(THEME_KEY, theme);
};

export const getStoredVibration = () => readJson<boolean>(VIBRATION_KEY, false);

export const saveVibration = (enabled: boolean) => {
  writeJson(VIBRATION_KEY, enabled);
};

export const getWelcomeSeen = () => readJson<boolean>(WELCOME_KEY, false);

export const setWelcomeSeen = (seen: boolean) => {
  writeJson(WELCOME_KEY, seen);
};

const getLocalSessionUser = (): AppUser | null => readJson<AppUser | null>(SESSION_KEY, null);

const setLocalSessionUser = (user: AppUser | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (user) {
    writeJson(SESSION_KEY, user);
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};

const ensureLocalUserData = (user: AppUser) => {
  ensureLocalData(user.id);
  return user;
};

export const getCurrentUser = async (): Promise<AppUser | null> => {
  if (isSupabaseConfigured && supabase) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      return null;
    }

    return getSupabaseDisplayName(session.user);
  }

  return getLocalSessionUser();
};

export const subscribeToAuthChanges = (onChange: (user: AppUser | null) => void) => {
  if (!isSupabaseConfigured || !supabase) {
    return () => undefined;
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      onChange(null);
      return;
    }

    void getSupabaseDisplayName(session.user)
      .then(onChange)
      .catch(() => onChange(toAppUser(session.user)));
  });

  return () => subscription.unsubscribe();
};

export const login = async ({ email, password }: LoginInput): Promise<AppUser> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Nao foi possivel iniciar sessao.');
    }

    return getSupabaseDisplayName(data.user);
  }

  const user = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error('E-mail ou senha invalidos.');
  }

  const sessionUser: AppUser = { id: user.id, name: user.name, email: user.email };
  setLocalSessionUser(sessionUser);
  ensureLocalUserData(sessionUser);
  return sessionUser;
};

export const register = async ({ name, email, password }: RegisterInput): Promise<{ user: AppUser; needsEmailConfirmation: boolean }> => {
  const normalizedName = name.trim();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: normalizedName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Nao foi possivel criar a conta.');
    }

    const user = toAppUser({
      ...data.user,
      user_metadata: {
        ...data.user.user_metadata,
        full_name: normalizedName,
      },
    });

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        full_name: normalizedName,
        email,
      },
      { onConflict: 'id' },
    );

    if (profileError) {
      throw profileError;
    }

    return {
      user,
      needsEmailConfirmation: !data.session,
    };
  }

  const users = getUsers();
  const existingUser = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Ja existe uma conta com este e-mail.');
  }

  const user: LocalStoredUser = {
    id: generateId(),
    name: normalizedName,
    email,
    password,
  };

  saveUsers([...users, user]);

  const sessionUser: AppUser = { id: user.id, name: normalizedName, email };
  setLocalSessionUser(sessionUser);
  ensureLocalUserData(sessionUser);

  return {
    user: sessionUser,
    needsEmailConfirmation: false,
  };
};

export const logout = async () => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return;
  }

  setLocalSessionUser(null);
};

export const requestPasswordReset = async (email: string) => {
  if (!email.trim()) {
    throw new Error('Informe seu e-mail para recuperar a senha.');
  }

  if (isSupabaseConfigured && supabase) {
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return;
  }

  const user = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Nenhuma conta local encontrada com este e-mail.');
  }
};

export const loadUserData = async (userId: string): Promise<AppData> => {
  if (isSupabaseConfigured && supabase) {
    const [{ data: transactions, error: transactionsError }, { data: goals, error: goalsError }] = await Promise.all([
      supabase
        .from('transactions')
        .select('id, type, amount, category, description, date, source')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
      supabase
        .from('goals')
        .select('id, name, target_amount, current_amount, deadline, category')
        .eq('user_id', userId)
        .order('deadline', { ascending: true }),
    ]);

    if (transactionsError) {
      throw transactionsError;
    }

    if (goalsError) {
      throw goalsError;
    }

    return {
      transactions: (transactions ?? []).map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description ?? '',
        date: transaction.date,
        source: transaction.source ?? 'manual',
      })),
      goals: (goals ?? []).map((goal) => ({
        id: goal.id,
        name: goal.name,
        targetAmount: Number(goal.target_amount),
        currentAmount: Number(goal.current_amount),
        deadline: goal.deadline,
        category: goal.category,
      })),
    };
  }

  return ensureLocalData(userId);
};

export const createTransaction = async (userId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('transactions').insert({
      id: newTransaction.id,
      user_id: userId,
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      source: newTransaction.source ?? 'manual',
    });

    if (error) {
      throw error;
    }

    return newTransaction;
  }

  const data = ensureLocalData(userId);
  saveLocalData(userId, {
    ...data,
    transactions: [newTransaction, ...data.transactions],
  });

  return newTransaction;
};

export const createGoal = async (userId: string, goal: Omit<Goal, 'id' | 'currentAmount'>): Promise<Goal> => {
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    currentAmount: 0,
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('goals').insert({
      id: newGoal.id,
      user_id: userId,
      name: newGoal.name,
      target_amount: newGoal.targetAmount,
      current_amount: newGoal.currentAmount,
      deadline: newGoal.deadline,
      category: newGoal.category,
    });

    if (error) {
      throw error;
    }

    return newGoal;
  }

  const data = ensureLocalData(userId);
  saveLocalData(userId, {
    ...data,
    goals: [...data.goals, newGoal],
  });

  return newGoal;
};

export const updateGoalProgress = async (userId: string, goalId: string, amount: number): Promise<Goal> => {
  if (isSupabaseConfigured && supabase) {
    const { data: currentGoal, error: currentGoalError } = await supabase
      .from('goals')
      .select('id, name, target_amount, current_amount, deadline, category')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (currentGoalError) {
      throw currentGoalError;
    }

    const nextAmount = Number(currentGoal.current_amount) + amount;
    const { error: updateError } = await supabase
      .from('goals')
      .update({ current_amount: nextAmount })
      .eq('id', goalId)
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    return {
      id: currentGoal.id,
      name: currentGoal.name,
      targetAmount: Number(currentGoal.target_amount),
      currentAmount: nextAmount,
      deadline: currentGoal.deadline,
      category: currentGoal.category,
    };
  }

  const data = ensureLocalData(userId);
  const goal = data.goals.find((entry) => entry.id === goalId);
  if (!goal) {
    throw new Error('Meta nao encontrada.');
  }

  const updatedGoal = {
    ...goal,
    currentAmount: goal.currentAmount + amount,
  };

  saveLocalData(userId, {
    ...data,
    goals: data.goals.map((entry) => (entry.id === goalId ? updatedGoal : entry)),
  });

  return updatedGoal;
};

export const clearCachedAppState = (userId?: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(WELCOME_KEY);
  window.localStorage.removeItem(THEME_KEY);
  window.localStorage.removeItem(VIBRATION_KEY);
  if (!userId) {
    return;
  }

  if (!isSupabaseConfigured) {
    window.localStorage.removeItem(getDataKey(userId));
  }
};
