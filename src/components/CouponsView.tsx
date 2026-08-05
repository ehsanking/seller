import React, { useState } from 'react';
import { Coupon } from '../types';
import { 
  Ticket, Plus, Search, Calendar, DollarSign, Percent, Copy, CheckCircle, 
  Trash2, ToggleLeft, ToggleRight, AlertCircle, Info, TrendingUp, BarChart3,
  Flame, ShoppingCart, Power
} from 'lucide-react';

interface CouponsViewProps {
  coupons: Coupon[];
  onAddCoupon: (couponData: Partial<Coupon>) => Promise<void>;
  onUpdateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  onDeleteCoupon: (id: string) => Promise<void>;
}

export function CouponsView({
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon
}: CouponsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for creating new coupon
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      !!(c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const isExpired = !!(c.endDate && todayStr > c.endDate);
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = c.isActive && !isExpired;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !c.isActive;
    } else if (statusFilter === 'expired') {
      matchesStatus = isExpired;
    }

    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!code.trim()) {
      setError('Please provide a coupon code.');
      setIsSubmitting(false);
      return;
    }

    if (value <= 0) {
      setError('Discount value must be greater than zero.');
      setIsSubmitting(false);
      return;
    }

    if (type === 'percentage' && value > 100) {
      setError('Percentage discount cannot exceed 100%.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onAddCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
        usageLimit: Number(usageLimit),
        startDate,
        endDate,
        description
      });
      
      // Reset form
      setCode('');
      setType('percentage');
      setValue(10);
      setMinOrderAmount(0);
      setUsageLimit(100);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setDescription('');
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create coupon code. It might already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCouponActive = async (id: string, currentStatus: boolean) => {
    try {
      await onUpdateCoupon(id, { isActive: !currentStatus });
    } catch (err) {
      console.error(err);
    }
  };

  // Basic coupon analytics
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
  const activeCount = coupons.filter(c => c.isActive && (!c.endDate || todayStr <= c.endDate)).length;
  const expiredCount = coupons.filter(c => c.endDate && todayStr > c.endDate).length;

  return (
    <div className="space-y-6">
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-indigo-600" />
            <span>Discount Coupons Manager</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Grow sales with custom Shopify/WooCommerce style promotional rules, discount codes, & campaign targeting.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-md shadow-indigo-500/15"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Codes</span>
            <span className="text-xl font-extrabold text-slate-800">{coupons.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Campaigns</span>
            <span className="text-xl font-extrabold text-slate-800">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Coupon Uses</span>
            <span className="text-xl font-extrabold text-slate-800">{totalUses}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Expired/Scheduled</span>
            <span className="text-xl font-extrabold text-slate-800">{expiredCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter Status:</span>
          {[
            { key: 'all', label: 'All Coupons' },
            { key: 'active', label: 'Active' },
            { key: 'inactive', label: 'Inactive' },
            { key: 'expired', label: 'Expired' }
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === opt.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table/List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {filteredCoupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-700 text-sm">No Coupon Codes Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create discount coupons with fixed amounts or percentages, usage boundaries, and date limits to increase cart conversion rate.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-6">Discount / Value</th>
                  <th className="py-3.5 px-6">Campaign Info & Dates</th>
                  <th className="py-3.5 px-6">Minimum Purchase</th>
                  <th className="py-3.5 px-6 text-center">Usage Progress</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.endDate && todayStr > coupon.endDate;
                  const isScheduled = coupon.startDate && todayStr < coupon.startDate;
                  const usagePercentage = coupon.usageLimit > 0 
                    ? Math.round((coupon.usedCount / coupon.usageLimit) * 100) 
                    : 0;

                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50/50 transition">
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code, coupon.id)}
                            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition"
                            title="Copy code"
                          >
                            {copiedId === coupon.id ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Type and Value */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          {coupon.type === 'percentage' ? (
                            <>
                              <Percent className="w-4 h-4 text-emerald-500" />
                              <span className="font-extrabold text-sm text-slate-800">{coupon.value}% OFF</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 text-indigo-500" />
                              <span className="font-extrabold text-sm text-slate-800">${coupon.value} OFF</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Campaign / Descriptions */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {coupon.description || 'Seasonal Store Discount'}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{coupon.startDate} to {coupon.endDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Min Order Limit */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-slate-600">
                          {coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount}+ orders` : 'No Minimum'}
                        </span>
                      </td>

                      {/* Usage Limits */}
                      <td className="py-4 px-6">
                        <div className="space-y-1.5 max-w-[120px] mx-auto text-center">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>{coupon.usedCount} used</span>
                            <span>{coupon.usageLimit > 0 ? `${coupon.usageLimit} max` : 'Unlimited'}</span>
                          </div>
                          {coupon.usageLimit > 0 && (
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  usagePercentage >= 90 ? 'bg-rose-500' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {!coupon.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                            <Power className="w-3 h-3" /> Inactive
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold">
                            Expired
                          </span>
                        ) : isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                            Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold animate-pulse">
                            Active 🟢
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleCouponActive(coupon.id, coupon.isActive)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                            title={coupon.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                          >
                            {coupon.isActive ? (
                              <ToggleRight className="w-6 h-6 text-indigo-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-slate-300" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this coupon?')) {
                                onDeleteCoupon(coupon.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: CREATE COUPON */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                <span>Create Discount Coupon</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-left">
              {/* Code */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  placeholder="e.g. SUMMER50"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-extrabold text-indigo-600 uppercase placeholder:normal-case focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {type === 'percentage' ? 'Percentage Value' : 'Fixed Amount ($)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-extrabold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Min Order & Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Order Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campaign Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Black Friday 20% discount"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
