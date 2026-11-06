import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityCategory } from '../../types';
import { TopHeader } from '../TopHeader';
import { parseDurationToMinutes, formatDurationMinutes } from '../../utils/academicMetrics';

export const ActivitiesScreen: React.FC = () => {
  const { activities, addActivity, deleteActivity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('study');
  const [durationInput, setDurationInput] = useState('');
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split('T')[0]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!durationInput.trim()) return;

    setIsSubmitting(true);
    const minutes = parseDurationToMinutes(durationInput);
    const dur = durationInput.trim().toLowerCase();
    const title =
      sessionTitle.trim() ||
      `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Session`;

    await addActivity({
      title,
      category: selectedCategory,
      durationMinutes: minutes,
      durationFormatted: dur.includes('h') || dur.includes('m') ? dur : `${minutes}m`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: dateInput,
      note: noteInput.trim() || undefined,
    });

    setIsSubmitting(false);
    setDurationInput('');
    setSessionTitle('');
    setNoteInput('');
  };

  const studyMins = activities
    .filter((a) => a.category === 'study')
    .reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const codingMins = activities
    .filter((a) => a.category === 'coding')
    .reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const readingMins = activities
    .filter((a) => a.category === 'reading')
    .reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const totalMins = activities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);

  const getCategoryIcon = (cat: ActivityCategory) => {
    switch (cat) {
      case 'study':
        return 'book';
      case 'coding':
        return 'code';
      case 'reading':
        return 'menu_book';
      case 'break':
        return 'local_cafe';
    }
  };

  const displayedLogs =
    filterCategory === 'all'
      ? activities
      : activities.filter((a) => a.category === filterCategory);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111808] text-[#FFF0BA]">
      <TopHeader title="Daily Activity Log" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto w-full pb-20">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-medium text-[#FFF0BA]/65 mb-1">
            Structured Study Journal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] tracking-tight">Daily Activity</h1>
          <p className="text-xs sm:text-sm text-[#FFF0BA]/70 max-w-2xl mt-1">
            Record your study blocks, coding labs, and reading sessions to build consistent academic momentum.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Record Action Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#18220C] rounded-2xl border border-[#FFF0BA]/15 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0BA] text-[#111808] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#FFF0BA] tracking-tight">Record Session</h2>
                  <p className="text-xs text-[#FFF0BA]/60">Log focused academic intervals</p>
                </div>
              </div>

              <form onSubmit={handleLogActivity} className="space-y-4">
                {/* Category Selector */}
                <div>
                  <span className="block text-xs font-semibold text-[#FFF0BA]/80 mb-2">
                    Category
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'study', label: 'Study', icon: 'book' },
                      { id: 'coding', label: 'Coding', icon: 'code' },
                      { id: 'reading', label: 'Reading', icon: 'menu_book' },
                      { id: 'break', label: 'Break', icon: 'local_cafe' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as ActivityCategory)}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-left cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'border-[#FFF0BA] bg-[#FFF0BA] text-[#111808] font-bold shadow-sm'
                            : 'border-[#FFF0BA]/15 bg-[#111808] text-[#FFF0BA]/70 hover:text-[#FFF0BA] hover:border-[#FFF0BA]/35'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
                        <span className="text-xs">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Title */}
                <div>
                  <label htmlFor="activity-title-input" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                    Session Title
                  </label>
                  <input
                    id="activity-title-input"
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="e.g., Algorithms & Data Structures Lab"
                    className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none transition-all"
                  />
                </div>

                {/* Duration & Date Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="activity-duration-input" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                      Duration
                    </label>
                    <input
                      id="activity-duration-input"
                      type="text"
                      required
                      value={durationInput}
                      onChange={(e) => setDurationInput(e.target.value)}
                      placeholder="e.g. 1h 30m, 45m"
                      className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="activity-date-input" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                      Date
                    </label>
                    <input
                      id="activity-date-input"
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label htmlFor="activity-notes-input" className="block text-xs font-semibold text-[#FFF0BA]/80 mb-1.5">
                    Notes / Key Takeaways
                  </label>
                  <textarea
                    id="activity-notes-input"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    rows={2}
                    placeholder="Key concepts grasped, solved problems..."
                    className="w-full p-3 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/35 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#FFF0BA] hover:bg-[#FFF6D6] text-[#111808] rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Log Study Block'}
                </button>
              </form>
            </div>

            {/* Colonial White Summary Card */}
            <div className="bg-[#FFF0BA] text-[#111808] rounded-2xl p-6 border border-[#111808]/15 shadow-xl flex flex-col justify-between">
              <span className="text-xs font-bold text-[#111808]/75">Academic Momentum</span>
              <div className="my-3">
                <span className="text-3xl font-bold text-[#111808] font-mono tabular-nums">
                  {formatDurationMinutes(totalMins)}
                </span>
                <p className="text-xs text-[#111808]/75 mt-1">
                  Total time dedicated across all logged study blocks.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#111808]/15 text-center text-xs font-mono tabular-nums">
                <div>
                  <span className="text-[11px] text-[#111808]/70 block">Study</span>
                  <span className="font-bold text-[#111808]">{formatDurationMinutes(studyMins)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#111808]/70 block">Coding</span>
                  <span className="font-bold text-[#111808]">{formatDurationMinutes(codingMins)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#111808]/70 block">Reading</span>
                  <span className="font-bold text-[#111808]">{formatDurationMinutes(readingMins)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity History Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Filter Controls */}
            <div className="flex items-center justify-between gap-3 bg-[#18220C] p-2.5 rounded-2xl border border-[#FFF0BA]/15">
              <div className="flex gap-1 flex-wrap">
                {['all', 'study', 'coding', 'reading', 'break'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      filterCategory === cat
                        ? 'bg-[#FFF0BA] text-[#111808] font-bold shadow-sm'
                        : 'text-[#FFF0BA]/70 hover:text-[#FFF0BA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-[#FFF0BA]/65 px-2 tabular-nums">
                {displayedLogs.length} Recorded
              </span>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {displayedLogs.length === 0 ? (
                <div className="bg-[#18220C] rounded-2xl p-12 text-center border border-[#FFF0BA]/15 space-y-3">
                  <span className="material-symbols-outlined text-[36px] text-[#FFF0BA]/30 block">schedule</span>
                  <h4 className="text-base font-bold text-[#FFF0BA]">No Activity Recorded Yet</h4>
                  <p className="text-xs text-[#FFF0BA]/65 max-w-sm mx-auto">
                    Use the form on the left to record your first study block into your activity log.
                  </p>
                </div>
              ) : (
                displayedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#18220C] rounded-2xl p-4 border border-[#FFF0BA]/15 hover:border-[#FFF0BA]/40 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF0BA] text-[#111808] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          {getCategoryIcon(log.category)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-[#FFF0BA] truncate">{log.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#FFF0BA]/65 mt-0.5">
                          <span className="capitalize">{log.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{log.timestamp}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{log.date}</span>
                        </div>
                        {log.note && (
                          <p className="text-xs text-[#FFF0BA]/75 mt-1.5 leading-relaxed">{log.note}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-mono font-bold text-[#FFF0BA] tabular-nums">
                        {log.durationFormatted}
                      </span>
                      <button
                        onClick={() => deleteActivity(log.id)}
                        className="p-1.5 text-[#FFF0BA]/40 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 transition-colors rounded-lg cursor-pointer"
                        title={`Delete "${log.title}"`}
                        aria-label={`Delete "${log.title}"`}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
