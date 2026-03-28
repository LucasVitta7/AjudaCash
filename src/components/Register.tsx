import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { RegisterInput } from '../lib/types';

interface RegisterProps {
  onRegister: (values: RegisterInput) => Promise<void>;
  onBackToLogin: () => void;
  error: string | null;
  notice: string | null;
  isLoading: boolean;
  authMode: 'supabase' | 'local';
}

export function Register({ onRegister, onBackToLogin, error, notice, isLoading, authMode }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword || !acceptTerms) {
      return;
    }
    await onRegister({ name, email, password });
  };

  return (
    <div className="px-6 pb-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBackToLogin}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Criar Conta</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {password && confirmPassword && password !== confirmPassword && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              As senhas precisam ser iguais.
            </div>
          )}
          {!acceptTerms && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              Aceite os termos para concluir o cadastro.
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-slate-400 text-sm mb-2 block text-left">Nome completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João Silva"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
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
            <label className="text-slate-400 text-sm mb-2 block text-left">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
                disabled={isLoading}
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-slate-400 text-sm mb-2 block text-left">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
                disabled={isLoading}
                required
                minLength={8}
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-slate-400 text-sm mb-2 block text-left">Confirmar senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
                disabled={isLoading}
                required
              />
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="button"
              onClick={() => setAcceptTerms(!acceptTerms)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                acceptTerms
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-slate-900 border-slate-700'
              }`}
              disabled={isLoading}
            >
              {acceptTerms && <Check className="w-4 h-4 text-white" />}
            </button>
            <p className="text-slate-400 text-sm text-left">
              Eu li e aceito os{' '}
              <span className="text-blue-400">
                Termos de Uso
              </span>{' '}
              e a{' '}
              <span className="text-blue-400">
                Política de Privacidade
              </span>
            </p>
          </motion.div>

          <motion.button
            type="submit"
            className="relative w-full py-5 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 mt-6 shadow-2xl disabled:opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: [
                '0 0 0 rgba(37, 99, 235, 0)',
                '0 0 30px rgba(37, 99, 235, 0.4)',
                '0 0 0 rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{ 
              opacity: { delay: 0.6 },
              y: { delay: 0.6 },
              boxShadow: { duration: 3, repeat: Infinity }
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            disabled={isLoading || password !== confirmPassword || !acceptTerms}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative block text-center text-lg">{isLoading ? 'Criando conta...' : 'Criar Conta'}</span>
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          className="text-center text-slate-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Já tem uma conta?{' '}
          <button
            onClick={onBackToLogin}
            className="text-blue-400 hover:text-blue-300"
            disabled={isLoading}
          >
            Entrar
          </button>
        </motion.p>
        <p className="text-center text-xs text-slate-500 mt-2">
          {authMode === 'supabase' ? 'Cadastro real com Supabase Auth' : 'Cadastro local para desenvolvimento e demonstracao'}
        </p>
      </div>
    </div>
  );
}
