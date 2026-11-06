import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, currentUser, tasks, activities, logout } = useApp();
  const [fullName, setFullName] = useState(profile.fullName || currentUser?.displayName || '');
  const [email, setEmail] = useState(profile.email || currentUser?.email || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [major, setMajor] = useState(profile.major || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullName(profile.fullName || currentUser?.displayName || '');
    setEmail(profile.email || currentUser?.email || '');
    setBio(profile.bio || '');
    setMajor(profile.major || '');
  }, [profile, currentUser]);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      bio: bio.trim(),
      major: major.trim(),
    });
    setIsSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111808] text-[#FFF0BA]">
      <TopHeader title="Scholar Profile" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto w-full pb-20 space-y-8">
        <div>
          <p className="text-xs font-medium text-[#FFF0BA]/65 mb-1">
            Academic Identity
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] tracking-tight">
            Account & Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF0BA]/70 max-w-2xl mt-1">
            Manage your personal academic profile, specialization, and study goals.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Avatar Card & Milestones */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Avatar Card */}
            <div className="bg-[#18220C] border border-[#FFF0BA]/15 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full h-20 bg-[#FFF0BA] absolute top-0 left-0"></div>

              <div className="relative mt-6 mb-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full border-4 border-[#18220C] object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#111808] text-[#FFF0BA] flex items-center justify-center text-2xl font-bold border-4 border-[#18220C] shadow-xl">
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

              <h2 className="text-xl font-bold text-[#FFF0BA] tracking-tight">{fullName || 'Scholar'}</h2>
              <p className="text-xs font-mono text-[#FFF0BA]/65 mt-0.5">{email}</p>
              {major && (
                <p className="mt-2 text-xs text-[#FFF0BA]/80">
                  {major}
                </p>
              )}

              <div className="w-full border-t border-[#FFF0BA]/15 mt-6 pt-4 text-left">
                <div className="flex justify-between text-xs text-[#FFF0BA]/65 font-mono">
                  <span>Member Since</span>
                  <span className="text-[#FFF0BA] font-bold">{profile.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Academic Milestones */}
            <div className="bg-[#18220C] border border-[#FFF0BA]/15 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-[#FFF0BA]/75 mb-4">
                Workspace Milestones
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111808] p-4 rounded-xl border border-[#FFF0BA]/15 text-center">
                  <div className="text-2xl font-mono text-[#FFF0BA] font-bold tabular-nums">{completedCount}</div>
                  <span className="text-xs text-[#FFF0BA]/65 mt-1 block">Tasks Done</span>
                </div>

                <div className="bg-[#111808] p-4 rounded-xl border border-[#FFF0BA]/15 text-center">
                  <div className="text-2xl font-mono text-[#FFF0BA] font-bold tabular-nums">{activities.length}</div>
                  <span className="text-xs text-[#FFF0BA]/65 mt-1 block">Study Sessions</span>
                </div>
              </div>
            </div>

            {/* Colonial White Card */}
            <div className="bg-[#FFF0BA] text-[#111808] rounded-2xl p-5 border border-[#111808]/15 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111808]/70">Academic Status</span>
                <h4 className="text-lg font-bold text-[#111808]">Honor Roll Scholar</h4>
              </div>
              <span className="material-symbols-outlined text-[#111808] text-[28px]">verified</span>
            </div>
          </div>

          {/* Right Column: Information & Session Controls */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Profile Information Form */}
            <div className="bg-[#18220C] border border-[#FFF0BA]/15 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#FFF0BA]/15">
                <span className="material-symbols-outlined text-[#FFF0BA]">badge</span>
                <h3 className="text-lg font-bold text-[#FFF0BA] tracking-tight">Personal Information</h3>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-fullname" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="profile-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 rounded-xl text-xs text-[#FFF0BA] focus:border-[#FFF0BA] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                      Academic Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 rounded-xl text-xs text-[#FFF0BA] focus:border-[#FFF0BA] outline-none font-mono transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-major" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                    Academic Major & Specialization
                  </label>
                  <input
                    id="profile-major"
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 rounded-xl text-xs text-[#FFF0BA] focus:border-[#FFF0BA] outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="profile-bio" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                    Academic Bio & Focus Areas
                  </label>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Focusing on distributed systems and computational mathematics..."
                    className="w-full p-3 bg-[#111808] border border-[#FFF0BA]/25 rounded-xl text-xs text-[#FFF0BA] focus:border-[#FFF0BA] outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#FFF0BA] text-[#111808] hover:bg-[#FFF6D6] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-[#18220C] border border-[#FFF0BA]/15 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#FFF0BA]">Sign Out of Workspace</h4>
                <p className="text-xs text-[#FFF0BA]/65 mt-0.5">Return to the sign-in screen.</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="px-5 py-2 rounded-xl text-xs font-bold border border-[#FFF0BA]/30 text-[#FFF0BA] hover:bg-[#FFF0BA] hover:text-[#111808] transition-all cursor-pointer whitespace-nowrap shrink-0"
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
