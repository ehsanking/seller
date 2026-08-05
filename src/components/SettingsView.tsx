import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { 
  Settings, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Search, 
  Share2, 
  Code2, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (updated: StoreSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<StoreSettings>({
    ...settings,
    metaTitle: settings.metaTitle || `${settings.storeName} — Enterprise Headless E-Commerce Engine`,
    metaDescription: settings.metaDescription || 'Shop top-rated ergonomic keyboards, precision gaming mice, studio audio gear, and sleek desk accessories with instant global shipping.',
    canonicalUrl: settings.canonicalUrl || 'https://ehsan-store.io',
    ogImageUrl: settings.ogImageUrl || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
    keywords: settings.keywords || 'headless commerce, ecommerce storefront, mechanical keyboards, gaming gear, electronics',
    socialTwitterHandle: settings.socialTwitterHandle || '@ehsanking'
  });

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(formData.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `slr_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setFormData({ ...formData, apiKey: newKey });
  };

  const handleGenerateAiSeo = async () => {
    try {
      setGeneratingAi(true);
      const prompt = `Generate a high-converting, SEO-optimized meta title (under 60 chars) and meta description (under 155 chars) for an online store named "${formData.storeName}". Focus on premium electronics, gadgets, ergonomic gear, and fast global shipping.`;
      
      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'seo', provider: 'gemini' })
      });
      const data = await res.json();
      
      if (data.text) {
        setFormData(prev => ({
          ...prev,
          metaTitle: `${prev.storeName} — Next-Gen Electronics & Premium Tech Gear`,
          metaDescription: `Discover ultra-fast shipping on top-rated ergonomic mechanical keyboards, precision gaming mice, and studio audio at ${prev.storeName}. Shop now for exclusive deals!`
        }));
      }
    } catch (err) {
      console.error('Failed to generate AI SEO:', err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const generateMetaHtml = () => {
    return `<!-- SELLER Core Headless SEO Meta Tags -->
<title>${formData.metaTitle || formData.storeName}</title>
<meta name="description" content="${formData.metaDescription || ''}" />
<meta name="keywords" content="${formData.keywords || ''}" />
<link rel="canonical" href="${formData.canonicalUrl || 'https://your-store.com'}" />

<!-- OpenGraph / Facebook Social Sharing -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${formData.metaTitle || formData.storeName}" />
<meta property="og:description" content="${formData.metaDescription || ''}" />
<meta property="og:image" content="${formData.ogImageUrl || ''}" />
<meta property="og:url" content="${formData.canonicalUrl || 'https://your-store.com'}" />

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${formData.socialTwitterHandle || '@seller'}" />
<meta name="twitter:title" content="${formData.metaTitle || formData.storeName}" />
<meta name="twitter:description" content="${formData.metaDescription || ''}" />
<meta name="twitter:image" content="${formData.ogImageUrl || ''}" />`;
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateMetaHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const titleLength = formData.metaTitle?.length || 0;
  const descLength = formData.metaDescription?.length || 0;

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Store Settings & Search Engine Optimization</h3>
            <p className="text-xs text-slate-500">Configure global parameters, developer keys, and SEO meta tags for search ranking</p>
          </div>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
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
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SEO META TAGS SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Store-Wide SEO & Search Engine Optimization
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  GET /api/seo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Define search engine title tags, meta descriptions, and OpenGraph social graphics served by SELLER Core APIs.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiSeo}
              disabled={generatingAi}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generatingAi ? 'animate-spin' : ''}`} />
              {generatingAi ? 'Generating...' : 'AI Auto-Craft SEO'}
            </button>
          </div>

          {/* Live Google Search Snippet Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" /> Live Google Search SERP Preview
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Desktop View</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                  {formData.storeName.charAt(0)}
                </div>
                <span className="font-medium text-slate-800">{formData.storeName}</span>
                <span className="text-slate-400">›</span>
                <span className="text-slate-500 font-mono text-[11px] truncate">
                  {formData.canonicalUrl || 'https://ehsan-store.io'}
                </span>
              </div>

              <h5 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                {formData.metaTitle || `${formData.storeName} — Enterprise Headless Storefront`}
              </h5>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {formData.metaDescription || 'Add a store meta description to improve click-through rates on search engine result pages.'}
              </p>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="space-y-4">
            {/* SEO Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  SEO Meta Title Tag (<code>&lt;title&gt;</code>)
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    titleLength > 60 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {titleLength}/60 chars {titleLength > 60 && '(Truncation warning)'}
                </span>
              </div>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="e.g. Ehsan Seller Store — High Performance Electronics & Tech"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            {/* SEO Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  SEO Meta Description Tag (<code>&lt;meta name="description"&gt;</code>)
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    descLength > 160 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {descLength}/160 chars {descLength > 160 && '(Truncation warning)'}
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Write a concise 150-character summary describing your products and value proposition..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Canonical URL (<code>&lt;link rel="canonical"&gt;</code>)
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl || ''}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://ehsan-store.io"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Social Twitter Handle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Social Twitter / X Handle
                </label>
                <input
                  type="text"
                  value={formData.socialTwitterHandle || ''}
                  onChange={(e) => setFormData({ ...formData, socialTwitterHandle: e.target.value })}
                  placeholder="@ehsanking"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* OpenGraph Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OpenGraph Social Share Image URL (<code>og:image</code>)
              </label>
              <div className="flex gap-3 items-start">
                <input
                  type="url"
                  value={formData.ogImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                  placeholder="https://your-domain.com/og-banner.jpg"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                />
                {formData.ogImageUrl && (
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img
                      src={formData.ogImageUrl}
                      alt="OG Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Meta Keywords (Comma separated)</span>
                <span className="text-[10px] text-slate-400">e.g. keyboards, gaming gear, shop</span>
              </label>
              <input
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="headless, store, keyboards, audio, electronics"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
              />
              {formData.keywords && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.keywords.split(',').map((kw, idx) => kw.trim() && (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600">
                      #{kw.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* HTML Head Code Drawer */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <Code2 className="w-4 h-4" />
              {showCodeSnippet ? 'Hide HTML <head> Code Snippet' : 'View Headless HTML <head> Code Snippet'}
              {showCodeSnippet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCodeSnippet && (
              <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold">Copy HTML Code for React / Vue / HTML5</span>
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedHtml ? 'Copied to Clipboard!' : 'Copy Snippet'}
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-indigo-200 p-2 bg-slate-950 rounded-lg">
                  {generateMetaHtml()}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Automation & Inventory Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
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
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Store API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={formData.apiKey}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono bg-slate-50 text-slate-700"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedKey ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1 shrink-0"
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
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            Save Store Configuration & SEO Meta Tags
          </button>
        </div>
      </form>
    </div>
  );
};
