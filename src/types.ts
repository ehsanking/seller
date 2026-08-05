export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  status: ProductStatus;
  salesCount: number;
  image: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  avgOrderValue: number;
  activeProducts: number;
  lowStockItems: number;
  chartData: {
    date: string;
    revenue: number;
    orders: number;
    profit: number;
  }[];
  topCategories: {
    category: string;
    sales: number;
    percentage: number;
  }[];
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  autoSyncInventory: boolean;
  notifyLowStock: boolean;
  lowStockThreshold: number;
  apiWebhookUrl: string;
  apiKey: string;
}

export interface Plugin {
  id: string;
  slug: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: 'payment' | 'shipping' | 'ai' | 'marketing' | 'custom';
  iconName: string;
  isInstalled: boolean;
  isActive: boolean;
  isCustom?: boolean;
  menuTitle?: string;
  config: Record<string, any>;
  hooks?: string[];
}

export type NavigationTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'analytics' 
  | 'settings' 
  | 'plugins'
  | `plugin_${string}`;

