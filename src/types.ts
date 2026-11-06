export type Screen = 'dashboard' | 'tasks' | 'activities' | 'analytics' | 'profile' | 'login' | 'register';

export type TaskCategory = 'study' | 'coding' | 'assignment' | 'project' | 'personal' | 'other';
export type TaskPriority = 'high' | 'medium' | 'low' | 'none';

export interface LocalUser {
  id: string;
  email: string;
  displayName: string;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // formatted e.g. "Today, 11:59 PM" or "Tomorrow" or ISO
  dueDateRaw?: string;
  completed: boolean;
  notes?: string;
  subjectTag?: string; // e.g. 'Math', 'History', 'Science', 'Comms'
  createdAt?: string;
  completedAt?: string | null;
}

export type ActivityCategory = 'study' | 'coding' | 'reading' | 'break';

export interface ActivityLog {
  id: string;
  title: string;
  category: ActivityCategory;
  durationMinutes: number; // in minutes
  durationFormatted: string; // e.g. "1h 15m" or "45m"
  timestamp: string; // e.g. "Today, 2:30 PM", "Yesterday"
  date: string; // YYYY-MM-DD
  note?: string;
  completed?: boolean;
  createdAt?: string;
}

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  bio: string;
  major?: string;
  memberSince: string;
  avatarUrl?: string;
  dailyGoalHours?: number;
  lifetimeTasksCompleted: number;
  lifetimeActivitiesLogged: number;
}

export interface UserSettings {
  dailyGoalHours: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoArchive: boolean;
}
