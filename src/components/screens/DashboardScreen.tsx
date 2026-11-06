import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';
import { calculateCompletionRate } from '../../utils/academicMetrics';

export const DashboardScreen: React.FC = () => {
  const { tasks, toggleTask, profile, setIsAddTaskModalOpen, searchQuery, currentUser, activities } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

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
  const productivityPercent = calculateCompletionRate(tasks);

  const totalStudyMinutes = activities.reduce((acc, act) => acc + (act.durationMinutes || 0), 0);
  const totalStudyHoursFormatted = (totalStudyMinutes / 60).toFixed(1);

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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
      default:
        return 'Low Priority';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111808] text-[#FFF0BA]">
      <TopHeader showSearch={true} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto space-y-8 pb-16">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <p className="text-xs font-medium text-[#FFF0BA]/65 mb-1">
                Academic Study Overview
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] tracking-tight">
                {getGreeting()}, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-[#FFF0BA]/70 mt-1">
                Track your daily study blocks, active coursework, and academic performance metrics.
              </p>
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="bg-[#FFF0BA] hover:bg-[#FFF6D6] text-[#111808] text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
              Add Task
            </button>
          </div>

          {/* Signature Palette Showcase Cards — Colonial White (#FFF0BA) & Green Waterloo (#111808) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonial White Card (#FFF0BA) */}
            <div className="rounded-3xl p-7 bg-[#FFF0BA] text-[#111808] border border-[#111808]/15 shadow-xl flex flex-col justify-between min-h-[200px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-tight text-[#111808]/80">
                  Colonial White
                </span>
                <span className="text-xs font-mono font-medium px-3 py-1 rounded-full border border-[#111808]/25 text-[#111808]">
                  HEX CODE: #FFF0BA
                </span>
              </div>
              <div className="my-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111808] tabular-nums">
                  {totalStudyHoursFormatted}h Studied
                </h2>
                <p className="text-xs sm:text-sm text-[#111808]/75 mt-1">
                  {activities.length} focused study session{activities.length !== 1 ? 's' : ''} recorded in your log.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#111808]/80 pt-3 border-t border-[#111808]/15 tabular-nums">
                <span>Daily Target: {profile.dailyGoalHours || 4}h</span>
                <span>Completion: {productivityPercent}%</span>
              </div>
            </div>

            {/* Green Waterloo Card (#111808) */}
            <div className="rounded-3xl p-7 bg-[#111808] text-[#FFF0BA] border border-[#FFF0BA]/30 shadow-xl flex flex-col justify-between min-h-[200px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-tight text-[#FFF0BA]/80">
                  Green Waterloo
                </span>
                <span className="text-xs font-mono font-medium px-3 py-1 rounded-full border border-[#FFF0BA]/30 text-[#FFF0BA]">
                  HEX CODE: #111808
                </span>
              </div>
              <div className="my-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FFF0BA] tabular-nums">
                  {pendingCount} Active Goal{pendingCount !== 1 ? 's' : ''}
                </h2>
                <p className="text-xs sm:text-sm text-[#FFF0BA]/75 mt-1">
                  {pendingCount === 0
                    ? 'All current tasks complete. Add new milestones to stay ahead.'
                    : 'Prioritize your active coursework and complete scheduled deliverables.'}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FFF0BA]/75 pt-3 border-t border-[#FFF0BA]/15 tabular-nums">
                <span>Completed: {completedCount}</span>
                <span>Total Tasks: {totalCount}</span>
              </div>
            </div>
          </div>

          {/* 4-Column Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#18220C] rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFF0BA]/15">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#FFF0BA]/70">Total Tasks</span>
                <span className="material-symbols-outlined text-[#FFF0BA]/50 text-[20px]">checklist</span>
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] font-mono tabular-nums">{totalCount}</span>
            </div>

            <div className="bg-[#18220C] rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFF0BA]/15">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#FFF0BA]/70">Completed</span>
                <span className="material-symbols-outlined text-[#FFF0BA]/50 text-[20px]">check_circle</span>
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] font-mono tabular-nums">{completedCount}</span>
            </div>

            <div className="bg-[#18220C] rounded-2xl p-5 flex flex-col justify-between h-32 border border-[#FFF0BA]/15">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#FFF0BA]/70">Pending</span>
                <span className="material-symbols-outlined text-[#FFF0BA] text-[20px]">schedule</span>
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-[#FFF0BA] font-mono tabular-nums">{pendingCount}</span>
            </div>

            <div className="bg-[#18220C] rounded-2xl p-5 flex items-center justify-between h-32 border border-[#FFF0BA]/15 col-span-2 md:col-span-1">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs font-semibold text-[#FFF0BA]/70">Completion Rate</span>
                <span className="text-3xl font-bold text-[#FFF0BA] font-mono tabular-nums">{productivityPercent}%</span>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-[#FFF0BA]/15"
                    fill="none"
                    strokeWidth="3.5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-[#FFF0BA] transition-all duration-500"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${productivityPercent}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-bold text-[#FFF0BA] tabular-nums">
                  {productivityPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Main Tasks Feed */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-[#FFF0BA] tracking-tight">Active Assignments & Tasks</h3>
                <span className="text-xs text-[#FFF0BA]/60 font-mono tabular-nums">
                  · {filteredTasks.length} shown
                </span>
              </div>

              {/* Interactive Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-[#18220C] rounded-xl border border-[#FFF0BA]/15">
                {(['all', 'pending', 'completed'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      filterMode === m
                        ? 'bg-[#FFF0BA] text-[#111808] shadow-sm'
                        : 'text-[#FFF0BA]/70 hover:text-[#FFF0BA]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="bg-[#18220C] rounded-2xl p-10 text-center border border-[#FFF0BA]/15 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0BA] text-[#111808] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">assignment_add</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#FFF0BA]">No tasks in this view</h4>
                  <p className="text-xs text-[#FFF0BA]/65 max-w-sm mx-auto">
                    {tasks.length === 0
                      ? 'Your task queue is clear. Create your first assignment or study goal.'
                      : 'No tasks match your selected filter.'}
                  </p>
                </div>
                {tasks.length === 0 && (
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="bg-[#FFF0BA] hover:bg-[#FFF6D6] text-[#111808] text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Create First Task
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-[#18220C] rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-150 border ${
                      task.completed
                        ? 'border-[#FFF0BA]/10 opacity-60'
                        : 'border-[#FFF0BA]/15 hover:border-[#FFF0BA]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        className="custom-checkbox shrink-0"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            task.completed ? 'line-through text-[#FFF0BA]/50' : 'text-[#FFF0BA]'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#FFF0BA]/65 mt-0.5 flex-wrap">
                          {task.subjectTag && <span>{task.subjectTag}</span>}
                          {task.subjectTag && <span aria-hidden="true">·</span>}
                          <span className="capitalize">{task.category}</span>
                          {task.notes && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-md text-[#FFF0BA]/55">{task.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-[#FFF0BA]/75 tabular-nums">
                      <span className="hidden sm:inline">{task.dueDate}</span>
                      <span aria-hidden="true" className="hidden sm:inline">·</span>
                      <span className={task.priority === 'high' ? 'font-bold text-[#FFF0BA]' : 'text-[#FFF0BA]/70'}>
                        {getPriorityLabel(task.priority)}
                      </span>
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
