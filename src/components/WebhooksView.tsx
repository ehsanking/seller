import React, { useState, useEffect } from 'react';
import { 
  WebhookEndpoint, 
  WebhookDeliveryLog, 
  WebhookEventType 
} from '../types';
import { 
  Webhook, 
  Plus, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw, 
  Activity, 
  Clock, 
  Code2, 
  Zap, 
  Globe, 
  ChevronRight,
  Send,
  AlertTriangle
} from 'lucide-react';

interface WebhooksViewProps {
  webhooks: WebhookEndpoint[];
  onAddWebhook: (webhook: Partial<WebhookEndpoint>) => Promise<void>;
  onToggleWebhook: (id: string) => Promise<void>;
  onTestWebhook: (id: string) => Promise<WebhookDeliveryLog>;
  onDeleteWebhook: (id: string) => Promise<void>;
}

const ALL_EVENTS: { event: WebhookEventType; label: string; desc: string }[] = [
  { event: 'order_placed', label: 'order_placed', desc: 'Triggered when a new order is received.' },
  { event: 'order_status_updated', label: 'order_status_updated', desc: 'Triggered when an order status changes (e.g. shipped, delivered).' },
  { event: 'stock_updated', label: 'stock_updated', desc: 'Triggered when item stock quantity is modified.' },
  { event: 'product_created', label: 'product_created', desc: 'Triggered when a new product catalog entry is added.' },
  { event: 'payment_processed', label: 'payment_processed', desc: 'Triggered when a customer payment succeeds.' },
  { event: 'customer_created', label: 'customer_created', desc: 'Triggered when a new customer profile is registered.' },
];

