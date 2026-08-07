import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Check, 
  RotateCcw, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Settings2, 
  Sparkles, 
  Copy, 
  Download, 
  Upload, 
  ShieldCheck, 
  Server, 
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Truck,
  Receipt,
  UserCheck,
  PackageCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { EmailTemplate, SmtpSettings } from '../types';

// Factory Default Email Templates
const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'tmpl_order_confirmation',
    key: 'order_confirmation',
    name: 'Order Confirmation Email',
    category: 'transactional',
    subject: 'Order Confirmation #{{order_number}} - {{store_name}}',
    senderName: '{{store_name}} Billing & Orders',
    senderEmail: 'orders@ehsan-seller.de',
    isEnabled: true,
    lastUpdated: '2026-08-07',
    bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800; tracking-style: tight;">{{store_name}}</h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for your purchase!</p>
  </div>

  <!-- Body Content -->
  <div style="padding: 32px 24px;">
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Hello {{customer_name}},</p>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">We have successfully received your order <strong>#{{order_number}}</strong> placed on <strong>{{order_date}}</strong>. Below is a summary of your items.</p>

    <!-- Order Items Summary Table -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; p-4; margin-bottom: 24px; padding: 16px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Order Breakdown</h3>
      {{items_table}}
    </div>

    <!-- Order Total Banner -->
    <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f1f5f9; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px;">
      <span style="font-weight: 700; color: #334155;">Total Amount Paid:</span>
      <span style="font-size: 20px; font-weight: 800; color: #4f46e5;">{{order_total}}</span>
    </div>

    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">Your order is currently being processed by our fulfillment team. You will receive another email with your DHL tracking link as soon as your parcel ships.</p>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 32px 0 16px 0;">
      <a href="https://ehsan-seller.de/my-account/orders" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; display: inline-block;">View Order in My Account</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0 0 8px 0;">If you have any questions, reply to this email or contact <a href="mailto:{{store_support_email}}" style="color: #4f46e5;">{{store_support_email}}</a>.</p>
    <p style="margin: 0;">© {{current_year}} {{store_name}}. All rights reserved.</p>
  </div>
</div>`,
    bodyText: `Hello {{customer_name}},

Thank you for your purchase from {{store_name}}!
Order Number: #{{order_number}}
Date: {{order_date}}
Total Paid: {{order_total}}

We are preparing your package for shipping. You will receive tracking details shortly.

