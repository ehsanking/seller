import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  MapPin, 
  DollarSign, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit, 
  Calculator, 
  Globe, 
  ShieldCheck, 
  Info, 
  PackageCheck,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { ShippingZone, ShippingMethod, ShippingMethodType } from '../types';

const INITIAL_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Domestic Shipping (Standard Zone)',
    regions: ['United States', 'Canada', 'Domestic Regional'],
    postcodes: ['10001-99999', 'M5V *'],
    methods: [
      {
        id: 'method-101',
        title: 'Standard Ground Delivery',
        type: 'flat_rate',
        cost: 12.00,
        enabled: true,
        estimatedDays: '3-5 Business Days',
        description: 'Standard reliable courier delivery across domestic zones.'
      },
      {
        id: 'method-102',
        title: 'Free Shipping Threshold',
        type: 'free_shipping',
        cost: 0,
        minOrderAmount: 99.00,
        enabled: true,
        estimatedDays: '3-5 Business Days',
        description: 'Automatically unlocked when order cart total reaches $99.'
      },
      {
        id: 'method-103',
        title: 'Express Overnight Courier',
        type: 'flat_rate',
        cost: 29.50,
        enabled: true,
        estimatedDays: '1 Business Day',
        description: 'Priority handling with guaranteed next-day delivery.'
      }
    ]
  },
  {
    id: 'zone-2',
    name: 'Local Store Pickup & Branch Express',
    regions: ['Local Metro Area', 'Branch Radius 25km'],
    postcodes: ['*'],
    methods: [
      {
        id: 'method-201',
        title: 'In-Store Pickup at Main Branch',
        type: 'local_pickup',
        cost: 0,
        enabled: true,
        estimatedDays: 'Ready in 2 Hours',
        description: 'Collect your order directly from our main branch fulfillment center.'
      }
    ]
  },
  {
    id: 'zone-3',
    name: 'International Air Freight',
    regions: ['Europe (EU)', 'United Kingdom', 'Australia & NZ', 'Worldwide Rest'],
    methods: [
      {
        id: 'method-301',
        title: 'International Priority Freight',
        type: 'weight_based',
        cost: 35.00,
        costPerKg: 4.50,
        enabled: true,
        estimatedDays: '5-10 Business Days',
        description: 'Global express freight rate calculated per kilogram.'
      }
    ]
  }
];

