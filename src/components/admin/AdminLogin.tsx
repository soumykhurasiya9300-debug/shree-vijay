import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { adminLogin } from '../../lib/api.ts';
import adminLoginBgImg from '../../assets/images/admin_login_bg.jpg';

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
        // Requirement 5: Exactly show "incorrect password"
        setError('incorrect password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Admin Panel Password Card Frame with Pinterest Background Image */}
      <div className="relative w-full max-w-md rounded-xs shadow-2xl border border-[#B89A5A]/50 overflow-hidden bg-[#0A0909]">
        {/* Pinterest Reference Image Background Layer (fits frame, high visibility) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={adminLoginBgImg}
            alt="Shree Vijay Admin Background"
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.1] saturate-[1.05]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://i.pinimg.com/originals/81/98/c9/8198c9fe48c8ccf1121aa84de1aecfed.jpg';
            }}
          />
          {/* Subtle balanced scrims to ensure high background visibility with excellent text contrast */}
          <div className="absolute inset-0 bg-[#0A0909]/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0909]/85 via-[#0A0909]/45 to-[#0A0909]/90" />
          <div className="absolute inset-0 bg-[#351019]/25 mix-blend-multiply" />
        </div>

        {/* Content Container (Layer z-10) */}
        <div className="relative z-10">
          {/* Top Header */}
          <div className="p-6 bg-[#0A0909]/60 border-b border-[#B89A5A]/25 text-white text-center">
            <div className="w-12 h-12 rounded-full bg-[#B89A5A]/20 border border-[#B89A5A] flex items-center justify-center mx-auto mb-3 text-[#D1B875] shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-widest text-[#F4EEE4]">
              Shree Vijay Showroom
            </h2>
            <p className="text-[11px] text-[#D1B875] mt-1 tracking-[0.2em] uppercase font-sans">
              Admin & Management Portal
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            {/* Lockout Banner (Limit of 5 attempts) */}
            {lockedUntilSeconds !== null && lockedUntilSeconds > 0 ? (
              <div className="p-4 bg-red-950/80 border border-red-500/40 text-red-200 rounded-xs text-center space-y-2 mb-5 backdrop-blur-xs">
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-red-400">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Account Temporarily Locked</span>
                </div>
                <p className="text-sm font-mono font-bold text-red-200">
                  Too many failed attempts. Please try again in {formatTime(lockedUntilSeconds)}.
                </p>
                <p className="text-[11px] text-red-300">
                  Security lockout is strictly enforced after 5 consecutive failed attempts.
                </p>
              </div>
            ) : error ? (
              /* Requirement 5: Display "incorrect password" without exposing wrong attempt */
              <div className="p-3 bg-red-950/85 border border-red-500/40 text-red-200 text-xs rounded-xs flex items-center gap-2 mb-5 backdrop-blur-xs shadow-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-medium tracking-wide">{error}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#D1B875] uppercase tracking-wider mb-2">
                  Administrator Password
                </label>
                {/* Requirement 3: Password is strictly masked, never exposed */}
                <input
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  disabled={lockedUntilSeconds !== null && lockedUntilSeconds > 0}
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#121011]/90 text-[#F4EEE4] placeholder-[#7A6E5F] border border-[#B89A5A]/40 rounded-xs focus:outline-hidden focus:border-[#D1B875] focus:ring-1 focus:ring-[#D1B875]/50 disabled:bg-black/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                />
                <div className="flex items-center justify-between text-[11px] text-[#A89D8F] mt-1.5 font-light">
                  <span>5 attempts allowed</span>
                  <span className="text-[#B89A5A]">Protected Portal</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#D1B875] hover:text-[#F4EEE4] hover:bg-white/5 border border-[#B89A5A]/40 rounded-xs transition-colors cursor-pointer"
                >
                  Back to Store
                </button>

                <button
                  type="submit"
                  disabled={loading || (lockedUntilSeconds !== null && lockedUntilSeconds > 0)}
                  className="w-1/2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#F4EEE4] bg-[#4A1724] hover:bg-[#351019] border border-[#B89A5A]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
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
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#BDB3A5]">
              <ShieldCheck className="w-4 h-4 text-[#D1B875] shrink-0" />
              <span>Encrypted server authentication with rate-limiting & session auditing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
