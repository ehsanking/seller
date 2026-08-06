import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Package, 
  Users, 
  ShoppingBag, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Plug, 
  Palette, 
  Plus, 
  ArrowRight, 
  CornerDownLeft, 
  X, 
  Sparkles, 
  RefreshCw, 
  Tag, 
  DollarSign, 
  Layers, 
  Globe, 
  Webhook,
  Building2,
  ShieldCheck,
  Percent,
  Compass
} from 'lucide-react';
import { Product, Customer, Order, NavigationTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  onNavigate: (tab: NavigationTab, search?: string) => void;
  onOpenAddProduct: () => void;
  onOpenAddOrder: () => void;
  onRefreshData: () => void;
}

type PaletteCategory = 'all' | 'products' | 'customers' | 'orders' | 'navigation' | 'actions';

interface SearchResultItem {
  id: string;
  type: 'product' | 'customer' | 'order' | 'navigation' | 'action';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  products = [],
  customers = [],
  orders = [],
  onNavigate,
  onOpenAddProduct,
  onOpenAddOrder,
  onRefreshData
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PaletteCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent or direct state if controlled
          // Parent handles opening if passed trigger, but if opened, focus input
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Quick navigation items
  const navigationItems: SearchResultItem[] = [
    {
      id: 'nav-dashboard',
      type: 'navigation',
      title: 'Store Dashboard',
      subtitle: 'Overview, analytics & sales velocity',
      badge: 'View',
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'nav-products',
      type: 'navigation',
      title: 'Products Inventory',
      subtitle: 'Manage catalog, stock & pricing',
      badge: `${products.length} Items`,
      badgeColor: 'bg-indigo-50 text-indigo-700',
      icon: <Package className="w-4 h-4 text-blue-500" />,
      action: () => { onNavigate('products'); onClose(); }
    },
    {
      id: 'nav-orders',
      type: 'navigation',
      title: 'Orders Management',
      subtitle: 'Track fulfillments & invoice factors',
      badge: `${orders.length} Orders`,
      badgeColor: 'bg-amber-50 text-amber-700',
      icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
      action: () => { onNavigate('orders'); onClose(); }
    },
    {
      id: 'nav-customers',
      type: 'navigation',
      title: 'Customer Directory',
      subtitle: 'Customer accounts, CRM & spend history',
      badge: `${customers.length} Accounts`,
      badgeColor: 'bg-emerald-50 text-emerald-700',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigate('customers'); onClose(); }
    },
    {
      id: 'nav-analytics',
      type: 'navigation',
      title: 'Analytics & Insights',
      subtitle: 'Revenue curves & product sales velocity',
      badge: 'Reports',
      badgeColor: 'bg-purple-50 text-purple-700',
      icon: <BarChart3 className="w-4 h-4 text-purple-500" />,
      action: () => { onNavigate('analytics'); onClose(); }
    },
    {
      id: 'nav-settings',
      type: 'navigation',
      title: 'Store Settings',
      subtitle: 'General, currency & payment gateways',
      badge: 'Config',
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      action: () => { onNavigate('settings'); onClose(); }
    },
    {
      id: 'nav-coupons',
      type: 'navigation',
      title: 'Discount Coupons',
      subtitle: 'Promotional rules & discount codes',
      badge: 'Promos',
      badgeColor: 'bg-rose-50 text-rose-700',
      icon: <Percent className="w-4 h-4 text-rose-500" />,
      action: () => { onNavigate('coupons'); onClose(); }
    },
    {
      id: 'nav-plugins',
      type: 'navigation',
      title: 'Plugins & Extensions',
      subtitle: 'WooCommerce & custom addon integrations',
      badge: 'Addons',
      badgeColor: 'bg-cyan-50 text-cyan-700',
      icon: <Plug className="w-4 h-4 text-cyan-500" />,
      action: () => { onNavigate('plugins'); onClose(); }
    },
    {
      id: 'nav-seo',
      type: 'navigation',
      title: 'SEO & Webmaster Tools',
      subtitle: 'Sitemaps, indexing & meta tags',
      badge: 'SEO',
      badgeColor: 'bg-teal-50 text-teal-700',
      icon: <Globe className="w-4 h-4 text-teal-500" />,
      action: () => { onNavigate('seo'); onClose(); }
    }
  ];

  // Quick Action items
  const actionItems: SearchResultItem[] = [
    {
      id: 'act-add-product',
      type: 'action',
      title: 'Create New Product',
      subtitle: 'Add a new product with stock and pricing',
      badge: 'Action',
      badgeColor: 'bg-indigo-600 text-white',
      icon: <Plus className="w-4 h-4 text-indigo-600" />,
      action: () => { onOpenAddProduct(); onClose(); }
    },
    {
      id: 'act-add-order',
      type: 'action',
      title: 'Create New Order',
      subtitle: 'Manual order entry for walk-in or online client',
      badge: 'Action',
      badgeColor: 'bg-emerald-600 text-white',
      icon: <Plus className="w-4 h-4 text-emerald-600" />,
      action: () => { onOpenAddOrder(); onClose(); }
    },
    {
      id: 'act-refresh',
      type: 'action',
      title: 'Refresh All Store Data',
      subtitle: 'Sync latest orders, stock levels & metrics',
      badge: 'Sync',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
      action: () => { onRefreshData(); onClose(); }
    }
  ];

  // Compute Search Results dynamically
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Products
    const productResults: SearchResultItem[] = products
      .filter(p => !q || 
        p.title.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      )
      .slice(0, 8)
      .map(p => ({
        id: `prod-${p.id}`,
        type: 'product',
        title: p.title,
        subtitle: `SKU: ${p.sku} • Category: ${p.category} • Stock: ${p.stockQuantity} units`,
        badge: `$${p.price.toFixed(2)}`,
        badgeColor: 'bg-emerald-100 text-emerald-800 font-mono font-bold',
        icon: <Package className="w-4 h-4 text-indigo-500" />,
        action: () => {
          onNavigate('products', p.title);
          onClose();
        }
      }));

    // 2. Customers
    const customerResults: SearchResultItem[] = customers
      .filter(c => !q || 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
      )
      .slice(0, 8)
      .map(c => ({
        id: `cust-${c.id}`,
        type: 'customer',
        title: c.name,
        subtitle: `${c.email} • ${c.totalOrders} orders • Spent: $${c.totalSpent.toFixed(2)}`,
        badge: c.status || 'active',
        badgeColor: 'bg-blue-100 text-blue-800 font-semibold',
        icon: <Users className="w-4 h-4 text-blue-500" />,
        action: () => {
          onNavigate('customers', c.name);
          onClose();
        }
      }));

    // 3. Orders
    const orderResults: SearchResultItem[] = orders
      .filter(o => !q || 
        o.orderNumber.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) || 
        o.customerEmail.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map(o => ({
        id: `ord-${o.id}`,
        type: 'order',
        title: `Order #${o.orderNumber}`,
        subtitle: `Customer: ${o.customerName} (${o.customerEmail}) • Status: ${o.status.toUpperCase()}`,
        badge: `$${o.totalAmount.toFixed(2)}`,
        badgeColor: 'bg-amber-100 text-amber-800 font-mono font-bold',
        icon: <ShoppingBag className="w-4 h-4 text-amber-500" />,
        action: () => {
          onNavigate('orders', o.orderNumber);
          onClose();
        }
      }));

    // 4. Navigation
    const navResults = navigationItems.filter(n => !q || 
      n.title.toLowerCase().includes(q) || 
      n.subtitle.toLowerCase().includes(q)
    );

    // 5. Actions
    const actResults = actionItems.filter(a => !q || 
      a.title.toLowerCase().includes(q) || 
      a.subtitle.toLowerCase().includes(q)
    );

    // Filter by Category if selected
    if (category === 'products') return productResults;
    if (category === 'customers') return customerResults;
    if (category === 'orders') return orderResults;
    if (category === 'navigation') return navResults;
    if (category === 'actions') return actResults;

    // All category: combine
    if (!q) {
      return [...actResults, ...navResults];
    }

    return [...productResults, ...customerResults, ...orderResults, ...navResults, ...actResults];
  }, [query, category, products, customers, orders]);

  // Ensure selectedIndex remains in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, category]);

  // Keyboard navigation inside the results list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        selected.action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-start justify-center pt-[10vh] px-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers, or jump to view..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-[10px] font-mono font-bold shrink-0">
            ESC
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 ${
              category === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setCategory('products')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
              category === 'products' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Products ({products.length})
          </button>
          <button
            onClick={() => setCategory('customers')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
              category === 'customers' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Customers ({customers.length})
          </button>
          <button
            onClick={() => setCategory('orders')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
              category === 'orders' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setCategory('navigation')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
              category === 'navigation' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Views
          </button>
          <button
            onClick={() => setCategory('actions')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
              category === 'actions' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Actions
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-600">No matching results found</p>
              <p className="text-xs text-slate-400">Try searching for product titles, SKUs, customer names, or order numbers.</p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between transition cursor-pointer border ${
                    isSelected 
                      ? 'bg-indigo-50/80 border-indigo-200 text-slate-900 shadow-2xs' 
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border shrink-0 ${
                      isSelected ? 'bg-white border-indigo-200' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal capitalize">
                          [{item.type}]
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isSelected ? (
                      <span className="flex items-center text-[10px] font-bold text-indigo-600 gap-1 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                        <CornerDownLeft className="w-3 h-3" /> Select
                      </span>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Tips */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="font-semibold text-indigo-600">Seller Core Palette</span>
        </div>

      </div>
    </div>
  );
};
