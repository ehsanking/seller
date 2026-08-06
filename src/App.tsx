import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { WishlistView } from './components/WishlistView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { PluginsView } from './components/PluginsView';
import { TemplatesView } from './components/TemplatesView';
import { WebhooksView } from './components/WebhooksView';
import { CouponsView } from './components/CouponsView';
import { RolesManagementView } from './components/RolesManagementView';
import { SeoWebmasterView } from './components/SeoWebmasterView';
import { BranchesView } from './components/BranchesView';
import { PageBuilderView } from './components/PageBuilderView';
import { TelegramMiniAppView } from './components/TelegramMiniAppView';
import { AdminProfileModal } from './components/AdminProfileModal';
import { AddProductModal } from './components/AddProductModal';
import { AddOrderModal } from './components/AddOrderModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { 
  NavigationTab, 
  Product, 
  Order, 
  Customer, 
  AnalyticsSummary, 
  StoreSettings, 
  OrderStatus, 
  Plugin, 
  StoreTemplate, 
  WebhookEndpoint, 
  WebhookDeliveryLog,
  AdminProfile, 
  AdminRole, 
  SeoWebmasterSettings,
  Coupon
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [templates, setTemplates] = useState<StoreTemplate[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoWebmasterSettings | null>(null);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardFont, setDashboardFont] = useState(() => {
    return localStorage.getItem('dashboardFont') || 'Inter';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('dashboardTheme') as 'light' | 'dark') || 'light';
  });

  const handleFontChange = (font: string) => {
    setDashboardFont(font);
    localStorage.setItem('dashboardFont', font);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('dashboardTheme', newTheme);
  };

  // Helper for resilient fetching during dev server restarts
  const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 1.5);
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 1.5);
      }
      throw err;
    }
  };

  // Fetch data from Express API
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes, custRes, coupRes, wishRes, anaRes, setRes, plgRes, tmplRes, whRes, admRes, rlsRes, seoRes] = await Promise.all([
        fetchWithRetry('/api/products').then(r => r.json()),
        fetchWithRetry('/api/orders').then(r => r.json()),
        fetchWithRetry('/api/customers').then(r => r.json()),
        fetchWithRetry('/api/coupons').then(r => r.json()).catch(() => []),
        fetchWithRetry('/api/wishlist').then(r => r.json()).catch(() => []),
        fetchWithRetry('/api/analytics').then(r => r.json()),
        fetchWithRetry('/api/settings').then(r => r.json()),
        fetchWithRetry('/api/plugins').then(r => r.json()),
        fetchWithRetry('/api/templates').then(r => r.json()),
        fetchWithRetry('/api/webhooks').then(r => r.json()),
        fetchWithRetry('/api/admin/profile').then(r => r.json()).catch(() => null),
        fetchWithRetry('/api/admin/roles').then(r => r.json()).catch(() => []),
        fetchWithRetry('/api/seo/settings').then(r => r.json()).catch(() => null),
      ]);

      setProducts(prodRes || []);
      setOrders(ordRes || []);
      setCustomers(custRes || []);
      setCoupons(coupRes || []);
      setWishlist(Array.isArray(wishRes) ? wishRes : []);
      setAnalytics(anaRes || null);
      if (setRes) {
        setSettings(setRes);
        if (setRes.theme) setTheme(setRes.theme);
      }
      setPlugins(plgRes || []);
      setTemplates(tmplRes || []);
      setWebhooks(whRes || []);
      if (admRes) setAdminProfile(admRes);
      if (rlsRes) setRoles(rlsRes);
      if (seoRes) setSeoSettings(seoRes);
    } catch (err) {
      console.error('Error loading data from server:', err);
    } finally {
      setLoading(false);
    }
  };

  // Wishlist Toggle Handler
  const handleToggleWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist item:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Bulk Product Operations
  const handleBulkDeleteProducts = async (ids: string[]) => {
    try {
      const res = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => !ids.includes(p.id)));
      }
    } catch (err) {
      console.error('Bulk delete products failed:', err);
    }
  };

  const handleBulkUpdateProducts = async (ids: string[], updates: Partial<Product>) => {
    try {
      const res = await fetch('/api/products/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates }),
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Bulk update products failed:', err);
    }
  };

  const handleSeedProducts = async () => {
    try {
      const res = await fetch('/api/products/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Seed products failed:', err);
    }
  };

  // Bulk Order Operations
  const handleBulkDeleteOrders = async (ids: string[]) => {
    try {
      const res = await fetch('/api/orders/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => !ids.includes(o.id)));
      }
    } catch (err) {
      console.error('Bulk delete orders failed:', err);
    }
  };

  const handleBulkUpdateOrderStatus = async (ids: string[], status: OrderStatus) => {
    try {
      const res = await fetch('/api/orders/bulk-update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Bulk update orders status failed:', err);
    }
  };

  // Template Handlers
  const handleActivateTemplate = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}/activate`, { method: 'PATCH' });
      setTemplates(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
    } catch (err) {
      console.error('Failed to activate template:', err);
    }
  };

  const handleUploadTemplate = async (templateData: Partial<StoreTemplate>) => {
    try {
      const res = await fetch('/api/templates/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      const newTmpl = await res.json();
      setTemplates(prev => [...prev, newTmpl]);
    } catch (err) {
      console.error('Failed to upload template:', err);
      throw err;
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  // Coupon Handlers
  const handleAddCoupon = async (couponData: Partial<Coupon>) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create coupon');
      }
      const newCoupon = await res.json();
      setCoupons(prev => [newCoupon, ...prev]);
    } catch (err) {
      console.error('Failed to add coupon:', err);
      throw err;
    }
  };

  const handleUpdateCoupon = async (id: string, updates: Partial<Coupon>) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCoupons(prev => prev.map(c => c.id === id ? updated : c));
      }
    } catch (err) {
      console.error('Failed to update coupon:', err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  // Webhook Handlers
  const handleAddWebhook = async (webhookData: Partial<WebhookEndpoint>) => {
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add webhook');
      }
      const newWh = await res.json();
      setWebhooks(prev => [...prev, newWh]);
    } catch (err) {
      console.error('Failed to add webhook:', err);
      throw err;
    }
  };

  const handleToggleWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/webhooks/${id}/toggle`, { method: 'PATCH' });
      const updated = await res.json();
      setWebhooks(prev => prev.map(w => w.id === id ? updated : w));
    } catch (err) {
      console.error('Failed to toggle webhook:', err);
    }
  };

  const handleTestWebhook = async (id: string): Promise<WebhookDeliveryLog> => {
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, { method: 'POST' });
      const data = await res.json();
      if (data.webhook) {
        setWebhooks(prev => prev.map(w => w.id === id ? data.webhook : w));
      }
      return data.log;
    } catch (err) {
      console.error('Failed to test webhook:', err);
      throw err;
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      setWebhooks(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Failed to delete webhook:', err);
    }
  };

  // Plugin Handlers
  const handleTogglePlugin = async (id: string) => {
    try {
      const res = await fetch(`/api/plugins/${id}/toggle`, { method: 'PATCH' });
      const updated = await res.json();
      setPlugins(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    }
  };

  const handleUpdatePluginConfig = async (id: string, config: Record<string, any>) => {
    try {
      const res = await fetch(`/api/plugins/${id}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const updated = await res.json();
      setPlugins(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Failed to update plugin config:', err);
    }
  };

  const handleUploadPlugin = async (pluginData: Partial<Plugin>) => {
    try {
      const res = await fetch('/api/plugins/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pluginData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      const newPlugin = await res.json();
      setPlugins(prev => [...prev, newPlugin]);
    } catch (err) {
      console.error('Failed to upload plugin:', err);
      throw err;
    }
  };

  const handleDeletePlugin = async (id: string) => {
    try {
      await fetch(`/api/plugins/${id}`, { method: 'DELETE' });
      setPlugins(prev => prev.filter(p => p.id !== id));
      if (activeTab.startsWith('plugin_')) {
        setActiveTab('plugins');
      }
    } catch (err) {
      console.error('Failed to delete plugin:', err);
    }
  };

  // Product CRUD
  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const newProd = await res.json();
      setProducts(prev => [newProd, ...prev]);
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Order CRUD
  const handleAddOrder = async (orderData: Partial<Order>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const newOrd = await res.json();
      setOrders(prev => [newOrd, ...prev]);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (updatedSettings: StoreSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      const saved = await res.json();
      setSettings(saved);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  if (loading || !analytics || !settings) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Initializing Seller Hub Backend...</p>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: `"${dashboardFont}", sans-serif` }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeName={settings.storeName}
        plugins={plugins}
        onOpenAdminProfileModal={() => setIsAdminProfileOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          storeName={settings.storeName}
          onRefreshData={fetchAllData}
          onOpenAddProductModal={() => setIsAddProductOpen(true)}
          onOpenAddOrderModal={() => setIsAddOrderOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
          onOpenAdminProfileModal={() => setIsAdminProfileOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          adminProfile={adminProfile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dashboardFont={dashboardFont}
          onChangeFont={handleFontChange}
          products={products}
        />

        <main className="p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  analytics={analytics}
                  products={products}
                  orders={orders}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  setActiveTab={setActiveTab}
                  onOpenAddProductModal={() => setIsAddProductOpen(true)}
                  onOpenAddOrderModal={() => setIsAddOrderOpen(true)}
                />
              )}

              {activeTab === 'products' && (
                <ProductsView
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onBulkDeleteProducts={handleBulkDeleteProducts}
                  onBulkUpdateProducts={handleBulkUpdateProducts}
                  onSeedProducts={handleSeedProducts}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersView
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onBulkDeleteOrders={handleBulkDeleteOrders}
                  onBulkUpdateOrderStatus={handleBulkUpdateOrderStatus}
                  searchQuery={searchQuery}
                  initialFactorSettings={settings?.factorSettings}
                  onSaveFactorSettings={(f) => settings && handleSaveSettings({ ...settings, factorSettings: f })}
                />
              )}

              {activeTab === 'customers' && (
                <CustomersView
                  customers={customers}
                  orders={orders}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'wishlist' && (
                <WishlistView
                  products={products}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  analytics={analytics}
                  products={products}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  currentTheme={theme}
                  onThemeChange={handleThemeChange}
                  products={products}
                  customers={customers}
                />
              )}

              {activeTab === 'branches' && (
                <BranchesView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                />
              )}

              {activeTab === 'roles' && (
                <RolesManagementView
                  roles={roles}
                  onSaveRole={async (roleData) => {
                    const method = roleData.id ? 'PUT' : 'POST';
                    const url = roleData.id ? `/api/admin/roles/${roleData.id}` : '/api/admin/roles';
                    const res = await fetch(url, {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(roleData)
                    });
                    if (res.ok) {
                      const updatedRoles = await fetch('/api/admin/roles').then(r => r.json());
                      setRoles(updatedRoles);
                    }
                  }}
                  onDeleteRole={async (roleId) => {
                    const res = await fetch(`/api/admin/roles/${roleId}`, { method: 'DELETE' });
                    if (res.ok) {
                      setRoles(prev => prev.filter(r => r.id !== roleId));
                    }
                  }}
                />
              )}

              {activeTab === 'seo' && (
                <SeoWebmasterView
                  seoSettings={seoSettings}
                  onSaveSeoSettings={async (updated) => {
                    const res = await fetch('/api/seo/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updated)
                    });
                    if (res.ok) {
                      const saved = await res.json();
                      setSeoSettings(saved);
                    }
                  }}
                />
              )}

              {(activeTab === 'plugins' || activeTab.startsWith('plugin_')) && (
                <PluginsView
                  plugins={plugins}
                  onTogglePlugin={handleTogglePlugin}
                  onUpdateConfig={handleUpdatePluginConfig}
                  onUploadPlugin={handleUploadPlugin}
                  onDeletePlugin={handleDeletePlugin}
                  selectedPluginTab={activeTab.startsWith('plugin_') ? activeTab.replace('plugin_', '') : null}
                  onSelectPluginTab={(slug) => {
                    if (slug) {
                      setActiveTab(`plugin_${slug}` as NavigationTab);
                    } else {
                      setActiveTab('plugins');
                    }
                  }}
                />
              )}

              {activeTab === 'templates' && (
                <TemplatesView
                  templates={templates}
                  products={products}
                  settings={settings}
                  coupons={coupons}
                  onActivateTemplate={handleActivateTemplate}
                  onUploadTemplate={handleUploadTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onGoToBuilder={() => setActiveTab('builder')}
                />
              )}

              {activeTab === 'builder' && (
                <PageBuilderView
                  products={products}
                  settings={settings}
                />
              )}

              {activeTab === 'coupons' && (
                <CouponsView
                  coupons={coupons}
                  onAddCoupon={handleAddCoupon}
                  onUpdateCoupon={handleUpdateCoupon}
                  onDeleteCoupon={handleDeleteCoupon}
                />
              )}

              {activeTab === 'telegram_mini_app' && (
                <TelegramMiniAppView
                  products={products}
                  storeName={settings.storeName}
                  onOrderCreated={fetchAllData}
                />
              )}

              {activeTab === 'webhooks' && (
                <WebhooksView
                  webhooks={webhooks}
                  onAddWebhook={handleAddWebhook}
                  onToggleWebhook={handleToggleWebhook}
                  onTestWebhook={handleTestWebhook}
                  onDeleteWebhook={handleDeleteWebhook}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
        profile={adminProfile}
        onSaveProfile={async (updated) => {
          const res = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          });
          if (res.ok) {
            const saved = await res.json();
            setAdminProfile(saved);
          }
        }}
      />

      {/* Global Keyboard Shortcuts Hotkeys Manager & Listener */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenAddOrder={() => setIsAddOrderOpen(true)}
      />

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        products={products}
        onAddOrder={handleAddOrder}
      />

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        customers={customers}
        orders={orders}
        onNavigate={(tab, search) => {
          setActiveTab(tab);
          if (search) {
            setSearchQuery(search);
          }
        }}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenAddOrder={() => setIsAddOrderOpen(true)}
        onRefreshData={fetchAllData}
      />
    </div>
  );
}

export default App;
