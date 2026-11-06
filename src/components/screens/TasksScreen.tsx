import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from '../TopHeader';
import { calculateCompletionRate } from '../../utils/academicMetrics';

export const TasksScreen: React.FC = () => {
  const { tasks, toggleTask, deleteTask, setIsAddTaskModalOpen, searchQuery, setSearchQuery } = useApp();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'study', label: 'Study', count: tasks.filter((t) => t.category === 'study').length },
    { id: 'coding', label: 'Coding', count: tasks.filter((t) => t.category === 'coding').length },
    { id: 'assignment', label: 'Assignment', count: tasks.filter((t) => t.category === 'assignment').length },
    { id: 'project', label: 'Project', count: tasks.filter((t) => t.category === 'project').length },
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
  const progressPercent = calculateCompletionRate(tasks);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111808] text-[#FFF0BA]">
      <TopHeader title="Tasks Management" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-20">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18220C] rounded-2xl border border-[#FFF0BA]/15 p-3">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#111808] rounded-xl w-full sm:w-auto border border-[#FFF0BA]/15">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategoryTab === tab.id
                    ? 'bg-[#FFF0BA] text-[#111808] font-bold shadow-sm'
                    : 'text-[#FFF0BA]/70 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-[11px] font-mono tabular-nums opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Add button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#FFF0BA]/50 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tasks..."
                aria-label="Filter tasks"
                className="w-full pl-9 pr-4 py-2 bg-[#111808] border border-[#FFF0BA]/20 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] placeholder:text-[#FFF0BA]/40 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-2 bg-[#FFF0BA] hover:bg-[#FFF6D6] text-[#111808] px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid: Task List + Sidebar Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[480px]">
          {/* Task List Section */}
          <div className="lg:col-span-8 flex flex-col gap-3 bg-[#18220C] rounded-2xl border border-[#FFF0BA]/15 p-5 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-3 py-2 border-b border-[#FFF0BA]/15 text-[#FFF0BA]/60 text-xs font-semibold hidden md:grid">
              <div className="w-6"></div>
              <div>Assignment / Task</div>
              <div className="w-40 text-right">Details</div>
              <div className="w-8"></div>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center text-[#FFF0BA]/50 text-xs space-y-3">
                  <span className="material-symbols-outlined text-[36px] text-[#FFF0BA]/30 block">folder_open</span>
                  <p>No tasks found in this section</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all duration-150 border ${
                      task.completed
                        ? 'border-[#FFF0BA]/10 bg-[#111808]/50 opacity-60'
                        : 'border-[#FFF0BA]/15 hover:border-[#FFF0BA]/40 bg-[#111808]'
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
                            task.completed ? 'line-through text-[#FFF0BA]/40' : 'text-[#FFF0BA]'
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
                              <span className="truncate max-w-xs text-[#FFF0BA]/50">{task.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-xs font-mono text-[#FFF0BA]/75 hidden sm:flex items-center gap-2 tabular-nums">
                        <span className="capitalize">{task.priority}</span>
                        <span aria-hidden="true">·</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-[#FFF0BA]/40 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 transition-colors rounded-lg cursor-pointer"
                        title={`Delete "${task.title}"`}
                        aria-label={`Delete "${task.title}"`}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Progress & Colonial White Highlight */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Colonial White Status Card */}
            <div className="bg-[#FFF0BA] text-[#111808] rounded-2xl p-6 border border-[#111808]/15 shadow-xl flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#111808]/75">Academic Completion</span>
                <h3 className="text-3xl font-bold text-[#111808] tabular-nums">{progressPercent}% Achieved</h3>
                <p className="text-xs text-[#111808]/80">
                  {completedCount} of {totalCount} total assignments completed.
                </p>
              </div>

              <div className="w-full bg-[#111808]/15 h-2.5 rounded-full overflow-hidden my-5">
                <div
                  className="bg-[#111808] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-[#111808] pt-3 border-t border-[#111808]/15 tabular-nums">
                <span>Completed: {completedCount}</span>
                <span>Pending: {totalCount - completedCount}</span>
              </div>
            </div>

            {/* Study Habit Guidance */}
            <div className="bg-[#18220C] rounded-2xl p-6 border border-[#FFF0BA]/15 space-y-4">
              <div className="flex items-center gap-2 text-[#FFF0BA]">
                <span className="material-symbols-outlined text-[#FFF0BA] text-[20px]">lightbulb</span>
                <h4 className="text-base font-bold text-[#FFF0BA]">Structured Study Habit</h4>
              </div>
              <p className="text-xs text-[#FFF0BA]/75 leading-relaxed">
                Tackle high-priority coursework first during your peak focus hours. Log completed study blocks in the Activities view to track cumulative retention.
              </p>
              <div className="p-3 bg-[#111808] rounded-xl border border-[#FFF0BA]/15 text-xs font-mono text-[#FFF0BA]/75 flex items-center justify-between">
                <span>Workspace Storage</span>
                <span className="text-[#FFF0BA] font-bold">Local Persistent</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
