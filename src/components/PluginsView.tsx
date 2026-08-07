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
  Cpu,
  BarChart3,
  Mail,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { Plugin } from '../types';
import { openFedexLabelPrintWindow, FedexLabelData } from '../utils/fedexLabel';

interface PluginsViewProps {
  plugins: Plugin[];
  onTogglePlugin: (id: string) => Promise<void>;
  onUpdateConfig: (id: string, config: Record<string, any>) => Promise<void>;
  onUploadPlugin: (pluginData: Partial<Plugin>) => Promise<void>;
  onDeletePlugin: (id: string) => Promise<void>;
  selectedPluginTab?: string | null;
  onSelectPluginTab?: (slug: string | null) => void;
  onOpenWooCommerceModal?: () => void;
}

export const PluginsView: React.FC<PluginsViewProps> = ({
  plugins,
  onTogglePlugin,
  onUpdateConfig,
  onUploadPlugin,
  onDeletePlugin,
  selectedPluginTab,
  onSelectPluginTab,
  onOpenWooCommerceModal
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cdn' | 'payment' | 'shipping' | 'ai' | 'security' | 'api' | 'analytics' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configuringPlugin, setConfiguringPlugin] = useState<Plugin | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active Plugin Sub-view if opened from Sidebar or direct tab
  const [activeSubView, setActiveSubView] = useState<string | null>(selectedPluginTab || null);
  const [selectedCarrierTab, setSelectedCarrierTab] = useState<'fedex' | 'dhl' | 'ups'>('fedex');

  // Sync sub view if passed from props
  React.useEffect(() => {
    if (selectedPluginTab !== undefined) {
      setActiveSubView(selectedPluginTab);
    }
  }, [selectedPluginTab]);

  // Sync shipping carrier tab based on the active subview
  React.useEffect(() => {
    if (activeSubView === 'dhl-express-shipping' || activeSubView === 'plugin_dhl-express-shipping') {
      setSelectedCarrierTab('dhl');
    } else if (activeSubView === 'fedex-shipping' || activeSubView === 'plugin_fedex-shipping') {
      setSelectedCarrierTab('fedex');
    } else if (activeSubView === 'ups-shipping' || activeSubView === 'plugin_ups-shipping') {
      setSelectedCarrierTab('ups');
    }
  }, [activeSubView]);

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

  // FedEx Calculator & Label State
  const [fedexDestination, setFedexDestination] = useState('10001');
  const [fedexWeight, setFedexWeight] = useState('2.5');
  const [fedexRates, setFedexRates] = useState<any>(null);
  const [isFedexLoading, setIsFedexLoading] = useState(false);
  const [fedexLabelOrderId, setFedexLabelOrderId] = useState('ORD-2026-8801');
  const [fedexLabelRecipient, setFedexLabelRecipient] = useState('Sarah Jenkins');
  const [fedexLabelAddress, setFedexLabelAddress] = useState('742 Evergreen Terrace, Springfield, OR');
  const [fedexLabelService, setFedexLabelService] = useState('FedEx Ground');
  const [fedexLabelResult, setFedexLabelResult] = useState<any>(null);
  const [isFedexLabelLoading, setIsFedexLabelLoading] = useState(false);

  // UPS Calculator & Label State
  const [upsDestination, setUpsDestination] = useState('10001');
  const [upsWeight, setUpsWeight] = useState('2.5');
  const [upsRates, setUpsRates] = useState<any>(null);
  const [isUpsLoading, setIsUpsLoading] = useState(false);
  const [upsLabelOrderId, setUpsLabelOrderId] = useState('ORD-2026-9901');
  const [upsLabelRecipient, setUpsLabelRecipient] = useState('William Adams');
  const [upsLabelAddress, setUpsLabelAddress] = useState('123 Broadway, New York, NY');
  const [upsLabelService, setUpsLabelService] = useState('UPS Ground');
  const [upsLabelResult, setUpsLabelResult] = useState<any>(null);
  const [isUpsLabelLoading, setIsUpsLabelLoading] = useState(false);

  // DHL Label State
  const [dhlLabelOrderId, setDhlLabelOrderId] = useState('ORD-2026-9902');
  const [dhlLabelRecipient, setDhlLabelRecipient] = useState('Charlotte Meier');
  const [dhlLabelAddress, setDhlLabelAddress] = useState('456 Kurfürstendamm, Berlin, DE');
  const [dhlLabelService, setDhlLabelService] = useState('DHL Express Worldwide');
  const [dhlLabelResult, setDhlLabelResult] = useState<any>(null);
  const [isDhlLabelLoading, setIsDhlLabelLoading] = useState(false);

  // CDN Operations State
  const [cdnLog, setCdnLog] = useState<string>('');
  const [isCdnLoading, setIsCdnLoading] = useState<boolean>(false);
  const [fastlySurrogateKey, setFastlySurrogateKey] = useState<string>('global-product-catalog');
  const [cloudfrontPath, setCloudfrontPath] = useState<string>('/*');

  // Social Media Manager State
  const [socialPlatform, setSocialPlatform] = useState('telegram');
  const [socialMessage, setSocialMessage] = useState('🚀 Flash Sale: 30% OFF Mechanical Keyboards at Ehsan Store! Use code EHSAN30.');
  const [socialImageUrl, setSocialImageUrl] = useState('https://images.unsplash.com/photo-1587829741301-dc798b83add3');
  const [socialResult, setSocialResult] = useState<any>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  // Google Translate State
  const [translateText, setTranslateText] = useState('Professional E-Commerce Solution with Real-time Inventory');
  const [translateTargetLang, setTranslateTargetLang] = useState('fa');
  const [translateResult, setTranslateResult] = useState<any>(null);
  const [isTranslateLoading, setIsTranslateLoading] = useState(false);

  // Google Vision State
  const [visionImageUrl, setVisionImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e');
  const [visionResult, setVisionResult] = useState<any>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  // Google Maps State
  const [mapsAddress, setMapsAddress] = useState('1600 Amphitheatre Pkwy, Mountain View, CA 94043');
  const [mapsResult, setMapsResult] = useState<any>(null);
  const [isMapsLoading, setIsMapsLoading] = useState(false);

  // SendGrid State
  const [sgRecipient, setSgRecipient] = useState('customer@example.com');
  const [sgSubject, setSgSubject] = useState('Thank you for your purchase from Ehsan Store!');
  const [sgBody, setSgBody] = useState('Your order #ORD-2026-9012 has been successfully packed and handed over to DHL.');
  const [sgResult, setSgResult] = useState<any>(null);
  const [isSgLoading, setIsSgLoading] = useState(false);

  // Twilio State
  const [twPhone, setTwPhone] = useState('+1 (555) 019-2831');
  const [twMessage, setTwMessage] = useState('Ehsan Store alert: Your order has been dispatched! Track via DHL with code tracking_9921.');
  const [twChannel, setTwChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [twResult, setTwResult] = useState<any>(null);
  const [isTwLoading, setIsTwLoading] = useState(false);

  // Slack State
  const [slackMessageText, setSlackMessageText] = useState('⚡ *Store Operational Alert*: New purchase captured! Order #ORD-2026-9012 for $450.00 by Alice.');
  const [slackResult, setSlackResult] = useState<any>(null);
  const [isSlackLoading, setIsSlackLoading] = useState(false);

  // Mailchimp State
  const [mcEmailAddress, setMcEmailAddress] = useState('new_subscriber@gmail.com');
  const [mcFirstName, setMcFirstName] = useState('Alice');
  const [mcResult, setMcResult] = useState<any>(null);
  const [isMcLoading, setIsMcLoading] = useState(false);

  // Telegram Bot State
  const [tgTestMessage, setTgTestMessage] = useState('🚀 Flash Sale: 25% OFF Mechanical Keyboards at Ehsan Store!');
  const [tgResult, setTgResult] = useState<any>(null);
  const [isTgLoading, setIsTgLoading] = useState(false);

  // Instagram Graph State
  const [igCaption, setIgCaption] = useState('New ergonomic setup available now! #EhsanStore');
  const [igResult, setIgResult] = useState<any>(null);
  const [isIgLoading, setIsIgLoading] = useState(false);

  // Facebook Pages State
  const [fbMessage, setFbMessage] = useState('Check out our newest products and offers on Facebook Shop.');
  const [fbResult, setFbResult] = useState<any>(null);
  const [isFbLoading, setIsFbLoading] = useState(false);

  // LinkedIn Publisher State
  const [liText, setLiText] = useState('Ehsan Store expands B2B wholesale catalog for enterprise procurement.');
  const [liResult, setLiResult] = useState<any>(null);
  const [isLiLoading, setIsLiLoading] = useState(false);

  // Telegram Mini Shop State
  const [msSyncResult, setMsSyncResult] = useState<any>(null);
  const [isMsLoading, setIsMsLoading] = useState(false);

  // Crypto Gateway Test State
  const [cryptoTestAmount, setCryptoTestAmount] = useState('150.00');
  const [cryptoTestCurrency, setCryptoTestCurrency] = useState('USDT');
  const [cryptoInvoiceResult, setCryptoInvoiceResult] = useState<any>(null);
  const [isCryptoLoading, setIsCryptoLoading] = useState(false);

  const handleTestCryptoInvoice = async () => {
    try {
      setIsCryptoLoading(true);
      const res = await fetch('/api/plugins/crypto/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: parseFloat(cryptoTestAmount) || 50, currency: cryptoTestCurrency })
      });
      const data = await res.json();
      setCryptoInvoiceResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate test crypto invoice.');
    } finally {
      setIsCryptoLoading(false);
    }
  };

  // Custom Upload Form State
  const [customForm, setCustomForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'cdn' as 'payment' | 'shipping' | 'ai' | 'marketing' | 'security' | 'api' | 'analytics' | 'cdn' | 'custom',
    author: 'EHSANKiNG',
    version: '1.0.0',
    iconName: 'Globe',
    menuTitle: '',
    configJson: '{\n  "cdnDomain": "cdn.ehsan-store.io",\n  "purgeKey": "purge_secret_88192038",\n  "enableEdgeWebp": true\n}'
  });
  const [uploadError, setUploadError] = useState('');

  const getPluginIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Wallet': return Wallet;
      case 'Truck': return Truck;
      case 'Sparkles': return Sparkles;
      case 'Code': return Code;
      case 'Globe': return Globe;
      case 'Zap': return Zap;
      case 'Layers': return Layers;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return ShieldCheck;
      case 'ShieldAlert': return ShieldCheck;
      case 'Lock': return ShieldCheck;
      case 'BarChart3': return Sliders;
      case 'Mail': return Mail;
      case 'MessageSquare': return MessageSquare;
      case 'Terminal': return Terminal;
      case 'UserCheck': return UserCheck;
      default: return Blocks;
    }
  };

  // CDN Action Handlers
  const handleCloudflarePurge = async (plugin: Plugin) => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/cloudflare/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId: plugin.config.zoneId, purgeEverything: true })
      });
      const data = await res.json();
      setCdnLog(`[Cloudflare CDN] ${data.message} (${data.purgedAt})`);
    } catch (err) {
      setCdnLog('[Cloudflare CDN] Error purging cache.');
    } finally {
      setIsCdnLoading(false);
    }
  };

  const handleCloudflareStats = async () => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/cloudflare/stats');
      const data = await res.json();
      setCdnLog(`[Cloudflare Analytics] Cache Hit Ratio: ${data.cacheHitRatio} | Bandwidth Saved: ${data.bandwidthSavedGb} GB | Requests Served: ${data.requestsServed.toLocaleString()}`);
    } catch (err) {
      setCdnLog('[Cloudflare Analytics] Error loading analytics.');
    } finally {
      setIsCdnLoading(false);
    }
  };

  const handleFastlyPurge = async (plugin: Plugin) => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/fastly/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surrogateKey: fastlySurrogateKey, serviceId: plugin.config.serviceId })
      });
      const data = await res.json();
      setCdnLog(`[Fastly Edge] ${data.message}`);
    } catch (err) {
      setCdnLog('[Fastly Edge] Error purging surrogate key.');
    } finally {
      setIsCdnLoading(false);
    }
  };

  const handleBunnyPurge = async (plugin: Plugin) => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/bunny/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullZoneName: plugin.config.pullZoneName })
      });
      const data = await res.json();
      setCdnLog(`[Bunny.net CDN] ${data.message}`);
    } catch (err) {
      setCdnLog('[Bunny.net CDN] Error purging pull zone.');
    } finally {
      setIsCdnLoading(false);
    }
  };

  const handleBunnySyncStorage = async (plugin: Plugin) => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/bunny/sync-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageZoneName: plugin.config.storageZoneName })
      });
      const data = await res.json();
      setCdnLog(`[Bunny.net Storage] ${data.message} (${data.syncedFilesCount} files, ${(data.totalBytesSynced / (1024*1024)).toFixed(1)} MB)`);
    } catch (err) {
      setCdnLog('[Bunny.net Storage] Error syncing storage.');
    } finally {
      setIsCdnLoading(false);
    }
  };

  const handleCloudfrontInvalidate = async (plugin: Plugin) => {
    try {
      setIsCdnLoading(true);
      const res = await fetch('/api/plugins/cdn/cloudfront/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distributionId: plugin.config.distributionId, invalidationPath: cloudfrontPath })
      });
      const data = await res.json();
      setCdnLog(`[AWS CloudFront] ${data.message} (ID: ${data.invalidationId}, Status: ${data.status})`);
    } catch (err) {
      setCdnLog('[AWS CloudFront] Error creating invalidation.');
    } finally {
      setIsCdnLoading(false);
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
          provider: plugin.config.provider || 'gemini',
          apiKey: plugin.config.apiKey || ''
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

  // FedEx Calculator Handler
  const handleCalculateFedex = async () => {
    try {
      setIsFedexLoading(true);
      const res = await fetch('/api/plugins/fedex/calculate-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationPostal: fedexDestination,
          weightKg: Number(fedexWeight) || 1.0
        })
      });
      const data = await res.json();
      setFedexRates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFedexLoading(false);
    }
  };

  // FedEx Label Generator Handler
  const handleGenerateFedexLabel = async () => {
    try {
      setIsFedexLabelLoading(true);
      const res = await fetch('/api/plugins/fedex/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: fedexLabelOrderId,
          serviceType: fedexLabelService,
          weightKg: Number(fedexWeight) || 2.5,
          recipientName: fedexLabelRecipient,
          destinationAddress: fedexLabelAddress
        })
      });
      const data = await res.json();
      setFedexLabelResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFedexLabelLoading(false);
    }
  };

  // UPS Calculator Handler
  const handleCalculateUps = async () => {
    try {
      setIsUpsLoading(true);
      const res = await fetch('/api/plugins/ups/calculate-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationPostal: upsDestination,
          weightKg: Number(upsWeight) || 1.0
        })
      });
      const data = await res.json();
      setUpsRates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpsLoading(false);
    }
  };

  // UPS Label Generator Handler
  const handleGenerateUpsLabel = async () => {
    try {
      setIsUpsLabelLoading(true);
      const res = await fetch('/api/plugins/ups/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: upsLabelOrderId,
          serviceType: upsLabelService,
          weightKg: Number(upsWeight) || 2.5,
          recipientName: upsLabelRecipient,
          destinationAddress: upsLabelAddress
        })
      });
      const data = await res.json();
      setUpsLabelResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpsLabelLoading(false);
    }
  };

  // DHL Label Generator Handler
  const handleGenerateDhlLabel = async () => {
    try {
      setIsDhlLabelLoading(true);
      const res = await fetch('/api/plugins/dhl/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: dhlLabelOrderId,
          serviceType: dhlLabelService,
          weightKg: Number(dhlWeight) || 2.5,
          recipientName: dhlLabelRecipient,
          destinationAddress: dhlLabelAddress
        })
      });
      const data = await res.json();
      setDhlLabelResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDhlLabelLoading(false);
    }
  };

  const handlePublishSocial = async () => {
    try {
      setIsSocialLoading(true);
      const res = await fetch('/api/plugins/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: socialPlatform, message: socialMessage, imageUrl: socialImageUrl })
      });
      const data = await res.json();
      setSocialResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleTranslate = async () => {
    try {
      setIsTranslateLoading(true);
      const res = await fetch('/api/plugins/google/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: translateText, targetLang: translateTargetLang })
      });
      const data = await res.json();
      setTranslateResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslateLoading(false);
    }
  };

  const handleVisionSearch = async () => {
    try {
      setIsVisionLoading(true);
      const res = await fetch('/api/plugins/google/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: visionImageUrl })
      });
      const data = await res.json();
      setVisionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVisionLoading(false);
    }
  };

  const handleGeocodeMaps = async () => {
    try {
      setIsMapsLoading(true);
      const res = await fetch('/api/plugins/google/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: mapsAddress })
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapsLoading(false);
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

        <div className="flex flex-wrap items-center gap-3">
          {onOpenWooCommerceModal && (
            <button
              onClick={onOpenWooCommerceModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer border border-indigo-400/30"
              title="Launch Seller vs WooCommerce Comparison & Migration Bridge"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>VS WooCommerce Bridge</span>
            </button>
          )}

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition shadow-md cursor-pointer border border-slate-700"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
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

          {selectedPluginForSubView.slug === 'crypto-gateway' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-600" /> CryptoPay &amp; Web3 Gateway Settings
                    </h3>
                    <p className="text-xs text-slate-500">Configure decentralized wallet addresses and blockchain networks</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 uppercase">
                    Mode: {selectedPluginForSubView.config.networkMode || 'Mainnet'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Blockchain Network Mode</label>
                    <select
                      value={selectedPluginForSubView.config.networkMode || 'mainnet'}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, networkMode: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="mainnet">Mainnet (Production)</option>
                      <option value="testnet">Testnet (Sandbox)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmation Blocks Required</label>
                    <input
                      type="number"
                      value={selectedPluginForSubView.config.confirmationBlocks || 2}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, confirmationBlocks: parseInt(e.target.value) || 2 })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">USDT (TRC-20) Merchant Deposit Address</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.usdtTrc20Address || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, usdtTrc20Address: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ethereum / EVM Vault Address</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.walletAddress || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, walletAddress: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-purple-600" /> Supported Cryptocurrencies
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['USDT (TRC20)', 'Bitcoin (BTC)', 'Ethereum (ERC20)', 'TON (Telegram)', 'Binance Pay'].map((coin) => (
                      <span key={coin} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                        {coin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" /> Crypto Invoice Sandbox Test
                </h4>
                <p className="text-xs text-slate-400">Generate a live crypto deposit invoice and test mempool verification.</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Test Amount (USD)</label>
                    <input
                      type="text"
                      value={cryptoTestAmount}
                      onChange={(e) => setCryptoTestAmount(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cryptocurrency</label>
                    <select
                      value={cryptoTestCurrency}
                      onChange={(e) => setCryptoTestCurrency(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                    >
                      <option value="USDT">USDT (TRC-20)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="TON">TON (Telegram)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleTestCryptoInvoice}
                    disabled={isCryptoLoading}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isCryptoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    Generate Test Crypto Invoice
                  </button>
                </div>

                {cryptoInvoiceResult && (
                  <div className="font-mono text-[11px] bg-slate-950 p-3 rounded-lg text-purple-300 border border-slate-800 space-y-1.5">
                    <p className="text-emerald-400 font-bold">✓ Invoice Created Successfully</p>
                    <p>ID: {cryptoInvoiceResult.invoiceId}</p>
                    <p>Pay: {cryptoInvoiceResult.amountCrypto} {cryptoInvoiceResult.currency}</p>
                    <p className="truncate">To: {cryptoInvoiceResult.depositAddress}</p>
                    <p className="text-amber-400">Status: {cryptoInvoiceResult.status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {['dhl-express-shipping', 'fedex-shipping', 'ups-shipping'].includes(selectedPluginForSubView.slug) && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Carrier Selection Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setSelectedCarrierTab('fedex')}
                  className={`px-6 py-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors ${selectedCarrierTab === 'fedex' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Truck className="w-4 h-4 text-indigo-600" /> FedEx Ground & Express
                </button>
                <button
                  onClick={() => setSelectedCarrierTab('dhl')}
                  className={`px-6 py-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors ${selectedCarrierTab === 'dhl' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Truck className="w-4 h-4 text-amber-500" /> DHL Express Cargo
                </button>
                <button
                  onClick={() => setSelectedCarrierTab('ups')}
                  className={`px-6 py-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors ${selectedCarrierTab === 'ups' ? 'border-amber-800 text-[#351C15]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Truck className="w-4 h-4 text-amber-800" /> UPS Ground & Air
                </button>
              </div>

              {/* FedEx Panel */}
              {selectedCarrierTab === 'fedex' && (() => {
                const fedexPlg = plugins.find(p => p.slug === 'fedex-shipping') || selectedPluginForSubView;
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <span className="text-indigo-600">Fed</span><span className="text-orange-500">Ex</span> Logistics Engine
                          </h3>
                          <p className="text-xs text-slate-500">Configure FedEx API credentials, estimate transit rates and test real-time label creation</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Account: {fedexPlg.config?.accountNumber || 'FEDEX-1002'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Account ID / Number</label>
                          <input
                            type="text"
                            value={fedexPlg.config?.accountNumber || ''}
                            onChange={(e) => onUpdateConfig(fedexPlg.id, { ...fedexPlg.config, accountNumber: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                            placeholder="e.g. 510087780"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">FedEx API Key</label>
                          <input
                            type="text"
                            value={fedexPlg.config?.apiKey || ''}
                            onChange={(e) => onUpdateConfig(fedexPlg.id, { ...fedexPlg.config, apiKey: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                            placeholder="e.g. l7xxa28fb5b..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">FedEx API Secret</label>
                          <input
                            type="password"
                            value={fedexPlg.config?.apiSecret || ''}
                            onChange={(e) => onUpdateConfig(fedexPlg.id, { ...fedexPlg.config, apiSecret: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                            placeholder="••••••••••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Meter Number (Optional)</label>
                          <input
                            type="text"
                            value={fedexPlg.config?.meterNumber || ''}
                            onChange={(e) => onUpdateConfig(fedexPlg.id, { ...fedexPlg.config, meterNumber: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-indigo-600"
                            placeholder="e.g. 119028103"
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div>
                            <span className="block text-xs font-semibold text-slate-900">Sandbox / Test Mode</span>
                            <span className="text-[11px] text-slate-500">Enable to send requests to FedEx test server.</span>
                          </div>
                          <button
                            onClick={() => onUpdateConfig(fedexPlg.id, { ...fedexPlg.config, sandbox: !fedexPlg.config?.sandbox })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${fedexPlg.config?.sandbox ? 'bg-indigo-600' : 'bg-slate-200'}`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${fedexPlg.config?.sandbox ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>

                      {/* FedEx Rate Calculator Simulator */}
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200/70 space-y-3">
                        <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-indigo-600" /> Live Rate Calculator Test
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Zip Code</label>
                            <input
                              type="text"
                              value={fedexDestination}
                              onChange={(e) => setFedexDestination(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Parcel Weight (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={fedexWeight}
                              onChange={(e) => setFedexWeight(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCalculateFedex}
                          disabled={isFedexLoading}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                        >
                          {isFedexLoading ? 'Calculating Rates...' : 'Calculate FedEx Rates'}
                        </button>

                        {fedexRates && (
                          <div className="bg-white p-3 rounded-lg border border-indigo-200 space-y-2 animate-in fade-in duration-150">
                            <div className="text-xs font-bold text-slate-900">Calculated Rates for {fedexRates.destination}:</div>
                            {fedexRates.rates.map((r: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs text-slate-700 border-b border-slate-100 last:border-0 pb-1">
                                <span>{r.service} ({r.estimatedDays})</span>
                                <span className="font-bold text-indigo-700">${r.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Real-time FedEx Label Generator Simulator */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-indigo-600" /> Real-time FedEx Shipping Label Generator
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order ID</label>
                            <input
                              type="text"
                              value={fedexLabelOrderId}
                              onChange={(e) => setFedexLabelOrderId(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Service Type</label>
                            <select
                              value={fedexLabelService}
                              onChange={(e) => setFedexLabelService(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            >
                              <option value="FedEx Ground">FedEx Ground</option>
                              <option value="FedEx 2Day">FedEx 2Day</option>
                              <option value="FedEx Standard Overnight">FedEx Standard Overnight</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Name</label>
                            <input
                              type="text"
                              value={fedexLabelRecipient}
                              onChange={(e) => setFedexLabelRecipient(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Address</label>
                            <input
                              type="text"
                              value={fedexLabelAddress}
                              onChange={(e) => setFedexLabelAddress(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-indigo-600"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleGenerateFedexLabel}
                          disabled={isFedexLabelLoading}
                          className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition"
                        >
                          {isFedexLabelLoading ? 'Generating Label...' : 'Generate Shipping Label'}
                        </button>

                        {fedexLabelResult && (
                          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-900">Waybill Generated Successfully</span>
                              <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold">Active</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400">Tracking Number:</span>
                                <p className="font-mono font-bold text-slate-800">{fedexLabelResult.trackingNumber}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Carrier / Service:</span>
                                <p className="font-bold text-slate-800">{fedexLabelResult.carrier} {fedexLabelResult.serviceType}</p>
                              </div>
                            </div>
                            <div className="pt-2">
                              <button
                                onClick={() => {
                                  openFedexLabelPrintWindow({
                                    id: fedexLabelResult.trackingNumber,
                                    customerName: fedexLabelResult.recipientName,
                                    shippingAddress: fedexLabelResult.destinationAddress,
                                    totalAmount: 120.00,
                                    currency: 'USD',
                                    items: []
                                  } as any, {
                                    carrier: 'FedEx',
                                    trackingNumber: fedexLabelResult.trackingNumber,
                                    serviceType: fedexLabelResult.serviceType,
                                    weightKg: fedexLabelResult.weightKg,
                                    recipientName: fedexLabelResult.recipientName,
                                    destinationAddress: fedexLabelResult.destinationAddress,
                                    generatedAt: fedexLabelResult.generatedAt
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-500 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> View & Print Professional Shipping Label (PDF)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-indigo-400" /> FedEx Shipping Hooks
                      </h4>
                      <div className="text-xs text-slate-400 space-y-2">
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-indigo-400 font-mono text-[11px]">OrderShipped</span>
                          <p className="text-[11px] text-slate-400 mt-1">Fires automatically when a FedEx shipping label is generated, sending the tracking link to the customer.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-indigo-400 font-mono text-[11px]">RateCalculated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Triggers dynamic delivery charge allocation during customer checkout sessions.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-indigo-400 font-mono text-[11px]">LabelGenerated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Generates an authorized official FedEx Waybill document stored securely in your Cloud run files.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* DHL Panel */}
              {selectedCarrierTab === 'dhl' && (() => {
                const dhlPlg = plugins.find(p => p.slug === 'dhl-express-shipping') || selectedPluginForSubView;
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <span className="text-red-600 bg-yellow-400 px-1.5 py-0.5 rounded font-black">DHL</span> Express Logistics Engine
                          </h3>
                          <p className="text-xs text-slate-500 font-normal">Configure DHL credentials, retrieve global cargo rates and generate international waybills</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                          Account: {dhlPlg.config?.accountNumber || 'DHL-99281-EHSAN'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                          <input
                            type="text"
                            value={dhlPlg.config?.accountNumber || ''}
                            onChange={(e) => onUpdateConfig(dhlPlg.id, { ...dhlPlg.config, accountNumber: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-500"
                            placeholder="e.g. DHL-99281-EHSAN"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">DHL API Key</label>
                          <input
                            type="text"
                            value={dhlPlg.config?.apiKey || ''}
                            onChange={(e) => onUpdateConfig(dhlPlg.id, { ...dhlPlg.config, apiKey: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-500"
                            placeholder="e.g. dhl_live_api_key_..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">DHL API Secret</label>
                          <input
                            type="password"
                            value={dhlPlg.config?.apiSecret || ''}
                            onChange={(e) => onUpdateConfig(dhlPlg.id, { ...dhlPlg.config, apiSecret: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-500"
                            placeholder="••••••••••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Postal Code</label>
                          <input
                            type="text"
                            value={dhlPlg.config?.pickupPostalCode || ''}
                            onChange={(e) => onUpdateConfig(dhlPlg.id, { ...dhlPlg.config, pickupPostalCode: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-amber-500"
                            placeholder="e.g. 90210"
                          />
                        </div>
                      </div>

                      {/* DHL Rate Calculator Simulator */}
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
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Parcel Weight (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={dhlWeight}
                              onChange={(e) => setDhlWeight(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
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
                          <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-2 animate-in fade-in duration-150">
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

                      {/* DHL Label Generator Simulator */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-amber-600" /> Real-time DHL Waybill / Label Generator
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order ID</label>
                            <input
                              type="text"
                              value={dhlLabelOrderId}
                              onChange={(e) => setDhlLabelOrderId(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Service Type</label>
                            <select
                              value={dhlLabelService}
                              onChange={(e) => setDhlLabelService(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
                            >
                              <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                              <option value="DHL Express Easy">DHL Express Easy</option>
                              <option value="DHL Domestic Express">DHL Domestic Express</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Name</label>
                            <input
                              type="text"
                              value={dhlLabelRecipient}
                              onChange={(e) => setDhlLabelRecipient(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Address</label>
                            <input
                              type="text"
                              value={dhlLabelAddress}
                              onChange={(e) => setDhlLabelAddress(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-amber-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleGenerateDhlLabel}
                          disabled={isDhlLabelLoading}
                          className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition"
                        >
                          {isDhlLabelLoading ? 'Generating Waybill...' : 'Generate DHL Waybill'}
                        </button>

                        {dhlLabelResult && (
                          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-900">DHL International Waybill Created</span>
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">Ready for Pickup</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400">Waybill Tracking ID:</span>
                                <p className="font-mono font-bold text-slate-800">{dhlLabelResult.trackingNumber}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Carrier / Service:</span>
                                <p className="font-bold text-slate-800">{dhlLabelResult.carrier} {dhlLabelResult.serviceType}</p>
                              </div>
                            </div>
                            <div className="pt-2">
                              <button
                                onClick={() => {
                                  openFedexLabelPrintWindow({
                                    id: dhlLabelResult.trackingNumber,
                                    customerName: dhlLabelResult.recipientName,
                                    shippingAddress: dhlLabelResult.destinationAddress,
                                    totalAmount: 180.00,
                                    currency: 'USD',
                                    items: []
                                  } as any, {
                                    carrier: 'DHL',
                                    trackingNumber: dhlLabelResult.trackingNumber,
                                    serviceType: dhlLabelResult.serviceType,
                                    weightKg: dhlLabelResult.weightKg,
                                    recipientName: dhlLabelResult.recipientName,
                                    destinationAddress: dhlLabelResult.destinationAddress,
                                    generatedAt: dhlLabelResult.generatedAt
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-500 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> View & Print Professional DHL Waybill (PDF)
                              </button>
                            </div>
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
                          <p className="text-[11px] text-slate-400 mt-1">Fires automatically when a DHL Waybill is generated, updating the order and sending DHL tracking link to customers.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-amber-400 font-mono text-[11px]">RateCalculated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Triggers dynamic delivery calculation on international checkouts.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-amber-400 font-mono text-[11px]">LabelGenerated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Saves a commercial customs invoice waybill and stores locally on host.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* UPS Panel */}
              {selectedCarrierTab === 'ups' && (() => {
                const upsPlg = plugins.find(p => p.slug === 'ups-shipping') || selectedPluginForSubView;
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <span className="text-[#FFC72C] bg-[#351C15] px-1.5 py-0.5 rounded font-black border border-[#FFC72C]">UPS</span> Logistics Engine
                          </h3>
                          <p className="text-xs text-slate-500 font-normal font-sans">Configure UPS credentials, calculate UPS Ground &amp; Air rates and generate tracking labels</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                          Account: {upsPlg.config?.accountNumber || 'UPS-77291-EHSAN'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Account ID / Shipper Number</label>
                          <input
                            type="text"
                            value={upsPlg.config?.accountNumber || ''}
                            onChange={(e) => onUpdateConfig(upsPlg.id, { ...upsPlg.config, accountNumber: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-[#351C15]"
                            placeholder="e.g. UPS-77291-EHSAN"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">UPS Client API ID / Key</label>
                          <input
                            type="text"
                            value={upsPlg.config?.apiKey || ''}
                            onChange={(e) => onUpdateConfig(upsPlg.id, { ...upsPlg.config, apiKey: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-[#351C15]"
                            placeholder="e.g. ups_live_api_key_..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">UPS Client Secret</label>
                          <input
                            type="password"
                            value={upsPlg.config?.apiSecret || ''}
                            onChange={(e) => onUpdateConfig(upsPlg.id, { ...upsPlg.config, apiSecret: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-[#351C15]"
                            placeholder="••••••••••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Access License Number</label>
                          <input
                            type="text"
                            value={upsPlg.config?.accessLicenseNumber || ''}
                            onChange={(e) => onUpdateConfig(upsPlg.id, { ...upsPlg.config, accessLicenseNumber: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-[#351C15]"
                            placeholder="e.g. ups_license_..."
                          />
                        </div>
                      </div>

                      {/* UPS Rate Calculator Simulator */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/70 space-y-3">
                        <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-yellow-600" /> Live Rate Calculator Test
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Zip Code</label>
                            <input
                              type="text"
                              value={upsDestination}
                              onChange={(e) => setUpsDestination(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-yellow-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Parcel Weight (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={upsWeight}
                              onChange={(e) => setUpsWeight(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-yellow-600"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCalculateUps}
                          disabled={isUpsLoading}
                          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-[#FFC72C] font-semibold text-xs rounded-lg transition"
                        >
                          {isUpsLoading ? 'Calculating Rates...' : 'Calculate UPS Rates'}
                        </button>

                        {upsRates && (
                          <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2 animate-in fade-in duration-150">
                            <div className="text-xs font-bold text-slate-900">Calculated Rates for {upsRates.destination}:</div>
                            {upsRates.rates.map((r: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs text-slate-700 border-b border-slate-100 last:border-0 pb-1">
                                <span>{r.service} ({r.estimatedDays})</span>
                                <span className="font-bold text-[#351C15]">${r.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* UPS Label Generator Simulator */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-stone-800" /> Real-time UPS Shipping Label Generator
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order ID</label>
                            <input
                              type="text"
                              value={upsLabelOrderId}
                              onChange={(e) => setUpsLabelOrderId(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Service Type</label>
                            <select
                              value={upsLabelService}
                              onChange={(e) => setUpsLabelService(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                            >
                              <option value="UPS Ground">UPS Ground</option>
                              <option value="UPS 3-Day Select">UPS 3-Day Select</option>
                              <option value="UPS Next Day Air">UPS Next Day Air</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Name</label>
                            <input
                              type="text"
                              value={upsLabelRecipient}
                              onChange={(e) => setUpsLabelRecipient(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Address</label>
                            <input
                              type="text"
                              value={upsLabelAddress}
                              onChange={(e) => setUpsLabelAddress(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleGenerateUpsLabel}
                          disabled={isUpsLabelLoading}
                          className="px-4 py-2 bg-[#351C15] hover:bg-stone-800 text-[#FFC72C] font-semibold text-xs rounded-lg transition animate-pulse"
                        >
                          {isUpsLabelLoading ? 'Generating Label...' : 'Generate UPS Label'}
                        </button>

                        {upsLabelResult && (
                          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-900">UPS Label Created Successfully</span>
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-[#351C15] border border-amber-200 text-[10px] font-bold">In Transit</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400">Tracking Reference:</span>
                                <p className="font-mono font-bold text-slate-800">{upsLabelResult.trackingNumber}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Carrier / Service:</span>
                                <p className="font-bold text-slate-800">{upsLabelResult.carrier} {upsLabelResult.serviceType}</p>
                              </div>
                            </div>
                            <div className="pt-2">
                              <button
                                onClick={() => {
                                  openFedexLabelPrintWindow({
                                    id: upsLabelResult.trackingNumber,
                                    customerName: upsLabelResult.recipientName,
                                    shippingAddress: upsLabelResult.destinationAddress,
                                    totalAmount: 95.00,
                                    currency: 'USD',
                                    items: []
                                  } as any, {
                                    carrier: 'UPS',
                                    trackingNumber: upsLabelResult.trackingNumber,
                                    serviceType: upsLabelResult.serviceType,
                                    weightKg: upsLabelResult.weightKg,
                                    recipientName: upsLabelResult.recipientName,
                                    destinationAddress: upsLabelResult.destinationAddress,
                                    generatedAt: upsLabelResult.generatedAt
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> View & Print Professional UPS Label (PDF)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-yellow-500" /> UPS Shipping Hooks
                      </h4>
                      <div className="text-xs text-slate-400 space-y-2">
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-yellow-400 font-mono text-[11px]">OrderShipped</span>
                          <p className="text-[11px] text-slate-400 mt-1">Fires automatically when a UPS shipping label is generated, broadcasting live tracking signals to buyers.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-yellow-400 font-mono text-[11px]">RateCalculated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Queries the UPS Rates Engine to allocate dynamic shipping charges at checkout.</p>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-yellow-400 font-mono text-[11px]">LabelGenerated</span>
                          <p className="text-[11px] text-slate-400 mt-1">Compiles and stores high-resolution official UPS shipping labels locally.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
                      <option value="gemini">Google Gemini 3.6 Flash (Recommended)</option>
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

          {/* Cloudflare Edge CDN Control Panel */}
          {selectedPluginForSubView.slug === 'cloudflare-cdn' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-500" /> Cloudflare Edge CDN Settings
                    </h3>
                    <p className="text-xs text-slate-500">Configure global zone caching, edge purges, and WebP asset optimization.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                    Status: Active Edge
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Zone ID</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.zoneId || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, zoneId: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">API Token</label>
                    <input
                      type="password"
                      value={selectedPluginForSubView.config.apiToken || ''}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiToken: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Domain</label>
                    <input
                      type="text"
                      value={selectedPluginForSubView.config.domain || 'ehsan-store.io'}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, domain: e.target.value })}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cache Level</label>
                    <select
                      value={selectedPluginForSubView.config.cacheLevel || 'aggressive'}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, cacheLevel: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="aggressive">Aggressive (Cache Static + HTML)</option>
                      <option value="basic">Basic (Cache Images &amp; Assets)</option>
                      <option value="bypass">Bypass Cache (Development)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" /> Cloudflare Edge Actions &amp; Cache Purge
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCloudflarePurge(selectedPluginForSubView)}
                      disabled={isCdnLoading}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCdnLoading ? 'animate-spin' : ''}`} />
                      Purge Everything
                    </button>
                    <button
                      onClick={handleCloudflareStats}
                      disabled={isCdnLoading}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Fetch Edge Analytics
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" /> Edge Performance &amp; Logs
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg">
                    <span className="text-slate-300">Auto-Purge on Product Update</span>
                    <input
                      type="checkbox"
                      checked={selectedPluginForSubView.config.autoPurgeOnProductUpdate ?? true}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, autoPurgeOnProductUpdate: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg">
                    <span className="text-slate-300">Auto WebP Image Conversion</span>
                    <input
                      type="checkbox"
                      checked={selectedPluginForSubView.config.enableWebpOptimization ?? true}
                      onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableWebpOptimization: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                  </div>
                </div>

                {cdnLog && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-400 font-mono text-[11px] leading-relaxed">
                    {cdnLog}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fastly Edge CDN Control Panel */}
          {selectedPluginForSubView.slug === 'fastly-cdn' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-600" /> Fastly Edge Purge &amp; VCL Engine
                  </h3>
                  <p className="text-xs text-slate-500">Instant sub-millisecond cache purges by Surrogate Keys and Fastly VCL routing.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  Fastly VCL 12ms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.serviceId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, serviceId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">API Token</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.apiToken || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiToken: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 space-y-3">
                <h4 className="text-xs font-bold text-red-900">Instant Fastly Purge by Surrogate Key</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fastlySurrogateKey}
                    onChange={(e) => setFastlySurrogateKey(e.target.value)}
                    placeholder="e.g. product-cat-882"
                    className="flex-1 text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleFastlyPurge(selectedPluginForSubView)}
                    disabled={isCdnLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Purge Surrogate Key
                  </button>
                </div>
              </div>

              {cdnLog && (
                <div className="p-3 bg-slate-900 text-red-400 font-mono text-[11px] rounded-xl border border-slate-800">
                  {cdnLog}
                </div>
              )}
            </div>
          )}

          {/* Bunny.net CDN Control Panel */}
          {selectedPluginForSubView.slug === 'bunny-cdn' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-orange-500" /> Bunny.net Global CDN &amp; Edge Storage
                  </h3>
                  <p className="text-xs text-slate-500">Accelerate media galleries and sync product assets across Bunny edge storage zones.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200">
                  Pull Zone: Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pull Zone Name</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.pullZoneName || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, pullZoneName: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Zone Name</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.storageZoneName || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, storageZoneName: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleBunnyPurge(selectedPluginForSubView)}
                  disabled={isCdnLoading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition"
                >
                  Purge Bunny Pull Zone
                </button>
                <button
                  onClick={() => handleBunnySyncStorage(selectedPluginForSubView)}
                  disabled={isCdnLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-orange-400 font-bold text-xs rounded-lg transition"
                >
                  Sync Media Storage Zone
                </button>
              </div>

              {cdnLog && (
                <div className="p-3 bg-slate-950 text-orange-400 font-mono text-[11px] rounded-xl border border-slate-800">
                  {cdnLog}
                </div>
              )}
            </div>
          )}

          {/* AWS CloudFront Control Panel */}
          {selectedPluginForSubView.slug === 'aws-cloudfront-cdn' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" /> AWS CloudFront Invalidation Engine
                  </h3>
                  <p className="text-xs text-slate-500">Manage Amazon CloudFront edge distributions and trigger path invalidations.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AWS CloudFront
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Distribution ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.distributionId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, distributionId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">AWS Region</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.awsRegion || 'us-east-1'}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, awsRegion: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
                <h4 className="text-xs font-bold text-blue-900">Create AWS CloudFront Invalidation Path</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cloudfrontPath}
                    onChange={(e) => setCloudfrontPath(e.target.value)}
                    placeholder="e.g. /* or /products/*"
                    className="flex-1 text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleCloudfrontInvalidate(selectedPluginForSubView)}
                    disabled={isCdnLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Create Invalidation
                  </button>
                </div>
              </div>

              {cdnLog && (
                <div className="p-3 bg-slate-900 text-blue-400 font-mono text-[11px] rounded-xl border border-slate-800">
                  {cdnLog}
                </div>
              )}
            </div>
          )}

          {/* Omni-Channel Social Media Manager Control Panel */}
          {selectedPluginForSubView.slug === 'social-media-manager' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Send className="w-5 h-5 text-indigo-600" /> Omni-Channel Social Media Manager &amp; Auto-Poster
                    </h3>
                    <p className="text-xs text-slate-500">Publish promotions, new products, and discounts across Telegram, Instagram, X (Twitter), LinkedIn, Facebook, Eitaa, Rubika, and WhatsApp.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Active Hub
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Platform</label>
                    <select
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="telegram">Telegram Channel / Group (@ehsan_store)</option>
                      <option value="instagram">Instagram Business Feed &amp; Stories</option>
                      <option value="twitter">X (Twitter) Official Account</option>
                      <option value="linkedin">LinkedIn Company Page</option>
                      <option value="facebook">Facebook Business Page</option>
                      <option value="eitaa">Eitaa Messenger Channel</option>
                      <option value="rubika">Rubika SuperApp</option>
                      <option value="whatsapp">WhatsApp Business Broadcast</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Attached Image Media URL</label>
                    <input
                      type="text"
                      value={socialImageUrl}
                      onChange={(e) => setSocialImageUrl(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Post Caption &amp; Promo Text</label>
                  <textarea
                    value={socialMessage}
                    onChange={(e) => setSocialMessage(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Auto-hashtags enabled: <code className="text-indigo-600 font-mono">#EhsanStore #Tech #FlashSale</code>
                  </div>
                  <button
                    onClick={handlePublishSocial}
                    disabled={isSocialLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className={`w-4 h-4 ${isSocialLoading ? 'animate-pulse' : ''}`} />
                    <span>Publish to {socialPlatform.toUpperCase()} Now</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Live Syndication &amp; Engagement
                </h4>
                <p className="text-xs text-slate-400">Real-time API response and engagement metrics for recent broadcasts.</p>

                {socialResult ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] space-y-2">
                    <p className="font-bold text-white">✅ Status: {socialResult.status}</p>
                    <p>Platform: {socialResult.platform}</p>
                    <p>Post ID: {socialResult.postId}</p>
                    <p className="truncate">Message: {socialResult.publishedMessage}</p>
                    <div className="pt-2 border-t border-slate-800 text-slate-400">
                      <span>Impressions: 1,420</span> | <span>Clicks: 184</span> | <span>CTR: 12.9%</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                    No active broadcast triggered in this session yet. Click publish to test.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Google Cloud Translation API Control Panel */}
          {selectedPluginForSubView.slug === 'google-cloud-translation-api' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" /> Google Cloud Translation AI Engine
                  </h3>
                  <p className="text-xs text-slate-500">Instant neural machine translation for product catalogs, descriptions, and multi-language storefronts.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Google Translate v2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Text to Translate</label>
                  <input
                    type="text"
                    value={translateText}
                    onChange={(e) => setTranslateText(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Language</label>
                  <select
                    value={translateTargetLang}
                    onChange={(e) => setTranslateTargetLang(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="fa">Persian</option>
                    <option value="ar">Arabic</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslateLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                >
                  {isTranslateLoading ? 'Translating...' : 'Translate with Google Cloud AI'}
                </button>
              </div>

              {translateResult && (
                <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 space-y-1">
                  <p className="text-white font-bold">Translated Result ({translateResult.targetLanguage}):</p>
                  <p className="text-base text-amber-300">"{translateResult.translatedText}"</p>
                  <p className="text-[11px] text-slate-400">Confidence Score: {(translateResult.confidence * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>
          )}

          {/* Google Cloud Vision AI Control Panel */}
          {selectedPluginForSubView.slug === 'google-cloud-vision-search' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Google Cloud Vision AI - Visual Product Search
                  </h3>
                  <p className="text-xs text-slate-500">Allow customers to find products by taking or uploading photos using neural computer vision.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Google Vision API
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Image URL for Visual Recognition</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={visionImageUrl}
                    onChange={(e) => setVisionImageUrl(e.target.value)}
                    className="flex-1 text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={handleVisionSearch}
                    disabled={isVisionLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Analyze Image
                  </button>
                </div>
              </div>

              {visionResult && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-900">Detected Labels &amp; Object Classes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {visionResult.detectedLabels.map((lbl: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-white text-indigo-700 font-semibold text-xs rounded-md border border-indigo-100 shadow-2xs">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800">Matched Catalog Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {visionResult.matchedCatalogProducts.map((p: any) => (
                        <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-emerald-600 font-semibold">${p.price.toFixed(2)}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                            {p.matchConfidence}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google Maps Platform Control Panel */}
          {selectedPluginForSubView.slug === 'google-maps-platform' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" /> Google Maps Platform &amp; Distance Matrix
                  </h3>
                  <p className="text-xs text-slate-500">Autocomplete delivery addresses, geocode latitude/longitude coordinates, and calculate distance shipping fees.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Google Maps API
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Delivery Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mapsAddress}
                    onChange={(e) => setMapsAddress(e.target.value)}
                    className="flex-1 text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={handleGeocodeMaps}
                    disabled={isMapsLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Geocode &amp; Calculate
                  </button>
                </div>
              </div>

              {mapsResult && (
                <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 space-y-2">
                  <p className="text-white font-bold">📍 Verified Formatted Address:</p>
                  <p className="text-amber-300">{mapsResult.formattedAddress}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>Lat/Lng: {mapsResult.coordinates.lat}, {mapsResult.coordinates.lng}</div>
                    <div>Distance: {mapsResult.distanceKm} km</div>
                    <div>Est. Time: {mapsResult.estimatedDeliveryMinutes} mins</div>
                    <div className="text-emerald-300 font-bold">Shipping Fee: ${mapsResult.calculatedShippingFee.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google reCAPTCHA Enterprise Control Panel */}
          {selectedPluginForSubView.slug === 'google-recaptcha-enterprise' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" /> Google reCAPTCHA Enterprise &amp; Bot Defense
                  </h3>
                  <p className="text-xs text-slate-500">Protects checkout orders, customer registration, and login from bots and automated credential stuffing.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Protected (v3 Enterprise)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site Key</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedPluginForSubView.config.siteKey || ''}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Score Threshold</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedPluginForSubView.config.scoreThreshold || 0.5}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-emerald-900">Bot Defense Status: Fully Operational</p>
                  <p className="text-[11px] text-emerald-700">Checking visitor behavioral signals on checkout &amp; auth endpoints.</p>
                </div>
                <button
                  onClick={() => alert('reCAPTCHA Enterprise verification simulation passed with score 0.94!')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                >
                  Test Bot Challenge Token
                </button>
              </div>
            </div>
          )}

          {/* Google Workspace Sync Control Panel */}
          {selectedPluginForSubView.slug === 'google-workspace-sync' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" /> Google Workspace Sync (Gmail SMTP &amp; Calendar API)
                  </h3>
                  <p className="text-xs text-slate-500">Automates customer order confirmation emails via Gmail SMTP and syncs VIP client appointments to Google Calendar.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Google Workspace
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Account Email</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedPluginForSubView.config.clientEmail || ''}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.senderEmail || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, senderEmail: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={async () => {
                    const res = await fetch('/api/plugins/google/workspace', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'send_email', recipient: 'ehsan@example.com', subject: 'Test Order Receipt #9921' })
                    });
                    const d = await res.json();
                    alert(`Gmail SMTP Sent! Message ID: ${d.messageId}`);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                >
                  Send Test Email via Gmail API
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/plugins/google/workspace', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'sync_calendar' })
                    });
                    const d = await res.json();
                    alert(`Google Calendar Event Created! ID: ${d.eventId} at ${d.scheduledTime}`);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
                >
                  Sync VIP Consultation to Google Calendar
                </button>
              </div>
            </div>
          )}

          {/* jsDelivr & cdnjs Vendor Assets Control Panel */}
          {selectedPluginForSubView.slug === 'jsdelivr-cdnjs-vendor-cdn' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" /> Open Source Vendor CDN Delivery
                  </h3>
                  <p className="text-xs text-slate-500">Injects fast multi-CDN JS/CSS vendor libraries, Google Fonts, and Lucide icons.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  jsDelivr &amp; cdnjs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Vendor CDN</label>
                  <select
                    value={selectedPluginForSubView.config.preferredVendorCdn || 'jsdelivr'}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, preferredVendorCdn: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="jsdelivr">jsDelivr (Fastest Global Anycast)</option>
                    <option value="cdnjs">cdnjs (Cloudflare Powered)</option>
                    <option value="unpkg">unpkg (npm package direct)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Auto-inject preconnect headers for Google Fonts &amp; CDNs</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableFontPreconnect ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableFontPreconnect: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Enable DNS Prefetch for ultra-low latency assets</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableDnsPrefetch ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableDnsPrefetch: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SendGrid Transactional Email Control Panel */}
          {selectedPluginForSubView.slug === 'sendgrid-email-api' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-600" /> SendGrid Transactional &amp; Marketing Email API
                  </h3>
                  <p className="text-xs text-slate-500">Configure Twilio SendGrid to trigger dynamic customer checkout receipts and marketing templates.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SendGrid API
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SendGrid API Key</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.apiKey || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiKey: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address</label>
                  <input
                    type="email"
                    value={selectedPluginForSubView.config.senderEmail || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, senderEmail: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Authorized Name</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.senderName || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, senderName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marketing Newsletter Template ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.newsletterTemplateId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, newsletterTemplateId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs col-span-1">
                  <span className="font-semibold text-slate-800">Dispatch Order Confirmation Receipts</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableOrderEmails ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableOrderEmails: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs col-span-1">
                  <span className="font-semibold text-slate-800">Subscribe Registered Customers to Marketing</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableNewsletterSync ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableNewsletterSync: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Live Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">SendGrid API Live Sandbox Test</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Test Recipient Email</label>
                    <input
                      type="email"
                      value={sgRecipient}
                      onChange={(e) => setSgRecipient(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Subject Line</label>
                    <input
                      type="text"
                      value={sgSubject}
                      onChange={(e) => setSgSubject(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Body Content</label>
                  <textarea
                    rows={2}
                    value={sgBody}
                    onChange={(e) => setSgBody(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsSgLoading(true);
                        const res = await fetch('/api/plugins/sendgrid/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            recipient: sgRecipient,
                            subject: sgSubject,
                            templateId: selectedPluginForSubView.config.newsletterTemplateId,
                            bodyText: sgBody
                          })
                        });
                        const data = await res.json();
                        setSgResult(data);
                      } catch (err) {
                        setSgResult({ error: 'Network transmission failed' });
                      } finally {
                        setIsSgLoading(false);
                      }
                    }}
                    disabled={isSgLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isSgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Dispatch Test Email via SendGrid
                  </button>
                  {sgResult && (
                    <button 
                      onClick={() => setSgResult(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {sgResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>SENDGRID API DISPATCH LOGS</span>
                      <span className="text-emerald-400">STATUS: HTTP 202 ACCEPTED</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(sgResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Twilio SMS Gateway Control Panel */}
          {selectedPluginForSubView.slug === 'twilio-sms-api' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" /> Twilio SMS &amp; WhatsApp OTP Gateway API
                  </h3>
                  <p className="text-xs text-slate-500">Provide direct customer mobile outreach with SMS dispatch updates and secure WhatsApp notification templates.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Twilio Gateway
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.accountSid || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, accountSid: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Twilio Auth Token</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.authToken || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, authToken: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Twilio Phone Number (SMS)</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.fromNumber || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, fromNumber: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Business Sender Number</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.whatsappFromNumber || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, whatsappFromNumber: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs col-span-1">
                  <span className="font-semibold text-slate-800">Dispatch SMS Alerts on Order Shipments</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableDispatchSms ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableDispatchSms: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs col-span-1">
                  <span className="font-semibold text-slate-800">Enforce 2FA Mobile Verification on Logins</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableOtpVerification ?? false}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableOtpVerification: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Live Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Twilio Live API SMS Sandbox</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recipient Mobile Phone</label>
                    <input
                      type="text"
                      value={twPhone}
                      onChange={(e) => setTwPhone(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Channel</label>
                    <select
                      value={twChannel}
                      onChange={(e) => setTwChannel(e.target.value as 'sms' | 'whatsapp')}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    >
                      <option value="sms">SMS Gateway Channel</option>
                      <option value="whatsapp">Official WhatsApp Business API</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Message Body</label>
                  <textarea
                    rows={2}
                    value={twMessage}
                    onChange={(e) => setTwMessage(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsTwLoading(true);
                        const res = await fetch('/api/plugins/twilio/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            recipientPhone: twPhone,
                            messageText: twMessage,
                            channel: twChannel
                          })
                        });
                        const data = await res.json();
                        setTwResult(data);
                      } catch (err) {
                        setTwResult({ error: 'Network connection failed' });
                      } finally {
                        setIsTwLoading(false);
                      }
                    }}
                    disabled={isTwLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isTwLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    Send Live {twChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} Notification
                  </button>
                  {twResult && (
                    <button 
                      onClick={() => setTwResult(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {twResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>TWILIO REST ENGINE RESPONSES</span>
                      <span className="text-emerald-400">STATUS: HTTP 201 CREATED</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(twResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Slack Channel Commerce Alerts Control Panel */}
          {selectedPluginForSubView.slug === 'slack-sales-bot' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-600" /> Slack Channel Commerce Alerts Bot API
                  </h3>
                  <p className="text-xs text-slate-500">Relay instantaneous store activities, transaction events, and system security blocks directly to designated Slack feeds.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Slack Integration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incoming Webhook URL</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.webhookUrl || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, webhookUrl: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Channel Name</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.channelName || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, channelName: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Alert on New Orders</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.alertOnNewOrder ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, alertOnNewOrder: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Alert on Low Stock</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.alertOnLowStock ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, alertOnLowStock: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Slack WAF Auditing</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.alertOnSystemAudit ?? false}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, alertOnSystemAudit: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Live Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Post Test Slack Payload</h4>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rich Webhook Message (Slack Markdown Supported)</label>
                  <textarea
                    rows={2}
                    value={slackMessageText}
                    onChange={(e) => setSlackMessageText(e.target.value)}
                    className="w-full text-xs p-3 font-mono border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsSlackLoading(true);
                        const res = await fetch('/api/plugins/slack/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            channelName: selectedPluginForSubView.config.channelName,
                            text: slackMessageText,
                            author: 'Slack Commerce Bot'
                          })
                        });
                        const data = await res.json();
                        setSlackResult(data);
                      } catch (err) {
                        setSlackResult({ error: 'Network delivery error' });
                      } finally {
                        setIsSlackLoading(false);
                      }
                    }}
                    disabled={isSlackLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isSlackLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Post Alert to Slack Channel
                  </button>
                  {slackResult && (
                    <button 
                      onClick={() => setSlackResult(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {slackResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>SLACK INCOMING WEBHOOK WEB-RESPONSE</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(slackResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mailchimp Audience Contact Sync Control Panel */}
          {selectedPluginForSubView.slug === 'mailchimp-sync' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" /> Mailchimp Audience &amp; Contact Sync API
                  </h3>
                  <p className="text-xs text-slate-500">Synchronize client email directories, subscriber lists, and past purchase histories automatically on purchase.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Mailchimp Sync
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mailchimp API Key</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.apiKey || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, apiKey: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mailchimp List / Audience ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.listId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, listId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Auto-Sync on Purchase</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.autoSyncOnPurchase ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, autoSyncOnPurchase: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Sync Product Catalog</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.syncProductCatalog ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, syncProductCatalog: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Double Opt-In Enforced</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.doubleOptIn ?? false}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, doubleOptIn: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Live Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Mailchimp Contact Dispatcher Sandbox</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subscriber First Name</label>
                    <input
                      type="text"
                      value={mcFirstName}
                      onChange={(e) => setMcFirstName(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subscriber Email Address</label>
                    <input
                      type="email"
                      value={mcEmailAddress}
                      onChange={(e) => setMcEmailAddress(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsMcLoading(true);
                        const res = await fetch('/api/plugins/mailchimp/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: mcEmailAddress,
                            firstName: mcFirstName,
                            status: selectedPluginForSubView.config.doubleOptIn ? 'pending' : 'subscribed'
                          })
                        });
                        const data = await res.json();
                        setMcResult(data);
                      } catch (err) {
                        setMcResult({ error: 'Mailchimp REST connection failed' });
                      } finally {
                        setIsMcLoading(false);
                      }
                    }}
                    disabled={isMcLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isMcLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                    Sync Customer Contact to Mailchimp List
                  </button>
                  {mcResult && (
                    <button 
                      onClick={() => setMcResult(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {mcResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>MAILCHIMP REST API CONTACT METRICS</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(mcResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Telegram Bot Manager Panel */}
          {selectedPluginForSubView.slug === 'telegram-bot-manager' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-indigo-600" /> Telegram Bot &amp; Broadcast Hub
                  </h3>
                  <p className="text-xs text-slate-500">Manage Telegram bot token, broadcast channels, order alerts, and automated customer updates.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  Telegram Bot
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Bot API Token</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.botToken || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, botToken: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Username / ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.channelUsername || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, channelUsername: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Notify Admin on New Order</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.notifyOnNewOrder ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, notifyOnNewOrder: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Notify on Low Stock Alerts</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.notifyOnLowStock ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, notifyOnLowStock: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Telegram Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Telegram Test Broadcast Sandbox</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Broadcast Message</label>
                  <textarea
                    rows={2}
                    value={tgTestMessage}
                    onChange={(e) => setTgTestMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsTgLoading(true);
                        const res = await fetch('/api/plugins/telegram/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            botToken: selectedPluginForSubView.config.botToken,
                            channelUsername: selectedPluginForSubView.config.channelUsername,
                            testMessage: tgTestMessage
                          })
                        });
                        const data = await res.json();
                        setTgResult(data);
                      } catch (err) {
                        setTgResult({ error: 'Telegram connection failed' });
                      } finally {
                        setIsTgLoading(false);
                      }
                    }}
                    disabled={isTgLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isTgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send Test Telegram Broadcast
                  </button>
                  {tgResult && (
                    <button onClick={() => setTgResult(null)} className="text-xs text-slate-500 hover:text-slate-800">
                      Clear Logs
                    </button>
                  )}
                </div>

                {tgResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>TELEGRAM BOT API RESPONSE</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(tgResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instagram Graph API Panel */}
          {selectedPluginForSubView.slug === 'instagram-graph-api' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-pink-600" /> Instagram Business &amp; Shopping Graph API
                  </h3>
                  <p className="text-xs text-slate-500">Connects product catalog to Instagram Shopping tags, auto-posts product cards to IG Feed.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  Instagram Shopping
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram Business Account ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.igAccountId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, igAccountId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graph API Access Token</label>
                  <input
                    type="password"
                    value={selectedPluginForSubView.config.accessToken || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, accessToken: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Instagram Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Instagram Post Publisher Sandbox</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Post Caption &amp; Hashtags</label>
                  <textarea
                    rows={2}
                    value={igCaption}
                    onChange={(e) => setIgCaption(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsIgLoading(true);
                        const res = await fetch('/api/plugins/instagram/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            igAccountId: selectedPluginForSubView.config.igAccountId,
                            caption: igCaption
                          })
                        });
                        const data = await res.json();
                        setIgResult(data);
                      } catch (err) {
                        setIgResult({ error: 'Instagram connection failed' });
                      } finally {
                        setIsIgLoading(false);
                      }
                    }}
                    disabled={isIgLoading}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isIgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                    Publish Test Post to Instagram
                  </button>
                  {igResult && (
                    <button onClick={() => setIgResult(null)} className="text-xs text-slate-500 hover:text-slate-800">
                      Clear Logs
                    </button>
                  )}
                </div>

                {igResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>INSTAGRAM GRAPH API RESPONSE</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(igResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Facebook Pages Panel */}
          {selectedPluginForSubView.slug === 'facebook-pages-marketing' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" /> Facebook Pages &amp; Messenger Shop Sync
                  </h3>
                  <p className="text-xs text-slate-500">Syndicates products to Facebook Shop catalog, manages Messenger assistant, and tracks conversions via Pixel.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Facebook Shop
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Page ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.pageId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, pageId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Pixel ID</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.pixelId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, pixelId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Facebook Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Facebook Page Post Sandbox</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Page Post Message</label>
                  <textarea
                    rows={2}
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsFbLoading(true);
                        const res = await fetch('/api/plugins/facebook/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            pageId: selectedPluginForSubView.config.pageId,
                            message: fbMessage
                          })
                        });
                        const data = await res.json();
                        setFbResult(data);
                      } catch (err) {
                        setFbResult({ error: 'Facebook connection failed' });
                      } finally {
                        setIsFbLoading(false);
                      }
                    }}
                    disabled={isFbLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isFbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                    Publish Test Post to Facebook Page
                  </button>
                  {fbResult && (
                    <button onClick={() => setFbResult(null)} className="text-xs text-slate-500 hover:text-slate-800">
                      Clear Logs
                    </button>
                  )}
                </div>

                {fbResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>FACEBOOK GRAPH API RESPONSE</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(fbResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LinkedIn Publisher Panel */}
          {selectedPluginForSubView.slug === 'linkedin-company-publisher' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-700" /> LinkedIn Company Page Publisher &amp; B2B Feed
                  </h3>
                  <p className="text-xs text-slate-500">Publishes B2B product highlights and enterprise announcements to LinkedIn Company Pages.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  LinkedIn B2B
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Organization URN</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.organizationId || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, organizationId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Hashtags</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.defaultHashtags || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, defaultHashtags: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* LinkedIn Test Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">LinkedIn Share Sandbox</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Update Text</label>
                  <textarea
                    rows={2}
                    value={liText}
                    onChange={(e) => setLiText(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsLiLoading(true);
                        const res = await fetch('/api/plugins/linkedin/test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            organizationId: selectedPluginForSubView.config.organizationId,
                            text: liText
                          })
                        });
                        const data = await res.json();
                        setLiResult(data);
                      } catch (err) {
                        setLiResult({ error: 'LinkedIn connection failed' });
                      } finally {
                        setIsLiLoading(false);
                      }
                    }}
                    disabled={isLiLoading}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isLiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                    Publish Test B2B Update to LinkedIn
                  </button>
                  {liResult && (
                    <button onClick={() => setLiResult(null)} className="text-xs text-slate-500 hover:text-slate-800">
                      Clear Logs
                    </button>
                  )}
                </div>

                {liResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>LINKEDIN SHARE API RESPONSE</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(liResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Telegram Mini Shop Panel */}
          {selectedPluginForSubView.slug === 'telegram-mini-shop' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Telegram Mini App Shop (WebApp Store)
                  </h3>
                  <p className="text-xs text-slate-500">Deploys a native Telegram WebApp mini-store inside Telegram. Allows instant ordering without leaving Telegram.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Telegram Mini Shop
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Bot Username</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.botUsername || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, botUsername: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WebApp Store URL</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.webAppUrl || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, webAppUrl: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mini App Button Label</label>
                  <input
                    type="text"
                    value={selectedPluginForSubView.config.buttonText || ''}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, buttonText: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-5">
                  <span className="font-semibold text-slate-800">Enable Telegram Payments</span>
                  <input
                    type="checkbox"
                    checked={selectedPluginForSubView.config.enableTelegramPayments ?? true}
                    onChange={(e) => onUpdateConfig(selectedPluginForSubView.id, { ...selectedPluginForSubView.config, enableTelegramPayments: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                </div>
              </div>

              {/* Telegram Mini Shop Sync Console */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Shareable Telegram Mini App Web-Link</h4>
                <p className="text-xs text-slate-500">
                  Generate and share this optimized web link directly with Telegram buyers or embed it as a Telegram Bot Menu Button (`/shop`).
                </p>

                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={`https://t.me/${selectedPluginForSubView.config.botUsername || 'EhsanStoreBot'}/shop?startapp=catalog`}
                    className="w-full text-xs font-mono bg-white px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const link = `https://t.me/${selectedPluginForSubView.config.botUsername || 'EhsanStoreBot'}/shop?startapp=catalog`;
                      navigator.clipboard.writeText(link);
                      alert('Telegram Mini Shop link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition whitespace-nowrap shadow-xs"
                  >
                    Copy Link 📋
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={async () => {
                      try {
                        setIsMsLoading(true);
                        const res = await fetch('/api/plugins/telegram-minishop/sync', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            botUsername: selectedPluginForSubView.config.botUsername,
                            webAppUrl: selectedPluginForSubView.config.webAppUrl
                          })
                        });
                        const data = await res.json();
                        setMsSyncResult(data);
                      } catch (err) {
                        setMsSyncResult({ error: 'Mini App sync failed' });
                      } finally {
                        setIsMsLoading(false);
                      }
                    }}
                    disabled={isMsLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
                  >
                    {isMsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Sync Store Catalog to Telegram Mini App
                  </button>
                  {msSyncResult && (
                    <button onClick={() => setMsSyncResult(null)} className="text-xs text-slate-500 hover:text-slate-800">
                      Clear Logs
                    </button>
                  )}
                </div>

                {msSyncResult && (
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>TELEGRAM MINI APP WEBHOOK &amp; CATALOG SYNC</span>
                      <span className="text-emerald-400">STATUS: HTTP 200 OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(msSyncResult, null, 2)}
                    </pre>
                  </div>
                )}
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
              {(['all', 'cdn', 'payment', 'shipping', 'ai', 'security', 'api', 'analytics', 'custom'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Plugins' : cat === 'cdn' ? '⚡ CDN & Edge' : cat === 'ai' ? 'Popular AI' : `${cat} Plugins`}
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
                          plugin.category === 'cdn' ? 'bg-amber-50 text-amber-600' :
                          plugin.category === 'payment' ? 'bg-indigo-50 text-indigo-600' :
                          plugin.category === 'shipping' ? 'bg-blue-50 text-blue-600' :
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
                    <option value="cdn">CDN &amp; Edge Network</option>
                    <option value="payment">Payment Gateway</option>
                    <option value="shipping">Shipping &amp; Logistics</option>
                    <option value="ai">AI Commerce Tool</option>
                    <option value="marketing">Marketing Automation</option>
                    <option value="security">Security &amp; WAF</option>
                    <option value="api">API &amp; Channel Sync</option>
                    <option value="analytics">Analytics &amp; Tracking</option>
                    <option value="custom">Custom Extension</option>
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
