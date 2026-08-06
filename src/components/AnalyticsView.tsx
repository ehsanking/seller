import React from 'react';
import { AnalyticsSummary, Product } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
  products: Product[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, products }) => {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);
  const last7DaysData = (analytics.chartData || []).slice(-7);

  // CSV Export Handler
  const handleDownloadCSV = () => {
    const csvRows: (string | number)[][] = [];

    // Header Metadata
    csvRows.push(['SELLER Core - Sales Analytics Summary Report']);
    csvRows.push([`Generated Date: ${new Date().toLocaleDateString()}`]);
    csvRows.push([]);

    // Key Executive Metrics
    csvRows.push(['Executive Summary Metric', 'Value']);
    csvRows.push(['Total Revenue ($)', analytics.totalRevenue]);
    csvRows.push(['Revenue Growth (%)', analytics.revenueGrowth]);
    csvRows.push(['Total Orders Count', analytics.totalOrders]);
    csvRows.push(['Orders Growth (%)', analytics.ordersGrowth]);
    csvRows.push(['Average Order Value ($)', analytics.avgOrderValue]);
    csvRows.push(['Active Products Count', analytics.activeProducts]);
    csvRows.push(['Low Stock Items (<5 stock)', analytics.lowStockItems]);
    csvRows.push([]);

    // Daily Sales Breakdown (7-Day & Full Period)
    csvRows.push(['Daily Sales Performance Trend Data']);
    csvRows.push(['Date', 'Revenue ($)', 'Orders Count', 'Profit ($)']);
    analytics.chartData.forEach(item => {
      csvRows.push([item.date, item.revenue, item.orders, item.profit]);
    });
    csvRows.push([]);

    // Category Performance
    csvRows.push(['Sales Contribution by Category']);
    csvRows.push(['Category Name', 'Sales Volume ($)', 'Share Percentage (%)']);
    analytics.topCategories.forEach(cat => {
      csvRows.push([cat.category, cat.sales, cat.percentage]);
    });
    csvRows.push([]);

    // Top Selling Products
    csvRows.push(['Top Performing Products Ranking']);
    csvRows.push(['Rank', 'Product Title', 'SKU', 'Units Sold', 'Unit Price ($)', 'Gross Revenue ($)']);
    topProducts.forEach((p, index) => {
      csvRows.push([index + 1, `"${p.title.replace(/"/g, '""')}"`, p.sku, p.salesCount, p.price, p.salesCount * p.price]);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `seller-sales-summary-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Analytics Action Header Bar & CSV Export Button */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-slate-900">
              Sales Performance Analytics & Intelligence
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Live Recharts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive merchant sales velocity, 7-day trend analysis, category share, and data export
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Sales CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">
            ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{analytics.revenueGrowth}% vs prior period</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Orders Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">
            {analytics.totalOrders.toLocaleString()} orders
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{analytics.ordersGrowth}% growth</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">
            ${analytics.avgOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Per checkout conversion</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active SKUs & Stock</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">
            {analytics.activeProducts} SKUs
          </p>
          <p className="text-xs text-amber-600 font-bold">{analytics.lowStockItems} low stock items (&lt; 5)</p>
        </div>
      </div>

      {/* RECHARTS LINE CHART: Daily Sales Trends for the Last 7 Days */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h3 className="font-display font-bold text-base text-slate-900">
                7-Day Daily Sales Trends Line Chart
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily revenue, orders count, and gross profit trajectory across the last 7 days (Recharts LineChart)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Last 7 Days
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7DaysData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', padding: '10px 14px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '12px' }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Daily Revenue ($)" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#6366f1' }} 
                activeDot={{ r: 7 }} 
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Gross Profit ($)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#10b981' }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                name="Orders Count" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#f59e0b' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Performance Area Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Revenue Area Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Overall Revenue & Profit Area Chart</h3>
              <p className="text-xs text-slate-500">Cumulative revenue volume visualization</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">Full Timeline</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">Sales by Product Category</h3>
            <p className="text-xs text-slate-500 mb-4">Percentage contribution per category</p>

            <div className="space-y-3">
              {analytics.topCategories.map((cat, idx) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-900">${cat.sales.toLocaleString()} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Revenue Driver: <strong className="text-slate-900">Electronics</strong></span>
            <span className="font-bold text-emerald-600">+14% YoY</span>
          </div>
        </div>
      </div>

      {/* Top SKUs Velocity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Top Performing Products (SKUs)</h3>
            <p className="text-xs text-slate-500">Ranked by overall units sold</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Product Title</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Units Sold</th>
                <th className="py-2.5 px-3">Unit Price</th>
                <th className="py-2.5 px-3">Gross Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {topProducts.map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-indigo-600">#{index + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <img src={p.image} alt={p.title} className="w-8 h-8 rounded bg-slate-100 object-cover shrink-0" />
                    <span>{p.title}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{p.sku}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{p.salesCount} units</td>
                  <td className="py-3 px-3">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-3 font-bold text-emerald-600">
                    ${(p.salesCount * p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
