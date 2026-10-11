/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingCartBar } from './components/FloatingCartBar';
import { HomeTab } from './components/HomeTab';
import { ExploreTab } from './components/ExploreTab';
import { FavoritesTab } from './components/FavoritesTab';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentInfoModal } from './components/PaymentInfoModal';
import { ToastContainer } from './components/Toast';
import { DELIVERY_ZONES } from './data/menu';

const MainAppContent: React.FC = () => {
  const { currentScreen, activeTab, isCheckoutModalOpen, setIsCheckoutModalOpen, isDarkMode } = useApp();

  const [checkoutParams, setCheckoutParams] = useState<{
    deliveryType: 'delivery' | 'pickup';
    zoneId: string;
    deliveryFee: number;
    tip: number;
    discount: number;
    couponCode?: string;
  }>({
    deliveryType: 'delivery',
    zoneId: DELIVERY_ZONES[0].id,
    deliveryFee: DELIVERY_ZONES[0].price,
    tip: 2,
    discount: 0,
    couponCode: undefined,
  });

  const handleProceedToCheckout = (params: {
    deliveryType: 'delivery' | 'pickup';
    zoneId: string;
    deliveryFee: number;
    tip: number;
    discount: number;
    couponCode?: string;
  }) => {
    setCheckoutParams(params);
    setIsCheckoutModalOpen(true);
  };

  // If on Splash screen, show splash
  if (currentScreen === 'splash') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <ToastContainer />
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-red-600 selection:text-white">
      <ToastContainer />
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl mx-auto px-4 pt-4 pb-24">
        {activeTab === 'inicio' && <HomeTab />}
        {activeTab === 'explorar' && <ExploreTab />}
        {activeTab === 'favoritos' && <FavoritesTab />}
      </main>

      {/* Overlays & Modals */}
      <FloatingCartBar />
      <BottomNav />
      <ProductDetailModal />
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />
      {isCheckoutModalOpen && <CheckoutModal checkoutParams={checkoutParams} />}
      <PaymentInfoModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
