import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HOUSE_SAUCES } from '../data/menu';
import { formatCurrency } from '../utils/whatsapp';
import { X, Star, Sparkles, Check, Plus, Minus, Heart } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    isFavorite,
    toggleFavorite,
  } = useApp();

  const product = selectedProductForDetail;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedSauces, setSelectedSauces] = useState<string[]>([HOUSE_SAUCES[0], HOUSE_SAUCES[1]]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSpecialInstructions('');
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0].name);
      } else {
        setSelectedVariant('');
      }
      // default sauces
      setSelectedSauces([HOUSE_SAUCES[0], HOUSE_SAUCES[1]]);
    }
  }, [product]);

  if (!product) return null;

  const favorited = isFavorite(product.id);

  const toggleSauce = (sauce: string) => {
    setSelectedSauces((prev) =>
      prev.includes(sauce) ? prev.filter((s) => s !== sauce) : [...prev, sauce]
    );
  };

  const handleAdd = () => {
    addToCart({
      product,
      quantity,
      selectedVariant: selectedVariant || undefined,
      selectedSauces,
      specialInstructions: specialInstructions.trim() || undefined,
      totalUnitPrice: product.price,
    });
    setSelectedProductForDetail(null);
  };

  const total = product.price * quantity;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => setSelectedProductForDetail(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header Image Strip */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-slate-900">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedProductForDetail(null)}
            aria-label="Cerrar modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-label="Añadir a favoritos"
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              favorited ? 'bg-red-500 text-white' : 'bg-black/50 text-white/90 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Title inside Image Scrim */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-sans">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/80">
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                {product.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{product.reviewCount} valoraciones</span>
              <span>·</span>
              <span className="font-bold text-amber-300 tabular-nums">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Native Potatoes Callout */}
          {product.includesNativePotatoes && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>¡Beneficio exclusivo Whil!</strong> Este pedido incluye su porción generosa de papas nativas doradas sin costo adicional.
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Descripción
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Ingredientes frescos
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variants Selector (e.g. Burrito Mixto combinations) */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Elige tu combinación <span className="text-red-500">*</span>
                </h3>
                <span className="text-[11px] text-slate-500">Obligatorio</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant === variant.name;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{variant.name}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sauces Selection */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Cremas a elección
              </h3>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedSauces([...HOUSE_SAUCES])}
                  className="text-red-600 dark:text-red-400 hover:underline font-bold"
                >
                  Todas
                </button>
                <span className="text-slate-400">·</span>
                <button
                  type="button"
                  onClick={() => setSelectedSauces([])}
                  className="text-slate-500 hover:underline"
                >
                  Ninguna
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {HOUSE_SAUCES.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce);
                return (
                  <button
                    key={sauce}
                    onClick={() => toggleSauce(sauce)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-red-500/60 bg-red-50/40 dark:bg-red-950/20 text-slate-900 dark:text-white font-medium'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{sauce}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions Note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label
              htmlFor="special-instructions"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block mb-1.5"
            >
              Instrucciones especiales
            </label>
            <input
              id="special-instructions"
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej. Sin cebolla en pico de gallo, salsas bien separadas..."
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Modal Bottom Fixed CTA */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-12 px-2 shadow-sm shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Disminuir cantidad"
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-slate-900 dark:text-white tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar cantidad"
              className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-between px-4 shadow-lg shadow-red-600/20 transition-all"
          >
            <span>Agregar a la Canasta</span>
            <span className="tabular-nums font-mono text-base">{formatCurrency(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
