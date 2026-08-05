import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Request Telemetry Metrics Store
interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  latencyMs: number;
  clientIp: string;
}

let apiTelemetryLogs: ApiLogEntry[] = [
  { id: 'log_p1', timestamp: new Date().toISOString(), method: 'GET', path: '/api/products', statusCode: 200, latencyMs: 18, clientIp: '127.0.0.1' },
  { id: 'log_p2', timestamp: new Date(Date.now() - 5000).toISOString(), method: 'GET', path: '/api/orders', statusCode: 200, latencyMs: 24, clientIp: '127.0.0.1' },
  { id: 'log_p3', timestamp: new Date(Date.now() - 12000).toISOString(), method: 'POST', path: '/api/webhooks', statusCode: 201, latencyMs: 35, clientIp: '127.0.0.1' },
  { id: 'log_p4', timestamp: new Date(Date.now() - 25000).toISOString(), method: 'GET', path: '/api/analytics', statusCode: 200, latencyMs: 62, clientIp: '127.0.0.1' },
  { id: 'log_p5', timestamp: new Date(Date.now() - 40000).toISOString(), method: 'PUT', path: '/api/settings', statusCode: 200, latencyMs: 28, clientIp: '127.0.0.1' },
];

let requestCounterWindow = 142; // Baseline throughput per min

// Telemetry Express Middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const start = Date.now();
    res.on('finish', () => {
      const latencyMs = Date.now() - start;
      requestCounterWindow++;
      apiTelemetryLogs.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        latencyMs,
        clientIp: req.ip || '127.0.0.1'
      });
      if (apiTelemetryLogs.length > 25) {
        apiTelemetryLogs.pop();
      }
    });
  }
  next();
});

// In-Memory Database Store for Seller Portal
let products = [
  {
    id: 'prod_1',
    sku: 'SLR-1001',
    title: 'Wireless Ergonomic Mechanical Keyboard',
    category: 'Electronics',
    price: 129.99,
    costPrice: 65.00,
    stockQuantity: 42,
    lowStockThreshold: 15,
    status: 'active',
    salesCount: 184,
    image: '/src/assets/images/store_product_asset_1785936700399.jpg',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod_2',
    sku: 'SLR-1002',
    title: 'Ultra-Precision Wireless Gaming Mouse',
    category: 'Electronics',
    price: 79.50,
    costPrice: 32.00,
    stockQuantity: 18,
    lowStockThreshold: 20,
    status: 'active',
    salesCount: 290,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-18'
  },
  {
    id: 'prod_3',
    sku: 'SLR-1003',
    title: 'Noise-Canceling Studio Headphones',
    category: 'Audio',
    price: 199.00,
    costPrice: 90.00,
    stockQuantity: 5,
    lowStockThreshold: 10,
    status: 'active',
    salesCount: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-01'
  },
  {
    id: 'prod_4',
    sku: 'SLR-1004',
    title: 'Minimalist Aluminum Laptop Stand',
    category: 'Accessories',
    price: 45.00,
    costPrice: 18.00,
    stockQuantity: 0,
    lowStockThreshold: 10,
    status: 'out_of_stock',
    salesCount: 410,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-10'
  },
  {
    id: 'prod_5',
    sku: 'SLR-1005',
    title: 'USB-C Multi-Port Hub (8-in-1)',
    category: 'Accessories',
    price: 59.99,
    costPrice: 22.00,
    stockQuantity: 88,
    status: 'active',
    salesCount: 310,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-02-14'
  },
  {
    id: 'prod_6',
    sku: 'SLR-1006',
    title: 'Smart LED Desk Lamp with Wireless Charging',
    category: 'Home Office',
    price: 89.00,
    costPrice: 38.00,
    stockQuantity: 24,
    status: 'draft',
    salesCount: 45,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-03-01'
  }
];

let orders = [
  {
    id: 'ord_101',
    orderNumber: 'ORD-2026-8801',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    items: [
      { productId: 'prod_1', productTitle: 'Wireless Ergonomic Mechanical Keyboard', quantity: 1, price: 129.99 },
      { productId: 'prod_5', productTitle: 'USB-C Multi-Port Hub (8-in-1)', quantity: 2, price: 59.99 }
    ],
    totalAmount: 249.97,
    status: 'delivered',
    paymentMethod: 'Credit Card (Stripe)',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR',
    createdAt: '2026-08-01T10:14:00Z'
  },
  {
    id: 'ord_102',
    orderNumber: 'ORD-2026-8802',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    items: [
      { productId: 'prod_2', productTitle: 'Ultra-Precision Wireless Gaming Mouse', quantity: 1, price: 79.50 }
    ],
    totalAmount: 79.50,
    status: 'processing',
    paymentMethod: 'PayPal',
    shippingAddress: '100 Market St, Suite 400, San Francisco, CA',
    createdAt: '2026-08-03T14:22:00Z'
  },
  {
    id: 'ord_103',
    orderNumber: 'ORD-2026-8803',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designstudio.net',
    items: [
      { productId: 'prod_3', productTitle: 'Noise-Canceling Studio Headphones', quantity: 1, price: 199.00 }
    ],
    totalAmount: 199.00,
    status: 'pending',
    paymentMethod: 'Credit Card (Visa)',
    shippingAddress: '450 Fifth Ave, New York, NY',
    createdAt: '2026-08-04T09:05:00Z'
  },
  {
    id: 'ord_104',
    orderNumber: 'ORD-2026-8804',
    customerName: 'David Kim',
    customerEmail: 'dkim.dev@gmail.com',
    items: [
      { productId: 'prod_1', productTitle: 'Wireless Ergonomic Mechanical Keyboard', quantity: 2, price: 129.99 }
    ],
    totalAmount: 259.98,
    status: 'shipped',
    paymentMethod: 'Apple Pay',
    shippingAddress: '1200 Pine St, Seattle, WA',
    createdAt: '2026-08-04T16:40:00Z'
  }
];

let customers = [
  {
    id: 'cust_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    totalOrders: 6,
    totalSpent: 840.50,
    lastOrderDate: '2026-08-01',
    status: 'active'
  },
  {
    id: 'cust_2',
    name: 'Marcus Vance',
    email: 'm.vance@techcorp.io',
    phone: '+1 (555) 876-5432',
    totalOrders: 3,
    totalSpent: 310.00,
    lastOrderDate: '2026-08-03',
    status: 'active'
  },
  {
    id: 'cust_3',
    name: 'Elena Rostova',
    email: 'elena.rostova@designstudio.net',
    phone: '+1 (555) 432-1098',
    totalOrders: 1,
    totalSpent: 199.00,
    lastOrderDate: '2026-08-04',
    status: 'active'
  },
  {
    id: 'cust_4',
    name: 'David Kim',
    email: 'dkim.dev@gmail.com',
    phone: '+1 (555) 901-2345',
    totalOrders: 4,
    totalSpent: 520.00,
    lastOrderDate: '2026-08-04',
    status: 'active'
  }
];

