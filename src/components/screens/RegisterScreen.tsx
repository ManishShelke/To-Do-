import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RegisterScreen: React.FC = () => {
  const { registerWithEmail, setCurrentScreen, authError, setAuthError } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setAuthError(null);
    await registerWithEmail(email, password, fullName);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111808] text-[#FFF0BA] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#FFF0BA] selection:text-[#111808]">
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF0BA] text-[#111808] shadow-xl mb-1">
            <span className="material-symbols-outlined text-[28px]">
              auto_stories
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FFF0BA]">
            StudentFlow
          </h1>
          <p className="text-xs text-[#FFF0BA]/70">
            Begin Your Academic Journey
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#18220C] rounded-2xl p-6 sm:p-8 space-y-6 border border-[#FFF0BA]/20 shadow-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#FFF0BA] tracking-tight">Create New Account</h2>
            <p className="text-xs text-[#FFF0BA]/65">Set up your personal study workspace</p>
          </div>

          {authError && (
            <div className="p-3.5 bg-[#FFF0BA]/10 border border-[#FFF0BA]/30 rounded-xl text-xs text-[#FFF0BA] flex items-center gap-2.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[#FFF0BA] text-[18px] shrink-0">error</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="register-fullname" className="text-xs font-semibold text-[#FFF0BA]/80 block">
                Full Name
              </label>
              <input
                id="register-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-xs font-semibold text-[#FFF0BA]/80 block">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-xs font-semibold text-[#FFF0BA]/80 block">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#FFF0BA] text-[#111808] font-bold text-xs hover:bg-[#FFF6D6] shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer switch */}
          <div className="pt-2 text-center text-xs text-[#FFF0BA]/70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setCurrentScreen('login');
              }}
              className="text-[#FFF0BA] font-bold underline hover:text-[#FFF6D6] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
