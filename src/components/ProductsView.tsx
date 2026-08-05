import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Tag,
  DollarSign,
  Package,
  Layers,
  Download,
  CheckSquare,
  Square,
  AlertTriangle,
  Settings,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { ExportCsvModal } from './ExportCsvModal';
import { ProductSeoModal } from './ProductSeoModal';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (productData: Partial<Product>) => void;
  onUpdateProduct: (id: string, productData: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onBulkDeleteProducts?: (ids: string[]) => void;
  onBulkUpdateProducts?: (ids: string[], updates: Partial<Product>) => void;
  searchQuery: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBulkDeleteProducts,
  onBulkUpdateProducts,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ProductStatus | ''>('');
  const [isExportCsvOpen, setIsExportCsvOpen] = useState(false);
  const [seoProduct, setSeoProduct] = useState<Product | null>(null);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteBulkDelete = () => {
    if (!selectedIds.length) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      if (onBulkDeleteProducts) {
        onBulkDeleteProducts(selectedIds);
      } else {
        selectedIds.forEach(id => onDeleteProduct(id));
      }
      setSelectedIds([]);
    }
  };

  const handleExecuteBulkStatus = (status: ProductStatus) => {
    if (!selectedIds.length || !status) return;
    if (onBulkUpdateProducts) {
      onBulkUpdateProducts(selectedIds, { status });
    } else {
      selectedIds.forEach(id => onUpdateProduct(id, { status }));
    }
    setSelectedIds([]);
    setBulkStatus('');
  };

  const handleExportCsv = () => {
    const headers = ['SKU', 'Title', 'Category', 'Price', 'Cost Price', 'Stock Quantity', 'Low Stock Limit', 'Status', 'Sales Count', 'Created At'];
    const rows = filteredProducts.map(p => [
      p.sku,
      p.title,
      p.category,
      p.price.toFixed(2),
      p.costPrice ? p.costPrice.toFixed(2) : '0.00',
      p.stockQuantity,
      p.lowStockThreshold ?? 10,
      p.status,
      p.salesCount,
      p.createdAt
    ]);

    const escapeCsv = (val: string | number) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ProductStatus, stock: number, threshold: number = 10) => {
    if (stock <= 0 || status === 'out_of_stock') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Out of Stock
        </span>
      );
    }
    if (status === 'draft') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Draft
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Active
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {products.length} Products
          </div>

          <button
            onClick={() => setIsExportCsvOpen(true)}
            disabled={products.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="Download date-segmented CSV of products dataset"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Sticky Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-20 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-xl text-xs font-bold font-mono">
              {selectedIds.length} Products Selected
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Perform batch updates or removal</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => {
                const val = e.target.value as ProductStatus;
                setBulkStatus(val);
                if (val) handleExecuteBulkStatus(val);
              }}
              className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
            >
              <option value="">Bulk Status Change...</option>
              <option value="active">Set to Active</option>
              <option value="draft">Set to Draft</option>
              <option value="out_of_stock">Set to Out of Stock</option>
            </select>

            <button
              onClick={handleExecuteBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock & Low Limit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Sales</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No products matching your search or selected filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const threshold = p.lowStockThreshold ?? 10;
                  const isLowStock = p.stockQuantity <= threshold;
                  const isChecked = selectedIds.includes(p.id);

                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-slate-50/80 transition ${isChecked ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(p.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative group shrink-0">
                            <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg bg-slate-100 object-cover border border-slate-200" />
                            {p.gallery && p.gallery.length > 0 && (
                              <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md scale-90 border border-white" title={`${p.gallery.length} gallery images`}>
                                +{p.gallery.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                            <div className="flex flex-wrap gap-1 mt-1 max-w-[240px]">
                              {p.tags && p.tags.map((tag, idx) => (
                                <span key={idx} className="text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded">
                                  #{tag}
                                </span>
                              ))}
                              {(!p.tags || p.tags.length === 0) && (
                                <span className="text-[11px] text-slate-400">Added {p.createdAt}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">{p.sku}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={isLowStock ? 'text-rose-600 font-bold flex items-center gap-1' : 'text-slate-700'}>
                            {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            {p.stockQuantity} units
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200" title="Low stock threshold trigger">
                            Limit: {threshold}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(p.status, p.stockQuantity, threshold)}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{p.salesCount} sold</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSeoProduct(p)}
                            title="SEO Preview & Meta Title Optimizer"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            title="Edit Product & Low Stock Limit"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">Edit Product: {editingProduct.sku}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingProduct) {
                  onUpdateProduct(editingProduct.id, editingProduct);
                  setEditingProduct(null);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Premium specifications, features, and components info..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stockQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Main Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hashtags (Comma separated)</label>
                <input
                  type="text"
                  value={editingProduct.tags?.join(', ') || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    tags: e.target.value.split(',').map(t => t.trim().replace(/#/g, '')).filter(Boolean) 
                  })}
                  placeholder="e.g. NewArrival, TechGadget, Premium"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                />
              </div>

              {/* Per-Product Low Stock Limit Threshold */}
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 space-y-1">
                <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Product Low Stock Alert Threshold
                </label>
                <p className="text-[11px] text-amber-700">Triggers visual warning badges on Dashboard when inventory hits this limit</p>
                <input
                  type="number"
                  value={editingProduct.lowStockThreshold ?? 10}
                  onChange={(e) => setEditingProduct({ ...editingProduct, lowStockThreshold: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white font-mono font-bold focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as ProductStatus })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Date-Range Filter CSV Export Modal */}
      <ExportCsvModal
        isOpen={isExportCsvOpen}
        onClose={() => setIsExportCsvOpen(false)}
        title="Export Products Inventory CSV"
        items={products}
        getDate={(p) => p.createdAt}
        headers={['SKU', 'Title', 'Category', 'Price', 'Cost Price', 'Stock Quantity', 'Low Stock Limit', 'Status', 'Sales Count', 'Created At']}
        getRowData={(p) => [
          p.sku,
          p.title,
          p.category,
          p.price.toFixed(2),
          p.costPrice ? p.costPrice.toFixed(2) : '0.00',
          p.stockQuantity,
          p.lowStockThreshold ?? 10,
          p.status,
          p.salesCount,
          p.createdAt
        ]}
        filenamePrefix="products_catalog"
      />

      {/* Dedicated SEO Preview & Metadata Optimizer Modal */}
      <ProductSeoModal
        isOpen={!!seoProduct}
        onClose={() => setSeoProduct(null)}
        product={seoProduct}
        onSaveSeo={async (id, updates) => {
          onUpdateProduct(id, updates);
        }}
      />
    </div>
  );
};
