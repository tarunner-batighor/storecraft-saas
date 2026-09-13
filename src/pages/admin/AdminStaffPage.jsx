import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatDate } from '../../utils/formatters';
import {
  UserCheck,
  Plus,
  Trash2,
  Shield,
  Check,
  X,
  Mail,
  Phone
} from 'lucide-react';

export default function AdminStaffPage() {
  const { currentTenant, currentSlug } = useTenant();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add staff modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123',
    permissions: ['orders.read', 'orders.write', 'products.read']
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tenant/staff');
      if (res.success && res.staff) {
        setStaffList(res.staff);
      }
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentSlug]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/tenant/staff', formData);
      if (res.success) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', password: 'password123', permissions: ['orders.read', 'orders.write', 'products.read'] });
        fetchStaff();
      }
    } catch (err) {
      setError(err.message || 'Failed to add staff member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Remove staff access for ${name}?`)) return;
    try {
      await api.del(`/tenant/staff/${id}`);
      setStaffList(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const availablePermissions = [
    { key: 'orders.read', label: 'View Customer Orders' },
    { key: 'orders.write', label: 'Update Status & Book Courier' },
    { key: 'products.read', label: 'View Products & Inventory' },
    { key: 'products.write', label: 'Create & Edit Products' },
    { key: 'inventory.manage', label: 'Quick Stock Level Adjust' },
    { key: 'coupons.manage', label: 'Manage Promo Coupons' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-sky-500" />
            <span>Store Staff & Role-Based Access (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Invite warehouse team members, order processing managers & inventory clerks with granular permission controls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Invite New Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-4">Staff Member</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Role</th>
              <th className="p-4">Permissions Assigned</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading staff directory...</td></tr>
            ) : staffList.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No staff members found.</td></tr>
            ) : (
              staffList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={st.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={st.name}
                      className="w-9 h-9 rounded-full object-cover bg-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {st.id.slice(0, 10)}</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{st.email}</div>
                    <div className="text-[11px] text-slate-400">{st.phone || 'No phone'}</div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      st.role === 'store_owner' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-sky-100 text-sky-800 border-sky-200'
                    }`}>
                      {st.role?.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {st.permissions?.includes('all') ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Full Admin Access</span>
                      ) : (
                        st.permissions?.map((p, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    {st.role !== 'store_owner' && (
                      <button
                        onClick={() => handleDeleteStaff(st.id, st.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Revoke Staff Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Invite New Staff Member</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sadman Sakib"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@gadgetvibe.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Assign Permissions</label>
                <div className="space-y-1.5">
                  {availablePermissions.map((perm) => (
                    <label key={perm.key} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span>{perm.label} (<code>{perm.key}</code>)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-black"
                >
                  {saving ? 'Creating...' : 'Grant Staff Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
