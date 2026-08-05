import React, { useState, useMemo } from 'react';
import { X, Download, Calendar, Filter, CheckCircle, FileSpreadsheet } from 'lucide-react';

export type DateRangePreset = 'all' | 'today' | 'last7' | 'last30' | 'last90' | 'custom';

interface ExportCsvModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  getDate: (item: T) => string; // YYYY-MM-DD or ISO string
  headers: string[];
  getRowData: (item: T) => (string | number)[];
  filenamePrefix: string;
}

export function ExportCsvModal<T>({
  isOpen,
  onClose,
  title,
  items,
  getDate,
  headers,
  getRowData,
  filenamePrefix,
}: ExportCsvModalProps<T>) {
  const [preset, setPreset] = useState<DateRangePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Calculate start & end bounds for presets
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'all') {
      return { startDate: '', endDate: '' };
    }

    if (preset === 'today') {
      return { startDate: todayStr, endDate: todayStr };
    }

    if (preset === 'last7') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
    }

    if (preset === 'last30') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
    }

    if (preset === 'last90') {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      return { startDate: d.toISOString().split('T')[0], endDate: todayStr };
    }

    return { startDate: customStartDate, endDate: customEndDate };
  }, [preset, customStartDate, customEndDate]);

  // Filter items by date range
  const filteredItems = useMemo(() => {
    if (!startDate && !endDate) return items;

    return items.filter(item => {
      const rawDateStr = getDate(item);
      if (!rawDateStr) return true;
      const itemDateStr = rawDateStr.split('T')[0];

      if (startDate && itemDateStr < startDate) return false;
      if (endDate && itemDateStr > endDate) return false;
      return true;
    });
  }, [items, getDate, startDate, endDate]);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    if (filteredItems.length === 0) return;

    // Escape CSV cell value
    const formatCell = (val: string | number) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows: string[] = [];
    csvRows.push(headers.map(formatCell).join(','));

    filteredItems.forEach(item => {
      const row = getRowData(item);
      csvRows.push(row.map(formatCell).join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    
    const rangeLabel = preset === 'all' ? 'all-time' : `${startDate || 'start'}_to_${endDate || 'end'}`;
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `${filenamePrefix}_${rangeLabel}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Export time-bound dataset to CSV format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Select Date Range Filter
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'last7', label: 'Last 7 Days' },
                { id: 'last30', label: 'Last 30 Days' },
                { id: 'last90', label: 'Last 90 Days' },
                { id: 'custom', label: 'Custom Range' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPreset(opt.id as DateRangePreset)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-center cursor-pointer ${
                    preset === opt.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs if Custom selected */}
          {preset === 'custom' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Export Summary Box */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <Filter className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 space-y-1">
              <p className="font-bold">
                Exporting <span className="text-indigo-600 font-extrabold text-sm">{filteredItems.length}</span> of {items.length} records
              </p>
              <p className="text-indigo-700/90 font-medium">
                {preset === 'all' ? (
                  'Including full historical dataset without time restrictions.'
                ) : (
                  <>
                    Segment bounds: <span className="font-mono font-semibold">{startDate || 'Any'}</span> to <span className="font-mono font-semibold">{endDate || 'Any'}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadCsv}
            disabled={filteredItems.length === 0}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition shadow-xs cursor-pointer ${
              filteredItems.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            <Download className="w-4 h-4" />
            Download {filteredItems.length} CSV Rows
          </button>
        </div>
      </div>
    </div>
  );
}
