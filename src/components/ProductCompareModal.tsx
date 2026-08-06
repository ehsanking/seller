import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  DollarSign, 
  Package, 
  Layers, 
  TrendingUp, 
  Tag, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
  Sliders,
  Percent,
  Edit,
  Coins
} from 'lucide-react';
import { Product, ProductStatus } from '../types';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductAId?: string;
  initialProductBId?: string;
  onUpdateProduct: (id: string, productData: Partial<Product>) => void;
  onBulkUpdateProducts?: (ids: string[], updates: Partial<Product>) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductAId = '',
  initialProductBId = '',
  onUpdateProduct,
  onBulkUpdateProducts
}) => {
  const [productAId, setProductAId] = useState<string>('');
  const [productBId, setProductBId] = useState<string>('');
  const [searchQueryA, setSearchQueryA] = useState('');
  const [searchQueryB, setSearchQueryB] = useState('');
  const [isDropdownAOpen, setIsDropdownAOpen] = useState(false);
  const [isDropdownBOpen, setIsDropdownBOpen] = useState(false);

  // Bulk Edit States
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<string>('no_change');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [bulkStatus, setBulkStatus] = useState<ProductStatus | 'no_change'>('no_change');
  const [bulkPriceAdjustment, setBulkPriceAdjustment] = useState<string>('none');
  const [bulkPriceValue, setBulkPriceValue] = useState<string>('');
  const [bulkLowStockLimit, setBulkLowStockLimit] = useState<string>('');
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (initialProductAId) setProductAId(initialProductAId);
    if (initialProductBId) setProductBId(initialProductBId);
  }, [initialProductAId, initialProductBId, isOpen]);

  if (!isOpen) return null;

  const productA = products.find(p => p.id === productAId);
  const productB = products.find(p => p.id === productBId);

  // Unique categories for bulk selection
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Filter products for selections
  const filteredProductsA = products.filter(p => 
    p.title.toLowerCase().includes(searchQueryA.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQueryA.toLowerCase())
  );

  const filteredProductsB = products.filter(p => 
    p.title.toLowerCase().includes(searchQueryB.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQueryB.toLowerCase())
  );

  // Helper calculation for profit margins
  const calculateMargin = (product?: Product) => {
    if (!product || !product.costPrice || product.price === 0) return null;
    const profit = product.price - product.costPrice;
    const margin = (profit / product.price) * 100;
    return {
      profit,
      margin: margin.toFixed(1)
    };
  };

  const marginA = calculateMargin(productA);
  const marginB = calculateMargin(productB);

  // Comparisons
  const cheaperProduct = () => {
    if (!productA || !productB) return null;
    if (productA.price === productB.price) return 'equal';
    return productA.price < productB.price ? 'A' : 'B';
  };

  const higherStockProduct = () => {
    if (!productA || !productB) return null;
    if (productA.stockQuantity === productB.stockQuantity) return 'equal';
    return productA.stockQuantity > productB.stockQuantity ? 'A' : 'B';
  };

  const higherSalesProduct = () => {
    if (!productA || !productB) return null;
    if (productA.salesCount === productB.salesCount) return 'equal';
    return productA.salesCount > productB.salesCount ? 'A' : 'B';
  };

  const cheaper = cheaperProduct();
  const higherStock = higherStockProduct();
  const higherSales = higherSalesProduct();

  // Handle apply bulk edits
  const handleApplyBulkUpdates = () => {
    if (!productA || !productB) return;

    const updates: Partial<Product> = {};

    // 1. Category Update
    if (bulkCategory !== 'no_change') {
      if (bulkCategory === 'custom') {
        if (customCategory.trim()) {
          updates.category = customCategory.trim();
        }
      } else {
        updates.category = bulkCategory;
      }
    }

    // 2. Status Update
    if (bulkStatus !== 'no_change') {
      updates.status = bulkStatus;
    }

    // 3. Low Stock Limit Threshold Update
    if (bulkLowStockLimit !== '') {
      const val = Number(bulkLowStockLimit);
      if (!isNaN(val) && val >= 0) {
        updates.lowStockThreshold = val;
      }
    }

    // Helper to calculate price changes
    const applyPriceAdjustment = (currentPrice: number) => {
      const val = Number(bulkPriceValue);
      if (isNaN(val) || val <= 0) return currentPrice;

      let newPrice = currentPrice;
      if (bulkPriceAdjustment === 'increase_percent') {
        newPrice = currentPrice * (1 + val / 100);
      } else if (bulkPriceAdjustment === 'decrease_percent') {
        newPrice = currentPrice * (1 - val / 100);
      } else if (bulkPriceAdjustment === 'increase_fixed') {
        newPrice = currentPrice + val;
      } else if (bulkPriceAdjustment === 'decrease_fixed') {
        newPrice = currentPrice - val;
      }
      return Math.max(0.01, Number(newPrice.toFixed(2)));
    };

    const ids = [productA.id, productB.id];
    const hasPriceAdjustment = bulkPriceAdjustment !== 'none' && bulkPriceValue !== '';

    if (onBulkUpdateProducts && !hasPriceAdjustment) {
      // Use efficient standard bulk updates if there are no complex mathematical price transformations
      onBulkUpdateProducts(ids, updates);
    } else {
      // Perform individual calculated updates
      ids.forEach(id => {
        const prod = products.find(p => p.id === id);
        if (prod) {
          const prodUpdates = { ...updates };
          if (hasPriceAdjustment) {
            prodUpdates.price = applyPriceAdjustment(prod.price);
          }
          onUpdateProduct(id, prodUpdates);
        }
      });
    }

    setBulkSuccessMessage('Successfully applied bulk changes to both products!');
    setTimeout(() => {
      setBulkSuccessMessage('');
    }, 4000);

    // Reset settings
    setBulkCategory('no_change');
    setCustomCategory('');
    setBulkStatus('no_change');
    setBulkPriceAdjustment('none');
    setBulkPriceValue('');
    setBulkLowStockLimit('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 flex flex-col my-8 max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 rounded-t-2xl border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Side-by-Side Product Comparison</h3>
              <p className="text-xs text-slate-500 font-normal">Compare specifications, prices, variations, margins, and stock levels</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Product A Selector */}
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Product A</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownAOpen(!isDropdownAOpen)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-left text-xs font-semibold text-slate-800 flex justify-between items-center shadow-2xs transition"
                >
                  <span className="truncate">
                    {productA ? `[${productA.sku}] ${productA.title}` : 'Choose first product to compare...'}
                  </span>
                  <ArrowRightLeft className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>

                {isDropdownAOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Search by title or SKU..."
                      value={searchQueryA}
                      onChange={(e) => setSearchQueryA(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden"
                      autoFocus
                    />
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {filteredProductsA.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400 font-medium">No products found</div>
                      ) : (
                        filteredProductsA.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setProductAId(p.id);
                              setIsDropdownAOpen(false);
                              setSearchQueryA('');
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2.5 transition ${p.id === productAId ? 'bg-indigo-50/50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                          >
                            <img src={p.image} alt={p.title} className="w-7 h-7 rounded bg-slate-100 object-cover border border-slate-200 shrink-0" />
                            <div className="truncate">
                              <span className="font-mono text-[10px] text-slate-400 block">{p.sku}</span>
                              <span className="block truncate font-semibold">{p.title}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product B Selector */}
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Product B</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownBOpen(!isDropdownBOpen)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-left text-xs font-semibold text-slate-800 flex justify-between items-center shadow-2xs transition"
                >
                  <span className="truncate">
                    {productB ? `[${productB.sku}] ${productB.title}` : 'Choose second product to compare...'}
                  </span>
                  <ArrowRightLeft className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>

                {isDropdownBOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Search by title or SKU..."
                      value={searchQueryB}
                      onChange={(e) => setSearchQueryB(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden"
                      autoFocus
                    />
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {filteredProductsB.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400 font-medium">No products found</div>
                      ) : (
                        filteredProductsB.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setProductBId(p.id);
                              setIsDropdownBOpen(false);
                              setSearchQueryB('');
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2.5 transition ${p.id === productBId ? 'bg-indigo-50/50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                          >
                            <img src={p.image} alt={p.title} className="w-7 h-7 rounded bg-slate-100 object-cover border border-slate-200 shrink-0" />
                            <div className="truncate">
                              <span className="font-mono text-[10px] text-slate-400 block">{p.sku}</span>
                              <span className="block truncate font-semibold">{p.title}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Bulk Action Panel */}
          {productA && productB && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4 shadow-3xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-900">Bulk Edit Both Compared Products</h4>
                    <p className="text-[10px] text-slate-500 font-normal">Apply rapid modifications directly to both products simultaneously</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBulkEditOpen(!isBulkEditOpen)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-3xs hover:shadow-2xs transition cursor-pointer"
                  id="btn-toggle-compared-bulk-edit"
                >
                  <span>{isBulkEditOpen ? 'Hide Bulk Edit' : 'Perform Bulk Edit'}</span>
                </button>
              </div>

              {bulkSuccessMessage && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bulkSuccessMessage}</span>
                </div>
              )}

              {isBulkEditOpen && (
                <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-4.5 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Bulk Status Select */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Update Catalog Status</label>
                      <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                      >
                        <option value="no_change">Leave status unchanged</option>
                        <option value="active">Active Catalog</option>
                        <option value="draft">Draft Saved</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>

                    {/* Bulk Category Select */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Update Category</label>
                      <select
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                      >
                        <option value="no_change">Leave category unchanged</option>
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="custom">+ Create Custom Category...</option>
                      </select>
                      {bulkCategory === 'custom' && (
                        <input
                          type="text"
                          placeholder="Enter new category name..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="mt-1.5 w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-hidden"
                        />
                      )}
                    </div>

                    {/* Bulk Price Delta Adjustment */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price Adjustment</label>
                      <select
                        value={bulkPriceAdjustment}
                        onChange={(e) => setBulkPriceAdjustment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                      >
                        <option value="none">Leave prices unchanged</option>
                        <option value="increase_percent">Increase by Percent (%)</option>
                        <option value="decrease_percent">Decrease by Percent (%)</option>
                        <option value="increase_fixed">Flat Rate Increase ($)</option>
                        <option value="decrease_fixed">Flat Rate Decrease ($)</option>
                      </select>
                      {bulkPriceAdjustment !== 'none' && (
                        <div className="mt-1.5 relative rounded-lg shadow-3xs">
                          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            {bulkPriceAdjustment.includes('percent') ? (
                              <Percent className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <input
                            type="number"
                            step="any"
                            placeholder={bulkPriceAdjustment.includes('percent') ? 'e.g. 10' : 'e.g. 5.00'}
                            value={bulkPriceValue}
                            onChange={(e) => setBulkPriceValue(e.target.value)}
                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg text-xs font-bold text-slate-800 outline-hidden"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bulk Low Stock Limit Limit */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Low Stock Threshold</label>
                      <input
                        type="number"
                        placeholder="Leave unchanged"
                        value={bulkLowStockLimit}
                        onChange={(e) => setBulkLowStockLimit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBulkCategory('no_change');
                        setCustomCategory('');
                        setBulkStatus('no_change');
                        setBulkPriceAdjustment('none');
                        setBulkPriceValue('');
                        setBulkLowStockLimit('');
                        setIsBulkEditOpen(false);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBulkUpdates}
                      disabled={
                        bulkCategory === 'no_change' &&
                        bulkStatus === 'no_change' &&
                        bulkPriceAdjustment === 'none' &&
                        bulkLowStockLimit === ''
                      }
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                      id="btn-apply-compared-bulk-updates"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Apply Updates to Both</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comparison Panel */}
          {!productA || !productB ? (
            <div className="p-12 text-center bg-white border border-slate-200/60 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Scale className="w-12 h-12 text-slate-300 stroke-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">Select Two Products to Compare</p>
                <p className="text-[11px] text-slate-400 max-w-sm font-normal leading-relaxed">
                  Choose a product from each of the selectors above to inspect a detailed side-by-side spec comparison, live markup delta, stock warnings, and complex variables.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden divide-y divide-slate-100">
              
              {/* Product Visual Profile Header */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100 bg-slate-50/50">
                <div className="col-span-3 p-4 flex items-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Snapshot</span>
                </div>
                
                {/* Product A Thumbnail */}
                <div className="col-span-4.5 p-4 space-y-3">
                  <div className="flex gap-3">
                    <img src={productA.image} alt={productA.title} className="w-14 h-14 rounded-lg bg-slate-100 object-cover border border-slate-200 shrink-0" />
                    <div>
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 font-mono text-[10px] font-bold">
                        {productA.sku}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2 leading-tight">
                        {productA.title}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5 italic">{productA.category}</p>
                    </div>
                  </div>
                </div>

                {/* Product B Thumbnail */}
                <div className="col-span-4.5 p-4 space-y-3">
                  <div className="flex gap-3">
                    <img src={productB.image} alt={productB.title} className="w-14 h-14 rounded-lg bg-slate-100 object-cover border border-slate-200 shrink-0" />
                    <div>
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 font-mono text-[10px] font-bold">
                        {productB.sku}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2 leading-tight">
                        {productB.title}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5 italic">{productB.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Sale Price</span>
                </div>
                
                {/* Product A Price */}
                <div className="col-span-4.5 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">${productA.price.toFixed(2)}</span>
                    {cheaper === 'A' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                        Cheaper
                      </span>
                    )}
                    {cheaper === 'B' && (
                      <span className="text-[10px] text-slate-400">
                        (+${(productA.price - productB.price).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Product B Price */}
                <div className="col-span-4.5 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">${productB.price.toFixed(2)}</span>
                    {cheaper === 'B' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                        Cheaper
                      </span>
                    )}
                    {cheaper === 'A' && (
                      <span className="text-[10px] text-slate-400">
                        (+${(productB.price - productA.price).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cost Price & Estimated Markup Margin Row */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Cost & Margin</span>
                </div>
                
                {/* Product A Cost Price & Margin */}
                <div className="col-span-4.5 p-4">
                  {marginA ? (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-700 font-medium">
                        Cost: <span className="font-semibold text-slate-900">${productA.costPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                        Margin: {marginA.margin}% 
                        <span className="text-slate-400 font-normal">(${marginA.profit.toFixed(2)} profit)</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Cost price not defined</span>
                  )}
                </div>

                {/* Product B Cost Price & Margin */}
                <div className="col-span-4.5 p-4">
                  {marginB ? (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-700 font-medium">
                        Cost: <span className="font-semibold text-slate-900">${productB.costPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                        Margin: {marginB.margin}% 
                        <span className="text-slate-400 font-normal">(${marginB.profit.toFixed(2)} profit)</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Cost price not defined</span>
                  )}
                </div>
              </div>

              {/* Stock Level & Alert Limits Row */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Stock & Alerts</span>
                </div>
                
                {/* Product A Stock */}
                <div className="col-span-4.5 p-4">
                  {(() => {
                    const limit = productA.lowStockThreshold ?? 10;
                    const isLow = productA.stockQuantity <= limit;
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <span className={isLow ? 'text-rose-600' : 'text-slate-800'}>
                            {productA.stockQuantity} units
                          </span>
                          {higherStock === 'A' && (
                            <span className="px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">
                              More Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          {isLow ? (
                            <span className="text-rose-500 font-bold flex items-center gap-0.5">
                              <ShieldAlert className="w-3 h-3" /> Low Stock Warning
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">(Limit: {limit})</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Product B Stock */}
                <div className="col-span-4.5 p-4">
                  {(() => {
                    const limit = productB.lowStockThreshold ?? 10;
                    const isLow = productB.stockQuantity <= limit;
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <span className={isLow ? 'text-rose-600' : 'text-slate-800'}>
                            {productB.stockQuantity} units
                          </span>
                          {higherStock === 'B' && (
                            <span className="px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">
                              More Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          {isLow ? (
                            <span className="text-rose-500 font-bold flex items-center gap-0.5">
                              <ShieldAlert className="w-3 h-3" /> Low Stock Warning
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">(Limit: {limit})</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Product Type & Variations Detailed Spec */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Type & Variants</span>
                </div>
                
                {/* Product A Variations */}
                <div className="col-span-4.5 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {productA.productType || 'Simple'} Product
                    </span>
                    {productA.isDownloadable && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                        Digital
                      </span>
                    )}
                  </div>
                  {productA.variations && productA.variations.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Listed Variations ({productA.variations.length})</p>
                      <div className="max-h-24 overflow-y-auto border border-slate-100 rounded-lg p-1.5 bg-slate-50/50 space-y-1">
                        {productA.variations.map((v) => (
                          <div key={v.id} className="flex justify-between items-center text-[10px] text-slate-600 font-medium">
                            <span className="truncate max-w-[120px]" title={v.name}>{v.name}</span>
                            <span className="font-mono font-bold text-slate-900">${v.price.toFixed(2)}</span>
                            <span className="text-slate-400">({v.stockQuantity} left)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-normal block leading-relaxed">
                      No nested variations found. Selling purely as simple product stock items.
                    </span>
                  )}
                </div>

                {/* Product B Variations */}
                <div className="col-span-4.5 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {productB.productType || 'Simple'} Product
                    </span>
                    {productB.isDownloadable && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                        Digital
                      </span>
                    )}
                  </div>
                  {productB.variations && productB.variations.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Listed Variations ({productB.variations.length})</p>
                      <div className="max-h-24 overflow-y-auto border border-slate-100 rounded-lg p-1.5 bg-slate-50/50 space-y-1">
                        {productB.variations.map((v) => (
                          <div key={v.id} className="flex justify-between items-center text-[10px] text-slate-600 font-medium">
                            <span className="truncate max-w-[120px]" title={v.name}>{v.name}</span>
                            <span className="font-mono font-bold text-slate-900">${v.price.toFixed(2)}</span>
                            <span className="text-slate-400">({v.stockQuantity} left)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-normal block leading-relaxed">
                      No nested variations found. Selling purely as simple product stock items.
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Active State Row */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Catalog Status</span>
                </div>
                
                {/* Product A Status */}
                <div className="col-span-4.5 p-4 flex items-center gap-2">
                  {productA.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold uppercase">
                      Active Catalog
                    </span>
                  ) : productA.status === 'draft' ? (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold uppercase">
                      Draft Saved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-extrabold uppercase">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product B Status */}
                <div className="col-span-4.5 p-4 flex items-center gap-2">
                  {productB.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold uppercase">
                      Active Catalog
                    </span>
                  ) : productB.status === 'draft' ? (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold uppercase">
                      Draft Saved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-extrabold uppercase">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Sales Metrics Volume */}
              <div className="grid grid-cols-12 gap-0 divide-x divide-slate-100">
                <div className="col-span-3 p-4 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Total Sales Volume</span>
                </div>
                
                {/* Product A Sales Count */}
                <div className="col-span-4.5 p-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{productA.salesCount} units sold</span>
                    {higherSales === 'A' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        Top Seller
                      </span>
                    )}
                  </div>
                </div>

                {/* Product B Sales Count */}
                <div className="col-span-4.5 p-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{productB.salesCount} units sold</span>
                    {higherSales === 'B' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        Top Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3 rounded-b-2xl border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Comparisons are computed in-memory based on real-time cache inventory states.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
