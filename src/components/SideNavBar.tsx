import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import { SettingsModal } from './SettingsModal';

export const SideNavBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, logout, currentUser, profile } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems: { id: Screen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'activities', label: 'Activities', icon: 'pending_actions' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <aside className="hidden md:flex w-[264px] h-screen sticky left-0 top-0 border-r border-[#FFF0BA]/15 bg-[#111808] flex-col py-6 shrink-0 z-30 select-none text-[#FFF0BA]">
        {/* Brand Header */}
        <div
          className="px-6 mb-8 flex items-center gap-3.5 cursor-pointer group"
          onClick={() => setCurrentScreen('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF0BA] text-[#111808] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">
              auto_stories
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#FFF0BA]">
              StudentFlow
            </h1>
            <p className="text-[11px] text-[#FFF0BA]/60">Academic Workspace</p>
          </div>
        </div>

        {/* User Card Miniature */}
        {currentUser && (
          <div className="mx-4 mb-6 p-3.5 rounded-2xl bg-[#FFF0BA] text-[#111808] flex items-center gap-3 shadow-sm">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'Scholar'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-[#111808]/20 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#111808] text-[#FFF0BA] font-bold text-xs flex items-center justify-center shrink-0">
                {(profile.fullName || currentUser.displayName || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#111808] truncate">
                {profile.fullName || currentUser.displayName || 'Scholar'}
              </p>
              <p className="text-[11px] text-[#111808]/70 truncate font-mono">
                {profile.email || currentUser.email || 'Personal Workspace'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 text-xs font-semibold transition-all duration-150 text-left rounded-xl cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FFF0BA] text-[#111808] shadow-sm'
                    : 'text-[#FFF0BA]/70 hover:text-[#FFF0BA] hover:bg-[#18220C]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[19px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="px-3 mt-auto pt-4 border-t border-[#FFF0BA]/15 space-y-1">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium text-[#FFF0BA]/70 hover:text-[#FFF0BA] hover:bg-[#18220C] transition-colors rounded-xl text-left cursor-pointer whitespace-nowrap shrink-0"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium text-[#FFF0BA]/60 hover:text-[#FFF0BA] hover:bg-[#18220C] transition-colors rounded-xl text-left cursor-pointer whitespace-nowrap shrink-0"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
