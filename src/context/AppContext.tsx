import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderRecord, OrderCustomerInfo } from '../types';

export type ScreenMode = 'splash' | 'app';
export type ActiveTab = 'inicio' | 'explorar' | 'favoritos';

interface ToastData {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentScreen: ScreenMode;
  setCurrentScreen: (screen: ScreenMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItemQty: (id: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  orders: OrderRecord[];
  createOrder: (orderData: {
    customer: OrderCustomerInfo;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    tip: number;
  }) => OrderRecord;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isPaymentInfoModalOpen: boolean;
  setIsPaymentInfoModalOpen: (open: boolean) => void;
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  quickCategoryFilter: string | null;
  setQuickCategoryFilter: (cat: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('whil_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('whil_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('splash');
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [quickCategoryFilter, setQuickCategoryFilter] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('whil_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('whil_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalUnitPrice * item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      // Find matching item by product id + variant + sauces
      const saucesKey = [...newItem.selectedSauces].sort().join(',');
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === newItem.product.id &&
          i.selectedVariant === newItem.selectedVariant &&
          [...i.selectedSauces].sort().join(',') === saucesKey &&
          i.specialInstructions === newItem.specialInstructions
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      const id = `${newItem.product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      return [...prev, { ...newItem, id }];
    });

    showToast(`¡${newItem.product.name} agregado al carrito!`, 'success');
  };

  const updateCartItemQty = (id: string, deltaOrValue: number, isAbsolute = false) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = isAbsolute ? deltaOrValue : item.quantity + deltaOrValue;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Producto eliminado del pedido', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('whil_favorites');
        return saved ? JSON.parse(saved) : ['burrito-carne', 'burrito-mixto', 'salchi-mixta'];
      } catch {
        return ['burrito-carne', 'burrito-mixto'];
      }
    }
    return ['burrito-carne', 'burrito-mixto'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('whil_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de favoritos', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('¡Guardado en tus favoritos!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Orders history
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('whil_orders');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('whil_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const createOrder = (orderData: {
    customer: OrderCustomerInfo;
    deliveryFee: number;
    discount: number;
    couponCode?: string;
    tip: number;
  }): OrderRecord => {
    const timestamp = Date.now();
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const id = `WHIL-${orderNumber}`;
    const date = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));

    const total = Math.max(0, cartSubtotal + orderData.deliveryFee - orderData.discount + orderData.tip);

    const newOrder: OrderRecord = {
      id,
      date,
      timestamp,
      items: [...cart],
      customer: orderData.customer,
      subtotal: cartSubtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      couponCode: orderData.couponCode,
      tip: orderData.tip,
      total,
      status: 'En cocina',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Modals state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isPaymentInfoModalOpen, setIsPaymentInfoModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        isFavorite,
        orders,
        createOrder,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isPaymentInfoModalOpen,
        setIsPaymentInfoModalOpen,
        toasts,
        showToast,
        quickCategoryFilter,
        setQuickCategoryFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
