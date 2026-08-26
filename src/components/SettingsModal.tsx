import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, showNotificationToast } = useApp();
  const [dailyGoalHours, setDailyGoalHours] = useState(settings.dailyGoalHours.toString());
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [autoArchive, setAutoArchive] = useState(settings.autoArchive);

  useEffect(() => {
    setDailyGoalHours(settings.dailyGoalHours.toString());
    setNotificationsEnabled(settings.notificationsEnabled);
    setSoundEnabled(settings.soundEnabled);
    setAutoArchive(settings.autoArchive);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      dailyGoalHours: parseFloat(dailyGoalHours) || 4,
      notificationsEnabled,
      soundEnabled,
      autoArchive,
    });
    showNotificationToast('Settings saved to cloud database!');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1C0606] text-[#FFFACD] w-full max-w-md rounded-2xl shadow-2xl border border-[#FFFACD]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#FFFACD]/15 bg-[#250807]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#B81104]">settings</span>
            <h3 className="font-serif text-xl text-[#FFFACD] tracking-wide font-normal">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#FFFACD]/50 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 font-syne">
          <div>
            <label className="block text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest mb-2">
              Daily Study Target (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={dailyGoalHours}
              onChange={(e) => setDailyGoalHours(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none font-mono"
            />
          </div>

          <div className="flex flex-col gap-3.5 pt-2 border-t border-[#FFFACD]/15">
            <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
              Cloud Preferences
            </label>
            
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFFACD]/80">Push Notifications for Due Tasks</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[#FFFACD]/30 bg-[#140303] text-[#B81104] focus:ring-[#B81104]/40 accent-[#B81104] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFFACD]/80">Focus Session Audio Alerts</span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[#FFFACD]/30 bg-[#140303] text-[#B81104] focus:ring-[#B81104]/40 accent-[#B81104] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFFACD]/80">Auto-archive completed tasks after 7 days</span>
              <input
                type="checkbox"
                checked={autoArchive}
                onChange={(e) => setAutoArchive(e.target.checked)}
                className="w-4 h-4 rounded border-[#FFFACD]/30 bg-[#140303] text-[#B81104] focus:ring-[#B81104]/40 accent-[#B81104] cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-[#FFFACD]/15 flex justify-end gap-3 font-syne">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-mono border border-[#FFFACD]/20 text-[#FFFACD]/70 hover:text-[#FFFACD] hover:bg-[#FFFACD]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#B81104] to-[#8E0D03] text-[#FFFACD] hover:brightness-110 shadow-lg shadow-[#B81104]/40 cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