let customerActivities = [
  {
    id: 'act_101',
    customerId: 'cust_1',
    type: 'order',
    title: 'Order Placed (ORD-2026-8801)',
    description: 'Purchased Wireless Ergonomic Mechanical Keyboard & USB-C Multi-Port Hub (8-in-1)',
    amount: 249.97,
    orderId: 'ord_101',
    author: 'System',
    createdAt: '2026-08-01T10:14:00Z'
  },
  {
    id: 'act_102',
    customerId: 'cust_1',
    type: 'email_sent',
    title: 'Shipping Confirmation Email Sent',
    description: 'Tracking number #TRK-992182 sent via Postmark integration',
    author: 'Automated Bot',
    createdAt: '2026-08-01T14:30:00Z'
  },
  {
    id: 'act_103',
    customerId: 'cust_1',
    type: 'support_note',
    title: 'VIP Client Inquiry Note',
    description: 'Requested bulk volume discount pricing for Q3 office upgrade. Offered 12% coupon code VIP2026.',
    author: 'Ehsan (Support Manager)',
    createdAt: '2026-08-02T11:05:00Z'
  },
  {
    id: 'act_104',
    customerId: 'cust_2',
    type: 'order',
    title: 'Order Placed (ORD-2026-8802)',
    description: 'Purchased Ultra-Precision Wireless Gaming Mouse',
    amount: 79.50,
    orderId: 'ord_102',
    author: 'System',
    createdAt: '2026-08-03T14:22:00Z'
  },
  {
    id: 'act_105',
    customerId: 'cust_2',
    type: 'support_note',
    title: 'Address Modification Note',
    description: 'Customer updated shipping suite number to Suite 400 before fulfillment.',
    author: 'Sarah (Ops)',
    createdAt: '2026-08-03T16:00:00Z'
  },
  {
    id: 'act_106',
    customerId: 'cust_3',
    type: 'order',
    title: 'Order Placed (ORD-2026-8803)',
    description: 'Purchased Noise-Canceling Studio Headphones',
    amount: 199.00,
    orderId: 'ord_103',
    author: 'System',
    createdAt: '2026-08-04T09:05:00Z'
  },
  {
    id: 'act_107',
    customerId: 'cust_4',
    type: 'order',
    title: 'Order Placed (ORD-2026-8804)',
    description: 'Purchased Wireless Ergonomic Mechanical Keyboard (Qty: 2)',
    amount: 259.98,
    orderId: 'ord_104',
    author: 'System',
    createdAt: '2026-08-04T16:40:00Z'
  }
];

let settings = {
  storeName: 'Ehsan Seller Store',
  storeEmail: 'seller@ehsan-store.io',
  currency: 'USD ($)',
  taxRate: 8.5,
  autoSyncInventory: true,
  notifyLowStock: true,
  lowStockThreshold: 10,
  apiWebhookUrl: 'https://api.ehsan-store.io/v1/webhooks/orders',
  apiKey: 'slr_live_992a88bf0138cd912e7a',
  metaTitle: 'Ehsan Seller Store — Enterprise Headless E-Commerce Engine',
  metaDescription: 'Discover top-rated ergonomic keyboards, precision gaming mice, studio audio equipment, and sleek desk accessories with instant global express shipping.',
  canonicalUrl: 'https://ehsan-store.io',
  ogImageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
  keywords: 'headless commerce, ecommerce, mechanical keyboards, gaming mice, studio audio',
  socialTwitterHandle: '@ehsanking'
};

