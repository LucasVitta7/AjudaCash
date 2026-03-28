import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Transaction } from '../lib/types';

interface AddTransactionProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  onBack: () => void;
  initialType?: 'income' | 'expense';
}

export function AddTransaction({ onAdd, onBack, initialType = 'expense' }: AddTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const title = type === 'income' ? 'Nova Receita' : 'Nova Despesa';
  const submitLabel = type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa';

  useEffect(() => {
    setType(initialType);
    setCategory('');
  }, [initialType]);

  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Bônus', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outros'],
  };

  // Função para formatar o valor como moeda
  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Converte para número e divide por 100 (centavos)
    const floatValue = parseFloat(numericValue) / 100;
    
    // Formata como moeda brasileira
    return floatValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para converter de volta para número
  const parseToNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return parseFloat(numericValue) / 100;
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    await onAdd({
      type,
      amount: parseToNumber(amount),
      category,
      description,
      date: new Date().toISOString(),
      source: 'manual',
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    onBack();
  };

  return (
    <div className="px-6 pb-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-white text-2xl">{title}</h1>
          <p className="text-sm text-slate-400">
            {type === 'income' ? 'Registre uma entrada de dinheiro.' : 'Registre um gasto do seu dia a dia.'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        {/* Tipo de Transação */}
        <div className="flex gap-3 mb-6">
          <motion.button
            type="button"
            onClick={() => setType('income')}
            className={`transaction-type-button flex-1 py-4 rounded-2xl transition-all text-center shadow-lg ${
              type === 'income'
                ? 'transaction-type-button-active bg-gradient-to-br from-emerald-600 to-emerald-700 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: type === 'income' ? 1 : 1.02 }}
          >
            <span className="block text-center">Receita</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setType('expense')}
            className={`transaction-type-button flex-1 py-4 rounded-2xl transition-all text-center shadow-lg ${
              type === 'expense'
                ? 'transaction-type-button-active bg-gradient-to-br from-red-600 to-red-700 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: type === 'expense' ? 1 : 1.02 }}
          >
            <span className="block text-center">Despesa</span>
          </motion.button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Valor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-slate-400 text-sm mb-3 block text-center">Valor</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0,00"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-20 pr-6 py-5 text-white text-center text-3xl placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
                required
              />
            </div>
          </motion.div>

          {/* Categoria */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-slate-400 text-sm mb-3 block text-center">Categoria</label>
            <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {categories[type].map((cat) => (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`transaction-category-button py-3 rounded-xl transition-all text-center shadow-md ${
                    category === cat
                      ? type === 'income'
                        ? 'transaction-category-button-active bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-emerald-500/30'
                        : 'transaction-category-button-active bg-gradient-to-br from-red-600 to-red-700 text-white shadow-red-500/30'
                      : 'bg-slate-900/80 backdrop-blur-sm text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: category === cat ? 1 : 1.02 }}
                >
                  <span className="block text-center">{cat}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-slate-400 text-sm mb-2 block text-center">Descrição (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição"
              className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl px-4 py-4 text-white text-center placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
            />
          </motion.div>

          {/* Botão Adicionar */}
          <motion.button
            type="submit"
            className={`transaction-submit-button relative w-full py-5 rounded-2xl text-white overflow-hidden shadow-2xl ${
              type === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                : 'bg-gradient-to-r from-red-600 to-red-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: [
                '0 0 0 rgba(16, 185, 129, 0)',
                `0 0 30px ${type === 'income' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`,
                '0 0 0 rgba(16, 185, 129, 0)',
              ],
            }}
            transition={{ 
              opacity: { delay: 0.4 },
              y: { delay: 0.4 },
              boxShadow: { duration: 3, repeat: Infinity }
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="text-center text-lg">{submitLabel}</span>
            </div>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
