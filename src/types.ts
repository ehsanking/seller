export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export type ProductType = 'simple' | 'variable';

export interface ProductVariation {
  id: string;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  image?: string;
}

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
  gallery?: string[];
  tags?: string[];
  description?: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  
  // New features
  productType?: ProductType;
  variations?: ProductVariation[];
  isDownloadable?: boolean;
  downloadUrl?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refund_requested' | 'refunded';

export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
  sku?: string;
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
  cryptoCurrency?: string;
  cryptoTxHash?: string;
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

export type CustomerActivityType = 'order' | 'support_note' | 'status_change' | 'email_sent' | 'refund' | 'review' | 'account_created';

export interface CustomerActivity {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
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

export interface StoreBranch {
  id: string;
  name: string;
  nameFa?: string;
  address: string;
  addressFa?: string;
  phone: string;
  latitude: number;
  longitude: number;
  isMain: boolean;
}

export interface FactorSettings {
  companyName: string;
  economicCode?: string;
  nationalId?: string;
  registrationNumber?: string;
  taxId?: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  logoUrl?: string;
  headerTitle: string;
  accentColor: string;
  paperFormat: 'a4' | 'a5' | 'thermal';
  templateStyle: 'official' | 'modern' | 'minimal';
  showTax: boolean;
  showDiscount: boolean;
  showSku: boolean;
  showSignatureBox: boolean;
  showQrCode: boolean;
  showPaymentMethod: boolean;
  footerNote: string;
  termsAndConditions?: string;
  bankInfo?: string;
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
  branches?: StoreBranch[];
  theme?: 'light' | 'dark';
  factorSettings?: FactorSettings;
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

export interface EmailTemplate {
  id: string;
  key: 'order_confirmation' | 'shipping_update' | 'refund_confirmation' | 'customer_welcome' | 'admin_low_stock';
  name: string;
  category: 'transactional' | 'shipping' | 'billing' | 'admin';
  subject: string;
  senderName: string;
  senderEmail: string;
  isEnabled: boolean;
  bodyHtml: string;
  bodyText: string;
  lastUpdated: string;
}

export interface EmailDraft {
  id: string;
  orderId: string;
  orderNumber: string;
  templateKey: string;
  templateName: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  status: 'draft' | 'sent';
  sentAt?: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  encryption: 'none' | 'tls' | 'ssl';
  username: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  isConfigured: boolean;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'customer_insight'
  | 'wishlist'
  | 'analytics' 
  | 'shipping'
  | 'taxes'
  | 'reviews'
  | 'settings' 
  | 'branches'
  | 'plugins'
  | 'templates'
  | 'email_templates'
  | 'webhooks'
  | 'roles'
  | 'seo'
  | 'coupons'
  | 'builder'
  | 'telegram_mini_app'
  | 'daisyui'
  | `plugin_${string}`;

export interface StoreSection {
  id: string;
  name: string;
  enabled: boolean;
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'footer' | 'blog' | 'custom_page';
  settings?: Record<string, any>;
  props?: Record<string, any>; // Add props property to resolve TypeScript error
}

export type CustomerSegment = 'vip' | 'active' | 'at_risk' | 'lead';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  segment: CustomerSegment;
  leadScore: number;
  tags: string[];
  assignedAgent: string;
  notes?: string;
}

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface CrmDeal {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
}

export interface CrmTask {
  id: string;
  customerId?: string;
  customerName?: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  assignedTo: string;
  createdAt: string;
}

export interface CrmTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product?: Product;
}

export type ShippingMethodType = 'flat_rate' | 'free_shipping' | 'local_pickup' | 'weight_based';

export interface ShippingMethod {
  id: string;
  title: string;
  type: ShippingMethodType;
  cost: number;
  enabled: boolean;
  minOrderAmount?: number; // For free shipping trigger
  costPerKg?: number; // For weight based shipping
  estimatedDays?: string;
  description?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[]; // e.g. ["Domestic", "US", "CA", "EU", "Wildcard *"]
  postcodes?: string[];
  methods: ShippingMethod[];
}

export interface TaxRule {
  id: string;
  country: string; // "US", "CA", "EU", "*", etc.
  state?: string;
  postcode?: string;
  ratePercent: number;
  name: string; // e.g. "VAT 19%", "Sales Tax 7.5%"
  isCompound: boolean;
  priority: number;
}

export interface TaxClass {
  id: string;
  name: string; // "Standard", "Reduced Rate", "Zero Rate"
  slug: string; // "standard", "reduced-rate", "zero-rate"
  rules: TaxRule[];
}

export type ReviewStatus = 'approved' | 'pending' | 'spam' | 'trash';

export interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1 to 5
  reviewText: string;
  status: ReviewStatus;
  isVerifiedOwner: boolean;
  adminReply?: string;
  createdAt: string;
}

export interface SmartAlertRule {
  id: string;
  title: string;
  metric: 'sales_volume' | 'order_count' | 'conversion_rate' | 'refund_rate' | 'stock_anomaly';
  condition: 'above' | 'below' | 'anomaly_spike';
  thresholdValue: number;
  enabled: boolean;
  severity: 'info' | 'warning' | 'critical';
  lastTriggeredAt?: string;
}

export interface AnomalyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  metricName: string;
  detectedAt: string;
  aiRecommendation: string;
  resolved: boolean;
}

export interface AbTestExperiment {
  id: string;
  name: string;
  variantA: string;
  variantB: string;
  status: 'draft' | 'running' | 'completed';
  trafficSplitA: number;
  trafficSplitB: number;
  impressionsA: number;
  conversionsA: number;
  revenueA: number;
  impressionsB: number;
  conversionsB: number;
  revenueB: number;
  startDate: string;
  winner?: 'variantA' | 'variantB' | 'inconclusive';
  aiAnalysis?: {
    pValue: number;
    confidenceLevel: string;
    summary: string;
    recommendation: string;
    projectedRevenueGain: string;
  };
}

export interface AiDemandForecastItem {
  productId: string;
  productTitle: string;
  currentStock: number;
  monthlySalesRunRate: number;
  daysUntilStockout: number;
  suggestedReorderQuantity: number;
  reorderPriority: 'critical' | 'urgent' | 'optimal';
  seasonalTrendNote: string;
  confidenceScore: number;
}

export interface CustomerNotification {
  id: string;
  customerId?: string;
  title: string;
  message: string;
  type: 'order_status' | 'back_in_stock' | 'coupon' | 'ticket' | 'promo';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  badgeText?: string;
}




