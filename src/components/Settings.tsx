import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  Lock,
  Globe,
  Moon,
  Smartphone,
  CreditCard,
  Tag,
  FileText,
  HelpCircle,
  Info,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

type SettingsItem = {
  icon: LucideIcon;
  label: string;
  action?: () => void;
  badge?: string;
  value?: string;
  toggle?: boolean;
  enabled?: boolean;
  notice?: string;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

interface SettingsProps {
  onNavigate: (page: 'notifications' | 'categories') => void;
  onBack: () => void;
  theme: 'dark' | 'light';
  vibrationEnabled: boolean;
  onThemeToggle: () => void;
  onVibrationToggle: () => void;
  onClearCache: () => void;
  authMode: 'supabase' | 'local';
}

export function Settings({
  onNavigate,
  onBack,
  theme,
  vibrationEnabled,
  onThemeToggle,
  onVibrationToggle,
  onClearCache,
  authMode,
}: SettingsProps) {
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Preferências',
      items: [
        { icon: Bell, label: 'Notificações', badge: '3', action: () => onNavigate('notifications') },
        { icon: Globe, label: 'Idioma', value: 'Português (BR)', notice: 'Idioma definido como portugues do Brasil.' },
        { icon: Moon, label: 'Tema Escuro', toggle: true, enabled: theme === 'dark', action: onThemeToggle },
        { icon: Smartphone, label: 'Vibração', toggle: true, enabled: vibrationEnabled, action: onVibrationToggle },
      ],
    },
    {
      title: 'Conta',
      items: [
        { icon: Lock, label: 'Segurança e Privacidade', value: 'Em breve', notice: 'A area de seguranca avancada entra na proxima etapa.' },
        { icon: CreditCard, label: 'Métodos de Pagamento', value: 'Em breve', notice: 'Metodos de pagamento ainda nao foram integrados.' },
        { icon: Tag, label: 'Categorias Personalizadas', action: () => onNavigate('categories') },
      ],
    },
    {
      title: 'Outros',
      items: [
        { icon: FileText, label: 'Termos de Uso', value: 'Interno', notice: 'Os termos ainda nao possuem pagina dedicada.' },
        { icon: HelpCircle, label: 'Central de Ajuda', value: 'Interno', notice: 'Use Perfil > Ajuda ou siga para a proxima etapa do projeto.' },
        { icon: Info, label: 'Armazenamento', value: authMode === 'supabase' ? 'Supabase' : 'Local' },
      ],
    },
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
        <h1 className="text-white text-2xl">Configurações</h1>
      </div>
      {notice && (
        <div className="mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          {notice}
        </div>
      )}

      {/* Seções de Configurações */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="text-slate-400 text-sm mb-3 px-1">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.label}
                  onClick={item.action ?? (item.notice ? () => showNotice(item.notice as string) : undefined)}
                  className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.value && (
                      <span className="text-slate-400 text-sm">{item.value}</span>
                    )}
                    {item.toggle && (
                      <div
                        className={`w-12 h-6 rounded-full transition-colors ${
                          item.enabled ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full mt-0.5"
                          animate={{ x: item.enabled ? 26 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    )}
                    {!item.toggle && (
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Limpar Cache */}
      <motion.button
        onClick={onClearCache}
        className="w-full mt-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 hover:bg-red-500/20 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.98 }}
      >
        {authMode === 'supabase' ? 'Limpar preferencias locais' : 'Restaurar dados locais'}
      </motion.button>
    </div>
  );
}
