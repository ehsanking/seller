import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Store, 
  Info, 
  AlertCircle, 
  Map as MapIcon,
  Navigation,
  Star,
  Settings,
  Layers
} from 'lucide-react';
import { StoreSettings, StoreBranch } from '../types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

// Read API key from environment
const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY';

interface BranchesViewProps {
  settings: StoreSettings;
  onSaveSettings: (updated: StoreSettings) => void;
}

// Custom OpenStreetMap Component using Leaflet CDN
const OsmMap: React.FC<{
  branches: StoreBranch[];
  selectedBranchId: string | null;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  onMapClick: (lat: number, lng: number) => void;
  onSelectBranch: (id: string) => void;
  isAddingOrEditing: boolean;
}> = ({ branches, selectedBranchId, mapCenter, mapZoom, onMapClick, onSelectBranch, isAddingOrEditing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.id = 'leaflet-css';
    document.head.appendChild(cssLink);

    const jsScript = document.createElement('script');
    jsScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    jsScript.async = true;
    jsScript.id = 'leaflet-js';
    jsScript.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(jsScript);

    return () => {
      // Keep loaded to prevent flicker, but cleanup containers on unmount
    };
  }, []);

  // Initialize and sync map view
  useEffect(() => {
    if (!leafletLoaded || !containerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([mapCenter.lat, mapCenter.lng], mapZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      map.on('click', (e: any) => {
        if (isAddingOrEditing) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
    } else {
      mapInstanceRef.current.setView([mapCenter.lat, mapCenter.lng], mapZoom);
    }
  }, [leafletLoaded, mapCenter, mapZoom, isAddingOrEditing]);

  // Sync Markers and Popups
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.keys(markersRef.current).forEach(id => {
      markersRef.current[id].remove();
    });
    markersRef.current = {};

    // Render new markers
    branches.forEach(branch => {
      const isSelected = selectedBranchId === branch.id;
      const markerColor = branch.isMain ? '#ea580c' : '#4f46e5';
      
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${markerColor}" width="32" height="32" style="filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      const icon = L.divIcon({
        html: svgIcon,
        className: 'custom-osm-marker-wrapper',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([branch.latitude, branch.longitude], { icon }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; text-align: left; min-width: 160px;">
          <h6 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #1e293b;">
            ${branch.name} ${branch.isMain ? '<span style="background:#ffedd5;color:#ea580c;font-size:9px;padding:2px 6px;border-radius:6px;margin-left:4px;font-weight:800;">MAIN</span>' : ''}
          </h6>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; line-height: 1.4;">
            ${branch.address}
          </p>
          ${branch.phone ? `<p style="margin: 0; font-size: 10px; color: #4f46e5; font-weight: 600;">☎ ${branch.phone}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectBranch(branch.id);
      });

      markersRef.current[branch.id] = marker;

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [leafletLoaded, branches, selectedBranchId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500 text-xs font-semibold">
          Loading OpenStreetMap tiles...
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 1 }} />
    </div>
  );
};

export const BranchesView: React.FC<BranchesViewProps> = ({ settings, onSaveSettings }) => {
  const [branches, setBranches] = useState<StoreBranch[]>(settings.branches || []);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    settings.branches && settings.branches.length > 0 ? settings.branches[0].id : null
  );

  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 52.5072, lng: 13.3905 }); // default coordinates (Berlin, Germany)
  const [mapZoom, setMapZoom] = useState(12);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>(hasValidKey ? 'google' : 'osm');

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<StoreBranch, 'id'>>({
    name: '',
    address: '',
    phone: '',
    latitude: 52.5072,
    longitude: 13.3905,
    isMain: false
  });

  // Update center when selection changes
  useEffect(() => {
    if (selectedBranchId) {
      const branch = branches.find(b => b.id === selectedBranchId);
      if (branch) {
        setMapCenter({ lat: Number(branch.latitude), lng: Number(branch.longitude) });
        setMapZoom(14);
        setInfoWindowOpen(true);
      }
    }
  }, [selectedBranchId, branches]);

  const saveBranches = (updatedBranches: StoreBranch[]) => {
    setBranches(updatedBranches);
    onSaveSettings({
      ...settings,
      branches: updatedBranches
    });
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
      isMain: branches.length === 0
    });
    setEditingBranchId(null);
    setIsAdding(true);
  };

  const handleEditClick = (branch: StoreBranch) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      latitude: Number(branch.latitude),
      longitude: Number(branch.longitude),
      isMain: branch.isMain
    });
    setEditingBranchId(branch.id);
    setIsAdding(false);
  };

  const handleDeleteClick = (id: string) => {
    const isDeletingMain = branches.find(b => b.id === id)?.isMain;
    let updated = branches.filter(b => b.id !== id);
    
    if (isDeletingMain && updated.length > 0) {
      updated[0].isMain = true;
    }
    
    saveBranches(updated);
    if (selectedBranchId === id) {
      setSelectedBranchId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSetMain = (id: string) => {
    const updated = branches.map(b => ({
      ...b,
      isMain: b.id === id
    }));
    saveBranches(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    if (editingBranchId) {
      const updated = branches.map(b => {
        if (b.id === editingBranchId) {
          return {
            ...b,
            ...formData,
            nameFa: formData.name, // sync Fa keys for backend safety
            addressFa: formData.address,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude)
          };
        }
        if (formData.isMain && b.id !== editingBranchId) {
          return { ...b, isMain: false };
        }
        return b;
      });
      saveBranches(updated);
      setEditingBranchId(null);
    } else {
      const newBranch: StoreBranch = {
        id: `branch_${Date.now()}`,
        ...formData,
        nameFa: formData.name,
        addressFa: formData.address,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude)
      };

      let updated = [...branches];
      if (newBranch.isMain) {
        updated = updated.map(b => ({ ...b, isMain: false }));
      }
      updated.push(newBranch);
      saveBranches(updated);
      setSelectedBranchId(newBranch.id);
      setIsAdding(false);
    }
  };

  const handleGoogleMapClick = (e: any) => {
    if (isAdding || editingBranchId) {
      const clickedLat = e.detail?.latLng?.lat || e.latLng?.lat();
      const clickedLng = e.detail?.latLng?.lng || e.latLng?.lng();
      if (clickedLat && clickedLng) {
        setFormData(prev => ({
          ...prev,
          latitude: Number(clickedLat.toFixed(6)),
          longitude: Number(clickedLng.toFixed(6))
        }));
      }
    }
  };

  const handleOsmMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6))
    }));
  };

  const activeBranch = branches.find(b => b.id === selectedBranchId);

  return (
    <div className="max-w-6xl space-y-6 pb-12 text-left" dir="ltr">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Branches & Store Locations</h3>
            <p className="text-xs text-slate-500 font-medium">Configure and manage your main storefront, physical retail outlets, and pickup points on the map</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Branches list and details form */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Add / Edit Form panel */}
          {(isAdding || editingBranchId) && (
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  {editingBranchId ? 'Edit Branch Details' : 'Add Physical Store Branch'}
                </span>
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingBranchId(null); }}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Branch Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Central Downtown Store"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 bg-slate-50/50"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Address <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 104 West Broadway, Suite 400, New York, NY"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isMainCheckbox"
                    checked={formData.isMain}
                    onChange={(e) => setFormData({ ...formData, isMain: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isMainCheckbox" className="text-xs font-bold text-slate-600 select-none cursor-pointer">Set as primary store location</label>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 flex items-start gap-2 text-[10px] text-indigo-700">
                  <Navigation className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">Tip: Click directly on the map container to pin coordinates live.</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Location Details</span>
                </button>
              </div>
            </form>
          )}

          {/* List of branches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Store Outlets ({branches.length})</h4>
            </div>

            {branches.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-3">
                <Store className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No branches have been registered yet.</p>
                <button
                  onClick={handleAddClick}
                  className="text-xs font-extrabold text-indigo-600 hover:underline"
                >
                  + Add First Branch
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {branches.map((b) => {
                  const isSelected = selectedBranchId === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 relative ${
                        isSelected 
                          ? 'bg-indigo-50/50 border-indigo-200 shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-extrabold text-xs text-slate-900">
                              {b.name}
                            </h5>
                            {b.isMain && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                                Main Store
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            {b.address}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditClick(b)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(b.id)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {b.phone || 'No Contact Number'}
                        </span>
                        {!b.isMain && (
                          <button
                            onClick={() => handleSetMain(b.id)}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            Set as Main Store
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: The interactive map view */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            
            {/* Map controller bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <MapIcon className="w-4 h-4 text-indigo-500" />
                Live Store Finder Map
              </span>

              {/* Map Provider Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Map Provider:
                </span>
                <div className="bg-slate-100 p-0.5 rounded-xl flex">
                  <button
                    type="button"
                    onClick={() => setMapProvider('osm')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
                      mapProvider === 'osm' 
                        ? 'bg-white text-indigo-600 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    OpenStreetMap (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapProvider('google')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
                      mapProvider === 'google' 
                        ? 'bg-white text-indigo-600 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Map view wrapper */}
            <div className="h-[520px] w-full rounded-2xl relative shadow-xs overflow-hidden border border-slate-200 bg-slate-50">
              {mapProvider === 'google' ? (
                hasValidKey ? (
                  <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
                    <Map
                      center={mapCenter}
                      zoom={mapZoom}
                      onClick={handleGoogleMapClick}
                      mapId="SELLER_HUB_LOCATOR"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {branches.map((b) => (
                        <AdvancedMarker
                          key={b.id}
                          position={{ lat: Number(b.latitude), lng: Number(b.longitude) }}
                          onClick={() => {
                            setSelectedBranchId(b.id);
                            setInfoWindowOpen(true);
                          }}
                        >
                          <Pin 
                            background={b.isMain ? '#ea580c' : '#4f46e5'} 
                            borderColor="#fff"
                            glyphColor="#fff"
                          />
                        </AdvancedMarker>
                      ))}

                      {infoWindowOpen && activeBranch && (
                        <InfoWindow
                          position={{ lat: Number(activeBranch.latitude), lng: Number(activeBranch.longitude) }}
                          onCloseClick={() => setInfoWindowOpen(false)}
                        >
                          <div className="p-2 text-left text-slate-800 max-w-[220px]">
                            <h6 className="font-extrabold text-xs text-indigo-600 flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5" />
                              {activeBranch.name}
                            </h6>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              {activeBranch.address}
                            </p>
                            {activeBranch.phone && (
                              <p className="text-[9px] text-slate-400 font-bold mt-1">
                                ☎ {activeBranch.phone}
                              </p>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </APIProvider>
                ) : (
                  // Nice fallback splash screen with instruction, easily switchable to OSM
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                    <div className="max-w-md space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900">Google Maps API Key Required</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          To display custom markers, geo-search and use full Google Maps styling, please configure your key. Or simply toggle the free <strong className="text-indigo-600">OpenStreetMap</strong> option above!
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block">How to configure your API key:</span>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-500 text-[11px]">
                          <li>Get an API key from <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">Google Cloud Console</a>.</li>
                          <li>Open the <strong className="text-slate-700">Settings panel (⚙️ gear icon)</strong> at the top right of this screen.</li>
                          <li>Go to <strong className="text-slate-700">Secrets</strong> section.</li>
                          <li>Add a secret named <code className="bg-slate-100 font-bold px-1 py-0.5 rounded font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> with your copied credentials.</li>
                        </ol>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMapProvider('osm')}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Use Free OpenStreetMap Instantly</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <OsmMap
                  branches={branches}
                  selectedBranchId={selectedBranchId}
                  mapCenter={mapCenter}
                  mapZoom={mapZoom}
                  onMapClick={handleOsmMapClick}
                  onSelectBranch={setSelectedBranchId}
                  isAddingOrEditing={isAdding || editingBranchId !== null}
                />
              )}
            </div>

            {/* Selected Coordinates Status */}
            {activeBranch && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected Location Coordinates:</span>
                  <div className="flex gap-4 text-xs text-slate-600 font-mono">
                    <span><strong>Latitude:</strong> {activeBranch.latitude}</span>
                    <span><strong>Longitude:</strong> {activeBranch.longitude}</span>
                  </div>
                </div>
                {(isAdding || editingBranchId) && (
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                    Click anywhere on the map to pin coords live
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
