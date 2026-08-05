import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  RotateCw, 
  Lock, 
  UserCheck, 
  Key, 
  Info,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import { AdminRole, PermissionType } from '../types';

interface RolesManagementViewProps {
  roles?: AdminRole[];
  onSaveRole?: (roleData: Partial<AdminRole>) => Promise<void>;
  onDeleteRole?: (roleId: string) => Promise<void>;
}

export const RolesManagementView: React.FC<RolesManagementViewProps> = ({
  roles: initialRoles,
  onSaveRole,
  onDeleteRole
}) => {
  const [roles, setRoles] = useState<AdminRole[]>(initialRoles || []);
  const [loading, setLoading] = useState(!initialRoles || initialRoles.length === 0);

  useEffect(() => {
    if (initialRoles && initialRoles.length > 0) {
      setRoles(initialRoles);
      setLoading(false);
    } else {
      fetchRoles();
    }
  }, [initialRoles]);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('indigo');
  const [newRolePermissions, setNewRolePermissions] = useState<PermissionType[]>([
    'view_dashboard',
    'manage_orders'
  ]);

  const allPermissions: { key: PermissionType; label: string; desc: string }[] = [
    { key: 'view_dashboard', label: 'View Dashboard & Telemetry', desc: 'Access overview KPIs, revenue charts, and live health metrics' },
    { key: 'manage_products', label: 'Manage Products & Stock', desc: 'Create, edit, delete product inventory and set low stock alerts' },
    { key: 'manage_orders', label: 'Manage Sales Orders', desc: 'View orders, process fulfillments, issue refunds, and print labels' },
    { key: 'manage_customers', label: 'Manage Customer Directory', desc: 'Access customer contact details, order histories, and notes' },
    { key: 'manage_analytics', label: 'Manage Financial Analytics', desc: 'Export sales reports, profit margins, and customer lifetime values' },
    { key: 'manage_plugins', label: 'Manage Extensions & Plugins', desc: 'Install, configure, enable or disable payment & security plugins' },
    { key: 'manage_templates', label: 'Manage Storefront Templates', desc: 'Activate storefront templates and edit CSS customizer variables' },
    { key: 'manage_webhooks', label: 'Manage API Webhooks', desc: 'Add webhook endpoints, inspect delivery logs, and trigger test pings' },
    { key: 'manage_settings', label: 'Manage Store Settings', desc: 'Configure store currency, taxes, domain URLs, and general metadata' },
    { key: 'manage_roles', label: 'Manage Admin Team Roles', desc: 'Create custom roles and modify team member access permissions' },
    { key: 'export_data', label: 'Export Inventory & Orders CSV', desc: 'Permission to download date-segmented CSV transaction logs' },
    { key: 'api_access', label: 'REST API Developer Access', desc: 'Query raw database REST endpoints and inspect telemetry logs' },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/roles');
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
        if (data.length > 0) setSelectedRole(data[0]);
      }
    } catch (err) {
      console.error('Failed to load admin roles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (permissionKey: PermissionType) => {
    if (!selectedRole || selectedRole.isSystemRole) return;
    const current = selectedRole.permissions;
    const updatedPermissions = current.includes(permissionKey)
      ? current.filter(p => p !== permissionKey)
      : [...current, permissionKey];

    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);

    // Save to backend
    fetch(`/api/admin/roles/${selectedRole.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: updatedPermissions })
    }).then(() => {
      setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
    });
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoleName,
          description: newRoleDesc,
          permissions: newRolePermissions,
          color: newRoleColor
        })
      });
      if (res.ok) {
        const created = await res.json();
        setRoles([...roles, created]);
        setSelectedRole(created);
        setIsAddingRole(false);
        setNewRoleName('');
        setNewRoleDesc('');
      }
    } catch (err) {
      console.error('Failed to create role', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this custom admin role?')) return;
    try {
      const res = await fetch(`/api/admin/roles/${roleId}`, { method: 'DELETE' });
      if (res.ok) {
        const filtered = roles.filter(r => r.id !== roleId);
        setRoles(filtered);
        if (selectedRole?.id === roleId) {
          setSelectedRole(filtered[0] || null);
        }
      }
    } catch (err) {
      console.error('Failed to delete role', err);
    }
  };

  const getColorBadge = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'emerald': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Team Roles & Permissions Center</h1>
            <p className="text-xs text-slate-500">Define role-based access control (RBAC) and assign granular API capabilities</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingRole(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 gap-3">
          <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-semibold">Loading role access policies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Roles List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Configured Roles ({roles.length})</h3>
            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50/60 border-indigo-300 shadow-sm ring-1 ring-indigo-500/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getColorBadge(role.color)}`}>
                          {role.name}
                        </span>
                        {role.isSystemRole && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            <Lock className="w-3 h-3 text-slate-400" />
                            System
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        {role.userCount} Users
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{role.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{role.permissions.length} Permissions Active</span>
                      {!role.isSystemRole && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete custom role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions Matrix Main Panel */}
          <div className="lg:col-span-8">
            {selectedRole ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-slate-900">{selectedRole.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getColorBadge(selectedRole.color)}`}>
                        {selectedRole.permissions.length} Active Permissions
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
                  </div>

                  {selectedRole.isSystemRole && (
                    <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>System Protected Role</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Granular Capabilities Matrix</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allPermissions.map((perm) => {
                      const isGranted = selectedRole.permissions.includes(perm.key);
                      const isLocked = selectedRole.isSystemRole;

                      return (
                        <div
                          key={perm.key}
                          onClick={() => !isLocked && handleTogglePermission(perm.key)}
                          className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                            isGranted 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : 'bg-slate-50/60 border-slate-200'
                          } ${!isLocked ? 'cursor-pointer hover:border-indigo-300' : 'cursor-default'}`}
                        >
                          <div className={`mt-0.5 ${isGranted ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isGranted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900">{perm.label}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{perm.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                Select a role from the left sidebar to view or modify permissions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Role Modal */}
      {isAddingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">Create Custom Admin Role</h2>
              <button onClick={() => setIsAddingRole(false)} className="text-slate-400 hover:text-slate-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs font-medium text-slate-800">
              <div>
                <label className="block font-semibold mb-1">Role Title</label>
                <input 
                  type="text"
                  placeholder="e.g., Regional Fulfillment Specialist"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role Description</label>
                <textarea 
                  rows={2}
                  placeholder="Responsibilities and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Color Badge</label>
                <div className="flex items-center gap-2">
                  {['indigo', 'emerald', 'blue', 'amber', 'purple'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewRoleColor(c)}
                      className={`px-3 py-1 rounded-lg border text-xs capitalize font-bold ${newRoleColor === c ? getColorBadge(c) + ' ring-2 ring-indigo-500' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingRole(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  {saving ? 'Creating...' : 'Save Custom Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
