import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityCategory } from '../../types';
import { TopHeader } from '../TopHeader';

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
    let minutes = 0;
    const dur = durationInput.trim().toLowerCase();
    const hourMatch = dur.match(/(\d+)\s*h/);
    const minMatch = dur.match(/(\d+)\s*m/);

    if (hourMatch) minutes += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) minutes += parseInt(minMatch[1], 10);
    if (!hourMatch && !minMatch) {
      const parsed = parseInt(dur, 10);
      minutes = isNaN(parsed) ? 30 : parsed;
    }

    const title = sessionTitle.trim() || `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Session`;

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

  // Compute stats
  const studyMins = activities.filter((a) => a.category === 'study').reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const codingMins = activities.filter((a) => a.category === 'coding').reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const readingMins = activities.filter((a) => a.category === 'reading').reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const totalMins = activities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);

  const formatMins = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

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

  const displayedLogs = filterCategory === 'all'
    ? activities
    : activities.filter((a) => a.category === filterCategory);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#120303] text-[#FFFACD]">
      <TopHeader title="Daily Activity Log" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto w-full pb-20 font-syne">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFFACD]/60 font-bold">Cloud Synced Study Journal</span>
            <span className="w-2 h-2 rounded-full bg-[#B81104]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#FFFACD] tracking-wide">Daily Activity</h2>
          <p className="text-xs sm:text-sm text-[#FFFACD]/60 max-w-2xl mt-1 tracking-wide">
            Record your study blocks, coding labs, and reading sessions to establish deep academic momentum.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Record Action Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#1C0606] rounded-2xl border border-[#FFFACD]/15 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl border border-[#FFFACD]/30 bg-gradient-to-br from-[#B81104] to-[#8E0D03] flex items-center justify-center text-[#FFFACD] shadow-lg shadow-[#B81104]/30">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-[#FFFACD] tracking-wide font-normal">Record Session</h3>
                  <p className="text-[10px] text-[#FFFACD]/50 uppercase tracking-widest font-mono">Real-time Firestore</p>
                </div>
              </div>

              <form onSubmit={handleLogActivity} className="space-y-4">
                {/* Category Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-2 uppercase tracking-widest">
                    Category
                  </label>
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
                            ? 'border-[#FFFACD] bg-[#B81104] text-[#FFFACD] shadow-md shadow-[#B81104]/30 font-bold'
                            : 'border-[#FFFACD]/15 bg-[#140303] text-[#FFFACD]/60 hover:text-[#FFFACD] hover:border-[#FFFACD]/30'
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
                  <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="e.g., Algorithms & Data Structures Lab"
                    className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none transition-all"
                  />
                </div>

                {/* Duration & Date Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={durationInput}
                      onChange={(e) => setDurationInput(e.target.value)}
                      placeholder="e.g. 1h 30m, 45m"
                      className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                      Date
                    </label>
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#FFFACD]/60 mb-1.5 uppercase tracking-widest">
                    Notes / Key Takeaways
                  </label>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    rows={2}
                    placeholder="Key concepts grasped, solved problems..."
                    className="w-full p-3 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-xl text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#B81104] to-[#8E0D03] text-[#FFFACD] rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#B81104]/40 border border-[#FFFACD]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Logging to Cloud...' : 'Log Study Block'}
                </button>
              </form>
            </div>

            {/* Lemon Chiffon Summary Card */}
            <div className="bg-[#FFFACD] text-[#120303] rounded-2xl p-6 border border-[#B81104]/20 shadow-2xl flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B81104]">Academic Momentum</span>
              <div className="my-3">
                <span className="text-3xl font-serif text-[#B81104]">{formatMins(totalMins)}</span>
                <p className="text-xs text-[#120303]/70 mt-1">Total time dedicated across all logged blocks.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#B81104]/20 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#B81104]/70 block uppercase">Study</span>
                  <span className="font-bold text-[#B81104]">{formatMins(studyMins)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#B81104]/70 block uppercase">Coding</span>
                  <span className="font-bold text-[#B81104]">{formatMins(codingMins)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#B81104]/70 block uppercase">Reading</span>
                  <span className="font-bold text-[#B81104]">{formatMins(readingMins)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity History Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3 bg-[#1C0606] p-2.5 rounded-2xl border border-[#FFFACD]/15">
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'study', 'coding', 'reading', 'break'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-[#B81104] text-[#FFFACD] font-bold shadow-md'
                        : 'text-[#FFFACD]/60 hover:text-[#FFFACD]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-[#FFFACD]/50 px-2">
                {displayedLogs.length} Recorded
              </span>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {displayedLogs.length === 0 ? (
                <div className="bg-[#1C0606] rounded-2xl p-12 text-center border border-[#FFFACD]/15 space-y-3">
                  <span className="material-symbols-outlined text-[36px] text-[#FFFACD]/30 block">schedule</span>
                  <h4 className="font-serif text-lg text-[#FFFACD]">No Activity Recorded Yet</h4>
                  <p className="text-xs text-[#FFFACD]/60 max-w-sm mx-auto">
                    Use the form on the left to record your first study block into your cloud history.
                  </p>
                </div>
              ) : (
                displayedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#1C0606] hover:bg-[#220706] rounded-2xl p-4 border border-[#FFFACD]/15 hover:border-[#B81104]/50 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#B81104]/20 border border-[#B81104]/40 flex items-center justify-center shrink-0 text-[#FFFACD] mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          {getCategoryIcon(log.category)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#FFFACD] truncate">{log.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFFACD]/10 text-[#FFFACD]/80 border border-[#FFFACD]/15 capitalize">
                            {log.category}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-xs text-[#FFFACD]/60 mt-1 leading-relaxed">{log.note}</p>
                        )}
                        <p className="text-[10px] font-mono text-[#FFFACD]/40 mt-1">{log.timestamp} • {log.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-mono font-bold text-[#FFFACD] bg-[#140303] px-3 py-1 rounded-full border border-[#FFFACD]/15">
                        {log.durationFormatted}
                      </span>
                      <button
                        onClick={() => deleteActivity(log.id)}
                        className="p-1 text-[#FFFACD]/30 hover:text-[#B81104] transition-colors rounded-md"
                        title="Delete Log"
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
