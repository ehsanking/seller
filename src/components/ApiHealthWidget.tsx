import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, AlertTriangle, ArrowUpRight, RefreshCw, Send, CheckCircle2, Server, Clock } from 'lucide-react';
import { ApiHealthMetrics } from '../types';

export const ApiHealthWidget: React.FC = () => {
  const [metrics, setMetrics] = useState<ApiHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/health/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to load API health metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Poll every 10s for real-time dashboard update
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTestPing = async () => {
    try {
      setPinging(true);
      await fetch('/api/health/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'dashboard_test_widget' }),
      });
      await fetchMetrics();
    } catch (err) {
      console.error('Failed to send test API ping:', err);
    } finally {
      setPinging(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const rateLimitPercent = Math.round((metrics.rateLimit.currentUsed / metrics.rateLimit.limitPerMin) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Widget Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-display">API Gateway & System Health</h3>
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                99.98% Uptime
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Real-time developer telemetry, throughput, and error rates</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestPing}
            disabled={pinging}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {pinging ? 'Sending Ping...' : 'Send Test API Call'}
          </button>
          <button
            onClick={fetchMetrics}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Throughput */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">API Throughput</span>
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-display text-slate-900">{metrics.throughputReqMin}</span>
              <span className="text-xs font-semibold text-slate-500">req / min</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, (metrics.throughputReqMin / 200) * 100)}%` }}></div>
            </div>
          </div>

          {/* Card 2: 4xx / 5xx Error Rate */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">4xx / 5xx Error Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-display text-slate-900">{metrics.errorRatePercent}%</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Optimal</span>
            </div>
            <p className="text-[11px] text-slate-500">Average response latency: <strong className="text-slate-800 font-mono">{metrics.avgLatencyMs}ms</strong></p>
          </div>

          {/* Card 3: Rate Limit Quota */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Rate-Limit Status</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-black font-mono text-slate-900">
                {metrics.rateLimit.currentUsed} / {metrics.rateLimit.limitPerMin}
              </span>
              <span className="text-xs font-bold text-indigo-600 font-mono">{rateLimitPercent}% Used</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${rateLimitPercent > 80 ? 'bg-rose-500' : rateLimitPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${rateLimitPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Endpoints Performance Table & Live Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Endpoints */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Core Endpoint Latencies
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {metrics.endpoints.map((ep, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between hover:bg-slate-50/80 transition">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                      ep.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-800 font-semibold">{ep.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-700">{ep.avgLatencyMs} ms</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {ep.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent API Logs Stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              Live API Request Stream
            </h4>
            <div className="bg-slate-950 text-slate-200 rounded-xl p-3 border border-slate-800 font-mono text-[11px] space-y-2 max-h-56 overflow-y-auto">
              {metrics.recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between pb-1.5 border-b border-slate-900 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                      log.method === 'GET' ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-slate-300 truncate">{log.path}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold ${log.statusCode < 400 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.statusCode}
                    </span>
                    <span className="text-slate-500 text-[10px]">{log.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
