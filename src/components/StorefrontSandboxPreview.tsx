import React, { useState } from 'react';
import { Product, StoreTemplate } from '../types';
import { 
  ShoppingBag, Search, X, Star, ShieldCheck, Truck, RefreshCw, 
  ChevronRight, Heart, User, Check, Plus, Minus, Tag, ArrowRight,
  Flame, Sparkles, SlidersHorizontal, Eye, Lock, CreditCard, CheckCircle2,
  Menu, Home, Layers, Settings2, MoveUp, MoveDown
} from 'lucide-react';

interface StorefrontSandboxPreviewProps {
  template: StoreTemplate;
  products: Product[];
  device: 'desktop' | 'mobile';
  onClose: () => void;
}

interface StoreSection {
  id: string;
  name: string;
  enabled: boolean;
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'footer';
}

export function StorefrontSandboxPreview({
  template,
  products,
  device,
  onClose
}: StorefrontSandboxPreviewProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor?: string; selectedSize?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Modular Sections state (Shopify-like section-block engine)
  const [sections, setSections] = useState<StoreSection[]>([
    { id: 'sec_announcement', name: 'Announcement Bar', enabled: true, type: 'announcement' },
    { id: 'sec_header', name: 'Header & Navigation', enabled: true, type: 'header' },
    { id: 'sec_hero', name: 'Hero Banner Slider', enabled: true, type: 'hero' },
    { id: 'sec_categories', name: 'Category Spotlights', enabled: true, type: 'categories' },
    { id: 'sec_products', name: 'Featured Products Grid', enabled: true, type: 'products' },
    { id: 'sec_promo', name: 'Promotional Banner & Timer', enabled: true, type: 'promo' },
    { id: 'sec_testimonials', name: 'Customer Testimonials', enabled: true, type: 'testimonials' },
    { id: 'sec_faq', name: 'FAQ Accordions', enabled: true, type: 'faq' },
    { id: 'sec_footer', name: 'Store Footer', enabled: true, type: 'footer' },
  ]);

  // Variant selections state for detail view
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [selectedSize, setSelectedSize] = useState('Standard');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleAddToCart = (product: Product, color?: string, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor: color || 'Default', selectedSize: size || 'Standard' }];
    });
    showToast(`Added "${product.title}" to cart!`);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 75 || subtotal === 0 ? 0 : 9.99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingThreshold = 75;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Template specific styling themes
  const isLuxury = template.slug.includes('luxury');
  const isMegastore = template.slug.includes('megastore');
  const isCyberTech = template.slug.includes('cybertech');
  const isOrganic = template.slug.includes('organic');

  const themeBg = isCyberTech ? 'bg-slate-950 text-slate-100' : isLuxury ? 'bg-stone-50 text-stone-900' : isOrganic ? 'bg-amber-50/40 text-slate-900' : 'bg-slate-50 text-slate-900';
  const headerBg = isCyberTech ? 'bg-slate-900/90 border-slate-800' : isLuxury ? 'bg-white/90 border-stone-200' : 'bg-white/90 border-slate-200';
  const primaryBtn = isCyberTech ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold' : isLuxury ? 'bg-stone-900 hover:bg-stone-800 text-white' : isOrganic ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  // Render individual section by type
  const renderSection = (section: StoreSection) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'announcement':
        return (
          <div key={section.id} className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-between shadow-inner">
            <div className="flex-1 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>🚀 Free Express Shipping on Orders Over $75 • Use code <strong className="underline">EHSAN20</strong> for 20% OFF!</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-indigo-200 font-mono">
              <span>USD ($)</span>
              <span>English</span>
            </div>
          </div>
        );

      case 'header':
        return (
          <header key={section.id} className={`sticky top-0 z-[9999] backdrop-blur-md border-b px-4 lg:px-8 py-3.5 flex items-center justify-between ${headerBg}`}>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setSelectedProductForDetail(null); }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-md ${isCyberTech ? 'bg-cyan-500 text-slate-950' : isLuxury ? 'bg-stone-900' : 'bg-indigo-600'}`}>
                  {template.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-extrabold text-sm tracking-tight">{template.name}</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Powered by SELLER & EHSANKiNG</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <button onClick={() => { setSelectedProductForDetail(null); setSelectedCategory('all'); }} className="hover:text-indigo-600 transition">Shop All</button>
                <button onClick={() => setSelectedCategory('Electronics')} className="hover:text-indigo-600 transition">Electronics</button>
                <button onClick={() => setSelectedCategory('Fashion')} className="hover:text-indigo-600 transition">Fashion</button>
                <button onClick={() => setSelectedCategory('Home')} className="hover:text-indigo-600 transition">Home & Living</button>
                <button onClick={() => setSelectedCategory('Organic')} className="hover:text-indigo-600 transition">Eco Organic</button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition flex items-center gap-2 text-xs"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search...</span>
              </button>

              <button 
                onClick={() => setIsCustomizerOpen(true)}
                className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                title="Customize Sections"
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden lg:inline">Sections</span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-md transition ${primaryBtn}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              </button>
            </div>
          </header>
        );

      case 'hero':
        return (
          <div key={section.id} className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white py-16 px-6 lg:px-16 border-b border-slate-800">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                {template.name}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {template.description}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <button className={`px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition ${primaryBtn}`}>
                  Shop Collection Now
                </button>
                <button onClick={() => setIsCustomizerOpen(true)} className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition">
                  Customize Sections
                </button>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Shop by Category</h3>
              <span className="text-xs text-indigo-600 font-semibold cursor-pointer">View All →</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home', 'Organic'].map((cat, idx) => (
                <div 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className="group relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 cursor-pointer shadow-md border border-slate-800 flex items-center justify-center p-4 text-center"
                >
                  <img 
                    src={template.previewImage} 
                    alt={cat} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="relative z-10 font-black text-sm text-white">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'products':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'Electronics', 'Fashion', 'Home', 'Organic'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Showing {filteredProducts.length} items</span>
              </div>
            </div>

            <div className={`grid gap-6 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {filteredProducts.map(p => (
                <div 
                  key={p.id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl transition duration-300"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      onClick={() => setSelectedProductForDetail(p)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                      {p.category}
                    </span>
                    <button 
                      onClick={() => setQuickViewProduct(p)}
                      className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 cursor-pointer" onClick={() => setSelectedProductForDetail(p)}>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">{p.title}</h3>
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">4.9</span>
                      <span className="text-slate-400 text-[10px]">(128)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">${p.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'promo':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">Flash Sale Ending Soon</span>
                <h3 className="text-2xl sm:text-3xl font-black">Get 20% OFF Everything Today</h3>
                <p className="text-white/80 text-xs max-w-md">Use code <strong className="underline">EHSAN20</strong> at checkout to claim your seasonal merchant discount.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">08</span>
                  <span className="text-[10px] text-white/70 uppercase">Hours</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">42</span>
                  <span className="text-[10px] text-white/70 uppercase">Mins</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">19</span>
                  <span className="text-[10px] text-white/70 uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black">Trusted by 10,000+ Merchants</h3>
              <p className="text-xs text-slate-500">See what store owners say about {template.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Jenkins', role: 'Founder, LuxeLiving', quote: 'The speed and modular layout customization made launching our boutique store effortless.' },
                { name: 'Michael Chang', role: 'CEO, TechNova', quote: 'Stunning design system with zero lag. Our conversion rate jumped 34% in the first week!' },
                { name: 'Elena Rostova', role: 'Director, OrganicGlow', quote: 'Clean codebase, gorgeous theme templates, and robust checkout sync. Absolutely top tier.' }
              ].map((t, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{t.quote}"</p>
                  <div>
                    <h4 className="font-bold text-xs">{t.name}</h4>
                    <span className="text-[10px] text-indigo-500 font-mono">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div key={section.id} className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-4">
            <h3 className="text-lg font-black text-center mb-6">Frequently Asked Questions</h3>
            {[
              { q: 'Is this template fully responsive?', a: 'Yes! Built with mobile-first Tailwind CSS, ensuring pixel-perfect display on mobile phones, tablets, and desktops.' },
              { q: 'Can I customize colors and fonts?', a: 'Absolutely. Use the Sections customizer or Tailwind config to instantly skin your store.' },
              { q: 'How does inventory synchronization work?', a: 'All products sync in real-time with the core Seller backend and webhook engine.' }
            ].map((faq, idx) => (
              <details key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group">
                <summary className="font-bold text-xs flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-indigo-500 group-open:rotate-180 transition">+</span>
                </summary>
                <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">{faq.a}</p>
              </details>
            ))}
          </div>
        );

      case 'footer':
        return (
          <footer key={section.id} className="bg-slate-900 text-white py-12 px-6 lg:px-16 border-t border-slate-800 mt-12 space-y-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">S</div>
                  <span className="font-extrabold text-sm">{template.name}</span>
                </div>
                <p className="text-xs text-slate-400">High-performance headless e-commerce built for speed, conversion, and global reach.</p>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">Shop Categories</h4>
                <p className="text-slate-400 hover:text-white cursor-pointer">Electronics & Gadgets</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">Apparel & Fashion</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">Home & Living</p>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">Merchant Support</h4>
                <p className="text-slate-400 hover:text-white cursor-pointer">Documentation</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">API Webhooks</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">Status & Uptime</p>
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">Newsletter</h4>
                <div className="flex gap-2">
                  <input type="email" placeholder="Your email..." className="px-3 py-2 bg-slate-800 rounded-xl text-xs text-white outline-none flex-1 border border-slate-700" />
                  <button className="px-4 py-2 bg-indigo-600 font-bold rounded-xl">Join</button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>© 2026 {template.name} • Built by EHSANKiNG for Seller.</span>
              <div className="flex items-center gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-[700px] flex flex-col font-sans relative select-none ${themeBg}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sections Customizer Modal / Drawer */}
      {isCustomizerOpen && (
        <div className="absolute inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col border-l border-slate-700 space-y-4 animate-slideLeft">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-sm">Theme Sections Engine</h3>
              </div>
              <button onClick={() => setIsCustomizerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Drag or reorder sections dynamically to customize your store layout instantly.
            </p>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {sections.map((sec, idx) => (
                <div key={sec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={sec.enabled} 
                      onChange={() => toggleSection(sec.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{sec.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30">
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsCustomizerOpen(false)} className={`w-full py-3 rounded-xl font-bold text-xs ${primaryBtn}`}>
              Apply & Save Layout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Render Sections Dynamically */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {selectedProductForDetail ? (
          /* ================= PRODUCT DETAIL PAGE (PDP) ================= */
          <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 animate-fadeIn">
            <button 
              onClick={() => setSelectedProductForDetail(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
            >
              ← Back to Catalog
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative group">
                  <img src={selectedProductForDetail.image} alt={selectedProductForDetail.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow">In Stock • Ready to Ship</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
                    {selectedProductForDetail.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">{selectedProductForDetail.title}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">4.9 (128 verified reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${selectedProductForDetail.price.toFixed(2)}</span>
                  <span className="text-sm text-slate-400 line-through">${(selectedProductForDetail.price * 1.25).toFixed(2)}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold text-xs">Save 20%</span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProductForDetail.metaDescription || 'Crafted with premium grade materials to ensure ultimate durability, sleek appearance, and absolute reliability for daily professional or personal use.'}
                </p>

                {/* Color Variant Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Color: <span className="text-indigo-600">{selectedColor}</span></label>
                  <div className="flex items-center gap-3">
                    {['Midnight Black', 'Platinum Silver', 'Deep Indigo', 'Rose Gold'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          selectedColor === color ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 shadow-xs' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size / Spec Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Specification: <span className="text-indigo-600">{selectedSize}</span></label>
                  <div className="flex items-center gap-3">
                    {['Standard', 'Pro Edition', 'Ultra Max'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          selectedSize === size ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 shadow-xs' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => handleAddToCart(selectedProductForDetail, selectedColor, selectedSize)}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition ${primaryBtn}`}
                  >
                    Add to Cart • ${(selectedProductForDetail.price).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          sections.map(sec => renderSection(sec))
        )}
      </div>

      {/* ================= MOBILE STANDARD BOTTOM NAVIGATION BAR ================= */}
      <div className="md:hidden sticky bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between text-slate-600 dark:text-slate-300">
        <button onClick={() => { setSelectedProductForDetail(null); setSelectedCategory('all'); }} className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-indigo-600">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600 relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
          <span>Cart</span>
        </button>
        <button onClick={() => setIsCustomizerOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600">
          <Layers className="w-5 h-5" />
          <span>Sections</span>
        </button>
      </div>

      {/* ================= SLIDE-OUT MINI-CART DRAWER ================= */}
      {isCartOpen && (
        <div className="absolute inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base">Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <span>
                  {subtotal >= freeShippingThreshold 
                    ? '🎉 You unlocked Free Express Shipping!' 
                    : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping!`}
                </span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <img src={item.product.image} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{item.product.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.selectedColor} / {item.selectedSize}</p>
                      <span className="text-xs font-black text-indigo-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border rounded-xl p-1">
                      <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:bg-slate-100 rounded"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:bg-slate-100 rounded"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl">
                    <Tag className="w-4 h-4 text-indigo-500" />
                    <input 
                      type="text" 
                      placeholder="Promo code (e.g. EHSAN20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs bg-transparent outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (promoCode.toUpperCase() === 'EHSAN20') {
                        setDiscountPercent(20);
                        showToast('Promo code applied: 20% OFF!');
                      } else {
                        showToast('Invalid promo code');
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-900 dark:text-white">{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t">
                    <span>Total</span>
                    <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    showToast('Order successfully placed via Secure Checkout!');
                    setCart([]);
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition ${primaryBtn}`}
                >
                  Checkout Now • ${finalTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="absolute inset-0 z-60 bg-slate-950/80 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl border border-slate-700 space-y-6">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <img src={quickViewProduct.image} alt={quickViewProduct.title} className="w-full h-64 object-cover rounded-2xl" />
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs">{quickViewProduct.category}</span>
                <h3 className="text-xl font-black">{quickViewProduct.title}</h3>
                <p className="text-xs text-slate-500">{quickViewProduct.metaDescription || 'Premium high-grade item built with precision.'}</p>
                <div className="text-2xl font-black text-indigo-600">${quickViewProduct.price.toFixed(2)}</div>
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs ${primaryBtn}`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
