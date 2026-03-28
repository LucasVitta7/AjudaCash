import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, BarChart3, Target, FileText } from 'lucide-react';
import { Transaction } from '../lib/types';

interface HomeProps {
  userName: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  onNavigate: (page: 'statistics' | 'goals' | 'reports' | 'add') => void;
  onQuickAdd: (type: 'income' | 'expense') => void;
}

export function Home({ userName, balance, totalIncome, totalExpense, recentTransactions, onNavigate, onQuickAdd }: HomeProps) {
  const firstName = userName.trim().split(/\s+/)[0] || 'Usuário';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-400 mb-1">Olá,</p>
        <h1 className="text-white text-2xl">{firstName}, bem-vindo de volta.</h1>
      </div>

      {/* Saldo Principal */}
      <motion.div
        className="app-accent-surface bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 mb-6 relative overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="w-5 h-5 text-blue-300" />
            </motion.div>
            <span className="text-blue-200 text-sm">Saldo Total</span>
          </div>
          <h2 className="text-white text-4xl mb-4">{formatCurrency(balance)}</h2>
          
          <div className="flex gap-4">
            <motion.div 
              className="app-accent-subcard flex-1 bg-blue-950/50 rounded-2xl p-3 backdrop-blur-sm border border-blue-800/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 text-xs">Receitas</span>
              </div>
              <p className="text-emerald-300 text-sm">{formatCurrency(totalIncome)}</p>
            </motion.div>
            
            <motion.div 
              className="app-accent-subcard flex-1 bg-blue-950/50 rounded-2xl p-3 backdrop-blur-sm border border-blue-800/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1 mb-1">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
                <span className="text-slate-400 text-xs">Despesas</span>
              </div>
              <p className="text-red-300 text-sm">{formatCurrency(totalExpense)}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Ações Rápidas */}
      <div className="mb-6">
        <h3 className="text-white mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <motion.button
            onClick={() => onQuickAdd('income')}
            className="app-accent-action relative bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-4 overflow-hidden shadow-lg"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            animate={{
              boxShadow: [
                '0 0 0 rgba(16, 185, 129, 0)',
                '0 0 20px rgba(16, 185, 129, 0.3)',
                '0 0 0 rgba(16, 185, 129, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Adicionar Receita</span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onQuickAdd('expense')}
            className="app-accent-action relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-4 overflow-hidden shadow-lg"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            animate={{
              boxShadow: [
                '0 0 0 rgba(220, 38, 38, 0)',
                '0 0 20px rgba(220, 38, 38, 0.3)',
                '0 0 0 rgba(220, 38, 38, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span>Adicionar Despesa</span>
            </div>
          </motion.button>
        </div>
        
        {/* Ações Secundárias */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            onClick={() => onNavigate('statistics')}
            className="bg-slate-900/80 backdrop-blur-sm text-slate-300 rounded-xl p-3 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all flex flex-col items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BarChart3 className="w-5 h-5 mb-1 text-blue-400" />
            </motion.div>
            <span className="text-xs text-center">Estatísticas</span>
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate('goals')}
            className="bg-slate-900/80 backdrop-blur-sm text-slate-300 rounded-xl p-3 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-all flex flex-col items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-5 h-5 mb-1 text-purple-400" />
            </motion.div>
            <span className="text-xs text-center">Metas</span>
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate('reports')}
            className="bg-slate-900/80 backdrop-blur-sm text-slate-300 rounded-xl p-3 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition-all flex flex-col items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <FileText className="w-5 h-5 mb-1 text-emerald-400" />
            </motion.div>
            <span className="text-xs text-center">Relatórios</span>
          </motion.button>
        </div>
      </div>

      {/* Transações Recentes */}
      <div>
        <h3 className="text-white mb-3">Transações Recentes</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white">{transaction.category}</h4>
                    {transaction.source === 'qr' && (
                      <motion.span 
                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        QR
                      </motion.span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{transaction.description}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatDate(transaction.date)}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
