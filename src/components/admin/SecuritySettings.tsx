import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { changePassword } from '../../lib/api.ts';

export const SecuritySettings: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs">
        <h3 className="text-base font-bold text-[#1C1611]">Security & Password Controls</h3>
        <p className="text-xs text-[#7A6E5F]">
          Manage administrator login credentials and view active security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-sm border border-[#E8DFD3] shadow-xs space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1611] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#B48448]" />
            <span>Update Admin Password</span>
          </h4>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">New Password (min 6 characters) *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] disabled:opacity-50 rounded-xs shadow-xs"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Policy Card */}
        <div className="bg-[#F7F4EE] p-6 rounded-sm border border-[#E8DFD3] space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1611] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Enforced Security Requirements</span>
          </h4>

          <div className="space-y-3 text-xs text-[#5A5044] leading-relaxed">
            <div className="p-3 bg-white rounded-xs border border-[#E8DFD3]">
              <span className="font-bold text-[#1C1611] block mb-1">
                4-Attempt Failed Login Lockout:
              </span>
              <p>
                After 4 consecutive incorrect login attempts, the account is locked for 5 minutes.
                Display: <code className="bg-[#F0E8DC] px-1 py-0.5 rounded">"Too many failed attempts. Please try again in MM:SS."</code>
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                ✓ Enforced server-side via SQLite login_attempts table.
              </span>
            </div>

            <div className="p-3 bg-white rounded-xs border border-[#E8DFD3]">
              <span className="font-bold text-[#1C1611] block mb-1">
                Bcrypt Password Hashing:
              </span>
              <p>
                Passwords are never stored in plaintext and never transmitted in public API responses.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xs border border-[#E8DFD3]">
              <span className="font-bold text-[#1C1611] block mb-1">
                Session Token Expiry:
              </span>
              <p>
                Admin sessions expire after 24 hours of inactivity or on explicit sign out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
