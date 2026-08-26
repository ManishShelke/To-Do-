import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, showNotificationToast, currentUser, tasks, activities, logout } = useApp();
  const [fullName, setFullName] = useState(profile.fullName || currentUser?.displayName || '');
  const [email] = useState(profile.email || currentUser?.email || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [major, setMajor] = useState(profile.major || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state when profile loads/changes from Firestore
  useEffect(() => {
    setFullName(profile.fullName || currentUser?.displayName || '');
    setBio(profile.bio || '');
    setMajor(profile.major || '');
  }, [profile, currentUser]);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      bio: bio.trim(),
      major: major.trim(),
    });
    setIsSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#120303] text-[#FFFACD]">
      <TopHeader title="Scholar Profile" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto w-full pb-20 space-y-8 font-syne">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFFACD]/60 font-bold">Academic Identity</span>
            <span className="w-2 h-2 rounded-full bg-[#B81104]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#FFFACD] tracking-wide">
            Account & Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFACD]/60 max-w-2xl mt-1 tracking-wide">
            Manage your personal academic identity and cloud synchronization parameters.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Avatar Card & Milestones */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Avatar Card */}
            <div className="bg-[#1C0606] border border-[#FFFACD]/15 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full h-20 bg-gradient-to-r from-[#B81104]/30 via-[#B81104]/50 to-[#B81104]/30 absolute top-0 left-0 border-b border-[#FFFACD]/15"></div>

              <div className="relative mt-6 mb-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full border-4 border-[#1C0606] object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#B81104] to-[#8E0D03] text-[#FFFACD] flex items-center justify-center text-3xl font-serif border-4 border-[#1C0606] shadow-2xl">
                    {fullName
                      ? fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : 'SF'}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-serif text-[#FFFACD] tracking-wide font-normal">{fullName || 'Scholar'}</h3>
              <p className="text-xs font-mono text-[#FFFACD]/50 mt-0.5">{email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFACD]/10 border border-[#FFFACD]/20 text-[#FFFACD] text-xs font-mono">
                <span className="material-symbols-outlined text-[14px] text-[#B81104]">school</span>
                {major}
              </div>

              <div className="w-full border-t border-[#FFFACD]/15 mt-6 pt-4 text-left">
                <div className="flex justify-between text-xs text-[#FFFACD]/50 font-mono">
                  <span>Cloud Auth Provider</span>
                  <span className="text-[#FFFACD] font-bold">
                    {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google OAuth' : 'Firebase Email'}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Milestones */}
            <div className="bg-[#1C0606] border border-[#FFFACD]/15 rounded-2xl p-5 shadow-2xl">
              <h4 className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest mb-4">
                Live Cloud Records
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#140303] p-3.5 rounded-xl border border-[#FFFACD]/10 text-center">
                  <span className="material-symbols-outlined text-[#B81104] text-lg mb-1">checklist</span>
                  <div className="text-xl font-mono text-[#FFFACD] font-bold">{completedCount}</div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFFACD]/40">Completed</span>
                </div>

                <div className="bg-[#140303] p-3.5 rounded-xl border border-[#FFFACD]/10 text-center">
                  <span className="material-symbols-outlined text-[#B81104] text-lg mb-1">pending_actions</span>
                  <div className="text-xl font-mono text-[#FFFACD] font-bold">{activities.length}</div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFFACD]/40">Sessions</span>
                </div>
              </div>
            </div>

            {/* Lemon Chiffon Badge */}
            <div className="bg-[#FFFACD] text-[#120303] rounded-2xl p-5 border border-[#B81104]/20 shadow-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B81104]">Membership Tier</span>
                <h5 className="font-serif text-lg text-[#B81104] font-normal">Milano Academic Fellow</h5>
              </div>
              <span className="material-symbols-outlined text-[#B81104] text-[28px]">verified</span>
            </div>
          </div>

          {/* Right Column: Information & Security Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Profile Information Form */}
            <div className="bg-[#1C0606] border border-[#FFFACD]/15 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#FFFACD]/15">
                <span className="material-symbols-outlined text-[#B81104]">badge</span>
                <h3 className="text-lg font-serif text-[#FFFACD] tracking-wide font-normal">Personal Information</h3>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 rounded-xl text-xs text-[#FFFACD] focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                      Email (Cloud Auth)
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-[#140303]/50 border border-[#FFFACD]/10 rounded-xl text-xs text-[#FFFACD]/50 outline-none cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                    Academic Major & Specialization
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 rounded-xl text-xs text-[#FFFACD] focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                    Academic Bio & Focus Areas
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Focusing on distributed systems and computational biology..."
                    className="w-full p-3 bg-[#140303] border border-[#FFFACD]/20 rounded-xl text-xs text-[#FFFACD] focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#B81104] to-[#8E0D03] text-[#FFFACD] hover:brightness-110 shadow-lg shadow-[#B81104]/40 border border-[#FFFACD]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-[#1C0606] border border-[#FFFACD]/15 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#FFFACD]">Sign Out of Session</h4>
                <p className="text-xs text-[#FFFACD]/50 mt-0.5">End your active cloud session on this device.</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#B81104] text-[#B81104] hover:bg-[#B81104] hover:text-[#FFFACD] transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
