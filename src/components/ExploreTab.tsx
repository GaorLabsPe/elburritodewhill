import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/menu';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CategoryId } from '../types';

export const ExploreTab: React.FC = () => {
  const { quickCategoryFilter, setQuickCategoryFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [onlyNativePotatoes, setOnlyNativePotatoes] = useState(false);

  // Sync quick category filter from other tabs or splash
  useEffect(() => {
    if (quickCategoryFilter) {
      setSelectedCategory(quickCategoryFilter as CategoryId);
      setQuickCategoryFilter(null);
    }
  }, [quickCategoryFilter, setQuickCategoryFilter]);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'burritos', label: 'Burritos' },
    { id: 'salchipapas', label: 'Salchipapas' },
    { id: 'hamburguesas', label: 'Hamburguesas' },
    { id: 'adicionales', label: 'Adicionales & Bebidas' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
        return false;
      }

      // Native potatoes filter
      if (onlyNativePotatoes && !product.includesNativePotatoes) {
        return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesIng = product.ingredients.some((i) => i.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesIng;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular first
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, onlyNativePotatoes]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSortBy('popular');
    setOnlyNativePotatoes(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Search Header */}
      <div>
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Explorar Catálogo
        </h2>
        <p className="text-xs text-slate-500">
          Encuentra tu burrito, salchipapa o burger favorita
        </p>
      </div>

      {/* Real-time Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre o ingrediente (ej. carne, chorizo, alitas...)"
          className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-red-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Limpiar búsqueda"
            className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center absolute right-3 top-2.5 hover:text-slate-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Tabs (horizontal scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sort & Native Potatoes Quick Switch */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        {/* Toggle Papas Nativas */}
        <button
          onClick={() => setOnlyNativePotatoes((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
            onlyNativePotatoes
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Con Papas Nativas</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-red-500"
          >
            <option value="popular">Más pedidos</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>
      </div>

      {/* Products Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>{filteredProducts.length} productos encontrados</span>
        {(searchQuery || selectedCategory !== 'todos' || onlyNativePotatoes) && (
          <button
            onClick={handleResetFilters}
            className="text-red-500 hover:underline font-semibold"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            No se encontraron productos
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Intenta con otro término o limpia los filtros para ver la carta completa.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
