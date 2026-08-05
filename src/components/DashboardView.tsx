import React from 'react';
import { ApiHealthWidget } from './ApiHealthWidget';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AnalyticsSummary, Order, Product, NavigationTab } from '../types';

interface DashboardViewProps {
  analytics: AnalyticsSummary;
  products: Product[];
  orders: Order[];
  setActiveTab: (tab: NavigationTab) => void;
  onOpenAddProductModal: () => void;
  onOpenAddOrderModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  products,
  orders,
  setActiveTab,
  onOpenAddProductModal,
  onOpenAddOrderModal,
}) => {
  // Threshold-based low stock alert calculation per product
  const lowStockProducts = products.filter(p => p.stockQuantity <= (p.lowStockThreshold ?? 10));
  const recentOrders = orders.slice(0, 5);

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Processing</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900">
              ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{analytics.revenueGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs. previous 30 days</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900">
              {analytics.totalOrders.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{analytics.ordersGrowth}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Completed & in fulfillment</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900">
              ${analytics.avgOrderValue.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Per order
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated across store orders</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-slate-900">
              {analytics.activeProducts} SKUs
            </span>
            {lowStockProducts.length > 0 ? (
              <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" /> {lowStockProducts.length} low stock
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">Stock healthy</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Threshold alert active</p>
        </div>
      </div>

      {/* Revenue Performance Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Store Revenue Performance</h3>
            <p className="text-xs text-slate-500">Daily sales revenue trends and estimated net profit</p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
          >
            View Full Report <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`$${value}`, '']}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-500">Latest transactions requiring fulfillment</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              See All Orders ({orders.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-[140px]">
                  <p className="text-xs font-bold text-slate-900">{order.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">{order.customerName}</p>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </div>
                <div className="text-xs font-bold text-slate-900">
                  ${order.totalAmount.toFixed(2)}
                </div>
                <div>{getOrderStatusBadge(order.status)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-base text-slate-900">Inventory Alert</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {lowStockProducts.length} Items Below Limit
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Threshold-based low stock monitor per SKU</p>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs text-center font-medium border border-emerald-100">
                  🎉 All product inventory levels are healthy!
                </div>
              ) : (
                lowStockProducts.map((p) => {
                  const thresh = p.lowStockThreshold ?? 10;
                  return (
                    <div key={p.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image} alt={p.title} className="w-9 h-9 rounded bg-slate-100 object-cover shrink-0 border border-amber-200" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Limit: {thresh} units</p>
                        </div>
                      </div>
                      <span className="shrink-0 px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs font-bold font-mono">
                        {p.stockQuantity} left
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer"
          >
            Manage Inventory & Thresholds
          </button>
        </div>
      </div>

      {/* API Health & Developer Gateway Telemetry */}
      <ApiHealthWidget />
    </div>
  );
};
