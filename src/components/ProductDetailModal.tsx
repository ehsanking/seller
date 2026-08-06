import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  Edit, 
  Globe, 
  Package, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Download, 
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Boxes
} from 'lucide-react';
import { Product, ProductStatus } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onOpenSeo: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onOpenSeo
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);
  const cost = product.costPrice || 0;
  const profit = product.price - cost;
  const marginPercent = product.price > 0 ? ((profit / product.price) * 100).toFixed(1) : '0.0';
  const totalRevenue = product.price * product.salesCount;
  const threshold = product.lowStockThreshold ?? 10;
  const isLowStock = product.stockQuantity <= threshold;

  const getStatusBadge = (status: ProductStatus, stock: number) => {
    if (stock <= 0 || status === 'out_of_stock') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Out of Stock
        </span>
      );
    }
    if (status === 'draft') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          Draft
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Catalog
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">{product.sku}</span>
                <span className="text-[10px] uppercase font-extrabold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {product.category}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white line-clamp-1">{product.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Visuals & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gallery Viewer */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-2xs group">
                <img
                  src={activeImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(product.status, product.stockQuantity)}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Financial & Inventory Key Cards */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Selling Price</span>
                  <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Cost Price</span>
                  <span className="text-xl font-bold text-slate-700">${cost.toFixed(2)}</span>
                </div>
              </div>

              {/* Profit Margin Analysis */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Gross Profit Margin
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">+{marginPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-800">
                  <span>Profit Per Unit:</span>
                  <span className="font-bold font-mono">${profit.toFixed(2)}</span>
                </div>
              </div>

              {/* Inventory & Sales */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-xl border ${isLowStock ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200/80'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Stock Units</span>
                    {isLowStock && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <span className={`text-lg font-black ${isLowStock ? 'text-rose-700' : 'text-slate-900'}`}>
                    {product.stockQuantity} <span className="text-xs font-normal text-slate-500">in stock</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Low Limit: {threshold} units</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Revenue</span>
                  <span className="text-lg font-black text-indigo-600 block">${totalRevenue.toFixed(2)}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{product.salesCount} total sales</p>
                </div>
              </div>

              {/* Type & Downloadable Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.productType === 'variable' ? (
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Boxes className="w-3.5 h-3.5" /> Variable Product
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Simple Product
                  </span>
                )}

                {product.isDownloadable && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Digital Download
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description & Specification */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" /> Overview & Specifications
            </h4>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              {product.description || 'No detailed description specified for this product.'}
            </div>
          </div>

          {/* Hashtags & Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags & Classifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variations Table (if variable) */}
          {product.productType === 'variable' && product.variations && product.variations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" /> Variations ({product.variations.length})
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.variations.map((v) => (
                      <tr key={v.id}>
                        <td className="p-2.5 font-bold text-slate-800">{v.name}</td>
                        <td className="p-2.5 font-mono text-slate-500">{v.sku}</td>
                        <td className="p-2.5 font-extrabold text-slate-900">${v.price.toFixed(2)}</td>
                        <td className="p-2.5">{v.stockQuantity} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEO Metadata Card */}
          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" /> Search Engine Optimization (SEO)
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenSeo(product);
                }}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Configure SEO Meta →
              </button>
            </div>
            <p className="text-xs text-indigo-300 font-semibold truncate">
              {product.metaTitle || product.title}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              {product.metaDescription || product.description || 'No meta description set.'}
            </p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Created: {product.createdAt}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSeo(product);
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>SEO Optimizer</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Product</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
