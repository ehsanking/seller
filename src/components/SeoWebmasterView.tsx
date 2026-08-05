import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Check, 
  RotateCw, 
  ExternalLink, 
  Save, 
  FileCode, 
  Send, 
  Sparkles, 
  Code, 
  Bot, 
  ListTree,
  AlertCircle,
  Copy,
  Download,
  Eye
} from 'lucide-react';
import { SeoWebmasterSettings, Product } from '../types';

interface SeoWebmasterViewProps {
  products?: Product[];
  seoSettings?: SeoWebmasterSettings | null;
  onSaveSeoSettings?: (updated: SeoWebmasterSettings) => Promise<void>;
}

export const SeoWebmasterView: React.FC<SeoWebmasterViewProps> = ({ 
  products = [],
  seoSettings: initialSeo,
  onSaveSeoSettings
}) => {
  const [seo, setSeo] = useState<SeoWebmasterSettings | null>(initialSeo || null);
  const [loading, setLoading] = useState(!initialSeo);

  useEffect(() => {
    if (initialSeo) {
      setSeo(initialSeo);
      setLoading(false);
    } else {
      fetchSeoSettings();
    }
  }, [initialSeo]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'webmaster' | 'sitemap' | 'robots' | 'serp'>('general');

  // IndexNow Instant Indexing Ping State
  const [pingingIndexNow, setPingingIndexNow] = useState(false);
  const [indexNowResponse, setIndexNowResponse] = useState<any>(null);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seo');
      if (res.ok) {
        const data = await res.json();
        setSeo(data);
      }
    } catch (err) {
      console.error('Failed to fetch SEO settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setSaving(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seo)
      });
      if (res.ok) {
        const updated = await res.json();
        setSeo(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save SEO settings', err);
    } finally {
      setSaving(false);
    }
  };

  const triggerIndexNowPing = async () => {
    setPingingIndexNow(true);
    try {
      const res = await fetch('/api/seo/ping-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlList: [
            seo?.canonicalUrl || 'https://ehsan-store.io',
            `${seo?.canonicalUrl || 'https://ehsan-store.io'}/products`,
            ...products.slice(0, 5).map(p => `${seo?.canonicalUrl || 'https://ehsan-store.io'}/products/${p.id}`)
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setIndexNowResponse(data);
      }
    } catch (err) {
      console.error('IndexNow ping failed', err);
    } finally {
      setPingingIndexNow(false);
    }
  };

  const copySitemapUrl = () => {
    const url = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(url);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  if (loading || !seo) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 gap-3">
        <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold">Loading Search Engine Webmaster Standards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Google & Bing Webmaster SEO Standards</h1>
            <p className="text-xs text-slate-500">Schema.org JSON-LD, XML Sitemaps, IndexNow API, and Search Console Verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition cursor-pointer"
          >
            <ListTree className="w-3.5 h-3.5 text-indigo-600" />
            <span>View /sitemap.xml</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>View /robots.txt</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Google & Bing SEO settings saved successfully! Changes take effect immediately across all endpoints.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-2xl">
        {[
          { id: 'general', label: 'Meta & Canonical Tags', icon: FileCode },
          { id: 'webmaster', label: 'Google Console & Bing IndexNow', icon: Search },
          { id: 'serp', label: 'Google & Bing SERP Preview', icon: Eye },
          { id: 'sitemap', label: 'XML Sitemap & Feeds', icon: ListTree },
          { id: 'robots', label: 'Robots.txt Editor', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSaveSeo} className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200 shadow-xs space-y-6">
        {/* Tab 1: General Meta Tags */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs font-medium text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Global Site Title</label>
                <input 
                  type="text"
                  value={seo.siteTitle}
                  onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title Template Structure</label>
                <input 
                  type="text"
                  value={seo.titleTemplate}
                  onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="%s | Brand Name"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-slate-700">Meta Description (Target: 150-160 chars)</label>
                <span className={`text-[11px] font-bold ${seo.metaDescription.length > 160 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {seo.metaDescription.length} / 160 Characters
                </span>
              </div>
              <textarea 
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Canonical Base Domain URL</label>
                <input 
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="https://ehsan-store.io"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">OpenGraph / Social Share Default Image</label>
                <input 
                  type="url"
                  value={seo.defaultOgImage}
                  onChange={(e) => setSeo({ ...seo, defaultOgImage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Webmaster Verification & IndexNow */}
        {activeTab === 'webmaster' && (
          <div className="space-y-5 text-xs font-medium text-slate-800">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Google Search Console Verification Tag</span>
              </div>
              <p className="text-[11px] text-blue-700">Paste your html-tag code provided by Google Search Console to prove store ownership.</p>
              <input 
                type="text"
                value={seo.googleSiteVerification}
                onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white font-mono text-slate-800 focus:ring-2 focus:ring-blue-500"
                placeholder="google-site-verification=XXXXXXXXXXXXXXX"
              />
            </div>

            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Bing Webmaster Tools Verification Tag</span>
              </div>
              <p className="text-[11px] text-teal-700">Paste your Bing Webmaster meta verification code for Bing and Yahoo indexing.</p>
              <input 
                type="text"
                value={seo.bingSiteVerification}
                onChange={(e) => setSeo({ ...seo, bingSiteVerification: e.target.value })}
                className="w-full px-3 py-2 border border-teal-300 rounded-lg bg-white font-mono text-slate-800 focus:ring-2 focus:ring-teal-500"
                placeholder="bing-site-verification=XXXXXXXXXXXXXXX"
              />
            </div>

            {/* IndexNow Ping Tool */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-indigo-600" />
                    <span>Microsoft IndexNow & Google Crawler Instant Ping API</span>
                  </h3>
                  <p className="text-[11px] text-indigo-700">Notify search engine bots immediately when products or prices are updated.</p>
                </div>

                <button
                  type="button"
                  onClick={triggerIndexNowPing}
                  disabled={pingingIndexNow}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {pingingIndexNow ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ping Crawlers...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit IndexNow Request</span>
                    </>
                  )}
                </button>
              </div>

              {indexNowResponse && (
                <div className="p-3 bg-white border border-indigo-200 rounded-lg text-xs font-mono text-indigo-900 space-y-1 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1 text-emerald-600">
                    <Check className="w-4 h-4" />
                    <span>{indexNowResponse.message}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">URLs Transmitted: {indexNowResponse.urlsSubmitted.length} endpoints</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: SERP Preview */}
        {activeTab === 'serp' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Google SERP Desktop Preview</span>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-700 truncate">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{seo.canonicalUrl || 'https://ehsan-store.io'}</span>
                </div>
                <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer line-clamp-1">
                  {seo.siteTitle}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {seo.metaDescription}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bing SERP Snippet Preview</span>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-xs text-teal-800 font-medium truncate">
                  {seo.canonicalUrl || 'https://ehsan-store.io'}
                </div>
                <h3 className="text-base font-medium text-teal-700 hover:underline cursor-pointer line-clamp-1">
                  {seo.siteTitle}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {seo.metaDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: XML Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Dynamic Google & Bing Compliant XML Sitemap</h3>
                <p className="text-[11px] text-slate-500">Auto-generated XML sitemap featuring image tags, priority levels, and modification timestamps.</p>
              </div>
              <button
                type="button"
                onClick={copySitemapUrl}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSitemap ? 'Copied!' : 'Copy Sitemap URL'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto max-h-72">
              <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${seo.canonicalUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${seo.canonicalUrl}/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
${products.slice(0, 3).map(p => `  <url>
    <loc>${seo.canonicalUrl}/products/${p.id}</loc>
    <lastmod>${p.createdAt ? p.createdAt.split('T')[0] : '2026-08-05'}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <!-- Total ${products.length + 2} URLs dynamically generated -->
</urlset>`}</pre>
            </div>
          </div>
        )}

        {/* Tab 5: Robots.txt */}
        {activeTab === 'robots' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Live /robots.txt Content</label>
              <textarea 
                rows={8}
                value={seo.robotsTxtContent}
                onChange={(e) => setSeo({ ...seo, robotsTxtContent: e.target.value })}
                className="w-full p-4 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Footer Submit Button */}
        <div className="pt-4 flex items-center justify-end border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Saving Standards...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Webmaster Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
