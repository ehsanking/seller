import React, { useState } from 'react';
import { 
  Percent, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Calculator, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Info, 
  Settings,
  DollarSign
} from 'lucide-react';
import { TaxClass, TaxRule, StoreSettings } from '../types';

const INITIAL_TAX_CLASSES: TaxClass[] = [
  {
    id: 'tc-1',
    name: 'Standard Rate',
    slug: 'standard',
    rules: [
      {
        id: 'tr-101',
        country: '*',
        state: '*',
        ratePercent: 9.0,
        name: 'Standard Sales VAT / Tax',
        isCompound: false,
        priority: 1
      },
      {
        id: 'tr-102',
        country: 'US',
        state: 'CA',
        ratePercent: 7.25,
        name: 'California State Tax',
        isCompound: false,
        priority: 1
      }
    ]
  },
  {
    id: 'tc-2',
    name: 'Reduced Rate (E-Books & Essentials)',
    slug: 'reduced-rate',
    rules: [
      {
        id: 'tr-201',
        country: '*',
        ratePercent: 5.0,
        name: 'Reduced Essential Goods Rate',
        isCompound: false,
        priority: 1
      }
    ]
  },
  {
    id: 'tc-3',
    name: 'Zero Rate (Tax Exempt & Exports)',
    slug: 'zero-rate',
    rules: [
      {
        id: 'tr-301',
        country: 'Export International',
        ratePercent: 0.0,
        name: 'Zero Tax Duty Free Export',
        isCompound: false,
        priority: 1
      }
    ]
  }
];

interface TaxSettingsViewProps {
  settings?: StoreSettings;
  onSaveSettings?: (settings: StoreSettings) => void;
}

