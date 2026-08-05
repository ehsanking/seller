import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Store,
  Blocks,
  Palette,
  Webhook,
  CreditCard,
  Wallet,
  Truck,
  Sparkles,
  Code,
  Puzzle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Globe,
  UserCheck,
  Lock,
  Ticket
} from 'lucide-react';
import { NavigationTab, Plugin } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  storeName: string;
  plugins?: Plugin[];
  onOpenAdminProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  storeName, 
  plugins = [],
  onOpenAdminProfileModal
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'orders', label: 'Orders & Shipments', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Sales & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'branches', label: 'Store Branches', icon: Store, badge: 'Map' },
    { id: 'coupons', label: 'Discount Coupons', icon: Ticket, badge: 'Promo' },
    { id: 'roles', label: 'Roles & Access', icon: ShieldCheck, badge: 'RBAC' },
    { id: 'seo', label: 'SEO & Webmaster', icon: Globe, badge: 'Google' },
    { id: 'plugins', label: 'Plugins & Add-ons', icon: Blocks, badge: plugins.filter(p => p.isActive).length ? `${plugins.filter(p => p.isActive).length} Active` : 'Hub' },
    { id: 'templates', label: 'Storefront Themes', icon: Palette, badge: 'Themes' },
    { id: 'builder', label: 'Visual Page Builder', icon: Sparkles, badge: 'Craft.js' },
    { id: 'webhooks', label: 'Webhook Engine', icon: Webhook, badge: 'API' },
  ];

  const getPluginIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Wallet': return Wallet;
      case 'Truck': return Truck;
      case 'Sparkles': return Sparkles;
      case 'Code': return Code;
      case 'ShieldCheck': return ShieldCheck;
      case 'ShieldAlert': return ShieldCheck;
      case 'Lock': return Lock;
      case 'Globe': return Globe;
      default: return Puzzle;
    }
  };

  const activePlugins = plugins.filter(p => p.isActive);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800">
      {/* Brand & Store Selector */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between text-left">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-bold text-base text-white truncate max-w-[130px] text-left">{storeName}</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium text-left">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              Live Sync Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-left">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-left">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold shrink-0 text-left ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Dynamic Active Plugins Menu */}
        {activePlugins.length > 0 && (
          <div className="pt-4 mt-2 border-t border-slate-800/80 text-left">
            <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-left">
              <span>Active Extensions</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400 font-mono shrink-0">Dynamic</span>
            </div>
            <div className="space-y-1 text-left">
              {activePlugins.map((plugin) => {
                const PluginIcon = getPluginIcon(plugin.iconName);
                const tabId = `plugin_${plugin.slug}` as NavigationTab;
                const isPluginActive = activeTab === tabId;

                return (
                  <button
                    key={plugin.id}
                    onClick={() => setActiveTab(tabId)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-left transition-all duration-150 ${
                      isPluginActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 text-left">
                      <PluginIcon className={`w-3.5 h-3.5 shrink-0 ${isPluginActive ? 'text-white' : 'text-indigo-400'}`} />
                      <span className="truncate text-left">{plugin.menuTitle || plugin.name}</span>
                    </div>
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${isPluginActive ? 'translate-x-0.5 text-white' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Store Quick Status Widget */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-800/60 border border-slate-700/50 text-left">
        <div className="flex items-center justify-between mb-2 text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Store Health</span>
          <span className="flex items-center gap-1 text-xs text-indigo-400 font-medium text-left">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" /> 99.8%
          </span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
          <div className="bg-indigo-500 h-full w-[88%] rounded-full"></div>
        </div>
        <div className="text-[11px] text-slate-400 flex justify-between text-left">
          <span>Target Sales</span>
          <span className="text-slate-200 font-medium">$25,000 / mo</span>
        </div>
      </div>

      {/* Seller Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40 text-left">
        <div className="flex items-center gap-3 min-w-0 text-left">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
            EH
          </div>
          <div className="truncate text-left">
            <p className="text-xs font-semibold text-slate-200 truncate text-left">Ehsan Seller</p>
            <p className="text-[11px] text-slate-500 truncate text-left">Pro Merchant</p>
          </div>
        </div>
      </div>
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center text-xs">
        <a href="https://github.com/ehsanking/seller" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors flex justify-center items-center gap-1.5">
          <span className="opacity-60">Engineered with</span>
          <span className="font-bold text-indigo-400">SELLER Core</span>
        </a>
      </div>
    </aside>
  );
};

