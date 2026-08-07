import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Zap, 
  Download, 
  Upload, 
  Key, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Code2, 
  Copy,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { Product } from '../types';

interface WooCommerceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  onImportProducts?: (imported: Product[]) => void;
}

export const WooCommerceComparisonModal: React.FC<WooCommerceComparisonModalProps> = ({
  isOpen,
  onClose,
  products = [],
  onImportProducts
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'migration' | 'api_bridge'>('matrix');
  const [consumerKey, setConsumerKey] = useState('ck_seller_live_89a3f72e00192b');
  const [consumerSecret, setConsumerSecret] = useState('cs_seller_secret_44c118809920a1');
  const [copiedKey, setCopiedKey] = useState(false);

  // Migration States
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  const handleGenerateNewKeys = () => {
    const randomHex = () => Math.random().toString(36).substring(2, 10);
    setConsumerKey(`ck_seller_${randomHex()}${randomHex()}`);
    setConsumerSecret(`cs_seller_${randomHex()}${randomHex()}`);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Consumer Key: ${consumerKey}\nConsumer Secret: ${consumerSecret}`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExportWooCommerceCsv = () => {
    if (!products.length) return;

    const headers = ['ID', 'Type', 'SKU', 'Name', 'Published', 'Is featured?', 'Visibility in catalog', 'Short description', 'Description', 'Regular price', 'Cost price', 'Stock', 'Categories', 'Images'];
    
    const rows = products.map(p => [
      p.id,
      p.productType || 'simple',
      p.sku,
      `"${p.title.replace(/"/g, '""')}"`,
      p.status === 'active' ? '1' : '0',
      '0',
      'visible',
      `"${p.title}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      p.price,
      p.costPrice || 0,
      p.stockQuantity,
      `"${p.category}"`,
      p.image
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `woocommerce_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessImportCsv = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setImportStatus('Invalid CSV format: Requires header row and at least one data row.');
      return;
    }

    const importedProducts: Product[] = [];
    // Process rows skipping header
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 4) {
        importedProducts.push({
          id: parts[0] || `p-wc-${Date.now()}-${i}`,
          sku: parts[2] || `SKU-WC-${i}`,
          title: parts[3] || `Imported WooCommerce Product #${i}`,
          category: parts[12] || 'Uncategorized',
          price: Number(parts[9]) || 19.99,
          costPrice: Number(parts[10]) || 10.00,
          stockQuantity: Number(parts[11]) || 50,
          status: 'active',
          salesCount: 0,
          image: parts[13] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString()
        });
      }
    }

    if (importedProducts.length && onImportProducts) {
      onImportProducts(importedProducts);
      setImportStatus(`Successfully imported ${importedProducts.length} WooCommerce products!`);
      setCsvText('');
    } else {
      setImportStatus('Import failed. Please verify CSV mapping.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col my-8 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Seller Core vs WooCommerce Architecture</h3>
              <p className="text-xs text-slate-500">Side-by-side comparison matrix & WooCommerce migration suite</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Feature Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('migration')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'migration' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> CSV Importer & Exporter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('api_bridge')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'api_bridge' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Key className="w-4 h-4" /> WooCommerce REST API Bridge
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* TAB 1: FEATURE MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-950 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Seller Core Advantage:</strong> Built with React 18, Vite, and high-performance Node APIs, delivering 10x faster response speeds than traditional PHP/WordPress server setups.
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                      <th className="p-3.5">E-Commerce Vector</th>
                      <th className="p-3.5 text-indigo-900 bg-indigo-50/50">Seller Core Architecture</th>
                      <th className="p-3.5 text-slate-600">WooCommerce Ecosystem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">Performance & Page Load</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-emerald-800">
                        ⚡ Instant Vite SPA bundle + Lightweight REST API (&lt;50ms)
                      </td>
                      <td className="p-3.5 text-slate-600">Heavy PHP server rendering with database query overhead</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">Storefront Channels</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-indigo-900">
                        Web Storefront + Telegram Mini App + Visual Page Builder + Sandbox
                      </td>
                      <td className="p-3.5 text-slate-600">Standard web theme requiring complex extra plugins for mobile apps</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">Invoicing & Factor Engine</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-emerald-800">
                        Native Factor Builder, A4/A5/Thermal Receipt Printer, QR Code, Official Tax ID
                      </td>
                      <td className="p-3.5 text-slate-600">Requires paid PDF Invoice extensions & custom theme hooks</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">Bulk Product Management</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-indigo-900">
                        Side-by-side Product Comparison Modal + Live Delta % Price Adjuster
                      </td>
                      <td className="p-3.5 text-slate-600">Basic bulk edit dropdown table</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">Shipping & Tax Rules</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-emerald-800">
                        Multi-zone Freight Engine + Compound Tax Rules + Sandbox Calculator
                      </td>
                      <td className="p-3.5 text-slate-600">Standard shipping zones & WooCommerce core tax rates</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">API & Webhook Engine</td>
                      <td className="p-3.5 bg-indigo-50/30 font-semibold text-indigo-900">
                        Live API Throughput Metrics + Webhook Payload Inspector & Replay
                      </td>
                      <td className="p-3.5 text-slate-600">WooCommerce REST API v3 & basic webhook logs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MIGRATION & CSV */}
          {activeTab === 'migration' && (
            <div className="space-y-5 text-xs">
              
              {/* Exporter Section */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Export Catalog to WooCommerce Format</h4>
                      <p className="text-[11px] text-slate-500">Download your Seller products formatted for WooCommerce CSV import</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportWooCommerceCsv}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download WooCommerce CSV</span>
                  </button>
                </div>
              </div>

              {/* Importer Section */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Import WooCommerce Product CSV</h4>
                    <p className="text-[11px] text-slate-500">Paste raw CSV exported from WooCommerce wc-product-export.csv</p>
                  </div>
                </div>

                {importStatus && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {importStatus}
                  </div>
                )}

                <textarea
                  rows={5}
                  placeholder={`ID,Type,SKU,Name,Published,Is featured?,Visibility in catalog,Short description,Description,Regular price,Cost price,Stock,Categories,Images
wc-1,simple,SKU-101,"Ergonomic Chair",1,0,visible,"Desk Chair","High comfort ergonomics",149.00,80.00,25,"Furniture","https://images.unsplash.com/photo-1580481072645-022f9a6d1270"`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleProcessImportCsv}
                    disabled={!csvText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Execute WooCommerce Import</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: API BRIDGE */}
          {activeTab === 'api_bridge' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">WooCommerce REST API V3 Key Pair</h4>
                    <p className="text-[11px] text-slate-500">Use these API keys for WooCommerce Mobile App, POS terminals, and Zapier sync</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-sans uppercase mb-1">Consumer Key (ck_...)</label>
                    <input
                      type="text"
                      readOnly
                      value={consumerKey}
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-indigo-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-sans uppercase mb-1">Consumer Secret (cs_...)</label>
                    <input
                      type="text"
                      readOnly
                      value={consumerSecret}
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-rose-900 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleGenerateNewKeys}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate Keys
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied to Clipboard!' : 'Copy API Keys'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
