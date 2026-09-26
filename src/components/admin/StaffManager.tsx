import React, { useState } from 'react';
import { UserCheck, Plus, Shield, X } from 'lucide-react';
import { Staff } from '../../types/index.ts';
import { createAdminStaff } from '../../lib/api.ts';

interface StaffManagerProps {
  staffList: Staff[];
  onRefresh: () => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({ staffList, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'SUPER ADMIN' | 'MANAGER' | 'SALES STAFF' | 'INVENTORY STAFF'>('SALES STAFF');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminStaff({
        name,
        phone,
        email,
        username,
        role,
      });
      setShowModal(false);
      setName('');
      setPhone('');
      setEmail('');
      setUsername('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Staff Team & Access Control</h3>
          <p className="text-xs text-[#7A6E5F]">
            Super Admin, Showroom Manager, Sales Staff, and Inventory Staff role-based authorizations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                    st.role === 'SUPER ADMIN'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : st.role === 'MANAGER'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {st.role}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">● Active</span>
              </div>

              <h4 className="text-base font-bold text-[#1C1611]">{st.name}</h4>
              <p className="text-xs text-[#5A5044] font-mono mt-0.5">@{st.username}</p>

              <div className="mt-4 pt-3 border-t border-[#F0E8DC] text-xs space-y-1 text-[#6E6356]">
                <p>Phone: {st.phone || '—'}</p>
                <p>Email: {st.email || '—'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1C1611]">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role & Permissions *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                >
                  <option value="SALES STAFF">SALES STAFF (Enquiries, Customers, Follow-ups)</option>
                  <option value="MANAGER">MANAGER (Products, Orders, Billing, Inventory, Enquiries)</option>
                  <option value="INVENTORY STAFF">INVENTORY STAFF (Products & Stock Thresholds)</option>
                  <option value="SUPER ADMIN">SUPER ADMIN (Full Store Access)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-[#5A5044]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 uppercase tracking-wider font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs"
                >
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
