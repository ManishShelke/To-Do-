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

    // Reset & close
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAddTaskModalOpen(false);
      }}
    >
      <div className="bg-[#1C0606] text-[#FFFACD] w-full max-w-lg rounded-2xl shadow-2xl border border-[#FFFACD]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header with Milano Red Accent */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#FFFACD]/15 bg-[#250807]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B81104]"></span>
            <h3 className="font-serif text-xl text-[#FFFACD] tracking-wide font-normal">New Academic Task</h3>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(false)}
            className="p-1.5 text-[#FFFACD]/50 hover:text-[#FFFACD] hover:bg-[#FFFACD]/10 rounded-full transition-colors cursor-pointer"
            type="button"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh] font-syne">
            {/* Title Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Complete Differential Equations Problem Set"
                className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all placeholder:text-[#FFFACD]/30"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all cursor-pointer"
                >
                  <option value="study" className="bg-[#1C0606] text-[#FFFACD]">Study / Lecture</option>
                  <option value="coding" className="bg-[#1C0606] text-[#FFFACD]">Coding / Lab</option>
                  <option value="assignment" className="bg-[#1C0606] text-[#FFFACD]">Assignment</option>
                  <option value="project" className="bg-[#1C0606] text-[#FFFACD]">Project</option>
                  <option value="personal" className="bg-[#1C0606] text-[#FFFACD]">Personal / Reading</option>
                  <option value="other" className="bg-[#1C0606] text-[#FFFACD]">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all cursor-pointer"
                >
                  <option value="high" className="bg-[#1C0606] text-[#FFFACD]">High Priority</option>
                  <option value="medium" className="bg-[#1C0606] text-[#FFFACD]">Medium Priority</option>
                  <option value="low" className="bg-[#1C0606] text-[#FFFACD]">Low Priority</option>
                  <option value="none" className="bg-[#1C0606] text-[#FFFACD]">None</option>
                </select>
              </div>
            </div>

            {/* Subject / Course Tag */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                Course / Subject Tag
              </label>
              <input
                type="text"
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                placeholder="e.g., Math, Physics, CS 301, History"
                className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all placeholder:text-[#FFFACD]/30"
              />
            </div>

            {/* Due Date & Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={dueDateTime}
                onChange={(e) => setDueDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all [color-scheme:dark]"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#FFFACD]/60 uppercase tracking-widest">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add problem references, chapter numbers, or specific requirements..."
                className="w-full p-3 bg-[#140303] border border-[#FFFACD]/20 focus:border-[#B81104] focus:ring-1 focus:ring-[#B81104]/40 rounded-xl text-xs text-[#FFFACD] outline-none transition-all placeholder:text-[#FFFACD]/30 resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-[#FFFACD]/15 bg-[#250807] flex justify-end gap-3 font-syne">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-mono border border-[#FFFACD]/20 text-[#FFFACD]/70 hover:text-[#FFFACD] hover:bg-[#FFFACD]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#B81104] to-[#8E0D03] text-[#FFFACD] hover:brightness-110 transition-all shadow-lg shadow-[#B81104]/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save to Cloud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