// Initial Plugins Store
let plugins = [
  {
    id: 'plg_stripe',
    slug: 'stripe-gateway',
    name: 'Stripe Gateway Integration',
    description: 'Accept credit card payments, Apple Pay, Google Pay, and localized payment methods securely with automated webhooks.',
    author: 'EHSANKiNG',
    version: '2.4.0',
    category: 'payment',
    iconName: 'CreditCard',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Stripe Payments',
    config: {
      mode: 'test',
      publishableKey: 'pk_test_51MzEHSANKiNG99x82a...',
      secretKey: 'sk_test_51MzEHSANKiNG88y93b...',
      webhookSecret: 'whsec_e4b889312ff...',
      autoCapture: true,
      enableApplePay: true
    },
    hooks: ['OrderPlaced', 'PaymentProcessed', 'RefundIssued']
  },
  {
    id: 'plg_paypal',
    slug: 'paypal-commerce',
    name: 'PayPal Commerce Platform',
    description: 'Enable PayPal Express Checkout, Pay Later, and global debit/credit card processing in 200+ markets.',
    author: 'EHSANKiNG',
    version: '1.8.2',
    category: 'payment',
    iconName: 'Wallet',
    isInstalled: true,
    isActive: true,
    menuTitle: 'PayPal Commerce',
    config: {
      mode: 'sandbox',
      clientId: 'AZEhsanKingPayPalClientID_992...',
      clientSecret: 'EHSANKiNGSecretKey_8812...',
      currency: 'USD',
      enablePayLater: true
    },
    hooks: ['OrderPlaced', 'PaymentCaptured']
  },
  {
    id: 'plg_security_2fa',
    slug: '2fa-mfa-security-shield',
    name: '2FA Authenticator & Session Sentinel',
    description: 'Enforce Time-based One-Time Password (TOTP 2FA), admin IP whitelisting, session timeout locks, and login brute-force shielding.',
    author: 'EHSANKiNG Security',
    version: '3.0.0',
    category: 'security',
    iconName: 'ShieldCheck',
    isInstalled: true,
    isActive: true,
    menuTitle: '2FA & Security Guard',
    config: {
      enforce2FA: true,
      allowedIps: '127.0.0.1, 192.168.1.1/24',
      maxFailedLogins: 5,
      lockoutDurationMinutes: 15,
      sessionTimeoutMinutes: 30,
      notifySuspiciousActivity: true
    },
    hooks: ['AdminLogin', 'FailedLoginAttempt', 'PasswordReset']
  },
  {
    id: 'plg_fraud_shield',
    slug: 'fraud-risk-score-api',
    name: 'MaxMind Fraud Detection & Risk Shield API',
    description: 'Analyze incoming checkout orders in real-time. Calculates fraud risk scores, verifies billing address match, detects proxy/VPN IPs, and flags high-risk transactions.',
    author: 'EHSANKiNG Security',
    version: '2.2.1',
    category: 'security',
    iconName: 'ShieldAlert',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Anti-Fraud Shield',
    config: {
      maxMindApiKey: 'mm_live_8819203810a99',
      riskThresholdToBlock: 75,
      riskThresholdToReview: 40,
      blockProxyVpn: true,
      verifyEmailDomain: true,
      autoCancelHighRisk: false
    },
    hooks: ['OrderPlaced', 'PaymentPreCheck', 'RiskScored']
  },
  {
    id: 'plg_waf_guard',
    slug: 'waf-rate-limiting-firewall',
    name: 'WAF & Rate-Limiting Firewall Guard',
    description: 'Web Application Firewall providing DDoS attack mitigation, SQL Injection (SQLi) & Cross-Site Scripting (XSS) request filtering, and automated API throttling.',
    author: 'EHSANKiNG Security',
    version: '1.5.0',
    category: 'security',
    iconName: 'Lock',
    isInstalled: true,
    isActive: true,
    menuTitle: 'WAF Firewall Settings',
    config: {
      rateLimitRequestsPerMin: 1000,
      enableSqliFilter: true,
      enableXssFilter: true,
      blockBadUserAgents: true,
      ipBlacklist: '198.51.100.4, 203.0.113.19'
    },
    hooks: ['ApiRequest', 'WafBlockTriggered']
  },
  {
    id: 'plg_google_merchant',
    slug: 'google-merchant-center-api',
    name: 'Google Shopping & Merchant Center API',
    description: 'Automates product catalog submission to Google Shopping. Generates Google Content API feeds, updates stock prices dynamically, and resolves Google feed disapproval errors.',
    author: 'EHSANKiNG Integrations',
    version: '2.8.0',
    category: 'api',
    iconName: 'Globe',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Google Shopping Sync',
    config: {
      merchantId: 'GMC-881920391',
      targetCountry: 'US',
      targetLanguage: 'en',
      autoSyncIntervalHours: 6,
      includeOutofStock: false,
      feedUrl: 'https://ehsan-store.io/api/feeds/google-shopping.xml'
    },
    hooks: ['ProductCreated', 'ProductUpdated', 'StockChanged']
  },
  {
    id: 'plg_bing_merchant',
    slug: 'bing-merchant-center-sync',
    name: 'Microsoft Bing Shopping & IndexNow Sync',
    description: 'Syncs store inventory directly to Bing Merchant Center while utilizing Microsoft IndexNow API for instant URL indexing in Bing search results.',
    author: 'EHSANKiNG Integrations',
    version: '1.4.0',
    category: 'api',
    iconName: 'Search',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Bing Merchant & IndexNow',
    config: {
      bingStoreId: 'BING-STORE-9921',
      indexNowApiKey: 'idx_now_key_882910382910',
      autoPingIndexNowOnPublish: true,
      feedUrl: 'https://ehsan-store.io/api/feeds/bing-shopping.xml'
    },
    hooks: ['ProductCreated', 'ProductUpdated', 'SeoUpdated']
  },
  {
    id: 'plg_ga4_analytics',
    slug: 'google-analytics-ga4-gtag',
    name: 'Google Analytics 4 & GTAG Commerce API',
    description: 'Sends real-time e-commerce measurement events (view_item, add_to_cart, begin_checkout, purchase) to GA4 and Google Tag Manager.',
    author: 'EHSANKiNG Integrations',
    version: '2.1.0',
    category: 'analytics',
    iconName: 'BarChart3',
    isInstalled: true,
    isActive: true,
    menuTitle: 'GA4 Measurement',
    config: {
      measurementId: 'G-EHSANKING2026',
      gtmContainerId: 'GTM-EHSAN992',
      sendRefundEvents: true,
      enhancedEcommerce: true
    },
    hooks: ['PageView', 'AddToCart', 'OrderPlaced', 'RefundIssued']
  },
  {
    id: 'plg_dhl',
    slug: 'dhl-express-shipping',
    name: 'DHL Express Logistics',
    description: 'Calculate live shipping rates at checkout, auto-generate commercial shipping labels, and track international parcels.',
    author: 'EHSANKiNG',
    version: '3.1.0',
    category: 'shipping',
    iconName: 'Truck',
    isInstalled: true,
    isActive: true,
    menuTitle: 'DHL Shipping Engine',
    config: {
      accountNumber: 'DHL-99281-EHSAN',
      apiKey: 'dhl_live_api_key_882910',
      apiSecret: 'dhl_secret_key_882190',
      pickupCountry: 'US',
      pickupPostalCode: '90210',
      defaultWeightUnit: 'kg',
      autoGenerateLabels: true
    },
    hooks: ['OrderShipped', 'RateCalculated', 'LabelGenerated']
  },
  {
    id: 'plg_klaviyo',
    slug: 'klaviyo-marketing-automation',
    name: 'Klaviyo Marketing & Cart Recovery API',
    description: 'Triggers automated abandoned cart email sequences, customer post-purchase follow-ups, and SMS discount codes.',
    author: 'EHSANKiNG Integrations',
    version: '1.9.0',
    category: 'marketing',
    iconName: 'Mail',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Klaviyo Automation',
    config: {
      publicKey: 'pk_klaviyo_live_99218',
      privateKey: 'pk_klaviyo_secret_882190',
      abandonedCartDelayMinutes: 60,
      trackProductViews: true
    },
    hooks: ['CartAbandoned', 'CustomerRegistered', 'OrderPlaced']
  },
  {
    id: 'plg_ai',
    slug: 'ai-commerce-assistant',
    name: 'Popular AI Commerce Suite (Gemini / OpenAI / Claude)',
    description: 'Generates SEO product titles & descriptions, answers customer support inquiries, and optimizes store listings using modern AI models.',
    author: 'EHSANKiNG',
    version: '2.0.1',
    category: 'ai',
    iconName: 'Sparkles',
    isInstalled: true,
    isActive: true,
    menuTitle: 'AI Copilot Studio',
    config: {
      provider: 'gemini',
      modelName: 'gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY || 'AIzaSy_EHSANKiNG_Default_Key',
      autoEnhanceTitles: true,
      autoDraftDescriptions: true,
      maxTokens: 1024,
      creativityLevel: 0.7
    },
    hooks: ['ProductCreated', 'CustomerInquiry', 'OrderAnalyzed']
  },
  {
    id: 'plg_cloudflare_cdn',
    slug: 'cloudflare-cdn',
    name: 'Cloudflare Edge CDN & Cache Purge API',
    description: 'Enterprise global edge network caching, instant cache purge on product catalog updates, WebP/AVIF image acceleration, and Cloudflare Workers edge rules.',
    author: 'Cloudflare / EHSANKiNG',
    version: '3.4.0',
    category: 'cdn',
    iconName: 'Globe',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Cloudflare CDN Guard',
    config: {
      zoneId: '023e105f4ecef8ad9ca31a8372d0c353',
      apiToken: 'cfl_live_tok_99812038',
      domain: 'ehsan-store.io',
      autoPurgeOnProductUpdate: true,
      enableWebpOptimization: true,
      minifyAssets: true,
      edgeTtlSeconds: 86400,
      cacheLevel: 'aggressive'
    },
    hooks: ['ProductCreated', 'ProductUpdated', 'ProductDeleted', 'CachePurged']
  },
  {
    id: 'plg_fastly_cdn',
    slug: 'fastly-cdn',
    name: 'Fastly Instant Purge & Image Optimizer CDN',
    description: 'Sub-millisecond instant cache purge by Surrogate Keys, Fastly VCL edge routing rules, and real-time streaming edge performance metrics.',
    author: 'Fastly / EHSANKiNG',
    version: '2.1.0',
    category: 'cdn',
    iconName: 'Zap',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Fastly Edge Purge',
    config: {
      serviceId: 'fastly_srv_998123',
      apiToken: 'fst_token_8829103829',
      domain: 'cdn.ehsan-store.io',
      autoPurgeSurrogateKeys: true,
      imageOptimizerEnabled: true,
      defaultTtlSeconds: 3600
    },
    hooks: ['ProductUpdated', 'CategoryUpdated', 'SurrogateKeyPurged']
  },
  {
    id: 'plg_bunny_cdn',
    slug: 'bunny-cdn',
    name: 'Bunny.net Global CDN & Storage Zone Sync',
    description: 'Ultra-fast global pull zone asset acceleration, lossy/lossless automatic image optimizer, and Edge Storage sync for product media galleries.',
    author: 'Bunny.net / EHSANKiNG',
    version: '1.8.0',
    category: 'cdn',
    iconName: 'Layers',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Bunny CDN & Storage',
    config: {
      pullZoneName: 'ehsan-store-cdn',
      apiKey: 'bny_api_key_8829103810',
      storageZoneName: 'ehsan-media-storage',
      storageApiKey: 'bny_stg_key_99182',
      customDomain: 'media.ehsan-store.io',
      autoSyncMedia: true
    },
    hooks: ['ProductImageUploaded', 'PullZonePurged', 'MediaSynced']
  },
  {
    id: 'plg_cloudfront_cdn',
    slug: 'aws-cloudfront-cdn',
    name: 'AWS CloudFront Edge Distribution Engine',
    description: 'Amazon CloudFront edge distribution management, Origin Shield configuration, and batch invalidation path creation for instant product catalog sync.',
    author: 'Amazon Web Services / EHSANKiNG',
    version: '2.5.0',
    category: 'cdn',
    iconName: 'Cpu',
    isInstalled: true,
    isActive: false,
    menuTitle: 'AWS CloudFront Manager',
    config: {
      distributionId: 'E2A1B3C4D5E6F7',
      awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      awsSecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      awsRegion: 'us-east-1',
      autoInvalidatePaths: '/*, /products/*'
    },
    hooks: ['ProductUpdated', 'InvalidationCreated']
  },
  {
    id: 'plg_jsdelivr_cdn',
    slug: 'jsdelivr-cdnjs-vendor-cdn',
    name: 'jsDelivr & cdnjs Open Vendor Assets CDN',
    description: 'Delivers open-source frontend JS/CSS vendor libraries, Google Display Fonts, and Lucide Icon SVGs directly via ultra-fast global edge nodes.',
    author: 'jsDelivr / cdnjs',
    version: '1.2.0',
    category: 'cdn',
    iconName: 'Code',
    isInstalled: true,
    isActive: true,
    menuTitle: 'Open Vendor CDN',
    config: {
      autoInjectVendorLibraries: true,
      preferredVendorCdn: 'jsdelivr',
      enableFontPreconnect: true,
      enableDnsPrefetch: true
    },
    hooks: ['VendorAssetInjected']
  }
];

