import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Screen,
  Task,
  ActivityLog,
  UserProfile,
  UserSettings,
  LocalUser,
} from '../types';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentUser: LocalUser | null;
  isAuthenticated: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  activities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id'>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  notifications: string[];
  showNotificationToast: (msg: string) => void;
}

const STORAGE_KEYS = {
  USER: 'studentflow_user_v2',
  ACCOUNTS: 'studentflow_accounts_v2',
  TASKS: 'studentflow_tasks_v2',
  ACTIVITIES: 'studentflow_activities_v2',
  PROFILE: 'studentflow_profile_v2',
  SETTINGS: 'studentflow_settings_v2',
};

const LEGACY_KEYS = [
  'studentflow_user_v1',
  'studentflow_accounts_v1',
  'studentflow_tasks_v1',
  'studentflow_activities_v1',
  'studentflow_profile_v1',
  'studentflow_settings_v1',
];

const defaultUser: LocalUser = {
  id: 'local-user',
  email: '',
  displayName: 'Scholar',
};

const defaultProfile: UserProfile = {
  fullName: '',
  email: '',
  major: '',
  bio: '',
  memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  dailyGoalHours: 4,
  lifetimeTasksCompleted: 0,
  lifetimeActivitiesLogged: 0,
};

const defaultSettings: UserSettings = {
  dailyGoalHours: 4,
  notificationsEnabled: true,
  soundEnabled: true,
  autoArchive: false,
};

interface StoredAccount {
  email: string;
  password: string;
  fullName: string;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore storage errors
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() =>
    loadFromStorage<LocalUser | null>(STORAGE_KEYS.USER, defaultUser)
  );
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, [])
  );
  const [activities, setActivities] = useState<ActivityLog[]>(() =>
    loadFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITIES, [])
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, defaultProfile)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, defaultSettings)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch {
      // ignore storage errors
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const showNotificationToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return false;
    }
    if (pass.length < 4) {
      setAuthError('Please enter your password (at least 4 characters).');
      return false;
    }

    const accounts = loadFromStorage<StoredAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
    const matched = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);
    if (matched && matched.password !== pass) {
      setAuthError('Incorrect password for this account.');
      return false;
    }

    const displayName =
      matched?.fullName ||
      profile.fullName ||
      trimmedEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    const loggedInUser: LocalUser = {
      id: `user-${Date.now()}`,
      email: trimmedEmail,
      displayName,
    };

    setCurrentUser(loggedInUser);
    setProfile((prev) => ({
      ...prev,
      fullName: displayName,
      email: trimmedEmail,
    }));
    showNotificationToast(`Welcome, ${displayName}!`);
    setCurrentScreen('dashboard');
    return true;
  };

  const registerWithEmail = async (email: string, pass: string, fullName: string): Promise<boolean> => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || trimmedEmail.split('@')[0];

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return false;
    }
    if (pass.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return false;
    }

    const accounts = loadFromStorage<StoredAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
    const existingIndex = accounts.findIndex((a) => a.email.toLowerCase() === trimmedEmail);
    const newAccount: StoredAccount = {
      email: trimmedEmail,
      password: pass,
      fullName: cleanName,
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = newAccount;
    } else {
      accounts.push(newAccount);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // ignore
    }

    const newUser: LocalUser = {
      id: `user-${Date.now()}`,
      email: trimmedEmail,
      displayName: cleanName,
    };

    const newProfile: UserProfile = {
      fullName: cleanName,
      email: trimmedEmail,
      major: '',
      bio: '',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      dailyGoalHours: 4,
      lifetimeTasksCompleted: 0,
      lifetimeActivitiesLogged: 0,
    };

    setCurrentUser(newUser);
    setProfile(newProfile);
    setTasks([]);
    setActivities([]);
    showNotificationToast('Account created successfully!');
    setCurrentScreen('dashboard');
    return true;
  };

  const logout = async () => {
    setCurrentUser(null);
    showNotificationToast('Signed out of workspace');
    setCurrentScreen('login');
  };

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    const created: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [created, ...prev]);
    showNotificationToast(`Task "${newTask.title}" added!`);
  };

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        setProfile((p) => ({
          ...p,
          lifetimeTasksCompleted: Math.max(
            0,
            (p.lifetimeTasksCompleted || 0) + (nextCompleted ? 1 : -1)
          ),
        }));
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      })
    );
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showNotificationToast('Task removed');
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addActivity = async (newAct: Omit<ActivityLog, 'id'>) => {
    const created: ActivityLog = {
      ...newAct,
      id: `act-${Date.now()}`,
      completed: true,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [created, ...prev]);
    setProfile((p) => ({
      ...p,
      lifetimeActivitiesLogged: (p.lifetimeActivitiesLogged || 0) + 1,
    }));
    showNotificationToast(`Logged ${newAct.durationFormatted} for ${newAct.title}!`);
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showNotificationToast('Activity entry removed');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (updates.fullName && currentUser) {
      setCurrentUser({
        ...currentUser,
        displayName: updates.fullName,
        email: updates.email !== undefined ? updates.email : currentUser.email,
      });
    }
    showNotificationToast('Profile updated');
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    if (updates.dailyGoalHours) {
      setProfile((prev) => ({ ...prev, dailyGoalHours: updates.dailyGoalHours }));
    }
    showNotificationToast('Preferences saved');
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const dynamicNotifications: string[] = [];
  if (pendingTasks.length > 0) {
    dynamicNotifications.push(
      `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''} in your queue.`
    );
    const urgentTask = pendingTasks.find((t) => t.priority === 'high');
    if (urgentTask) {
      dynamicNotifications.push(`High Priority: "${urgentTask.title}" (${urgentTask.dueDate})`);
    }
  } else if (tasks.length > 0) {
    dynamicNotifications.push('All tasks completed! Ready for your next study goal.');
  }
  if (activities.length > 0) {
    const totalMins = activities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
    const hours = (totalMins / 60).toFixed(1);
    dynamicNotifications.push(`Academic Momentum: ${hours}h focused study recorded.`);
  }

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentUser,
        isAuthenticated: !!currentUser,
        authError,
        setAuthError,
        loginWithEmail,
        registerWithEmail,
        logout,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        activities,
        addActivity,
        deleteActivity,
        profile,
        updateProfile,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        notifications: dynamicNotifications,
        showNotificationToast,
      }}
    >
      {children}
      {notificationToast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#FFF0BA] text-[#111808] px-5 py-3.5 rounded-xl shadow-2xl border border-[#111808]/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-[#111808] text-[20px]">check_circle</span>
          <span className="font-semibold text-xs tracking-wide text-[#111808]">{notificationToast}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
