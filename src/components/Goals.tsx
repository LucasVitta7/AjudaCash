import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Plus, TrendingUp, Calendar } from 'lucide-react';
import { Goal } from '../lib/types';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>;
  onUpdateGoal: (goalId: string, amount: number) => Promise<void>;
  onBack: () => void;
}

export function Goals({ goals, onAddGoal, onUpdateGoal, onBack }: GoalsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedTargetAmount = parseFloat(targetAmount);
    const parsedDeadline = new Date(deadline);

    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
      setFormError('Informe um valor alvo maior que zero.');
      return;
    }

    if (Number.isNaN(parsedDeadline.getTime())) {
      setFormError('Informe um prazo valido.');
      return;
    }

    if (parsedDeadline.getTime() < Date.now() - 86400000) {
      setFormError('Escolha uma data futura para a meta.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddGoal({
        name,
        targetAmount: parsedTargetAmount,
        deadline: parsedDeadline.toISOString(),
        category,
      });
      setName('');
      setTargetAmount('');
      setDeadline('');
      setCategory('');
      setShowAddForm(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Nao foi possivel criar a meta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (showAddForm) {
    return (
      <div className="px-6 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowAddForm(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl">Nova Meta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {formError}
            </div>
          )}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Nome da Meta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem de férias"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Valor Alvo</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Prazo</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Lazer">Lazer</option>
              <option value="Economia">Economia</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="relative w-full py-4 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 disabled:opacity-60"
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <span className="relative">{isSubmitting ? 'Criando...' : 'Criar Meta'}</span>
          </motion.button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Metas Financeiras</h1>
      </div>

      {/* Botão Adicionar */}
      <motion.button
        onClick={() => setShowAddForm(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 mb-6 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Nova Meta</span>
      </motion.button>

      {/* Lista de Metas */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">Nenhuma meta criada ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);

            return (
              <motion.div
                key={goal.id}
                className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-5 border border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white">{goal.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">{goal.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{daysRemaining} dias</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Progresso</span>
                    <span className="text-blue-400">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Atual</p>
                    <p className="text-white">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Meta</p>
                    <p className="text-white">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <motion.button
                  onClick={() => void onUpdateGoal(goal.id, 100)}
                  className="w-full mt-4 bg-blue-600/20 text-blue-400 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-blue-600/30 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Adicionar R$ 100</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