export const WebhooksView: React.FC<WebhooksViewProps> = ({
  webhooks,
  onAddWebhook,
  onToggleWebhook,
  onTestWebhook,
  onDeleteWebhook,
}) => {
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showSecretId, setShowSecretId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookDeliveryLog | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState(`whsec_${Math.random().toString(36).substring(2, 14)}`);
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([
    'order_placed',
    'stock_updated',
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/webhooks/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch webhook logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [webhooks]);

  const handleToggleEvent = (event: WebhookEventType) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      setSubmitting(true);
      await onAddWebhook({
        name: name || 'Custom Webhook Endpoint',
        url,
        secret,
        events: selectedEvents,
      });
      setIsModalOpen(false);
      setName('');
      setUrl('');
      setSecret(`whsec_${Math.random().toString(36).substring(2, 14)}`);
      setSelectedEvents(['order_placed', 'stock_updated']);
    } catch (err) {
      console.error('Failed to create webhook:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTest = async (id: string) => {
    try {
      setTestingId(id);
      const log = await onTestWebhook(id);
      await fetchLogs();
      setSelectedLog(log);
    } catch (err) {
      console.error('Failed to test webhook:', err);
    } finally {
      setTestingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(text);
    setTimeout(() => setCopiedSecret(null), 2000);
  };

  const totalDelivered = logs.length;
  const successfulDelivered = logs.filter((l) => l.statusCode >= 200 && l.statusCode < 300).length;
  const successRate = totalDelivered ? ((successfulDelivered / totalDelivered) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Webhook className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Developer Webhook Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.4 Real-time
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Receive instant HTTP POST JSON notifications whenever orders are placed, stock quantities change, or products are updated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            {showDocs ? 'Hide Docs' : 'SDK & Signature Verification'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            Add Endpoint
          </button>
        </div>
      </div>

      {/* Docs Accordion */}
      {showDocs && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">HMAC SHA-256 Webhook Signature Verification</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Header: X-Seller-Signature</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every HTTP payload sent by SELLER Core includes a HMAC SHA-256 header (<code>X-Seller-Signature</code>). Verify signatures in your backend to ensure requests originate securely from your SELLER engine instance.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{`// Node.js Express Signature Verification Handler
import crypto from 'crypto';

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-seller-signature'];
  const secret = 'whsec_your_registered_secret';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature signature');
  }

  // Handle verified event
  const { event, orderId, totalAmount } = req.body;
  console.log(\`Received verified event: \${event}\`);
  res.status(200).json({ received: true });
});`}</pre>
          </div>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400">Registered Endpoints</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-white">{webhooks.length}</span>
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400">Active Listeners</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-400">
              {webhooks.filter((w) => w.isActive).length}
            </span>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400">Delivery Success Rate</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-cyan-400">{successRate}%</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400">Total Events Logged</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-indigo-300">{totalDelivered}</span>
            <Clock className="w-5 h-5 text-indigo-300" />
          </div>
        </div>
      </div>

      {/* Webhook Endpoints List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Configured Endpoints</h3>
            <p className="text-xs text-slate-400">Registered webhook listeners receiving event payloads</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {webhooks.length} Endpoints
          </span>
        </div>

        {webhooks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Webhook className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Webhook Endpoints Registered</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add a webhook URL to receive real-time HTTP POST notifications when transactions occur.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4" /> Add First Endpoint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Endpoint Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${wh.isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                      <h4 className="text-base font-bold text-white">{wh.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                          wh.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {wh.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate max-w-md">{wh.url}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTest(wh.id)}
                      disabled={testingId === wh.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition disabled:opacity-50"
                    >
                      {testingId === wh.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Test Ping
                    </button>

                    <button
                      onClick={() => onToggleWebhook(wh.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        wh.isActive
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {wh.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => onDeleteWebhook(wh.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                      title="Delete Webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Secret Key & Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-900 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-500">Signing Secret:</span>
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 font-mono text-[11px] text-slate-300">
                      <span>
                        {showSecretId === wh.id ? wh.secret : `${wh.secret.substring(0, 8)}••••••••`}
                      </span>
                      <button
                        onClick={() => setShowSecretId(showSecretId === wh.id ? null : wh.id)}
                        className="text-slate-400 hover:text-white ml-1"
                      >
                        {showSecretId === wh.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(wh.secret)}
                        className="text-slate-400 hover:text-white ml-1"
                        title="Copy Secret"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedSecret === wh.secret && (
                        <span className="text-[10px] text-emerald-400 font-sans font-bold">Copied!</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>Created: {new Date(wh.createdAt).toLocaleDateString()}</span>
                    {wh.lastTriggeredAt && (
                      <span>Last Ping: {new Date(wh.lastTriggeredAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>

                {/* Event Subscription Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Events:</span>
                  {wh.events.map((ev) => (
                    <span
                      key={ev}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Logs Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Live Event Delivery Logs</h3>
            <p className="text-xs text-slate-400">Real-time HTTP response status and payload payloads</p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loadingLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No delivery events logged yet. Trigger a test ping or place an order to view logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="p-3 rounded-l-lg">Status</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">HTTP Code</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {log.statusCode >= 200 && log.statusCode < 300 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`font-bold uppercase text-[10px] ${
                            log.statusCode >= 200 && log.statusCode < 300 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 text-[10px]">
                        {log.event}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 truncate max-w-xs">{log.webhookName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.statusCode === 200
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {log.statusCode} OK
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{log.responseMs}ms</td>
                    <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-[11px] font-semibold transition"
                      >
                        Inspect Payload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Webhook Delivery Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block font-semibold text-[10px]">EVENT</span>
                <span className="font-mono text-indigo-300 font-bold">{selectedLog.event}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block font-semibold text-[10px]">HTTP RESPONSE</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedLog.statusCode} OK ({selectedLog.responseMs}ms)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">HTTP Request Payload (JSON)</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto max-h-60">
                <pre>{JSON.stringify(selectedLog.requestPayload, null, 2)}</pre>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Remote Server Response Body</span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>{selectedLog.responseBody}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Register Webhook Endpoint</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Endpoint Name / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary Logistics Fulfillment Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Endpoint URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.yourdomain.com/webhooks/seller"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Signing Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={secret}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSecret(`whsec_${Math.random().toString(36).substring(2, 14)}`)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                    title="Generate New Secret"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Subscribe to Events ({selectedEvents.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {ALL_EVENTS.map((item) => {
                    const checked = selectedEvents.includes(item.event);
                    return (
                      <label
                        key={item.event}
                        onClick={() => handleToggleEvent(item.event)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          checked
                            ? 'bg-indigo-950/60 border-indigo-500/50 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <div>
                          <span className="text-xs font-mono font-bold block">{item.label}</span>
                          <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !url}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Save Endpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
