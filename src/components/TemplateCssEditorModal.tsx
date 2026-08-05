import React, { useState, useEffect, useMemo } from 'react';
import { X, Code2, Eye, Save, RefreshCw, Monitor, Smartphone, Tablet, Sparkles, Check, Copy } from 'lucide-react';
import { StoreTemplate, Product } from '../types';

interface TemplateCssEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: StoreTemplate | null;
  products: Product[];
  onSaveCss: (templateId: string, cssCode: string) => Promise<void>;
}

const DEFAULT_CSS = `:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --accent-color: #10b981;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --border-radius: 12px;
  --font-family: 'Plus Jakarta Sans', sans-serif;
}`;

export const TemplateCssEditorModal: React.FC<TemplateCssEditorModalProps> = ({
  isOpen,
  onClose,
  template,
  products,
  onSaveCss,
}) => {
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (template) {
      setCssCode(template.cssCode || DEFAULT_CSS);
    }
  }, [template]);

  // Parse CSS variables out of the cssCode string for quick visual pickers
  const parsedVars = useMemo(() => {
    const vars: Record<string, string> = {
      '--primary-color': '#4f46e5',
      '--accent-color': '#10b981',
      '--bg-color': '#f8fafc',
      '--card-bg': '#ffffff',
      '--text-color': '#0f172a',
      '--border-radius': '12px',
    };

    const matches = cssCode.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g);
    for (const match of matches) {
      vars[match[1]] = match[2].trim();
    }
    return vars;
  }, [cssCode]);

  if (!isOpen || !template) return null;

  const handleUpdateVar = (varName: string, newValue: string) => {
    let updated = cssCode;
    const regex = new RegExp(`(${varName}\\s*:\\s*)([^;]+)(;)`, 'g');
    if (regex.test(updated)) {
      updated = updated.replace(regex, `$1${newValue}$3`);
    } else {
      // Append if missing inside :root
      updated = updated.replace(':root {', `:root {\n  ${varName}: ${newValue};`);
    }
    setCssCode(updated);
  };

  const handleResetDefaults = () => {
    setCssCode(DEFAULT_CSS);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSaveCss(template.id, cssCode);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save template CSS:', err);
    } finally {
      setSaving(false);
    }
  };

  // Preview styling values
  const primaryColor = parsedVars['--primary-color'] || '#4f46e5';
  const accentColor = parsedVars['--accent-color'] || '#10b981';
  const bgColor = parsedVars['--bg-color'] || '#f8fafc';
  const cardBg = parsedVars['--card-bg'] || '#ffffff';
  const textColor = parsedVars['--text-color'] || '#0f172a';
  const borderRadius = parsedVars['--border-radius'] || '12px';

  const previewSampleProducts = products.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 animate-fade-in overflow-hidden">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{template.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                  {template.framework} Template
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Live Storefront CSS Custom Variables & Theme Customizer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset CSS Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : savedSuccess ? 'Applied!' : 'Save & Apply Theme'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Code Editor & Color Pickers (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-slate-950 p-5 overflow-y-auto space-y-4">
            {/* Quick Variable Color Pickers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Visual Variable Controls
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { key: '--primary-color', label: 'Primary Brand' },
                  { key: '--accent-color', label: 'Accent / Badge' },
                  { key: '--bg-color', label: 'Canvas Background' },
                  { key: '--card-bg', label: 'Card Surface' },
                  { key: '--text-color', label: 'Primary Text' },
                ].map((item) => (
                  <div key={item.key} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">{item.label}</span>
                      <span className="text-[11px] font-mono text-slate-200">{parsedVars[item.key] || '#000'}</span>
                    </div>
                    <input
                      type="color"
                      value={parsedVars[item.key]?.startsWith('#') ? parsedVars[item.key] : '#4f46e5'}
                      onChange={(e) => handleUpdateVar(item.key, e.target.value)}
                      className="w-7 h-7 rounded-md border-0 bg-transparent cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor TextArea */}
            <div className="flex-1 flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-t-xl border border-b-0 border-slate-800">
                <span className="text-xs font-bold text-slate-300 font-mono">theme-variables.css</span>
                <span className="text-[10px] text-indigo-400 font-mono font-semibold">CSS Custom Properties</span>
              </div>
              <div className="flex-1 relative font-mono text-xs bg-slate-900 border border-slate-800 rounded-b-xl overflow-hidden flex">
                {/* Line Numbers */}
                <div className="w-9 py-3 bg-slate-950 text-slate-600 text-right pr-2 select-none font-mono text-[11px] leading-relaxed">
                  {cssCode.split('\n').map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 p-3 bg-transparent text-indigo-200 focus:outline-hidden resize-none leading-relaxed font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Storefront Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-900 p-5 overflow-y-auto">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                Live Storefront Canvas Preview
              </label>

              {/* Device Mode Switcher */}
              <div className="flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex-1 flex justify-center items-start overflow-y-auto p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div
                style={{
                  width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '640px' : '360px',
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: borderRadius,
                  transition: 'all 0.3s ease',
                }}
                className="shadow-2xl overflow-hidden border border-slate-200/20 text-sans transition-all duration-300"
              >
                {/* Store Navbar Preview */}
                <div
                  style={{ backgroundColor: cardBg, borderColor: '#e2e8f0' }}
                  className="px-5 py-3 border-b flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: primaryColor }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    >
                      S
                    </div>
                    <span className="font-bold text-sm" style={{ color: textColor }}>
                      Ehsan Store
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold" style={{ color: textColor }}>
                    <span>Catalog</span>
                    <span>Deals</span>
                    <button
                      style={{ backgroundColor: primaryColor, borderRadius: borderRadius }}
                      className="px-3 py-1 text-white text-xs font-semibold shadow-xs"
                    >
                      Cart (2)
                    </button>
                  </div>
                </div>

                {/* Hero Section Preview */}
                <div style={{ backgroundColor: primaryColor }} className="p-6 text-white text-center">
                  <span
                    style={{ backgroundColor: accentColor }}
                    className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full mb-2"
                  >
                    Summer Sale Live
                  </span>
                  <h2 className="text-xl font-extrabold mb-1">Next-Gen Storefront Collection</h2>
                  <p className="text-xs opacity-90 max-w-sm mx-auto">
                    Experience ultra-responsive commerce with real-time stock and instant checkout.
                  </p>
                </div>

                {/* Product Grid Preview */}
                <div className="p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-70">Featured Inventory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previewSampleProducts.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: cardBg,
                          borderRadius: borderRadius,
                          borderColor: '#e2e8f0',
                        }}
                        className="border overflow-hidden shadow-xs p-3 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span
                            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                            className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-md mb-1"
                          >
                            In Stock ({p.stockQuantity})
                          </span>
                          <h5 className="text-xs font-bold line-clamp-1">{p.title}</h5>
                          <p className="text-xs font-extrabold mt-1" style={{ color: primaryColor }}>
                            ${p.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          style={{
                            backgroundColor: primaryColor,
                            borderRadius: borderRadius,
                          }}
                          className="w-full py-1.5 text-white text-xs font-semibold shadow-xs transition hover:opacity-90 cursor-pointer"
                        >
                          Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
