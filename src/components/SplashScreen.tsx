import React from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/menu';
import { UtensilsCrossed, Zap, ShieldCheck, Sparkles, Moon, Sun, ChevronRight, PhoneCall, Flame } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, setActiveTab, setQuickCategoryFilter, isDarkMode, toggleDarkMode } = useApp();

  const handleEnterCatalog = (category?: string) => {
    if (category) {
      setQuickCategoryFilter(category);
      setActiveTab('explorar');
    } else {
      setQuickCategoryFilter(null);
      setActiveTab('inicio');
    }
    setCurrentScreen('app');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Ambient background glow & atmospheric embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[-15%] w-[380px] h-[380px] bg-orange-600/15 rounded-full blur-[110px]" />
        {/* Subtle grid pattern for modern touch */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Bar on Splash */}
      <header className="relative z-10 w-full max-w-md mx-auto px-5 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            Abierto para Delivery
          </span>
        </div>

        <button
          onClick={toggleDarkMode}
          aria-label="Cambiar tema de color"
          className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>
      </header>

      {/* Center Hero & Brand Identity */}
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-6 flex flex-col items-center text-center">
        {/* Floating Logo Badge with gentle float and glow */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 shadow-2xl animate-glow-pulse">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 p-1 flex items-center justify-center">
              <img
                src={BUSINESS_INFO.images.logo}
                alt="Logotipo El Burrito de Whil"
                className="w-full h-full object-cover rounded-full animate-float-gentle"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="mt-4 mb-3">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase drop-shadow-md">
            EL BURRITO DE <span className="text-red-500">WHIL</span>
          </h1>
          <p className="mt-1 text-base sm:text-lg text-amber-400 font-medium italic tracking-wide">
            {BUSINESS_INFO.tagline}
          </p>
        </div>

        {/* Papa Nativa USP Highlight Box */}
        <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>¡Todos nuestros burritos vienen con papas nativas!</span>
        </div>

        {/* Central Floating Card with Glow and Action */}
        <div className="w-full p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl mb-4">
          <button
            onClick={() => handleEnterCatalog()}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-[0.98] transition-all text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 font-sans"
          >
            <span>INGRESAR AL CATÁLOGO</span>
            <ChevronRight className="w-5 h-5 text-white/90" />
          </button>

          {/* Quick Category Jump Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium mb-3 text-left">Accesos rápidos por categoría:</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'burritos', label: 'Burritos', icon: '🌯' },
                { id: 'salchipapas', label: 'Salchis', icon: '🍟' },
                { id: 'hamburguesas', label: 'Burgers', icon: '🍔' },
                { id: 'adicionales', label: 'Bebidas', icon: '🥤' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleEnterCatalog(cat.id)}
                  className="flex flex-col items-center p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 active:scale-95 transition-all"
                >
                  <span className="text-xl mb-1">{cat.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-300 truncate w-full text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Value Propositions Strip */}
        <div className="w-full grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <UtensilsCrossed className="w-4 h-4 mx-auto text-red-400 mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">Artesanal</p>
            <p className="text-[10px] text-slate-400">Parrilla y carbón</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <Zap className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">Delivery Rápido</p>
            <p className="text-[10px] text-slate-400">Directo y caliente</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <p className="text-[11px] font-semibold text-slate-200">Yape Directo</p>
            <p className="text-[10px] text-slate-400">986 832 690</p>
          </div>
        </div>
      </main>

      {/* Footer on Splash */}
      <footer className="relative z-10 w-full max-w-md mx-auto px-5 pb-6 pt-2 flex flex-col items-center text-center text-xs text-slate-400 gap-1.5">
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-3 rounded-full bg-slate-900/60 border border-slate-800"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span>Delivery directo al {BUSINESS_INFO.phoneDisplay}</span>
        </a>
        <p className="text-[11px] text-slate-500">Horario: {BUSINESS_INFO.schedule}</p>
      </footer>
    </div>
  );
};
