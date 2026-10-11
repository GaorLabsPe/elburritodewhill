import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/menu';
import { ProductCard } from './ProductCard';
import { Heart, Sparkles } from 'lucide-react';

export const FavoritesTab: React.FC = () => {
  const { favorites, setActiveTab } = useApp();

  const favoriteProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <span>Tus Favoritos</span>
          <Heart className="w-5 h-5 text-red-500 fill-current" />
        </h2>
        <p className="text-xs text-slate-500">
          Tus platillos preferidos guardados para pedir rápido
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
            No tienes favoritos guardados
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-5">
            Presiona el corazón en cualquier burrito, salchipapa o hamburguesa para tenerlo siempre a mano.
          </p>
          <button
            onClick={() => setActiveTab('explorar')}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            Explorar Menú
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
