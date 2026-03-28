import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../lib/types';

interface ReportsProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function Reports({ transactions, onBack }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cutoffDate = new Date();
  if (selectedPeriod === 'week') {
    cutoffDate.setDate(cutoffDate.getDate() - 7);
  } else if (selectedPeriod === 'month') {
    cutoffDate.setMonth(cutoffDate.getMonth() - 1);
  } else {
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
  }

  const filteredTransactions = transactions.filter((transaction) => new Date(transaction.date) >= cutoffDate);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const reportTypes = [
    {
      id: '1',
      title: 'Relatório Mensal',
      description: 'Resumo completo do mês atual',
      icon: Calendar,
      color: 'blue',
    },
    {
      id: '2',
      title: 'Análise de Categorias',
      description: 'Gastos detalhados por categoria',
      icon: TrendingDown,
      color: 'purple',
    },
    {
      id: '3',
      title: 'Evolução de Receitas',
      description: 'Histórico de receitas ao longo do tempo',
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      id: '4',
      title: 'Relatório Anual',
      description: 'Balanço completo do ano',
      icon: FileText,
      color: 'pink',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; ring: string }> = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/20' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500/20' },
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
      pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', ring: 'ring-pink-500/20' },
    };
    return colors[color] || colors.blue;
  };

  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice(`Arquivo ${filename} gerado com sucesso.`);
    window.setTimeout(() => setExportNotice(null), 2500);
  };

  const handleExportAll = () => {
    const payload = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      transactions: filteredTransactions,
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
    };

    triggerDownload(
      `ajudacash-relatorio-${selectedPeriod}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8',
    );
  };

  const handleExportReport = (reportTitle: string) => {
    const content = [
      `AjudaCash - ${reportTitle}`,
      `Periodo: ${selectedPeriod}`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      `Receitas: ${formatCurrency(totalIncome)}`,
      `Despesas: ${formatCurrency(totalExpense)}`,
      `Saldo: ${formatCurrency(balance)}`,
      '',
      `Transacoes analisadas: ${filteredTransactions.length}`,
    ].join('\n');

    triggerDownload(
      `${reportTitle.toLowerCase().replace(/\s+/g, '-')}.txt`,
      content,
      'text/plain;charset=utf-8',
    );
  };

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Relatórios</h1>
      </div>
      {exportNotice && (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {exportNotice}
        </div>
      )}

      {/* Período */}
      <div className="flex gap-3 mb-6">
        {(['week', 'month', 'year'] as const).map((period) => (
          <motion.button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              selectedPeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {period === 'week' && 'Semana'}
            {period === 'month' && 'Mês'}
            {period === 'year' && 'Ano'}
          </motion.button>
        ))}
      </div>

      {/* Resumo */}
      <motion.div
        className="app-accent-surface bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 text-sm">Resumo Financeiro</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="app-accent-subcard bg-blue-950/50 rounded-2xl p-3">
              <p className="text-slate-400 text-xs mb-1">Receitas</p>
              <p className="text-emerald-300 text-sm">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="app-accent-subcard bg-blue-950/50 rounded-2xl p-3">
              <p className="text-slate-400 text-xs mb-1">Despesas</p>
              <p className="text-red-300 text-sm">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="app-accent-subcard bg-blue-950/50 rounded-2xl p-3">
              <p className="text-slate-400 text-xs mb-1">Saldo</p>
              <p className={`text-sm ${balance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tipos de Relatórios */}
      <div className="mb-6">
        <h3 className="text-white mb-3">Relatórios Disponíveis</h3>
        <div className="space-y-3">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            const colors = getColorClasses(report.color);

            return (
              <motion.button
                key={report.id}
                onClick={() => handleExportReport(report.title)}
                className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  <div className="flex-1 text-left">
                    <h4 className="text-white mb-1">{report.title}</h4>
                    <p className="text-slate-400 text-sm">{report.description}</p>
                  </div>

                  <Download className="w-5 h-5 text-slate-500" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Exportar */}
      <motion.button
        onClick={handleExportAll}
        className="app-accent-action relative w-full py-4 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: [
            '0 0 0 rgba(37, 99, 235, 0)',
            '0 0 20px rgba(37, 99, 235, 0.3)',
            '0 0 0 rgba(37, 99, 235, 0)',
          ],
        }}
        transition={{ 
          opacity: { delay: 0.4 },
          y: { delay: 0.4 },
          boxShadow: { duration: 3, repeat: Infinity }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        <div className="relative flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          <span>Exportar Todos os Dados</span>
        </div>
      </motion.button>

      {/* Info */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <p className="text-blue-300 text-sm text-center">
          📊 Os relatórios podem ser exportados em PDF ou Excel
        </p>
      </div>
    </div>
  );
}
