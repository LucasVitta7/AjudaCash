import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginInput } from '../lib/types';

interface LoginProps {
  onLogin: (values: LoginInput) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onRegister: () => void;
  error: string | null;
  notice: string | null;
  isLoading: boolean;
  authMode: 'supabase' | 'local';
}

export function Login({ onLogin, onForgotPassword, onRegister, error, notice, isLoading, authMode }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onLogin({ email, password });
  };

  return (
    <div className="px-6 pb-6 flex flex-col h-full justify-center">
      {/* Logo e Título */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg relative overflow-hidden"
          animate={{
            boxShadow: [
              '0 0 20px rgba(37, 99, 235, 0.3)',
              '0 0 40px rgba(37, 99, 235, 0.5)',
              '0 0 20px rgba(37, 99, 235, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          <Wallet className="w-10 h-10 text-white relative z-10" />
        </motion.div>
        <h1 className="text-white text-3xl mb-2 text-center">AjudaCash</h1>
        <p className="text-slate-400 text-center">Controle suas finanças com inteligência</p>
      </motion.div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {notice && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
            {notice}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-slate-400 text-sm mb-2 block text-left">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isLoading}
              required
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-slate-400 text-sm mb-2 block text-left">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={() => void onForgotPassword(email)}
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            disabled={isLoading}
          >
            Esqueceu a senha?
          </button>
        </motion.div>

        <motion.button
          type="submit"
          className="relative w-full py-4 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 mt-6 shadow-lg disabled:opacity-60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <span className="relative text-center block">{isLoading ? 'Entrando...' : 'Entrar'}</span>
        </motion.button>
      </form>

      {/* Divisor */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-slate-600 text-sm text-center">ou</span>
        <div className="flex-1 h-px bg-slate-800" />
      </motion.div>

      {/* Botão de Registro */}
      <motion.button
        onClick={onRegister}
        className="w-full py-4 rounded-2xl text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all disabled:opacity-60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        <span className="text-center block">Criar uma conta</span>
      </motion.button>

      <div className="mt-8 space-y-2">
        <motion.p
          className="text-center text-slate-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Ao continuar, você concorda com nossos{' '}
          <span className="text-blue-400">Termos de Uso</span>
        </motion.p>
        <p className="text-center text-xs text-slate-500">
          {authMode === 'supabase' ? 'Autenticacao real com Supabase' : 'Modo local para desenvolvimento e demonstracao'}
        </p>
      </div>
    </div>
  );
}
