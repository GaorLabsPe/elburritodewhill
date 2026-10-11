import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/menu';
import { X, Copy, Check, Smartphone } from 'lucide-react';

export const PaymentInfoModal: React.FC = () => {
  const { isPaymentInfoModalOpen, setIsPaymentInfoModalOpen, showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isPaymentInfoModalOpen) return null;

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`¡${label} copiado al portapapeles!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsPaymentInfoModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pago Directo al Número</h3>
              <p className="text-xs text-slate-500">Yape y Plin sin comisiones</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentInfoModalOpen(false)}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content with single clean phone number display */}
        <div className="p-5 space-y-4">
          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 block">
              Número Yape / Plin
            </span>
            <span className="font-mono text-3xl font-extrabold text-purple-700 dark:text-purple-300 tracking-wider block">
              {BUSINESS_INFO.yape.number}
            </span>
            <span className="block text-xs text-slate-600 dark:text-slate-300 pt-1">
              Titular: <strong>{BUSINESS_INFO.yape.holder}</strong>
            </span>
          </div>

          <button
            onClick={() => handleCopy(BUSINESS_INFO.yape.numberRaw, 'Número de Yape', 'modal-yape-num')}
            className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {copiedKey === 'modal-yape-num' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Copiado con éxito!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Número ({BUSINESS_INFO.yape.numberRaw})</span>
              </>
            )}
          </button>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <p>• Transfiere directamente desde tu app de <strong>Yape</strong> o <strong>Plin</strong>.</p>
            <p>• Adjunta la captura de tu comprobante en el chat de WhatsApp al realizar tu pedido.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => setIsPaymentInfoModalOpen(false)}
            className="w-full h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