interface StoreTemplateItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  framework: string;
  author: string;
  version: string;
  isActive: boolean;
  isCustom?: boolean;
  previewImage: string;
  repoUrl?: string;
  demoUrl?: string;
  features: string[];
  cssCode?: string;
  templateCode?: string;
}

// Initial Templates Store
let templates: StoreTemplateItem[] = [
  {
    id: 'tmpl_react_tailwind',
    slug: 'react-tailwind-starter',
    name: 'React 18 + Tailwind Modern Storefront',
    description: 'Hyper-fast, responsive Vite + React storefront with seamless cart management, smooth drawer animations, and direct REST API client.',
    framework: 'React',
    author: 'EHSANKiNG',
    version: '2.1.0',
    isActive: true,
    previewImage: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/react-tailwind',
    demoUrl: 'https://seller-react-demo.ehsan-store.io',
    features: ['Vite 5 Lightning HMR', 'Tailwind Utility Design System', 'Cart Persistence', 'Instant Checkout Webhooks']
  },
  {
    id: 'tmpl_vue_tailwind',
    slug: 'vue-pinia-storefront',
    name: 'Vue 3 + Pinia Enterprise Storefront',
    description: 'Composition API storefront built with Vue 3, Pinia reactive state engine, and automated product catalog caching.',
    framework: 'Vue',
    author: 'EHSANKiNG',
    version: '1.9.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/vue-tailwind',
    demoUrl: 'https://seller-vue-demo.ehsan-store.io',
    features: ['Vue 3 Composition API', 'Pinia Store State', 'Automated Filter Query Params', 'Tailwind CSS']
  },
  {
    id: 'tmpl_bootstrap5',
    slug: 'bootstrap5-classic',
    name: 'Bootstrap 5 Classic Zero-Build Storefront',
    description: 'Pure HTML5 + Bootstrap 5 lightweight template with CDN assets and zero npm compilation required. Perfect for instant deployment on static hosts.',
    framework: 'Bootstrap 5',
    author: 'EHSANKiNG',
    version: '1.5.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/bootstrap5',
    demoUrl: 'https://seller-bootstrap-demo.ehsan-store.io',
    features: ['Zero Build Step (No Node.js needed)', 'CDN Bootstrap 5.3', 'Vanila JS REST Client', 'Instant Load (<100ms)']
  },
  {
    id: 'tmpl_nextjs',
    slug: 'nextjs-app-router',
    name: 'Next.js 14 App Router Ultra Storefront',
    description: 'Server-Side Rendered (SSR) & Incremental Static Regeneration (ISR) storefront with SEO supremacy and edge image optimization.',
    framework: 'Next.js',
    author: 'EHSANKiNG',
    version: '3.0.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/nextjs-app-router',
    demoUrl: 'https://seller-nextjs-demo.ehsan-store.io',
    features: ['Next.js 14 App Router', 'Server Actions', 'Edge Caching & ISR', 'OpenGraph Auto-Generation']
  },
  {
    id: 'tmpl_react_luxury',
    slug: 'react-luxury-boutique',
    name: 'React 18 Luxury Glassmorphic & Minimalist Boutique',
    description: 'High-end luxury boutique React storefront featuring Hero Slider, Glassmorphic Floating Header, Category Spotlights, Customer Testimonials, Trust Badges, and Cart Drawer.',
    framework: 'React',
    author: 'EHSANKiNG',
    version: '2.4.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/react-luxury',
    demoUrl: 'https://seller-luxury-demo.ehsan-store.io',
    features: ['Glassmorphic Design', 'Interactive Quick View Modal', 'Customer Reviews & Ratings', 'Trust Badges & Newsletter']
  },
  {
    id: 'tmpl_react_hyper_supermarket',
    slug: 'react-megastore-hypermarket',
    name: 'React 18 MegaStore & HyperMarket Engine',
    description: 'Feature-rich multi-category React storefront for high-inventory catalogs, flash deals countdown timers, quick add-to-cart, category sidebars, customer review scorecards, and FAQ accordion.',
    framework: 'React',
    author: 'EHSANKiNG',
    version: '1.8.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/react-megastore',
    demoUrl: 'https://seller-megastore-demo.ehsan-store.io',
    features: ['Flash Deals Countdown', 'Multi-Category Sidebars', 'Customer Review Scorecard', 'Express Shipping Badges']
  },
  {
    id: 'tmpl_react_gadgets_dark',
    slug: 'react-cybertech-gadgets',
    name: 'React 18 CyberTech & Dark Neo Gaming Storefront',
    description: 'Sleek dark-mode React 18 template tailored for digital hardware and electronics. Features technical spec sheets, instant live search, star ratings, and floating cart drawer.',
    framework: 'React',
    author: 'EHSANKiNG',
    version: '2.2.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/react-cybertech',
    demoUrl: 'https://seller-cybertech-demo.ehsan-store.io',
    features: ['Neo-Dark Tech Aesthetic', 'Technical Specs Sheet', 'Real-time Cart Drawer', 'Star Rating Showcase']
  },
  {
    id: 'tmpl_react_organic_grocery',
    slug: 'react-fresh-organic-eco',
    name: 'React 18 Fresh Organic & Eco-Market Store',
    description: 'Vibrant eco-friendly React store template for organic goods, fresh groceries, and sustainable items. Includes eco trust badges, subscription options, and customer testimonial sliders.',
    framework: 'React',
    author: 'EHSANKiNG',
    version: '1.6.0',
    isActive: false,
    previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    repoUrl: 'https://github.com/ehsanking/seller/tree/main/storefronts/react-organic',
    demoUrl: 'https://seller-organic-demo.ehsan-store.io',
    features: ['Eco-Friendly Palette', 'Sustainable Badges', 'Customer Testimonial Slider', 'Subscription & Recipe Widget']
  }
];

// Templates API
app.get('/api/templates', (req, res) => {
  res.json(templates);
});

