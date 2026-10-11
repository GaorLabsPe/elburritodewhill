import { BUSINESS_INFO } from '../data/menu';
import { CartItem, OrderCustomerInfo } from '../types';

export const formatCurrency = (amount: number): string => {
  return `S/ ${amount.toFixed(2)}`;
};

export const generateWhatsAppMessage = ({
  orderId,
  items,
  customer,
  subtotal,
  deliveryFee,
  discount,
  couponCode,
  tip,
  total,
}: {
  orderId: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  tip: number;
  total: number;
}): string => {
  const paymentNames: Record<string, string> = {
    yape: '📱 YAPE / PLIN (Al número 986 832 690)',
    plin: '💳 PLIN (Al número 986 832 690)',
    efectivo: '💵 Efectivo Contraentrega',
  };

  const lines: string[] = [];

  lines.push(`🔥 *¡HOLA EL BURRITO DE WHIL!* 🔥`);
  lines.push(`Deseo realizar el siguiente pedido:`);
  lines.push(``);
  lines.push(`🧾 *ORDEN #${orderId}*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

  items.forEach((item, index) => {
    lines.push(`*${index + 1}. ${item.quantity}x ${item.product.name}*`);
    if (item.selectedVariant) {
      lines.push(`   └ Combinación: _${item.selectedVariant}_`);
    }
    if (item.product.includesNativePotatoes) {
      lines.push(`   └ 🍟 _Incluye porción de Papas Nativas_`);
    }
    if (item.selectedSauces && item.selectedSauces.length > 0) {
      lines.push(`   └ Cremas: ${item.selectedSauces.join(', ')}`);
    }
    if (item.specialInstructions && item.specialInstructions.trim()) {
      lines.push(`   └ Nota: "${item.specialInstructions.trim()}"`);
    }
    lines.push(`   └ Subtotal: ${formatCurrency(item.totalUnitPrice * item.quantity)}`);
    lines.push(``);
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📊 *RESUMEN DE PAGO:*`);
  lines.push(`• Subtotal: ${formatCurrency(subtotal)}`);
  if (customer.deliveryType === 'delivery') {
    lines.push(`• Costo de Envío: ${deliveryFee > 0 ? formatCurrency(deliveryFee) : '¡GRATIS!'}`);
  } else {
    lines.push(`• Modalidad: Recojo en Local (S/ 0.00)`);
  }
  if (discount > 0) {
    lines.push(`• Descuento (${couponCode || 'Cupón'}): -${formatCurrency(discount)}`);
  }
  if (tip > 0) {
    lines.push(`• Propina al Repartidor: ${formatCurrency(tip)}`);
  }
  lines.push(`*💰 TOTAL A PAGAR: ${formatCurrency(total)}*`);
  lines.push(``);

  lines.push(`👤 *DATOS DEL CLIENTE:*`);
  lines.push(`• Nombre: ${customer.name}`);
  lines.push(`• Celular: ${customer.phone}`);
  if (customer.deliveryType === 'delivery') {
    lines.push(`• Dirección: ${customer.address}`);
    if (customer.reference && customer.reference.trim()) {
      lines.push(`• Referencia: ${customer.reference.trim()}`);
    }
  } else {
    lines.push(`• Modalidad: *Recojo en Local*`);
  }
  lines.push(`• Método de Pago: ${paymentNames[customer.paymentMethod] || customer.paymentMethod}`);
  if (customer.notes && customer.notes.trim()) {
    lines.push(`• Observaciones: ${customer.notes.trim()}`);
  }

  lines.push(``);
  if (customer.paymentMethod === 'yape' || customer.paymentMethod === 'plin') {
    lines.push(`📎 _Adjunto la captura del comprobante al número 986 832 690 a continuación._`);
  } else {
    lines.push(`💵 _Pago en efectivo al recibir el pedido._`);
  }
  lines.push(`¡Muchas gracias!`);

  return encodeURIComponent(lines.join('\n'));
};

export const getWhatsAppDirectUrl = (encodedText: string): string => {
  return `https://wa.me/51986832690?text=${encodedText}`;
};
