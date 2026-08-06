import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  LogOut, 
  Star, 
  FileText, 
  Eye, 
  Download, 
  Check, 
  Sparkles,
  CreditCard,
  Building,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Product, Order, StoreSettings } from '../types';

interface CustomerMyAccountProps {
  products: Product[];
  settings?: StoreSettings;
  onBackToStore: () => void;
  onAddToCart?: (product: Product) => void;
}

interface SavedAddress {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export const CustomerMyAccount: React.FC<CustomerMyAccountProps> = ({
  products,
  settings,
  onBackToStore,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings'>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sample Customer Profile State
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 382-9102',
    company: 'Apex Design Co.',
    memberSince: 'March 2024',
    tier: 'Gold Member',
    points: 750,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  });

  // Sample Order History for Customer
  const [customerOrders, setCustomerOrders] = useState<Order[]>([
    {
      id: 'ord-1001',
      orderNumber: 'SELLER-9841',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.jenkins@example.com',
      items: [
        { productId: 'p1', productTitle: 'Pro Ergonomic Keypad RGB', quantity: 1, price: 129.99, sku: 'KEY-PRO-01' },
        { productId: 'p2', productTitle: 'Precision Optical Gaming Mouse', quantity: 1, price: 69.50, sku: 'MSE-OPT-02' }
      ],
      totalAmount: 199.49,
      status: 'delivered',
      paymentMethod: 'Credit Card (Stripe)',
      shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
      createdAt: '2026-07-28'
    },
    {
      id: 'ord-1002',
      orderNumber: 'SELLER-9810',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.jenkins@example.com',
      items: [
        { productId: 'p3', productTitle: 'Ultra-Wide Desk Mat Minimalist', quantity: 2, price: 29.99, sku: 'MAT-MIN-03' }
      ],
      totalAmount: 59.98,
      status: 'shipped',
      paymentMethod: 'PayPal',
      shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
      createdAt: '2026-08-02'
    },
    {
      id: 'ord-1003',
      orderNumber: 'SELLER-9795',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.jenkins@example.com',
      items: [
        { productId: 'p4', productTitle: 'Studio Aluminum Monitor Stand', quantity: 1, price: 89.00, sku: 'STND-ALU-04' }
      ],
      totalAmount: 89.00,
      status: 'processing',
      paymentMethod: 'Credit Card',
      shippingAddress: '100 Tech Blvd, Suite 400, San Jose, CA 95110',
      createdAt: '2026-08-05'
    }
  ]);

