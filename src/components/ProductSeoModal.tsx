import React, { useState, useEffect } from 'react';
import { X, Search, Globe, Share2, CheckCircle2, AlertTriangle, Sparkles, Copy, Check, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveSeo: (productId: string, updates: { metaTitle: string; metaDescription: string; urlSlug: string }) => Promise<void>;
}

export const ProductSeoModal: React.FC<ProductSeoModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveSeo,
}) => {
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState<'google_desktop' | 'google_mobile' | 'social_og'>('google_desktop');
  const [saving, setSaving] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  useEffect(() => {
    if (product) {
      setMetaTitle(product.metaTitle || `${product.title} | Buy Online at Ehsan Store`);
      setMetaDescription(
        product.metaDescription ||
          `Shop ${product.title} for $${product.price.toFixed(2)}. In stock with fast shipping, 30-day returns, and official warranty at Ehsan Seller Store.`
      );
      setUrlSlug(
        product.urlSlug ||
          product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      );
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  // SEO Score Calculations
  const isTitleOptimal = titleLength >= 40 && titleLength <= 60;
  const isDescOptimal = descLength >= 120 && descLength <= 160;
  const isSlugValid = urlSlug.length > 3 && !/\s/.test(urlSlug);
  const hasCategoryInDesc = metaDescription.toLowerCase().includes(product.category.toLowerCase());

  const totalPassedChecks = [isTitleOptimal, isDescOptimal, isSlugValid, hasCategoryInDesc].filter(Boolean).length;
  const seoScore = Math.round((totalPassedChecks / 4) * 100);

  const displayUrl = `https://ehsan-store.io/products/${urlSlug || 'product-sku'}`;

  // JSON-LD Structured Data Schema
  const jsonLdSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": metaTitle || product.title,
    "image": [product.image],
    "description": metaDescription,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "url": displayUrl,
      "priceCurrency": "USD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSaveSeo(product.id, {
        metaTitle,
        metaDescription,
        urlSlug,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save SEO metadata:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerateAiSeo = () => {
    setMetaTitle(`${product.title} — Premium ${product.category} | Official Store`);
    setMetaDescription(
      `Upgrade your workflow with the ${product.title}. Premium build quality, $${product.price.toFixed(
        2
      )} MSRP, instant express delivery, and 100% satisfaction guarantee.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">SEO Snippet & Metadata Optimizer</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 rounded-full">
                  SKU: {product.sku}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Optimize search engine listing title, meta description & social OpenGraph cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* SEO Health Score Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={138}
                    strokeDashoffset={138 - (138 * seoScore) / 100}
                    className={`${seoScore >= 75 ? 'text-emerald-400' : seoScore >= 50 ? 'text-amber-400' : 'text-rose-400'} transition-all duration-500`}
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-xs font-black font-mono">{seoScore}%</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">SEO Health Index</p>
                <h4 className="text-sm font-bold text-white">
                  {seoScore >= 75 ? 'Optimal Search Listing' : seoScore >= 50 ? 'Good Listing — Minor Tweaks Needed' : 'Needs Optimization'}
                </h4>
                <p className="text-xs text-slate-300">
                  {totalPassedChecks} of 4 search engine optimization criteria fulfilled
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoGenerateAiSeo}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI Optimize Metadata
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Meta Title (Page Title)</label>
                  <span className={`text-[11px] font-mono font-bold ${isTitleOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {titleLength} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Product Title — Buy Online | Brand"
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">Recommended length: 50–60 characters for clean SERP titles.</p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Meta Description</label>
                  <span className={`text-[11px] font-mono font-bold ${isDescOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {descLength} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Detailed summary of product features, pricing, and benefits..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">Recommended length: 120–160 characters for search snippet previews.</p>
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Permalink Slug</label>
                <div className="flex rounded-lg shadow-xs">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-[11px] font-mono">
                    /products/
                  </span>
                  <input
                    type="text"
                    value={urlSlug}
                    onChange={(e) => setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-300 rounded-r-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Automated SEO Audits</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Meta Title length (50-60 chars)</span>
                  {isTitleOptimal ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal</span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> Sub-optimal</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Description length (120-160 chars)</span>
                  {isDescOptimal ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal</span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> Sub-optimal</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Clean URL slug structure</span>
                  {isSlugValid ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Valid</span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> Invalid Slug</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Category keyword ({product.category}) present</span>
                  {hasCategoryInDesc ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Included</span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400 font-semibold">Optional</span>
                  )}
                </div>
              </div>
            </form>

            {/* Live Snippet Preview Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  Live Search Result Preview
                </label>

                {/* Snippet Tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('google_desktop')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                      activePreviewTab === 'google_desktop' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Google Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('google_mobile')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                      activePreviewTab === 'google_mobile' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Google Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('social_og')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                      activePreviewTab === 'social_og' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Social Card
                  </button>
                </div>
              </div>

              {/* Preview Cards */}
              {activePreviewTab === 'google_desktop' && (
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1 font-sans">
                  <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      E
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#202124] leading-tight">Ehsan Seller Store</span>
                      <span className="text-[11px] text-[#4d5156] leading-tight font-mono truncate max-w-sm">{displayUrl}</span>
                    </div>
                  </div>
                  <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-normal line-clamp-1">
                    {metaTitle || 'Product Title'}
                  </h3>
                  <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                    {metaDescription || 'Product description will appear here as Google snippet text.'}
                  </p>
                </div>
              )}

              {activePreviewTab === 'google_mobile' && (
                <div className="max-w-xs mx-auto p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      E
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-semibold text-[#202124]">Ehsan Seller Store</span>
                      <span className="text-[10px] text-[#4d5156] font-mono truncate">{displayUrl}</span>
                    </div>
                  </div>
                  <h3 className="text-base text-[#1a0dab] font-medium leading-snug line-clamp-2">
                    {metaTitle || 'Product Title'}
                  </h3>
                  <p className="text-xs text-[#4d5156] leading-normal line-clamp-3 mt-1">
                    {metaDescription || 'Product description snippet on mobile SERP result.'}
                  </p>
                </div>
              )}

              {activePreviewTab === 'social_og' && (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                  <div className="h-36 bg-slate-200 overflow-hidden relative">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-slate-900/80 text-white rounded backdrop-blur-xs">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3.5 bg-white space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EHSAN-STORE.IO</span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{metaTitle || product.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{metaDescription}</p>
                  </div>
                </div>
              )}

              {/* JSON-LD Schema Code View */}
              <div className="mt-4 p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto relative">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Structured Data (Schema.org JSON-LD)</span>
                  <button
                    type="button"
                    onClick={handleCopyJsonLd}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] transition cursor-pointer"
                  >
                    {copiedJsonLd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedJsonLd ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                  {JSON.stringify(jsonLdSchema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving Metadata...' : 'Save SEO Metadata'}
          </button>
        </div>
      </div>
    </div>
  );
};
