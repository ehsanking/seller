import React, { useState } from 'react';
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
  CheckSquare
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onBulkDeleteOrders?: (ids: string[]) => void;
  onBulkUpdateOrderStatus?: (ids: string[], status: OrderStatus) => void;
  searchQuery: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onBulkDeleteOrders,
  onBulkUpdateOrderStatus,
  searchQuery,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('');

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handlePrintOrder = (order: Order, type: 'invoice' | 'packing_slip' = 'packing_slip') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isInvoice = type === 'invoice';
    const title = isInvoice ? `Invoice #${order.orderNumber}` : `Packing Slip #${order.orderNumber}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
            .logo { font-size: 22px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
            .doc-type { text-transform: uppercase; font-size: 13px; font-weight: 700; color: #64748b; text-align: right; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .info-box h4 { margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
            .info-box p { margin: 0; font-size: 13px; font-weight: 600; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; border-bottom: 1px solid #cbd5e1; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .total-row { display: flex; justify-content: flex-end; font-size: 16px; font-weight: 800; padding-top: 12px; border-top: 2px solid #e2e8f0; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
            @media print {
              body { padding: 0; margin: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Ehsan Headless Core</div>
              <div style="font-size:12px; color:#64748b; margin-top:4px;">Maintained by EHSANKiNG</div>
            </div>
            <div class="doc-type">
              <h2 style="margin:0 0 4px 0; color:#0f172a;">${isInvoice ? 'COMMERCIAL INVOICE' : 'PACKING SLIP'}</h2>
              <div style="font-size:13px; font-weight:bold; color:#4f46e5;">#${order.orderNumber}</div>
              <div style="font-size:11px; font-weight:normal; color:#64748b; margin-top:2px;">Issued: ${new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h4>Customer Information</h4>
              <p>${order.customerName}</p>
              <p style="font-weight: normal; color: #64748b; font-size: 12px;">${order.customerEmail}</p>
            </div>
            <div class="info-box">
              <h4>Shipping Destination</h4>
              <p style="font-weight: normal; color: #334155;">${order.shippingAddress}</p>
            </div>
            <div class="info-box">
              <h4>Payment Details</h4>
              <p>${order.paymentMethod}</p>
            </div>
            <div class="info-box">
              <h4>Status</h4>
              <p style="text-transform: capitalize;">${order.status}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                ${isInvoice ? '<th style="text-align: right;">Unit Price</th><th style="text-align: right;">Total</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><strong>${item.productTitle}</strong></td>
                  <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                  ${isInvoice ? `<td style="text-align: right;">$${item.price.toFixed(2)}</td><td style="text-align: right; font-weight: bold;">$${(item.quantity * item.price).toFixed(2)}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${isInvoice ? `
            <div class="total-row">
              <div>Total Paid: <span style="color:#4f46e5; margin-left: 8px;">$${order.totalAmount.toFixed(2)}</span></div>
            </div>
          ` : `
            <div style="margin-top:20px; font-size:12px; color:#475569; background:#f8fafc; padding:12px; border-radius:6px; border: 1px solid #e2e8f0;">
              <strong>Fulfillment Checklist:</strong> Please verify all quantities match the physical contents prior to sealing package.
            </div>
          `}

          <div class="footer">
            Ehsan Seller Headless Core • Author: EHSANKiNG • Generated on ${new Date().toLocaleString()}
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> Orders
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filteredOrders.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="Download CSV of current orders list"
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
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-800 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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
                <h3 className="font-display font-bold text-base text-slate-900">Order #{viewingOrder.orderNumber}</h3>
                <p className="text-xs text-slate-500">Placed on {new Date(viewingOrder.createdAt).toLocaleString()}</p>
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
    </div>
  );
};
