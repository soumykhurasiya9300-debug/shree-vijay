import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { adminLogin } from '../../lib/api.ts';

interface AdminLoginProps {
  onLoginSuccess: (admin: any) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockedUntilSeconds, setLockedUntilSeconds] = useState<number | null>(null);

  // Live countdown timer for lockout
  useEffect(() => {
    if (lockedUntilSeconds === null || lockedUntilSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockedUntilSeconds((prev) => {
        if (prev === null || prev <= 1) {
          setError(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntilSeconds]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntilSeconds && lockedUntilSeconds > 0) return;

    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(password);
      if (res.success && res.admin) {
        onLoginSuccess(res.admin);
      }
    } catch (err: any) {
      if (err.status === 429) {
        // Enforced 5-minute lockout requirement
        const secs = err.data?.remainingSeconds || 300;
        setLockedUntilSeconds(secs);
        setError(err.data?.error || `Too many failed attempts. Please try again in ${formatTime(secs)}.`);
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl border border-[#E8DFD3] overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-[#1C1611] text-white text-center">
          <div className="w-12 h-12 rounded-full bg-[#B48448]/20 border border-[#B48448] flex items-center justify-center mx-auto mb-3 text-[#E0B97B]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-wider">
            Shree Vijay Showroom
          </h2>
          <p className="text-xs text-[#A89D8F] mt-1 tracking-wider uppercase font-sans">
            Business Management & CRM Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Lockout Banner */}
          {lockedUntilSeconds !== null && lockedUntilSeconds > 0 ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm text-center space-y-2 mb-4">
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Account Temporarily Locked</span>
              </div>
              <p className="text-xs font-mono font-bold text-red-700 text-base">
                Too many failed attempts. Please try again in {formatTime(lockedUntilSeconds)}.
              </p>
              <p className="text-[11px] text-red-600">
                Security lockout is strictly enforced server-side after 4 consecutive failed attempts.
              </p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1611] uppercase tracking-wider mb-1.5">
                Administrator Password
              </label>
              <input
                type="password"
                required
                disabled={lockedUntilSeconds !== null && lockedUntilSeconds > 0}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <span className="text-[11px] text-[#7A6E5F] block mt-1">
                Initial credential: <code className="bg-[#EFE9DF] px-1.5 py-0.5 rounded text-[#1C1611]">clothing9300</code>
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="w-1/2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#6B5E50] hover:text-[#1C1611] border border-[#D8CEBE] rounded-xs transition-colors"
              >
                Back to Store
              </button>

              <button
                type="submit"
                disabled={loading || (lockedUntilSeconds !== null && lockedUntilSeconds > 0)}
                className="w-1/2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-[#E8DFD3] flex items-center gap-2 text-[11px] text-[#7A6E5F]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted server authentication with rate-limiting & session auditing.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
