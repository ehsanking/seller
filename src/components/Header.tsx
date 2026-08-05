import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  RefreshCw, 
  Keyboard, 
  User, 
  ShieldCheck, 
  Check, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  BellRing, 
  Sparkles,
  Type 
} from 'lucide-react';
import { NavigationTab, AdminProfile, StoreNotification } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  storeName: string;
  onRefreshData: () => void;
  onOpenAddProductModal: () => void;
  onOpenAddOrderModal: () => void;
  onOpenShortcutsModal?: () => void;
  onOpenAdminProfileModal?: () => void;
  adminProfile?: AdminProfile | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dashboardFont?: string;
  onChangeFont?: (font: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  storeName,
  onRefreshData,
  onOpenAddProductModal,
  onOpenAddOrderModal,
  onOpenShortcutsModal,
  onOpenAdminProfileModal,
  adminProfile,
  searchQuery,
  setSearchQuery,
  dashboardFont = 'Inter',
  onChangeFont,
}) => {
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifAnimating, setIsNotifAnimating] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  const trendingFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 
    'Lato', 'Nunito', 'Vazirmatn', 'Playfair Display', 'Fira Code'
  ];

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

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetchWithRetry('/api/notifications');
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 10 seconds for real-time vibe
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear', { method: 'POST' });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulation Helper to let users trigger new notifications easily
  const triggerNotificationSimulation = async (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    try {
      setIsNotifAnimating(true);
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type })
      });
      if (res.ok) {
        const newNotif = await res.json();
        setNotifications(prev => [newNotif, ...prev]);
        setTimeout(() => setIsNotifAnimating(false), 1000);
      }
    } catch (err) {
      console.error(err);
      setIsNotifAnimating(false);
    }
  };

  const getTabTitle = (tab: NavigationTab) => {
    if (tab === 'branches') return 'Branches & Store Locations';
    if (tab === 'coupons') return 'Discount Coupons & Promotional Rules';
    if (tab === 'plugins') return 'Plugins & Extension Center';
    if (tab === 'templates') return 'Storefront Themes & Templates';
    if (tab === 'builder') return 'Visual Landing Page Builder';
    if (tab === 'webhooks') return 'Webhook Management & Developer API';
    if (tab === 'roles') return 'Team Roles & Access Control';
    if (tab === 'seo') return 'Search Engine Webmaster Center';
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

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
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

        {/* Keyboard Shortcuts Trigger Button */}
        <button
          onClick={onOpenShortcutsModal}
          title="Keyboard Shortcuts Cheatsheet (Press ?)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition cursor-pointer"
        >
          <Keyboard className="w-4 h-4 text-indigo-600" />
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-700 rounded border border-slate-300">?</kbd>
        </button>

        {/* Font Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
            title="Dashboard Font"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition cursor-pointer"
          >
            <Type className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">{dashboardFont}</span>
          </button>

          {isFontMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-800">Dashboard Font</h4>
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {trendingFonts.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      onChangeFont?.(font);
                      setIsFontMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      dashboardFont === font
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    style={{ fontFamily: `"${font}", sans-serif` }}
                  >
                    {font}
                    {dashboardFont === font && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          title="Refresh Store Data"
          className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Real-time Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            title="Notifications & Alerts"
            className={`relative p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition cursor-pointer ${
              isNotifAnimating || unreadCount > 0 ? 'animate-none' : ''
            }`}
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-indigo-600 animate-bounce' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
              {/* Dropdown Header */}
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <BellRing className="w-3.5 h-3.5 text-indigo-600" /> System Notifications
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{unreadCount} unread alerts</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={markAllAsRead}
                    disabled={notifications.length === 0}
                    className="p-1 px-2 text-[10px] bg-white border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 rounded-md font-bold transition disabled:opacity-40 cursor-pointer"
                    title="Mark all as read"
                  >
                    Read All
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                    className="p-1 px-1.5 text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md font-bold transition disabled:opacity-40 cursor-pointer"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Simulation Quick triggers */}
              <div className="p-2 bg-indigo-50/50 flex flex-wrap gap-1 items-center border-b border-indigo-100/50">
                <span className="text-[9px] font-bold text-indigo-900 mr-1">Live Demo:</span>
                <button
                  onClick={() => triggerNotificationSimulation('New Order Placed 🛍️', 'Order #ORD-2026-9012 for $450 was created.', 'success')}
                  className="px-2 py-0.5 text-[9px] bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 rounded transition cursor-pointer"
                >
                  +Order
                </button>
                <button
                  onClick={() => triggerNotificationSimulation('Low Stock ⚠️', 'Product "Webcam Pro" has reached critical minimum.', 'warning')}
                  className="px-2 py-0.5 text-[9px] bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 rounded transition cursor-pointer"
                >
                  +Stock
                </button>
                <button
                  onClick={() => triggerNotificationSimulation('Bot Defended 🛡️', 'A bad bot was blocked on the checkout page.', 'error')}
                  className="px-2 py-0.5 text-[9px] bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 rounded transition cursor-pointer"
                >
                  +Security
                </button>
              </div>

              {/* Dropdown List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Bell className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs font-semibold">No notifications available</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-3.5 transition flex gap-3 items-start relative ${
                        notif.isRead ? 'bg-white' : 'bg-indigo-50/20'
                      }`}
                    >
                      {/* Left border for unread notifications */}
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                      )}

                      {/* Icon */}
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {notif.type === 'error' && <ShieldCheck className="w-4 h-4 text-rose-500" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-indigo-500" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={`text-xs font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono font-bold leading-none">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal font-medium">{notif.message}</p>
                      </div>

                      {/* Actions */}
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 hover:bg-slate-100 rounded-md text-indigo-600 hover:text-indigo-800 transition self-center cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Close Overlay */}
              <div className="p-2 bg-slate-50 text-center">
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-500 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <X className="w-3 h-3" /> Close Panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Button */}
        <button
          onClick={onOpenAdminProfileModal}
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition cursor-pointer"
          title="Edit Admin Profile & Credentials"
        >
          <img 
            src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
            alt="Admin"
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
          />
          <div className="text-left hidden lg:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">{adminProfile?.fullName || 'Ehsan King'}</div>
            <div className="text-[10px] font-semibold text-indigo-600 leading-tight">{adminProfile?.roleName || 'Super Admin'}</div>
          </div>
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
