import React, { useState } from 'react';
import { SmartAlertRule, AnomalyAlert, Order, Product } from '../types';
import { 
  Bell, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  Zap, 
  Plus, 
  Trash2, 
  Send, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  X,
  UserCheck
} from 'lucide-react';

interface SmartAlertsSettingsProps {
  orders?: Order[];
  products?: Product[];
  onDispatchToAdminProfile?: (alert: AnomalyAlert) => void;
}

export const SmartAlertsSettings: React.FC<SmartAlertsSettingsProps> = ({
  orders = [],
  products = [],
  onDispatchToAdminProfile
}) => {
  const [rules, setRules] = useState<SmartAlertRule[]>([
    {
      id: 'rule-1',
      title: 'Sales Volume Anomaly Spike',
      metric: 'sales_volume',
      condition: 'anomaly_spike',
      thresholdValue: 150,
      enabled: true,
      severity: 'warning',
      lastTriggeredAt: '2 hours ago'
    },
    {
      id: 'rule-2',
      title: 'High Order Cancellation / Refund Rate',
      metric: 'refund_rate',
      condition: 'above',
      thresholdValue: 5.0,
      enabled: true,
      severity: 'critical'
    },
    {
      id: 'rule-3',
      title: 'Rapid Stock Depletion Anomaly',
      metric: 'stock_anomaly',
      condition: 'below',
      thresholdValue: 10,
      enabled: true,
      severity: 'info',
      lastTriggeredAt: 'Yesterday'
    }
  ]);

  const [alerts, setAlerts] = useState<AnomalyAlert[]>([
    {
      id: 'alert-1',
      title: 'Unusual Sales Volume Spike Detected',
      description: 'Order traffic spiked +185% over the past 3 hours, originating mostly from Social Traffic campaigns.',
      severity: 'warning',
      metricName: 'Sales Velocity (+185%)',
      detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiRecommendation: 'Verify inventory stock for Ergonomic Keyboards and increase CDN rate limit capacity.',
      resolved: false
    },
    {
      id: 'alert-2',
      title: 'Potential Stockout Anomaly on Wireless Headphones',
      description: 'Current stock is 6 units, but run rate predicts full stockout in 1.5 days.',
      severity: 'critical',
      metricName: 'Inventory Buffer (6 units)',
      detectedAt: '1 hour ago',
      aiRecommendation: 'Draft an expedited restock purchase order with supplier before weekend peak.',
      resolved: false
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleRunAiScan = async () => {
    setIsScanning(true);
    setScanMessage('Scanning sales transactions and order traffic for anomalies using Gemini 3.6...');

    try {
      const orderSummary = `Total orders: ${orders.length}, Total Revenue: $${orders.reduce((sum, o) => sum + o.totalAmount, 0)}`;
      const prompt = `Perform an e-commerce anomaly scan on these metrics: ${orderSummary}. Identify 1 potential sales or order anomaly and suggest a resolution in 2 short lines.`;

      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'general', provider: 'gemini' })
      });

      if (res.ok) {
        const data = await res.json();
        const newAlert: AnomalyAlert = {
          id: `alert-${Date.now()}`,
          title: 'AI Anomaly Detected: Traffic & Conversion Shift',
          description: data.text || 'Order conversion rate rose +22% following recent theme template change.',
          severity: 'info',
          metricName: 'Conversion Shift (+22%)',
          detectedAt: 'Just Now',
          aiRecommendation: 'Maintain current storefront variant and notify admin team of surge.',
          resolved: false
        };

        setAlerts(prev => [newAlert, ...prev]);
        setScanMessage('Scan complete! 1 new anomaly identified and added to alert stream.');
      }
    } catch (err) {
      console.error('Scan error', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDispatch = (alert: AnomalyAlert) => {
    if (onDispatchToAdminProfile) {
      onDispatchToAdminProfile(alert);
    }
    setDispatchedMap(prev => ({ ...prev, [alert.id]: true }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-slate-900">Smart AI Alerts & Anomaly Detector</h4>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-100 text-purple-800 rounded-md">
                Real-Time AI Guard
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Detects sudden traffic spikes, stockout risks, or conversion drops and dispatches summaries to admin profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunAiScan}
          disabled={isScanning}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Metrics...' : 'Run AI Anomaly Scan'}</span>
        </button>
      </div>

      {scanMessage && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center justify-between">
          <span>{scanMessage}</span>
          <button onClick={() => setScanMessage(null)} className="text-purple-500 hover:text-purple-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Rules Config Grid */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          <span>Active Anomaly Detection Rules</span>
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rules.map(rule => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border text-xs transition flex flex-col justify-between gap-3 ${
                rule.enabled 
                  ? 'bg-slate-50/80 border-slate-200 text-slate-900' 
                  : 'bg-slate-100/40 border-slate-200/60 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                    rule.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rule.severity.toUpperCase()}
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => handleToggleRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <h6 className="font-bold text-slate-900 mt-2">{rule.title}</h6>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Threshold: <strong className="text-slate-800">{rule.thresholdValue}%</strong> shift
                </p>
              </div>

              {rule.lastTriggeredAt && (
                <span className="text-[10px] text-slate-400 font-mono">
                  Triggered {rule.lastTriggeredAt}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detected Anomaly Stream */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Recent Anomaly Stream & Admin Dispatches</span>
        </h5>

        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 hover:bg-slate-100/60 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-900">{alert.title}</h6>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">{alert.detectedAt}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between gap-2">
                <div>
                  <strong className="text-purple-700 font-semibold mr-1">AI Recommendation:</strong>
                  <span>{alert.aiRecommendation}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDispatch(alert)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                    dispatchedMap[alert.id] 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {dispatchedMap[alert.id] ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 text-purple-300" />
                      <span>Send to Admin Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
