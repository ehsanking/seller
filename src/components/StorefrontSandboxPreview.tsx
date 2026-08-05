import React, { useState, useEffect } from 'react';
import { Product, StoreTemplate, StoreSettings, Coupon } from '../types';
import { 
  ShoppingBag, Search, X, Star, ShieldCheck, Truck, RefreshCw, 
  ChevronRight, Heart, User, Check, Plus, Minus, Tag, ArrowRight,
  Flame, Sparkles, SlidersHorizontal, Eye, Lock, CreditCard, CheckCircle2,
  Menu, Home, Layers, Settings2, MoveUp, MoveDown, MapPin, Phone
} from 'lucide-react';

interface StorefrontSandboxPreviewProps {
  template: StoreTemplate;
  products: Product[];
  device: 'desktop' | 'mobile';
  onClose: () => void;
  settings?: StoreSettings;
  coupons?: Coupon[];
}

interface StoreSection {
  id: string;
  name: string;
  enabled: boolean;
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'branches' | 'footer';
}

export function StorefrontSandboxPreview({
  template,
  products,
  device,
  onClose,
  settings,
  coupons = []
}: StorefrontSandboxPreviewProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor?: string; selectedSize?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProductForDetail) {
      setActiveImage(selectedProductForDetail.image);
    } else {
      setActiveImage(null);
    }
  }, [selectedProductForDetail]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Customizer visual overrides
  const [customBrandName, setCustomBrandName] = useState(template.name);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'IRR'>('USD');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fa'>('en');
  const [selectedThemeColor, setSelectedThemeColor] = useState<'default' | 'violet' | 'emerald' | 'cyber' | 'rose'>('default');

  // Translation lookups for English & Farsi/Persian
  const t = (key: string, replacements?: Record<string, string>): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        shopAll: 'Shop All',
        electronics: 'Electronics',
        fashion: 'Fashion',
        home: 'Home & Living',
        organic: 'Eco Organic',
        searchPlaceholder: 'Search products...',
        sectionsBtn: 'Sections',
        cartBtn: 'Cart',
        categoriesHeader: 'Shop by Category',
        viewAll: 'View All →',
        showingItems: 'Showing {count} items',
        addToCart: 'Add to Cart',
        addedToCart: 'Added to cart!',
        freeShippingUnlocked: '🎉 You unlocked Free Express Shipping!',
        addMoreFreeShipping: 'Add {amount} more for Free Shipping!',
        emptyCart: 'Your cart is currently empty.',
        promoPlaceholder: 'Promo code (e.g. EHSAN20)',
        applyBtn: 'Apply',
        subtotal: 'Subtotal',
        discount: 'Discount',
        shipping: 'Shipping',
        total: 'Total',
        checkoutBtn: 'Checkout Now',
        backToCatalog: '← Back to Catalog',
        inStock: 'In Stock • Ready to Ship',
        selectColor: 'Select Color:',
        selectSpec: 'Select Specification:',
        saveDiscount: 'Save 20%',
        verifiedReviews: '4.9 (128 verified reviews)',
        announcementBar: '🚀 Free Express Shipping on Orders Over $75 • Use code EHSAN20 for 20% OFF!'
      },
      fa: {
        shopAll: 'همه محصولات',
        electronics: 'الکترونیک',
        fashion: 'مد و پوشاک',
        home: 'خانه و زندگی',
        organic: 'ارگانیک سازگار با محیط زیست',
        searchPlaceholder: 'جستجوی محصولات...',
        sectionsBtn: 'بخش‌ها',
        cartBtn: 'سبد خرید',
        categoriesHeader: 'خرید بر اساس دسته‌بندی',
        viewAll: 'مشاهده همه ←',
        showingItems: 'نمایش {count} محصول',
        addToCart: 'افزودن به سبد',
        addedToCart: 'به سبد خرید اضافه شد!',
        freeShippingUnlocked: '🎉 ارسال رایگان اکسپرس فعال شد!',
        addMoreFreeShipping: 'برای ارسال رایگان، {amount} دیگر اضافه کنید!',
        emptyCart: 'سبد خرید شما در حال حاضر خالی است.',
        promoPlaceholder: 'کد تخفیف (مثال: EHSAN20)',
        applyBtn: 'اعمال',
        subtotal: 'جمع کل خرید',
        discount: 'تخفیف اعمال‌ شده',
        shipping: 'هزینه ارسال',
        total: 'جمع نهایی قابل پرداخت',
        checkoutBtn: 'ثبت و پرداخت نهایی',
        backToCatalog: '← بازگشت به کاتالوگ فروشگاه',
        inStock: 'موجود در انبار • آماده ارسال اکسپرس',
        selectColor: 'انتخاب رنگ:',
        selectSpec: 'انتخاب مشخصات:',
        saveDiscount: 'تخفیف ویژه ۲۰٪',
        verifiedReviews: '۴.۹ (۱۲۸ دیدگاه تایید شده)',
        announcementBar: '🚀 ارسال رایگان برای سفارش‌های بالای ۷۵ دلار • کد تخفیف EHSAN20 برای ۲۰٪ تخفیف!'
      }
    };

    let text = translations[selectedLanguage]?.[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const currencyInfo = {
    USD: { symbol: '$', rate: 1, position: 'before' },
    EUR: { symbol: '€', rate: 0.92, position: 'before' },
    IRR: { symbol: ' ریال', rate: 500000, position: 'after' }
  };

  const formatPrice = (priceInUsd: number) => {
    const cur = currencyInfo[selectedCurrency];
    const amount = priceInUsd * cur.rate;
    const formattedVal = selectedCurrency === 'IRR' 
      ? Math.round(amount).toLocaleString('fa-IR')
      : amount.toFixed(2);
    
    if (cur.position === 'before') {
      return `${cur.symbol}${formattedVal}`;
    } else {
      return `${formattedVal}${cur.symbol}`;
    }
  };

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
    { id: 'sec_branches', name: 'Our Physical Branches & Maps', enabled: true, type: 'branches' },
    { id: 'sec_footer', name: 'Store Footer', enabled: true, type: 'footer' },
  ]);

  // Variant selections state for detail view
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [selectedSize, setSelectedSize] = useState('Standard');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    showToast(t('addedToCart') + ` (${product.title})`);
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
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  } else {
    discountAmount = (subtotal * discountPercent) / 100;
  }
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

  const getThemeColors = () => {
    if (selectedThemeColor === 'default') {
      return {
        themeBg: isCyberTech ? 'bg-slate-950 text-slate-100' : isLuxury ? 'bg-stone-50 text-stone-900' : isOrganic ? 'bg-amber-50/40 text-slate-900' : 'bg-slate-50 text-slate-900',
        headerBg: isCyberTech ? 'bg-slate-900/90 border-slate-800' : isLuxury ? 'bg-white/90 border-stone-200' : 'bg-white/90 border-slate-200',
        primaryBtn: isCyberTech ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold' : isLuxury ? 'bg-stone-900 hover:bg-stone-800 text-white' : isOrganic ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white',
        textAccent: isCyberTech ? 'text-cyan-400' : isLuxury ? 'text-stone-950' : isOrganic ? 'text-emerald-600' : 'text-indigo-600',
        borderAccent: isCyberTech ? 'border-cyan-500' : isLuxury ? 'border-stone-900' : isOrganic ? 'border-emerald-600' : 'border-indigo-600',
        badgeBg: isCyberTech ? 'bg-cyan-500/10 text-cyan-400' : isLuxury ? 'bg-stone-100 text-stone-900' : isOrganic ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
      };
    }
    
    switch (selectedThemeColor) {
      case 'violet':
        return {
          themeBg: 'bg-violet-50/30 text-slate-900 dark:bg-slate-950 dark:text-slate-100',
          headerBg: 'bg-white/95 border-violet-100 dark:bg-slate-900/95 dark:border-slate-800/80',
          primaryBtn: 'bg-violet-600 hover:bg-violet-700 text-white',
          textAccent: 'text-violet-600 dark:text-violet-400',
          borderAccent: 'border-violet-600',
          badgeBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
        };
      case 'emerald':
        return {
          themeBg: 'bg-emerald-50/20 text-slate-900 dark:bg-slate-950 dark:text-slate-100',
          headerBg: 'bg-white/95 border-emerald-100 dark:bg-slate-900/95 dark:border-slate-800/80',
          primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          borderAccent: 'border-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
        };
      case 'cyber':
        return {
          themeBg: 'bg-zinc-950 text-zinc-100',
          headerBg: 'bg-zinc-900/95 border-fuchsia-950 dark:bg-zinc-900/95 dark:border-fuchsia-950',
          primaryBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-wider',
          textAccent: 'text-fuchsia-500',
          borderAccent: 'border-fuchsia-600',
          badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400'
        };
      case 'rose':
        return {
          themeBg: 'bg-rose-50/20 text-slate-900 dark:bg-slate-950 dark:text-slate-100',
          headerBg: 'bg-white/95 border-rose-100 dark:bg-slate-900/95 dark:border-slate-800/80',
          primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
          textAccent: 'text-rose-600 dark:text-rose-400',
          borderAccent: 'border-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
        };
      default:
        return {
          themeBg: 'bg-slate-50 text-slate-900',
          headerBg: 'bg-white/90 border-slate-200',
          primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          textAccent: 'text-indigo-600',
          borderAccent: 'border-indigo-600',
          badgeBg: 'bg-indigo-50 text-indigo-700'
        };
    }
  };

  const currentTheme = getThemeColors();
  const themeBg = currentTheme.themeBg;
  const headerBg = currentTheme.headerBg;
  const primaryBtn = currentTheme.primaryBtn;
  const textAccent = currentTheme.textAccent;
  const borderAccent = currentTheme.borderAccent || '';
  const badgeBg = currentTheme.badgeBg || '';

  // Synchronize orders dynamically to actual backend Express database
  const handleCheckout = async () => {
    setIsCartOpen(false);
    showToast(selectedLanguage === 'en' ? 'Connecting to secure SELLER payment gateway...' : 'در حال اتصال به درگاه پرداخت امن سلر...');
    
    try {
      const orderPayload = {
        customerName: `Live Storefront Preview (${selectedLanguage === 'en' ? 'Ehsan Merchant' : 'فروشگاه احسان'})`,
        customerEmail: 'ehsan-demo-purchaser@seller-storefront.io',
        items: cart.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        })),
        totalAmount: finalTotal,
        paymentMethod: 'Credit Card (Simulated)',
        shippingAddress: selectedLanguage === 'en' 
          ? 'Suite 404, Headless Sandbox Complex, SELLER HQ'
          : 'تهران، خیابان شریعتی، مجتمع فناوری سلر، طبقه ۴'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        showToast(
          selectedLanguage === 'en'
            ? '🚀 Success! Order created and synchronized with SELLER main dashboard logs!'
            : '🚀 موفقیت! سفارش با موفقیت ثبت شد و در داشبورد اصلی سلر قرار گرفت!'
        );
        setCart([]);
      } else {
        throw new Error('API server rejected order submission');
      }
    } catch (err) {
      console.error('Failed backend synchronization, falling back to local simulation:', err);
      showToast(
        selectedLanguage === 'en'
          ? 'Transaction completed successfully (Local Sandbox Mode)'
          : 'تراکنش با موفقیت شبیه‌سازی شد (حالت آفلاین سندباکس)'
      );
      setCart([]);
    }
  };

  // Render individual section by type
  const renderSection = (section: StoreSection) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'announcement':
        return (
          <div key={section.id} className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-between shadow-inner">
            <div className="flex-1 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>{t('announcementBar')}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-indigo-200 font-mono">
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">{selectedCurrency}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">{selectedLanguage === 'en' ? 'English' : 'فارسی'}</span>
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
                  {customBrandName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-extrabold text-sm tracking-tight">{customBrandName}</h2>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedLanguage === 'en' ? 'Powered by SELLER & EHSANKiNG' : 'توسعه یافته با موتور سلر و احسان شاه'}</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <button onClick={() => { setSelectedProductForDetail(null); setSelectedCategory('all'); }} className="hover:text-indigo-600 transition">{t('shopAll')}</button>
                <button onClick={() => setSelectedCategory('Electronics')} className="hover:text-indigo-600 transition">{t('electronics')}</button>
                <button onClick={() => setSelectedCategory('Fashion')} className="hover:text-indigo-600 transition">{t('fashion')}</button>
                <button onClick={() => setSelectedCategory('Home')} className="hover:text-indigo-600 transition">{t('home')}</button>
                <button onClick={() => setSelectedCategory('Organic')} className="hover:text-indigo-600 transition">{t('organic')}</button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition flex items-center gap-2 text-xs"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t('searchPlaceholder')}</span>
              </button>

              <button 
                onClick={() => setIsCustomizerOpen(true)}
                className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition animate-pulse"
                title="Customize Sections"
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden lg:inline">{t('sectionsBtn')}</span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-md transition ${primaryBtn}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('cartBtn')} ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
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
                {customBrandName}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {selectedLanguage === 'en' ? template.description : 'پلتفرم تجارت مدرن و فوق سریع سرشار از خلاقیت'}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <button className={`px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition ${primaryBtn}`}>
                  {selectedLanguage === 'en' ? 'Shop Collection Now' : 'مشاهده کل کلکسیون'}
                </button>
                <button onClick={() => setIsCustomizerOpen(true)} className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition">
                  {t('sectionsBtn')}
                </button>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{t('categoriesHeader')}</h3>
              <span className="text-xs text-indigo-600 font-semibold cursor-pointer">{t('viewAll')}</span>
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
                  <span className="relative z-10 font-black text-sm text-white">{t(cat.toLowerCase())}</span>
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
                    {t(cat === 'all' ? 'shopAll' : cat.toLowerCase())}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t('showingItems', { count: filteredProducts.length.toString() })}</span>
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
                      {t(p.category.toLowerCase())}
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
                      <span className="text-xs text-slate-400 block">{selectedLanguage === 'en' ? 'Price' : 'قیمت'}</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{formatPrice(p.price)}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                    >
                      + {t('addToCart')}
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
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  {selectedLanguage === 'en' ? 'Flash Sale Ending Soon' : 'فروش ویژه در حال اتمام'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {selectedLanguage === 'en' ? 'Get 20% OFF Everything Today' : 'امروز روی همه محصولات ۲۰٪ تخفیف بگیرید'}
                </h3>
                <p className="text-white/80 text-xs max-w-md">
                  {selectedLanguage === 'en' 
                    ? 'Use code EHSAN20 at checkout to claim your seasonal merchant discount.' 
                    : 'در مرحله نهایی کد تخفیف EHSAN20 را برای دریافت آفر ویژه وارد نمایید.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">08</span>
                  <span className="text-[10px] text-white/70 uppercase">
                    {selectedLanguage === 'en' ? 'Hours' : 'ساعت'}
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">42</span>
                  <span className="text-[10px] text-white/70 uppercase">
                    {selectedLanguage === 'en' ? 'Mins' : 'دقیقه'}
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
                  <span className="text-xl font-black block">19</span>
                  <span className="text-[10px] text-white/70 uppercase">
                    {selectedLanguage === 'en' ? 'Secs' : 'ثانیه'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black">
                {selectedLanguage === 'en' ? 'Trusted by 10,000+ Merchants' : 'مورد اعتماد بیش از ۱۰,۰۰۰ فروشگاه بین‌المللی'}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedLanguage === 'en' ? `See what store owners say about ${customBrandName}` : `نظرات برخی از مشتریان وفادار درباره فروشگاه ${customBrandName}`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  name: selectedLanguage === 'en' ? 'Sarah Jenkins' : 'سارا رضایی', 
                  role: selectedLanguage === 'en' ? 'Founder, LuxeLiving' : 'موسس لوکس‌شاپ', 
                  quote: selectedLanguage === 'en' 
                    ? 'The speed and modular layout customization made launching our boutique store effortless.' 
                    : 'سرعت و انعطاف‌پذیری بخش‌های قالب، راه‌اندازی بوتیک دیجیتال ما را بسیار هموار و لذت‌بخش کرد.'
                },
                { 
                  name: selectedLanguage === 'en' ? 'Michael Chang' : 'سینا احمدی', 
                  role: selectedLanguage === 'en' ? 'CEO, TechNova' : 'مدیر عامل تک‌نوا', 
                  quote: selectedLanguage === 'en' 
                    ? 'Stunning design system with zero lag. Our conversion rate jumped 34% in the first week!' 
                    : 'سیستم طراحی بی‌نظیر بدون کوچک‌ترین تاخیر. نرخ فروش ما در هفته اول ۳۴٪ افزایش یافت!'
                },
                { 
                  name: selectedLanguage === 'en' ? 'Elena Rostova' : 'مهسا علوی', 
                  role: selectedLanguage === 'en' ? 'Director, OrganicGlow' : 'مدیر ارشد اورگانیک‌لایف', 
                  quote: selectedLanguage === 'en' 
                    ? 'Clean codebase, gorgeous theme templates, and robust checkout sync. Absolutely top tier.' 
                    : 'کد بسیار تمیز، الگوهای ظاهری چشم‌نواز و همگام‌سازی لحظه‌ای با هسته سلر. واقعا عالی است.'
                }
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
            <h3 className="text-lg font-black text-center mb-6">
              {selectedLanguage === 'en' ? 'Frequently Asked Questions' : 'سوالات متداول کاربران'}
            </h3>
            {[
              { 
                q: selectedLanguage === 'en' ? 'Is this template fully responsive?' : 'آیا این قالب کاملاً واکنش‌گرا و ریسپانسیو است؟', 
                a: selectedLanguage === 'en' 
                  ? 'Yes! Built with mobile-first Tailwind CSS, ensuring pixel-perfect display on mobile phones, tablets, and desktops.' 
                  : 'بله! قالب با معماری موبایل-اول و فریم‌ورک Tailwind طراحی شده تا در موبایل، تبلت و دسکتاپ به زیبایی اجرا شود.'
              },
              { 
                q: selectedLanguage === 'en' ? 'Can I customize colors and fonts?' : 'آیا امکان شخصی‌سازی رنگ‌ها و فونت‌ها وجود دارد؟', 
                a: selectedLanguage === 'en' 
                  ? 'Absolutely. Use the Sections customizer or Tailwind config to instantly skin your store.' 
                  : 'بله کاملاً. از طریق پنل شخصی‌سازی بخش‌ها یا ویرایشگر زنده CSS می‌توانید تمام استایل‌ها را ویرایش کنید.'
              },
              { 
                q: selectedLanguage === 'en' ? 'How does inventory synchronization work?' : 'همگام‌سازی محصولات و انبار چگونه انجام می‌شود؟', 
                a: selectedLanguage === 'en' 
                  ? 'All products sync in real-time with the core Seller backend and webhook engine.' 
                  : 'تمام کاتالوگ محصولات و موجودی به صورت خودکار با دیتابیس ابری سلر و سیستم وب‌هوک یکپارچه شده است.'
              }
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

      case 'branches':
        const branchList = settings?.branches || [
          {
            id: 'mock_1',
            name: 'Berlin Central Branch',
            nameFa: 'شعبه مرکزی برلین',
            address: 'Friedrichstraße 43, 10117 Berlin, Germany',
            addressFa: 'آلمان، برلین، خیابان فریدریش، پلاک ۴۳',
            phone: '+49 30 12345678',
            latitude: 52.5072,
            longitude: 13.3905,
            isMain: true
          },
          {
            id: 'mock_2',
            name: 'Munich Branch',
            nameFa: 'شعبه مونیخ',
            address: 'Karlsplatz 5, 80335 München, Germany',
            addressFa: 'آلمان، مونیخ، میدان کارلزپلاتس، پلاک ۵',
            phone: '+49 89 87654321',
            latitude: 48.1392,
            longitude: 11.5656,
            isMain: false
          },
          {
            id: 'mock_3',
            name: 'Frankfurt Branch',
            nameFa: 'شعبه فرانکفورت',
            address: 'Kaiserstraße 12, 60311 Frankfurt am Main, Germany',
            addressFa: 'آلمان، فرانکفورت، خیابان کایزر، پلاک ۱۲',
            phone: '+49 69 11223344',
            latitude: 50.1098,
            longitude: 8.6732,
            isMain: false
          }
        ];
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8" dir={selectedLanguage === 'fa' ? 'rtl' : 'ltr'}>
            <div className="text-center space-y-2">
              <span className="text-[10px] bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                {selectedLanguage === 'en' ? 'Our Presence' : 'شعب فیزیکی ما'}
              </span>
              <h3 className="text-xl font-black">
                {selectedLanguage === 'en' ? 'Visit Our Store & Branches' : 'شعب و نمایندگی‌های فیزیکی'}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                {selectedLanguage === 'en' 
                  ? 'We have multiple physical locations ready to serve you. Stop by to try our products in person.' 
                  : 'برای تست فیزیکی محصولات و مشاوره حضوری، می‌توانید به هر یک از شعب فعال ما مراجعه کنید.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branchList.map((branch) => (
                <div key={branch.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs hover:shadow-md transition duration-300 space-y-4 text-right flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <MapPin className="w-5 h-5" />
                      </span>
                      {branch.isMain && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                          {selectedLanguage === 'en' ? 'Main Store' : 'شعبه اصلی'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm">
                        {selectedLanguage === 'fa' ? (branch.nameFa || branch.name) : branch.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                        {selectedLanguage === 'fa' ? (branch.addressFa || branch.address) : branch.address}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {branch.phone || 'N/A'}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                    >
                      {selectedLanguage === 'en' ? 'Navigate →' : 'مسیریابی ←'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer key={section.id} className="bg-slate-900 text-white py-12 px-6 lg:px-16 border-t border-slate-800 mt-12 space-y-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">S</div>
                  <span className="font-extrabold text-sm">{customBrandName}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedLanguage === 'en' 
                    ? 'High-performance headless e-commerce built for speed, conversion, and global reach.' 
                    : 'پلتفرم فروشگاهی فوق پیشرفته با سرعت خیره‌کننده، امنیت بالا و سازگاری با متدهای مدرن سئو.'}
                </p>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">
                  {selectedLanguage === 'en' ? 'Shop Categories' : 'دسته‌بندی‌های فروشگاه'}
                </h4>
                <p className="text-slate-400 hover:text-white cursor-pointer">{t('electronics')}</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">{t('fashion')}</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">{t('home')}</p>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">
                  {selectedLanguage === 'en' ? 'Support' : 'پشتیبانی فروشندگان'}
                </h4>
                <p className="text-slate-400 hover:text-white cursor-pointer">
                  {selectedLanguage === 'en' ? 'Documentation' : 'مستندات توسعه'}
                </p>
                <p className="text-slate-400 hover:text-white cursor-pointer">
                  {selectedLanguage === 'en' ? 'API Webhooks' : 'وب‌هوک‌های سلر'}
                </p>
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase">
                  {selectedLanguage === 'en' ? 'Newsletter' : 'خبرنامه'}
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder={selectedLanguage === 'en' ? 'Your email...' : 'ایمیل شما...'} 
                    className="px-3 py-2 bg-slate-800 rounded-xl text-xs text-white outline-none flex-1 border border-slate-700" 
                  />
                  <button className="px-4 py-2 bg-indigo-600 font-bold rounded-xl">
                    {selectedLanguage === 'en' ? 'Join' : 'عضویت'}
                  </button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {selectedLanguage === 'en' 
                  ? `© 2026 ${customBrandName} • Built by EHSANKiNG for Seller.` 
                  : `© ۲۰۲۶ ${customBrandName} • توسعه یافته توسط تیم احسان شاه برای موتور سلر.`}
              </span>
              <div className="flex items-center gap-4">
                <span>{selectedLanguage === 'en' ? 'Privacy' : 'حریم خصوصی'}</span>
                <span>{selectedLanguage === 'en' ? 'Terms' : 'قوانین و مقررات'}</span>
              </div>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-[700px] flex flex-col font-sans relative select-none ${themeBg}`} dir={selectedLanguage === 'fa' ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`absolute top-16 ${selectedLanguage === 'fa' ? 'left-6' : 'right-6'} z-70 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sections Customizer Modal / Drawer */}
      {isCustomizerOpen && (
        <div className="absolute inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 space-y-4 animate-slideLeft text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-sm">
                  {selectedLanguage === 'en' ? 'Store Design Customizer' : 'تنظیمات قالب فروشگاه'}
                </h3>
              </div>
              <button onClick={() => setIsCustomizerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* BRAND NAME CUSTOMIZATION */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedLanguage === 'en' ? 'Brand Display Name' : 'نام برند فروشگاه'}
                </label>
                <input 
                  type="text" 
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              {/* LANGUAGE SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedLanguage === 'en' ? 'Store Language' : 'زبان فروشگاه'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSelectedLanguage('en')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                  >
                    English (EN)
                  </button>
                  <button 
                    onClick={() => setSelectedLanguage('fa')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${selectedLanguage === 'fa' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                  >
                    فارسی (FA)
                  </button>
                </div>
              </div>

              {/* CURRENCY PICKER */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedLanguage === 'en' ? 'Currency Converter' : 'واحد پول نمایش'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['USD', 'EUR', 'IRR'] as const).map(cur => (
                    <button 
                      key={cur}
                      onClick={() => setSelectedCurrency(cur)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${selectedCurrency === cur ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              {/* PALETTE SWITCHER */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedLanguage === 'en' ? 'Aesthetic Skin Overrides' : 'پالت رنگ قالب زنده'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'default', label: selectedLanguage === 'en' ? 'Default' : 'پیش‌فرض' },
                    { id: 'violet', label: selectedLanguage === 'en' ? 'Violet Aura' : 'بنفش رویایی' },
                    { id: 'emerald', label: selectedLanguage === 'en' ? 'Emerald Shine' : 'زمرد طبیعی' },
                    { id: 'cyber', label: selectedLanguage === 'en' ? 'Cyber Neon' : 'سایبر پانک' },
                    { id: 'rose', label: selectedLanguage === 'en' ? 'Rose Quartz' : 'صورتی کوارتز' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedThemeColor(p.id as any)}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition ${selectedThemeColor === p.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION CONTROLLER SELECTION */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {selectedLanguage === 'en' ? 'Toggle Store Sections' : 'مدیریت و چیدمان بخش‌ها'}
                </label>
                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div key={sec.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={sec.enabled} 
                          onChange={() => toggleSection(sec.id)}
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                        />
                        <span className="text-[11px] font-bold">{sec.name}</span>
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
              </div>
            </div>

            <button onClick={() => setIsCustomizerOpen(false)} className={`w-full py-3 rounded-xl font-bold text-xs ${primaryBtn}`}>
              {selectedLanguage === 'en' ? 'Close & View Store' : 'بستن و پیش‌نمایش نهایی'}
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
              {t('backToCatalog')}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative group">
                  <img src={activeImage || selectedProductForDetail.image} alt={selectedProductForDetail.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow">
                    {t('inStock')}
                  </span>
                </div>

                {/* Sub-Gallery Thumbnail Pickers */}
                {selectedProductForDetail.gallery && selectedProductForDetail.gallery.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-1">
                    {/* First thumbnail represents the main image */}
                    <button
                      onClick={() => setActiveImage(selectedProductForDetail.image)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-950 transition relative ${
                        (activeImage === selectedProductForDetail.image || !activeImage)
                          ? 'border-indigo-600 ring-2 ring-indigo-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <img src={selectedProductForDetail.image} alt="Main thumbnail view" className="w-full h-full object-cover" />
                    </button>

                    {/* Remaining thumbnails from the product gallery */}
                    {selectedProductForDetail.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-950 transition relative ${
                          activeImage === imgUrl
                            ? 'border-indigo-600 ring-2 ring-indigo-500/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <img src={imgUrl} alt={`Gallery thumbnail view ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
                    {t(selectedProductForDetail.category.toLowerCase())}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">{selectedProductForDetail.title}</h1>
                  
                  {/* Product Hashtags Rendering */}
                  {selectedProductForDetail.tags && selectedProductForDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedProductForDetail.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('verifiedReviews')}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{formatPrice(selectedProductForDetail.price)}</span>
                  <span className="text-sm text-slate-400 line-through">{formatPrice(selectedProductForDetail.price * 1.25)}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold text-xs">{t('saveDiscount')}</span>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  {selectedProductForDetail.description || selectedProductForDetail.metaDescription || 'Crafted with premium grade materials to ensure ultimate durability, sleek appearance, and absolute reliability for daily professional or personal use.'}
                </div>

                {/* Color Variant Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('selectColor')} <span className="text-indigo-600">{selectedColor}</span></label>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('selectSpec')} <span className="text-indigo-600">{selectedSize}</span></label>
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
                    {t('addToCart')} • {formatPrice(selectedProductForDetail.price)}
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
          <span>{selectedLanguage === 'en' ? 'Home' : 'خانه'}</span>
        </button>
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600">
          <Search className="w-5 h-5" />
          <span>{selectedLanguage === 'en' ? 'Search' : 'جستجو'}</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600 relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
          <span>{t('cartBtn')}</span>
        </button>
        <button onClick={() => setIsCustomizerOpen(true)} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold hover:text-indigo-600">
          <Layers className="w-5 h-5" />
          <span>{t('sectionsBtn')}</span>
        </button>
      </div>

      {/* ================= SLIDE-OUT MINI-CART DRAWER ================= */}
      {isCartOpen && (
        <div className="absolute inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base">{t('cartBtn')} ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <span>
                  {subtotal >= freeShippingThreshold 
                    ? t('freeShippingUnlocked') 
                    : t('addMoreFreeShipping', { amount: formatPrice(freeShippingThreshold - subtotal) })}
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
                  <p className="text-sm font-semibold text-slate-500">{t('emptyCart')}</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <img src={item.product.image} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{item.product.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.selectedColor} / {item.selectedSize}</p>
                      <span className="text-xs font-black text-indigo-600">{formatPrice(item.product.price * item.quantity)}</span>
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
                      placeholder={t('promoPlaceholder')}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full text-xs bg-transparent outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const cleanCode = promoCode.trim().toUpperCase();
                      const couponMatch = coupons.find(c => c.code.toUpperCase() === cleanCode);
                      
                      if (couponMatch) {
                        if (!couponMatch.isActive) {
                          showToast('This coupon is inactive');
                          return;
                        }
                        const todayStr = new Date().toISOString().split('T')[0];
                        if (couponMatch.startDate && todayStr < couponMatch.startDate) {
                          showToast('This coupon is not active yet');
                          return;
                        }
                        if (couponMatch.endDate && todayStr > couponMatch.endDate) {
                          showToast('This coupon has expired');
                          return;
                        }
                        if (couponMatch.minOrderAmount && subtotal < couponMatch.minOrderAmount) {
                          showToast(`Minimum order of $${couponMatch.minOrderAmount} required`);
                          return;
                        }
                        if (couponMatch.usageLimit > 0 && couponMatch.usedCount >= couponMatch.usageLimit) {
                          showToast('This coupon has reached its limit');
                          return;
                        }

                        setAppliedCoupon(couponMatch);
                        setDiscountPercent(0);
                        
                        const valStr = couponMatch.type === 'percentage' ? `${couponMatch.value}%` : `$${couponMatch.value}`;
                        showToast(`Promo code applied: ${valStr} OFF!`);
                      } else if (cleanCode === 'EHSAN20') {
                        setDiscountPercent(20);
                        setAppliedCoupon(null);
                        showToast('Promo code applied: 20% OFF!');
                      } else {
                        showToast('Invalid promo code');
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-850 dark:text-white rounded-xl text-xs font-bold"
                  >
                    {t('applyBtn')}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{t('subtotal')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>
                        {t('discount')}{' '}
                        {appliedCoupon 
                          ? `(${appliedCoupon.code}: ${appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`})` 
                          : `(${discountPercent}%)`
                        }
                      </span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>{t('shipping')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {shippingFee === 0 ? (selectedLanguage === 'en' ? 'FREE' : 'رایگان') : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t">
                    <span>{t('total')}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition ${primaryBtn}`}
                >
                  {t('checkoutBtn')} • {formatPrice(finalTotal)}
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
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                  {t(quickViewProduct.category.toLowerCase())}
                </span>
                <h3 className="text-xl font-black">{quickViewProduct.title}</h3>
                <p className="text-xs text-slate-500">
                  {quickViewProduct.metaDescription || (selectedLanguage === 'en' ? 'Premium high-grade item built with precision.' : 'محصول ویژه و اورجینال با تضمین بهترین کیفیت بازار')}
                </p>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatPrice(quickViewProduct.price)}</div>
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs ${primaryBtn}`}
                >
                  {t('addToCart')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
