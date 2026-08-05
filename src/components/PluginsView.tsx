import React, { useState } from 'react';
import { 
  Blocks, 
  CreditCard, 
  Wallet, 
  Truck, 
  Sparkles, 
  Code, 
  Upload, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Terminal, 
  Sliders, 
  Globe, 
  Key, 
  Send, 
  FileCode, 
  Check, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Cpu
} from 'lucide-react';
import { Plugin } from '../types';

interface PluginsViewProps {
  plugins: Plugin[];
  onTogglePlugin: (id: string) => Promise<void>;
  onUpdateConfig: (id: string, config: Record<string, any>) => Promise<void>;
  onUploadPlugin: (pluginData: Partial<Plugin>) => Promise<void>;
  onDeletePlugin: (id: string) => Promise<void>;
  selectedPluginTab?: string | null;
  onSelectPluginTab?: (slug: string | null) => void;
}

export const PluginsView: React.FC<PluginsViewProps> = ({
  plugins,
  onTogglePlugin,
  onUpdateConfig,
  onUploadPlugin,
  onDeletePlugin,
  selectedPluginTab,
  onSelectPluginTab
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'payment' | 'shipping' | 'ai' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configuringPlugin, setConfiguringPlugin] = useState<Plugin | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active Plugin Sub-view if opened from Sidebar or direct tab
  const [activeSubView, setActiveSubView] = useState<string | null>(selectedPluginTab || null);

  // Sync sub view if passed from props
  React.useEffect(() => {
    if (selectedPluginTab !== undefined) {
      setActiveSubView(selectedPluginTab);
    }
  }, [selectedPluginTab]);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('Ergonomic Mechanical Keyboard with RGB backlighting');
  const [aiType, setAiType] = useState<'product_description' | 'customer_reply'>('product_description');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // DHL Calculator State
  const [dhlDestination, setDhlDestination] = useState('10001');
  const [dhlWeight, setDhlWeight] = useState('2.5');
  const [dhlRates, setDhlRates] = useState<any>(null);
  const [isDhlLoading, setIsDhlLoading] = useState(false);

  // Custom Upload Form State
  const [customForm, setCustomForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'custom' as 'payment' | 'shipping' | 'ai' | 'marketing' | 'custom',
    author: 'EHSANKiNG',
    version: '1.0.0',
    iconName: 'Code',
    menuTitle: '',
    configJson: '{\n  "apiKey": "custom_key_12345",\n  "enableWebhook": true\n}'
  });
  const [uploadError, setUploadError] = useState('');

  const getPluginIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Wallet': return Wallet;
      case 'Truck': return Truck;
      case 'Sparkles': return Sparkles;
      case 'Code': return Code;
      default: return Blocks;
    }
  };

  const filteredPlugins = plugins.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // AI Handler
  const handleGenerateAi = async (plugin: Plugin) => {
    try {
      setIsAiLoading(true);
      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: aiType,
          provider: plugin.config.provider || 'gemini'
        })
      });
      const data = await res.json();
      setAiOutput(data.text || 'Generated result ready.');
    } catch (err) {
      console.error(err);
      setAiOutput('Failed to process AI generation request.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // DHL Calculator Handler
  const handleCalculateDhl = async () => {
    try {
      setIsDhlLoading(true);
      const res = await fetch('/api/plugins/dhl/calculate-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationPostal: dhlDestination,
          weightKg: Number(dhlWeight) || 1.0
        })
      });
      const data = await res.json();
      setDhlRates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDhlLoading(false);
    }
  };

  // Custom Upload Handler
  const handleCustomUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!customForm.name || !customForm.slug) {
      setUploadError('Plugin Name and Slug are required.');
      return;
    }

    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(customForm.configJson);
    } catch (err) {
      setUploadError('Invalid Config JSON format.');
      return;
    }

    try {
      await onUploadPlugin({
        name: customForm.name,
        slug: customForm.slug,
        description: customForm.description,
        category: customForm.category,
        author: customForm.author || 'EHSANKiNG',
        version: customForm.version || '1.0.0',
        iconName: customForm.iconName,
        menuTitle: customForm.menuTitle || customForm.name,
        config: parsedConfig,
        hooks: ['CustomEventDispatched']
      });

      setIsUploadModalOpen(false);
      setCustomForm({
        name: '',
        slug: '',
        description: '',
        category: 'custom',
        author: 'EHSANKiNG',
        version: '1.0.0',
        iconName: 'Code',
        menuTitle: '',
        configJson: '{\n  "apiKey": "custom_key_12345"\n}'
      });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload custom plugin.');
    }
  };

  // File Upload JSON drag-and-drop parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.name && json.slug) {
          setCustomForm({
            name: json.name,
            slug: json.slug,
            description: json.description || '',
            category: json.category || 'custom',
            author: json.author || 'EHSANKiNG',
            version: json.version || '1.0.0',
            iconName: json.iconName || 'Code',
            menuTitle: json.menuTitle || json.name,
            configJson: JSON.stringify(json.config || {}, null, 2)
          });
        }
      } catch (err) {
        setUploadError('Uploaded file is not a valid JSON plugin manifest.');
      }
    };
    reader.readAsText(file);
  };

  const selectedPluginForSubView = activeSubView 
    ? plugins.find(p => p.slug === activeSubView || `plugin_${p.slug}` === activeSubView)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wide">
              Plugin Architecture
            </span>
            <span className="text-xs text-slate-400">Maintainer: <strong className="text-white">EHSANKiNG</strong></span>
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2.5">
            <Blocks className="w-7 h-7 text-indigo-400" />
            Plugin Library & Extension Manager
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Extend your headless store with payment gateways (Stripe, PayPal), international shipping (DHL), popular AI models (Gemini, OpenAI, Claude), or custom uploaded plugins. Active plugins dynamically mount to your admin menu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Custom Plugin</span>
          </button>
        </div>
      </div>

      {/* If subview is selected (from Sidebar or direct click), display its Control Panel directly */}
      {selectedPluginForSubView ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveSubView(null);
                  if (onSelectPluginTab) onSelectPluginTab(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                ← Back to All Plugins
              </button>
              <div className="h-4 w-px bg-slate-200"></div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {selectedPluginForSubView.name}
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                  v{selectedPluginForSubView.version}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                selectedPluginForSubView.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${selectedPluginForSubView.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                {selectedPluginForSubView.isActive ? 'Active in Sidebar Menu' : 'Disabled'}
              </span>

              <button
                onClick={() => onTogglePlugin(selectedPluginForSubView.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPluginForSubView.isActive 
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {selectedPluginForSubView.isActive ? 'Deactivate' : 'Activate Plugin'}
              </button>
            </div>
          </div>

          {/* Render Plugin Specific Control Panels */}
          {selectedPluginForSubView.slug === 'stripe-gateway' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      Stripe Gateway Settings
                    </h3>
                    <p className="text-xs text-slate-500">Configure API keys, webhooks, and payment methods</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                    Mode: {selectedPluginForSubView.config.mode || 'Test'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Environment Mode</label>
                    <select
                      value={selectedPluginForSubView.config.mode || 'test'}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, mode: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="test">Test Mode (Sandbox)</option>
                      <option value="live">Live Production Mode</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Publishable Key</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.publishableKey || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, publishableKey: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={selectedPluginForSubView.config.secretKey || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, secretKey: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Webhook Secret</label>
                    <input
                      type="password"
                      value={selectedPluginForSubView.config.webhookSecret || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, webhookSecret: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" /> Webhook Listener Endpoint
                  </h4>
                  <p className="text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 select-all">
                    https://api.ehsan-store.io/v1/webhooks/stripe
                  </p>
                  <p className="text-[11px] text-slate-500">Listens to: <code className="text-indigo-600">payment_intent.succeeded</code>, <code className="text-indigo-600">charge.refunded</code>, <code className="text-indigo-600">checkout.session.completed</code></p>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Stripe API Test Terminal
                </h4>
                <p className="text-xs text-slate-400">Simulate payment verification with test credentials.</p>
                
                <button
                  onClick={() => alert('Stripe Connection Test Passed! 200 OK Response received from Stripe REST API.')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Test Stripe Connection
                </button>

                <div className="font-mono text-[11px] bg-slate-950 p-3 rounded-lg text-emerald-400 border border-slate-800 space-y-1">
                  <p className="text-slate-500">// Stripe Event Log</p>
                  <p>GET /v1/account -&gt; 200 OK</p>
                  <p>Webhook: listening at /v1/webhooks/stripe</p>
                  <p>Apple Pay: Enabled</p>
                </div>
              </div>
            </div>
          )}

          {selectedPluginForSubView.slug === 'paypal-commerce' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" /> PayPal Commerce Terminal
                  </h3>
                  <p className="text-xs text-slate-500">Configure global PayPal Express &amp; Pay Later buttons</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                  {selectedPluginForSubView.config.mode || 'Sandbox'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Environment</label>
                  <select
                    value={selectedPluginForSubView.config.mode || 'sandbox'}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, mode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="sandbox">Sandbox Mode</option>
                    <option value="live">Live Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.currency || 'USD'}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, currency: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PayPal Client ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.clientId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, clientId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PayPal Secret Key</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.clientSecret || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, clientSecret: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPluginForSubView.slug === 'dhl-express-shipping' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-amber-600" /> DHL Express Logistics Engine
                    </h3>
                    <p className="text-xs text-slate-500">Calculate live shipping rates and generate waybills</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                    Account: {selectedPluginForSubView.config.accountNumber || 'DHL-1002'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.accountNumber || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, accountNumber: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">DHL API Key</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.apiKey || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiKey: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Live Rate Calculator Simulator */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" /> Live Rate Calculator Test
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Zip Code</label>
                      <input
                        type="text"
                        value={dhlDestination}
                        onChange={(e) => setDhlDestination(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Parcel Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={dhlWeight}
                        onChange={(e) => setDhlWeight(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCalculateDhl}
                    disabled={isDhlLoading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition"
                  >
                    {isDhlLoading ? 'Calculating Rates...' : 'Calculate DHL Rates'}
                  </button>

                  {dhlRates && (
                    <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-2">
                      <div className="text-xs font-bold text-slate-900">Calculated Rates for {dhlRates.destination}:</div>
                      {dhlRates.rates.map((r: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-700 border-b border-slate-100 last:border-0 pb-1">
                          <span>{r.service} ({r.estimatedDays})</span>
                          <span className="font-bold text-amber-700">${r.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" /> DHL Shipping Hooks
                </h4>
                <div className="text-xs text-slate-400 space-y-2">
                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-mono text-[11px]">OrderShipped</span>
                    <p className="text-[11px] text-slate-400 mt-1">Triggers auto-tracking code email to buyer.</p>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-mono text-[11px]">LabelGenerated</span>
                    <p className="text-[11px] text-slate-400 mt-1">Generates printable Commercial Shipping Waybill.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPluginForSubView.slug === 'ai-commerce-assistant' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" /> Popular AI Commerce Studio
                    </h3>
                    <p className="text-xs text-slate-500">Powered by Gemini, OpenAI, or Claude for smart product descriptions &amp; support</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 uppercase">
                    Provider: {selectedPluginForSubView.config.provider || 'gemini'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">AI Provider Model</label>
                    <select
                      value={selectedPluginForSubView.config.provider || 'gemini'}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, provider: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="gemini">Google Gemini 2.5 Flash (Recommended)</option>
                      <option value="openai">OpenAI GPT-4o Commerce</option>
                      <option value="claude">Anthropic Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">API Key</label>
                    <input
                      type="password"
                      value={selectedPluginForSubView.config.apiKey || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiKey: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                      placeholder="AIzaSy... or sk-..."
                    />
                  </div>
                </div>

                {/* AI Interactive Generator Studio */}
                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-200/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" /> AI Content Generator Studio
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAiType('product_description')}
                        className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition ${
                          aiType === 'product_description' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        SEO Description
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiType('customer_reply')}
                        className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition ${
                          aiType === 'customer_reply' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        Support Draft
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {aiType === 'product_description' ? 'Product Title or Keywords' : 'Customer Query'}
                    </label>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="e.g. Wireless Ergonomic Gaming Mouse with RGB"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateAi(selectedPluginForSubView)}
                    disabled={isAiLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAiLoading ? 'AI Generating Content...' : 'Generate Content'}
                  </button>

                  {aiOutput && (
                    <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-purple-700 font-bold border-b border-purple-100 pb-2">
                        <span>Generated Content Result</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiOutput);
                            alert('Copied to clipboard!');
                          }}
                          className="text-xs text-purple-600 hover:underline"
                        >
                          Copy Output
                        </button>
                      </div>
                      <div className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {aiOutput}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" /> Automation Features
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-lg">
                    <span>Auto-enhance product titles</span>
                    <input
                      type="checkbox"
                      checked={selectedPluginForSubView.config.autoEnhanceTitles ?? true}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, autoEnhanceTitles: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-lg">
                    <span>Auto-draft descriptions</span>
                    <input
                      type="checkbox"
                      checked={selectedPluginForSubView.config.autoDraftDescriptions ?? true}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, autoDraftDescriptions: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Uploaded Plugins Generic Control Panel */}
          {selectedPluginForSubView.isCustom && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" /> Custom Plugin Settings: {selectedPluginForSubView.name}
                  </h3>
                  <p className="text-xs text-slate-500">Developed by <strong className="text-slate-900">{selectedPluginForSubView.author}</strong></p>
                </div>
                <button
                  onClick={() => onDeletePlugin(selectedPluginForSubView.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Plugin
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Config JSON Manifest</label>
                <textarea
                  value={JSON.stringify(selectedPluginForSubView.config, null, 2)}
                  onChange={(e) => {
                    try {
                      const json = JSON.parse(e.target.value);
                      onUpdateConfig(selectedPluginForSubView.id, json);
                    } catch (err) {
                      // Allow typing
                    }
                  }}
                  rows={8}
                  className="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Plugin Marketplace Library Grid */
        <div className="space-y-6">
          {/* Search & Category Filter Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {(['all', 'payment', 'shipping', 'ai', 'custom'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Plugins' : cat === 'ai' ? 'Popular AI' : `${cat} Plugins`}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search plugin library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Plugin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlugins.map((plugin) => {
              const PluginIcon = getPluginIcon(plugin.iconName);
              return (
                <div
                  key={plugin.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                    plugin.isActive
                      ? 'border-indigo-200 shadow-md ring-1 ring-indigo-500/10'
                      : 'border-slate-200 opacity-90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                          plugin.category === 'payment' ? 'bg-indigo-50 text-indigo-600' :
                          plugin.category === 'shipping' ? 'bg-amber-50 text-amber-600' :
                          plugin.category === 'ai' ? 'bg-purple-50 text-purple-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          <PluginIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            {plugin.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>Author: <strong className="text-slate-700">{plugin.author}</strong></span>
                            <span>•</span>
                            <span className="font-mono">v{plugin.version}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTogglePlugin(plugin.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            plugin.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              plugin.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {plugin.description}
                    </p>

                    {plugin.hooks && plugin.hooks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {plugin.hooks.map((h, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            #{h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${plugin.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                      <span className="text-xs font-semibold text-slate-700">
                        {plugin.isActive ? 'Active (In Sidebar Menu)' : 'Disabled'}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveSubView(plugin.slug)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-lg transition"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Configure
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload & Create Custom Plugin Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                Upload / Develop Custom Plugin
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Upload Drag & Drop Box */}
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-4 text-center">
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Upload Plugin Manifest File (.json)</p>
              <p className="text-[11px] text-slate-500 mb-2">Drag and drop or select file to auto-fill form</p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleCustomUploadSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plugin Name *</label>
                  <input
                    type="text"
                    required
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    placeholder="e.g. Crypto Pay Gateway"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plugin Slug *</label>
                  <input
                    type="text"
                    required
                    value={customForm.slug}
                    onChange={(e) => setCustomForm({ ...customForm, slug: e.target.value })}
                    placeholder="e.g. crypto-pay"
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={customForm.description}
                  onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                  placeholder="Describe your plugin capabilities..."
                  rows={2}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={customForm.author}
                    onChange={(e) => setCustomForm({ ...customForm, author: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={customForm.category}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="payment">Payment</option>
                    <option value="shipping">Shipping</option>
                    <option value="ai">AI Tool</option>
                    <option value="marketing">Marketing</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={customForm.version}
                    onChange={(e) => setCustomForm({ ...customForm, version: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Config JSON Schema</label>
                <textarea
                  value={customForm.configJson}
                  onChange={(e) => setCustomForm({ ...customForm, configJson: e.target.value })}
                  rows={4}
                  className="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                >
                  Register &amp; Activate Plugin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
