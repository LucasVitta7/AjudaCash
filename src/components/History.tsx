import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Transaction } from '../lib/types';

interface HistoryProps {
  transactions: Transaction[];
}

export function History({ transactions }: HistoryProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

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
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  // Agrupar por data
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl mb-2">Histórico</h1>
        <p className="text-slate-400">Todas as suas transações</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <motion.button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" />
          Todas
        </motion.button>
        <motion.button
          onClick={() => setFilter('income')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            filter === 'income'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp className="w-4 h-4" />
          Receitas
        </motion.button>
        <motion.button
          onClick={() => setFilter('expense')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            filter === 'expense'
              ? 'bg-red-600 text-white'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingDown className="w-4 h-4" />
          Despesas
        </motion.button>
      </div>

      {/* Lista de Transações */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">Nenhuma transação encontrada</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h3 className="text-slate-400 text-sm">{formatDate(dayTransactions[0].date)}</h3>
              </div>
              
              <div className="space-y-3">
                {dayTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            transaction.type === 'income'
                              ? 'bg-emerald-500/20'
                              : 'bg-red-500/20'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white truncate">{transaction.category}</h4>
                            {transaction.source === 'qr' && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                                QR
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm truncate">
                            {transaction.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`${
                            transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}{' '}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
