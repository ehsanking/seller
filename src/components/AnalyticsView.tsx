import React from 'react';
import { AnalyticsSummary, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Layers, DollarSign } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
  products: Product[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, products }) => {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Category Sales Breakdown & Daily Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Daily Order Volume & Revenue</h3>
              <p className="text-xs text-slate-500">Breakdown of orders processed per day</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">Last 8 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">Sales by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Percentage contribution per product category</p>

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
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
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
