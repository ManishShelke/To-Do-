import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();
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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="bg-[#18220C] text-[#FFF0BA] w-full max-w-md rounded-2xl shadow-2xl border border-[#FFF0BA]/25 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#FFF0BA]/15 bg-[#111808]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#FFF0BA]">settings</span>
            <h3 id="settings-modal-title" className="text-lg font-bold text-[#FFF0BA]">
              Workspace Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 text-[#FFF0BA]/60 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label htmlFor="daily-goal-input" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-2">
              Daily Study Target (Hours)
            </label>
            <input
              id="daily-goal-input"
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={dailyGoalHours}
              onChange={(e) => setDailyGoalHours(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none font-mono tabular-nums"
            />
          </div>

          <div className="flex flex-col gap-3.5 pt-4 border-t border-[#FFF0BA]/15">
            <span className="text-xs font-semibold text-[#FFF0BA]/80">
              Study & Task Options
            </span>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFF0BA]/90">Notifications for Due Tasks</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="custom-checkbox"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFF0BA]/90">Focus Session Audio Alerts</span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="custom-checkbox"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-[#FFF0BA]/90">Auto-archive completed tasks after 7 days</span>
              <input
                type="checkbox"
                checked={autoArchive}
                onChange={(e) => setAutoArchive(e.target.checked)}
                className="custom-checkbox"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-[#FFF0BA]/15 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#FFF0BA]/25 text-[#FFF0BA]/80 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFF0BA] text-[#111808] hover:bg-[#FFF6D6] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