  // Saved Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      type: 'shipping',
      isDefault: true,
      recipientName: 'Sarah Jenkins',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
      country: 'United States',
      phone: '+1 (555) 382-9102'
    },
    {
      id: 'addr-2',
      type: 'billing',
      isDefault: false,
      recipientName: 'Apex Design Co. (Attn: Sarah)',
      street: '100 Tech Blvd, Suite 400',
      city: 'San Jose',
      state: 'CA',
      zip: '95110',
      country: 'United States',
      phone: '+1 (555) 990-1234'
    }
  ]);

  // Wishlist Items
  const [wishlist, setWishlist] = useState<Product[]>(products.slice(0, 3));

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<SavedAddress>>({
    type: 'shipping',
    isDefault: false,
    recipientName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: ''
  });

  // Invoice Preview Modal
  const [viewingOrderInvoice, setViewingOrderInvoice] = useState<Order | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress.street || !editingAddress.city) {
      showToast('Please fill in street and city');
      return;
    }

    if (editingAddress.id) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, ...editingAddress } as SavedAddress : a));
      showToast('Address updated successfully');
    } else {
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        type: editingAddress.type || 'shipping',
        isDefault: addresses.length === 0 || !!editingAddress.isDefault,
        recipientName: editingAddress.recipientName || profile.name,
        street: editingAddress.street || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        zip: editingAddress.zip || '',
        country: editingAddress.country || 'United States',
        phone: editingAddress.phone || profile.phone
      };
      setAddresses(prev => [...prev, newAddr]);
      showToast('New address added');
    }
    setIsAddressModalOpen(false);
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from wishlist');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <span className="text-slate-600 text-sm hidden sm:inline">|</span>
          <span className="text-xs font-bold text-slate-300 hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Customer Account Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden md:inline">Logged in as <strong>{profile.email}</strong></span>
          <button
            onClick={onBackToStore}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 space-y-6">
        
        {/* Customer Profile Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 text-white rounded-lg shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">{profile.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {profile.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {profile.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {profile.phone}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Customer since {profile.memberSince}</p>
              </div>
            </div>

            {/* Loyalty Points Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-start md:self-auto">
              <div className="p-3 bg-amber-400/20 text-amber-400 rounded-xl border border-amber-400/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Loyalty Rewards</span>
                <span className="text-xl font-black text-amber-300 font-mono">{profile.points} <span className="text-xs font-normal text-slate-300">Pts</span></span>
                <span className="text-[10px] text-slate-300 block">Redeemable for discounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Order History ({customerOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" /> Settings & Security
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Orders</span>
                <span className="text-2xl font-black text-slate-900 block font-mono">{customerOrders.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All fulfilled & active
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Spent</span>
                <span className="text-2xl font-black text-indigo-600 block font-mono">
                  ${customerOrders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-500">Across 3 recent purchases</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Wishlist Saved</span>
                <span className="text-2xl font-black text-slate-900 block font-mono">{wishlist.length} Items</span>
                <button onClick={() => setActiveTab('wishlist')} className="text-[11px] text-indigo-600 font-bold hover:underline">
                  View saved items →
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Default Shipping</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                  {addresses.find(a => a.isDefault)?.street || '742 Evergreen Terrace'}
                </span>
                <button onClick={() => setActiveTab('addresses')} className="text-[11px] text-indigo-600 font-bold hover:underline">
                  Manage addresses →
                </button>
              </div>
            </div>

            {/* Recent Orders Spotlight */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recent Order Status</h3>
                  <p className="text-xs text-slate-500">Track your recent shipments and purchase invoices</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                >
                  View All Orders ({customerOrders.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {customerOrders.map(ord => (
                  <div key={ord.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">#{ord.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          ord.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Placed on {ord.createdAt} • {ord.items.length} Item(s) • Total: <strong>${ord.totalAmount.toFixed(2)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingOrderInvoice(ord)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Invoice Factor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Full Order History</h3>
                <p className="text-xs text-slate-500">Review all your completed and pending transactions</p>
              </div>
            </div>

            <div className="space-y-4">
              {customerOrders.map(ord => (
                <div key={ord.id} className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4">
                  
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-base">#{ord.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          ord.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Purchased on {ord.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
                        <span className="text-lg font-black text-slate-900 font-mono">${ord.totalAmount.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setViewingOrderInvoice(ord)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Ordered Items:</span>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-indigo-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">{item.productTitle}</p>
                              <span className="text-[10px] font-mono text-slate-400">SKU: {item.sku || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500">{item.quantity} x ${item.price.toFixed(2)} = </span>
                            <strong className="text-slate-900 font-mono font-bold"> ${(item.quantity * item.price).toFixed(2)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                    <span>Payment: <strong className="text-slate-700">{ord.paymentMethod}</strong></span>
                    <span>Shipping Address: <strong className="text-slate-700">{ord.shippingAddress}</strong></span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Saved Addresses</h3>
                <p className="text-xs text-slate-500">Manage your default shipping and billing destinations</p>
              </div>

              <button
                onClick={() => {
                  setEditingAddress({
                    type: 'shipping',
                    isDefault: false,
                    recipientName: profile.name,
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: 'United States',
                    phone: profile.phone
                  });
                  setIsAddressModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className={`p-5 rounded-2xl border relative space-y-3 ${addr.isDefault ? 'bg-indigo-50/40 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{addr.recipientName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        addr.type === 'shipping' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {addr.type}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.country}</p>
                    <p className="pt-1 text-slate-400">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsAddressModalOpen(true);
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => {
                        setAddresses(prev => prev.filter(a => a.id !== addr.id));
                        showToast('Address removed');
                      }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Saved Wishlist</h3>
              <p className="text-xs text-slate-500">Favorite products saved for future purchases</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Heart className="w-12 h-12 mx-auto text-slate-300 opacity-50" />
                <p className="font-bold text-slate-700">Your wishlist is currently empty.</p>
                <button onClick={onBackToStore} className="text-xs font-bold text-indigo-600 hover:underline">
                  Explore storefront products →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(p => (
                  <div key={p.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 relative group">
                    <button
                      onClick={() => handleRemoveWishlist(p.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-slate-400 hover:text-rose-500 shadow-2xs transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-square bg-white rounded-xl overflow-hidden border border-slate-200">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{p.category}</span>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</h4>
                      <p className="font-extrabold text-slate-900 font-mono text-sm mt-0.5">${p.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (onAddToCart) onAddToCart(p);
                        showToast(`Added ${p.title} to cart`);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: SETTINGS & SECURITY */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Account Settings & Password</h3>
              <p className="text-xs text-slate-500">Update your profile info, phone number, and security preferences</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">
              {editingAddress.id ? 'Edit Saved Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={editingAddress.recipientName || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, recipientName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  value={editingAddress.street || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editingAddress.city || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">State / Zip</label>
                  <input
                    type="text"
                    required
                    placeholder="OR 97477"
                    value={editingAddress.zip || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, zip: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Factor Preview Modal */}
      {viewingOrderInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Official Invoice</span>
                <h3 className="font-bold text-slate-900 text-sm">Order #{viewingOrderInvoice.orderNumber}</h3>
              </div>
              <button onClick={() => setViewingOrderInvoice(null)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <p><strong>Customer:</strong> {viewingOrderInvoice.customerName}</p>
              <p><strong>Email:</strong> {viewingOrderInvoice.customerEmail}</p>
              <p><strong>Payment:</strong> {viewingOrderInvoice.paymentMethod}</p>
              <p><strong>Address:</strong> {viewingOrderInvoice.shippingAddress}</p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700">Item Summary:</span>
              {viewingOrderInvoice.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                  <span>{item.quantity}x {item.productTitle}</span>
                  <span className="font-bold font-mono">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-sm text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-emerald-600">${viewingOrderInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Invoice PDF downloaded');
                setViewingOrderInvoice(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Factor PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
