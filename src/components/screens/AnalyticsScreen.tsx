import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';

export const AnalyticsScreen: React.FC = () => {
  const { tasks, activities, profile, settings } = useApp();
  const [selectedBarDay, setSelectedBarDay] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Real logged minutes
  const totalMinutes = activities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Calculate real focus streak from activities (consecutive days with logged sessions)
  const focusStreak = useMemo(() => {
    if (activities.length === 0) return 0;

    // Get unique dates with activity, sorted descending
    const activityDates = new Set<string>();
    activities.forEach((act) => {
      if (act.date) {
        activityDates.add(act.date); // YYYY-MM-DD format
      } else if (act.createdAt) {
        activityDates.add(act.createdAt.split('T')[0]);
      }
    });

    const sortedDates = Array.from(activityDates).sort((a, b) => b.localeCompare(a));
    if (sortedDates.length === 0) return 0;

    // Check if the most recent date is today or yesterday (streak must be current)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecentDate = new Date(sortedDates[0] + 'T00:00:00');
    if (mostRecentDate < yesterday) return 0; // Streak is broken

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i - 1] + 'T00:00:00');
      const prev = new Date(sortedDates[i] + 'T00:00:00');
      const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [activities]);

  // Calculate real study goal progress for today
  const studyGoalProgress = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMinutes = activities
      .filter((act) => {
        const actDate = act.date || (act.createdAt ? act.createdAt.split('T')[0] : '');
        return actDate === todayStr;
      })
      .reduce((acc, act) => acc + (act.durationMinutes || 0), 0);

    const goalHours = settings.dailyGoalHours || profile.dailyGoalHours || 4;
    const goalMinutes = goalHours * 60;
    return goalMinutes > 0 ? Math.min(100, Math.round((todayMinutes / goalMinutes) * 100)) : 0;
  }, [activities, settings.dailyGoalHours, profile.dailyGoalHours]);

  // Compute real weekly task data from actual tasks
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    // Calculate start of current week (Monday)
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    return days.map((day, idx) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + idx);
      const dayStr = dayDate.toISOString().split('T')[0];

      // Count tasks created on this day
      const planned = tasks.filter((t) => {
        const taskDate = t.createdAt ? t.createdAt.split('T')[0] : '';
        return taskDate === dayStr;
      }).length;

      // Count tasks completed on this day
      const completed = tasks.filter((t) => {
        if (!t.completed || !t.completedAt) return false;
        const completedDate = t.completedAt.split('T')[0];
        return completedDate === dayStr;
      }).length;

      const maxVal = Math.max(planned, completed, 1);
      const height = Math.round((completed / maxVal) * 100);
      return { day, completed, planned, height };
    });
  }, [tasks]);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#120303] text-[#FFFACD]">
      <TopHeader title="Analytics Overview" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1400px] mx-auto w-full pb-20 space-y-8 font-syne">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFFACD]/60 font-bold">Academic Performance Intelligence</span>
            <span className="w-2 h-2 rounded-full bg-[#B81104]"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#FFFACD] tracking-wide">
            Analytics & Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFACD]/60 max-w-2xl mt-1 tracking-wide">
            Measure your study intervals, task throughput, and academic focus metrics calculated in real-time.
          </p>
        </div>

        {/* 5 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[#1C0606] p-4 rounded-2xl border border-[#FFFACD]/15 shadow-2xl flex flex-col justify-between hover:border-[#B81104]/50 transition-colors">
            <span className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">Tasks Done</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-mono text-[#FFFACD]">{completedCount}</span>
            </div>
            <span className="text-xs font-mono text-[#FFFACD]/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#B81104]">trending_up</span> of {totalTasks} total
            </span>
          </div>

          <div className="bg-[#1C0606] p-4 rounded-2xl border border-[#FFFACD]/15 shadow-2xl flex flex-col justify-between hover:border-[#B81104]/50 transition-colors">
            <span className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">Hours Logged</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-mono text-[#FFFACD]">{totalHours}h</span>
            </div>
            <span className="text-xs font-mono text-[#FFFACD]/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#B81104]">schedule</span> {activities.length} sessions
            </span>
          </div>

          <div className="bg-[#1C0606] p-4 rounded-2xl border border-[#FFFACD]/15 shadow-2xl flex flex-col justify-between hover:border-[#B81104]/50 transition-colors">
            <span className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">Focus Streak</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-mono text-[#FFFACD]">{focusStreak} Day{focusStreak !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-xs font-mono text-[#FFFACD]/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#B81104]">local_fire_department</span> {focusStreak > 0 ? 'Active streak' : 'No streak yet'}
            </span>
          </div>

          <div className="bg-[#1C0606] p-4 rounded-2xl border border-[#FFFACD]/15 shadow-2xl flex flex-col justify-between hover:border-[#B81104]/50 transition-colors">
            <span className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">Completion Rate</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-mono text-[#FFFACD]">{completionRate}%</span>
            </div>
            <span className="text-xs font-mono text-[#FFFACD]/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#B81104]">task_alt</span> Real-time
            </span>
          </div>

          <div className="bg-[#1C0606] p-4 rounded-2xl border border-[#FFFACD]/15 shadow-2xl flex flex-col justify-between col-span-2 sm:col-span-1 hover:border-[#B81104]/50 transition-colors">
            <span className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">Sync Status</span>
            <div className="my-2">
              <span className="text-lg font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>
            <span className="text-xs font-mono text-[#FFFACD]/50">Google & Firestore</span>
          </div>
        </div>

        {/* Weekly Bars + Lemon Chiffon Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Task Completion Chart */}
          <div className="lg:col-span-8 bg-[#1C0606] border border-[#FFFACD]/15 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-serif text-[#FFFACD] font-normal">Weekly Task Completion</h3>
                <p className="text-xs text-[#FFFACD]/50 mt-0.5">Completed tasks vs total created this week</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-[#B81104]"></div>
                  <span className="text-[#FFFACD]/80">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-[#FFFACD]/20 border border-[#FFFACD]/40"></div>
                  <span className="text-[#FFFACD]/40">Created</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Canvas Area */}
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#FFFACD]/15 relative">
              {weeklyData.map((d) => {
                const isHovered = selectedBarDay === d.day;
                const barHeight = d.planned > 0 || d.completed > 0 ? Math.max(15, d.height) : 8;
                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => setSelectedBarDay(d.day)}
                    onMouseLeave={() => setSelectedBarDay(null)}
                    className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                  >
                    {isHovered && (
                      <div className="absolute -top-10 bg-[#250807] text-[#FFFACD] text-[11px] font-mono px-2.5 py-1 rounded-md shadow-2xl border border-[#FFFACD]/30 z-20 whitespace-nowrap">
                        {d.completed} done / {d.planned} created
                      </div>
                    )}
                    <div className="w-full max-w-[42px] bg-[#140303] border border-[#FFFACD]/10 rounded-t-xl h-44 flex items-end justify-center p-1 relative overflow-hidden group-hover:bg-[#220706] transition-colors">
                      <div
                        className="w-full bg-[#B81104] rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${barHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-mono text-[#FFFACD]/60 group-hover:text-[#FFFACD] transition-colors">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lemon Chiffon Efficiency Summary */}
          <div className="lg:col-span-4 bg-[#FFFACD] text-[#120303] rounded-2xl p-6 border border-[#B81104]/20 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B81104]">Academic Efficiency</span>
              <h3 className="text-3xl font-serif text-[#B81104] mt-2 font-normal">
                {completionRate >= 90 ? 'Grade Target: A+' : completionRate >= 75 ? 'Grade Target: A' : completionRate >= 60 ? 'Grade Target: B+' : completionRate > 0 ? 'Keep Improving' : 'Get Started'}
              </h3>
              <p className="text-xs text-[#120303]/80 mt-1">
                {completionRate >= 75 ? 'Your study consistency reflects top-tier academic discipline.' : completionRate > 0 ? 'Keep pushing to improve your completion rate.' : 'Complete tasks and log study sessions to see your efficiency.'}
              </p>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-[#B81104] mb-1">
                  <span>Assignment Completion</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-[#120303]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#B81104] h-full rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-[#B81104] mb-1">
                  <span>Study Goal Progress</span>
                  <span>{studyGoalProgress}%</span>
                </div>
                <div className="w-full bg-[#120303]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#B81104] h-full rounded-full transition-all duration-700" style={{ width: `${studyGoalProgress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-[#B81104]/80 pt-3 border-t border-[#B81104]/20 flex justify-between items-center">
              <span>Firebase Cloud DB</span>
              <span className="font-bold">Active Sync</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

