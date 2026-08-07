import React, { useState, useEffect } from 'react';
import { Product, StoreTemplate, StoreSettings, Coupon } from '../types';
import { CustomerMyAccount } from './CustomerMyAccount';
import { 
  ShoppingBag, Search, X, Star, ShieldCheck, Truck, RefreshCw, 
  ChevronRight, Heart, User, Check, Plus, Minus, Tag, ArrowRight,
  Flame, Sparkles, SlidersHorizontal, Eye, Lock, CreditCard, CheckCircle2,
  Menu, Home, Layers, Settings2, MoveUp, MoveDown, MapPin, Phone, Send,
  Download, FileText, ArrowLeft, Building, AlertCircle, PackageCheck, Zap,
  CheckCircle, Globe, HelpCircle
} from 'lucide-react';

interface StorefrontSandboxPreviewProps {
  template: StoreTemplate;
  products: Product[];
  device: 'desktop' | 'mobile';
  onClose: () => void;
  settings?: StoreSettings;
  coupons?: Coupon[];
  onAddOrder?: (order: any) => void;
}

interface StoreSection {
  id: string;
  name: string;
  enabled: boolean;
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'branches' | 'blog' | 'custom_page' | 'my_account' | 'footer';
  props?: Record<string, any>;
}

export function StorefrontSandboxPreview({
  template,
  products,
  device,
  onClose,
  settings,
  coupons = [],
  onAddOrder
}: StorefrontSandboxPreviewProps) {
  const [currentView, setCurrentView] = useState<'storefront' | 'my_account'>('storefront');
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor?: string; selectedSize?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Quick Detail View Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [detailColor, setDetailColor] = useState<string>('Black');
  const [detailSize, setDetailSize] = useState<string>('Standard');
  const [detailQuantity, setDetailQuantity] = useState<number>(1);

  // Coupon / Discount State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'fixed' | 'free_shipping'; amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Multi-step Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderReceipt, setPlacedOrderReceipt] = useState<any | null>(null);

  // Customer Checkout Information
  const [customerInfo, setCustomerInfo] = useState({
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 382-9102',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    address: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Springfield',
    state: 'Oregon',
    zip: '97477',
    country: 'United States',
    billingSame: true
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'sepa' | 'cod' | 'apple_pay'>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    name: 'Sarah Jenkins',
    expiry: '12/28',
    cvc: '888'
  });
  const [termsAccepted, setTermsAccepted] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product, quantity = 1, color = 'Black', size = 'Standard') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size);
      if (existing) {
        return prev.map(item => (item.product.id === product.id && item.selectedColor === color && item.selectedSize === size) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    showToast(`Added ${quantity} x ${product.title} to cart`);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscountAmount = (cartSubtotal * appliedCoupon.amount) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      couponDiscountAmount = Math.min(cartSubtotal, appliedCoupon.amount);
    }
  }

  let baseShippingFee = 4.99;
  if (shippingMethod === 'pickup') {
    baseShippingFee = 0;
  } else if (shippingMethod === 'express') {
    baseShippingFee = 11.99;
  } else if (shippingMethod === 'standard') {
    if (cartSubtotal >= 75 || appliedCoupon?.type === 'free_shipping') {
      baseShippingFee = 0;
    }
  }

  const estimatedTax = Math.max(0, (cartSubtotal - couponDiscountAmount) * 0.19); // 19% VAT
  const grandTotal = Math.max(0, cartSubtotal - couponDiscountAmount + baseShippingFee + estimatedTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    // Check prop coupons first or fall back to standard built-in test coupons
    const matchProp = coupons.find(c => c.code.toUpperCase() === code && c.isActive);
    if (matchProp) {
      setAppliedCoupon({
        code: matchProp.code,
        type: matchProp.type === 'percentage' ? 'percent' : 'fixed',
        amount: matchProp.value
      });
      showToast(`Coupon ${matchProp.code} applied!`);
      setCouponInput('');
      return;
    }

    if (code === 'EHSAN20' || code === 'SAVE20') {
      setAppliedCoupon({ code: 'EHSAN20', type: 'percent', amount: 20 });
      showToast('20% Discount coupon applied!');
      setCouponInput('');
    } else if (code === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', type: 'free_shipping', amount: 0 });
      showToast('Free Express Shipping coupon applied!');
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
  };

  const handleFillDemoAddress = () => {
    setCustomerInfo({
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 382-9102',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      address: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Springfield',
      state: 'Oregon',
      zip: '97477',
      country: 'United States',
      billingSame: true
    });
    showToast('Demo customer details auto-filled');
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.address || !customerInfo.email) {
      showToast('Please fill in all required customer contact details');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const newOrderNumber = `SELLER-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderNumber: newOrderNumber,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: cart.map(i => ({
          productId: i.product.id,
          productTitle: i.product.title,
          quantity: i.quantity,
          price: i.product.price,
          sku: i.product.sku || 'SKU-STORE',
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize
        })),
        totalAmount: grandTotal,
        subtotal: cartSubtotal,
        discountAmount: couponDiscountAmount,
        shippingFee: baseShippingFee,
        taxAmount: estimatedTax,
        status: 'processing' as const,
        paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card (Stripe)' :
                       paymentMethod === 'paypal' ? 'PayPal Express' :
                       paymentMethod === 'sepa' ? 'SEPA Direct Debit' :
                       paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Apple Pay',
        shippingAddress: `${customerInfo.address}, ${customerInfo.apartment ? customerInfo.apartment + ', ' : ''}${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}, ${customerInfo.country}`,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // POST order to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      let createdOrder = orderData;
      if (res.ok) {
        createdOrder = await res.json();
      }

      if (onAddOrder) {
        onAddOrder(createdOrder);
      }

      setPlacedOrderReceipt(createdOrder);
      setCart([]);
      setIsCheckoutOpen(false);
      showToast(`Order #${createdOrder.orderNumber} placed successfully!`);
    } catch (err) {
      console.error('Failed to submit checkout order', err);
      showToast('Order placement failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleDownloadFactorHTML = (order: any) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Invoice ${order.orderNumber}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 28px; font-weight: 900; color: #4f46e5; letter-spacing: -0.025em; }
    .invoice-title { font-size: 24px; font-weight: 800; text-align: right; color: #1e293b; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; font-size: 14px; }
    .meta-block h4 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .totals-table { width: 300px; margin-left: auto; margin-bottom: 32px; }
    .totals-table td { border: none; padding: 6px 0; }
    .totals-table .grand-total { font-size: 18px; font-weight: 800; color: #4f46e5; border-top: 2px solid #e2e8f0; padding-top: 12px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">${template.name || 'Seller Core Store'}</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Verified Merchant Order Receipt</div>
      </div>
      <div class="invoice-title">
        INVOICE
        <div style="font-size: 14px; color: #64748b; font-weight: 400; margin-top: 4px;">#${order.orderNumber}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-block">
        <h4>Customer & Delivery</h4>
        <strong>${order.customerName}</strong><br/>
        ${order.customerEmail}<br/>
        ${order.shippingAddress || 'Digital Fulfillment'}
      </div>
      <div class="meta-block" style="text-align: right;">
        <h4>Order Information</h4>
        <strong>Date:</strong> ${order.createdAt || new Date().toISOString().split('T')[0]}<br/>
        <strong>Payment Method:</strong> ${order.paymentMethod || 'Credit Card'}<br/>
        <strong>Status:</strong> ${order.status?.toUpperCase() || 'PAID'}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map((item: any) => `
          <tr>
            <td>
              <strong>${item.productTitle || 'Product'}</strong>
              ${item.selectedColor ? `<br/><span style="font-size: 12px; color: #64748b;">Color: ${item.selectedColor} | Size: ${item.selectedSize || 'Standard'}</span>` : ''}
            </td>
            <td>${item.quantity}</td>
            <td>$${(item.price || 0).toFixed(2)}</td>
            <td style="text-align: right;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <table class="totals-table">
      <tr>
        <td style="color: #64748b;">Subtotal:</td>
        <td style="text-align: right; font-weight: 600;">$${(order.subtotal || order.totalAmount).toFixed(2)}</td>
      </tr>
      ${order.discountAmount ? `
      <tr>
        <td style="color: #16a34a;">Coupon Discount:</td>
        <td style="text-align: right; font-weight: 600; color: #16a34a;">-$${order.discountAmount.toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td style="color: #64748b;">Shipping Fee:</td>
        <td style="text-align: right; font-weight: 600;">$${(order.shippingFee || 0).toFixed(2)}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Tax / VAT (19%):</td>
        <td style="text-align: right; font-weight: 600;">$${(order.taxAmount || 0).toFixed(2)}</td>
      </tr>
      <tr class="grand-total">
        <td>Grand Total:</td>
        <td style="text-align: right;">$${(order.totalAmount || 0).toFixed(2)}</td>
      </tr>
    </table>

    <div class="footer">
      Thank you for shopping with ${template.name}. If you have questions regarding this invoice, please contact support.
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Invoice-${order.orderNumber}.html downloaded!`);
  };

  const [sections, setSections] = useState<StoreSection[]>([
    { id: '1', name: 'Announcement Bar', type: 'announcement', enabled: true },
    { id: '2', name: 'Header & Navigation', type: 'header', enabled: true },
    { id: '3', name: 'Hero Banner', type: 'hero', enabled: true },
    { id: '4', name: 'Featured Categories', type: 'categories', enabled: true },
    { id: '5', name: 'Product Grid', type: 'products', enabled: true },
    { id: '6', name: 'Promotional Banner', type: 'promo', enabled: true },
    { id: '7', name: 'Customer My Account Portal', type: 'my_account', enabled: true },
    { id: '8', name: 'Testimonials', type: 'testimonials', enabled: true },
    { id: '9', name: 'FAQ', type: 'faq', enabled: true },
    { id: '10', name: 'Store Locations', type: 'branches', enabled: true },
    { id: '11', name: 'Blog Posts', type: 'blog', enabled: true },
    { id: '12', name: 'Custom Page', type: 'custom_page', enabled: true },
    { id: '13', name: 'Footer', type: 'footer', enabled: true },
  ]);

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

  const renderSection = (section: StoreSection, index: number) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'announcement':
        return (
          <div key={section.id} className="bg-indigo-600 text-white text-center py-2 px-4 text-xs md:text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Free Express Shipping on orders over $75. Use promo code <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold text-white">EHSAN20</code> for 20% off!</span>
          </div>
        );
      case 'header':
        return (
          <header key={section.id} className="sticky top-0 z-40 bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-6">
              <button onClick={() => setCurrentView('storefront')} className="font-black text-xl text-slate-900 tracking-tight text-left cursor-pointer">{template.name}</button>
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
                <button onClick={() => { setCurrentView('storefront'); setSelectedCategory('all'); }} className={`transition cursor-pointer ${currentView === 'storefront' && selectedCategory === 'all' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'}`}>Shop All</button>
                <button onClick={() => { setCurrentView('storefront'); setSelectedCategory('Electronics'); }} className={`transition cursor-pointer ${currentView === 'storefront' && selectedCategory === 'Electronics' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'}`}>Electronics</button>
                <button onClick={() => { setCurrentView('storefront'); setSelectedCategory('Fashion'); }} className={`transition cursor-pointer ${currentView === 'storefront' && selectedCategory === 'Fashion' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'}`}>Fashion</button>
                <button onClick={() => setCurrentView('my_account')} className={`transition cursor-pointer flex items-center gap-1 ${currentView === 'my_account' ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'}`}>
                  <User className="w-4 h-4" /> My Account
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView(currentView === 'my_account' ? 'storefront' : 'my_account')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200/80 cursor-pointer">
                <User className="w-4 h-4" />
                <span>{currentView === 'my_account' ? 'Back to Store' : 'My Account Portal'}</span>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="text-slate-600 hover:text-indigo-600 relative p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </header>
        );
      case 'hero':
        return (
          <div key={section.id} className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4 inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Express Checkout Enabled
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{template.name}</h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">{template.description}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => {
                    const el = document.getElementById('store-product-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-base transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" /> Explore Catalog
                </button>
                <button 
                  onClick={() => setCurrentView('my_account')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3.5 rounded-2xl font-bold text-base transition border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-5 h-5" /> Customer Account
                </button>
              </div>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home', 'Organic'].map(cat => (
                <div 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`cursor-pointer group relative aspect-[4/3] rounded-2xl overflow-hidden border p-6 flex flex-col justify-between transition duration-300 ${
                    selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 hover:bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                  <span className="font-black text-xl">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'products': {
        const filtered = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
        return (
          <div key={section.id} id="store-product-grid" className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
                <p className="text-xs text-slate-500 mt-1">Select a product to inspect details, choose options, or place a instant order.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Category:</span>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Organic">Organic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 group hover:shadow-xl hover:border-indigo-200 transition duration-300 flex flex-col justify-between">
                  <div>
                    <div className="aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden relative group">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        In Stock
                      </div>
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedDetailProduct(product);
                            setDetailQuantity(1);
                          }}
                          className="bg-white text-slate-900 p-2.5 rounded-full font-bold text-xs shadow-lg hover:bg-indigo-600 hover:text-white transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> Quick View
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] text-slate-400 font-medium ml-1">(4.9)</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{product.title}</h3>
                    <p className="text-xs text-slate-500 mb-3 truncate">{product.category}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-black text-lg text-slate-900">${product.price.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Free return</div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'promo':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 md:p-14 text-white text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
                  Exclusive Promotion
                </span>
                <h2 className="text-3xl md:text-5xl font-black">Summer Flash Sale</h2>
                <p className="text-indigo-100 text-sm md:text-base">
                  Get up to 20% off all items using code <strong className="text-white underline">EHSAN20</strong> at checkout. Includes express door-to-door delivery.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('store-product-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3.5 rounded-2xl font-black text-sm transition shadow-lg cursor-pointer"
                  >
                    Claim Discount Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'my_account':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2 text-center md:text-left">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Account Portal
                </span>
                <h2 className="text-2xl md:text-3xl font-black">My Account Dashboard for Customers</h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Order history tracking, factor invoice generator, saved delivery addresses, wishlist items, and customer profile management.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('my_account')}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <User className="w-4 h-4" /> Launch Customer Portal
              </button>
            </div>
          </div>
        );
      case 'testimonials':
        return (
          <div key={section.id} className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">What Our Buyers Say</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'David K.', text: 'Super fast shipping and top quality products. The checkout process was seamless!', role: 'Verified Buyer' },
                  { name: 'Elena R.', text: 'Loved the customer portal! Downloading factor invoices and tracking my order was so easy.', role: 'Gold Customer' },
                  { name: 'Marcus B.', text: 'Great selection and transparent shipping fees. Will definitely order again.', role: 'Verified Buyer' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <div className="flex gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 italic text-sm mb-4">"{item.text}"</p>
                    <div className="font-bold text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-indigo-600 font-medium">{item.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div key={section.id} className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {q: "How fast is shipping?", a: "We process orders within 24 hours. Standard shipping takes 3-5 days, Express takes 1-2 days."},
                {q: "Do you issue official tax invoices?", a: "Yes, every completed order generates an official HTML/PDF factor invoice downloadable directly from your My Account portal or order receipt screen."},
                {q: "Is payment processing secure?", a: "100% secure. We support Stripe Credit Cards, PayPal, SEPA Direct Debit, and Cash on Delivery with full SSL encryption."}
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'branches':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Our Retail Locations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-200 rounded-2xl bg-white flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1 text-slate-900">Main Flagship Hub</h3>
                  <p className="text-slate-600 text-sm mb-2">123 Tech Avenue, Suite 100<br/>San Francisco, CA 94105</p>
                  <p className="text-indigo-600 text-sm font-bold flex items-center gap-1"><Phone className="w-4 h-4" /> +1 (555) 123-4567</p>
                </div>
              </div>
              <div className="p-6 border border-slate-200 rounded-2xl bg-white flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1 text-slate-900">European Distribution Hub</h3>
                  <p className="text-slate-600 text-sm mb-2">Friedrichstraße 42<br/>10117 Berlin, Germany</p>
                  <p className="text-indigo-600 text-sm font-bold flex items-center gap-1"><Phone className="w-4 h-4" /> +49 (30) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <footer key={section.id} className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">All Products</a></li>
                  <li><a href="#" className="hover:text-white transition">Electronics</a></li>
                  <li><a href="#" className="hover:text-white transition">Fashion</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Customer Care</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => setCurrentView('my_account')} className="hover:text-white transition text-left cursor-pointer">Order Tracking</button></li>
                  <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Branches</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Newsletter</h4>
                <p className="text-xs mb-4">Subscribe to receive exclusive deals and instant promo codes.</p>
                <div className="flex">
                  <input type="email" placeholder="Email address" className="bg-slate-800 text-white px-3 py-2 text-xs rounded-l-lg w-full outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button className="bg-indigo-600 text-white px-3 py-2 text-xs rounded-r-lg font-bold hover:bg-indigo-700 transition cursor-pointer">Join</button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row items-center justify-between">
              <p>© 2026 {template.name}. All rights reserved.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0 text-slate-500">
                <span className="hover:text-slate-300 transition cursor-pointer">Terms of Service</span>
                <span className="hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
                <span className="hover:text-slate-300 transition cursor-pointer">Security</span>
              </div>
            </div>
          </footer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-2 md:p-6 flex items-center justify-center overflow-hidden">
      <div className={`bg-white w-full max-w-6xl h-full max-h-[92vh] rounded-3xl shadow-2xl flex overflow-hidden border border-slate-800/20 relative ${device === 'mobile' ? 'max-w-[420px]' : ''}`}>
        
        {/* Editor Sidebar */}
        <div className={`w-80 border-r bg-slate-50 flex flex-col ${device === 'mobile' ? 'hidden' : 'flex'}`}>
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Storefront Layout Editor</h3>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Visible Page Sections</div>
            {sections.map((section, index) => (
              <div key={section.id} className={`p-3 bg-white border rounded-xl flex items-center justify-between group transition ${!section.enabled ? 'opacity-50' : 'border-slate-200 hover:border-indigo-200'}`}>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${section.enabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}
                  >
                    {section.enabled && <Check className="w-3 h-3" />}
                  </button>
                  <span className="text-xs font-semibold text-slate-700">{section.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer">
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer">
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white space-y-2">
            <button 
              onClick={() => {
                showToast('Storefront layout settings published');
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
            >
              Publish Layout
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              <span>Test Checkout Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 overflow-y-auto bg-white relative font-sans flex flex-col">
          {device === 'mobile' && (
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-full shadow-lg">
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-4 right-4 z-[20000] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 animate-in slide-in-from-top-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* View Switcher: Storefront vs Customer My Account */}
          {currentView === 'my_account' ? (
            <CustomerMyAccount
              products={products}
              settings={settings}
              onBackToStore={() => setCurrentView('storefront')}
              onAddToCart={handleAddToCart}
            />
          ) : (
            sections.map((section, index) => renderSection(section, index))
          )}
        </div>

        {/* Slide-over Cart Drawer */}
        {isCartOpen && (
          <div className="absolute inset-0 z-[10000] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
            <div className="w-full max-w-md bg-white h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              <div className="p-5 border-b flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-lg">Your Shopping Cart</h3>
                  <span className="text-xs bg-indigo-500/30 px-2 py-0.5 rounded-full text-indigo-200 font-semibold">{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="p-3.5 bg-indigo-50 border-b border-indigo-100 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    {cartSubtotal >= 75 ? 'Free Express Shipping unlocked!' : `Add $${(75 - cartSubtotal).toFixed(2)} more for Free Shipping`}
                  </span>
                  <span>{Math.min(100, Math.round((cartSubtotal / 75) * 100))}%</span>
                </div>
                <div className="w-full bg-indigo-200/80 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 75) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-500 py-16 space-y-3">
                    <ShoppingBag className="w-16 h-16 mx-auto opacity-20 text-slate-400" />
                    <p className="font-medium text-sm">Your cart is currently empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="flex gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl relative group">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200">
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.product.title}</h4>
                            <button onClick={() => removeFromCart(idx)} className="text-slate-400 hover:text-rose-500 transition cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-500">${item.product.price.toFixed(2)} each</span>
                            {item.selectedColor && (
                              <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <button 
                              className="text-slate-500 hover:text-slate-900 cursor-pointer"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  setCart(prev => prev.map((p, i) => i === idx ? { ...p, quantity: p.quantity - 1 } : p));
                                } else {
                                  removeFromCart(idx);
                                }
                              }}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              className="text-slate-500 hover:text-slate-900 cursor-pointer"
                              onClick={() => setCart(prev => prev.map((p, i) => i === idx ? { ...p, quantity: p.quantity + 1 } : p))}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-black text-sm text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t bg-slate-50 space-y-4">
                  {/* Promo Code Input */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                        <span className="font-bold flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-emerald-600" /> Coupon '{appliedCoupon.code}' Applied!
                        </span>
                        <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Coupon Code (e.g. EHSAN20)"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono"
                        />
                        <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer">
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${couponDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-slate-900">{baseShippingFee === 0 ? 'FREE' : `$${baseShippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (19% VAT)</span>
                      <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                      <span>Estimated Total</span>
                      <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                      setCheckoutStep(1);
                    }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick View Product Detail Modal */}
        {selectedDetailProduct && (
          <div className="fixed inset-0 z-[20000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-200 space-y-6">
              <button 
                onClick={() => setSelectedDetailProduct(null)} 
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={selectedDetailProduct.image} alt={selectedDetailProduct.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      {selectedDetailProduct.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{selectedDetailProduct.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-black text-indigo-600">${selectedDetailProduct.price.toFixed(2)}</span>
                      <span className="text-xs text-slate-400 line-through">${(selectedDetailProduct.price * 1.25).toFixed(2)}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">In Stock</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {selectedDetailProduct.description || 'Premium build quality designed for daily reliability and seamless performance.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Color Variant</label>
                      <div className="flex gap-2">
                        {['Black', 'Silver', 'Midnight', 'Space Gray'].map(col => (
                          <button 
                            key={col}
                            onClick={() => setDetailColor(col)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${detailColor === col ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                      <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 w-fit">
                        <button onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))} className="text-slate-600 font-bold hover:text-slate-900 cursor-pointer">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">{detailQuantity}</span>
                        <button onClick={() => setDetailQuantity(detailQuantity + 1)} className="text-slate-600 font-bold hover:text-slate-900 cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => {
                          handleAddToCart(selectedDetailProduct, detailQuantity, detailColor, detailSize);
                          setSelectedDetailProduct(null);
                        }}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                      <button 
                        onClick={() => {
                          handleAddToCart(selectedDetailProduct, detailQuantity, detailColor, detailSize);
                          setSelectedDetailProduct(null);
                          setIsCheckoutOpen(true);
                        }}
                        className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-4 h-4 text-amber-400" /> Direct Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Step Customer Checkout Modal */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[25000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full h-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
              
              {/* Stepper Header */}
              <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-base">Secure Checkout</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Complete your purchase in 4 simple steps</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)} 
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="bg-slate-50 border-b border-slate-200 p-3 px-6 flex justify-between items-center text-xs font-bold">
                {[
                  { step: 1, label: '1. Contact & Address' },
                  { step: 2, label: '2. Shipping Speed' },
                  { step: 3, label: '3. Payment Method' },
                  { step: 4, label: '4. Review Order' }
                ].map(s => (
                  <div 
                    key={s.step} 
                    onClick={() => setCheckoutStep(s.step as any)}
                    className={`flex items-center gap-1.5 cursor-pointer ${
                      checkoutStep === s.step ? 'text-indigo-600 font-extrabold' : checkoutStep > s.step ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      checkoutStep === s.step ? 'bg-indigo-600 text-white' : checkoutStep > s.step ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {checkoutStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" /> Shipping & Delivery Address
                      </h4>
                      <button 
                        type="button" 
                        onClick={handleFillDemoAddress}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 cursor-pointer"
                      >
                        ⚡ Autofill Demo Address
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">First Name *</label>
                        <input 
                          type="text" 
                          value={customerInfo.firstName}
                          onChange={e => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Last Name *</label>
                        <input 
                          type="text" 
                          value={customerInfo.lastName}
                          onChange={e => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          value={customerInfo.email}
                          onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                        <input 
                          type="text" 
                          value={customerInfo.phone}
                          onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                        <input 
                          type="text" 
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Apartment / Suite</label>
                        <input 
                          type="text" 
                          value={customerInfo.apartment}
                          onChange={e => setCustomerInfo({ ...customerInfo, apartment: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                        <input 
                          type="text" 
                          value={customerInfo.city}
                          onChange={e => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Postal / ZIP Code *</label>
                        <input 
                          type="text" 
                          value={customerInfo.zip}
                          onChange={e => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Country *</label>
                        <select 
                          value={customerInfo.country}
                          onChange={e => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        >
                          <option value="United States">United States</option>
                          <option value="Germany">Germany</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="France">France</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Iran">Iran</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600" /> Select Shipping Carrier & Method
                    </h4>

                    <div className="space-y-3">
                      {[
                        { id: 'standard', name: 'Standard Carrier Ground Delivery', time: '3-5 Business Days', cost: baseShippingFee === 0 ? 'FREE' : '$4.99', desc: 'Reliable doorstep delivery with live tracking SMS' },
                        { id: 'express', name: 'DHL Priority Express Overnight', time: '1-2 Business Days', cost: '$11.99', desc: 'Priority air express delivery with signature confirmation' },
                        { id: 'pickup', name: 'In-Store Branch Pickup', time: 'Same Day Pickup', cost: 'FREE ($0.00)', desc: 'Pick up at any retail store location during open business hours' }
                      ].map(method => (
                        <div 
                          key={method.id}
                          onClick={() => setShippingMethod(method.id as any)}
                          className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition ${
                            shippingMethod === method.id ? 'bg-indigo-50/60 border-indigo-600 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="shipping" 
                              checked={shippingMethod === method.id}
                              onChange={() => setShippingMethod(method.id as any)}
                              className="accent-indigo-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900">{method.name}</div>
                              <div className="text-[11px] text-slate-500">{method.time} • {method.desc}</div>
                            </div>
                          </div>
                          <span className="font-black text-xs text-indigo-600">{method.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Options
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'credit_card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                        { id: 'paypal', label: 'PayPal', icon: <Globe className="w-4 h-4" /> },
                        { id: 'sepa', label: 'SEPA Bank', icon: <Building className="w-4 h-4" /> },
                        { id: 'cod', label: 'Cash on Delivery', icon: <Truck className="w-4 h-4" /> },
                        { id: 'apple_pay', label: 'Apple Pay', icon: <Zap className="w-4 h-4" /> }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentMethod(p.id as any)}
                          className={`p-3 border rounded-xl flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                            paymentMethod === p.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.icon}
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'credit_card' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                          <span>Stripe Test Gateway (Simulated)</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">256-bit SSL Encrypted</span>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                            <input 
                              type="text" 
                              placeholder="CVC"
                              value={cardDetails.cvc}
                              onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {checkoutStep === 4 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Review & Confirm Order
                    </h4>

                    {/* Customer Summary Card */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-slate-900 block mb-1">Customer & Shipping:</strong>
                        <p className="text-slate-600">{customerInfo.firstName} {customerInfo.lastName}</p>
                        <p className="text-slate-600">{customerInfo.address}, {customerInfo.city}, {customerInfo.country}</p>
                        <p className="text-slate-600">{customerInfo.email} • {customerInfo.phone}</p>
                      </div>
                      <div>
                        <strong className="text-slate-900 block mb-1">Payment & Shipping Method:</strong>
                        <p className="text-slate-600">Method: {paymentMethod.toUpperCase()}</p>
                        <p className="text-slate-600">Carrier: {shippingMethod.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="border border-slate-200 rounded-2xl divide-y overflow-hidden text-xs">
                      {cart.map((i, idx) => (
                        <div key={idx} className="p-3 flex justify-between items-center bg-white">
                          <div className="flex items-center gap-3">
                            <img src={i.product.image} alt={i.product.title} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{i.product.title}</div>
                              <div className="text-[11px] text-slate-500">Qty: {i.quantity} x ${i.product.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">${(i.product.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Coupon Discount:</span>
                          <span>-${couponDiscountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping Fee:</span>
                        <span className="font-semibold">${baseShippingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax (19% VAT):</span>
                        <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-slate-900 border-t border-indigo-200/80 pt-2">
                        <span>Grand Total Due:</span>
                        <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={e => setTermsAccepted(e.target.checked)}
                        className="accent-indigo-600"
                      />
                      <span>I agree to the Terms of Service & Store Return Policy</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Stepper Footer Controls */}
              <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
                {checkoutStep > 1 ? (
                  <button 
                    onClick={() => setCheckoutStep((checkoutStep - 1) as any)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition cursor-pointer"
                  >
                    Back
                  </button>
                ) : <div />}

                {checkoutStep < 4 ? (
                  <button 
                    onClick={() => setCheckoutStep((checkoutStep + 1) as any)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Continue Step {checkoutStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !termsAccepted}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition cursor-pointer flex items-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Place Order & Pay (${grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmation Receipt Modal */}
        {placedOrderReceipt && (
          <div className="fixed inset-0 z-[30000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed!
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Thank You for Your Order</h3>
                <p className="text-xs text-slate-500 mt-1">Order confirmation email dispatched to <strong>{placedOrderReceipt.customerEmail}</strong></p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Order Reference:</span>
                  <strong className="text-indigo-600 font-mono">{placedOrderReceipt.orderNumber}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Amount Paid:</span>
                  <strong className="text-slate-900">${placedOrderReceipt.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <strong className="text-slate-900">{placedOrderReceipt.paymentMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[220px]">{placedOrderReceipt.shippingAddress}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => handleDownloadFactorHTML(placedOrderReceipt)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Factor Invoice</span>
                </button>
                <button 
                  onClick={() => {
                    setPlacedOrderReceipt(null);
                    setCurrentView('my_account');
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Track in My Account</span>
                </button>
              </div>

              <button 
                onClick={() => setPlacedOrderReceipt(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 block mx-auto cursor-pointer"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
