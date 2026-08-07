import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Copy, 
  Check, 
  Sliders, 
  LayoutGrid, 
  CheckSquare, 
  Layers, 
  Terminal, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Heart, 
  Eye, 
  ExternalLink,
  Bot,
  Zap,
  Shirt,
  Search,
  ShoppingCart
} from 'lucide-react';

export const DaisyUIShowcaseView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'actions' | 'data-display' | 'inputs' | 'navigation' | 'mockups'>('all');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [ratingVal, setRatingVal] = useState(4);
  const [progressVal, setProgressVal] = useState(70);
  const [toggleState, setToggleState] = useState(true);
  const [rangeVal, setRangeVal] = useState(65);
  const [currentTheme, setCurrentTheme] = useState('light');

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none flex items-center pr-8">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-purple-100 border border-white/20">
            <Zap className="w-3.5 h-3.5 text-amber-300" /> DaisyUI v5 Integrated Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            DaisyUI Component Architecture & UI Kit
          </h1>
          <p className="text-sm text-purple-100/90 leading-relaxed font-sans">
            Explore ready-to-use DaisyUI component classes seamlessly compiled into Seller Core’s Tailwind CSS v4 engine. Use these component primitives across your custom storefronts, invoices, page builder blocks, and admin vistas.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <a 
              href="https://daisyui.com/components/" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-sm btn-accent text-slate-900 font-bold gap-1.5 shadow-md hover:scale-105 transition"
            >
              <ExternalLink className="w-4 h-4" /> Official DaisyUI Docs
            </a>
            <span className="text-xs bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 font-mono">
              @plugin "daisyui"; active in src/index.css
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> All Components
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('actions')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'actions' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" /> Actions & Buttons
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('data-display')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'data-display' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Data Display & Badges
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('inputs')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'inputs' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Inputs & Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('navigation')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'navigation' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> Navigation & Steps
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('mockups')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'mockups' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" /> Mockups & Code
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-2">
          Click any <Copy className="w-3 h-3 inline text-slate-400" /> button to copy DaisyUI HTML snippet
        </div>
      </div>

      {/* COMPONENT GRID */}
      <div className="space-y-8">

        {/* 1. BUTTONS & ACTIONS */}
        {(activeCategory === 'all' || activeCategory === 'actions') && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" /> Buttons & Action Variants
                </h3>
                <p className="text-xs text-slate-500">DaisyUI button classes (`btn`, `btn-primary`, `btn-outline`, `btn-xs`, `btn-wide`)</p>
              </div>
              <button
                onClick={() => handleCopyCode(`<button className="btn btn-primary">Primary Action</button>`, 'btn-demo')}
                className="btn btn-xs btn-outline gap-1"
              >
                {copiedIndex === 'btn-demo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'btn-demo' ? 'Copied' : 'Copy Class'}</span>
              </button>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Button Colors</h4>
              <div className="flex flex-wrap gap-2.5 items-center">
                <button className="btn">Default</button>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-link">Link</button>
              </div>
            </div>

            {/* Styles & Sizes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-400">Outlines & Sizes</h4>
              <div className="flex flex-wrap gap-2.5 items-center">
                <button className="btn btn-outline btn-primary btn-xs">Extra Small</button>
                <button className="btn btn-outline btn-secondary btn-sm">Small</button>
                <button className="btn btn-outline btn-accent btn-md">Medium</button>
                <button className="btn btn-outline btn-info btn-lg">Large</button>
                <button className="btn btn-primary btn-wide btn-sm">Wide Button</button>
              </div>
            </div>

            {/* Joined Buttons Group */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-400">Join Button Groups (`join`)</h4>
              <div className="join">
                <button className="btn btn-sm join-item">Day</button>
                <button className="btn btn-sm btn-primary join-item">Week</button>
                <button className="btn btn-sm join-item">Month</button>
                <button className="btn btn-sm join-item">Year</button>
              </div>
            </div>
          </section>
        )}

        {/* 2. DATA DISPLAY: BADGES, STATS, CARDS, TIMELINE, CHAT */}
        {(activeCategory === 'all' || activeCategory === 'data-display') && (
          <section className="space-y-6">

            {/* Badges & Indicators */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" /> Badges & Status Indicators
                </h3>
                <span className="text-xs text-slate-400 font-mono">.badge .badge-primary</span>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="badge">Default</div>
                <div className="badge badge-primary">Primary</div>
                <div className="badge badge-secondary">Secondary</div>
                <div className="badge badge-accent">Accent</div>
                <div className="badge badge-ghost">Ghost</div>
                <div className="badge badge-info gap-1"><Sparkles className="w-3 h-3" /> Info Badge</div>
                <div className="badge badge-success font-bold">Active Order</div>
                <div className="badge badge-warning">Pending Sync</div>
                <div className="badge badge-error">Failed Webhook</div>
                <div className="badge badge-outline badge-primary">Outline</div>
              </div>
            </div>

            {/* Stats Component */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> DaisyUI Stats Panel (`stats`)
                </h3>
                <button
                  onClick={() => handleCopyCode(`<div className="stats shadow bg-base-100"><div className="stat"><div className="stat-title font-bold">Total Sales</div><div className="stat-value text-indigo-600">$89,400</div></div></div>`, 'stat-copy')}
                  className="btn btn-xs btn-ghost gap-1"
                >
                  {copiedIndex === 'stat-copy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Stat Code</span>
                </button>
              </div>

              <div className="stats stats-vertical sm:stats-horizontal shadow-sm border border-slate-200 bg-slate-50 rounded-2xl w-full">
                <div className="stat">
                  <div className="stat-figure text-indigo-600">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div className="stat-title text-slate-500 font-medium">Monthly Revenue</div>
                  <div className="stat-value text-indigo-600 font-extrabold">$25,600</div>
                  <div className="stat-desc text-emerald-600 font-bold">↗︎ 21% (vs last month)</div>
                </div>

                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Heart className="w-8 h-8 text-rose-500" />
                  </div>
                  <div className="stat-title text-slate-500 font-medium">Customer Likes</div>
                  <div className="stat-value text-rose-600 font-extrabold">4,200</div>
                  <div className="stat-desc text-slate-400">↗︎ 180 new today</div>
                </div>

                <div className="stat">
                  <div className="stat-figure text-accent">
                    <div className="avatar online">
                      <div className="w-12 rounded-full ring ring-indigo-500 ring-offset-base-100 ring-offset-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
                      </div>
                    </div>
                  </div>
                  <div className="stat-title text-slate-500 font-medium">Store Operations</div>
                  <div className="stat-value text-emerald-700 font-extrabold">99.8%</div>
                  <div className="stat-desc text-emerald-600">All Nodes Operational</div>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
                <Shirt className="w-5 h-5 text-indigo-600" /> E-Commerce Cards (`card`)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Card */}
                <div className="card card-compact bg-base-100 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <figure className="h-48 overflow-hidden bg-slate-100 relative">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" alt="Watch" className="w-full h-full object-cover" />
                    <div className="badge badge-accent font-bold absolute top-3 right-3 shadow-xs">NEW ARRIVAL</div>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-slate-900 font-bold">Minimalist Analog Chronograph</h2>
                    <p className="text-xs text-slate-500">Premium stainless steel casing with genuine leather band.</p>
                    <div className="card-actions justify-between items-center pt-2">
                      <div className="text-lg font-bold text-indigo-600">$199.00</div>
                      <button className="btn btn-sm btn-primary gap-1">
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Overlay Card */}
                <div className="card bg-base-100 border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-xl ring ring-indigo-500">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Ehsan Developer</h4>
                      <p className="text-xs text-slate-400">Store Administrator</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "Seller Core powered by DaisyUI gives our e-commerce platform ultra-fast rendering with high aesthetic polish."
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="badge badge-success gap-1 font-bold">
                      <Check className="w-3 h-3" /> Verified Buyer
                    </span>
                    <span className="text-slate-400 font-mono">ID: #CUST-9921</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Timeline & Chat Bubbles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" /> Order Shipment Timeline (`timeline`)
                </h4>

                <ul className="timeline timeline-vertical text-xs">
                  <li>
                    <div className="timeline-start text-slate-400">10:00 AM</div>
                    <div className="timeline-middle text-emerald-600">
                      <Check className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" />
                    </div>
                    <div className="timeline-end timeline-box font-bold bg-slate-50 border-slate-200">
                      Order Received
                    </div>
                    <hr className="bg-emerald-500" />
                  </li>
                  <li>
                    <hr className="bg-emerald-500" />
                    <div className="timeline-start text-slate-400">10:30 AM</div>
                    <div className="timeline-middle text-emerald-600">
                      <Check className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" />
                    </div>
                    <div className="timeline-end timeline-box font-bold bg-slate-50 border-slate-200">
                      Payment Confirmed & Invoiced
                    </div>
                    <hr className="bg-indigo-500" />
                  </li>
                  <li>
                    <hr className="bg-indigo-500" />
                    <div className="timeline-start text-slate-400">11:15 AM</div>
                    <div className="timeline-middle text-indigo-600">
                      <Bot className="w-4 h-4 bg-indigo-100 rounded-full p-0.5" />
                    </div>
                    <div className="timeline-end timeline-box font-bold bg-indigo-50 text-indigo-900 border-indigo-200">
                      Dispatched with Courier Zone A
                    </div>
                  </li>
                </ul>
              </div>

              {/* Chat Bubbles */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" /> Customer Support Chat (`chat-bubble`)
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-8 rounded-full">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                      </div>
                    </div>
                    <div className="chat-header text-slate-400">
                      Sara <time className="text-[10px] opacity-50">12:45</time>
                    </div>
                    <div className="chat-bubble chat-bubble-primary text-white">
                      Hi Seller Support! Can I track my factor invoice status?
                    </div>
                  </div>

                  <div className="chat chat-end">
                    <div className="chat-image avatar">
                      <div className="w-8 rounded-full">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Support" />
                      </div>
                    </div>
                    <div className="chat-header text-slate-400">
                      Seller AI <time className="text-[10px] opacity-50">12:46</time>
                    </div>
                    <div className="chat-bubble chat-bubble-secondary text-white">
                      Hello Sara! Yes, your order #ORD-8812 has been packed and tracking code is live.
                    </div>
                    <div className="chat-footer opacity-50 text-[10px]">Delivered</div>
                  </div>
                </div>
              </div>

            </div>

          </section>
        )}

        {/* 3. INPUTS & CONTROLS */}
        {(activeCategory === 'all' || activeCategory === 'inputs') && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckSquare className="w-5 h-5 text-indigo-600" /> Inputs, Toggles & Range Selectors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              
              {/* Checkboxes & Radios */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase text-[10px]">Checkboxes & Radios</h4>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" defaultChecked className="checkbox checkbox-primary checkbox-sm" />
                    <span className="label-text text-xs font-semibold">Enable Automatic Tax Calculation</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" defaultChecked className="checkbox checkbox-accent checkbox-sm" />
                    <span className="label-text text-xs font-semibold">Sync Telegram Mini App Orders</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="radio" name="radio-1" className="radio radio-primary radio-sm" defaultChecked />
                    <span className="label-text text-xs font-medium">Flat Rate Shipping</span>
                  </label>
                </div>
              </div>

              {/* Toggles & Swatches */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase text-[10px]">Toggle Switches (`toggle`)</h4>
                <div className="form-control">
                  <label className="label cursor-pointer justify-between">
                    <span className="label-text text-xs font-semibold">WooCommerce Sync Engine</span>
                    <input 
                      type="checkbox" 
                      checked={toggleState} 
                      onChange={(e) => setToggleState(e.target.checked)} 
                      className="toggle toggle-accent toggle-sm" 
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-between">
                    <span className="label-text text-xs font-semibold">Sandbox Test Mode</span>
                    <input type="checkbox" defaultChecked className="toggle toggle-primary toggle-sm" />
                  </label>
                </div>
              </div>

              {/* Interactive Rating */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase text-[10px]">Interactive Rating (`rating`)</h4>
                <div className="flex items-center gap-2">
                  <div className="rating rating-md">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="rating-demo"
                        className="mask mask-star-2 bg-amber-400 cursor-pointer"
                        checked={ratingVal === star}
                        onChange={() => setRatingVal(star)}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">{ratingVal}.0 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500">DaisyUI star masks integrated into product review views.</p>
              </div>

              {/* Range Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 sm:col-span-2 lg:col-span-3">
                <div className="flex justify-between font-bold text-xs">
                  <span>Price Range Filter (`range`)</span>
                  <span className="text-indigo-600">${rangeVal}.00</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={rangeVal} 
                  onChange={(e) => setRangeVal(Number(e.target.value))} 
                  className="range range-primary range-xs" 
                />
              </div>

            </div>
          </section>
        )}

        {/* 4. NAVIGATION, STEPS & RADIAL PROGRESS */}
        {(activeCategory === 'all' || activeCategory === 'navigation') && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-5 h-5 text-indigo-600" /> Steps, Tabs & Radial Progress Indicators
            </h3>

            {/* Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Checkout Wizard Steps (`steps`)</h4>
              <ul className="steps steps-vertical sm:steps-horizontal w-full text-xs">
                <li className="step step-primary font-bold">Select Products</li>
                <li className="step step-primary font-bold">Billing & Tax</li>
                <li className="step step-primary font-bold">Shipping Zone</li>
                <li className="step font-bold">Factor Invoice</li>
              </ul>
            </div>

            {/* Radial Progress */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-8 items-center justify-around">
              <div className="text-center space-y-2">
                <div 
                  className="radial-progress text-indigo-600 font-extrabold" 
                  style={{ "--value": progressVal, "--size": "4.5rem" } as React.CSSProperties} 
                  role="progressbar"
                >
                  {progressVal}%
                </div>
                <div className="text-xs font-bold text-slate-700">Storage Usage</div>
              </div>

              <div className="text-center space-y-2">
                <div 
                  className="radial-progress text-emerald-600 font-extrabold" 
                  style={{ "--value": 92, "--size": "4.5rem" } as React.CSSProperties} 
                  role="progressbar"
                >
                  92%
                </div>
                <div className="text-xs font-bold text-slate-700">Order Fulfillment Rate</div>
              </div>

              <div className="text-center space-y-2">
                <div 
                  className="radial-progress text-rose-500 font-extrabold" 
                  style={{ "--value": 45, "--size": "4.5rem" } as React.CSSProperties} 
                  role="progressbar"
                >
                  45%
                </div>
                <div className="text-xs font-bold text-slate-700">Database Cache</div>
              </div>
            </div>
          </section>
        )}

        {/* 5. MOCKUPS & CODE DISPLAY */}
        {(activeCategory === 'all' || activeCategory === 'mockups') && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <Terminal className="w-5 h-5 text-indigo-600" /> Code & Window Mockups (`mockup-code`)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Code Mockup */}
              <div className="mockup-code bg-slate-900 text-emerald-400 text-xs shadow-lg">
                <pre data-prefix="$"><code>npm install daisyui</code></pre>
                <pre data-prefix=">" className="text-slate-400"><code>Installing daisyui v5 for Tailwind v4...</code></pre>
                <pre data-prefix="✔" className="text-emerald-400"><code>Updated @plugin "daisyui" in src/index.css</code></pre>
                <pre data-prefix="$"><code>curl -X GET /api/v3/products</code></pre>
                <pre data-prefix="{" className="text-amber-300"><code>"status": "success", "count": 24</code></pre>
              </div>

              {/* Window Mockup */}
              <div className="mockup-window border border-slate-200 bg-slate-100 shadow-md">
                <div className="bg-white p-4 flex justify-center items-center font-bold text-xs text-slate-700">
                  <span className="text-indigo-600">https://seller.core/app/daisyui-components</span>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
};