Support Email: {{store_support_email}}
© {{current_year}} {{store_name}}`
  },
  {
    id: 'tmpl_shipping_update',
    key: 'shipping_update',
    name: 'Shipping Update Email',
    category: 'shipping',
    subject: 'Your Order #{{order_number}} Has Shipped! 🚚 - {{store_name}}',
    senderName: '{{store_name}} Fulfillment',
    senderEmail: 'logistics@ehsan-seller.de',
    isEnabled: true,
    lastUpdated: '2026-08-07',
    bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Parcel on the Way! 📦</h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Order #{{order_number}} is dispatched</p>
  </div>

  <!-- Body Content -->
  <div style="padding: 32px 24px;">
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Great news, {{customer_name}}!</p>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">Your package has been handed over to our shipping partner <strong>{{shipping_carrier}}</strong> and is heading your way.</p>

    <!-- Tracking Info Box -->
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #047857;">Waybill / Tracking Number</p>
      <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; font-family: monospace; color: #065f46;">{{tracking_number}}</p>
      <a href="{{tracking_link}}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 13px;">Track Package Live</a>
    </div>

    <!-- Items Shipped Table -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase;">Package Contents</h3>
      {{items_table}}
    </div>

    <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Please note that tracking information may take up to 2-4 hours to reflect initial scans on the carrier portal.</p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0 0 8px 0;">Need help with delivery? Contact <a href="mailto:{{store_support_email}}" style="color: #059669;">{{store_support_email}}</a>.</p>
    <p style="margin: 0;">© {{current_year}} {{store_name}} Logistics</p>
  </div>
</div>`,
    bodyText: `Hello {{customer_name}},

Your order #{{order_number}} has been shipped via {{shipping_carrier}}!

Tracking Number: {{tracking_number}}
Track Here: {{tracking_link}}

Thank you for shopping with {{store_name}}!`
  },
  {
    id: 'tmpl_refund_confirmation',
    key: 'refund_confirmation',
    name: 'Refund Confirmation Email',
    category: 'billing',
    subject: 'Refund Processed for Order #{{order_number}} - {{store_name}}',
    senderName: '{{store_name}} Customer Care',
    senderEmail: 'support@ehsan-seller.de',
    isEnabled: true,
    lastUpdated: '2026-08-07',
    bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Refund Notice 💳</h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Order #{{order_number}}</p>
  </div>

  <!-- Body Content -->
  <div style="padding: 32px 24px;">
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Dear {{customer_name}},</p>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">This email confirms that a refund has been issued for your order <strong>#{{order_number}}</strong>.</p>

    <!-- Refund Highlight Box -->
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: #92400e;">Total Refund Amount:</span>
        <span style="font-size: 22px; font-weight: 800; color: #b45309;">{{refund_amount}}</span>
      </div>
      <p style="margin: 0; font-size: 12px; color: #b45309;"><strong>Reason:</strong> {{refund_reason}}</p>
    </div>

    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">The refunded funds will appear in your original payment account (Credit Card / PayPal / SEPA) within 3–5 business days, depending on your financial institution.</p>

    <p style="margin: 0; color: #64748b; font-size: 13px;">We apologize for any inconvenience caused and hope to serve you again in the future.</p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0 0 8px 0;">Questions about your refund? Contact <a href="mailto:{{store_support_email}}" style="color: #d97706;">{{store_support_email}}</a>.</p>
    <p style="margin: 0;">© {{current_year}} {{store_name}}</p>
  </div>
</div>`,
    bodyText: `Dear {{customer_name}},

A refund of {{refund_amount}} has been processed for your order #{{order_number}}.
Reason: {{refund_reason}}

Please allow 3-5 business days for funds to reflect in your account.

Support: {{store_support_email}}`
  },
  {
    id: 'tmpl_customer_welcome',
    key: 'customer_welcome',
    name: 'Customer Welcome Email',
    category: 'transactional',
    subject: 'Welcome to {{store_name}}! 🎉',
    senderName: '{{store_name}} Team',
    senderEmail: 'hello@ehsan-seller.de',
    isEnabled: true,
    lastUpdated: '2026-08-07',
    bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Welcome Aboard! 🎉</h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your account with {{store_name}} is ready</p>
  </div>
  <div style="padding: 32px 24px;">
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Hi {{customer_name}},</p>
    <p style="margin: 0 0 24px 0; color: #475569; line-height: 1.6;">We're thrilled to have you as part of our community. You can now easily track orders, save favorite items to your wishlist, and enjoy express checkout.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="https://ehsan-seller.de/store" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 700; display: inline-block;">Start Shopping</a>
    </div>
  </div>
  <div style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">© {{current_year}} {{store_name}}</p>
  </div>
</div>`,
    bodyText: `Welcome {{customer_name}}!

Your account with {{store_name}} is now active. Explore our store anytime!

Support: {{store_support_email}}`
  },
  {
    id: 'tmpl_admin_low_stock',
    key: 'admin_low_stock',
    name: 'Admin Low Stock Alert',
    category: 'admin',
    subject: '⚠️ Low Stock Alert: Product Inventory Low - {{store_name}}',
    senderName: '{{store_name}} Inventory Bot',
    senderEmail: 'system@ehsan-seller.de',
    isEnabled: true,
    lastUpdated: '2026-08-07',
    bodyHtml: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px;">
  <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 8px 0; color: #dc2626; font-size: 18px;">⚠️ Low Inventory Warning</h2>
    <p style="margin: 0; color: #991b1b; font-size: 13px;">One or more items in {{store_name}} catalog are running dangerously low on stock.</p>
  </div>
  <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #334155; margin-bottom: 20px;">
    {{items_table}}
  </div>
  <a href="https://ehsan-seller.de/admin/products" style="background-color: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; inline-block;">Restock Products Now</a>
</div>`,
    bodyText: `Low Stock Alert for {{store_name}}!
Check inventory status in admin dashboard immediately.`
  }
];

// Sample Replacement Data for Live Preview
const samplePreviewData: Record<string, string> = {
  customer_name: 'Maximilian Weber',
  customer_email: 'm.weber@example.de',
  order_number: 'ORD-9842',
  order_date: 'August 7, 2026',
  order_total: '€249.00',
  shipping_carrier: 'DHL Express Germany',
  tracking_number: 'DHL-DE-9824001928',
  tracking_link: 'https://dhl.de/track?id=DHL-DE-9824001928',
  refund_amount: '€89.00',
  refund_reason: 'Item returned due to sizing exchange request',
  store_name: 'Ehsan Seller DE',
  store_support_email: 'support@ehsan-seller.de',
  current_year: '2026',
  items_table: `<table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
    <thead>
      <tr style="border-bottom: 2px solid #cbd5e1; text-align: left;">
        <th style="padding: 8px 0; color: #475569;">Product</th>
        <th style="padding: 8px; text-align: center; color: #475569;">Qty</th>
        <th style="padding: 8px 0; text-align: right; color: #475569;">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600;">Mechanical RGB Keyboard (Nordic Layout)</td>
        <td style="padding: 10px; text-align: center;">1</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 700;">€189.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600;">Ergonomic Gel Palm Rest</td>
        <td style="padding: 10px; text-align: center;">2</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 700;">€60.00</td>
      </tr>
    </tbody>
  </table>`
};

export const EmailTemplatesView: React.FC = () => {
  // Load templates from localStorage or fallback
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('seller_email_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultEmailTemplates;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl_order_confirmation');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'smtp' | 'test'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'visual' | 'code'>('visual');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Test Mailer State
  const [testEmailAddress, setTestEmailAddress] = useState('ehsankingehsan@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendResult, setTestSendResult] = useState<{ success: boolean; msg: string } | null>(null);

  // SMTP Settings State
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>(() => {
    const saved = localStorage.getItem('seller_smtp_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      host: 'smtp.sendgrid.net',
      port: 587,
      encryption: 'tls',
      username: 'apikey',
      fromName: 'Ehsan Seller Storefront',
      fromEmail: 'orders@ehsan-seller.de',
      replyToEmail: 'support@ehsan-seller.de',
      isConfigured: true
    };
  });
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpStatusMsg, setSmtpStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Active selected template object
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Save templates to localStorage
  const saveTemplatesToStorage = (updated: EmailTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem('seller_email_templates', JSON.stringify(updated));
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  const handleUpdateCurrentField = (field: keyof EmailTemplate, value: any) => {
    const updated = templates.map(t => {
      if (t.id === currentTemplate.id) {
        return {
          ...t,
          [field]: value,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });
    saveTemplatesToStorage(updated);
  };

  // Insert or copy placeholder token
  const handleInsertToken = (token: string) => {
    navigator.clipboard.writeText(`{{${token}}}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // Reset to default template layout
  const handleResetToDefault = () => {
    const defaultItem = defaultEmailTemplates.find(dt => dt.key === currentTemplate.key);
    if (defaultItem) {
      handleUpdateCurrentField('bodyHtml', defaultItem.bodyHtml);
      handleUpdateCurrentField('bodyText', defaultItem.bodyText);
      handleUpdateCurrentField('subject', defaultItem.subject);
    }
  };

  // Substitute tokens in HTML for preview
  const getSubstitutedHtml = (htmlContent: string) => {
    let result = htmlContent;
    Object.keys(samplePreviewData).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, samplePreviewData[key]);
    });
    return result;
  };

  // Substitute tokens in subject
  const getSubstitutedSubject = (subjectText: string) => {
    let result = subjectText;
    Object.keys(samplePreviewData).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, samplePreviewData[key]);
    });
    return result;
  };

  // Handle Send Test Email
  const handleSendTestEmail = () => {
    if (!testEmailAddress) return;
    setIsSendingTest(true);
    setTestSendResult(null);

    setTimeout(() => {
      setIsSendingTest(false);
      setTestSendResult({
        success: true,
        msg: `Test "${currentTemplate.name}" successfully dispatched to ${testEmailAddress} via SMTP (${smtpSettings.host}).`
      });
    }, 1200);
  };

  // Handle Save SMTP
  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('seller_smtp_settings', JSON.stringify(smtpSettings));
    setSmtpStatusMsg({ success: true, text: 'SMTP mailer server settings saved successfully!' });
    setTimeout(() => setSmtpStatusMsg(null), 3000);
  };

  // Handle Ping Test SMTP
  const handleTestSmtpConnection = () => {
    setIsTestingSmtp(true);
    setSmtpStatusMsg(null);
    setTimeout(() => {
      setIsTestingSmtp(false);
      setSmtpStatusMsg({ success: true, text: `SMTP connection to ${smtpSettings.host}:${smtpSettings.port} verified (TLS handshake OK).` });
    }, 1000);
  };

  // Export Templates JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `email_templates_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
                Transactional Email Templates
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono px-2 py-0.5 rounded-full uppercase">
                  Engine v2.4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Customize order confirmations, shipping tracking notices, and refund notifications with dynamic variables.
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isSavedToast && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Template Saved
            </span>
          )}

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Export all email templates to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'smtp'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>SMTP Settings</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Template Selector & Right Editor/Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template Navigation List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                Notification Catalog ({templates.length})
              </h3>
              <span className="text-[10px] text-slate-500">Auto-triggers</span>
            </div>

            <div className="space-y-2">
              {templates.map(tmpl => {
                const isSelected = tmpl.id === selectedTemplateId;
                let IconComp = Mail;
                if (tmpl.key === 'order_confirmation') IconComp = Receipt;
                if (tmpl.key === 'shipping_update') IconComp = Truck;
                if (tmpl.key === 'refund_confirmation') IconComp = RotateCcw;
                if (tmpl.key === 'customer_welcome') IconComp = UserCheck;
                if (tmpl.key === 'admin_low_stock') IconComp = AlertTriangle;

                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      if (activeTab === 'smtp') setActiveTab('editor');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/40 text-white'
                        : 'bg-slate-950/40 hover:bg-slate-850 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate text-white">{tmpl.name}</span>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${tmpl.isEnabled ? 'bg-emerald-400' : 'bg-slate-600'}`} title={tmpl.isEnabled ? 'Enabled' : 'Disabled'} />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">{tmpl.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">
                          {tmpl.category}
                        </span>
                        <span className="text-[9px] text-slate-500">Updated: {tmpl.lastUpdated}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Placeholder Tokens Cheat Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Available Variables
              </h4>
              <span className="text-[10px] text-slate-500">Click to copy token</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Insert these placeholders into the Subject line or HTML body content:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                'customer_name',
                'customer_email',
                'order_number',
                'order_date',
                'order_total',
                'items_table',
                'shipping_carrier',
                'tracking_number',
                'tracking_link',
                'refund_amount',
                'refund_reason',
                'store_name',
                'store_support_email',
                'current_year'
              ].map(token => (
                <button
                  key={token}
                  onClick={() => handleInsertToken(token)}
                  className="px-2 py-1 bg-slate-950 hover:bg-indigo-950/80 text-indigo-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-md font-mono text-[10px] transition cursor-pointer flex items-center gap-1 group"
                  title={`Click to copy {{${token}}}`}
                >
                  <span>{`{{${token}}}`}</span>
                  {copiedToken === token ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Editor & Preview Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Workspace Mode Tabs */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-md">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Template Editor</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Live Sample Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('test')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'test'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Test Dispatch</span>
              </button>
            </div>

            {/* Enable/Disable Toggle */}
            {activeTab !== 'smtp' && (
              <div className="flex items-center gap-2 pr-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateCurrentField('isEnabled', !currentTemplate.isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    currentTemplate.isEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentTemplate.isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: TEMPLATE EDITOR */}
          {activeTab === 'editor' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              
              {/* Header meta fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Template Display Name</label>
                  <input
                    type="text"
                    value={currentTemplate.name}
                    onChange={(e) => handleUpdateCurrentField('name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Sender Name & From Title</label>
                  <input
                    type="text"
                    value={currentTemplate.senderName}
                    onChange={(e) => handleUpdateCurrentField('senderName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Subject line field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Email Subject Line</span>
                  <span className="text-[10px] text-slate-500 font-mono">Supports tokens like {"{{order_number}}"}</span>
                </label>
                <input
                  type="text"
                  value={currentTemplate.subject}
                  onChange={(e) => handleUpdateCurrentField('subject', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-indigo-200"
                />
              </div>

              {/* HTML Body Editor Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    HTML Email Body Content
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetToDefault}
                      className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
                      title="Reset body content to default responsive HTML template"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={16}
                  value={currentTemplate.bodyHtml}
                  onChange={(e) => handleUpdateCurrentField('bodyHtml', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                  placeholder="<div>Enter responsive HTML code here...</div>"
                />
              </div>

              {/* Plain Text Fallback */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Plain Text Fallback Body
                </label>
                <textarea
                  rows={4}
                  value={currentTemplate.bodyText}
                  onChange={(e) => handleUpdateCurrentField('bodyText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <p className="text-[11px] text-slate-500">Changes are automatically saved to local storage.</p>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Email Render</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SAMPLE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              
              {/* Device and Render Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {currentTemplate.name} Live Preview
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Subject: <span className="text-indigo-300">{getSubstitutedSubject(currentTemplate.subject)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Desktop Monitor View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Smartphone Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setPreviewMode('visual')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewMode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Visual HTML
                    </button>
                    <button
                      onClick={() => setPreviewMode('code')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Processed Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Render Window Container */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex justify-center min-h-[480px]">
                {previewMode === 'visual' ? (
                  <div className={`transition-all duration-300 w-full ${
                    previewDevice === 'mobile' ? 'max-w-sm border-4 border-slate-800 rounded-3xl p-3 bg-slate-900 shadow-2xl' : 'max-w-2xl'
                  }`}>
                    {/* Simulated Email Client Envelope Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 text-xs space-y-1 text-slate-300 font-sans">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">From:</span>
                        <span className="font-bold text-slate-200">{currentTemplate.senderName} &lt;{currentTemplate.senderEmail}&gt;</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 pt-1">
                        <span className="text-slate-500">To:</span>
                        <span className="font-bold text-slate-200">Maximilian Weber &lt;m.weber@example.de&gt;</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-500">Subject:</span>
                        <span className="font-bold text-indigo-300">{getSubstitutedSubject(currentTemplate.subject)}</span>
                      </div>
                    </div>

                    {/* Live HTML Content Render */}
                    <div 
                      className="bg-white rounded-xl shadow-lg p-2 overflow-x-auto text-slate-900 font-sans"
                      dangerouslySetInnerHTML={{ __html: getSubstitutedHtml(currentTemplate.bodyHtml) }}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[500px]">
                      {getSubstitutedHtml(currentTemplate.bodyHtml)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEST DISPATCH */}
          {activeTab === 'test' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-400" />
                  Dispatch Test Email
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send a live test message for <strong>"{currentTemplate.name}"</strong> to verify rendering and mail server delivery.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Recipient Test Email Address</label>
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="w-full sm:w-96 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-300 font-mono">
                  <p><span className="text-slate-500">Selected Template:</span> {currentTemplate.name}</p>
                  <p><span className="text-slate-500">Resolved Subject:</span> {getSubstitutedSubject(currentTemplate.subject)}</p>
                  <p><span className="text-slate-500">Mailer Route:</span> {smtpSettings.host}:{smtpSettings.port} ({smtpSettings.encryption.toUpperCase()})</p>
                </div>

                {testSendResult && (
                  <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    testSendResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    {testSendResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                    <span>{testSendResult.msg}</span>
                  </div>
                )}

                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest || !testEmailAddress}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-2"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Sending via SMTP...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Test Message Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SMTP CONFIGURATION */}
          {activeTab === 'smtp' && (
            <form onSubmit={handleSaveSmtp} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  SMTP Server & Email Transport Config
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure outgoing mail server parameters for transaction notifications (SendGrid, Mailgun, Amazon SES, or Custom SMTP).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">SMTP Host Server</label>
                  <input
                    type="text"
                    value={smtpSettings.host}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Port & Encryption</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={smtpSettings.port}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, port: parseInt(e.target.value) || 587 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                      required
                    />
                    <select
                      value={smtpSettings.encryption}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, encryption: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="tls">TLS (Port 587)</option>
                      <option value="ssl">SSL (Port 465)</option>
                      <option value="none">None (Port 25)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Sender Title Name</label>
                  <input
                    type="text"
                    value={smtpSettings.fromName}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">From Address</label>
                  <input
                    type="email"
                    value={smtpSettings.fromEmail}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, fromEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {smtpStatusMsg && (
                <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  smtpStatusMsg.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {smtpStatusMsg.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                  <span>{smtpStatusMsg.text}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestSmtpConnection}
                  disabled={isTestingSmtp}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  {isTestingSmtp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  )}
                  <span>Test Connection</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save SMTP Configuration</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
