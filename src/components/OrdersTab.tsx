import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, generateWhatsAppMessage, getWhatsAppDirectUrl } from '../utils/whatsapp';
import { Clock, Send, CreditCard, ChevronRight, CheckCircle2, Bike, ChefHat, Sparkles } from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { orders, setActiveTab, setIsPaymentInfoModalOpen, showToast } = useApp();

  const handleResendToWhatsApp = (order: typeof orders[0]) => {
    const encodedMessage = generateWhatsAppMessage({
      orderId: order.id,
      items: order.items,
      customer: order.customer,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      couponCode: order.couponCode,
      tip: order.tip,
      total: order.total,
    });

    const waUrl = getWhatsAppDirectUrl(encodedMessage);
    window.open(waUrl, '_blank');
    showToast(`Reenviando Orden #${order.id} a WhatsApp`, 'info');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            Mis Pedidos
          </h2>
          <p className="text-xs text-slate-500">
            Historial de compras y seguimiento
          </p>
        </div>

        <button
          onClick={() => setIsPaymentInfoModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Datos de Pago</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-3 text-slate-400">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
            Aún no tienes pedidos registrados
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-5">
            Cuando realices una compra de nuestros burritos o hamburguesas, podrás consultarla y reenviarla desde aquí.
          </p>
          <button
            onClick={() => setActiveTab('inicio')}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            Explorar Menú
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const isEnCocina = order.status === 'En cocina';
            const isEnCamino = order.status === 'En camino';
            const isEntregado = order.status === 'Entregado';

            return (
              <div
                key={order.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-3.5"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-wide">
                      ORDEN #{order.id}
                    </span>
                    <p className="text-[11px] text-slate-400">{order.date}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isEntregado
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : isEnCamino
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {isEntregado && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isEnCamino && <Bike className="w-3.5 h-3.5" />}
                    {isEnCocina && <ChefHat className="w-3.5 h-3.5" />}
                    <span>{order.status}</span>
                  </span>
                </div>

                {/* Status Timeline Mini Track */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>En Cocina</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                    <Bike className="w-3.5 h-3.5" />
                    <span>En Camino</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Entregado</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">
                        {item.quantity}x {item.product.name}
                        {item.selectedVariant && (
                          <span className="text-red-500 text-[10px] ml-1">({item.selectedVariant})</span>
                        )}
                        {item.product.includesNativePotatoes && (
                          <span className="text-amber-500 text-[10px] ml-1 font-medium">🍟 +Papas Nativas</span>
                        )}
                      </span>
                      <span className="tabular-nums font-semibold shrink-0">
                        {formatCurrency(item.totalUnitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer Details & Total */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">
                      Entrega: <strong>{order.customer.deliveryType === 'delivery' ? order.customer.address : 'Recojo en local'}</strong>
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      Pago: {order.customer.paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total</span>
                    <span className="font-mono font-bold text-base text-red-600 dark:text-red-400 tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleResendToWhatsApp(order)}
                    className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reenviar a WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setIsPaymentInfoModalOpen(true)}
                    className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pago</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
