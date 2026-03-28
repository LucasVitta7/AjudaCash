import { ReactNode, useEffect, useState } from 'react';
import { AddTransaction } from './components/AddTransaction';
import { Categories } from './components/Categories';
import { Goals } from './components/Goals';
import { History } from './components/History';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { QRScanner } from './components/QRScanner';
import { Register } from './components/Register';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Statistics } from './components/Statistics';
import { Welcome } from './components/Welcome';
import {
  clearCachedAppState,
  createGoal,
  createTransaction,
  getCurrentUser,
  getStoredTheme,
  getStoredVibration,
  getWelcomeSeen,
  loadUserData,
  login,
  logout,
  requestPasswordReset,
  register,
  saveTheme,
  saveVibration,
  setWelcomeSeen,
  subscribeToAuthChanges,
  updateGoalProgress,
} from './lib/backend';
import { isSupabaseConfigured } from './lib/supabase';
import { AppPage, AppUser, Goal, LoginInput, RegisterInput, ThemeMode, Transaction } from './lib/types';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(() => !getWelcomeSeen());
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [vibrationEnabled, setVibrationEnabled] = useState(() => getStoredVibration());
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [showRegister, setShowRegister] = useState(false);
  const [pendingAddType, setPendingAddType] = useState<'income' | 'expense'>('expense');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);

  const balance = transactions.reduce((accumulator, transaction) => {
    return transaction.type === 'income'
      ? accumulator + transaction.amount
      : accumulator - transaction.amount;
  }, 0);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveVibration(vibrationEnabled);
  }, [vibrationEnabled]);

  useEffect(() => {
    const syncUserData = async (nextUser: AppUser | null) => {
      setUser(nextUser);
      setAuthError(null);

      if (!nextUser) {
        setTransactions([]);
        setGoals([]);
        setCurrentPage('home');
        return;
      }

      setIsDataLoading(true);
      try {
        const data = await loadUserData(nextUser.id);
        setTransactions(data.transactions);
        setGoals(data.goals);
      } catch (error) {
        setAppError(getErrorMessage(error));
      } finally {
        setIsDataLoading(false);
      }
    };

    const initialize = async () => {
      try {
        const currentUser = await getCurrentUser();
        await syncUserData(currentUser);
      } catch (error) {
        setAuthError(getErrorMessage(error));
      } finally {
        setIsInitializing(false);
      }
    };

    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      void syncUserData(nextUser);
    });

    void initialize();

    return unsubscribe;
  }, []);

  const handleStart = () => {
    setWelcomeSeen(true);
    setShowWelcome(false);
  };

  const handleLogin = async (values: LoginInput) => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      const nextUser = await login(values);
      const data = await loadUserData(nextUser.id);
      setUser(nextUser);
      setTransactions(data.transactions);
      setGoals(data.goals);
      setShowRegister(false);
      setCurrentPage('home');
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (values: RegisterInput) => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      const result = await register(values);
      setShowRegister(false);

      if (result.needsEmailConfirmation) {
        setAuthNotice('Conta criada. Verifique seu e-mail para confirmar o cadastro no Supabase.');
        return;
      }

      const data = await loadUserData(result.user.id);
      setUser(result.user);
      setTransactions(data.transactions);
      setGoals(data.goals);
      setCurrentPage('home');
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      await logout();
      setUser(null);
      setTransactions([]);
      setGoals([]);
      setCurrentPage('home');
    } catch (error) {
      setAppError(getErrorMessage(error));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthNotice(null);

    try {
      await requestPasswordReset(email);
      setAuthNotice(
        isSupabaseConfigured
          ? 'Enviamos as instrucoes de recuperacao para o seu e-mail.'
          : 'Modo local: use o mesmo e-mail e senha cadastrados para entrar.',
      );
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) {
      return;
    }

    setAppError(null);

    try {
      const newTransaction = await createTransaction(user.id, transaction);
      setTransactions((currentTransactions) => [newTransaction, ...currentTransactions]);
      setCurrentPage('home');
    } catch (error) {
      setAppError(getErrorMessage(error));
    }
  };

  const handleAddGoal = async (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    if (!user) {
      return;
    }

    setAppError(null);

    try {
      const newGoal = await createGoal(user.id, goal);
      setGoals((currentGoals) => [...currentGoals, newGoal]);
    } catch (error) {
      setAppError(getErrorMessage(error));
    }
  };

  const handleUpdateGoal = async (goalId: string, amount: number) => {
    if (!user) {
      return;
    }

    setAppError(null);

    try {
      const updatedGoal = await updateGoalProgress(user.id, goalId, amount);
      setGoals((currentGoals) =>
        currentGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal)),
      );
    } catch (error) {
      setAppError(getErrorMessage(error));
    }
  };

  const handleClearCache = async () => {
    clearCachedAppState(user?.id);
    setShowWelcome(true);
    setCurrentPage('home');

    if (!user || isSupabaseConfigured) {
      return;
    }

    try {
      const data = await loadUserData(user.id);
      setTransactions(data.transactions);
      setGoals(data.goals);
      setAuthNotice('Dados locais restaurados com sucesso.');
    } catch (error) {
      setAppError(getErrorMessage(error));
    }
  };

  const renderShell = (content: ReactNode, scrollable = true) => (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'app-shell app-shell-dark' : 'app-shell app-shell-light'}`}>
      <div className="ajudacash-app w-full max-w-md h-[812px] rounded-[3rem] shadow-2xl overflow-hidden relative border-8 app-phone-frame" data-theme={theme}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 app-notch rounded-b-3xl z-50" />
        <div className="h-full flex flex-col pt-8">
          <div className={scrollable ? 'flex-1 overflow-y-auto' : 'h-full'}>{content}</div>
        </div>
      </div>
    </div>
  );

  if (isInitializing) {
    return renderShell(
      <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        <p className="text-slate-400">Carregando AjudaCash...</p>
      </div>,
      false,
    );
  }

  if (showWelcome) {
    return renderShell(<Welcome onStart={handleStart} />, false);
  }

  if (!user) {
    if (showRegister) {
      return renderShell(
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => {
            setAuthError(null);
            setAuthNotice(null);
            setShowRegister(false);
          }}
          error={authError}
          notice={authNotice}
          isLoading={isAuthLoading}
          authMode={isSupabaseConfigured ? 'supabase' : 'local'}
        />,
      );
    }

    return renderShell(
      <Login
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        onRegister={() => {
          setAuthError(null);
          setAuthNotice(null);
          setShowRegister(true);
        }}
        error={authError}
        notice={authNotice}
        isLoading={isAuthLoading}
        authMode={isSupabaseConfigured ? 'supabase' : 'local'}
      />,
    );
  }

  return renderShell(
    <>
      {appError && (
        <div className="mx-6 mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {appError}
        </div>
      )}
      {authNotice && (
        <div className="mx-6 mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          {authNotice}
        </div>
      )}
      {isDataLoading ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <p className="text-slate-400">Sincronizando seus dados...</p>
        </div>
      ) : (
        <>
          {currentPage === 'home' && (
            <Home
              userName={user.name}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              recentTransactions={transactions.slice(0, 5)}
              onNavigate={setCurrentPage}
              onQuickAdd={(type) => {
                setPendingAddType(type);
                setCurrentPage('add');
              }}
            />
          )}
          {currentPage === 'add' && (
            <AddTransaction
              initialType={pendingAddType}
              onAdd={handleAddTransaction}
              onBack={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'qr' && (
            <QRScanner
              onScanComplete={handleAddTransaction}
              onBack={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'history' && <History transactions={transactions} />}
          {currentPage === 'profile' && (
            <Profile
              user={user}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              transactionCount={transactions.length}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'statistics' && (
            <Statistics
              transactions={transactions}
              onBack={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'goals' && (
            <Goals
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onBack={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'categories' && (
            <Categories
              transactions={transactions}
              onBack={() => setCurrentPage('settings')}
            />
          )}
          {currentPage === 'settings' && (
            <Settings
              onNavigate={setCurrentPage}
              onBack={() => setCurrentPage('profile')}
              theme={theme}
              vibrationEnabled={vibrationEnabled}
              onThemeToggle={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              onVibrationToggle={() => setVibrationEnabled((currentValue) => !currentValue)}
              onClearCache={handleClearCache}
              authMode={isSupabaseConfigured ? 'supabase' : 'local'}
            />
          )}
          {currentPage === 'notifications' && (
            <Notifications onBack={() => setCurrentPage('settings')} />
          )}
          {currentPage === 'reports' && (
            <Reports
              transactions={transactions}
              onBack={() => setCurrentPage('home')}
            />
          )}
        </>
      )}

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </>,
  );
}
