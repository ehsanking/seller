import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Settings, 
  Eye, 
  Code2, 
  Smartphone, 
  Monitor, 
  Tablet, 
  RefreshCw, 
  Copy, 
  Download, 
  Upload, 
  Check, 
  Info, 
  MapPin, 
  Tag, 
  MessageSquare, 
  Layout, 
  Sliders, 
  FolderPlus,
  Play,
  Save,
  ChevronRight
} from 'lucide-react';
import { Product, StoreBranch } from '../types';

interface CraftNode {
  id: string;
  type: 
    | 'announcement' 
    | 'hero' 
    | 'products' 
    | 'german_spotlight' 
    | 'promo' 
    | 'testimonials' 
    | 'footer' 
    | 'blog' 
    | 'custom_page'
    | 'daisy_stats'
    | 'daisy_hero'
    | 'daisy_card'
    | 'daisy_steps'
    | 'daisy_timeline'
    | 'daisy_collapse'
    | 'daisy_alert';
  displayName: string;
  props: Record<string, any>;
}

interface PageBuilderViewProps {
  products: Product[];
  settings?: any;
}

export function PageBuilderView({ products, settings }: PageBuilderViewProps) {
  // Preset Templates
  const templatesPreset = {
    germanyLaunch: [
      {
        id: 'node_announcement',
        type: 'announcement' as const,
        displayName: 'Announcement Bar',
        props: {
          text: '⚡ Willkommen bei Ehsan Seller DE • Kostenloser Expressversand ab 75€ ⚡',
          bgGradient: true,
          bgColor: '#4f46e5',
          textColor: '#ffffff',
          fontSize: 'text-xs',
          paddingY: 'py-2',
        }
      },
      {
        id: 'node_hero',
        type: 'hero' as const,
        displayName: 'Hero Banner',
        props: {
          title: 'Premium Ergonomie & Gaming Equipment',
          subtitle: 'Direkt aus Berlin geliefert. Entdecken Sie mechanische Tastaturen, Präzisionsmäuse und Studio-Zubehör der Spitzenklasse.',
          ctaText: 'Jetzt einkaufen',
          imageUrl: 'https://images.unsplash.com/photo-1618953793470-8785375507c3?auto=format&fit=crop&w=1200&q=80',
          align: 'center',
          height: 'h-[420px]',
          overlayOpacity: 50,
          buttonBgColor: '#4f46e5'
        }
      },
      {
        id: 'node_german_spotlight',
        type: 'german_spotlight' as const,
        displayName: 'German Branch Spotlight',
        props: {
          title: 'Besuchen Sie uns in Berlin Mitte',
          description: 'Unser deutsches Flagship-Store im Herzen von Berlin bietet Ihnen die Möglichkeit, alle mechanischen Keyboards vor Ort zu testen.',
          branchId: 'branch_1',
          branchName: 'Berlin Central Branch',
          branchAddress: 'Friedrichstraße 43, 10117 Berlin',
          branchPhone: '+49 30 12345678',
          showHours: true,
          themeColor: '#4f46e5'
        }
      },
      {
        id: 'node_products',
        type: 'products' as const,
        displayName: 'Featured Products',
        props: {
          category: 'all',
          title: 'Bestseller in Deutschland',
          cols: 3,
          limit: 3,
          showPrice: true,
          badgeText: 'Neuheit'
        }
      },
      {
        id: 'node_promo',
        type: 'promo' as const,
        displayName: 'Promo Countdown',
        props: {
          title: 'Eröffnungsangebot: 20% Rabatt',
          discountCode: 'BERLIN20',
          buttonText: 'Gutschein kopieren',
          percentage: '20%',
          bgImage: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80'
        }
      },
      {
        id: 'node_testimonials',
        type: 'testimonials' as const,
        displayName: 'Customer Reviews',
        props: {
          title: 'Was unsere Kunden in München & Frankfurt sagen',
          author: 'Maximilian K., Frankfurt',
          testimonialText: 'Die Tastatur ist ein Meisterwerk! Schneller Versand nach Frankfurt am Main und unschlagbarer Support.',
          rating: 5
        }
      },
      {
        id: 'node_footer',
        type: 'footer' as const,
        displayName: 'Store Footer',
        props: {
          copyrightText: '© 2026 Ehsan Seller DE. Alle Rechte vorbehalten. Impressum & Datenschutz.',
          showSocials: true,
          email: 'de-support@ehsan-seller.de'
        }
      }
    ],
    minimalistic: [
      {
        id: 'node_announcement',
        type: 'announcement' as const,
        displayName: 'Announcement Bar',
        props: {
          text: 'Sommer-Sonderverkauf: Nutzen Sie den Code SOMMER10',
          bgGradient: false,
          bgColor: '#0f172a',
          textColor: '#f8fafc',
          fontSize: 'text-xs',
          paddingY: 'py-1.5',
        }
      },
      {
        id: 'node_hero',
        type: 'hero' as const,
        displayName: 'Hero Banner',
        props: {
          title: 'The Art of Desk Aesthetics',
          subtitle: 'Schlanke Aluminiumständer und handgefertigte Filzunterlagen für Ihren modernen Arbeitsplatz.',
          ctaText: 'Kollektion ansehen',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
          align: 'left',
          height: 'h-[360px]',
          overlayOpacity: 30,
          buttonBgColor: '#0f172a'
        }
      },
      {
        id: 'node_products',
        type: 'products' as const,
        displayName: 'Featured Products',
        props: {
          category: 'all',
          title: 'Beliebte Produkte',
          cols: 4,
          limit: 4,
          showPrice: true,
          badgeText: 'Bio'
        }
      },
      {
        id: 'node_footer',
        type: 'footer' as const,
        displayName: 'Store Footer',
        props: {
          copyrightText: '© 2026 Ehsan Seller. Modern Minimalist eCommerce.',
          showSocials: false,
          email: 'support@ehsan-seller.com'
        }
      }
    ],
    daisyUi: [
      {
        id: 'node_daisy_alert',
        type: 'daisy_alert' as const,
        displayName: 'DaisyUI Alert Bar',
        props: {
          text: '⚡ DaisyUI Component Integration Active in Craft.js Page Builder!',
          type: 'info',
          buttonText: 'View Kit'
        }
      },
      {
        id: 'node_daisy_hero',
        type: 'daisy_hero' as const,
        displayName: 'DaisyUI Boxed Hero',
        props: {
          title: 'DaisyUI Powered Storefront',
          subtitle: 'Build modern responsive layouts using DaisyUI v5 utility classes and Craft.js decoupled drag-and-drop state.',
          buttonText: 'Explore Collection',
          badge: 'DaisyUI v5 + Tailwind v4',
          variant: 'primary'
        }
      },
      {
        id: 'node_daisy_stats',
        type: 'daisy_stats' as const,
        displayName: 'DaisyUI Stats Grid',
        props: {
          stat1Title: 'Total Store Revenue',
          stat1Value: '€34,800',
          stat1Desc: '↗︎ 28% from last month',
          stat2Title: 'Active Customers',
          stat2Value: '2,450',
          stat2Desc: '↗︎ 320 new users',
          stat3Title: 'Express Orders',
          stat3Value: '1,890',
          stat3Desc: '↘︎ 12 processing'
        }
      },
      {
        id: 'node_daisy_card',
        type: 'daisy_card' as const,
        displayName: 'DaisyUI Featured Card',
        props: {
          title: 'DaisyUI Ergonomic Keyboard',
          description: 'Hot-swappable mechanical keys, RGB backlight, and aircraft-grade aluminum frame.',
          badge: 'BESTSELLER',
          price: '189 €',
          buttonText: 'Add to Cart',
          imageUrl: 'https://images.unsplash.com/photo-1618953793470-8785375507c3?auto=format&fit=crop&w=600&q=80'
        }
      },
      {
        id: 'node_daisy_steps',
        type: 'daisy_steps' as const,
        displayName: 'DaisyUI Order Steps',
        props: {
          title: 'Simple 4-Step Express Delivery',
          step1: 'Product Selection',
          step2: 'Address & EU Tax',
          step3: 'Instant Payment',
          step4: 'Same-day DHL Dispatch',
          currentStep: 3
        }
      },
      {
        id: 'node_daisy_timeline',
        type: 'daisy_timeline' as const,
        displayName: 'DaisyUI Store Timeline',
        props: {
          title: 'Growth & Innovation Timeline',
          item1Year: '2024',
          item1Title: 'Berlin Central Hub Opened',
          item2Year: '2025',
          item2Title: 'Munich & Frankfurt Outlets',
          item3Year: '2026',
          item3Title: 'Seller Core AI Engine Launch'
        }
      },
      {
        id: 'node_daisy_collapse',
        type: 'daisy_collapse' as const,
        displayName: 'DaisyUI FAQ Accordion',
        props: {
          title: 'Frequently Asked Questions',
          q1: 'What payment methods are supported in Germany & EU?',
          a1: 'We accept PayPal, Credit Cards, Sofort, Klarna, SEPA, and Apple Pay.',
          q2: 'How fast is express shipping across Germany?',
          a2: 'Orders placed before 2 PM CET are dispatched the same day via DHL Express (1-2 business days).',
          q3: 'Is DaisyUI fully integrated into Craft.js?',
          a3: 'Yes! All DaisyUI classes like stats, hero, cards, steps, timeline, and collapse render natively inside the Craft.js canvas.'
        }
      },
      {
        id: 'node_footer',
        type: 'footer' as const,
        displayName: 'Store Footer',
        props: {
          copyrightText: '© 2026 Ehsan Seller DE. Powered by DaisyUI & Craft.js Engine.',
          showSocials: true,
          email: 'support@ehsan-seller.de'
        }
      }
    ]
  };

  // State Management
  const [nodes, setNodes] = useState<CraftNode[]>(templatesPreset.germanyLaunch);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node_hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<'germany' | 'minimal' | 'daisyui'>('germany');
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // Synchronize JSON view whenever nodes change
  useEffect(() => {
    setJsonText(JSON.stringify(nodes, null, 2));
  }, [nodes]);

  // Handle Preset Switching
  const applyPreset = (key: 'germany' | 'minimal' | 'daisyui') => {
    if (key === 'germany') {
      setNodes(templatesPreset.germanyLaunch);
      setSelectedNodeId('node_hero');
      setActivePreset('germany');
    } else if (key === 'minimal') {
      setNodes(templatesPreset.minimalistic);
      setSelectedNodeId('node_hero');
      setActivePreset('minimal');
    } else {
      setNodes(templatesPreset.daisyUi);
      setSelectedNodeId('node_daisy_hero');
      setActivePreset('daisyui');
    }
  };

  // Add Component from Toolbox
  const addComponent = (type: CraftNode['type']) => {
    const randomId = `node_${type}_${Math.random().toString(36).substr(2, 5)}`;
    let displayName = 'User Component';
    let defaultProps: Record<string, any> = {};

    switch (type) {
      case 'announcement':
        displayName = 'Announcement Bar';
        defaultProps = {
          text: 'Sonderangebot: 15% Rabatt mit dem Code DEAL15',
          bgGradient: false,
          bgColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 'text-xs',
          paddingY: 'py-2',
        };
        break;
      case 'hero':
        displayName = 'Hero Banner';
        defaultProps = {
          title: 'Neues Tech-Zubehör eingetroffen',
          subtitle: 'Optimieren Sie Ihr Setup mit unseren neuesten Veröffentlichungen.',
          ctaText: 'Entdecken',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          align: 'center',
          height: 'h-[350px]',
          overlayOpacity: 40,
          buttonBgColor: '#4f46e5'
        };
        break;
      case 'products':
        displayName = 'Featured Products';
        defaultProps = {
          category: 'all',
          title: 'Unsere Empfehlungen',
          cols: 3,
          limit: 3,
          showPrice: true,
          badgeText: 'Empfohlen'
        };
        break;
      case 'german_spotlight':
        displayName = 'German Branch Spotlight';
        defaultProps = {
          title: 'München Flagship Store',
          description: 'Besuchen Sie uns am Karlsplatz in München für persönliche Beratung und exklusive Angebote.',
          branchId: 'branch_2',
          branchName: 'Munich Branch',
          branchAddress: 'Karlsplatz 5, 80335 München',
          branchPhone: '+49 89 87654321',
          showHours: true,
          themeColor: '#059669'
        };
        break;
      case 'promo':
        displayName = 'Promo Countdown';
        defaultProps = {
          title: 'Nur für kurze Zeit verfügbar',
          discountCode: 'SCHNELL15',
          buttonText: 'Jetzt Code einlösen',
          percentage: '15%',
          bgImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
        };
        break;
      case 'testimonials':
        displayName = 'Customer Reviews';
        defaultProps = {
          title: 'Erfahrungsberichte',
          author: 'Sarah M., Berlin',
          testimonialText: 'Unglaublicher Service und blitzschnelle Lieferung nach Berlin. Bestelle definitiv wieder!',
          rating: 5
        };
        break;
      case 'footer':
        displayName = 'Store Footer';
        defaultProps = {
          copyrightText: '© 2026 Ehsan Seller GmbH. Alle Rechte vorbehalten.',
          showSocials: true,
          email: 'hilfe@ehsan-seller.de'
        };
        break;
      case 'blog':
        displayName = 'Blog Section';
        defaultProps = {
          title: 'Latest Articles',
          subtitle: 'Read our newest updates and news.',
          postsLimit: 3
        };
        break;
      case 'custom_page':
        displayName = 'Custom HTML Block';
        defaultProps = {
          htmlContent: '<div class="p-4 text-center">Your custom page content goes here</div>'
        };
        break;
      case 'daisy_stats':
        displayName = 'DaisyUI Stats Grid';
        defaultProps = {
          stat1Title: 'Total Store Revenue',
          stat1Value: '€28,400',
          stat1Desc: '↗︎ 24% vs last month',
          stat2Title: 'New Customers',
          stat2Value: '1,820',
          stat2Desc: '↗︎ 210 this week',
          stat3Title: 'Fulfilled Orders',
          stat3Value: '1,240',
          stat3Desc: '98.5% satisfaction'
        };
        break;
      case 'daisy_hero':
        displayName = 'DaisyUI Boxed Hero';
        defaultProps = {
          title: 'Modern DaisyUI Hero Box',
          subtitle: 'High performance web application layout crafted with DaisyUI v5 classes.',
          buttonText: 'Get Started Now',
          badge: 'DaisyUI Integration',
          variant: 'primary'
        };
        break;
      case 'daisy_card':
        displayName = 'DaisyUI Featured Card';
        defaultProps = {
          title: 'DaisyUI Smart Headphones',
          description: 'High fidelity audio with noise cancellation and ergonomic cushion.',
          badge: 'NEW ARRIVAL',
          price: '149 €',
          buttonText: 'Order Today',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
        };
        break;
      case 'daisy_steps':
        displayName = 'DaisyUI Order Steps';
        defaultProps = {
          title: 'Order Processing Steps',
          step1: 'Cart Review',
          step2: 'Shipping Info',
          step3: 'Payment',
          step4: 'Confirmation',
          currentStep: 3
        };
        break;
      case 'daisy_timeline':
        displayName = 'DaisyUI Store Timeline';
        defaultProps = {
          title: 'Our Journey',
          item1Year: '2024',
          item1Title: 'Platform Launch',
          item2Year: '2025',
          item2Title: 'EU Store Outlets',
          item3Year: '2026',
          item3Title: 'DaisyUI & Craft.js Integration'
        };
        break;
      case 'daisy_collapse':
        displayName = 'DaisyUI FAQ Accordion';
        defaultProps = {
          title: 'Frequently Asked Questions',
          q1: 'Is DaisyUI pre-configured with Tailwind?',
          a1: 'Yes, DaisyUI v5 plugin is loaded directly into Tailwind CSS v4.',
          q2: 'Can I edit props live in Craft.js inspector?',
          a2: 'Yes, every DaisyUI component prop can be edited in real-time.',
          q3: 'Can I export the node tree as JSON?',
          a3: 'Yes, click Node Schema in the top bar to copy or import the layout.'
        };
        break;
      case 'daisy_alert':
        displayName = 'DaisyUI Alert Bar';
        defaultProps = {
          text: '⚡ Flash Sale! Free Express Delivery on orders over €50 for the next 24 hours.',
          type: 'info',
          buttonText: 'Claim Offer'
        };
        break;
    }

    const newNode: CraftNode = {
      id: randomId,
      type,
      displayName,
      props: defaultProps
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(randomId);
  };

  // Delete Component
  const deleteComponent = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = nodes.filter(n => n.id !== id);
    setNodes(updated);
    if (selectedNodeId === id) {
      setSelectedNodeId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Reorder Components
  const moveNode = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === nodes.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...nodes];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setNodes(reordered);
  };

  // Live Prop editor update handler
  const handlePropChange = (key: string, value: any) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          props: {
            ...n.props,
            [key]: value
          }
        };
      }
      return n;
    }));
  };

  // Apply parsed JSON
  const handleImportJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON structure must be an array of nodes.');
      }
      // Check minimal fields
      parsed.forEach((node: any, i: number) => {
        if (!node.id || !node.type || !node.props) {
          throw new Error(`Node at index ${i} is missing required properties (id, type, props).`);
        }
      });
      setNodes(parsed);
      setSelectedNodeId(parsed.length > 0 ? parsed[0].id : null);
      setIsJsonModalOpen(false);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON Schema syntax');
    }
  };

  // Save layout confirmation
  const handleSaveLayout = () => {
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 3000);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Helper styles based on device preview
  const getDeviceWidthClass = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-[375px]';
      case 'tablet': return 'w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] text-slate-300">
      {/* Top action control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              Craft.js Visual Engine 
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.5 rounded border border-indigo-500/30">
                v0.2.1
              </span>
            </h2>
            <p className="text-xs text-slate-400">Drag, configure, and serialize decoupled storefront nodes</p>
          </div>
        </div>

        {/* Preset selections */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Templates / Vorlagen:</span>
          <button
            onClick={() => applyPreset('germany')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'germany' 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
            }`}
          >
            🇩🇪 Flagship launch
          </button>
          <button
            onClick={() => applyPreset('minimal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'minimal' 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
            }`}
          >
            ✨ Minimalist
          </button>
          <button
            onClick={() => applyPreset('daisyui')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activePreset === 'daisyui' 
                ? 'bg-purple-600/30 text-purple-200 border-purple-500 shadow-sm shadow-purple-500/20' 
                : 'bg-slate-800 text-purple-300 border-purple-500/30 hover:bg-purple-900/30'
            }`}
          >
            🌼 DaisyUI Kit
          </button>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-3">
          {/* Device indicators */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-1 flex items-center gap-1">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-md transition-colors ${previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Code & serialization */}
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            title="Inspect Serialized Node Schema"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Node Schema</span>
          </button>

          <button
            onClick={handleSaveLayout}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition-all ${
              isSaveSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/15'
            }`}
          >
            {isSaveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Layout gespeichert!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Layout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Builder workspace */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Component Toolbox Panel */}
        <div className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto shrink-0 shadow-lg">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Craft.js Toolbox
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                DaisyUI v5
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Click elements below to append into your live Canvas tree.</p>
          </div>

          {/* DaisyUI Specific Components Group */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> DaisyUI Components
            </p>

            {[
              { type: 'daisy_alert', label: 'DaisyUI Alert Bar', desc: 'Notification banner with type styles', icon: Sparkles, color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
              { type: 'daisy_hero', label: 'DaisyUI Boxed Hero', desc: 'Centered hero layout box with CTA', icon: Layout, color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
              { type: 'daisy_stats', label: 'DaisyUI Stats Grid', desc: 'Key performance metric cards', icon: Sliders, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
              { type: 'daisy_card', label: 'DaisyUI Featured Card', desc: 'Product card with image & badge', icon: Tag, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
              { type: 'daisy_steps', label: 'DaisyUI Order Steps', desc: 'Step-by-step progress bar', icon: Check, color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
              { type: 'daisy_timeline', label: 'DaisyUI Store Timeline', desc: 'Chronological roadmap display', icon: Info, color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
              { type: 'daisy_collapse', label: 'DaisyUI FAQ Accordion', desc: 'Collapsible accordion questions', icon: MessageSquare, color: 'bg-teal-500/10 border-teal-500/30 text-teal-400' },
            ].map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <button
                  key={tool.type}
                  onClick={() => addComponent(tool.type as any)}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all text-left cursor-pointer group"
                >
                  <div className={`p-1.5 rounded-lg border ${tool.color} group-hover:scale-105 transition-transform shrink-0`}>
                    <ToolIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors flex items-center justify-between">
                      <span className="truncate">{tool.label}</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-1 rounded ml-1 shrink-0">Daisy</span>
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Core Craft Nodes Group */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> Standard Craft Nodes
            </p>

            {[
              { type: 'announcement', label: 'Announcement Bar', desc: 'Top banner bar with custom text', icon: Info, color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
              { type: 'hero', label: 'Hero Banner Slide', desc: 'Main presentation banner & CTA', icon: Layout, color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
              { type: 'products', label: 'Featured Products', desc: 'Adaptive grid of catalog items', icon: FolderPlus, color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
              { type: 'german_spotlight', label: 'German Store Spotlight', desc: 'Spotlight on Berlin, Munich or Frankfurt', icon: MapPin, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
              { type: 'promo', label: 'Promotional Grid', desc: 'Sale countdown & promo code banner', icon: Tag, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
              { type: 'testimonials', label: 'Customer Reviews', desc: 'Slide array of customer validation', icon: MessageSquare, color: 'bg-pink-500/10 border-pink-500/20 text-pink-400' },
              { type: 'blog', label: 'Blog / Articles', desc: 'Display latest blog articles', icon: Info, color: 'bg-teal-500/10 border-teal-500/20 text-teal-400' },
              { type: 'custom_page', label: 'Custom HTML', desc: 'Insert custom HTML content', icon: Layout, color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
              { type: 'footer', label: 'Store Footer', desc: 'Bottom links & brand copyright info', icon: Sliders, color: 'bg-slate-500/10 border-slate-500/20 text-slate-400' },
            ].map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <button
                  key={tool.type}
                  onClick={() => addComponent(tool.type as any)}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
                >
                  <div className={`p-1.5 rounded-lg border ${tool.color} group-hover:scale-105 transition-transform shrink-0`}>
                    <ToolIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{tool.label}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col gap-1.5 bg-slate-900/60">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Fully responsive canvas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Germany-first mock data</span>
            </div>
          </div>
        </div>

        {/* Center: Live Canvas Area */}
        <div className="flex-1 bg-slate-950/60 rounded-xl border border-slate-800 p-6 flex flex-col items-center overflow-y-auto shadow-inner">
          <div className={`transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${getDeviceWidthClass()} min-h-full`}>
            
            {/* If no nodes are on canvas */}
            {nodes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center text-slate-500 space-y-4">
                <div className="p-4 bg-slate-800 rounded-full border border-slate-700">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-300">Your Canvas is empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Click any element in the Craft.js Toolbox panel on the left to start building your German storefront!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {nodes.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  
                  return (
                    <div
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                      }}
                      className={`relative group transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 z-10' 
                          : 'hover:outline-dashed hover:outline-2 hover:outline-indigo-500/40'
                      }`}
                    >
                      {/* Active Craft.js Hover/Selected Overlay */}
                      <div className={`absolute top-0 left-0 right-0 h-full pointer-events-none transition-all ${
                        isSelected ? 'bg-indigo-500/5' : 'group-hover:bg-indigo-500/[0.02]'
                      }`} />

                      {/* Craft Node Toolbar controls */}
                      <div className={`absolute -top-3 left-4 z-20 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 transition-all duration-150 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-auto'
                      }`}>
                        <span>{node.displayName}</span>
                        <div className="flex items-center gap-1 border-l border-white/20 pl-1.5 ml-1">
                          <button
                            onClick={(e) => moveNode(index, 'up', e)}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => moveNode(index, 'down', e)}
                            disabled={index === nodes.length - 1}
                            className="p-0.5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => deleteComponent(node.id, e)}
                            className="p-0.5 hover:bg-red-500/30 hover:text-red-200 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* --- Live Node Component Renderers --- */}
                      
                      {/* 1. Announcement Bar */}
                      {node.type === 'announcement' && (
                        <div 
                          style={{ backgroundColor: node.props.bgColor, color: node.props.textColor }}
                          className={`w-full text-center ${node.props.paddingY || 'py-2'} ${node.props.fontSize || 'text-xs'} font-semibold px-4 tracking-wide ${
                            node.props.bgGradient ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-800' : ''
                          }`}
                        >
                          {node.props.text}
                        </div>
                      )}

                      {/* 2. Hero Banner */}
                      {node.type === 'hero' && (
                        <div 
                          className={`w-full relative ${node.props.height || 'h-[360px]'} flex items-center bg-slate-950 overflow-hidden`}
                        >
                          <img 
                            src={node.props.imageUrl} 
                            alt="Hero" 
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <div 
                            style={{ backgroundColor: `rgba(0, 0, 0, ${node.props.overlayOpacity / 100})` }}
                            className="absolute inset-0"
                          />
                          <div className={`relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col ${
                            node.props.align === 'center' ? 'items-center text-center' : node.props.align === 'right' ? 'items-end text-right' : 'items-start text-left'
                          } space-y-4`}>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                              {node.props.title}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-200 max-w-xl drop-shadow-md leading-relaxed">
                              {node.props.subtitle}
                            </p>
                            <button 
                              style={{ backgroundColor: node.props.buttonBgColor }}
                              className="px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                            >
                              {node.props.ctaText}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 3. Featured Products Grid */}
                      {node.type === 'products' && (
                        <div className="w-full bg-slate-900/40 p-6 border-y border-slate-800/50">
                          <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-bold text-white tracking-tight">
                                {node.props.title}
                              </h3>
                              {node.props.badgeText && (
                                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                                  {node.props.badgeText}
                                </span>
                              )}
                            </div>
                            
                            <div className={`grid gap-4 ${
                              node.props.cols === 4 ? 'grid-cols-2 md:grid-cols-4' : node.props.cols === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
                            }`}>
                              {products.slice(0, node.props.limit || 3).map((p, idx) => (
                                <div key={p.id || idx} className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col space-y-2">
                                  <div className="h-28 w-full bg-slate-900 rounded-lg overflow-hidden relative">
                                    <img 
                                      src={p.image || "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300&q=80"} 
                                      alt={p.title}
                                      className="w-full h-full object-cover opacity-80"
                                    />
                                    <span className="absolute top-2 right-2 text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">
                                      {node.props.badgeText || 'Best'}
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                                    <p className="text-[10px] text-slate-500 truncate">{p.category}</p>
                                  </div>
                                  {node.props.showPrice && (
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-xs text-indigo-400 font-bold">{p.price.toLocaleString()} €</span>
                                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Vorrätig</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. German Store Spotlight */}
                      {node.type === 'german_spotlight' && (
                        <div className="w-full bg-slate-900 p-6 border-b border-slate-800">
                          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-3">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 text-[10px] font-mono font-bold">
                                BRANCH SPOTLIGHT
                              </span>
                              <h3 className="text-lg font-bold text-white">{node.props.title}</h3>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {node.props.description}
                              </p>
                              
                              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-white font-semibold">
                                  <MapPin style={{ color: node.props.themeColor }} className="w-3.5 h-3.5 shrink-0" />
                                  <span>{node.props.branchName}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 pl-5">{node.props.branchAddress}</p>
                                <p className="text-[11px] text-slate-500 pl-5">Tel: {node.props.branchPhone}</p>
                              </div>
                            </div>
                            
                            <div className="relative rounded-xl overflow-hidden h-40 bg-slate-950 border border-slate-850 flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-slate-300">Google Maps Live Grounding</span>
                              </div>
                              <div className="text-center py-2">
                                <p className="text-xs font-bold text-slate-200">Berlin / München Outlets Connected</p>
                                <p className="text-[10px] text-slate-500">Live coordinates: 52.5072, 13.3905</p>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-indigo-400 font-bold border-t border-slate-800/60 pt-2">
                                <span>Wegbeschreibung öffnen</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. Promotional Sale Countdown */}
                      {node.type === 'promo' && (
                        <div className="w-full relative py-10 bg-slate-950 border-b border-slate-850 overflow-hidden">
                          {node.props.bgImage && (
                            <img 
                              src={node.props.bgImage} 
                              alt="Promo background" 
                              className="absolute inset-0 w-full h-full object-cover opacity-20"
                            />
                          )}
                          <div className="relative z-10 max-w-3xl mx-auto text-center px-6 space-y-4">
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold tracking-wide">
                              NUR DIESE WOCHE: {node.props.percentage || '20%'} DE-RABATT
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white">{node.props.title}</h3>
                            
                            <div className="flex justify-center items-center gap-4 py-2">
                              {[
                                { value: '02', label: 'Tage' },
                                { value: '14', label: 'Stunden' },
                                { value: '45', label: 'Minuten' },
                                { value: '18', label: 'Sekunden' }
                              ].map((timer, idx) => (
                                <div key={idx} className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-center min-w-[55px]">
                                  <p className="text-base font-black text-white font-mono leading-none">{timer.value}</p>
                                  <p className="text-[9px] text-slate-500 font-medium uppercase mt-1">{timer.label}</p>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 flex justify-center items-center gap-3">
                              <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-indigo-300 font-semibold flex items-center gap-2">
                                <span>Gutscheincode:</span>
                                <span className="text-white font-bold select-all">{node.props.discountCode || 'GERMANY20'}</span>
                              </div>
                              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                                {node.props.buttonText}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. Customer Testimonials */}
                      {node.type === 'testimonials' && (
                        <div className="w-full bg-slate-900/60 p-6 border-b border-slate-800">
                          <div className="max-w-2xl mx-auto text-center space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {node.props.title}
                            </h3>
                            
                            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl relative">
                              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                                "{node.props.testimonialText}"
                              </p>
                              
                              <div className="flex justify-center gap-1 my-3">
                                {Array.from({ length: node.props.rating || 5 }).map((_, i) => (
                                  <span key={i} className="text-amber-400 text-xs">★</span>
                                ))}
                              </div>
                              
                              <p className="text-xs font-bold text-white">{node.props.author}</p>
                              <p className="text-[10px] text-slate-500 font-medium">Verifizierter Käufer • 5-Sterne Bewertung</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 7. Store Footer */}
                      {node.type === 'footer' && (
                        <div className="w-full bg-slate-950 p-6 text-slate-500 border-t border-slate-850">
                          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                            <div className="space-y-1">
                              <p className="text-[11px] text-slate-400">{node.props.copyrightText}</p>
                              <p className="text-[10px] text-slate-600">Technischer Support: {node.props.email}</p>
                            </div>
                            
                            {node.props.showSocials && (
                              <div className="flex gap-3 text-xs text-slate-400">
                                <span className="hover:text-indigo-400">Twitter</span>
                                <span>•</span>
                                <span className="hover:text-indigo-400">Instagram</span>
                                <span>•</span>
                                <span className="hover:text-indigo-400">LinkedIn</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 8. Blog Section */}
                      {node.type === 'blog' && (
                        <div className="w-full bg-slate-900/30 p-8 border-b border-slate-800">
                          <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                              <h3 className="text-xl font-bold text-white mb-2">{node.props.title}</h3>
                              <p className="text-sm text-slate-400">{node.props.subtitle}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[1, 2, 3].slice(0, node.props.postsLimit || 3).map((_, idx) => (
                                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                  <div className="h-32 bg-slate-800 overflow-hidden relative">
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + idx}?auto=format&fit=crop&w=600&q=80`} alt="Blog Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                                  </div>
                                  <div className="p-4 space-y-2">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Commerce</span>
                                    <h4 className="text-sm font-bold text-slate-200">How to scale your online business</h4>
                                    <p className="text-xs text-slate-500 line-clamp-2">Discover the top strategies for increasing conversion rates and managing customer relationships effectively.</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 9. Custom Page Block */}
                      {node.type === 'custom_page' && (
                        <div 
                          className="w-full bg-transparent text-slate-300 custom-html-block"
                          dangerouslySetInnerHTML={{ __html: node.props.htmlContent }}
                        />
                      )}

                      {/* 10. DaisyUI Alert Bar */}
                      {node.type === 'daisy_alert' && (
                        <div className={`w-full alert alert-${node.props.type || 'info'} shadow-lg my-1 flex items-center justify-between rounded-xl border border-indigo-500/30 p-4`}>
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 shrink-0 text-indigo-400" />
                            <span className="text-xs font-semibold text-white">{node.props.text}</span>
                          </div>
                          {node.props.buttonText && (
                            <button className="btn btn-xs btn-outline font-bold shrink-0 text-indigo-300 border-indigo-400 hover:bg-indigo-600 hover:text-white">
                              {node.props.buttonText}
                            </button>
                          )}
                        </div>
                      )}

                      {/* 11. DaisyUI Boxed Hero */}
                      {node.type === 'daisy_hero' && (
                        <div className="hero bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 rounded-2xl border border-slate-800 p-8 my-2 shadow-xl">
                          <div className="hero-content text-center flex-col max-w-lg mx-auto space-y-3">
                            {node.props.badge && (
                              <div className="badge badge-primary font-bold text-[10px] tracking-wide uppercase px-3 py-2">
                                {node.props.badge}
                              </div>
                            )}
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                              {node.props.title}
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                              {node.props.subtitle}
                            </p>
                            <button className="btn btn-indigo hover:btn-primary text-xs font-bold px-6 py-2 rounded-xl shadow-lg shadow-indigo-600/30 text-white bg-indigo-600 hover:bg-indigo-500 border-0">
                              {node.props.buttonText}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 12. DaisyUI Stats Grid */}
                      {node.type === 'daisy_stats' && (
                        <div className="w-full my-2">
                          <div className="stats stats-vertical sm:stats-horizontal shadow-xl bg-slate-900 border border-slate-800 text-white w-full rounded-2xl overflow-hidden">
                            <div className="stat p-4 border-slate-800">
                              <div className="stat-title text-slate-400 text-[11px] font-semibold">{node.props.stat1Title}</div>
                              <div className="stat-value text-indigo-400 text-xl font-extrabold">{node.props.stat1Value}</div>
                              <div className="stat-desc text-slate-500 text-[10px]">{node.props.stat1Desc}</div>
                            </div>
                            <div className="stat p-4 border-slate-800">
                              <div className="stat-title text-slate-400 text-[11px] font-semibold">{node.props.stat2Title}</div>
                              <div className="stat-value text-emerald-400 text-xl font-extrabold">{node.props.stat2Value}</div>
                              <div className="stat-desc text-slate-500 text-[10px]">{node.props.stat2Desc}</div>
                            </div>
                            <div className="stat p-4 border-slate-800">
                              <div className="stat-title text-slate-400 text-[11px] font-semibold">{node.props.stat3Title}</div>
                              <div className="stat-value text-amber-400 text-xl font-extrabold">{node.props.stat3Value}</div>
                              <div className="stat-desc text-slate-500 text-[10px]">{node.props.stat3Desc}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 13. DaisyUI Featured Card */}
                      {node.type === 'daisy_card' && (
                        <div className="w-full my-2">
                          <div className="card card-compact sm:card-side bg-slate-900 border border-slate-800 shadow-xl rounded-2xl overflow-hidden">
                            {node.props.imageUrl && (
                              <figure className="sm:w-2/5 h-44 sm:h-auto shrink-0 bg-slate-950 relative">
                                <img src={node.props.imageUrl} alt={node.props.title} className="w-full h-full object-cover" />
                                {node.props.badge && (
                                  <span className="badge badge-accent absolute top-3 left-3 text-[10px] font-bold">
                                    {node.props.badge}
                                  </span>
                                )}
                              </figure>
                            )}
                            <div className="card-body p-5 justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="card-title text-base font-bold text-white">{node.props.title}</h3>
                                  {node.props.price && (
                                    <span className="text-sm font-extrabold text-indigo-400 font-mono">{node.props.price}</span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{node.props.description}</p>
                              </div>
                              <div className="card-actions justify-end pt-3 border-t border-slate-800/60">
                                <button className="btn btn-sm text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white border-0">
                                  {node.props.buttonText}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 14. DaisyUI Order Steps */}
                      {node.type === 'daisy_steps' && (
                        <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl my-2 space-y-4">
                          {node.props.title && (
                            <h3 className="text-sm font-bold text-white text-center">{node.props.title}</h3>
                          )}
                          <ul className="steps steps-vertical sm:steps-horizontal w-full text-xs">
                            <li className={`step ${node.props.currentStep >= 1 ? 'step-primary text-indigo-400 font-bold' : 'text-slate-500'}`}>
                              {node.props.step1}
                            </li>
                            <li className={`step ${node.props.currentStep >= 2 ? 'step-primary text-indigo-400 font-bold' : 'text-slate-500'}`}>
                              {node.props.step2}
                            </li>
                            <li className={`step ${node.props.currentStep >= 3 ? 'step-primary text-indigo-400 font-bold' : 'text-slate-500'}`}>
                              {node.props.step3}
                            </li>
                            <li className={`step ${node.props.currentStep >= 4 ? 'step-primary text-indigo-400 font-bold' : 'text-slate-500'}`}>
                              {node.props.step4}
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* 15. DaisyUI Timeline */}
                      {node.type === 'daisy_timeline' && (
                        <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl my-2 space-y-4">
                          {node.props.title && (
                            <h3 className="text-sm font-bold text-white text-center">{node.props.title}</h3>
                          )}
                          <ul className="timeline timeline-vertical sm:timeline-horizontal w-full justify-center text-xs">
                            <li>
                              <div className="timeline-start font-mono font-bold text-indigo-400">{node.props.item1Year}</div>
                              <div className="timeline-middle">
                                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                              </div>
                              <div className="timeline-end timeline-box bg-slate-950 border-slate-800 text-slate-200 text-[11px] font-semibold">
                                {node.props.item1Title}
                              </div>
                              <hr className="bg-indigo-500" />
                            </li>
                            <li>
                              <hr className="bg-indigo-500" />
                              <div className="timeline-start font-mono font-bold text-indigo-400">{node.props.item2Year}</div>
                              <div className="timeline-middle">
                                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                              </div>
                              <div className="timeline-end timeline-box bg-slate-950 border-slate-800 text-slate-200 text-[11px] font-semibold">
                                {node.props.item2Title}
                              </div>
                              <hr className="bg-indigo-500" />
                            </li>
                            <li>
                              <hr className="bg-indigo-500" />
                              <div className="timeline-start font-mono font-bold text-indigo-400">{node.props.item3Year}</div>
                              <div className="timeline-middle">
                                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                              </div>
                              <div className="timeline-end timeline-box bg-slate-950 border-slate-800 text-emerald-300 text-[11px] font-bold">
                                {node.props.item3Title}
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* 16. DaisyUI Collapse Accordion */}
                      {node.type === 'daisy_collapse' && (
                        <div className="w-full bg-slate-900/80 border border-slate-800 p-6 rounded-2xl my-2 space-y-3">
                          {node.props.title && (
                            <h3 className="text-sm font-bold text-white mb-2">{node.props.title}</h3>
                          )}
                          {[
                            { q: node.props.q1, a: node.props.a1 },
                            { q: node.props.q2, a: node.props.a2 },
                            { q: node.props.q3, a: node.props.a3 }
                          ].map((item, idx) => (
                            <details key={idx} className="collapse collapse-arrow bg-slate-950 border border-slate-800 rounded-xl">
                              <summary className="collapse-title text-xs font-bold text-white cursor-pointer py-3">
                                {item.q}
                              </summary>
                              <div className="collapse-content text-xs text-slate-400 pb-3">
                                <p>{item.a}</p>
                              </div>
                            </details>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Craft.js Node Properties Editor / Inspector Panel */}
        <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5 overflow-y-auto shrink-0 shadow-lg">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Node Inspector
            </h3>
            <p className="text-[11px] text-slate-500">Live properties configuration panel for the selected node.</p>
          </div>

          {selectedNode ? (
            <div className="space-y-5 flex-1">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono uppercase">
                  Active Element
                </span>
                <p className="text-xs font-bold text-white mt-1">{selectedNode.displayName}</p>
                <p className="text-[10px] text-slate-500">ID: {selectedNode.id}</p>
              </div>

              {/* Node-specific configurations */}
              <div className="space-y-4">
                
                {/* 1. Announcement props */}
                {selectedNode.type === 'announcement' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Banner Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.text}
                        onChange={(e) => handlePropChange('text', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedNode.props.bgColor || '#4f46e5'}
                          onChange={(e) => handlePropChange('bgColor', e.target.value)}
                          className="bg-transparent border-0 w-8 h-8 cursor-pointer rounded-lg shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedNode.props.bgColor}
                          onChange={(e) => handlePropChange('bgColor', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Text Color</label>
                      <input
                        type="text"
                        value={selectedNode.props.textColor}
                        onChange={(e) => handlePropChange('textColor', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-300 font-semibold">Enable Indigo Gradient</span>
                      <input
                        type="checkbox"
                        checked={selectedNode.props.bgGradient}
                        onChange={(e) => handlePropChange('bgGradient', e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                    </div>
                  </>
                )}

                {/* 2. Hero props */}
                {selectedNode.type === 'hero' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subtitle</label>
                      <textarea
                        rows={3}
                        value={selectedNode.props.subtitle}
                        onChange={(e) => handlePropChange('subtitle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.ctaText}
                        onChange={(e) => handlePropChange('ctaText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">CTA Button Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedNode.props.buttonBgColor || '#4f46e5'}
                          onChange={(e) => handlePropChange('buttonBgColor', e.target.value)}
                          className="bg-transparent border-0 w-8 h-8 cursor-pointer rounded-lg shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedNode.props.buttonBgColor}
                          onChange={(e) => handlePropChange('buttonBgColor', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={selectedNode.props.imageUrl}
                        onChange={(e) => handlePropChange('imageUrl', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alignment</label>
                      <select
                        value={selectedNode.props.align}
                        onChange={(e) => handlePropChange('align', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="left">Linksbündig (Left)</option>
                        <option value="center">Zentriert (Center)</option>
                        <option value="right">Rechtsbündig (Right)</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Overlay Darkness</span>
                        <span className="text-indigo-400 font-mono">{selectedNode.props.overlayOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        step="10"
                        value={selectedNode.props.overlayOpacity}
                        onChange={(e) => handlePropChange('overlayOpacity', parseInt(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-950 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {/* 3. Products props */}
                {selectedNode.type === 'products' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.badgeText}
                        onChange={(e) => handlePropChange('badgeText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Product Limit</label>
                      <select
                        value={selectedNode.props.limit}
                        onChange={(e) => handlePropChange('limit', parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="2">2 items</option>
                        <option value="3">3 items</option>
                        <option value="4">4 items</option>
                        <option value="6">6 items</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Columns</label>
                      <select
                        value={selectedNode.props.cols}
                        onChange={(e) => handlePropChange('cols', parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-300 font-semibold">Display Price Label</span>
                      <input
                        type="checkbox"
                        checked={selectedNode.props.showPrice}
                        onChange={(e) => handlePropChange('showPrice', e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                    </div>
                  </>
                )}

                {/* 4. German Spotlight props */}
                {selectedNode.type === 'german_spotlight' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Header Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description Paragraph</label>
                      <textarea
                        rows={3}
                        value={selectedNode.props.description}
                        onChange={(e) => handlePropChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Outlet Location</label>
                      <select
                        value={selectedNode.props.branchId}
                        onChange={(e) => {
                          const val = e.target.value;
                          let name = 'Berlin Central Branch';
                          let addr = 'Friedrichstraße 43, 10117 Berlin';
                          let tel = '+49 30 12345678';
                          if (val === 'branch_2') {
                            name = 'Munich Branch';
                            addr = 'Karlsplatz 5, 80335 München';
                            tel = '+49 89 87654321';
                          } else if (val === 'branch_3') {
                            name = 'Frankfurt Branch';
                            addr = 'Kaiserstraße 12, 60311 Frankfurt am Main';
                            tel = '+49 69 11223344';
                          }
                          handlePropChange('branchId', val);
                          handlePropChange('branchName', name);
                          handlePropChange('branchAddress', addr);
                          handlePropChange('branchPhone', tel);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="branch_1">Berlin Central Branch</option>
                        <option value="branch_2">Munich Branch (München)</option>
                        <option value="branch_3">Frankfurt Branch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Theme Accent Color</label>
                      <input
                        type="color"
                        value={selectedNode.props.themeColor || '#4f46e5'}
                        onChange={(e) => handlePropChange('themeColor', e.target.value)}
                        className="bg-transparent border-0 w-8 h-8 cursor-pointer rounded-lg shrink-0"
                      />
                    </div>
                  </>
                )}

                {/* 5. Promo props */}
                {selectedNode.type === 'promo' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Headline</label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Discount Code</label>
                      <input
                        type="text"
                        value={selectedNode.props.discountCode}
                        onChange={(e) => handlePropChange('discountCode', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Button text</label>
                      <input
                        type="text"
                        value={selectedNode.props.buttonText}
                        onChange={(e) => handlePropChange('buttonText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Discount Percentage</label>
                      <input
                        type="text"
                        value={selectedNode.props.percentage}
                        onChange={(e) => handlePropChange('percentage', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Background Image</label>
                      <input
                        type="url"
                        value={selectedNode.props.bgImage}
                        onChange={(e) => handlePropChange('bgImage', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </>
                )}

                {/* 6. Testimonials props */}
                {selectedNode.type === 'testimonials' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Quote Text</label>
                      <textarea
                        rows={3}
                        value={selectedNode.props.testimonialText}
                        onChange={(e) => handlePropChange('testimonialText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={selectedNode.props.author}
                        onChange={(e) => handlePropChange('author', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stars Rating</label>
                      <select
                        value={selectedNode.props.rating}
                        onChange={(e) => handlePropChange('rating', parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 7. Footer props */}
                {selectedNode.type === 'footer' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Copyright text</label>
                      <input
                        type="text"
                        value={selectedNode.props.copyrightText}
                        onChange={(e) => handlePropChange('copyrightText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={selectedNode.props.email}
                        onChange={(e) => handlePropChange('email', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-300 font-semibold">Show Social Links</span>
                      <input
                        type="checkbox"
                        checked={selectedNode.props.showSocials}
                        onChange={(e) => handlePropChange('showSocials', e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                    </div>
                  </>
                )}

                {/* 8. DaisyUI Alert Bar props */}
                {selectedNode.type === 'daisy_alert' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alert Message</label>
                      <input
                        type="text"
                        value={selectedNode.props.text}
                        onChange={(e) => handlePropChange('text', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alert Style Type</label>
                      <select
                        value={selectedNode.props.type || 'info'}
                        onChange={(e) => handlePropChange('type', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="info">Info (Blue/Indigo)</option>
                        <option value="success">Success (Emerald)</option>
                        <option value="warning">Warning (Amber)</option>
                        <option value="error">Error (Red)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={selectedNode.props.buttonText || ''}
                        onChange={(e) => handlePropChange('buttonText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 9. DaisyUI Boxed Hero props */}
                {selectedNode.type === 'daisy_hero' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.badge || ''}
                        onChange={(e) => handlePropChange('badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subtitle</label>
                      <textarea
                        rows={3}
                        value={selectedNode.props.subtitle || ''}
                        onChange={(e) => handlePropChange('subtitle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.buttonText || ''}
                        onChange={(e) => handlePropChange('buttonText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 10. DaisyUI Stats Grid props */}
                {selectedNode.type === 'daisy_stats' && (
                  <>
                    <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase">Stat #1</p>
                      <input
                        type="text"
                        placeholder="Title"
                        value={selectedNode.props.stat1Title || ''}
                        onChange={(e) => handlePropChange('stat1Title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={selectedNode.props.stat1Value || ''}
                        onChange={(e) => handlePropChange('stat1Value', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={selectedNode.props.stat1Desc || ''}
                        onChange={(e) => handlePropChange('stat1Desc', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-400"
                      />
                    </div>
                    <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase">Stat #2</p>
                      <input
                        type="text"
                        placeholder="Title"
                        value={selectedNode.props.stat2Title || ''}
                        onChange={(e) => handlePropChange('stat2Title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={selectedNode.props.stat2Value || ''}
                        onChange={(e) => handlePropChange('stat2Value', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={selectedNode.props.stat2Desc || ''}
                        onChange={(e) => handlePropChange('stat2Desc', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-400"
                      />
                    </div>
                    <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-400 uppercase">Stat #3</p>
                      <input
                        type="text"
                        placeholder="Title"
                        value={selectedNode.props.stat3Title || ''}
                        onChange={(e) => handlePropChange('stat3Title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={selectedNode.props.stat3Value || ''}
                        onChange={(e) => handlePropChange('stat3Value', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={selectedNode.props.stat3Desc || ''}
                        onChange={(e) => handlePropChange('stat3Desc', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-400"
                      />
                    </div>
                  </>
                )}

                {/* 11. DaisyUI Featured Card props */}
                {selectedNode.type === 'daisy_card' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Price Tag</label>
                      <input
                        type="text"
                        value={selectedNode.props.price || ''}
                        onChange={(e) => handlePropChange('price', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={selectedNode.props.badge || ''}
                        onChange={(e) => handlePropChange('badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={selectedNode.props.description || ''}
                        onChange={(e) => handlePropChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={selectedNode.props.imageUrl || ''}
                        onChange={(e) => handlePropChange('imageUrl', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={selectedNode.props.buttonText || ''}
                        onChange={(e) => handlePropChange('buttonText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {/* 12. DaisyUI Order Steps props */}
                {selectedNode.type === 'daisy_steps' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section Header</label>
                      <input
                        type="text"
                        value={selectedNode.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Active Step Index (1 to 4)</label>
                      <select
                        value={selectedNode.props.currentStep || 1}
                        onChange={(e) => handlePropChange('currentStep', parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="1">Step 1 Active</option>
                        <option value="2">Step 2 Active</option>
                        <option value="3">Step 3 Active</option>
                        <option value="4">Step 4 Active</option>
                      </select>
                    </div>
                    {['step1', 'step2', 'step3', 'step4'].map((sKey, i) => (
                      <div key={sKey}>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">Step {i + 1} Label</label>
                        <input
                          type="text"
                          value={selectedNode.props[sKey] || ''}
                          onChange={(e) => handlePropChange(sKey, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </>
                )}

                {/* 13. DaisyUI Timeline props */}
                {selectedNode.type === 'daisy_timeline' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase">Item #{num}</p>
                        <input
                          type="text"
                          placeholder="Year/Date"
                          value={selectedNode.props[`item${num}Year`] || ''}
                          onChange={(e) => handlePropChange(`item${num}Year`, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Milestone Title"
                          value={selectedNode.props[`item${num}Title`] || ''}
                          onChange={(e) => handlePropChange(`item${num}Title`, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </>
                )}

                {/* 14. DaisyUI FAQ Accordion props */}
                {selectedNode.type === 'daisy_collapse' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Accordion Section Title</label>
                      <input
                        type="text"
                        value={selectedNode.props.title || ''}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <p className="text-[10px] font-bold text-teal-400 uppercase">FAQ #{num}</p>
                        <input
                          type="text"
                          placeholder="Question"
                          value={selectedNode.props[`q${num}`] || ''}
                          onChange={(e) => handlePropChange(`q${num}`, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-semibold"
                        />
                        <textarea
                          rows={2}
                          placeholder="Answer text"
                          value={selectedNode.props[`a${num}`] || ''}
                          onChange={(e) => handlePropChange(`a${num}`, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </>
                )}

              </div>

              {/* Node Operations */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => deleteComponent(selectedNode.id)}
                  className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Component
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <div className="p-3 bg-slate-950 rounded-full border border-slate-800/60">
                <Settings className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-xs font-bold text-slate-400">No Node Selected</p>
              <p className="text-[11px] text-slate-500 max-w-[200px] leading-relaxed">
                Click any component on the visual canvas in the center to select it and edit its Craft.js node properties!
              </p>
            </div>
          )}

          {/* Active Canvas Node Tree hierarchy list */}
          <div className="pt-4 mt-auto border-t border-slate-800 text-slate-500">
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-400">
              <Layers className="w-3.5 h-3.5" />
              Active Node Tree
            </h4>
            <div className="space-y-1 max-h-[140px] overflow-y-auto font-mono text-[10px]">
              {nodes.map((n, i) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNodeId(n.id)}
                  className={`px-2 py-1 rounded flex items-center justify-between cursor-pointer transition-colors ${
                    selectedNodeId === n.id 
                      ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' 
                      : 'hover:bg-slate-850 text-slate-400'
                  }`}
                >
                  <span className="truncate flex items-center gap-1">
                    <span className="text-slate-600">{i + 1}.</span>
                    <span>{n.displayName}</span>
                  </span>
                  <span className="text-[9px] text-slate-600">{n.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* JSON Schema Node serialization Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Craft.js Serialized Node Schema</h3>
                  <p className="text-xs text-slate-400">View and update the decoupled storefront layout state</p>
                </div>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col min-h-0">
              {jsonError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-medium">
                  {jsonError}
                </div>
              )}

              <div className="flex-1 flex flex-col min-h-0 relative">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[300px] overflow-y-auto"
                />
                
                {/* Copy helper */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(jsonText);
                  }}
                  className="absolute bottom-3 right-3 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  Copy JSON
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-4 bg-slate-900/60 mt-2">
                <span>Total Nodes in Hierarchy: <strong className="text-slate-300">{nodes.length}</strong></span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsJsonModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleImportJson}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    Apply Node Tree
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
