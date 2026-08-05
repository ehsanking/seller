import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

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
    status: 'active',
    salesCount: 184,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
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

let settings = {
  storeName: 'Ehsan Seller Store',
  storeEmail: 'seller@ehsan-store.io',
  currency: 'USD ($)',
  taxRate: 8.5,
  autoSyncInventory: true,
  notifyLowStock: true,
  lowStockThreshold: 10,
  apiWebhookUrl: 'https://api.ehsan-store.io/v1/webhooks/orders',
  apiKey: 'slr_live_992a88bf0138cd912e7a'
};

// API ROUTES
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true, id });
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
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = status;
  res.json(order);
});

// Customers API
app.get('/api/customers', (req, res) => {
  res.json(customers);
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
