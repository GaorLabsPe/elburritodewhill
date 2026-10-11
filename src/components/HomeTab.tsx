import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, PROMOTIONS, BUSINESS_INFO } from '../data/menu';
import { ProductCard } from './ProductCard';
import { Sparkles, ChevronLeft, ChevronRight, PhoneCall, Flame, ArrowRight } from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { setActiveTab, setQuickCategoryFilter, setIsPaymentInfoModalOpen } = useApp();

  // Carousel slider state
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % PROMOTIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const popularProducts = PRODUCTS.filter((p) => p.popular);
  const burritos = PRODUCTS.filter((p) => p.category === 'burritos');

  const categories = [
    { id: 'burritos', label: 'Burritos', count: PRODUCTS.filter((p) => p.category === 'burritos').length, emoji: '🌯' },
    { id: 'salchipapas', label: 'Salchipapas', count: PRODUCTS.filter((p) => p.category === 'salchipapas').length, emoji: '🍟' },
    { id: 'hamburguesas', label: 'Hamburguesas', count: PRODUCTS.filter((p) => p.category === 'hamburguesas').length, emoji: '🍔' },
    { id: 'adicionales', label: 'Adicionales', count: PRODUCTS.filter((p) => p.category === 'adicionales').length, emoji: '🥤' },
  ];

  const handleSelectCategory = (catId: string) => {
    setQuickCategoryFilter(catId);
    setActiveTab('explorar');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Interactive Promo Carousel */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div
          className="relative aspect-[16/8] sm:aspect-[16/7] w-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}
        >
          {PROMOTIONS.map((promo) => (
            <div key={promo.id} className="relative min-w-full h-full shrink-0">
              <img
                src={promo.image}
                alt={promo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-md bg-red-600 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <Flame className="w-3 h-3 text-white" />
                  {promo.badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold font-sans drop-shadow-sm leading-tight">
                  {promo.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 mt-0.5 font-normal">
                  {promo.subtitle}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">{promo.tag}</span>
                  <button
                    onClick={() => handleSelectCategory('burritos')}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-colors"
                  >
                    Pedir Ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentPromoIndex((prev) => (prev - 1 + PROMOTIONS.length) % PROMOTIONS.length)}
          aria-label="Promoción anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentPromoIndex((prev) => (prev + 1) % PROMOTIONS.length)}
          aria-label="Siguiente promoción"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {PROMOTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPromoIndex(i)}
              aria-label={`Ir a diapositiva ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentPromoIndex === i ? 'w-5 bg-red-500' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Papa Nativa USP Highlight Banner */}
      <section className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border border-amber-500/30 dark:border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl shrink-0">
            🍟
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>TODOS LOS BURRITOS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase">
                GRATIS
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
              Vienen acompañados con su generosa porción de papas nativas doradas crocantes.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid with Item Counts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Categorías
          </h3>
          <button
            onClick={() => {
              setQuickCategoryFilter(null);
              setActiveTab('explorar');
            }}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>Ver todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-red-500/50 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                {cat.emoji}
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block truncate">
                  {cat.label}
                </span>
                <span className="text-[11px] text-slate-400 block">{cat.count} opciones</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Popular Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Más Pedidos de la Parrilla</span>
              <Flame className="w-4 h-4 text-red-500" />
            </h3>
            <p className="text-xs text-slate-500">Los favoritos de nuestros clientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Specialized Burritos Showcase */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Burritos Artesanales
            </h3>
            <p className="text-xs text-slate-500">Con tortilla suave y papas nativas</p>
          </div>
          <button
            onClick={() => handleSelectCategory('burritos')}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
          >
            Ver todos ({burritos.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {burritos.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Direct Contact & Payment Info Card */}
      <section className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            ¿Deseas pagar con Yape o Plin al número?
          </span>
          <p className="text-xs text-slate-500">
            Aceptamos Yape directo al 986 832 690 y efectivo contraentrega.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPaymentInfoModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
          >
            Ver Cuentas
          </button>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
