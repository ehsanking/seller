import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  X, 
  Mail, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  Eye, 
  Code,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus, EmailTemplate, EmailDraft } from '../types';

interface RefundRequestModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRefund: (orderId: string, targetStatus: OrderStatus, emailDraft?: EmailDraft) => void;
  onNavigateToEmailTemplates?: () => void;
}

const DEFAULT_REFUND_TEMPLATE: EmailTemplate = {
  id: 'tmpl_refund_confirmation',
  key: 'refund_confirmation',
  name: 'Refund Confirmation Email',
  category: 'billing',
  subject: 'Refund Processed for Order #{{order_number}} - {{store_name}}',
  senderName: '{{store_name}} Customer Support',
  senderEmail: 'support@ehsan-seller.de',
  isEnabled: true,
  lastUpdated: new Date().toISOString().split('T')[0],
  bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Refund Notice 💳</h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Order #{{order_number}}</p>
  </div>
  <div style="padding: 32px 24px;">
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Dear {{customer_name}},</p>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">This email confirms that a refund request has been logged for your order <strong>#{{order_number}}</strong>.</p>
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: #92400e;">Total Refund Amount:</span>
        <span style="font-size: 22px; font-weight: 800; color: #b45309;">{{refund_amount}}</span>
      </div>
      <p style="margin: 0; font-size: 13px; color: #b45309;"><strong>Reason:</strong> {{refund_reason}}</p>
    </div>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">The refunded funds will appear in your original payment account within 3–5 business days.</p>
    <p style="margin: 0; color: #64748b; font-size: 13px;">We apologize for any inconvenience caused and appreciate your patience.</p>
  </div>
  <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0 0 8px 0;">Questions? Contact <a href="mailto:{{store_support_email}}" style="color: #d97706;">{{store_support_email}}</a>.</p>
    <p style="margin: 0;">© {{current_year}} {{store_name}}</p>
  </div>
</div>`,
  bodyText: `Dear {{customer_name}},

A refund of {{refund_amount}} has been requested for your order #{{order_number}}.
Reason: {{refund_reason}}

Please allow 3-5 business days for funds to reflect in your account.

Support: {{store_support_email}}`
};

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmRefund,
  onNavigateToEmailTemplates
}) => {
  if (!isOpen || !order) return null;

  const [refundAmount, setRefundAmount] = useState<number>(order.totalAmount);
  const [selectedReasonCategory, setSelectedReasonCategory] = useState<string>('Customer Return / Mind Changed');
  const [customReasonDetails, setCustomReasonDetails] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('refund_requested');
  const [prepareEmail, setPrepareEmail] = useState<boolean>(true);
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_REFUND_TEMPLATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load refund template from localStorage on modal open
  useEffect(() => {
    const savedTemplates = localStorage.getItem('seller_email_templates');
    if (savedTemplates) {
      try {
        const parsed: EmailTemplate[] = JSON.parse(savedTemplates);
        const match = parsed.find(t => t.key === 'refund_confirmation');
        if (match) setTemplate(match);
      } catch (err) {
        console.error('Failed to parse saved email templates:', err);
      }
    }
  }, [isOpen]);

  // Derive final refund reason text
  const finalReason = customReasonDetails.trim() 
    ? `${selectedReasonCategory} - ${customReasonDetails.trim()}`
    : selectedReasonCategory;

  // Substitute tokens into template string
  const compileTemplate = (text: string) => {
    const formattedAmount = `$${refundAmount.toFixed(2)}`;
    return text
      .replace(/\{\{customer_name\}\}/g, order.customerName)
      .replace(/\{\{order_number\}\}/g, order.orderNumber)
      .replace(/\{\{refund_amount\}\}/g, formattedAmount)
      .replace(/\{\{refund_reason\}\}/g, finalReason)
      .replace(/\{\{store_name\}\}/g, 'Ehsan Seller Store')
      .replace(/\{\{store_support_email\}\}/g, 'support@ehsan-seller.de')
      .replace(/\{\{current_year\}\}/g, new Date().getFullYear().toString());
  };

  const compiledSubject = customSubject || compileTemplate(template.subject);
  const compiledBodyHtml = compileTemplate(template.bodyHtml);
  const compiledBodyText = compileTemplate(template.bodyText);

  const handlePresetAmount = (percent: number) => {
    const calculated = (order.totalAmount * percent) / 100;
    setRefundAmount(Number(calculated.toFixed(2)));
  };

  const handleSubmit = (emailStatus: 'draft' | 'sent') => {
    setIsSubmitting(true);

    let draft: EmailDraft | undefined = undefined;
    if (prepareEmail) {
      draft = {
        id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        templateKey: template.key,
        templateName: template.name,
        recipientEmail: order.customerEmail,
        recipientName: order.customerName,
        subject: compiledSubject,
        bodyHtml: compiledBodyHtml,
        bodyText: compiledBodyText,
        refundAmount: refundAmount,
        refundReason: finalReason,
        createdAt: new Date().toISOString(),
        status: emailStatus,
        sentAt: emailStatus === 'sent' ? new Date().toISOString() : undefined
      };

      // Save draft to localStorage
      try {
        const existingDrafts = JSON.parse(localStorage.getItem('seller_email_drafts') || '[]');
        existingDrafts.unshift(draft);
        localStorage.setItem('seller_email_drafts', JSON.stringify(existingDrafts));
      } catch (e) {
        console.error('Failed to save email draft to localStorage', e);
      }

      // Also persist to API if available
      fetch('/api/email-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      }).catch(() => {});
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmRefund(order.id, targetStatus, draft);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200/80 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Request Refund</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  #{order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Customer: <strong className="text-slate-800">{order.customerName}</strong> ({order.customerEmail})
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Refund Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          
          {/* Left Column: Refund Details */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              1. Refund Details
            </h4>

            {/* Refund Amount Input & Presets */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold">
                Refund Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={order.totalAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
                />
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                <button
                  type="button"
                  onClick={() => handlePresetAmount(100)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    refundAmount === order.totalAmount 
                      ? 'bg-amber-600 text-white border-amber-600' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Full (${order.totalAmount.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetAmount(50)}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  50% (${(order.totalAmount * 0.5).toFixed(2)})
                </button>
              </div>
            </div>

            {/* Reason Category */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">
                Refund Reason Category
              </label>
              <select
                value={selectedReasonCategory}
                onChange={(e) => setSelectedReasonCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden cursor-pointer"
              >
                <option value="Customer Return / Mind Changed">Customer Return / Mind Changed</option>
                <option value="Defective or Damaged Item">Defective or Damaged Item</option>
                <option value="Shipping Delay / Lost Package">Shipping Delay / Lost Package</option>
                <option value="Incorrect Item Shipped">Incorrect Item Shipped</option>
                <option value="Customer Goodwill / Ex-Gratia">Customer Goodwill / Ex-Gratia</option>
                <option value="Other / Custom Reason">Other / Custom Reason</option>
              </select>
            </div>

            {/* Optional Reason Note */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">
                Additional Notes / Explanation
              </label>
              <textarea
                rows={2}
                value={customReasonDetails}
                onChange={(e) => setCustomReasonDetails(e.target.value)}
                placeholder="E.g. Item returned in good condition. Approving full store credit..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-normal text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
              />
            </div>

            {/* Target Order Status */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-slate-700 font-semibold">
                Update Order Fulfillment Status To:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetStatus('refund_requested')}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    targetStatus === 'refund_requested'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-[11px]">Refund Requested</p>
                  <p className="text-[10px] text-slate-500">Awaiting payment gateway approval</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus('refunded')}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    targetStatus === 'refunded'
                      ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-[11px]">Refunded</p>
                  <p className="text-[10px] text-slate-500">Funds immediately reversed</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Email Notification & Template Settings */}
          <div className="space-y-4 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-indigo-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  2. Email Template Management Draft
                </h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prepareEmail}
                    onChange={(e) => setPrepareEmail(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-700 bg-slate-800 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-300 font-semibold">Enable Draft</span>
                </label>
              </div>

              {prepareEmail ? (
                <div className="space-y-3">
                  {/* Template Meta Indicator */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/80">
                    <div>
                      <span className="text-slate-400 font-mono">Template: </span>
                      <span className="font-bold text-amber-400">{template.name}</span>
                    </div>
                    {onNavigateToEmailTemplates && (
                      <button
                        type="button"
                        onClick={onNavigateToEmailTemplates}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline cursor-pointer"
                      >
                        Open Manager <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Draft Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={customSubject || compiledSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                    />
                  </div>

                  {/* Preview Mode Switch */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Live Render Draft:</span>
                    <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setPreviewTab('visual')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                          previewTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3 h-3" /> Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('code')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                          previewTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code className="w-3 h-3" /> Text
                      </button>
                    </div>
                  </div>

                  {/* Body Preview Frame */}
                  <div className="bg-white text-slate-900 rounded-xl border border-slate-700 overflow-hidden max-h-48 overflow-y-auto p-3">
                    {previewTab === 'visual' ? (
                      <div 
                        className="prose prose-xs max-w-none text-xs"
                        dangerouslySetInnerHTML={{ __html: compiledBodyHtml }}
                      />
                    ) : (
                      <pre className="text-[11px] font-mono whitespace-pre-wrap text-slate-800 leading-relaxed">
                        {compiledBodyText}
                      </pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs my-auto">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  Email draft preparation is disabled for this refund request.
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Variables parsed from Order #{order.orderNumber} automatically</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Current Status: <span className="font-bold uppercase text-slate-700">{order.status}</span> → New: <span className="font-bold uppercase text-amber-600">{targetStatus}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            {prepareEmail && (
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Save Draft & Update Status
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit('sent')}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Confirm Refund & Send Email
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
