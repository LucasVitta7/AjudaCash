import { motion } from 'motion/react';
import { 
  Wallet, 
  Plus, 
  Scan, 
  Clock, 
  User, 
  BarChart3, 
  Target, 
  FileText,
  Tag,
  Settings,
  Bell,
  LogIn,
  ArrowRight
} from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  const features = [
    { icon: Wallet, label: 'Dashboard', color: 'text-blue-400', desc: 'Visão geral completa' },
    { icon: Plus, label: 'Transações', color: 'text-emerald-400', desc: 'Adicione facilmente' },
    { icon: Scan, label: 'Scanner QR', color: 'text-purple-400', desc: 'Cupons fiscais' },
    { icon: Clock, label: 'Histórico', color: 'text-pink-400', desc: 'Todas as movimentações' },
    { icon: BarChart3, label: 'Estatísticas', color: 'text-cyan-400', desc: 'Análises detalhadas' },
    { icon: Target, label: 'Metas', color: 'text-orange-400', desc: 'Objetivos financeiros' },
    { icon: FileText, label: 'Relatórios', color: 'text-green-400', desc: 'Exportação de dados' },
    { icon: Tag, label: 'Categorias', color: 'text-yellow-400', desc: 'Organize seus gastos' },
    { icon: Bell, label: 'Notificações', color: 'text-red-400', desc: 'Alertas importantes' },
    { icon: Settings, label: 'Configurações', color: 'text-slate-400', desc: 'Personalize o app' },
    { icon: User, label: 'Perfil', color: 'text-indigo-400', desc: 'Suas informações' },
    { icon: LogIn, label: 'Login', color: 'text-teal-400', desc: 'Acesso seguro' },
  ];

  return (
    <div className="px-6 pb-6 flex flex-col h-full justify-between">
      {/* Header */}
      <div className="text-center pt-8 mb-8">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: [
              '0 0 20px rgba(37, 99, 235, 0.3)',
              '0 0 60px rgba(37, 99, 235, 0.6)',
              '0 0 20px rgba(37, 99, 235, 0.3)',
            ],
          }}
          transition={{ 
            scale: { duration: 0.5 },
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <Wallet className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white text-3xl mb-3">AjudaCash</h1>
          <p className="text-slate-400 mb-2">Controle Financeiro Completo</p>
          <p className="text-slate-500 text-sm">12 páginas • Scanner QR • Metas • Relatórios</p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="flex-1 overflow-y-auto mb-6">
        <h3 className="text-white text-center mb-4">✨ Recursos Disponíveis ✨</h3>
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-3 border border-slate-800 flex flex-col items-center justify-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <span className="text-white text-xs text-center">{feature.label}</span>
                <span className="text-slate-500 text-[10px] text-center leading-tight">{feature.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="space-y-3">
        <motion.button
          onClick={onStart}
          className="relative w-full py-5 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: [
              '0 0 0 rgba(37, 99, 235, 0)',
              '0 0 30px rgba(37, 99, 235, 0.5)',
              '0 0 0 rgba(37, 99, 235, 0)',
            ],
          }}
          transition={{ 
            opacity: { delay: 0.8 },
            y: { delay: 0.8 },
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
            <span className="text-lg text-center">Começar Agora</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.button>

        <motion.p
          className="text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🚀 Explore todas as 12 páginas do aplicativo
        </motion.p>
      </div>
    </div>
  );
}