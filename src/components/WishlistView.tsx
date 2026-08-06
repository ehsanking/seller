import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Search, 
  Trash2, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Package, 
  Share2, 
  Download, 
  Filter, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onViewProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter products in wishlist
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  // Filter by search & category
  const filteredProducts = wishlistedProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(wishlistedProducts.map(p => p.category)));

  const totalValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);
  const avgValue = wishlistedProducts.length ? totalValue / wishlistedProducts.length : 0;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleClearWishlist = () => {
    wishlistedProducts.forEach(p => onToggleWishlist(p.id));
    showToast('Wishlist cleared successfully');
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'SKU', 'Category', 'Price', 'Stock Status'];
    const rows = wishlistedProducts.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.price.toFixed(2),
      p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wishlist_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wishlist exported as CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400" /> Customer Wishlist Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Saved Items & Favorites</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Manage saved customer products, export wishlist records, and synchronize favorite items across storefronts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {wishlistedProducts.length > 0 && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-indigo-400" /> Export CSV
                </button>

                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Clear Wishlist
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Saved Products</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">{wishlistedProducts.length} Items</span>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Filtered across catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Wishlist Total Value</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-indigo-600 font-mono">${totalValue.toFixed(2)}</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Combined price sum</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Item Price</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">${avgValue.toFixed(2)}</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with API
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search wishlist items by title, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:bg-white cursor-pointer"
          >
            <option value="all">All Categories ({wishlistedProducts.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No items found in Wishlist</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {wishlist.length === 0 
                ? 'Customers have not saved any items to their wishlist yet. Items saved on storefronts will automatically sync here.'
                : 'No items match your search filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const inStock = p.stockQuantity > 0;
            return (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 shadow-2xs hover:shadow-md transition relative group flex flex-col justify-between"
              >
                {/* Remove Heart Button */}
                <button
                  onClick={() => {
                    onToggleWishlist(p.id);
                    showToast(`Removed "${p.title}" from wishlist`);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 hover:text-rose-600 shadow-md transition z-10 cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div className="space-y-3">
                  <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <span className={`absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      inStock ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {inStock ? `In Stock (${p.stockQuantity})` : 'Out of Stock'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-0.5">
                      <span>{p.category}</span>
                      <span>SKU: {p.sku}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h3>
                    <p className="text-base font-black text-slate-900 font-mono mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {onViewProduct && (
                    <button
                      onClick={() => onViewProduct(p)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="View Product Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (onAddToCart) onAddToCart(p);
                      showToast(`Added "${p.title}" to cart`);
                    }}
                    disabled={!inStock}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
                      inStock
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
