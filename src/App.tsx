import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { PluginsView } from './components/PluginsView';
import { AddProductModal } from './components/AddProductModal';
import { AddOrderModal } from './components/AddOrderModal';
import { NavigationTab, Product, Order, Customer, AnalyticsSummary, StoreSettings, OrderStatus, Plugin } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from Express API
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes, custRes, anaRes, setRes, plgRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/plugins').then(r => r.json()),
      ]);

      setProducts(prodRes);
      setOrders(ordRes);
      setCustomers(custRes);
      setAnalytics(anaRes);
      setSettings(setRes);
      setPlugins(plgRes);
    } catch (err) {
      console.error('Error loading data from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeName={settings.storeName}
        plugins={plugins}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          storeName={settings.storeName}
          onRefreshData={fetchAllData}
          onOpenAddProductModal={() => setIsAddProductOpen(true)}
          onOpenAddOrderModal={() => setIsAddOrderOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              analytics={analytics}
              products={products}
              orders={orders}
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
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              searchQuery={searchQuery}
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
        </main>
      </div>

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
    </div>
  );
}

export default App;
