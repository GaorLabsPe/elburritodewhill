import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_INFO } from '../data/menu';
import { PaymentMethod, OrderCustomerInfo } from '../types';
import { formatCurrency, generateWhatsAppMessage, getWhatsAppDirectUrl } from '../utils/whatsapp';
import { X, Send, Copy, Check, Smartphone, CreditCard, Banknote, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  checkoutParams: {
    deliveryType: 'delivery' | 'pickup';
    zoneId: string;
    deliveryFee: number;
    tip: number;
    discount: number;
    couponCode?: string;
  };
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ checkoutParams }) => {
  const {
    cart,
    cartSubtotal,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    createOrder,
    setActiveTab,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  if (!isCheckoutModalOpen) return null;

  const total = Math.max(0, cartSubtotal + checkoutParams.deliveryFee - checkoutParams.discount + checkoutParams.tip);

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`¡${label} copiado!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Por favor ingresa tu nombre completo', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Por favor ingresa tu número de celular o WhatsApp', 'error');
      return;
    }
    if (checkoutParams.deliveryType === 'delivery' && !address.trim()) {
      showToast('Por favor ingresa tu dirección de entrega', 'error');
      return;
    }

    const customer: OrderCustomerInfo = {
      name: name.trim(),
      phone: phone.trim(),
      address: checkoutParams.deliveryType === 'delivery' ? address.trim() : 'Recojo en local',
      reference: reference.trim(),
      deliveryType: checkoutParams.deliveryType,
      zoneId: checkoutParams.zoneId,
      paymentMethod,
      notes: notes.trim(),
    };

    // 1. Create order record
    const newOrder = createOrder({
      customer,
      deliveryFee: checkoutParams.deliveryFee,
      discount: checkoutParams.discount,
      couponCode: checkoutParams.couponCode,
      tip: checkoutParams.tip,
    });

    // 2. Build structured WhatsApp message
    const encodedMessage = generateWhatsAppMessage({
      orderId: newOrder.id,
      items: newOrder.items,
      customer,
      subtotal: newOrder.subtotal,
      deliveryFee: newOrder.deliveryFee,
      discount: newOrder.discount,
      couponCode: newOrder.couponCode,
      tip: newOrder.tip,
      total: newOrder.total,
    });

    const waUrl = getWhatsAppDirectUrl(encodedMessage);

    // 3. Set completed order for success modal
    setCompletedOrderNumber(newOrder.id);

    // 4. Open WhatsApp directly in new window/app
    window.open(waUrl, '_blank');
  };

  const handleFinishSuccess = () => {
    setIsCheckoutModalOpen(false);
    setCompletedOrderNumber(null);
    setActiveTab('inicio');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* If Order is already completed, show confirmation state */}
        {completedOrderNumber ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-red-500 tracking-wider">
                ¡Pedido Enviado a WhatsApp!
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ORDEN #{completedOrderNumber}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                Tu pedido ha sido generado y abierto en WhatsApp para confirmar directamente con el equipo de <strong>El Burrito de Whil</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Paso siguiente para agilizar tu pedido:
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                • Si elegiste Yape o BCP, adjunta la captura del comprobante en el chat de WhatsApp.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                • Te responderemos confirmando el tiempo exacto de entrega.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleFinishSuccess}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                <span>Aceptar y Volver al Menú</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout form */
          <form onSubmit={handleSubmitOrder} className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Datos de Entrega y Pago
                </h3>
                <p className="text-xs text-slate-500">
                  {checkoutParams.deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recojo en local'} • {formatCurrency(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                aria-label="Cerrar modal"
                className="w-8 h-8 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tus Datos de Contacto
                </h4>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1"
                  >
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1"
                  >
                    Celular / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 987 654 321"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address (if delivery) */}
              {checkoutParams.deliveryType === 'delivery' && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Dirección de Entrega
                  </h4>

                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1"
                    >
                      Dirección exacta <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej. Av. Los Rosales 432, Dpto 301"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-reference"
                      className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1"
                    >
                      Referencia de entrega
                    </label>
                    <input
                      id="checkout-reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej. Frente al parque, reja negra o tocar timbre 3"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Payment Methods Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Método de Pago
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Directo sin comisión
                  </span>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'yape'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
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
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Efectivo</span>
                  </button>
                </div>

                {/* Interactive Account Display */}
                {paymentMethod === 'yape' && (
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">
                        Yape / Plin al número
                      </span>
                      <span className="font-mono text-base font-extrabold text-purple-700 dark:text-purple-300">
                        {BUSINESS_INFO.yape.number}
                      </span>
                      <span className="block text-[11px] text-slate-600 dark:text-slate-400">
                        Titular: {BUSINESS_INFO.yape.holder}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BUSINESS_INFO.yape.numberRaw, 'Número Yape', 'checkout-yape')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'checkout-yape' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'checkout-yape' ? '¡Listo!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'efectivo' && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                    <p>
                      💵 <strong>Pago contraentrega:</strong> Pagas en efectivo al repartidor al recibir tu pedido. Se recomienda indicar si necesitas vuelto.
                    </p>
                  </div>
                )}
              </div>

              {/* Extra Notes */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label
                  htmlFor="checkout-notes"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1"
                >
                  Observaciones adicionales (Opcional)
                </label>
                <input
                  id="checkout-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Pago con billete de S/ 50, llamar al llegar..."
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Footer with Primary CTA */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-between px-4 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido a WhatsApp</span>
                </div>
                <span className="tabular-nums font-mono text-base">{formatCurrency(total)}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
