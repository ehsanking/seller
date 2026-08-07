import React, { useState } from 'react';
import { Customer, CustomerNotification } from '../types';
import { 
  Send, 
  Sparkles, 
  Users, 
  Bell, 
  Mail, 
  Tag, 
  CheckCircle2, 
  RotateCw, 
  Filter, 
  Gift
} from 'lucide-react';

interface BulkNotificationComposerProps {
  customers: Customer[];
  onDispatchNotification: (newNotification: CustomerNotification) => void;
}

export const BulkNotificationComposer: React.FC<BulkNotificationComposerProps> = ({
  customers,
  onDispatchNotification
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<CustomerNotification['type']>('promo');
  const [targetSegment, setTargetSegment] = useState<'all' | 'vip' | 'recent'>('all');
  const [badgeText, setBadgeText] = useState('VIP10OFF');
  const [isSending, setIsSending] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleSendBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      // Filter target customers
      const targetedCustomers = customers.filter(c => {
        if (targetSegment === 'vip') return (c.totalSpent || 0) > 100;
        if (targetSegment === 'recent') return c.totalOrders && c.totalOrders > 0;
        return true;
      });

      // Dispatch notification for each targeted customer
      targetedCustomers.forEach(cust => {
        const notif: CustomerNotification = {
          id: `cust-notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          customerId: cust.id,
          title,
          message,
          type,
          isRead: false,
          createdAt: 'Just Now',
          badgeText: badgeText.trim() ? badgeText : undefined
        };
        onDispatchNotification(notif);
      });

      setSuccessCount(targetedCustomers.length);
      setIsSending(false);
      setTitle('');
      setMessage('');

      setTimeout(() => setSuccessCount(null), 4000);
    }, 1000);
  };

  const handleAiDraftPromo = async () => {
    setIsSending(true);
    try {
      const prompt = `Draft a high-converting e-commerce customer push notification / email for a store promo with a 10% discount code.
Return strictly valid JSON with keys:
"title" (short punchy title),
"message" (engaging notification message under 150 chars),
"badgeText" (promo code e.g. "SUMMER15")`;

      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'general', provider: 'gemini' })
      });

      if (res.ok) {
        const data = await res.json();
        try {
          const cleaned = (data.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          setTitle(parsed.title || '⚡ Flash VIP Storewide Sale!');
          setMessage(parsed.message || 'Enjoy 10% off your next order with our exclusive customer appreciation voucher.');
          setBadgeText(parsed.badgeText || 'VIP10OFF');
        } catch {
          setTitle('⚡ Exclusive Customer Reward!');
          setMessage('Thank you for being a valued customer. Use your voucher code for 10% off your next purchase.');
          setBadgeText('THANKYOU10');
        }
      }
    } catch (err) {
      console.error('AI draft error', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-slate-900">Customer Notification Center & Bulk Push</h4>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-800 rounded-md">
                Multi-Channel Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Compose, preview, and send bulk push or email notifications to customers based on engagement history.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAiDraftPromo}
          disabled={isSending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>AI Draft Promo Campaign</span>
        </button>
      </div>

      {successCount !== null && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Successfully broadcasted notification to <strong className="text-emerald-950">{successCount} customer profiles</strong>!</span>
        </div>
      )}

      {/* Composer Form */}
      <form onSubmit={handleSendBulk} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notification Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            >
              <option value="promo">Promo / Discount Code 🏷️</option>
              <option value="coupon">Exclusive Coupon 🎁</option>
              <option value="back_in_stock">Back in Stock Alert 📦</option>
              <option value="order_status">Order & Shipping Update 🚚</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Audience Segment</label>
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            >
              <option value="all">All Customers ({customers.length} users)</option>
              <option value="vip">VIP High-Spend Customers ($100+ LTV)</option>
              <option value="recent">Active Purchasers with Order History</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Coupon / Badge Code (Optional)</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. VIP10OFF"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Notification Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ⚡ Flash Weekend Special: 10% Off All Orders!"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Notification Message Body</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your broadcast message here..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            required
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Will broadcast to all matching customer notification inboxes instantly.
          </span>
          <button
            type="submit"
            disabled={isSending}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-indigo-300" />
                <span>Send Bulk Notification</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
