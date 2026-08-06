import React, { useState } from 'react';
import { 
  Send, Smartphone, ShoppingBag, Search, Star, ShieldCheck, 
  CheckCircle2, Plus, Minus, Trash2, ArrowRight, ExternalLink, 
  Copy, Check, Sparkles, RefreshCw, X, Globe, MessageSquare 
} from 'lucide-react';
import { Product, Order } from '../types';

interface TelegramMiniAppViewProps {
  products: Product[];
  storeName: string;
  onOrderCreated?: () => void;
}

export const TelegramMiniAppView: React.FC<TelegramMiniAppViewProps> = ({
  products = [],
  storeName = 'Ehsan Store',
  onOrderCreated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tgTheme, setTgTheme] = useState<'light' | 'dark'>('dark');
  const [mobilePlatform, setMobilePlatform] = useState<'ios' | 'android'>('ios');

  // Customer info inside Mini App checkout
  const [customerName, setCustomerName] = useState('Telegram User #88291');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 382-9910');
  const [shippingAddress, setShippingAddress] = useState('100 Telegram Plaza, Suite 404');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        customerName: customerName || 'Telegram MiniApp Buyer',
        customerEmail: 'telegram.buyer@ehsanking.io',
        customerPhone: customerPhone || '+15550000000',
        shippingAddress: shippingAddress || 'Telegram Verified Address',
        items: cart.map(i => ({
          productId: i.product.id,
          productTitle: i.product.title,
          quantity: i.quantity,
          price: i.product.price,
          sku: i.product.sku || 'TG-SKU'
        })),
        totalAmount: totalCartAmount,
        paymentMethod: 'telegram_stars_or_card',
        channel: 'telegram_mini_app'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrderSuccess(newOrder);
        setCart([]);
        setIsCheckingOut(false);
        if (onOrderCreated) onOrderCreated();
      } else {
        throw new Error('Order submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order via Telegram Mini App.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const miniAppUrl = `https://t.me/EhsanStoreBot/shop?startapp=catalog`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner / Header description */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Telegram WebApp v7.0
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Bot Live (@EhsanStoreBot)
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Telegram Mini App Storefront Preview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Test and preview how your product catalog appears to buyers inside Telegram. Supports seamless mobile navigation, cart management, and native Telegram Pay / Stars checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setMobilePlatform('ios')}
              className={`px-3 py-1.5 rounded-lg transition ${mobilePlatform === 'ios' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              iOS Style 
            </button>
            <button
              onClick={() => setMobilePlatform('android')}
              className={`px-3 py-1.5 rounded-lg transition ${mobilePlatform === 'android' ? 'bg-indigo-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Android Style 🤖
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setTgTheme('dark')}
              className={`px-3 py-1.5 rounded-lg transition ${tgTheme === 'dark' ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dark 🌙
            </button>
            <button
              onClick={() => setTgTheme('light')}
              className={`px-3 py-1.5 rounded-lg transition ${tgTheme === 'light' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Light ☀️
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(miniAppUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Mobile Phone Frame Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[400px] bg-slate-950 rounded-[48px] p-4 shadow-2xl border-4 border-slate-800">
            {/* Phone Top Notch (iOS Dynamic Island vs Android Punch-hole) */}
            {mobilePlatform === 'ios' ? (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
                <div className="w-10 h-1 bg-slate-950 rounded-full"></div>
              </div>
            ) : (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center z-30 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-slate-950"></div>
              </div>
            )}

            {/* Telegram Mini App Screen Container */}
            <div className={`relative w-full h-[720px] rounded-[36px] overflow-hidden flex flex-col transition-colors duration-300 ${
              tgTheme === 'dark' ? 'bg-[#18222d] text-slate-100' : 'bg-slate-50 text-slate-900'
            }`}>
              
              {/* Telegram MiniApp Top Header Bar */}
              <div className={`px-4 py-3 flex items-center justify-between border-b z-20 ${
                tgTheme === 'dark' ? 'bg-[#212e3d] border-[#2b3a4c]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5 pt-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                    ES
                  </div>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">{storeName} Shop</h3>
                    <p className={`text-[10px] ${tgTheme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>@EhsanStoreBot</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button className={`p-1.5 rounded-full ${tgTheme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className={`p-1.5 rounded-full ${tgTheme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Mini App Body Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {orderSuccess ? (
                  <div className={`p-6 rounded-2xl text-center space-y-4 border ${
                    tgTheme === 'dark' ? 'bg-[#212e3d] border-[#2b3a4c]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-emerald-500">Order Placed Successfully!</h4>
                      <p className="text-xs opacity-75 mt-1">Order ID: #{orderSuccess.id}</p>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      Thank you for shopping via Telegram Mini App. Your receipt and shipment tracking have been sent to your Telegram chat.
                    </p>
                    <button
                      onClick={() => setOrderSuccess(null)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Back to Mini App Catalog
                    </button>
                  </div>
                ) : isCheckingOut ? (
                  <div className={`p-4 rounded-2xl space-y-4 border ${
                    tgTheme === 'dark' ? 'bg-[#212e3d] border-[#2b3a4c]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-bold text-sm">Telegram Express Checkout</h4>
                      <button onClick={() => setIsCheckingOut(false)} className="text-xs text-indigo-400 hover:underline">
                        ← Back to Cart
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase opacity-75 mb-1">Telegram Buyer Name</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className={`w-full text-xs px-3 py-2 rounded-xl border ${
                            tgTheme === 'dark' ? 'bg-[#18222d] border-[#2b3a4c] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase opacity-75 mb-1">Phone Number / Telegram Contact</label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className={`w-full text-xs px-3 py-2 rounded-xl border ${
                            tgTheme === 'dark' ? 'bg-[#18222d] border-[#2b3a4c] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase opacity-75 mb-1">Delivery Address</label>
                        <input
                          type="text"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className={`w-full text-xs px-3 py-2 rounded-xl border ${
                            tgTheme === 'dark' ? 'bg-[#18222d] border-[#2b3a4c] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      tgTheme === 'dark' ? 'bg-[#18222d] border-[#2b3a4c]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Items ({totalItemsCount}):</span>
                        <span>${totalCartAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Telegram Shipping:</span>
                        <span className="text-emerald-400">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm font-black pt-1 border-t">
                        <span>Total Amount:</span>
                        <span className="text-indigo-400">${totalCartAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Pay ${totalCartAmount.toFixed(2)} with Telegram Stars / Card ⭐️
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Search & Categories */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 opacity-50" />
                      <input
                        type="text"
                        placeholder="Search products in Mini App..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full text-xs pl-9 pr-3 py-2 rounded-xl border transition ${
                          tgTheme === 'dark' 
                            ? 'bg-[#212e3d] border-[#2b3a4c] text-white placeholder-slate-400' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                            selectedCategory === cat
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : tgTheme === 'dark'
                              ? 'bg-[#212e3d] text-slate-300 hover:bg-[#2b3a4c]'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          className={`rounded-2xl p-3 border flex flex-col justify-between transition group ${
                            tgTheme === 'dark' ? 'bg-[#212e3d] border-[#2b3a4c]' : 'bg-white border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div>
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-800">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/60 backdrop-blur-md text-white">
                                ${p.price.toFixed(2)}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs line-clamp-1">{p.title}</h4>
                            <p className="text-[10px] opacity-60 line-clamp-1 mt-0.5">{p.category}</p>
                          </div>

                          <button
                            onClick={() => addToCart(p)}
                            className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Plus className="w-3 h-3" /> Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-12 opacity-60 text-xs">
                        No products found in this category.
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Bottom Sticky Cart Bar */}
              {cart.length > 0 && !isCheckingOut && !orderSuccess && (
                <div className={`p-3 border-t flex items-center justify-between z-20 ${
                  tgTheme === 'dark' ? 'bg-[#212e3d] border-[#2b3a4c]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {totalItemsCount}
                    </div>
                    <div>
                      <p className="text-[10px] opacity-75 leading-none">Cart Total</p>
                      <p className="text-xs font-black text-indigo-400">${totalCartAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

              {/* Mobile Platform Bottom Indicator (iOS Home Bar vs Android Nav Bar) */}
              {mobilePlatform === 'ios' ? (
                <div className={`py-1.5 flex justify-center items-center shrink-0 ${tgTheme === 'dark' ? 'bg-[#18222d]' : 'bg-slate-50'}`}>
                  <div className="w-32 h-1 bg-slate-500/40 rounded-full"></div>
                </div>
              ) : (
                <div className={`py-1.5 px-6 flex justify-between items-center text-xs opacity-60 font-mono shrink-0 ${tgTheme === 'dark' ? 'bg-[#18222d] text-white' : 'bg-slate-50 text-slate-800'}`}>
                  <span>◄</span>
                  <span>●</span>
                  <span>■</span>
                </div>
              )}

          </div>
        </div>

        {/* Right Column: Configuration & Technical Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Telegram Mini App Features
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Telegram Mini Apps (TMAs) run seamlessly inside Telegram with zero installation required. They leverage the user's Telegram profile, support native Telegram Stars payments, and sync orders automatically back to your store dashboard.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Instant Telegram Authentication</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automatically identifies buyers via Telegram ID and pre-fills delivery info.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Telegram Stars &amp; Payments API</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Accept native Telegram Stars or credit card payments instantly inside the chat interface.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Bot Menu Integration</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Configured as the main menu button (`/shop`) on `@EhsanStoreBot`.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Mini App Integration Link</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={miniAppUrl}
                className="w-full text-xs font-mono bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
              />
              <a
                href={miniAppUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                title="Open Mini App Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(miniAppUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className={`w-full py-3 px-4 font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                copied 
                  ? 'bg-emerald-600 text-white scale-[1.02]' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Copy className={`w-4 h-4 absolute transition-all duration-300 ${copied ? 'opacity-0 scale-50 rotate-45' : 'opacity-100 scale-100 rotate-0'}`} />
                <Check className={`w-4 h-4 absolute transition-all duration-300 ${copied ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'}`} />
              </div>
              <span>{copied ? 'Shareable Link Copied to Clipboard!' : 'Copy Shareable Link'}</span>
            </button>

            <p className="text-[11px] text-slate-500">
              Share this link in Telegram chats, channels, or pin it to your bot's profile.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
