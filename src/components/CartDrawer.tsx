import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO, COUPONS } from '../data/menu';
import { PaymentMethod, OrderCustomerInfo } from '../types';
import { formatCurrency, generateWhatsAppMessage, getWhatsAppDirectUrl } from '../utils/whatsapp';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  User,
  Phone,
  MapPin,
  Send,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  Banknote,
  Bike,
  PlusCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout?: (params: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = () => {
  const {
    cart,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    createOrder,
    setActiveTab,
    showToast,
  } = useApp();

  // Load saved customer data from localStorage for instant convenience
  const [name, setName] = useState(() => {
    return localStorage.getItem('whil_customer_name') || '';
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('whil_customer_phone') || '';
  });
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('whil_customer_address') || '';
  });
  const [reference, setReference] = useState(() => {
    return localStorage.getItem('whil_customer_reference') || '';
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');

  // Optional coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Form errors
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});

  if (!isCartDrawerOpen) return null;

  const deliveryFee = 0;

  let discount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const coupon = COUPONS[appliedCoupon];
    if (coupon.type === 'percent') {
      discount = (cartSubtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = Math.min(cartSubtotal, coupon.value);
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discount);

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`¡${label} copiado!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (COUPONS[clean]) {
      setAppliedCoupon(clean);
      showToast(`¡Cupón ${clean} aplicado!`, 'success');
    } else {
      showToast('Cupón no válido (prueba BURRITO10 o WHILPROMO)', 'error');
    }
  };

  const handleRealizarPedido = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: boolean; phone?: boolean; address?: boolean } = {};
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!address.trim()) newErrors.address = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Por favor completa tu nombre, teléfono y dirección de entrega', 'error');
      return;
    }

    setErrors({});

    // Save to localStorage for next time
    localStorage.setItem('whil_customer_name', name.trim());
    localStorage.setItem('whil_customer_phone', phone.trim());
    localStorage.setItem('whil_customer_address', address.trim());
    localStorage.setItem('whil_customer_reference', reference.trim());

    const customer: OrderCustomerInfo = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      reference: reference.trim(),
      deliveryType: 'delivery',
      zoneId: 'delivery',
      paymentMethod,
      notes: orderNotes.trim(),
    };

    // 1. Create order in history
    const newOrder = createOrder({
      customer,
      deliveryFee,
      discount,
      couponCode: appliedCoupon || undefined,
      tip: 0,
    });

    // 2. Generate WhatsApp message
    const encodedMessage = generateWhatsAppMessage({
      orderId: newOrder.id,
      items: newOrder.items,
      customer,
      subtotal: newOrder.subtotal,
      deliveryFee: newOrder.deliveryFee,
      discount: newOrder.discount,
      couponCode: newOrder.couponCode,
      tip: 0,
      total: newOrder.total,
    });

    const waUrl = getWhatsAppDirectUrl(encodedMessage);

    // 3. Open WhatsApp
    window.open(waUrl, '_blank');

    // 4. Close cart and show confirmation toast
    setIsCartDrawerOpen(false);
    showToast(`¡Orden #${newOrder.id} enviada a WhatsApp!`, 'success');
    setActiveTab('inicio');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Tu Canasta de Delivery
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {cart.length === 0 ? 'Vacía' : `${cart.length} ${cart.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('¿Deseas vaciar la canasta?')) clearCart();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Vaciar canasta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              aria-label="Cerrar canasta"
              className="w-8 h-8 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-3xl mb-4 text-red-500">
              🌯
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Tu canasta está vacía
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              Elige tus burritos con papas nativas, salchipapas o hamburguesas y personaliza tus cremas favoritas.
            </p>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
            >
              Ver Carta y Escoger Platillos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
            {/* 1. PRODUCTOS EN LA CANASTA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  1. Tus Productos Seleccionados
                </h3>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Agregar otro producto</span>
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 relative"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Eliminar ${item.product.name}`}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                          • {item.selectedVariant}
                        </p>
                      )}

                      {item.product.includesNativePotatoes && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Con Papas Nativas</span>
                        </p>
                      )}

                      {item.selectedSauces && item.selectedSauces.length > 0 && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          Cremas: <strong>{item.selectedSauces.join(', ')}</strong>
                        </p>
                      )}

                      {item.specialInstructions && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1">
                          Nota: "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-xs text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(item.totalUnitPrice * item.quantity)}
                      </span>

                      {/* Quantity pill */}
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-6 px-1">
                        <button
                          onClick={() => updateCartItemQty(item.id, -1)}
                          aria-label="Restar una unidad"
                          className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 tabular-nums text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQty(item.id, 1)}
                          aria-label="Sumar una unidad"
                          className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DATOS DE ENTREGA A DOMICILIO */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-red-500" />
                  <span>2. Datos para tu Delivery</span>
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Directo a tu puerta
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre y Apellido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    placeholder="Ej. Juan Pérez"
                    className={`w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none ${
                      errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-red-500 mt-0.5">Ingresa tu nombre para el pedido</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Teléfono / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
                    }}
                    placeholder="Ej. 987 654 321"
                    className={`w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-red-500 mt-0.5">Ingresa tu teléfono para coordinar la entrega</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Dirección exacta de entrega <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: false }));
                    }}
                    placeholder="Ej. Calle Los Cedros 123, Urb. Primavera"
                    className={`w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none ${
                      errors.address ? 'border-red-500 bg-red-50/20' : 'border-slate-200 dark:border-slate-700 focus:border-red-500'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-[10px] text-red-500 mt-0.5">Ingresa tu dirección de entrega</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Referencia de entrega (Opcional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ej. Frente a la bodega Don Pepe, casa de dos pisos puerta marrón"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* 3. MÉTODO DE PAGO */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <span>3. Método de Pago</span>
                </h3>
                <span className="text-[11px] text-slate-400">Sin comisiones</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('yape')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'yape'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Yape / Plin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Efectivo</span>
                </button>
              </div>

              {/* Payment Details with Quick Copy (Only Phone Number) */}
              {paymentMethod === 'yape' && (
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">
                      Yape / Plin al número
                    </span>
                    <span className="font-mono text-lg font-extrabold text-purple-700 dark:text-purple-300 tracking-wider">
                      {BUSINESS_INFO.yape.number}
                    </span>
                    <span className="block text-[11px] text-slate-600 dark:text-slate-400">
                      Titular: {BUSINESS_INFO.yape.holder}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(BUSINESS_INFO.yape.numberRaw, 'Número Yape', 'drawer-yape')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'drawer-yape' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'drawer-yape' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              )}

              {paymentMethod === 'efectivo' && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                  <p>
                    💵 <strong>Pago contraentrega:</strong> Pagas al repartidor en efectivo al recibir tu comida.
                  </p>
                </div>
              )}
            </div>

            {/* Optional Coupon Section */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                ¿Tienes un cupón?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {appliedCoupon} ({COUPONS[appliedCoupon]?.label})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponInput('');
                    }}
                    className="text-xs text-red-500 hover:underline font-semibold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Ej. BURRITO10 o WHILPROMO"
                    className="flex-1 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:normal-case focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}
            </div>

            {/* Summary Totals */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="tabular-nums font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Modalidad</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Delivery a Domicilio</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Descuento cupón</span>
                  <span className="tabular-nums">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Final a Pagar</span>
                <span className="tabular-nums text-lg text-red-600 dark:text-red-400 font-mono">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action CTA: Direct to WhatsApp */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={handleRealizarPedido}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-between px-5 shadow-xl shadow-emerald-600/30 transition-all font-sans"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-white" />
                <div className="text-left leading-tight">
                  <span className="block font-bold text-sm uppercase tracking-wide">
                    Realizar Pedido por WhatsApp
                  </span>
                  <span className="text-[11px] font-normal text-white/80">
                    Se abrirá el chat con tu orden lista
                  </span>
                </div>
              </div>
              <span className="tabular-nums font-mono text-base font-extrabold bg-black/20 px-2.5 py-1 rounded-lg">
                {formatCurrency(finalTotal)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
