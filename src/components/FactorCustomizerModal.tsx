import React, { useState } from 'react';
import { FactorSettings } from '../types';
import { 
  X, 
  Printer, 
  Save, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Sliders, 
  Palette, 
  Eye, 
  QrCode, 
  HelpCircle,
  Sparkles,
  Layout,
  Receipt,
  FileCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const DEFAULT_FACTOR_SETTINGS: FactorSettings = {
  companyName: 'Ehsan Headless E-Commerce Core',
  economicCode: '411398572164',
  nationalId: '10103829104',
  registrationNumber: '582910',
  taxId: 'TX-99820-EHSAN',
  companyAddress: 'Tech Tower, Suite 402, Innovation Avenue',
  companyPhone: '+1 (800) 555-0199',
  companyEmail: 'billing@ehsan-store.io',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  headerTitle: 'Commercial Sales Invoice',
  accentColor: '#4f46e5',
  paperFormat: 'a4',
  templateStyle: 'official',
  showTax: true,
  showDiscount: true,
  showSku: true,
  showSignatureBox: true,
  showQrCode: true,
  showPaymentMethod: true,
  footerNote: 'Thank you for choosing SELLER Core! For support, visit support.seller.io',
  termsAndConditions: 'Items are eligible for return within 30 days in original unopened packaging.',
  bankInfo: 'Bank: Chase National | Account: 9975-3321-8842 | SWIFT/IBAN: US98CHAS00004113985721',
};

interface FactorCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings?: FactorSettings;
  onSave: (settings: FactorSettings) => void;
}