export const ShippingView: React.FC = () => {
  const [zones, setZones] = useState<ShippingZone[]>(() => {
    const saved = localStorage.getItem('seller_shipping_zones');
    return saved ? JSON.parse(saved) : INITIAL_SHIPPING_ZONES;
  });

  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0]?.id || '');
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Zone Form
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRegions, setNewZoneRegions] = useState('');

  // New Method Form
  const [methodTitle, setMethodTitle] = useState('');
  const [methodType, setMethodType] = useState<ShippingMethodType>('flat_rate');
  const [methodCost, setMethodCost] = useState('15.00');
  const [methodMinOrder, setMethodMinOrder] = useState('100.00');
  const [methodCostPerKg, setMethodCostPerKg] = useState('3.50');
  const [methodDays, setMethodDays] = useState('2-4 Days');

  // Calculator Sandbox
  const [testAmount, setTestAmount] = useState('120.00');
  const [testWeight, setTestWeight] = useState('2.5');
  const [testZoneId, setTestZoneId] = useState<string>(zones[0]?.id || '');

  const saveToStorage = (updated: ShippingZone[]) => {
    setZones(updated);
    localStorage.setItem('seller_shipping_zones', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    const newZone: ShippingZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      regions: newZoneRegions.split(',').map(r => r.trim()).filter(Boolean),
      methods: [
        {
          id: `method-${Date.now()}`,
          title: 'Standard Flat Shipping',
          type: 'flat_rate',
          cost: 10.00,
          enabled: true,
          estimatedDays: '3-5 Days'
        }
      ]
    };

    const updated = [...zones, newZone];
    saveToStorage(updated);
    setActiveZoneId(newZone.id);
    setNewZoneName('');
    setNewZoneRegions('');
    setIsAddZoneOpen(false);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (zones.length <= 1) return;
    const updated = zones.filter(z => z.id !== zoneId);
    saveToStorage(updated);
    if (activeZoneId === zoneId) {
      setActiveZoneId(updated[0].id);
    }
  };

  const handleCreateMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeZone || !methodTitle.trim()) return;

    const newMethod: ShippingMethod = {
      id: `method-${Date.now()}`,
      title: methodTitle.trim(),
      type: methodType,
      cost: methodType === 'free_shipping' || methodType === 'local_pickup' ? 0 : Number(methodCost) || 0,
      enabled: true,
      minOrderAmount: methodType === 'free_shipping' ? Number(methodMinOrder) || 0 : undefined,
      costPerKg: methodType === 'weight_based' ? Number(methodCostPerKg) || 0 : undefined,
      estimatedDays: methodDays || '2-5 Days'
    };

    const updated = zones.map(z => {
      if (z.id === activeZone.id) {
        return { ...z, methods: [...z.methods, newMethod] };
      }
      return z;
    });

    saveToStorage(updated);
    setMethodTitle('');
    setIsAddMethodOpen(false);
  };

  const handleToggleMethod = (zoneId: string, methodId: string) => {
    const updated = zones.map(z => {
      if (z.id === zoneId) {
        return {
          ...z,
          methods: z.methods.map(m => m.id === methodId ? { ...m, enabled: !m.enabled } : m)
        };
      }
      return z;
    });
    saveToStorage(updated);
  };

  const handleDeleteMethod = (zoneId: string, methodId: string) => {
    const updated = zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, methods: z.methods.filter(m => m.id !== methodId) };
      }
      return z;
    });
    saveToStorage(updated);
  };

  // Calculator Sandbox Logic
  const calculateTestShipping = () => {
    const targetZone = zones.find(z => z.id === testZoneId);
    if (!targetZone) return [];

    const orderVal = Number(testAmount) || 0;
    const weightVal = Number(testWeight) || 0;

    return targetZone.methods.filter(m => m.enabled).map(m => {
      let finalCost = m.cost;
      let isEligible = true;
      let note = '';

      if (m.type === 'free_shipping') {
        const threshold = m.minOrderAmount || 0;
        if (orderVal >= threshold) {
          finalCost = 0;
          note = `Unlocked (Cart total $${orderVal.toFixed(2)} ≥ $${threshold.toFixed(2)})`;
        } else {
          isEligible = false;
          note = `Requires $${(threshold - orderVal).toFixed(2)} more to qualify for free shipping`;
        }
      } else if (m.type === 'weight_based') {
        const extraWeightCost = weightVal * (m.costPerKg || 0);
        finalCost = m.cost + extraWeightCost;
        note = `Base $${m.cost.toFixed(2)} + ($${m.costPerKg?.toFixed(2)}/kg × ${weightVal}kg = $${extraWeightCost.toFixed(2)})`;
      } else if (m.type === 'local_pickup') {
        finalCost = 0;
        note = 'Free store pickup';
      } else {
        note = 'Flat rate delivery';
      }

      return {
        id: m.id,
        title: m.title,
        type: m.type,
        estimatedDays: m.estimatedDays,
        finalCost,
        isEligible,
        note
      };
    });
  };

  const calculationResults = calculateTestShipping();

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">Shipping Zones & Rates Manager</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">
                WooCommerce Equiv
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure multi-zone freight rules, flat rates, free shipping thresholds, and local branch pickup options.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Shipping Config Saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsAddZoneOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            id="btn-add-shipping-zone"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shipping Zone</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shipping Zones List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" /> Configured Zones ({zones.length})
              </h3>
            </div>

            <div className="space-y-2">
              {zones.map(z => {
                const isActive = z.id === activeZoneId;
                const activeMethodsCount = z.methods.filter(m => m.enabled).length;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setActiveZoneId(z.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20 shadow-2xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs truncate ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                          {z.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {z.regions.join(', ') || 'Global Everywhere'}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-mono">
                          {z.methods.length} {z.methods.length === 1 ? 'Method' : 'Methods'}
                        </span>
                        <span className="text-[9px] font-semibold text-emerald-600">
                          {activeMethodsCount} Active
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Shipping Rate Sandbox Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs text-slate-900">Rate Calculation Sandbox</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Zone</label>
                <select
                  value={testZoneId}
                  onChange={(e) => setTestZoneId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 text-xs"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Order Total ($)</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={testWeight}
                    onChange={(e) => setTestWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Available Rates:</span>
                {calculationResults.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No enabled shipping methods in this zone.</p>
                ) : (
                  calculationResults.map(res => (
                    <div 
                      key={res.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-0.5 ${
                        res.isEligible ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{res.title}</span>
                        <span className="font-mono text-indigo-700">
                          {res.finalCost === 0 ? 'FREE' : `$${res.finalCost.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{res.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Zone Methods Details & Management */}
        <div className="lg:col-span-8 space-y-4">
          {activeZone && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              
              {/* Zone Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" /> {activeZone.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Regions: <span className="font-semibold text-slate-700">{activeZone.regions.join(', ')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMethodOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    id="btn-add-method-to-zone"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Shipping Method</span>
                  </button>

                  {zones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteZone(activeZone.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete shipping zone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Methods List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" /> Configured Shipping Methods ({activeZone.methods.length})
                </h4>

                {activeZone.methods.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No shipping methods in this zone</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Add a flat rate, free shipping threshold, or local pickup option.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeZone.methods.map(method => (
                      <div 
                        key={method.id}
                        className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          method.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-slate-900">{method.title}</h5>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              method.type === 'free_shipping' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              method.type === 'local_pickup' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              method.type === 'weight_based' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                              {method.type.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {method.description || 'Configured delivery method.'}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium pt-1">
                            <span className="font-mono font-bold text-slate-900">
                              Cost: {method.cost === 0 ? 'Free' : `$${method.cost.toFixed(2)}`}
                              {method.costPerKg ? ` (+ $${method.costPerKg.toFixed(2)}/kg)` : ''}
                            </span>
                            {method.minOrderAmount ? (
                              <span className="text-indigo-600 font-bold">
                                Free on orders ≥ ${method.minOrderAmount.toFixed(2)}
                              </span>
                            ) : null}
                            <span className="text-slate-400">Transit: {method.estimatedDays || 'Standard'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleMethod(activeZone.id, method.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              method.enabled 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {method.enabled ? 'Enabled' : 'Disabled'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMethod(activeZone.id, method.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Modal: Add New Zone */}
      {isAddZoneOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Create New Shipping Zone</h3>
            <form onSubmit={handleCreateZone} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  placeholder="e.g. North America West, European Union"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Covered Regions (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. California, Oregon, Washington"
                  value={newZoneRegions}
                  onChange={(e) => setNewZoneRegions(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddZoneOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shipping Method */}
      {isAddMethodOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Add Method to {activeZone?.name}</h3>
            <form onSubmit={handleCreateMethod} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Method Title</label>
                <input
                  type="text"
                  placeholder="e.g. Express Courier, Local Pickup"
                  value={methodTitle}
                  onChange={(e) => setMethodTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Method Type</label>
                <select
                  value={methodType}
                  onChange={(e) => setMethodType(e.target.value as ShippingMethodType)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800"
                >
                  <option value="flat_rate">Flat Rate Shipping</option>
                  <option value="free_shipping">Free Shipping Threshold</option>
                  <option value="weight_based">Weight-Based Freight Rate</option>
                  <option value="local_pickup">Local Store Branch Pickup</option>
                </select>
              </div>

              {methodType === 'flat_rate' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Shipping Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={methodCost}
                    onChange={(e) => setMethodCost(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              )}

              {methodType === 'free_shipping' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Order Amount for Free Shipping ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={methodMinOrder}
                    onChange={(e) => setMethodMinOrder(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              )}

              {methodType === 'weight_based' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Base Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={methodCost}
                      onChange={(e) => setMethodCost(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fee per kg ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={methodCostPerKg}
                      onChange={(e) => setMethodCostPerKg(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Delivery Time</label>
                <input
                  type="text"
                  placeholder="e.g. 2-4 Business Days"
                  value={methodDays}
                  onChange={(e) => setMethodDays(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMethodOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Add Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
