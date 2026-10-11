import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 text-sm font-medium ${
              isSuccess
                ? 'bg-slate-900/95 text-white border-red-500/30 dark:bg-slate-900/95 dark:text-white'
                : isError
                ? 'bg-red-900/90 text-white border-red-400/40'
                : 'bg-slate-900/90 text-white border-slate-700/40'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
