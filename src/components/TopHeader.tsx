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
    <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-30 bg-[#120303]/90 backdrop-blur-xl border-b border-[#FFFACD]/15 text-[#FFFACD]">
      {/* Mobile Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="w-8 h-8 rounded-xl border border-[#FFFACD]/30 bg-gradient-to-br from-[#B81104] to-[#8E0D03] flex items-center justify-center shrink-0 text-[#FFFACD]">
          <span className="material-symbols-outlined text-[18px]">
            auto_stories
          </span>
        </div>
        <h1 className="text-base font-serif tracking-[0.2em] uppercase text-[#FFFACD]">StudentFlow</h1>
      </div>

      {/* Desktop Header Title or Search */}
      <div className="hidden md:flex items-center gap-6">
        {title && <h2 className="text-2xl font-serif text-[#FFFACD] tracking-wide font-normal">{title}</h2>}
        {showSearch && (
          <div className="relative w-80 lg:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FFFACD]/40 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, notes..."
              className="w-full pl-10 pr-4 py-2 bg-[#1C0606] rounded-full border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 transition-all text-xs font-syne text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFFACD]/40 hover:text-[#FFFACD]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 relative">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-[#FFFACD]/70 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 transition-colors rounded-full border border-[#FFFACD]/20 relative cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B81104] rounded-full border-2 border-[#120303] animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1C0606] rounded-2xl shadow-2xl border border-[#FFFACD]/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#FFFACD]/15 flex justify-between items-center">
                <span className="text-[11px] font-semibold text-[#FFFACD]/70 uppercase tracking-widest font-syne">Live Updates</span>
                <span className="text-[10px] bg-[#B81104]/30 text-[#FFFACD] font-mono px-2.5 py-0.5 rounded-full border border-[#B81104]/40">
                  {notifications.length} Alerts
                </span>
              </div>
              <div className="divide-y divide-[#FFFACD]/10 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#FFFACD]/50">No new notifications</div>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="p-3 hover:bg-[#FFFACD]/5 text-xs text-[#FFFACD]/90 flex items-start gap-2.5 transition-colors font-syne">
                      <span className="material-symbols-outlined text-[#B81104] text-[16px] shrink-0 mt-0.5">
                        verified
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
            className="flex items-center gap-2 p-1.5 text-[#FFFACD]/80 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 transition-colors rounded-full border border-[#FFFACD]/20 cursor-pointer"
            aria-label="User Account"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#B81104]"
              />
            ) : (
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1C0606] rounded-2xl shadow-2xl border border-[#FFFACD]/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-syne">
              <div className="px-4 py-2 border-b border-[#FFFACD]/10">
                <p className="text-xs font-bold text-[#FFFACD] truncate">{profile.fullName || currentUser?.displayName || 'Student'}</p>
                <p className="text-[10px] text-[#FFFACD]/50 truncate font-mono">{currentUser?.email || ''}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentScreen('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-[#FFFACD]/80 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#B81104]">person</span>
                View Profile
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('dashboard');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-[#FFFACD]/80 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#B81104]">dashboard</span>
                Dashboard
              </button>
              <div className="h-px bg-[#FFFACD]/10 my-1"></div>
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  await logout();
                }}
                className="w-full px-4 py-2.5 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-[#B81104]/15 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
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
