import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskCategory } from '../../types';
import { TopHeader } from '../TopHeader';

export const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, deleteTask, setIsAddTaskModalOpen, searchQuery, setSearchQuery } = useApp();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);

  const categories: { id: string; label: string; count: number; icon: string }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length, icon: 'list' },
    { id: 'study', label: 'Study', count: tasks.filter((t) => t.category === 'study').length, icon: 'menu_book' },
    { id: 'coding', label: 'Coding', count: tasks.filter((t) => t.category === 'coding').length, icon: 'code' },
    { id: 'assignment', label: 'Assignment', count: tasks.filter((t) => t.category === 'assignment').length, icon: 'assignment' },
    { id: 'project', label: 'Project', count: tasks.filter((t) => t.category === 'project').length, icon: 'dashboard' },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategoryTab !== 'all' && task.category !== selectedCategoryTab) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        (task.subjectTag && task.subjectTag.toLowerCase().includes(q)) ||
        (task.notes && task.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <div className="flex items-center justify-center gap-1 text-[#FFFACD] bg-[#B81104] px-2.5 py-0.5 rounded-full border border-[#FFFACD]/30 text-xs font-mono font-bold shadow-sm">
            <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              flag
            </span>
            <span>High</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center justify-center gap-1 text-[#FFFACD] bg-[#FFFACD]/20 px-2.5 py-0.5 rounded-full border border-[#FFFACD]/30 text-xs font-mono">
            <span className="material-symbols-outlined text-[13px]">flag</span>
            <span>Med</span>
          </div>
        );
      case 'low':
      default:
        return (
          <div className="flex items-center justify-center gap-1 text-[#FFFACD]/60 bg-white/5 px-2.5 py-0.5 rounded-full border border-[#FFFACD]/15 text-xs font-mono">
            <span className="material-symbols-outlined text-[13px]">flag</span>
            <span>Low</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#120303] text-[#FFFACD]">
      <TopHeader title="Tasks Management" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-20 font-syne">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C0606] rounded-2xl border border-[#FFFACD]/15 p-3 shadow-2xl">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#140303] rounded-xl w-full sm:w-auto border border-[#FFFACD]/10">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategoryTab === tab.id
                    ? 'bg-[#B81104] text-[#FFFACD] shadow-lg shadow-[#B81104]/30'
                    : 'text-[#FFFACD]/60 hover:text-[#FFFACD] hover:bg-[#FFFACD]/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-[10px] font-mono opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Add button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#FFFACD]/40 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/50 rounded-full text-xs text-[#FFFACD] placeholder:text-[#FFFACD]/30 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-2 bg-[#B81104] hover:bg-[#8E0D03] text-[#FFFACD] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#B81104]/40 border border-[#FFFACD]/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Bento Grid: Task List + Sidebar Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
          {/* Task List Section */}
          <div className="lg:col-span-8 flex flex-col gap-3 bg-[#1C0606] rounded-2xl border border-[#FFFACD]/15 p-5 shadow-2xl overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-[#FFFACD]/15 text-[#FFFACD]/50 text-[11px] font-mono uppercase tracking-widest hidden md:grid">
              <div className="w-6"></div>
              <div>Assignment Title</div>
              <div className="w-24 text-center">Category</div>
              <div className="w-24 text-center">Priority</div>
              <div className="w-28 text-right">Due Date</div>
            </div>

            {/* List Container */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center text-[#FFFACD]/40 text-xs font-mono space-y-3">
                  <span className="material-symbols-outlined text-[36px] text-[#FFFACD]/20 block">folder_open</span>
                  <p>No tasks found in this section</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setActiveTaskDetail(task)}
                    className={`rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all duration-200 border cursor-pointer ${
                      task.completed
                        ? 'border-[#FFFACD]/10 bg-[#160404]/50 opacity-60'
                        : 'border-[#FFFACD]/15 hover:border-[#B81104]/60 bg-[#140303] hover:bg-[#200808]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="custom-checkbox shrink-0"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold tracking-wide truncate ${
                            task.completed ? 'line-through text-[#FFFACD]/40' : 'text-[#FFFACD]'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.notes && (
                          <p className="text-xs text-[#FFFACD]/50 truncate mt-0.5">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FFFACD]/10 border border-[#FFFACD]/15 text-[#FFFACD]/80 uppercase hidden md:inline">
                        {task.category}
                      </span>
                      {renderPriorityBadge(task.priority)}
                      <span className="text-xs font-mono text-[#FFFACD]/60 hidden sm:inline w-28 text-right truncate">
                        {task.dueDate}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="p-1 text-[#FFFACD]/30 hover:text-[#B81104] transition-colors rounded-md"
                        title="Delete Task"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Progress & Lemon Chiffon Highlight */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Lemon Chiffon Status Card */}
            <div className="bg-[#FFFACD] text-[#120303] rounded-2xl p-6 border border-[#B81104]/20 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B81104]">Academic Completion</span>
                <h3 className="text-3xl font-serif text-[#B81104] font-normal">{progressPercent}% Achieved</h3>
                <p className="text-xs text-[#120303]/80">
                  {completedCount} of {totalCount} total assignments completed.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#120303]/10 h-2.5 rounded-full overflow-hidden my-4 border border-[#B81104]/20">
                <div
                  className="bg-[#B81104] h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-[#B81104]/90 pt-2 border-t border-[#B81104]/20">
                <span>Completed: {completedCount}</span>
                <span>Pending: {totalCount - completedCount}</span>
              </div>
            </div>

            {/* Quick Task Info or Tips */}
            <div className="glass-card rounded-2xl p-6 border border-[#FFFACD]/15 space-y-4">
              <div className="flex items-center gap-2 text-[#FFFACD]">
                <span className="material-symbols-outlined text-[#B81104] text-[20px]">lightbulb</span>
                <h4 className="font-serif text-lg text-[#FFFACD] font-normal">Milano Study Habit</h4>
              </div>
              <p className="text-xs text-[#FFFACD]/70 leading-relaxed font-syne">
                Tackle high-priority coursework first during your peak energy hours. Log focused intervals in the Daily Activity tab for detailed retention tracking.
              </p>
              <div className="p-3 bg-[#140303] rounded-xl border border-[#FFFACD]/10 text-xs font-mono text-[#FFFACD]/60 flex items-center justify-between">
                <span>Cloud Database:</span>
                <span className="text-[#FFFACD] font-bold">Firestore Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
