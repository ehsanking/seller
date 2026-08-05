import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Key, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Check, 
  RotateCw, 
  Sparkles, 
  Camera,
  Lock,
  Save
} from 'lucide-react';
import { AdminProfile } from '../types';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: AdminProfile | null;
  onSaveProfile?: (updated: AdminProfile) => Promise<void>;
  onProfileUpdated?: (profile: AdminProfile) => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  profile: initialProfile,
  onSaveProfile,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<AdminProfile | null>(initialProfile || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    } else if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, initialProfile]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setSavedSuccess(true);
        if (onProfileUpdated) onProfileUpdated(updated);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  const regenerateApiKey = () => {
    if (!profile) return;
    const newKey = `slr_admin_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setProfile({ ...profile, apiKey: newKey });
  };

  const copyKeyToClipboard = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admin Profile & Account Settings</h2>
              <p className="text-xs text-slate-400">Manage administrator credentials, security, and preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading || !profile ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
            <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading profile credentials...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
            {savedSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admin profile and security settings updated successfully!</span>
              </div>
            )}

            {/* Profile Picture & Avatar */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative group shrink-0">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-indigo-500/20" 
                />
                <button
                  type="button"
                  onClick={() => {
                    const sampleAvatars = [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
                    ];
                    const next = sampleAvatars[(sampleAvatars.indexOf(profile.avatarUrl) + 1) % sampleAvatars.length];
                    setProfile({ ...profile, avatarUrl: next });
                  }}
                  className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Click to rotate avatar avatar"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{profile.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                    {profile.roleName}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{profile.email}</p>
                <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2FA Active</span>
                  </span>
                  <span>•</span>
                  <span>ID: {profile.id}</span>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio & Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Role Bio & Notes</label>
              <textarea 
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief summary of your administrative duties"
              />
            </div>

            {/* Security & 2FA Section */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={profile.twoFactorEnabled}
                    onChange={(e) => setProfile({ ...profile, twoFactorEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                Enforces TOTP 2FA verification codes on administrator login to prevent unauthorized access.
              </p>
            </div>

            {/* API Secret Key */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Personal Admin API Token</span>
                </label>
                <button
                  type="button"
                  onClick={regenerateApiKey}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Regenerate Token</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type={showApiKey ? "text" : "password"} 
                  value={profile.apiKey}
                  readOnly
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  onClick={copyKeyToClipboard}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  {copiedKey ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
