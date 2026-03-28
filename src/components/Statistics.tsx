import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { Transaction } from '../lib/types';

interface StatisticsProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function Statistics({ transactions, onBack }: StatisticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular gastos por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpense = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  const categoryData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpense) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500'];

  // Estatísticas do mês
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Estatísticas</h1>
      </div>

      {/* Resumo Financeiro */}
      <motion.div
        className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 text-sm">Resumo do Mês</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 text-xs">Receitas</span>
              </div>
              <p className="text-white text-xl">{formatCurrency(totalIncome)}</p>
            </div>

            <div className="bg-blue-950/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-slate-400 text-xs">Despesas</span>
              </div>
              <p className="text-white text-xl">{formatCurrency(totalExpense)}</p>
            </div>

            <div className="bg-blue-950/50 rounded-2xl p-4">
              <span className="text-slate-400 text-xs block mb-2">Saldo</span>
              <p className={`text-xl ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="bg-blue-950/50 rounded-2xl p-4">
              <span className="text-slate-400 text-xs block mb-2">Taxa de Economia</span>
              <p className="text-white text-xl">{savingsRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gastos por Categoria */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-slate-400" />
          <h3 className="text-white">Despesas por Categoria</h3>
        </div>

        <div className="space-y-4">
          {categoryData.map((item, index) => (
            <motion.div
              key={item.category}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-white">{item.category}</span>
                </div>
                <span className="text-slate-400 text-sm">{item.percentage.toFixed(1)}%</span>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${colors[index % colors.length]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  />
                </div>
                <p className="text-white">{formatCurrency(item.amount)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Média Diária */}
      <motion.div
        className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-white mb-3">Médias</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Gasto Diário</p>
            <p className="text-white">{formatCurrency(totalExpense / 30)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Transações</p>
            <p className="text-white">{transactions.length} no total</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
