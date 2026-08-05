const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
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
  type: 'announcement' | 'header' | 'hero' | 'categories' | 'products' | 'promo' | 'testimonials' | 'faq' | 'branches' | 'footer' | 'blog' | 'custom_page';
  props?: Record<string, any>;
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast('Added to cart');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const [sections, setSections] = useState<StoreSection[]>([
    { id: '1', name: 'Announcement Bar', type: 'announcement', enabled: true },
    { id: '2', name: 'Header & Navigation', type: 'header', enabled: true },
    { id: '3', name: 'Hero Banner', type: 'hero', enabled: true },
    { id: '4', name: 'Featured Categories', type: 'categories', enabled: true },
    { id: '5', name: 'Product Grid', type: 'products', enabled: true },
    { id: '6', name: 'Promotional Banner', type: 'promo', enabled: true },
    { id: '7', name: 'Testimonials', type: 'testimonials', enabled: true },
    { id: '8', name: 'FAQ', type: 'faq', enabled: true },
    { id: '9', name: 'Store Locations', type: 'branches', enabled: true },
    { id: '10', name: 'Blog Posts', type: 'blog', enabled: true },
    { id: '11', name: 'Custom Page', type: 'custom_page', enabled: true },
    { id: '12', name: 'Footer', type: 'footer', enabled: true },
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
          <div key={section.id} className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
            Free shipping on orders over $75. Use code EHSAN20 for 20% off!
          </div>
        );
      case 'header':
        return (
          <header key={section.id} className="sticky top-0 z-40 bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="font-black text-xl text-slate-900 tracking-tight">{template.name}</div>
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
                <button onClick={() => setSelectedCategory('all')} className="hover:text-indigo-600 transition">Shop All</button>
                <button onClick={() => setSelectedCategory('Electronics')} className="hover:text-indigo-600 transition">Electronics</button>
                <button onClick={() => setSelectedCategory('Fashion')} className="hover:text-indigo-600 transition">Fashion</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-indigo-600">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="text-slate-600 hover:text-indigo-600 relative">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </header>
        );
      case 'hero':
        return (
          <div key={section.id} className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">{template.name}</h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl">{template.description}</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg">
                Shop Collection
              </button>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home', 'Organic'].map(cat => (
                <div key={cat} onClick={() => setSelectedCategory(cat)} className="cursor-pointer group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <span className="font-bold text-lg z-10">{cat}</span>
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'products':
        const filtered = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border p-4 group hover:shadow-xl transition">
                  <div className="aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-2 truncate">{product.category}</p>
                  <div className="font-black text-lg">${product.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'promo':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-16">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 text-white text-center">
              <h2 className="text-4xl font-black mb-4">Summer Sale is Here</h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">Get up to 50% off on selected items. Limited time offer.</p>
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:shadow-lg transition">
                Claim Discount
              </button>
            </div>
          </div>
        );
      case 'testimonials':
        return (
          <div key={section.id} className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex gap-1 text-amber-400 mb-4">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-slate-600 italic mb-4">"Absolutely incredible quality and fast shipping. Highly recommend to everyone!"</p>
                    <div className="font-bold text-sm text-slate-900">- Customer {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div key={section.id} className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {q: "How fast is shipping?", a: "We typically process and ship orders within 24 hours."},
                {q: "Do you accept returns?", a: "Yes, we have a 30-day hassle-free return policy."},
                {q: "Is this secure?", a: "100% secure. We use industry-standard encryption for all transactions."}
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-white border rounded-2xl">
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
            <h2 className="text-2xl font-bold mb-8">Our Locations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-2xl flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Downtown HQ</h3>
                  <p className="text-slate-600 text-sm mb-2">123 Tech Avenue, Suite 100<br/>San Francisco, CA 94105</p>
                  <p className="text-indigo-600 text-sm font-medium flex items-center gap-1"><Phone className="w-4 h-4" /> (555) 123-4567</p>
                </div>
              </div>
              <div className="p-6 border rounded-2xl flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">East Coast Hub</h3>
                  <p className="text-slate-600 text-sm mb-2">456 Commerce Blvd<br/>New York, NY 10001</p>
                  <p className="text-indigo-600 text-sm font-medium flex items-center gap-1"><Phone className="w-4 h-4" /> (555) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Latest from the Blog</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-2xl bg-slate-200 mb-4 overflow-hidden">
                    <img src={"https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=400&h=300"} alt="Blog post" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition">How to optimize your workflow in 2026</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">Discover the top strategies for maintaining peak productivity and managing your tasks efficiently with the latest tools.</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'custom_page':
        return (
          <div key={section.id} className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-6">About Our Company</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We started with a simple mission: to provide the highest quality products with unmatched customer service. 
              Today, we serve thousands of happy customers globally, constantly innovating and improving our offerings.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center mt-12">
              <div>
                <div className="text-4xl font-black text-indigo-600 mb-2">10k+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Customers</div>
              </div>
              <div>
                <div className="text-4xl font-black text-indigo-600 mb-2">99%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-black text-indigo-600 mb-2">24/7</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <footer key={section.id} className="bg-slate-900 text-slate-400 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">All Products</a></li>
                  <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                  <li><a href="#" className="hover:text-white transition">Sale</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition">Shipping</a></li>
                  <li><a href="#" className="hover:text-white transition">Returns</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Newsletter</h4>
                <p className="text-sm mb-4">Subscribe for updates and exclusive offers.</p>
                <div className="flex">
                  <input type="email" placeholder="Email address" className="bg-slate-800 text-white px-4 py-2 rounded-l-lg w-full outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition">Join</button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row items-center justify-between">
              <p>© 2026 {template.name}. All rights reserved.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="opacity-50 hover:opacity-100 transition cursor-pointer">Terms</span>
                <span className="opacity-50 hover:opacity-100 transition cursor-pointer">Privacy</span>
              </div>
            </div>
          </footer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center">
      <div className={\`bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl shadow-2xl flex overflow-hidden \${device === 'mobile' ? 'max-w-[400px]' : ''}\`}>
        
        {/* Editor Sidebar */}
        <div className={\`w-80 border-r bg-slate-50 flex flex-col \${device === 'mobile' ? 'hidden' : 'flex'}\`}>
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Page Sections</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sections.map((section, index) => (
              <div key={section.id} className={\`p-3 bg-white border rounded-xl flex items-center justify-between group \${!section.enabled ? 'opacity-50' : ''}\`}>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className={\`w-5 h-5 rounded flex items-center justify-center border \${section.enabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}\`}
                  >
                    {section.enabled && <Check className="w-3 h-3" />}
                  </button>
                  <span className="text-sm font-medium text-slate-700">{section.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30">
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30">
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition">
              Publish Layout
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto bg-white relative font-sans">
          {device === 'mobile' && (
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-full shadow-lg">
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium animate-in slide-in-from-top-4">
              {toastMessage}
            </div>
          )}

          {/* Render Active Sections */}
          {sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* Slide-over Cart */}
        {isCartOpen && (
          <div className="absolute inset-0 z-[10000] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <div className="w-full max-w-sm bg-white h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-bold text-xl text-slate-900">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-500 mt-10">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                            onClick={() => {
                              if (item.quantity > 1) {
                                setCart(prev => prev.map(p => p.product.id === item.product.id ? { ...p, quantity: p.quantity - 1 } : p));
                              } else {
                                removeFromCart(item.product.id);
                              }
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                            onClick={() => setCart(prev => prev.map(p => p.product.id === item.product.id ? { ...p, quantity: p.quantity + 1 } : p))}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-slate-50">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">${cart.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-indigo-600 font-medium text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/StorefrontSandboxPreview.tsx', content);
