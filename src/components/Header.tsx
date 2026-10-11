import React from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/menu';
import { Home, Moon, Sun, ShoppingBag, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const { setCurrentScreen, isDarkMode, toggleDarkMode, cartCount, setIsCartDrawerOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Left: Return to Splash / Portada button */}
        <button
          onClick={() => setCurrentScreen('splash')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-800 shrink-0"
          title="Regresar a la Portada de Bienvenida"
        >
          <Home className="w-3.5 h-3.5 text-red-500" />
          <span className="hidden sm:inline">Portada</span>
        </button>

        {/* Center: Brand Wordmark */}
        <div className="flex items-center gap-2 overflow-hidden">
          <img
            src={BUSINESS_INFO.images.logo}
            alt="Logo"
            className="w-7 h-7 rounded-full object-cover shrink-0 border border-red-500/30"
          />
          <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            EL BURRITO DE <span className="text-red-500">WHIL</span>
          </h1>
        </div>

        {/* Right: Actions (Theme, WhatsApp, Cart) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            title="Chat directo WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          <button
            onClick={toggleDarkMode}
            aria-label="Cambiar modo oscuro"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label="Abrir canasta"
            title="Ver canasta de delivery"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
