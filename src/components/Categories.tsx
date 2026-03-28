import { motion } from 'motion/react';
import { ArrowLeft, Tag, TrendingDown, Percent } from 'lucide-react';
import { Transaction } from '../lib/types';

interface CategoriesProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function Categories({ transactions, onBack }: CategoriesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular por categoria
  const categoryStats = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { total: 0, count: 0, type: t.type };
    }
    acc[t.category].total += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; type: 'income' | 'expense' }>);

  const totalAmount = Object.values(categoryStats).reduce((sum, cat) => sum + cat.total, 0);

  const sortedCategories = Object.entries(categoryStats)
    .map(([name, data]) => ({
      name,
      ...data,
      percentage: (data.total / totalAmount) * 100,
    }))
    .sort((a, b) => b.total - a.total);

  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/20' },
    { bg: 'bg-purple-500', text: 'text-purple-400', ring: 'ring-purple-500/20' },
    { bg: 'bg-pink-500', text: 'text-pink-400', ring: 'ring-pink-500/20' },
    { bg: 'bg-red-500', text: 'text-red-400', ring: 'ring-red-500/20' },
    { bg: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/20' },
    { bg: 'bg-yellow-500', text: 'text-yellow-400', ring: 'ring-yellow-500/20' },
    { bg: 'bg-green-500', text: 'text-green-400', ring: 'ring-green-500/20' },
    { bg: 'bg-teal-500', text: 'text-teal-400', ring: 'ring-teal-500/20' },
  ];

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Categorias</h1>
      </div>

      {/* Resumo */}
      <motion.div
        className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 text-sm">Total Categorizado</span>
          </div>
          <h2 className="text-white text-3xl mb-2">{formatCurrency(totalAmount)}</h2>
          <p className="text-blue-200 text-sm">{sortedCategories.length} categorias ativas</p>
        </div>
      </motion.div>

      {/* Lista de Categorias */}
      <div className="space-y-3">
        {sortedCategories.map((category, index) => {
          const colorScheme = colors[index % colors.length];
          
          return (
            <motion.div
              key={category.name}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${colorScheme.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Tag className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1">{category.name}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <TrendingDown className="w-3 h-3" />
                      <span>{category.count} transações</span>
                    </div>
                    <div className={`flex items-center gap-1 ${colorScheme.text}`}>
                      <Percent className="w-3 h-3" />
                      <span>{category.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`${category.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(category.total)}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {formatCurrency(category.total / category.count)}/média
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className={`h-full ${colorScheme.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
