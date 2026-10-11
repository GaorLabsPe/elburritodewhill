import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/whatsapp';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartSubtotal, setIsCartDrawerOpen } = useApp();

  if (cartCount === 0) return null;

  return (
    <aside
      aria-label="Resumen flotante de carrito"
      className="fixed bottom-[72px] left-0 right-0 z-30 px-4 pointer-events-none"
    >
      <div className="max-w-md md:max-w-xl mx-auto pointer-events-auto">
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="w-full h-13 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-[0.99] text-white shadow-xl shadow-red-600/25 flex items-center justify-between transition-all"
        >
          {/* Left item counter */}
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs">
              {cartCount}
            </span>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-white/90">
                {cartCount === 1 ? '1 producto en canasta' : `${cartCount} productos en canasta`}
              </p>
              <p className="text-[11px] text-white/80">Toca para pedir por Delivery</p>
            </div>
          </div>

          {/* Right total amount & button */}
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="text-base tabular-nums">{formatCurrency(cartSubtotal)}</span>
            <div className="flex items-center gap-1 pl-2 border-l border-white/20 text-xs">
              <span>Ir a Canasta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};
