import React, { useState, useEffect } from 'react';
import { ExportCsvModal } from './ExportCsvModal';
import { FactorCustomizerModal, DEFAULT_FACTOR_SETTINGS } from './FactorCustomizerModal';
import { openPdfReadyInvoicePrintWindow } from '../utils/pdfInvoice';
import { openFedexLabelPrintWindow } from '../utils/fedexLabel';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Eye, 
  X, 
  MapPin, 
  User, 
  CreditCard,
  Printer,
  Download,
  FileText,
  Trash2,
  CheckSquare,
  Receipt,
  Settings2
} from 'lucide-react';
import { Order, OrderStatus, FactorSettings } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onBulkDeleteOrders?: (ids: string[]) => void;
  onBulkUpdateOrderStatus?: (ids: string[], status: OrderStatus) => void;
  searchQuery: string;
  initialFactorSettings?: FactorSettings;
  onSaveFactorSettings?: (f: FactorSettings) => void;
}

const getStatusBadgeConfig = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/20 font-bold',
        dot: 'bg-emerald-500',
        label: 'Delivered',
      };
    case 'shipped':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-500/20 font-bold',
        dot: 'bg-blue-500',
        label: 'Shipped',
      };
    case 'processing':
      return {
        badge: 'bg-sky-50 text-sky-700 border-sky-200/80 ring-1 ring-sky-500/20 font-bold',
        dot: 'bg-sky-500 animate-pulse',
        label: 'Processing',
      };
    case 'pending':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200/80 ring-1 ring-amber-500/20 font-bold',
        dot: 'bg-amber-500',
        label: 'Pending',
      };
    case 'cancelled':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/20 font-bold',
        dot: 'bg-rose-500',
        label: 'Cancelled',
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
        dot: 'bg-slate-400',
        label: status,
      };
  }
};

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onBulkDeleteOrders,
  onBulkUpdateOrderStatus,
  searchQuery,
  initialFactorSettings,
  onSaveFactorSettings,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('');
  const [isExportCsvOpen, setIsExportCsvOpen] = useState(false);
  const [isFactorCustomizerOpen, setIsFactorCustomizerOpen] = useState(false);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const [factorSettings, setFactorSettings] = useState<FactorSettings>(() => {
    return initialFactorSettings || DEFAULT_FACTOR_SETTINGS;
  });

  const handleSaveFactor = (newSettings: FactorSettings) => {
    setFactorSettings(newSettings);
    onSaveFactorSettings?.(newSettings);
  };

  const [generatingLabelId, setGeneratingLabelId] = useState<string | null>(null);

  const handleGenerateFedexLabelForOrder = async (order: Order) => {
    try {
      setGeneratingLabelId(order.id);
      
      const res = await fetch('/api/plugins/fedex/generate-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.orderNumber,
          serviceType: 'FedEx Ground',
          weightKg: 2.5,
          recipientName: order.customerName,
          destinationAddress: order.shippingAddress,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate FedEx shipping label');
      }
      
      const data = await res.json();
      if (data.success) {
        openFedexLabelPrintWindow(order, data);
        onUpdateOrderStatus(order.id, 'shipped');
      }
    } catch (error) {
      console.error('Error generating FedEx label:', error);
      alert('Failed to generate FedEx shipping label. Please ensure the FedEx plugin is active and configured.');
    } finally {
      setGeneratingLabelId(null);
    }
  };

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const effectiveSearch = localSearchQuery.trim().toLowerCase();
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !effectiveSearch ||
                          o.orderNumber.toLowerCase().includes(effectiveSearch) ||
                          o.customerName.toLowerCase().includes(effectiveSearch) ||
                          o.customerEmail.toLowerCase().includes(effectiveSearch);
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const isAllSelected = filteredOrders.length > 0 && filteredOrders.every(o => selectedIds.includes(o.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
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
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected orders?`)) {
      if (onBulkDeleteOrders) {
        onBulkDeleteOrders(selectedIds);
      }
      setSelectedIds([]);
    }
  };

  const handleExecuteBulkStatus = (status: OrderStatus) => {
    if (!selectedIds.length || !status) return;
    if (onBulkUpdateOrderStatus) {
      onBulkUpdateOrderStatus(selectedIds, status);
    } else {
      selectedIds.forEach(id => onUpdateOrderStatus(id, status));
    }
    setSelectedIds([]);
    setBulkStatus('');
  };

  const handleExportCsv = () => {
    const headers = ['Order Number', 'Customer Name', 'Customer Email', 'Items Count', 'Total Amount ($)', 'Payment Method', 'Status', 'Shipping Address', 'Created At'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.customerName,
      o.customerEmail,
      o.items.reduce((acc, item) => acc + item.quantity, 0),
      o.totalAmount.toFixed(2),
      o.paymentMethod,
      o.status,
      o.shippingAddress,
      o.createdAt
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
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintOrder = (order: Order, type: 'invoice' | 'packing_slip' = 'invoice') => {
    openPdfReadyInvoicePrintWindow(order, factorSettings, type);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search by order #, customer name, or email..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={() => setLocalSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> Orders
            </div>

            <button
              type="button"
              onClick={() => setIsFactorCustomizerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer shrink-0"
              title="Customize commercial invoice layout and styling"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Customize Invoice</span>
            </button>

            <button
              onClick={() => setIsExportCsvOpen(true)}
              disabled={orders.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer shrink-0"
              title="Download date-segmented CSV of sales orders"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Filter Status:</span>
          {statuses.map((st) => {
            const isSelected = selectedStatus === st;
            const config = st !== 'all' ? getStatusBadgeConfig(st as OrderStatus) : null;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  isSelected
                    ? st === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : st === 'delivered'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : st === 'shipped'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : st === 'processing'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : st === 'pending'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {config && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : config.dot}`} />
                )}
                <span>{st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bulk Action Sticky Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-20 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-xl text-xs font-bold font-mono">
              {selectedIds.length} Orders Selected
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Perform batch status updates or deletion</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => {
                const val = e.target.value as OrderStatus;
                setBulkStatus(val);
                if (val) handleExecuteBulkStatus(val);
              }}
              className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
            >
              <option value="">Bulk Fulfillment Status...</option>
              <option value="pending">Mark as Pending</option>
              <option value="processing">Mark as Processing</option>
              <option value="shipped">Mark as Shipped</option>
              <option value="delivered">Mark as Delivered</option>
              <option value="cancelled">Mark as Cancelled</option>
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
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
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
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Count</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isChecked = selectedIds.includes(order.id);

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/80 transition ${isChecked ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(order.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-600">{order.orderNumber}</span>
                        <p className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{order.paymentMethod}</td>
                      <td className="py-3 px-4">
                        {(() => {
                          const config = getStatusBadgeConfig(order.status);
                          return (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition ${config.badge}`}>
                              <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-transparent border-none text-xs font-bold cursor-pointer focus:outline-hidden p-0 pr-1 capitalize text-inherit"
                              >
                                <option value="pending" className="bg-white text-slate-900 font-medium">Pending</option>
                                <option value="processing" className="bg-white text-slate-900 font-medium">Processing</option>
                                <option value="shipped" className="bg-white text-slate-900 font-medium">Shipped</option>
                                <option value="delivered" className="bg-white text-slate-900 font-medium">Delivered</option>
                                <option value="cancelled" className="bg-white text-slate-900 font-medium">Cancelled</option>
                              </select>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleGenerateFedexLabelForOrder(order)}
                              disabled={generatingLabelId === order.id}
                              title="Generate FedEx Shipping Label as a downloadable PDF"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition cursor-pointer shadow-xs"
                            >
                              {generatingLabelId === order.id ? (
                                <>
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <Truck className="w-3.5 h-3.5 text-white animate-pulse" />
                                  <span>FedEx Label</span>
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handlePrintOrder(order, 'invoice')}
                            title="Print PDF Commercial Invoice"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => handlePrintOrder(order, 'packing_slip')}
                            title="Print Packing Slip"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
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

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-slate-900">Order #{viewingOrder.orderNumber}</h3>
                  {(() => {
                    const cfg = getStatusBadgeConfig(viewingOrder.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className="capitalize">{viewingOrder.status}</span>
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Placed on {new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <div>
                <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Customer
                </span>
                <p className="font-semibold text-slate-900">{viewingOrder.customerName}</p>
                <p className="text-slate-500">{viewingOrder.customerEmail}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shipping Address
                </span>
                <p className="text-slate-700 leading-snug">{viewingOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Order Line Items</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <p className="font-bold text-slate-900">{item.productTitle}</p>
                      <p className="text-slate-400 text-[11px]">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-slate-900">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Total Order Amount:</span>
              <span className="text-lg font-bold font-display text-indigo-600">${viewingOrder.totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                Close
              </button>
              {viewingOrder.status === 'pending' && (
                <button
                  onClick={() => handleGenerateFedexLabelForOrder(viewingOrder)}
                  disabled={generatingLabelId === viewingOrder.id}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {generatingLabelId === viewingOrder.id ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      <span>Generating Label...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-3.5 h-3.5 animate-pulse" />
                      <span>Generate FedEx Label</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => handlePrintOrder(viewingOrder, 'invoice')}
                className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Print Invoice
              </button>
              <button
                onClick={() => handlePrintOrder(viewingOrder, 'packing_slip')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date-Range Filter CSV Export Modal */}
      <ExportCsvModal
        isOpen={isExportCsvOpen}
        onClose={() => setIsExportCsvOpen(false)}
        title="Export Orders Transactions CSV"
        items={orders}
        getDate={(o) => o.createdAt}
        headers={['Order Number', 'Customer Name', 'Customer Email', 'Items Count', 'Total Amount ($)', 'Payment Method', 'Status', 'Shipping Address', 'Created At']}
        getRowData={(o) => [
          o.orderNumber,
          o.customerName,
          o.customerEmail,
          o.items.reduce((acc, item) => acc + item.quantity, 0),
          o.totalAmount.toFixed(2),
          o.paymentMethod,
          o.status,
          o.shippingAddress,
          o.createdAt
        ]}
        filenamePrefix="orders_export"
      />

      {/* Invoice / Factor Template Customizer Modal */}
      <FactorCustomizerModal
        isOpen={isFactorCustomizerOpen}
        onClose={() => setIsFactorCustomizerOpen(false)}
        initialSettings={factorSettings}
        onSave={handleSaveFactor}
      />
    </div>
  );
};
