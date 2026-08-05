import React from 'react';
import { Search, Bell, Plus, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  storeName: string;
  onRefreshData: () => void;
  onOpenAddProductModal: () => void;
  onOpenAddOrderModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  storeName,
  onRefreshData,
  onOpenAddProductModal,
  onOpenAddOrderModal,
  searchQuery,
  setSearchQuery,
}) => {
  const getTabTitle = (tab: NavigationTab) => {
    if (tab === 'plugins') return 'Plugins & Extension Center';
    if (tab.startsWith('plugin_')) {
      const slug = tab.replace('plugin_', '').replace(/-/g, ' ');
      return `Plugin: ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
    }

    switch (tab) {
      case 'dashboard': return 'Store Overview';
      case 'products': return 'Product Inventory';
      case 'orders': return 'Order Management';
      case 'customers': return 'Customer Directory';
      case 'analytics': return 'Performance & Analytics';
      case 'settings': return 'Store Settings & Integrations';
      default: return 'Seller Hub';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-xs">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900">{getTabTitle(activeTab)}</h2>
        <p className="text-xs text-slate-500 font-medium">Managing {storeName} • Updated real-time</p>
      </div>

      {/* Global Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, order, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          title="Refresh Store Data"
          className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* Action Button */}
        {activeTab === 'products' ? (
          <button
            onClick={onOpenAddProductModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        ) : activeTab === 'orders' ? (
          <button
            onClick={onOpenAddOrderModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Manual Order
          </button>
        ) : (
          <button
            onClick={onOpenAddProductModal}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Quick Add
          </button>
        )}
      </div>
    </header>
  );
};
