import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/whatsapp';
import { Star, Heart, Plus, Minus, Sparkles } from 'lucide-react';
import { HOUSE_SAUCES } from '../data/menu';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    cart,
    addToCart,
    updateCartItemQty,
    isFavorite,
    toggleFavorite,
    setSelectedProductForDetail,
  } = useApp();

  const [imgError, setImgError] = useState(false);

  // Check if product is in cart and total quantity
  const itemsInCart = cart.filter((item) => item.product.id === product.id);
  const totalInCart = itemsInCart.reduce((sum, item) => sum + item.quantity, 0);

  const favorited = isFavorite(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open modal so the user can easily see details and customize their house sauces (cremas)
    setSelectedProductForDetail(product);
  };

  const handleQuickDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (itemsInCart.length > 0) {
      // decrease the first matching line
      updateCartItemQty(itemsInCart[0].id, -1);
    }
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-950/20 to-amber-950/20 text-center">
            <span className="text-2xl mb-1">🌯</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.name}</span>
          </div>
        )}

        {/* Gradient scrim at bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top left badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Top right Favorite Heart Button */}
        <button
          onClick={handleToggleFav}
          aria-label={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            favorited
              ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Banner: Includes Native Potatoes */}
        {product.includesNativePotatoes && (
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1 text-[10px] font-semibold text-amber-200 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">+ Papas Nativas Gratis</span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-2">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {product.name}
            </h3>
          </div>

          {!compact && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-0.5 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              {product.rating.toFixed(1)}
            </span>
            <span aria-hidden="true">·</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Precio</span>
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Quick Counter or Add Button */}
          {totalInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-red-600 text-white rounded-xl shadow-sm h-8 px-1"
            >
              <button
                onClick={handleQuickDecrement}
                aria-label="Restar una unidad"
                className="w-7 h-7 flex items-center justify-center hover:bg-red-700 rounded-lg transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs px-2 tabular-nums">{totalInCart}</span>
              <button
                onClick={handleQuickAdd}
                aria-label="Sumar una unidad"
                className="w-7 h-7 flex items-center justify-center hover:bg-red-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              aria-label={`Agregar ${product.name}`}
              className="h-8 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center gap-1 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