app.put('/api/templates/:id/css', (req, res) => {
  const { id } = req.params;
  const { cssCode } = req.body;
  const target = templates.find(t => t.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Template not found' });
  }
  target.cssCode = cssCode;
  res.json(target);
});

// API Telemetry & Health Routes
app.get('/api/health/metrics', (req, res) => {
  const totalLogs = apiTelemetryLogs.length;
  const errorCount = apiTelemetryLogs.filter(l => l.statusCode >= 400).length;
  const errorRatePercent = totalLogs > 0 ? Number(((errorCount / totalLogs) * 100).toFixed(2)) : 0.18;
  const avgLatencyMs = totalLogs > 0 
    ? Math.round(apiTelemetryLogs.reduce((acc, l) => acc + l.latencyMs, 0) / totalLogs) 
    : 28;

  res.json({
    throughputReqMin: requestCounterWindow,
    errorRatePercent: errorRatePercent,
    avgLatencyMs: avgLatencyMs,
    rateLimit: {
      limitPerMin: 1000,
      currentUsed: requestCounterWindow,
      remaining: Math.max(0, 1000 - requestCounterWindow),
      resetSeconds: 32,
      status: requestCounterWindow > 900 ? 'throttled' : 'healthy'
    },
    endpoints: [
      { path: '/api/products', method: 'GET', avgLatencyMs: 18, requestsPerMin: 58, errorRatePercent: 0, status: 'optimal' },
      { path: '/api/orders', method: 'GET', avgLatencyMs: 24, requestsPerMin: 34, errorRatePercent: 0, status: 'optimal' },
      { path: '/api/analytics', method: 'GET', avgLatencyMs: 62, requestsPerMin: 22, errorRatePercent: 0, status: 'optimal' },
      { path: '/api/webhooks', method: 'POST', avgLatencyMs: 32, requestsPerMin: 18, errorRatePercent: 0, status: 'optimal' },
      { path: '/api/plugins', method: 'GET', avgLatencyMs: 15, requestsPerMin: 10, errorRatePercent: 0, status: 'optimal' },
    ],
    recentLogs: apiTelemetryLogs.slice(0, 8)
  });
});

app.post('/api/health/ping', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API Gateway connection active and responding',
    timestamp: new Date().toISOString(),
    latencyMs: Math.floor(12 + Math.random() * 15)
  });
});

app.patch('/api/templates/:id/activate', (req, res) => {
  const { id } = req.params;
  const target = templates.find(t => t.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Template not found' });
  }

  // Deactivate all others and activate target
  templates.forEach(t => {
    t.isActive = (t.id === id);
  });

  res.json(target);
});

app.post('/api/templates/upload', (req, res) => {
  const { name, slug, description, framework, author, version, previewImage, repoUrl, demoUrl, features, templateCode } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Template name and slug are required' });
  }

  const existing = templates.find(t => t.slug === slug);
  if (existing) {
    return res.status(400).json({ error: `Template with slug "${slug}" already exists` });
  }

  const newTemplate = {
    id: `tmpl_custom_${Date.now()}`,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name,
    description: description || 'Custom storefront template uploaded by merchant',
    framework: framework || 'React',
    author: author || 'EHSANKiNG',
    version: version || '1.0.0',
    isActive: false,
    isCustom: true,
    previewImage: previewImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    repoUrl: repoUrl || '',
    demoUrl: demoUrl || '',
    features: features || ['Custom Storefront Layout', 'Headless REST API Sync'],
    templateCode: templateCode || ''
  };

  templates.push(newTemplate);
  res.status(201).json(newTemplate);
});

app.delete('/api/templates/:id', (req, res) => {
  const { id } = req.params;
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  const deleted = templates.splice(index, 1)[0];
  res.json({ success: true, template: deleted });
});

// Plugins API
app.get('/api/plugins', (req, res) => {
  res.json(plugins);
});

app.patch('/api/plugins/:id/toggle', (req, res) => {
  const { id } = req.params;
  const plugin = plugins.find(p => p.id === id);
  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found' });
  }
  plugin.isActive = !plugin.isActive;
  res.json(plugin);
});

app.put('/api/plugins/:id/config', (req, res) => {
  const { id } = req.params;
  const plugin = plugins.find(p => p.id === id);
  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found' });
  }
  plugin.config = { ...plugin.config, ...req.body };
  res.json(plugin);
});

app.post('/api/plugins/upload', (req, res) => {
  const { name, slug, description, author, version, category, iconName, config, hooks, menuTitle } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ error: 'Plugin name and slug are required' });
  }

  const existing = plugins.find(p => p.slug === slug);
  if (existing) {
    return res.status(400).json({ error: `Plugin with slug "${slug}" already exists` });
  }

  const newPlugin = {
    id: `plg_custom_${Date.now()}`,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name,
    description: description || 'Custom user plugin developed for Seller Hub',
    author: author || 'EHSANKiNG',
    version: version || '1.0.0',
    category: category || 'custom',
    iconName: iconName || 'Code',
    isInstalled: true,
    isActive: true,
    isCustom: true,
    menuTitle: menuTitle || name,
    config: config || {},
    hooks: hooks || ['CustomHookExecuted']
  };

  plugins.push(newPlugin);
  res.status(201).json(newPlugin);
});

app.delete('/api/plugins/:id', (req, res) => {
  const { id } = req.params;
  const index = plugins.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Plugin not found' });
  }
  const deleted = plugins.splice(index, 1)[0];
  res.json({ success: true, plugin: deleted });
});

// DHL Rates Mock Calculator API
app.post('/api/plugins/dhl/calculate-rates', (req, res) => {
  const { destinationPostal, weightKg, length, width, height } = req.body;
  const weight = Number(weightKg) || 1.0;
  
  const baseRate = 24.50 + (weight * 8.20);
  const expressRate = baseRate + 18.00;

  res.json({
    carrier: 'DHL Express',
    origin: 'US - 90210',
    destination: destinationPostal || 'GB - SW1A 1AA',
    weightKg: weight,
    rates: [
      { service: 'DHL Express Worldwide', price: Number(baseRate.toFixed(2)), estimatedDays: '2-3 Business Days' },
      { service: 'DHL Express Envelope Next Day', price: Number(expressRate.toFixed(2)), estimatedDays: '1 Business Day' }
    ]
  });
});

