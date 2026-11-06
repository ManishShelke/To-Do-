import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';
import {
  calculateCompletionRate,
  calculateFocusStreak,
  calculateStudyGoalProgress,
} from '../../utils/academicMetrics';

export const AnalyticsScreen: React.FC = () => {
  const { tasks, activities, profile, settings } = useApp();
  const [selectedBarDay, setSelectedBarDay] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = calculateCompletionRate(tasks);

  const totalMinutes = activities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const focusStreak = useMemo(() => calculateFocusStreak(activities), [activities]);

  const studyGoalProgress = useMemo(
    () =>
      calculateStudyGoalProgress(
        activities,
        settings.dailyGoalHours || profile.dailyGoalHours || 4
      ),
    [activities, settings.dailyGoalHours, profile.dailyGoalHours]
  );

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    return days.map((day, idx) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + idx);
      const dayStr = dayDate.toISOString().split('T')[0];

      const planned = tasks.filter((t) => {
        const taskDate = t.createdAt ? t.createdAt.split('T')[0] : '';
        return taskDate === dayStr;
      }).length;

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
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111808] text-[#FFF0BA]">
      <TopHeader title="Analytics Overview" />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-[1400px] mx-auto w-full pb-20 space-y-8">
        <div>
          <p className="text-xs font-medium text-[#FFF0BA]/65 mb-1">
            Academic Performance Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF0BA]/70 max-w-2xl mt-1">
            Measure your study intervals, task throughput, and academic focus metrics.
          </p>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#18220C] p-5 rounded-2xl border border-[#FFF0BA]/15 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#FFF0BA]/70">Tasks Completed</span>
            <div className="my-2">
              <span className="text-3xl font-bold font-mono text-[#FFF0BA] tabular-nums">{completedCount}</span>
            </div>
            <span className="text-xs font-mono text-[#FFF0BA]/65 tabular-nums">
              of {totalTasks} total tasks
            </span>
          </div>

          <div className="bg-[#18220C] p-5 rounded-2xl border border-[#FFF0BA]/15 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#FFF0BA]/70">Hours Logged</span>
            <div className="my-2">
              <span className="text-3xl font-bold font-mono text-[#FFF0BA] tabular-nums">{totalHours}h</span>
            </div>
            <span className="text-xs font-mono text-[#FFF0BA]/65 tabular-nums">
              across {activities.length} sessions
            </span>
          </div>

          <div className="bg-[#18220C] p-5 rounded-2xl border border-[#FFF0BA]/15 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#FFF0BA]/70">Focus Streak</span>
            <div className="my-2">
              <span className="text-3xl font-bold font-mono text-[#FFF0BA] tabular-nums">
                {focusStreak} Day{focusStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-xs font-mono text-[#FFF0BA]/65">
              {focusStreak > 0 ? 'Consecutive days active' : 'Log a session to start'}
            </span>
          </div>

          <div className="bg-[#18220C] p-5 rounded-2xl border border-[#FFF0BA]/15 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#FFF0BA]/70">Completion Rate</span>
            <div className="my-2">
              <span className="text-3xl font-bold font-mono text-[#FFF0BA] tabular-nums">{completionRate}%</span>
            </div>
            <span className="text-xs font-mono text-[#FFF0BA]/65 tabular-nums">
              Daily Target: {settings.dailyGoalHours || profile.dailyGoalHours || 4}h
            </span>
          </div>
        </div>

        {/* Weekly Bars + Colonial White Efficiency Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Task Completion Chart */}
          <div className="lg:col-span-8 bg-[#18220C] border border-[#FFF0BA]/15 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#FFF0BA] tracking-tight">Weekly Task Completion</h2>
                <p className="text-xs text-[#FFF0BA]/60 mt-0.5">Completed tasks vs total created this week</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-[#FFF0BA]"></div>
                  <span className="text-[#FFF0BA]/85">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-[#111808] border border-[#FFF0BA]/30"></div>
                  <span className="text-[#FFF0BA]/55">Capacity</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Canvas Area */}
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#FFF0BA]/15 relative">
              {weeklyData.map((d) => {
                const isHovered = selectedBarDay === d.day;
                const barHeight = d.planned > 0 || d.completed > 0 ? Math.max(18, d.height) : 10;
                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => setSelectedBarDay(d.day)}
                    onMouseLeave={() => setSelectedBarDay(null)}
                    className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                  >
                    {isHovered && (
                      <div className="absolute -top-10 bg-[#FFF0BA] text-[#111808] text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-xl z-20 whitespace-nowrap tabular-nums">
                        {d.completed} done / {d.planned} created
                      </div>
                    )}
                    <div className="w-full max-w-[44px] bg-[#111808] border border-[#FFF0BA]/15 rounded-t-xl h-44 flex items-end justify-center p-1 relative overflow-hidden">
                      <div
                        className="w-full bg-[#FFF0BA] rounded-t-lg transition-all duration-300"
                        style={{ height: `${barHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-[#FFF0BA]/70 group-hover:text-[#FFF0BA] transition-colors">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonial White Efficiency Summary */}
          <div className="lg:col-span-4 bg-[#FFF0BA] text-[#111808] rounded-2xl p-6 border border-[#111808]/15 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#111808]/75">Academic Standing</span>
              <h3 className="text-3xl font-bold text-[#111808] mt-1.5 tracking-tight">
                {completionRate >= 90
                  ? 'Standing: A+'
                  : completionRate >= 75
                  ? 'Standing: A'
                  : completionRate >= 50
                  ? 'Standing: B+'
                  : completionRate > 0
                  ? 'In Progress'
                  : 'Get Started'}
              </h3>
              <p className="text-xs text-[#111808]/80 mt-1">
                {completionRate >= 75
                  ? 'Your study consistency reflects strong academic discipline.'
                  : 'Complete scheduled assignments and log study sessions to raise your standing.'}
              </p>
            </div>

            <div className="space-y-4 my-5">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-[#111808] mb-1.5 tabular-nums">
                  <span>Assignment Completion</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-[#111808]/15 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#111808] h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-[#111808] mb-1.5 tabular-nums">
                  <span>Daily Study Goal</span>
                  <span>{studyGoalProgress}%</span>
                </div>
                <div className="w-full bg-[#111808]/15 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#111808] h-full rounded-full transition-all duration-500"
                    style={{ width: `${studyGoalProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-[#111808]/80 pt-3 border-t border-[#111808]/15 flex justify-between items-center tabular-nums">
              <span>Total Study Hours</span>
              <span className="font-bold">{totalHours}h</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
