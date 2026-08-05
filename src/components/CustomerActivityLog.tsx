import React, { useState, useEffect } from 'react';
import { Customer, CustomerActivity, CustomerActivityType } from '../types';
import { 
  X, 
  Clock, 
  MessageSquare, 
  ShoppingBag, 
  Mail, 
  RefreshCw, 
  Plus, 
  User, 
  Phone, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface CustomerActivityLogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerActivityLog: React.FC<CustomerActivityLogProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // New Note / Activity State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<CustomerActivityType>('support_note');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer && isOpen) {
      fetchActivities();
    }
  }, [customer, isOpen]);

  const fetchActivities = async () => {
    if (!customer) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${customer.id}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to load customer activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newTitle.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/customers/${customer.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          title: newTitle,
          description: newDescription,
          author: 'Ehsan (Store Manager)'
        })
      });
      const created = await res.json();
      setActivities(prev => [created, ...prev]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error('Failed to add activity log:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !customer) return null;

  const getActivityIcon = (type: CustomerActivityType) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'support_note':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'email_sent':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'status_change':
        return <Tag className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActivityBadgeColor = (type: CustomerActivityType) => {
    switch (type) {
      case 'order': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'support_note': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'email_sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'refund': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">{customer.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {customer.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{customer.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Quick Stats Bar */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 text-center divide-x divide-slate-200/80">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Spent</p>
            <p className="font-display font-bold text-base text-emerald-600">${customer.totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Orders</p>
            <p className="font-display font-bold text-base text-slate-900">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Last Order</p>
            <p className="font-mono text-xs font-semibold text-slate-700 mt-1">{customer.lastOrderDate}</p>
          </div>
        </div>

        {/* Content Body: Add Log + Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Support Interaction Form */}
          <form onSubmit={handleAddActivity} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> Log Support Note or Interaction
              </span>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as CustomerActivityType)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="support_note">💬 Support Note</option>
                <option value="email_sent">📧 Email Sent</option>
                <option value="refund">↩️ Refund Request</option>
                <option value="status_change">🏷️ VIP / Tag Change</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Title (e.g. Discussed Q3 volume discount request)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
              required
            />

            <textarea
              rows={2}
              placeholder="Additional details or follow-up notes..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newTitle.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Posting...' : 'Save Activity Note'}
              </button>
            </div>
          </form>

          {/* Activity Timeline List */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Customer Activity & Interaction History
            </h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading activity timeline...</div>
            ) : activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No activity logged for this customer yet.</div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Circle Icon Badge */}
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-2xs group-hover:border-indigo-600 transition">
                      {getActivityIcon(act.type)}
                    </div>

                    <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl space-y-1.5 shadow-2xs hover:shadow-xs transition">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{act.title}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getActivityBadgeColor(act.type)}`}>
                            {act.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {act.description && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                          {act.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>By: <strong className="text-slate-600">{act.author || 'System'}</strong></span>
                        {act.amount !== undefined && (
                          <span className="font-mono font-bold text-emerald-600">${act.amount.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
