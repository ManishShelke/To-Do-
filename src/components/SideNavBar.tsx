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
      <aside className="hidden md:flex w-[280px] h-screen sticky left-0 top-0 border-r border-[#FFFACD]/15 bg-[#160404] flex-col py-6 shrink-0 z-30 select-none text-[#FFFACD]">
        {/* Brand Header */}
        <div
          className="px-6 mb-8 flex items-center gap-3.5 cursor-pointer group"
          onClick={() => setCurrentScreen('dashboard')}
        >
          <div className="w-9 h-9 rounded-xl border border-[#FFFACD]/30 bg-gradient-to-br from-[#B81104] to-[#8E0D03] flex items-center justify-center shrink-0 shadow-lg shadow-[#B81104]/30 text-[#FFFACD] group-hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[20px]">
              auto_stories
            </span>
          </div>
          <div>
            <h1 className="text-xl tracking-[0.2em] font-normal uppercase text-[#FFFACD] font-serif">
              StudentFlow
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#FFFACD]/50 font-syne">Milano Academic</p>
          </div>
        </div>

        {/* User Card Miniature */}
        {currentUser && (
          <div className="mx-4 mb-6 p-3 rounded-xl bg-[#220706] border border-[#FFFACD]/15 flex items-center gap-3">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-[#B81104] object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#B81104] text-[#FFFACD] font-bold text-xs flex items-center justify-center border border-[#FFFACD]/30 font-syne">
                {profile.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#FFFACD] truncate font-syne">
                {profile.fullName || currentUser.displayName || 'Scholar'}
              </p>
              <p className="text-[10px] text-[#FFFACD]/50 truncate font-mono">
                {currentUser.email}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm" title="Connected to Cloud"></span>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex flex-col gap-2 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 text-xs tracking-wider uppercase transition-all duration-150 text-left rounded-xl font-syne cursor-pointer ${
                  isActive
                    ? 'text-[#FFFACD] font-bold bg-gradient-to-r from-[#B81104] to-[#8E0D03] border border-[#FFFACD]/25 shadow-md shadow-[#B81104]/30 translate-x-1'
                    : 'text-[#FFFACD]/60 hover:text-[#FFFACD] hover:bg-[#FFFACD]/5 border border-transparent'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="px-3 mt-auto pt-4 border-t border-[#FFFACD]/15 space-y-1.5 font-syne">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs uppercase tracking-wider text-[#FFFACD]/60 hover:text-[#FFFACD] hover:bg-[#FFFACD]/5 transition-colors rounded-xl text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs uppercase tracking-wider text-[#FFFACD]/50 hover:text-[#B81104] hover:bg-[#B81104]/10 transition-colors rounded-xl text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