export const FactorCustomizerModal: React.FC<FactorCustomizerModalProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState<FactorSettings>({
    ...DEFAULT_FACTOR_SETTINGS,
    ...initialSettings,
  });

  const [activeTab, setActiveTab] = useState<'seller' | 'display' | 'style' | 'footer'>('seller');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const colorPresets = [
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Slate Dark', hex: '#0f172a' },
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Crimson', hex: '#dc2626' },
    { name: 'Amber Gold', hex: '#d97706' },
  ];

  // Sample order for live factor preview
  const sampleOrder = {
    orderNumber: 'INV-2026-8942',
    createdAt: new Date().toLocaleDateString('en-US'),
    customerName: 'Alex Mercer',
    customerEmail: 'alex.mercer@example.com',
    customerPhone: '+1 (555) 234-5678',
    shippingAddress: '742 Evergreen Terrace, Suite 8B, Springfield, CA 90210',
    paymentMethod: 'Credit Card (Stripe Direct)',
    items: [
      { id: '1', title: 'ErgoPro X9 Wireless Mechanical Keyboard', sku: 'KB-ERGO-X9', price: 189.00, qty: 1 },
      { id: '2', title: 'Precision Mouse 8K Gaming Edition', sku: 'MS-8K-GAM', price: 79.50, qty: 2 },
      { id: '3', title: 'Premium Leather Desk Mat XL', sku: 'PAD-LEATH-XL', price: 35.00, qty: 1 },
    ],
    subtotal: 383.00,
    discount: 20.00,
    tax: 32.67, // 9% tax
    total: 395.67,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <span>Invoice & Factor Customizer</span>
                <span className="text-[10px] font-mono font-normal bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                  SELLER Factor Engine v2.4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design official invoices, packing slips, and thermal receipt layouts with real-time live preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettings(DEFAULT_FACTOR_SETTINGS)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
              title="Reset to default settings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Left Controls & Right Live Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50 dark:bg-slate-950">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 p-5 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto space-y-5 bg-white dark:bg-slate-900">
            {/* Navigation Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('seller')}
                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'seller' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Seller Info</span>
              </button>

              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'style' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Layout & Size</span>
              </button>

              <button
                onClick={() => setActiveTab('display')}
                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'display' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Display</span>
              </button>

              <button
                onClick={() => setActiveTab('footer')}
                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'footer' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Footer & Terms</span>
              </button>
            </div>

            {/* Tab 1: Seller Business Info */}
            {activeTab === 'seller' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Header Title
                  </label>
                  <input
                    type="text"
                    value={settings.headerTitle}
                    onChange={e => setSettings({ ...settings, headerTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="Commercial Sales Invoice"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seller / Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Economic Code / Tax ID
                    </label>
                    <input
                      type="text"
                      value={settings.economicCode || ''}
                      onChange={e => setSettings({ ...settings, economicCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                      placeholder="411398572164"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      National ID / Business Reg No.
                    </label>
                    <input
                      type="text"
                      value={settings.nationalId || ''}
                      onChange={e => setSettings({ ...settings, nationalId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                      placeholder="10103829104"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.companyPhone}
                      onChange={e => setSettings({ ...settings, companyPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      value={settings.companyEmail || ''}
                      onChange={e => setSettings({ ...settings, companyEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Full Address
                  </label>
                  <textarea
                    rows={2}
                    value={settings.companyAddress}
                    onChange={e => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.logoUrl || ''}
                    onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Style & Paper Format */}
            {activeTab === 'style' && (
              <div className="space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Paper Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'a4', label: 'A4 Sheet (Standard)', desc: 'Full official invoice' },
                      { id: 'a5', label: 'A5 Sheet (Compact)', desc: 'Half-sheet cost saver' },
                      { id: 'thermal', label: 'Thermal POS (80mm)', desc: 'Fast receipt printer' },
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, paperFormat: item.id as any })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          settings.paperFormat === item.id
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <p className="font-bold text-xs">{item.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Template Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'official', label: 'Official Commercial', tag: 'Tax Compliant' },
                      { id: 'modern', label: 'Modern E-Commerce', tag: 'Sleek' },
                      { id: 'minimal', label: 'Minimalist', tag: 'Clean' },
                    ].map(style => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, templateStyle: style.id as any })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          settings.templateStyle === style.id
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <p className="font-bold text-xs">{style.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{style.tag}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Brand Accent Color
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    {colorPresets.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setSettings({ ...settings, accentColor: c.hex })}
                        className={`w-8 h-8 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                          settings.accentColor === c.hex ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {settings.accentColor === c.hex && (
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Custom HEX:</span>
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs w-28"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Display Toggles */}
            {activeTab === 'display' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Invoice Display Elements (Toggles)
                </p>

                {[
                  { key: 'showTax', label: 'Show Value Added Tax (VAT / Tax)' },
                  { key: 'showDiscount', label: 'Show item discounts breakdown' },
                  { key: 'showSku', label: 'Show Product SKU in items table' },
                  { key: 'showPaymentMethod', label: 'Show customer payment method' },
                  { key: 'showSignatureBox', label: 'Show seller & buyer signature boxes' },
                  { key: 'showQrCode', label: 'Show verification QR Code' },
                ].map(item => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(settings as any)[item.key]}
                      onChange={e => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            )}

            {/* Tab 4: Footer & Bank Details */}
            {activeTab === 'footer' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Footer Appreciation Note
                  </label>
                  <textarea
                    rows={2}
                    value={settings.footerNote}
                    onChange={e => setSettings({ ...settings, footerNote: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bank Account & Payment Info
                  </label>
                  <textarea
                    rows={2}
                    value={settings.bankInfo || ''}
                    onChange={e => setSettings({ ...settings, bankInfo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                    placeholder="Bank: ... | Account: ... | IBAN: ..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Warranty & Return Terms
                  </label>
                  <textarea
                    rows={2}
                    value={settings.termsAndConditions || ''}
                    onChange={e => setSettings({ ...settings, termsAndConditions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Template Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live Preview Column (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto flex flex-col items-center bg-slate-200/70 dark:bg-slate-950/90">
            <div className="w-full max-w-xl mb-3 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Live Invoice Render</span>
              </span>
              <span className="bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono uppercase text-[10px]">
                {settings.paperFormat} • {settings.templateStyle}
              </span>
            </div>

            {/* REAL FACTOR PAPER CONTAINER */}
            <div 
              className={`bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300 p-6 transition-all duration-300 font-sans ${
                settings.paperFormat === 'thermal' ? 'w-80 text-[11px]' : 'w-full max-w-xl text-xs'
              }`}
            >
              {/* Header Box */}
              <div 
                className="border-b-2 pb-4 mb-4 flex justify-between items-start"
                style={{ borderColor: settings.accentColor }}
              >
                <div className="flex items-center gap-3">
                  {settings.logoUrl && (
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain rounded border border-slate-200 p-0.5" 
                    />
                  )}
                  <div>
                    <h1 className="font-bold text-sm" style={{ color: settings.accentColor }}>
                      {settings.companyName}
                    </h1>
                    <p className="text-[10px] text-slate-500 mt-0.5">{settings.companyAddress}</p>
                    <p className="text-[10px] font-mono text-slate-500">Tel: {settings.companyPhone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-1"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    {settings.headerTitle}
                  </span>
                  <p className="font-bold text-slate-800 font-mono">{sampleOrder.orderNumber}</p>
                  <p className="text-[10px] text-slate-500">Date: {sampleOrder.createdAt}</p>
                </div>
              </div>

              {/* Economic Info Bar (If Official) */}
              {settings.templateStyle === 'official' && (settings.economicCode || settings.nationalId) && (
                <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-4 text-[10px] grid grid-cols-2 gap-2 font-mono">
                  <div>Economic Code: <strong>{settings.economicCode}</strong></div>
                  <div>National / Reg ID: <strong>{settings.nationalId}</strong></div>
                </div>
              )}

              {/* Buyer Info */}
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 mb-4 text-[11px] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Billed To:</span>
                  <strong className="text-slate-900">{sampleOrder.customerName}</strong>
                  <p className="text-[10px] text-slate-500">{sampleOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Shipping Destination:</span>
                  <p className="text-[10px] text-slate-700 leading-snug">{sampleOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse mb-4 text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700">
                    <th className="p-1.5">Description</th>
                    {settings.showSku && <th className="p-1.5 font-mono">SKU</th>}
                    <th className="p-1.5 text-center">Qty</th>
                    <th className="p-1.5 text-right">Unit Price</th>
                    <th className="p-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {sampleOrder.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-1.5 font-medium">{item.title}</td>
                      {settings.showSku && <td className="p-1.5 font-mono text-[10px] text-slate-500">{item.sku}</td>}
                      <td className="p-1.5 text-center font-bold">{item.qty}</td>
                      <td className="p-1.5 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-1.5 text-right font-bold">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="border-t border-slate-300 pt-2 space-y-1 text-right text-xs mb-4">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Subtotal:</span>
                  <span className="font-mono">${sampleOrder.subtotal.toFixed(2)}</span>
                </div>
                {settings.showDiscount && (
                  <div className="flex justify-between text-emerald-600 text-[11px]">
                    <span>Discount:</span>
                    <span className="font-mono">-${sampleOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                {settings.showTax && (
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Tax / VAT (9%):</span>
                    <span className="font-mono">${sampleOrder.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t pt-1">
                  <span>Grand Total:</span>
                  <span style={{ color: settings.accentColor }} className="font-mono">${sampleOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Bank Info & Terms */}
              {(settings.bankInfo || settings.termsAndConditions) && (
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] space-y-1 mb-3">
                  {settings.bankInfo && <p className="font-mono"><strong>Payment Details:</strong> {settings.bankInfo}</p>}
                  {settings.termsAndConditions && <p className="text-slate-600"><strong>Terms:</strong> {settings.termsAndConditions}</p>}
                </div>
              )}

              {/* Stamp / Signature Box & QR Code */}
              {(settings.showSignatureBox || settings.showQrCode) && (
                <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-3 text-[10px] text-slate-500">
                  {settings.showSignatureBox && (
                    <div className="text-center w-28 border border-slate-200 rounded p-2 bg-slate-50/50">
                      <span>Authorized Stamp & Sig</span>
                      <div className="h-8"></div>
                    </div>
                  )}

                  {settings.showQrCode && (
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                      <QrCode className="w-8 h-8 text-slate-800 shrink-0" />
                      <span className="text-[8px] leading-tight">Official Invoice<br/>Verification QR</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-4 pt-2 border-t text-center text-[10px] text-slate-500">
                {settings.footerNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
