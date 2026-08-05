import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { Settings, Key, Globe, RefreshCw, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (updated: StoreSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(formData.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `slr_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setFormData({ ...formData, apiKey: newKey });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Store Settings & Developer API</h3>
            <p className="text-xs text-slate-500">Manage store parameters, tax rates, and external integrations</p>
          </div>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Store Identity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Automation & Inventory Rules */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Automation & Stock Safeguards
          </h4>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Auto-Sync Stock Levels across Channels</p>
              <p className="text-[11px] text-slate-500">Deduct inventory automatically when an order is received</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoSyncInventory}
              onChange={(e) => setFormData({ ...formData, autoSyncInventory: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-slate-900">Low Stock Reorder Alert Threshold</p>
              <p className="text-[11px] text-slate-500">Highlight products on dashboard when quantity drops below</p>
            </div>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 5 })}
              className="w-20 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-center font-bold"
            />
          </div>
        </div>

        {/* API & Webhook Integrations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" /> Webhook & External API Access
            </h4>
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              WooCommerce / Shopify Supported
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Incoming Webhook Endpoint URL</label>
            <input
              type="text"
              value={formData.apiWebhookUrl}
              onChange={(e) => setFormData({ ...formData, apiWebhookUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Store API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={formData.apiKey}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono bg-slate-50 text-slate-700"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regen
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
