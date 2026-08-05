import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Package, 
  UploadCloud, 
  Trash2, 
  Hash, 
  Info, 
  Folder, 
  Flame, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductStatus } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Partial<Product>) => void;
}

const CATEGORY_PRESETS: Record<string, string[]> = {
  Electronics: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80'
  ],
  Audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=400&q=80'
  ],
  'Home Office': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  ],
  Gadgets: [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?auto=format&fit=crop&w=400&q=80'
  ]
};

const SUGGESTED_TAGS = [
  'NewArrival',
  'BestSeller',
  'EcoFriendly',
  'SpecialOffer',
  'Premium',
  'LimitedEdition',
  'TechGadget',
  'SmartHome'
];

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [description, setDescription] = useState('');

  // Image & Gallery states
  const [image, setImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Tags & Hashtags state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique SKU upon modal open
  useEffect(() => {
    if (isOpen) {
      setSku(`SLR-${Math.floor(1000 + Math.random() * 9000)}`);
      // Reset defaults
      setTitle('');
      setPrice('');
      setCostPrice('');
      setStockQuantity('');
      setLowStockThreshold('10');
      setStatus('active');
      setDescription('');
      setGallery([]);
      setTags([]);
      setImage(CATEGORY_PRESETS[category]?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80');
    }
  }, [isOpen]);

  // Sync main image preset when category changes
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const presets = CATEGORY_PRESETS[newCat];
    if (presets && presets.length > 0) {
      setImage(presets[0]);
    }
  };

  // Convert File upload to Base64 (Local rendering and persistence)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isGallery) {
          setGallery(prev => [...prev, base64String]);
        } else {
          setImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add custom URL to gallery
  const addGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      setGallery(prev => [...prev, galleryUrlInput.trim()]);
      setGalleryUrlInput('');
    }
  };

  // Add manual URL as main image
  const addMainImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  // Tag creation logic
  const handleAddTag = (tagStr: string) => {
    let clean = tagStr.trim().replace(/[^a-zA-Z0-9]/g, ''); // alphanumeric only
    if (clean) {
      // Ensure # is in front when displayed, but store cleanly
      if (!tags.includes(clean)) {
        setTags(prev => [...prev, clean]);
      }
    }
    setTagInput('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Pricing analysis
  const parsedPrice = parseFloat(price) || 0;
  const parsedCost = parseFloat(costPrice) || 0;
  const profit = parsedPrice - parsedCost;
  const marginPercentage = parsedPrice > 0 ? (profit / parsedPrice) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      title,
      sku,
      category,
      price: parsedPrice,
      costPrice: parsedCost,
      stockQuantity: parseInt(stockQuantity) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      status,
      image,
      gallery,
      tags,
      description
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-8 max-h-[90vh]"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-950 text-base leading-tight">Create Store Product</h3>
              <p className="text-[10px] font-semibold text-slate-400">Configure comprehensive catalog settings, media files and tag metadata</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Core Information */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              General Information
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Mechanical Keyboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about the product features, premium build, and materials..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">SKU (Unique Code) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Audio">Audio</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Home Office">Home Office</option>
                      <option value="Gadgets">Gadgets</option>
                    </select>
                    <Folder className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Media Management */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Product Imagery & Media Gallery
            </h4>

            {/* Main Cover Image */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
              <span className="block text-[11px] font-black text-slate-800">Primary Cover Photo</span>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Active Main Image Preview */}
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 relative group shadow-sm">
                  <img 
                    src={image} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-[9px] text-white font-bold tracking-wider">PRIMARY</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste main image URL or use presets below"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={addMainImageUrl}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Drag-Drop / Local file uploader */}
                  <div 
                    onClick={() => mainFileInputRef.current?.click()}
                    className="border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer hover:bg-white hover:border-indigo-500 transition group"
                  >
                    <input 
                      type="file" 
                      ref={mainFileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-500 group-hover:text-indigo-600 transition">
                      <UploadCloud className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Drag or click to upload local main image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-based presets */}
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested stock photo presets for {category}:</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PRESETS[category]?.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImage(url)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition relative ${image === url ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <img src={url} alt={`Preset ${index}`} className="w-full h-full object-cover" />
                      {image === url && (
                        <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Multi-images */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-black text-slate-800">Product Image Gallery</span>
                  <p className="text-[9px] text-slate-400 font-semibold">Add secondary views, specs, color schemes or detail shots</p>
                </div>
                <span className="text-[9px] font-extrabold bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {gallery.length} Images Added
                </span>
              </div>

              {/* Added Gallery Preview Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {gallery.map((url, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 relative group shadow-2xs">
                    <img src={url} alt={`Gallery view ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-rose-600/85 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Empty dashed box for uploading more */}
                <div 
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-white flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[8px] font-bold">Add Local</span>
                </div>
              </div>

              {/* Add Gallery URL Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste direct image URL to add to gallery"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
                />
                <button
                  type="button"
                  onClick={addGalleryUrl}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-4 py-1.5 rounded-xl transition"
                >
                  Add URL
                </button>
              </div>

              {/* Hidden file input for gallery */}
              <input 
                type="file" 
                ref={galleryFileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Pricing & Inventory */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              Financials & Inventory Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Financial Box */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <span className="block text-[11px] font-black text-slate-800">Pricing Strategy</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Retail Price ($) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 49.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Wholesale / Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 20.00"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden font-bold"
                    />
                  </div>

                  {/* Marginal profit estimator */}
                  {parsedPrice > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] leading-tight">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Markup Margin</span>
                        <span className={`font-black ${marginPercentage > 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {marginPercentage.toFixed(1)}% Margin
                        </span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Per-Unit Profit</span>
                        <span className="text-indigo-600 font-black flex items-center gap-0.5 justify-end">
                          <TrendingUp className="w-3.5 h-3.5" />
                          ${profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Management Box */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <span className="block text-[11px] font-black text-slate-800">Inventory Monitoring</span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Stock Units <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Low-Stock Alert Threshold</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden font-bold"
                    />
                  </div>

                  <div className="text-[10px] font-medium text-slate-400 leading-relaxed flex items-start gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Trigger real-time Slack/Webhook alerts and automated restock alerts when catalog stock dips below safety threshold.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Hashtags & SEO Tags */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              Hashtags & Categorization Metadata
            </h4>

            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
              <div>
                <label className="block text-[11px] font-black text-slate-800 mb-1">Hashtags / Tags</label>
                <p className="text-[9px] text-slate-400 font-semibold mb-2.5">Press Enter or comma to create a hashtag, or click preset tags below</p>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type tag (e.g. wireless) and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden font-semibold"
                    />
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-4 py-2 rounded-xl transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Render Tag Chips */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs transition"
                    >
                      <span>#{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(idx)}
                        className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestion tags */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Store Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => handleAddTag(suggested)}
                      className="text-[9px] font-bold bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-500 px-2.5 py-1 rounded-lg transition shadow-2xs"
                    >
                      +{suggested}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 5: Catalog Status */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-indigo-500" />
              Store Catalog Visibility
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="active">🟢 Active (Instantly published, live in storefront sandbox)</option>
                <option value="draft">🟡 Draft (Offline, edit and configure later)</option>
                <option value="out_of_stock">🔴 Out of Stock (Visible, catalog back-orders disabled)</option>
              </select>
            </div>
          </div>

        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/15 transition shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Publish Product</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
