import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface TopHeaderProps {
  title?: string;
  showSearch?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, showSearch = false }) => {
  const { searchQuery, setSearchQuery, setCurrentScreen, notifications, logout, profile, currentUser } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex justify-between items-center gap-8 w-full px-6 py-4 sticky top-0 z-30 bg-[#111808]/95 backdrop-blur-xl border-b border-[#FFF0BA]/15 text-[#FFF0BA]">
      {/* Zone 1: Brand / Context Title */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-lg font-bold tracking-tight text-[#FFF0BA] whitespace-nowrap shrink-0 md:hidden">
          StudentFlow
        </span>
        {title ? (
          <h2 className="hidden md:block text-xl font-bold text-[#FFF0BA] tracking-tight whitespace-nowrap shrink-0">
            {title}
          </h2>
        ) : (
          <span className="hidden md:block text-sm font-medium text-[#FFF0BA]/70 whitespace-nowrap shrink-0">
            Workspace / Overview
          </span>
        )}
      </div>

      {/* Zone 2: Search Input */}
      <div className="flex-1 max-w-md">
        {showSearch && (
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FFF0BA]/50 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, courses, notes..."
              aria-label="Search tasks and notes"
              className="w-full pl-10 pr-8 py-2 bg-[#18220C] rounded-xl border border-[#FFF0BA]/20 focus:border-[#FFF0BA] transition-all text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/40 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFF0BA]/50 hover:text-[#FFF0BA] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Action Controls */}
      <div className="flex items-center gap-3 relative shrink-0">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-[#FFF0BA]/80 hover:text-[#111808] hover:bg-[#FFF0BA] transition-colors rounded-xl border border-[#FFF0BA]/20 relative cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#18220C] rounded-2xl shadow-2xl border border-[#FFF0BA]/25 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#FFF0BA]/15 flex justify-between items-center">
                <span className="text-xs font-semibold text-[#FFF0BA]">Workspace Updates</span>
                <span className="text-xs font-mono text-[#FFF0BA]/70 tabular-nums">
                  {notifications.length} items
                </span>
              </div>
              <div className="divide-y divide-[#FFF0BA]/10 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#FFF0BA]/50">No new notifications</div>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="p-3 hover:bg-[#FFF0BA]/5 text-xs text-[#FFF0BA]/90 flex items-start gap-2.5 transition-colors">
                      <span className="material-symbols-outlined text-[#FFF0BA] text-[16px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{note}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#FFF0BA] text-[#111808] hover:bg-[#FFF6D6] transition-colors rounded-xl font-semibold text-xs cursor-pointer whitespace-nowrap shrink-0"
            aria-label="User Account"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span className="hidden sm:inline">{profile.fullName?.split(' ')[0] || 'Scholar'}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#18220C] rounded-2xl shadow-2xl border border-[#FFF0BA]/25 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#FFF0BA]/15">
                <p className="text-xs font-bold text-[#FFF0BA] truncate">
                  {profile.fullName || currentUser?.displayName || 'Student'}
                </p>
                <p className="text-[11px] text-[#FFF0BA]/60 truncate font-mono">
                  {currentUser?.email || profile.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentScreen('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-[#FFF0BA]/80 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                View Profile
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('dashboard');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-[#FFF0BA]/80 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                Dashboard
              </button>
              <div className="h-px bg-[#FFF0BA]/15 my-1"></div>
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  await logout();
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-[#FFF0BA]/70 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
