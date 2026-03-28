import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Scan, Check, AlertCircle } from 'lucide-react';
import { Transaction } from '../lib/types';

interface QRScannerProps {
  onScanComplete: (transaction: Omit<Transaction, 'id'>) => void;
  onBack: () => void;
}

export function QRScanner({ onScanComplete, onBack }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    amount: number;
    merchant: string;
    date: string;
  } | null>(null);

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simular escaneamento
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        amount: Math.random() * 200 + 20,
        merchant: ['Supermercado Extra', 'Posto Shell', 'Restaurante Sabor', 'Farmácia Popular'][Math.floor(Math.random() * 4)],
        date: new Date().toISOString(),
      });
    }, 2000);
  };

  const handleConfirm = () => {
    if (!scanResult) return;

    onScanComplete({
      type: 'expense',
      amount: scanResult.amount,
      category: 'Alimentação',
      description: scanResult.merchant,
      date: scanResult.date,
      source: 'qr',
    });

    setScanResult(null);
    onBack();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="px-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl">Escanear Cupom Fiscal</h1>
      </div>

      {/* Scanner Area */}
      <div className="mb-6">
        <motion.div
          className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-square border-2 border-slate-800"
          animate={{
            borderColor: isScanning ? ['#1e293b', '#3b82f6', '#1e293b'] : '#1e293b',
          }}
          transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
        >
          {/* Scanner Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-slate-700" />
              ))}
            </div>
          </div>

          {/* Scanner Beam */}
          {isScanning && (
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              animate={{ y: [0, 300, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Corner Markers */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

          {/* Center Icon */}
          {!isScanning && !scanResult && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Scan className="w-16 h-16 text-slate-600" />
            </div>
          )}

          {/* Success Icon */}
          {scanResult && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-emerald-500/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Check className="w-16 h-16 text-emerald-400" />
            </motion.div>
          )}
        </motion.div>

        <div className="mt-4 text-center">
          {!isScanning && !scanResult && (
            <p className="text-slate-400">Posicione o QR Code do cupom fiscal na área acima</p>
          )}
          {isScanning && (
            <p className="text-blue-400">Escaneando cupom fiscal...</p>
          )}
          {scanResult && (
            <p className="text-emerald-400">Cupom fiscal lido com sucesso!</p>
          )}
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <motion.div
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white mb-1">Dados do Cupom</h3>
              <p className="text-slate-400 text-sm">Verifique as informações antes de confirmar</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Estabelecimento</span>
              <span className="text-white">{scanResult.merchant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valor Total</span>
              <span className="text-white">{formatCurrency(scanResult.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data</span>
              <span className="text-white">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(scanResult.date))}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!scanResult ? (
          <motion.button
            onClick={simulateScan}
            disabled={isScanning}
            className="relative w-full py-4 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 disabled:opacity-50"
            whileTap={{ scale: isScanning ? 1 : 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 rgba(37, 99, 235, 0)',
                '0 0 20px rgba(37, 99, 235, 0.3)',
                '0 0 0 rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <div className="relative flex items-center justify-center gap-2">
              <Scan className="w-5 h-5" />
              <span>{isScanning ? 'Escaneando...' : 'Iniciar Escaneamento'}</span>
            </div>
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={handleConfirm}
              className="relative w-full py-4 rounded-2xl text-white overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700"
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 0 rgba(16, 185, 129, 0)',
                  '0 0 20px rgba(16, 185, 129, 0.3)',
                  '0 0 0 rgba(16, 185, 129, 0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              <div className="relative flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Confirmar Transação</span>
              </div>
            </motion.button>

            <button
              onClick={() => setScanResult(null)}
              className="w-full py-4 rounded-2xl text-slate-400 bg-slate-900 border border-slate-800"
            >
              Escanear Novamente
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <p className="text-blue-300 text-sm text-center">
          💡 Aponte a câmera para o QR Code localizado no rodapé do cupom fiscal
        </p>
      </div>
    </div>
  );
}
