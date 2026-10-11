export type CategoryId = 'todos' | 'burritos' | 'salchipapas' | 'hamburguesas' | 'adicionales';

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  ingredients: string[];
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  includesNativePotatoes?: boolean;
  variants?: ProductVariant[];
  popular?: boolean;
}

export interface CartItem {
  id: string; // unique cart line id
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedSauces: string[];
  specialInstructions?: string;
  totalUnitPrice: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
}

export type PaymentMethod = 'yape' | 'bcp' | 'plin' | 'efectivo';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  address: string;
  reference: string;
  deliveryType: 'delivery' | 'pickup';
  zoneId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  customer: OrderCustomerInfo;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  tip: number;
  total: number;
  status: 'En cocina' | 'En camino' | 'Entregado';
}