// AI Assistant Handler
app.post('/api/plugins/ai/generate', async (req, res) => {
  const { prompt, type, provider = 'gemini' } = req.body;

  try {
    // Check if process.env.GEMINI_API_KEY is configured
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        return res.json({ text: response.text, provider: 'gemini-2.5-flash' });
      } catch (geminiErr) {
        console.warn('Gemini API call warning, falling back to smart engine response:', geminiErr);
      }
    }

    // Smart AI Content Generator Fallback
    if (type === 'product_description') {
      const title = prompt || 'Premium Wireless Headphones';
      const text = `Introducing the **${title}**, engineered for modern professionals and tech enthusiasts. Featuring ultra-crisp audio drivers, ergonomic lightweight construction, and long battery life. Designed for seamless integration with Seller Hub e-commerce workflows.\n\n### Key Highlights:\n- Premium build quality with sustainable materials\n- Instant plug-and-play compatibility\n- 1-Year International Warranty included`;
      return res.json({ text, provider: `${provider.toUpperCase()} Pro Engine` });
    } else if (type === 'customer_reply') {
      const text = `Hello valued customer,\n\nThank you for contacting ${settings.storeName}! We have received your inquiry regarding order tracking and product details. Your order is currently being processed by our dispatch team and will be shipped via our priority logistics partner shortly.\n\nBest regards,\nCustomer Support Team\n${settings.storeName}`;
      return res.json({ text, provider: `${provider.toUpperCase()} Pro Engine` });
    } else {
      const text = `AI Commerce Analysis for "${prompt}":\nProduct positioning is optimal with a target conversion improvement of +18.4%. Recommended pricing strategy: $${(Math.random() * 50 + 20).toFixed(2)} based on competitive market indices.`;
      return res.json({ text, provider: `${provider.toUpperCase()} Pro Engine` });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// CDN Plugins API Endpoints
app.post('/api/plugins/cdn/cloudflare/purge', (req, res) => {
  const { zoneId, purgeEverything = true, urls = [] } = req.body;
  res.json({
    success: true,
    provider: 'Cloudflare CDN',
    zoneId: zoneId || '023e105f4ecef8ad9ca31a8372d0c353',
    purgedAt: new Date().toISOString(),
    message: purgeEverything ? 'Entire Zone Cache purged across 320+ Cloudflare Edge Data Centers.' : `Purged ${urls.length} target URLs from Cloudflare Edge.`,
    status: '200 OK'
  });
});

app.get('/api/plugins/cdn/cloudflare/stats', (req, res) => {
  res.json({
    cacheHitRatio: '98.6%',
    bandwidthSavedGb: 1420.5,
    requestsServed: 8912040,
    edgeLocationCount: 320,
    activeWorkers: ['seo-canonical-redirects', 'image-webp-auto-convert'],
    status: 'Optimal'
  });
});

app.post('/api/plugins/cdn/fastly/purge', (req, res) => {
  const { surrogateKey, serviceId } = req.body;
  res.json({
    success: true,
    provider: 'Fastly Edge CDN',
    serviceId: serviceId || 'fastly_srv_998123',
    surrogateKey: surrogateKey || 'global-product-catalog',
    purgedMs: 12,
    message: `Instant Fastly purge completed in 12ms for Surrogate Key: "${surrogateKey || 'global-product-catalog'}"`,
    status: '200 OK'
  });
});

app.post('/api/plugins/cdn/bunny/purge', (req, res) => {
  const { pullZoneName } = req.body;
  res.json({
    success: true,
    provider: 'Bunny.net CDN',
    pullZone: pullZoneName || 'ehsan-store-cdn',
    purgedAt: new Date().toISOString(),
    message: 'Bunny.net pull zone cache cleared successfully.',
    status: '200 OK'
  });
});

app.post('/api/plugins/cdn/bunny/sync-storage', (req, res) => {
  const { storageZoneName } = req.body;
  res.json({
    success: true,
    provider: 'Bunny.net Storage',
    storageZone: storageZoneName || 'ehsan-media-storage',
    syncedFilesCount: 24,
    totalBytesSynced: 48912030,
    message: 'All product media gallery images synced to Bunny Storage Zone.',
    status: '200 OK'
  });
});

app.post('/api/plugins/cdn/cloudfront/invalidate', (req, res) => {
  const { distributionId, invalidationPath = '/*' } = req.body;
  res.json({
    success: true,
    provider: 'AWS CloudFront',
    distributionId: distributionId || 'E2A1B3C4D5E6F7',
    invalidationId: `I${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: 'InProgress',
    path: invalidationPath,
    message: `CloudFront invalidation created for path: "${invalidationPath}"`
  });
});


// Initial Webhooks Store
let webhooks = [
  {
    id: 'wh_1',
    name: 'Primary Logistics Fulfillment Hub',
    url: 'https://api.logistics-hub.com/v1/seller/webhook',
    secret: 'whsec_7x9a2b8c4d1e5f',
    events: ['order_placed', 'order_status_updated', 'stock_updated'],
    isActive: true,
    createdAt: '2026-08-01T10:00:00Z',
    lastTriggeredAt: '2026-08-05T03:30:00Z',
    failureCount: 0
  },
  {
    id: 'wh_2',
    name: 'Custom ERP Sync Endpoint',
    url: 'https://erp.merchant-store.io/api/seller-events',
    secret: 'whsec_3m8k1p9q2r5s',
    events: ['product_created', 'stock_updated', 'payment_processed'],
    isActive: true,
    createdAt: '2026-08-02T14:20:00Z',
    lastTriggeredAt: '2026-08-04T18:15:00Z',
    failureCount: 1
  }
];

let webhookLogs = [
  {
    id: 'log_101',
    webhookId: 'wh_1',
    webhookName: 'Primary Logistics Fulfillment Hub',
    url: 'https://api.logistics-hub.com/v1/seller/webhook',
    event: 'order_placed',
    statusCode: 200,
    responseMs: 142,
    requestPayload: {
      event: 'order_placed',
      orderId: 'ord_1785927',
      orderNumber: 'ORD-2026-8812',
      customerEmail: 'alex.dev@example.com',
      totalAmount: 299.99,
      timestamp: '2026-08-05T03:30:00Z'
    },
    responseBody: '{"status":"received","queue_id":"q_882910"}',
    timestamp: '2026-08-05T03:30:00Z',
    status: 'success'
  },
  {
    id: 'log_102',
    webhookId: 'wh_2',
    webhookName: 'Custom ERP Sync Endpoint',
    url: 'https://erp.merchant-store.io/api/seller-events',
    event: 'stock_updated',
    statusCode: 200,
    responseMs: 98,
    requestPayload: {
      event: 'stock_updated',
      productId: 'prod_1',
      sku: 'SLR-1001',
      previousStock: 45,
      newStock: 44,
      timestamp: '2026-08-04T18:15:00Z'
    },
    responseBody: '{"synced":true,"erp_item_id":"ERP-9912"}',
    timestamp: '2026-08-04T18:15:00Z',
    status: 'success'
  }
];

// Helper to dispatch webhooks
function dispatchWebhooks(event: string, payload: any) {
  const matching = webhooks.filter(w => w.isActive && w.events.includes(event as any));
  matching.forEach(wh => {
    wh.lastTriggeredAt = new Date().toISOString();
    const log = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      webhookId: wh.id,
      webhookName: wh.name,
      url: wh.url,
      event: event as any,
      statusCode: 200,
      responseMs: Math.floor(45 + Math.random() * 110),
      requestPayload: { event, ...payload, timestamp: new Date().toISOString() },
      responseBody: JSON.stringify({ status: 'delivered', queue_id: `q_${Math.floor(100000 + Math.random() * 900000)}` }),
      timestamp: new Date().toISOString(),
      status: 'success' as const
    };
    webhookLogs.unshift(log);
    if (webhookLogs.length > 50) webhookLogs.pop();
  });
}

// Webhook Endpoints API
app.get('/api/webhooks', (req, res) => {
  res.json(webhooks);
});

app.get('/api/webhooks/logs', (req, res) => {
  res.json(webhookLogs);
});

app.post('/api/webhooks', (req, res) => {
  const { name, url, events, secret } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Webhook URL is required' });
  }

  const newWebhook = {
    id: `wh_${Date.now()}`,
    name: name || 'Custom Webhook Endpoint',
    url,
    secret: secret || `whsec_${Math.random().toString(36).substring(2, 12)}`,
    events: events && events.length ? events : ['order_placed', 'stock_updated'],
    isActive: true,
    createdAt: new Date().toISOString(),
    lastTriggeredAt: 'Never',
    failureCount: 0
  };

  webhooks.push(newWebhook);
  res.status(201).json(newWebhook);
});

app.patch('/api/webhooks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const target = webhooks.find(w => w.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Webhook endpoint not found' });
  }
  target.isActive = !target.isActive;
  res.json(target);
});

app.post('/api/webhooks/:id/test', (req, res) => {
  const { id } = req.params;
  const target = webhooks.find(w => w.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Webhook endpoint not found' });
  }

  const testEvent = target.events[0] || 'order_placed';
  target.lastTriggeredAt = new Date().toISOString();

  const testLog: any = {
    id: `log_test_${Date.now()}`,
    webhookId: target.id,
    webhookName: target.name,
    url: target.url,
    event: testEvent,
    statusCode: 200,
    responseMs: Math.floor(35 + Math.random() * 80),
    requestPayload: {
      event: testEvent,
      ping: true,
      sampleData: {
        orderId: 'ord_sample_9912',
        amount: 149.50,
        customer: 'test_developer@seller.io'
      },
      timestamp: new Date().toISOString()
    },
    responseBody: JSON.stringify({ status: 'pong', message: 'Test ping delivered successfully' }),
    timestamp: new Date().toISOString(),
    status: 'success'
  };

  webhookLogs.unshift(testLog);
  res.json({ success: true, log: testLog, webhook: target });
});

app.delete('/api/webhooks/:id', (req, res) => {
  const { id } = req.params;
  const index = webhooks.findIndex(w => w.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Webhook endpoint not found' });
  }
  const deleted = webhooks.splice(index, 1)[0];
  res.json({ success: true, webhook: deleted });
});

// Admin Profile Data Store & REST Routes
let adminProfile = {
  id: 'admin_ehsan_01',
  fullName: 'Ehsan King',
  email: 'ehsankingehsan@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  roleId: 'role_superadmin',
  roleName: 'Super Admin',
  phoneNumber: '+1 (555) 019-2831',
  bio: 'Lead Store Administrator & E-Commerce Systems Architect overseeing multi-channel fulfillment.',
  timezone: 'UTC-07:00 (Pacific Time)',
  preferredLanguage: 'fa-IR',
  twoFactorEnabled: true,
  theme: 'light',
  apiKey: 'slr_admin_live_992a88bf0138cd912e7a',
  createdAt: '2026-01-10T08:00:00Z',
  lastLoginAt: new Date().toISOString()
};

app.get('/api/admin/profile', (req, res) => {
  res.json(adminProfile);
});

app.put('/api/admin/profile', (req, res) => {
  adminProfile = { ...adminProfile, ...req.body, lastLoginAt: new Date().toISOString() };
  res.json(adminProfile);
});

// Admin Roles Data Store & REST Routes
let adminRoles = [
  {
    id: 'role_superadmin',
    name: 'Super Admin',
    description: 'Full unrestricted access to store configuration, finance, plugins, roles, and database APIs.',
    isSystemRole: true,
    permissions: ['view_dashboard', 'manage_products', 'manage_orders', 'manage_customers', 'manage_analytics', 'manage_plugins', 'manage_templates', 'manage_webhooks', 'manage_settings', 'manage_roles', 'export_data', 'api_access'],
    userCount: 1,
    color: 'indigo'
  },
  {
    id: 'role_store_manager',
    name: 'Store Manager',
    description: 'Can manage product listings, inventory stock levels, order fulfillments, and customer communications.',
    isSystemRole: false,
    permissions: ['view_dashboard', 'manage_products', 'manage_orders', 'manage_customers', 'manage_analytics', 'export_data'],
    userCount: 2,
    color: 'emerald'
  },
  {
    id: 'role_fulfillment',
    name: 'Order Fulfillment Agent',
    description: 'Restricted to viewing orders, printing packing slips, updating shipping tracking numbers, and issuing status updates.',
    isSystemRole: false,
    permissions: ['view_dashboard', 'manage_orders', 'export_data'],
    userCount: 3,
    color: 'blue'
  },
  {
    id: 'role_inventory',
    name: 'Inventory Specialist',
    description: 'Focused on stock quantity updates, low-stock threshold monitoring, and supplier SKU management.',
    isSystemRole: false,
    permissions: ['view_dashboard', 'manage_products'],
    userCount: 1,
    color: 'amber'
  },
  {
    id: 'role_developer',
    name: 'Integration Developer',
    description: 'Access to API webhooks, plugin configurations, custom template CSS editing, and telemetry monitoring.',
    isSystemRole: false,
    permissions: ['view_dashboard', 'manage_plugins', 'manage_templates', 'manage_webhooks', 'api_access'],
    userCount: 2,
    color: 'purple'
  }
];

app.get('/api/admin/roles', (req, res) => {
  res.json(adminRoles);
});

app.post('/api/admin/roles', (req, res) => {
  const { name, description, permissions, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Role name is required' });
  const newRole = {
    id: `role_${Date.now()}`,
    name,
    description: description || '',
    isSystemRole: false,
    permissions: permissions || ['view_dashboard'],
    userCount: 0,
    color: color || 'indigo'
  };
  adminRoles.push(newRole);
  res.status(201).json(newRole);
});

app.put('/api/admin/roles/:id', (req, res) => {
  const { id } = req.params;
  const target = adminRoles.find(r => r.id === id);
  if (!target) return res.status(404).json({ error: 'Role not found' });
  Object.assign(target, req.body);
  res.json(target);
});

app.delete('/api/admin/roles/:id', (req, res) => {
  const { id } = req.params;
  const target = adminRoles.find(r => r.id === id);
  if (!target) return res.status(404).json({ error: 'Role not found' });
  if (target.isSystemRole) return res.status(400).json({ error: 'Cannot delete system roles' });
  adminRoles = adminRoles.filter(r => r.id !== id);
  res.json({ success: true });
});

// SEO & Search Engine Webmaster Store & REST Routes
let seoSettings = {
  siteTitle: 'Ehsan Seller Store — Enterprise Headless E-Commerce Engine',
  titleTemplate: '%s | Ehsan Seller Store',
  metaDescription: 'Discover top-rated ergonomic keyboards, precision gaming mice, studio audio equipment, and sleek desk accessories with instant global express shipping.',
  keywords: ['headless commerce', 'ecommerce', 'mechanical keyboards', 'gaming mice', 'studio audio', 'ehsan store'],
  googleSiteVerification: 'google-site-verification=EHSANKiNG_GSC_Verification_Hash_992180',
  bingSiteVerification: 'bing-site-verification=BING_WEBMASTER_EHSAN_881920',
  indexNowApiKey: 'idx_now_key_882910382910',
  robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://ehsan-store.io/sitemap.xml`,
  enableAutoSitemap: true,
  sitemapUrl: 'https://ehsan-store.io/sitemap.xml',
  organizationName: 'Ehsan Global E-Commerce Technologies Inc.',
  organizationLogo: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=300&q=80',
  defaultOgImage: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
  canonicalUrl: 'https://ehsan-store.io',
  twitterHandle: '@ehsanking'
};

app.get('/api/seo', (req, res) => {
  res.json(seoSettings);
});

app.put('/api/seo', (req, res) => {
  seoSettings = { ...seoSettings, ...req.body };
  res.json(seoSettings);
});

// Public XML Sitemap for Google & Bing Indexing
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = seoSettings.canonicalUrl || 'https://ehsan-store.io';
  const lastMod = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${baseUrl}/products</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  products.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/products/${p.id}</loc>\n`;
    xml += `    <lastmod>${(p as any).updatedAt ? (p as any).updatedAt.split('T')[0] : (p as any).createdAt ? (p as any).createdAt.split('T')[0] : lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    const imgUrl = (p as any).image || ((p as any).images && (p as any).images[0]);
    if (imgUrl) {
      const cleanTitle = (p.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      xml += `    <image:image>\n      <image:loc>${imgUrl}</image:loc>\n      <image:title>${cleanTitle}</image:title>\n    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'text/xml');
  res.send(xml);
});

// Public Robots.txt
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(seoSettings.robotsTxtContent);
});

// IndexNow Instant Ping Endpoint
app.post('/api/seo/ping-index', (req, res) => {
  const { urlList } = req.body;
  res.json({
    status: 'success',
    message: 'IndexNow notification transmitted to Google & Bing Search engine crawler endpoints',
    urlsSubmitted: urlList || [seoSettings.canonicalUrl],
    timestamp: new Date().toISOString(),
    indexNowResponseCode: 200
  });
});

// Products API
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: `prod_${Date.now()}`,
    sku: req.body.sku || `SLR-${Math.floor(1000 + Math.random() * 9000)}`,
    title: req.body.title || 'Untitled Product',
    category: req.body.category || 'General',
    price: Number(req.body.price) || 0,
    costPrice: Number(req.body.costPrice) || 0,
    stockQuantity: Number(req.body.stockQuantity) || 0,
    status: req.body.status || 'active',
    salesCount: 0,
    image: req.body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString().split('T')[0]
  };
  products.unshift(newProduct);
  dispatchWebhooks('product_created', newProduct);
  dispatchWebhooks('stock_updated', { productId: newProduct.id, sku: newProduct.sku, newStock: newProduct.stockQuantity });
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const oldStock = products[index].stockQuantity;
  products[index] = { ...products[index], ...req.body };
  if (req.body.stockQuantity !== undefined && req.body.stockQuantity !== oldStock) {
    dispatchWebhooks('stock_updated', {
      productId: id,
      sku: products[index].sku,
      previousStock: oldStock,
      newStock: products[index].stockQuantity
    });
  }
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true, id });
});

// Bulk Products Operations
app.post('/api/products/bulk-delete', (req, res) => {
  const { ids } = req.body as { ids: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array is required' });
  }
  products = products.filter(p => !ids.includes(p.id));
  res.json({ success: true, count: ids.length, deletedIds: ids });
});

app.post('/api/products/bulk-update', (req, res) => {
  const { ids, updates } = req.body as { ids: string[]; updates: Record<string, any> };
  if (!Array.isArray(ids) || !updates) {
    return res.status(400).json({ error: 'ids array and updates object required' });
  }
  let count = 0;
  products = products.map(p => {
    if (ids.includes(p.id)) {
      count++;
      const updated = { ...p, ...updates };
      if (updates.stockQuantity !== undefined && updates.stockQuantity !== p.stockQuantity) {
        dispatchWebhooks('stock_updated', {
          productId: p.id,
          sku: p.sku,
          previousStock: p.stockQuantity,
          newStock: updates.stockQuantity
        });
      }
      return updated;
    }
    return p;
  });
  res.json({ success: true, updatedCount: count, products });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: req.body.customerName || 'Walk-in Customer',
    customerEmail: req.body.customerEmail || 'customer@example.com',
    items: req.body.items || [],
    totalAmount: Number(req.body.totalAmount) || 0,
    status: 'pending',
    paymentMethod: req.body.paymentMethod || 'Credit Card',
    shippingAddress: req.body.shippingAddress || '123 Main St',
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  dispatchWebhooks('order_placed', newOrder);
  dispatchWebhooks('payment_processed', { orderId: newOrder.id, amount: newOrder.totalAmount, method: newOrder.paymentMethod });
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const oldStatus = order.status;
  order.status = status;
  dispatchWebhooks('order_status_updated', { orderId: id, previousStatus: oldStatus, newStatus: status });
  res.json(order);
});

// Bulk Orders Operations
app.post('/api/orders/bulk-delete', (req, res) => {
  const { ids } = req.body as { ids: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array is required' });
  }
  orders = orders.filter(o => !ids.includes(o.id));
  res.json({ success: true, count: ids.length, deletedIds: ids });
});

app.post('/api/orders/bulk-update-status', (req, res) => {
  const { ids, status } = req.body as { ids: string[]; status: string };
  if (!Array.isArray(ids) || !status) {
    return res.status(400).json({ error: 'ids array and status required' });
  }
  let count = 0;
  orders = orders.map(o => {
    if (ids.includes(o.id)) {
      count++;
      const oldStatus = o.status;
      const updated = { ...o, status: status as any };
      dispatchWebhooks('order_status_updated', { orderId: o.id, previousStatus: oldStatus, newStatus: status });
      return updated;
    }
    return o;
  });
  res.json({ success: true, updatedCount: count, orders });
});

// Customers API & Activity Log
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/customers/:id/activities', (req, res) => {
  const { id } = req.params;
  const customerActs = customerActivities.filter(a => a.customerId === id);
  res.json(customerActs);
});

app.post('/api/customers/:id/activities', (req, res) => {
  const { id } = req.params;
  const newActivity = {
    id: `act_${Date.now()}`,
    customerId: id,
    type: req.body.type || 'support_note',
    title: req.body.title || 'Customer Interaction',
    description: req.body.description || '',
    amount: req.body.amount,
    orderId: req.body.orderId,
    author: req.body.author || 'Store Admin',
    createdAt: new Date().toISOString()
  };
  customerActivities.unshift(newActivity);
  res.status(201).json(newActivity);
});

// Analytics API
app.get('/api/analytics', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0) + 14820.50;
  const totalOrdersCount = orders.length + 158;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockItems = products.filter(p => p.stockQuantity <= 10).length;

  res.json({
    totalRevenue,
    revenueGrowth: 18.4,
    totalOrders: totalOrdersCount,
    ordersGrowth: 12.1,
    avgOrderValue: 128.40,
    activeProducts,
    lowStockItems,
    chartData: [
      { date: 'Jul 28', revenue: 1420, orders: 12, profit: 620 },
      { date: 'Jul 29', revenue: 1890, orders: 15, profit: 890 },
      { date: 'Jul 30', revenue: 2300, orders: 19, profit: 1100 },
      { date: 'Jul 31', revenue: 1750, orders: 14, profit: 780 },
      { date: 'Aug 01', revenue: 2980, orders: 24, profit: 1420 },
      { date: 'Aug 02', revenue: 2100, orders: 18, profit: 990 },
      { date: 'Aug 03', revenue: 3450, orders: 28, profit: 1650 },
      { date: 'Aug 04', revenue: 3120, orders: 25, profit: 1480 }
    ],
    topCategories: [
      { category: 'Electronics', sales: 8420, percentage: 48 },
      { category: 'Accessories', sales: 4190, percentage: 24 },
      { category: 'Audio', sales: 3200, percentage: 18 },
      { category: 'Home Office', sales: 1740, percentage: 10 }
    ]
  });
});

// Settings API
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Public Storewide SEO Meta Tags API for Headless Storefronts
app.get('/api/seo', (req, res) => {
  res.json({
    metaTitle: settings.metaTitle || settings.storeName,
    metaDescription: settings.metaDescription || '',
    canonicalUrl: settings.canonicalUrl || '',
    ogImageUrl: settings.ogImageUrl || '',
    keywords: settings.keywords || '',
    socialTwitterHandle: settings.socialTwitterHandle || '',
    storeName: settings.storeName,
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Seller Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
