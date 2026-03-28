import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

type NotificationFilter = 'Todas' | 'Não lidas' | 'Metas' | 'Alertas';

export function Notifications({ onBack }: NotificationsProps) {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('Todas');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      icon: CheckCircle,
      title: 'Meta Atingida!',
      message: 'Parabéns! Você atingiu 70% da sua meta "Fundo de Emergência"',
      time: '5 min atrás',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      icon: TrendingUp,
      title: 'Receita Adicionada',
      message: 'R$ 3.500,00 foi adicionado como Salário mensal',
      time: '2 horas atrás',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      icon: AlertCircle,
      title: 'Orçamento Excedido',
      message: 'Você gastou 120% do orçamento de Alimentação este mês',
      time: '1 dia atrás',
      read: false,
    },
    {
      id: '4',
      type: 'goal',
      icon: Target,
      title: 'Lembrete de Meta',
      message: 'Faltam 15 dias para o prazo da meta "Viagem para Europa"',
      time: '2 dias atrás',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      icon: Bell,
      title: 'Resumo Semanal',
      message: 'Confira seu resumo financeiro da semana',
      time: '3 dias atrás',
      read: true,
    },
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'warning':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'goal':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
      default:
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
    }
  };

  const filteredNotifications = useMemo(() => {
    switch (selectedFilter) {
      case 'Não lidas':
        return notifications.filter((notification) => !notification.read);
      case 'Metas':
        return notifications.filter((notification) => notification.type === 'goal');
      case 'Alertas':
        return notifications.filter((notification) => notification.type === 'warning');
      default:
        return notifications;
    }
  }, [notifications, selectedFilter]);

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Notificações</h1>
      </div>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {(['Todas', 'Não lidas', 'Metas', 'Alertas'] as const).map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {filter}
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => {
          const colors = getNotificationColor(notification.type);
          const Icon = notification.icon;

          return (
            <motion.div
              key={notification.id}
              className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border ${
                notification.read ? 'border-slate-800' : colors.border
              } relative`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
              )}

              <div className="flex gap-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`mb-1 ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-slate-600 text-xs">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={() =>
          setNotifications((currentNotifications) =>
            currentNotifications.map((notification) => ({ ...notification, read: true })),
          )
        }
        className="w-full mt-6 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl p-4 hover:border-slate-700 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        Marcar todas como lidas
      </motion.button>
    </div>
  );
}
