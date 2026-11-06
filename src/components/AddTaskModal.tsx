import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCategory, TaskPriority } from '../types';

export const AddTaskModal: React.FC = () => {
  const { isAddTaskModalOpen, setIsAddTaskModalOpen, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('study');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDateTime, setDueDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [subjectTag, setSubjectTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    let formattedDue = 'Upcoming';
    if (dueDateTime) {
      const dateObj = new Date(dueDateTime);
      const isToday = new Date().toDateString() === dateObj.toDateString();
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      formattedDue = isToday
        ? `Today, ${timeStr}`
        : `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
    }

    let defaultSubject = subjectTag.trim();
    if (!defaultSubject) {
      switch (category) {
        case 'coding':
          defaultSubject = 'Coding';
          break;
        case 'study':
          defaultSubject = 'Academic';
          break;
        case 'assignment':
          defaultSubject = 'Assignment';
          break;
        case 'project':
          defaultSubject = 'Project';
          break;
        case 'personal':
          defaultSubject = 'Personal';
          break;
        default:
          defaultSubject = 'General';
      }
    }

    await addTask({
      title: title.trim(),
      category,
      priority,
      dueDate: formattedDue,
      dueDateRaw: dueDateTime,
      completed: false,
      notes: notes.trim() || undefined,
      subjectTag: defaultSubject,
    });

    setIsSubmitting(false);
    setTitle('');
    setCategory('study');
    setPriority('medium');
    setDueDateTime('');
    setNotes('');
    setSubjectTag('');
    setIsAddTaskModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAddTaskModalOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-modal-title"
        className="bg-[#18220C] text-[#FFF0BA] w-full max-w-lg rounded-2xl shadow-2xl border border-[#FFF0BA]/25 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#FFF0BA]/15 bg-[#111808]">
          <h3 id="add-task-modal-title" className="text-lg font-bold text-[#FFF0BA] tracking-tight">
            New Academic Task
          </h3>
          <button
            onClick={() => setIsAddTaskModalOpen(false)}
            className="p-1.5 text-[#FFF0BA]/60 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 rounded-lg transition-colors cursor-pointer"
            type="button"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            {/* Title Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-title-input" className="text-xs font-semibold text-[#FFF0BA]/80">
                Task Title
              </label>
              <input
                id="task-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Complete Differential Equations Problem Set"
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all placeholder:text-[#FFF0BA]/35"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-category-select" className="text-xs font-semibold text-[#FFF0BA]/80">
                  Category
                </label>
                <select
                  id="task-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all cursor-pointer"
                >
                  <option value="study" className="bg-[#111808] text-[#FFF0BA]">Study / Lecture</option>
                  <option value="coding" className="bg-[#111808] text-[#FFF0BA]">Coding / Lab</option>
                  <option value="assignment" className="bg-[#111808] text-[#FFF0BA]">Assignment</option>
                  <option value="project" className="bg-[#111808] text-[#FFF0BA]">Project</option>
                  <option value="personal" className="bg-[#111808] text-[#FFF0BA]">Personal / Reading</option>
                  <option value="other" className="bg-[#111808] text-[#FFF0BA]">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-priority-select" className="text-xs font-semibold text-[#FFF0BA]/80">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all cursor-pointer"
                >
                  <option value="high" className="bg-[#111808] text-[#FFF0BA]">High Priority</option>
                  <option value="medium" className="bg-[#111808] text-[#FFF0BA]">Medium Priority</option>
                  <option value="low" className="bg-[#111808] text-[#FFF0BA]">Low Priority</option>
                  <option value="none" className="bg-[#111808] text-[#FFF0BA]">None</option>
                </select>
              </div>
            </div>

            {/* Subject / Course Tag */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-subject-input" className="text-xs font-semibold text-[#FFF0BA]/80">
                Course / Subject Tag
              </label>
              <input
                id="task-subject-input"
                type="text"
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                placeholder="e.g., MATH 304, CS 412, History"
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all placeholder:text-[#FFF0BA]/35"
              />
            </div>

            {/* Due Date & Time */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-due-input" className="text-xs font-semibold text-[#FFF0BA]/80">
                Due Date & Time
              </label>
              <input
                id="task-due-input"
                type="datetime-local"
                value={dueDateTime}
                onChange={(e) => setDueDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all [color-scheme:dark]"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-notes-input" className="text-xs font-semibold text-[#FFF0BA]/80">
                Notes (Optional)
              </label>
              <textarea
                id="task-notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add problem references, chapter numbers, or specific requirements..."
                className="w-full p-3 bg-[#111808] border border-[#FFF0BA]/25 focus:border-[#FFF0BA] rounded-xl text-xs text-[#FFF0BA] outline-none transition-all placeholder:text-[#FFF0BA]/35 resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-[#FFF0BA]/15 bg-[#111808] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#FFF0BA]/25 text-[#FFF0BA]/80 hover:text-[#FFF0BA] hover:bg-[#FFF0BA]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFF0BA] text-[#111808] hover:bg-[#FFF6D6] transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
