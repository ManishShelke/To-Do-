import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, setCurrentScreen, authError, setAuthError } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setAuthError(null);
    await loginWithEmail(email, password);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#120303] text-[#FFFACD] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#B81104] selection:text-[#FFFACD]">
      {/* Ambient background aesthetic glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#B81104]/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FFFACD]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B81104] to-[#8E0D03] border border-[#FFFACD]/30 shadow-2xl shadow-[#B81104]/50 mb-2">
            <span className="material-symbols-outlined text-[#FFFACD] text-[28px]">
              auto_stories
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] text-[#FFFACD] uppercase font-normal">
            StudentFlow
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#FFFACD]/60 font-syne">
            Academic Excellence & Focus
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border border-[#FFFACD]/20 shadow-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-serif text-[#FFFACD] tracking-wide font-normal">Sign In to Your Workspace</h2>
            <p className="text-xs text-[#FFFACD]/60 font-syne">Synced live with Firebase Cloud Firestore</p>
          </div>

          {authError && (
            <div className="p-3.5 bg-[#B81104]/20 border border-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] flex items-center gap-2.5 font-syne animate-in fade-in">
              <span className="material-symbols-outlined text-[#B81104] text-[18px] shrink-0">error</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-xl bg-[#FFFACD] hover:bg-[#FFFDE6] text-[#120303] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-black/40 border border-[#FFFACD] hover:scale-[1.01] active:scale-[0.99] font-syne cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#120303] border-t-transparent rounded-full animate-spin"></span>
                Connecting to Google...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-[#FFFACD]/15 flex-1"></div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFFACD]/40">or email</span>
            <div className="h-px bg-[#FFFACD]/15 flex-1"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-syne">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#FFFACD]/70 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.mercer@university.edu"
                className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-[#FFFACD]/70 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B81104] to-[#8E0D03] text-[#FFFACD] font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#B81104]/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In with Email'}
            </button>
          </form>

          {/* Footer switch */}
          <div className="pt-2 text-center text-xs text-[#FFFACD]/60 font-syne">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setAuthError(null);
                setCurrentScreen('register');
              }}
              className="text-[#FFFACD] font-bold underline hover:text-[#FFFDE6] transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
