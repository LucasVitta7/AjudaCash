import { Goal, Transaction } from './types';

export const demoTransactions = (): Transaction[] => [
  {
    id: 'seed-1',
    type: 'income',
    amount: 3500,
    category: 'Salario',
    description: 'Salario mensal',
    date: new Date().toISOString(),
    source: 'manual',
  },
  {
    id: 'seed-2',
    type: 'expense',
    amount: 150.5,
    category: 'Alimentacao',
    description: 'Supermercado',
    date: new Date(Date.now() - 86400000).toISOString(),
    source: 'qr',
  },
  {
    id: 'seed-3',
    type: 'expense',
    amount: 89.9,
    category: 'Transporte',
    description: 'Combustivel',
    date: new Date(Date.now() - 172800000).toISOString(),
    source: 'manual',
  },
  {
    id: 'seed-4',
    type: 'expense',
    amount: 45,
    category: 'Lazer',
    description: 'Cinema',
    date: new Date(Date.now() - 259200000).toISOString(),
    source: 'manual',
  },
  {
    id: 'seed-5',
    type: 'expense',
    amount: 200,
    category: 'Moradia',
    description: 'Condominio',
    date: new Date(Date.now() - 345600000).toISOString(),
    source: 'manual',
  },
];

export const demoGoals = (): Goal[] => [
  {
    id: 'goal-seed-1',
    name: 'Viagem para Europa',
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: new Date(Date.now() + 15552000000).toISOString(),
    category: 'Lazer',
  },
  {
    id: 'goal-seed-2',
    name: 'Fundo de Emergencia',
    targetAmount: 10000,
    currentAmount: 7200,
    deadline: new Date(Date.now() + 7776000000).toISOString(),
    category: 'Economia',
  },
];

