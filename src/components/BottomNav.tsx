import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Compass, ShoppingBag, Clock, Heart } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, favorites, orders } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badgeCount?: number }[] = [
    { id: 'inicio', label: 'Inicio', icon: ShoppingBag },
    { id: 'explorar', label: 'Explorar', icon: Compass },
    { id: 'favoritos', label: 'Favoritos', icon: Heart, badgeCount: favorites.length > 0 ? favorites.length : undefined },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-3 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive
                  ? 'text-red-600 dark:text-red-500 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badgeCount !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-600 dark:bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
