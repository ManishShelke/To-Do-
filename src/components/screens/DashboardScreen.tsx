import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';

export const DashboardScreen: React.FC = () => {
  const { tasks, toggleTask, profile, setIsAddTaskModalOpen, searchQuery, currentUser, activities } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = profile.fullName || currentUser?.displayName || 'Scholar';
  const firstName = displayName.split(' ')[0];

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;
  const productivityPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Total study time logged in minutes from real activities
  const totalStudyMinutes = activities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
  const totalStudyHoursFormatted = (totalStudyMinutes / 60).toFixed(1);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      const match =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.subjectTag && task.subjectTag.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!match) return false;
    }
    if (filterMode === 'pending') return !task.completed;
    if (filterMode === 'completed') return task.completed;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#B81104] text-[#FFFACD] border border-[#FFFACD]/30 text-xs font-mono font-bold">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFFACD]/20 text-[#FFFACD] border border-[#FFFACD]/30 text-xs font-mono">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[#FFFACD]/70 text-xs font-mono border border-[#FFFACD]/10">
            Low
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#120303] text-[#FFFACD]">
      <TopHeader showSearch={true} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto space-y-8 pb-16">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-syne uppercase tracking-[0.25em] text-[#FFFACD]/60 font-bold">Live Academic Cloud</span>
                <span className="w-2 h-2 rounded-full bg-[#B81104] animate-pulse"></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#FFFACD] tracking-tight font-normal">
                {getGreeting()}, {firstName}
              </h2>
              <p className="text-xs text-[#FFFACD]/60 mt-1 font-syne tracking-wide">
                Here is your live study progress, active tasks, and academic performance metrics.
              </p>
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="bg-[#B81104] hover:bg-[#8E0D03] text-[#FFFACD] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-[#B81104]/30 border border-[#FFFACD]/30 transition-all font-syne self-start sm:self-auto cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Task
            </button>
          </div>

          {/* Aesthetic Hero Banner - Milano Red & Lemon Chiffon Contrast Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milano Red Feature Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#B81104] to-[#8E0D03] text-[#FFFACD] border border-[#FFFACD]/30 shadow-2xl shadow-[#B81104]/30 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FFFACD]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-bold font-syne uppercase tracking-[0.25em] text-[#FFFACD]/80">
                  Milano Focus
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#120303]/40 px-2.5 py-1 rounded-full border border-[#FFFACD]/20 text-[#FFFACD]">
                  #B81104
                </span>
              </div>
              <div className="relative z-10 my-2">
                <h3 className="text-2xl sm:text-3xl font-serif tracking-tight font-normal text-[#FFFACD]">
                  {pendingCount} Active Goal{pendingCount !== 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-[#FFFACD]/80 mt-1 font-syne">
                  {pendingCount === 0
                    ? 'All current tasks complete! Add new milestones.'
                    : 'Maintain focus and conquer your schedule today.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFFACD]/70 pt-2 border-t border-[#FFFACD]/15">
                <span className="material-symbols-outlined text-[15px]">trending_up</span>
                <span>Productivity Index: {productivityPercent}%</span>
              </div>
            </div>

            {/* Lemon Chiffon Feature Card */}
            <div className="rounded-2xl p-6 bg-[#FFFACD] text-[#120303] border border-[#B81104]/20 shadow-2xl shadow-black/20 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#B81104]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-bold font-syne uppercase tracking-[0.25em] text-[#B81104]">
                  Lemon Chiffon
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#120303]/10 px-2.5 py-1 rounded-full border border-[#B81104]/30 text-[#B81104]">
                  #FFFACD
                </span>
              </div>
              <div className="relative z-10 my-2">
                <h3 className="text-2xl sm:text-3xl font-serif tracking-tight font-normal text-[#B81104]">
                  {totalStudyHoursFormatted}h Studied
                </h3>
                <p className="text-xs text-[#120303]/80 mt-1 font-syne">
                  {activities.length} focus session{activities.length !== 1 ? 's' : ''} logged in Firebase.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#B81104]/80 pt-2 border-t border-[#B81104]/20">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                <span>Target: {profile.dailyGoalHours || 4}h daily goal</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1: Total Tasks */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFFACD]/15 hover:border-[#B81104]/50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase tracking-widest text-[#FFFACD]/60 font-syne font-semibold">Total Tasks</span>
                <span className="material-symbols-outlined text-[#FFFACD]/40 text-[20px]">checklist</span>
              </div>
              <span className="text-3xl sm:text-4xl font-light text-[#FFFACD] font-mono">{totalCount}</span>
            </div>

            {/* Stat 2: Completed */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFFACD]/15 hover:border-[#B81104]/50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase tracking-widest text-[#FFFACD]/60 font-syne font-semibold">Completed</span>
                <span className="material-symbols-outlined text-[#FFFACD]/40 text-[20px]">check_circle</span>
              </div>
              <span className="text-3xl sm:text-4xl font-light text-[#FFFACD] font-mono">{completedCount}</span>
            </div>

            {/* Stat 3: Pending */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFFACD]/15 hover:border-[#B81104]/50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] uppercase tracking-widest text-[#FFFACD]/60 font-syne font-semibold">Pending</span>
                <span className="material-symbols-outlined text-[#B81104] text-[20px]">schedule</span>
              </div>
              <span className="text-3xl sm:text-4xl font-light text-[#B81104] font-mono">{pendingCount}</span>
            </div>

            {/* Stat 4: Productivity Rate */}
            <div className="glass-card rounded-2xl p-5 flex items-center justify-between border border-[#FFFACD]/15 hover:border-[#B81104]/50 transition-colors col-span-2 md:col-span-1">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-[#FFFACD]/60 font-syne font-semibold mb-1">Score</span>
                <span className="text-2xl font-bold text-[#FFFACD] font-mono">{productivityPercent}%</span>
                <span className="text-[10px] font-mono text-[#FFFACD]/50 mt-1">Real-time stats</span>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-[#FFFACD]/10"
                    fill="none"
                    strokeWidth="3"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-[#B81104] transition-all duration-700"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${productivityPercent}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-bold text-[#FFFACD]">
                  {productivityPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Main Tasks Feed */}
          <div className="space-y-4 font-syne">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif text-[#FFFACD] tracking-wide font-normal">Active Assignments & Tasks</h3>
                <span className="text-xs bg-[#B81104]/20 border border-[#B81104]/40 text-[#FFFACD] px-2.5 py-0.5 rounded-full font-mono">
                  {filteredTasks.length}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-[#1C0606] rounded-xl border border-[#FFFACD]/15">
                {(['all', 'pending', 'completed'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                      filterMode === m
                        ? 'bg-[#B81104] text-[#FFFACD] font-bold shadow-sm'
                        : 'text-[#FFFACD]/60 hover:text-[#FFFACD]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center border border-[#FFFACD]/15 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#B81104]/20 border border-[#B81104]/40 text-[#FFFACD] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">assignment_add</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-serif text-[#FFFACD]">No tasks in this view</h4>
                  <p className="text-xs text-[#FFFACD]/60 max-w-sm mx-auto font-syne">
                    {tasks.length === 0
                      ? 'Your task queue is clear. Create your first assignment or study goal.'
                      : 'No tasks match your selected filter.'}
                  </p>
                </div>
                {tasks.length === 0 && (
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="bg-[#B81104] hover:bg-[#8E0D03] text-[#FFFACD] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full inline-flex items-center gap-2 border border-[#FFFACD]/30 shadow-lg shadow-[#B81104]/30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Create Your First Task
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`glass-card rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-200 border ${
                      task.completed
                        ? 'border-[#FFFACD]/10 bg-[#160404]/60 opacity-60'
                        : 'border-[#FFFACD]/15 hover:border-[#B81104]/60 hover:bg-[#200808]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="custom-checkbox shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-sm font-medium tracking-wide truncate ${
                              task.completed ? 'line-through text-[#FFFACD]/40' : 'text-[#FFFACD]'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.subjectTag && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFFACD]/10 text-[#FFFACD]/80 border border-[#FFFACD]/15">
                              {task.subjectTag}
                            </span>
                          )}
                        </div>
                        {task.notes && (
                          <p className="text-xs text-[#FFFACD]/50 truncate mt-0.5">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-[#FFFACD]/60 hidden sm:inline">
                        {task.dueDate}
                      </span>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
