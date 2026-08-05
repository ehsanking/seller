export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  status: ProductStatus;
  salesCount: number;
  image: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
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

export type CustomerActivityType = 'order' | 'support_note' | 'status_change' | 'email_sent' | 'refund' | 'review';

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: CustomerActivityType;
  title: string;
  description: string;
  amount?: number;
  orderId?: string;
  author?: string;
  createdAt: string;
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
  // Store-wide SEO Meta Tags
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  keywords?: string;
  socialTwitterHandle?: string;
}

export interface Plugin {
  id: string;
  slug: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: 'payment' | 'shipping' | 'ai' | 'marketing' | 'security' | 'api' | 'analytics' | 'cdn' | 'custom';
  iconName: string;
  isInstalled: boolean;
  isActive: boolean;
  isCustom?: boolean;
  menuTitle?: string;
  config: Record<string, any>;
  hooks?: string[];
}

export interface StoreTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  framework: 'React' | 'Vue' | 'Bootstrap 5' | 'Next.js' | 'HTML5';
  author: string;
  version: string;
  isActive: boolean;
  previewImage?: string;
  isCustom?: boolean;
  repoUrl?: string;
  demoUrl?: string;
  features?: string[];
  templateCode?: string;
  cssCode?: string;
  cssVariables?: Record<string, string>;
}

export interface ApiEndpointHealth {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  avgLatencyMs: number;
  requestsPerMin: number;
  errorRatePercent: number;
  status: 'optimal' | 'warning' | 'degraded';
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  latencyMs: number;
  clientIp: string;
}

export interface ApiHealthMetrics {
  throughputReqMin: number;
  errorRatePercent: number;
  avgLatencyMs: number;
  rateLimit: {
    limitPerMin: number;
    currentUsed: number;
    remaining: number;
    resetSeconds: number;
    status: 'healthy' | 'throttled' | 'exceeded';
  };
  endpoints: ApiEndpointHealth[];
  recentLogs: ApiRequestLog[];
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export type WebhookEventType = 
  | 'order_placed'
  | 'order_status_updated'
  | 'stock_updated'
  | 'product_created'
  | 'payment_processed'
  | 'customer_created';

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  webhookName: string;
  url: string;
  event: WebhookEventType;
  statusCode: number;
  responseMs: number;
  requestPayload: Record<string, any>;
  responseBody: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  roleId: string;
  roleName: string;
  phoneNumber: string;
  bio: string;
  timezone: string;
  preferredLanguage: string;
  twoFactorEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  apiKey: string;
  createdAt: string;
  lastLoginAt: string;
}

export type PermissionType = 
  | 'view_dashboard'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_customers'
  | 'manage_analytics'
  | 'manage_plugins'
  | 'manage_templates'
  | 'manage_webhooks'
  | 'manage_settings'
  | 'manage_roles'
  | 'export_data'
  | 'api_access';

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: PermissionType[];
  userCount: number;
  color: string;
}

export interface SeoWebmasterSettings {
  siteTitle: string;
  titleTemplate: string;
  metaDescription: string;
  keywords: string[];
  googleSiteVerification: string;
  bingSiteVerification: string;
  indexNowApiKey: string;
  robotsTxtContent: string;
  enableAutoSitemap: boolean;
  sitemapUrl: string;
  organizationName: string;
  organizationLogo: string;
  defaultOgImage: string;
  canonicalUrl: string;
  twitterHandle: string;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'analytics' 
  | 'settings' 
  | 'plugins'
  | 'templates'
  | 'webhooks'
  | 'roles'
  | 'seo'
  | `plugin_${string}`;

export interface StoreSection {
  id: string;
  name: string;
  enabled: boolean;
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'footer';
  settings?: Record<string, any>;
}