export const TaxSettingsView: React.FC<TaxSettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [taxClasses, setTaxClasses] = useState<TaxClass[]>(() => {
    const saved = localStorage.getItem('seller_tax_classes');
    return saved ? JSON.parse(saved) : INITIAL_TAX_CLASSES;
  });

  const [pricesIncludeTax, setPricesIncludeTax] = useState<boolean>(() => {
    return localStorage.getItem('seller_prices_include_tax') === 'true';
  });

  const [activeClassId, setActiveClassId] = useState<string>(taxClasses[0]?.id || '');
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Rule Form State
  const [ruleName, setRuleName] = useState('');
  const [ruleCountry, setRuleCountry] = useState('*');
  const [ruleState, setRuleState] = useState('*');
  const [ruleRate, setRuleRate] = useState('9.0');
  const [ruleIsCompound, setRuleIsCompound] = useState(false);

  // Calculator Sandbox
  const [testSubtotal, setTestSubtotal] = useState('100.00');

  const saveToStorage = (updated: TaxClass[]) => {
    setTaxClasses(updated);
    localStorage.setItem('seller_tax_classes', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTogglePricesIncludeTax = (include: boolean) => {
    setPricesIncludeTax(include);
    localStorage.setItem('seller_prices_include_tax', String(include));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const activeClass = taxClasses.find(c => c.id === activeClassId) || taxClasses[0];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !ruleName.trim()) return;

    const newRule: TaxRule = {
      id: `tr-${Date.now()}`,
      name: ruleName.trim(),
      country: ruleCountry.trim() || '*',
      state: ruleState.trim() || '*',
      ratePercent: Number(ruleRate) || 0,
      isCompound: ruleIsCompound,
      priority: 1
    };

    const updated = taxClasses.map(c => {
      if (c.id === activeClass.id) {
        return { ...c, rules: [...c.rules, newRule] };
      }
      return c;
    });

    saveToStorage(updated);
    setRuleName('');
    setIsAddRuleOpen(false);
  };

  const handleDeleteRule = (classId: string, ruleId: string) => {
    const updated = taxClasses.map(c => {
      if (c.id === classId) {
        return { ...c, rules: c.rules.filter(r => r.id !== ruleId) };
      }
      return c;
    });
    saveToStorage(updated);
  };

  // Calculator logic
  const calculateTestTax = () => {
    const amount = Number(testSubtotal) || 0;
    if (!activeClass || activeClass.rules.length === 0) return { taxAmount: 0, grandTotal: amount, breakdown: [] };

    let totalTax = 0;
    let currentBase = amount;

    const breakdown = activeClass.rules.map(rule => {
      const taxForRule = currentBase * (rule.ratePercent / 100);
      if (rule.isCompound) {
        currentBase += taxForRule;
      }
      totalTax += taxForRule;
      return {
        ruleName: rule.name,
        ratePercent: rule.ratePercent,
        taxAmount: taxForRule
      };
    });

    return {
      taxAmount: totalTax,
      grandTotal: amount + totalTax,
      breakdown
    };
  };

  const testResults = calculateTestTax();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">Tax Classes & Jurisdiction Rules</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">
                WooCommerce Equiv
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure standard, reduced, and zero-rate tax classes with regional jurisdiction calculation rules.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Tax Settings Saved!
          </span>
        )}
      </div>

      {/* Global Display Settings Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-600" /> Storefront Tax Display Policy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTogglePricesIncludeTax(false)}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              !pricesIncludeTax 
                ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Prices Entered Exclusive of Tax</span>
              {!pricesIncludeTax && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Product prices in catalog exclude tax. Applicable regional tax is added transparently during checkout.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleTogglePricesIncludeTax(true)}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              pricesIncludeTax 
                ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Prices Entered Inclusive of Tax</span>
              {pricesIncludeTax && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Product prices in catalog already include tax. The invoice explicitly itemizes the tax portion.
            </p>
          </button>
        </div>
      </div>

      {/* Main Tax Classes Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tax Classes Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Tax Classes
            </h3>

            <div className="space-y-2">
              {taxClasses.map(c => {
                const isActive = c.id === activeClassId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveClassId(c.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className={`font-bold text-xs ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {c.name}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400">{c.slug}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/60 text-slate-700">
                      {c.rules.length} {c.rules.length === 1 ? 'Rule' : 'Rules'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tax Calculator Simulator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs text-slate-900">Tax Invoice Calculator</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sample Cart Subtotal ($)</label>
                <input
                  type="number"
                  value={testSubtotal}
                  onChange={(e) => setTestSubtotal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Cart Net Amount:</span>
                  <span className="font-bold">${Number(testSubtotal || 0).toFixed(2)}</span>
                </div>
                {testResults.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.ruleName} ({item.ratePercent}%):</span>
                    <span className="font-mono text-indigo-600">+${item.taxAmount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Payable:</span>
                  <span className="text-indigo-700">${testResults.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Tax Class Rules */}
        <div className="lg:col-span-8 space-y-4">
          {activeClass && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{activeClass.name} Rules</h3>
                  <p className="text-xs text-slate-500">Jurisdiction rate rules applied for this class</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  id="btn-add-tax-rule"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tax Rule</span>
                </button>
              </div>

              {activeClass.rules.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <Percent className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No tax rules defined for this class</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="p-3 font-bold">Rule Name</th>
                        <th className="p-3 font-bold">Country / State</th>
                        <th className="p-3 font-bold">Rate (%)</th>
                        <th className="p-3 font-bold">Compound</th>
                        <th className="p-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeClass.rules.map(rule => (
                        <tr key={rule.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{rule.name}</td>
                          <td className="p-3 font-medium text-slate-600">{rule.country} / {rule.state || '*'}</td>
                          <td className="p-3 font-mono font-bold text-indigo-700">{rule.ratePercent}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rule.isCompound ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {rule.isCompound ? 'Compound' : 'Standard'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(activeClass.id, rule.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Modal: Add Tax Rule */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Add Rule to {activeClass?.name}</h3>
            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Sales VAT 10%"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country Code (* for all)</label>
                  <input
                    type="text"
                    placeholder="e.g. US, CA, *"
                    value={ruleCountry}
                    onChange={(e) => setRuleCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={ruleRate}
                    onChange={(e) => setRuleRate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-compound"
                  checked={ruleIsCompound}
                  onChange={(e) => setRuleIsCompound(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label htmlFor="chk-compound" className="font-bold text-slate-700">
                  Compound Tax (applied on top of preceding taxes)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
