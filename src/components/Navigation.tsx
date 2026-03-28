import { motion } from 'motion/react';
import { Home, Plus, Scan, Clock, User } from 'lucide-react';
import { AppPage, NavigationPage } from '../lib/types';

interface NavigationProps {
  currentPage: AppPage;
  onNavigate: (page: NavigationPage) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Início' },
    { id: 'history' as const, icon: Clock, label: 'Histórico' },
    { id: 'qr' as const, icon: Scan, label: 'Scanner', center: true },
    { id: 'add' as const, icon: Plus, label: 'Adicionar' },
    { id: 'profile' as const, icon: User, label: 'Perfil' },
  ];

  return (
    <div className="relative px-4 pb-6 pt-2">
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 px-2 py-2 flex items-center justify-around relative">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          
          if (item.center) {
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -mt-6"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 4px 20px rgba(37, 99, 235, 0.3)',
                      '0 4px 30px rgba(37, 99, 235, 0.5)',
                      '0 4px 20px rgba(37, 99, 235, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </motion.div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 py-1.5 min-w-[56px]"
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative flex items-center justify-center">
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-500'
                  }`}
                />
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
              <span
                className={`text-[10px] transition-colors text-center leading-tight ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
