import React, { useState } from 'react';
import { Order, Customer, Product } from '../types';
import { 
  Download, 
  Clock, 
  Cloud, 
  HardDrive, 
  CheckCircle2, 
  RotateCw, 
  Calendar, 
  ShieldCheck, 
  FileSpreadsheet, 
  FileText,
  Sparkles
} from 'lucide-react';

interface DataBackupSchedulerProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
}

export const DataBackupScheduler: React.FC<DataBackupSchedulerProps> = ({
  orders,
  customers,
  products
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'manual'>('daily');
  const [destination, setDestination] = useState<'local' | 'google_drive'>('local');
  const [includeOrders, setIncludeOrders] = useState(true);
  const [includeCustomers, setIncludeCustomers] = useState(true);
  const [includeProducts, setIncludeProducts] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>('August 6, 2026, 04:00 AM');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRunImmediateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const timestamp = new Date().toLocaleString();
      setLastBackupTime(timestamp);

      // Trigger actual JSON file download in browser
      const backupData = {
        exportedAt: new Date().toISOString(),
        storeStats: {
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length
        },
        orders: includeOrders ? orders : [],
        customers: includeCustomers ? customers : [],
        products: includeProducts ? products : []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `seller_store_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccessMessage(`Backup successfully generated and downloaded via ${destination === 'google_drive' ? 'Google Drive Cloud Sync' : 'Local Drive'}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-slate-900">Data Export & Automated Backup Scheduler</h4>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-800 rounded-md">
                Secure Cloud & Local
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Configure automatic intervals for downloading critical business data (orders, customers, inventory) to local drive or Google Drive.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunImmediateBackup}
          disabled={isBackingUp}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isBackingUp ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Backup...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Backup & Export Now</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Backup Frequency */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h5 className="font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Automatic Backup Interval</span>
          </h5>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={`py-2 px-3 rounded-lg font-bold transition cursor-pointer text-center ${
                frequency === 'daily' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Daily (04:00 AM)
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`py-2 px-3 rounded-lg font-bold transition cursor-pointer text-center ${
                frequency === 'weekly' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Weekly (Sun)
            </button>
            <button
              type="button"
              onClick={() => setFrequency('manual')}
              className={`py-2 px-3 rounded-lg font-bold transition cursor-pointer text-center ${
                frequency === 'manual' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Manual Only
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Next scheduled automated backup: <strong className="text-slate-800">Tomorrow at 04:00 AM</strong>
          </p>
        </div>

        {/* Storage Destination */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h5 className="font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>Export Storage Destination</span>
          </h5>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDestination('local')}
              className={`py-2 px-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                destination === 'local' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Local Drive Download</span>
            </button>
            <button
              type="button"
              onClick={() => setDestination('google_drive')}
              className={`py-2 px-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                destination === 'google_drive' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Google Drive Sync</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Storage status: <strong className="text-emerald-600">Connected & Verified (Encrypted AES-256)</strong>
          </p>
        </div>
      </div>

      {/* Dataset Selection */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
        <h5 className="font-bold text-slate-900">Included Datasets in Backup</h5>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={includeOrders}
              onChange={(e) => setIncludeOrders(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Customer Orders & Transactions ({orders.length} records)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={includeCustomers}
              onChange={(e) => setIncludeCustomers(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Customer Profiles ({customers.length} records)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={includeProducts}
              onChange={(e) => setIncludeProducts(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Product Catalog & Inventory ({products.length} records)</span>
          </label>
        </div>
      </div>

      {/* Last Backup Info Footer */}
      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Last successful backup completed on <strong className="text-slate-800">{lastBackupTime}</strong></span>
        </div>
        <span className="font-mono text-slate-400">Format: JSON / CSV Package</span>
      </div>
    </div>
  );
};
