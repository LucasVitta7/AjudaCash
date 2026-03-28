import { motion } from 'motion/react';
import {
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { AppUser } from '../lib/types';

type MenuItem = {
  icon: LucideIcon;
  label: string;
  badge?: string;
  danger?: boolean;
  action?: () => void;
  value?: string;
};

interface ProfileProps {
  user: AppUser;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  onNavigate: (page: 'settings') => void;
  onLogout: () => void;
}

export function Profile({ user, balance, totalIncome, totalExpense, transactionCount, onNavigate, onLogout }: ProfileProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const menuItems: MenuItem[] = [
    { icon: Bell, label: 'Notificações', badge: '3', action: () => onNavigate('settings') },
    { icon: Lock, label: 'Segurança e Privacidade', action: () => onNavigate('settings') },
    { icon: HelpCircle, label: 'Ajuda e Suporte', action: () => onNavigate('settings'), value: 'Em Configuracoes' },
    { icon: LogOut, label: 'Sair', danger: true, action: onLogout },
  ];

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl mb-2">Perfil</h1>
        <p className="text-slate-400">Suas informações e configurações</p>
      </div>

      {/* Perfil do Usuário */}
      <motion.div
        className="app-accent-surface bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl mb-1">{user.name}</h2>
            <p className="text-blue-200 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="app-accent-subcard relative z-10 bg-blue-950/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">Saldo Atual</span>
          </div>
          <p className="text-white text-2xl">{formatCurrency(balance)}</p>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-xs mb-1">Receitas</p>
          <p className="text-white text-sm">{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-slate-400 text-xs mb-1">Despesas</p>
          <p className="text-white text-sm">{formatCurrency(totalExpense)}</p>
        </motion.div>

        <motion.div
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
            <Receipt className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-slate-400 text-xs mb-1">Transações</p>
          <p className="text-white text-sm">{transactionCount}</p>
        </motion.div>
      </div>

      {/* Menu de Configurações */}
      <div>
        <h3 className="text-white mb-3">Configurações</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className={`w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors ${
                item.danger ? 'hover:border-red-500/50' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.danger
                      ? 'bg-red-500/20 group-hover:bg-red-500/30'
                      : 'bg-blue-500/20 group-hover:bg-blue-500/30'
                  } transition-colors`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      item.danger ? 'text-red-400' : 'text-blue-400'
                    }`}
                  />
                </div>
                <span
                  className={`${
                    item.danger ? 'text-red-400' : 'text-white'
                  } group-hover:text-opacity-80 transition-all`}
                >
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.value && !item.danger && (
                  <span className="text-xs text-slate-400">{item.value}</span>
                )}
                <ChevronRight
                  className={`w-5 h-5 ${
                    item.danger ? 'text-red-400' : 'text-slate-500'
                  } group-hover:translate-x-1 transition-transform`}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Versão */}
      <div className="mt-6 text-center">
        <p className="text-slate-600 text-sm">Versão 1.0.0</p>
      </div>
    </div>
  );
}
