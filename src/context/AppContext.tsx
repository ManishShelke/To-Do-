import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Screen, 
  Task, 
  ActivityLog, 
  UserProfile, 
  UserSettings 
} from '../types';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from '../lib/firebase';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingData: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginWithGoogle: () => Promise<boolean>;
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

const defaultProfile: UserProfile = {
  fullName: '',
  email: '',
  bio: 'Academic achiever passionate about structured learning.',
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showNotificationToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // 1. Listen for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);

      if (user) {
        setAuthError(null);
        // Load or create initial user profile in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setProfile(data);
          } else {
            const newProfile: UserProfile = {
              fullName: user.displayName || user.email?.split('@')[0] || 'Student',
              email: user.email || '',
              bio: 'Focused on academic excellence and daily progress.',
              memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              avatarUrl: user.photoURL || undefined,
              dailyGoalHours: 4,
              lifetimeTasksCompleted: 0,
              lifetimeActivitiesLogged: 0,
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err: any) {
          console.error('Error fetching user document:', err);
        }

        // If currently on login or register screen, transition to dashboard
        setCurrentScreen((prev) => (prev === 'login' || prev === 'register' ? 'dashboard' : prev));
      } else {
        // Reset state on sign out
        setTasks([]);
        setActivities([]);
        setProfile(defaultProfile);
        setSettings(defaultSettings);
        setCurrentScreen('login');
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listeners for Tasks, Activities, and Settings
  useEffect(() => {
    if (!currentUser) return;

    setIsLoadingData(true);
    const uid = currentUser.uid;

    // Listen to user's Tasks
    const tasksRef = collection(db, 'users', uid, 'tasks');
    const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loadedTasks: Task[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Task, 'id'>),
        }));
        setTasks(loadedTasks);
        setIsLoadingData(false);
      },
      (err) => {
        console.error('Firestore Tasks error:', err);
        setIsLoadingData(false);
      }
    );

    // Listen to user's Activities
    const activitiesRef = collection(db, 'users', uid, 'activities');
    const activitiesQuery = query(activitiesRef, orderBy('createdAt', 'desc'));
    const unsubActivities = onSnapshot(
      activitiesQuery,
      (snapshot) => {
        const loadedActivities: ActivityLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ActivityLog, 'id'>),
        }));
        setActivities(loadedActivities);
      },
      (err) => {
        console.error('Firestore Activities error:', err);
      }
    );

    // Listen to User Profile updates
    const userDocRef = doc(db, 'users', uid);
    const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    });

    // Listen to Settings
    const settingsDocRef = doc(db, 'users', uid, 'settings', 'preferences');
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as UserSettings);
      }
    });

    return () => {
      unsubTasks();
      unsubActivities();
      unsubProfile();
      unsubSettings();
    };
  }, [currentUser]);

  // Auth Functions
  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        // Ensure user document exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          const newProfile: UserProfile = {
            fullName: user.displayName || 'Student',
            email: user.email || '',
            bio: 'Academic achiever passionate about structured learning.',
            memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            avatarUrl: user.photoURL || undefined,
            dailyGoalHours: 4,
            lifetimeTasksCompleted: 0,
            lifetimeActivitiesLogged: 0,
          };
          await setDoc(userDocRef, newProfile);
          setProfile(newProfile);
        }
        showNotificationToast(`Welcome back, ${user.displayName || 'Scholar'}!`);
        setCurrentScreen('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let message = 'Failed to sign in with Google. Please try again.';
      if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized for sign-in. If running locally, ensure "localhost" is added to Firebase Console → Authentication → Authorized Domains.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        message = 'Sign-in was cancelled. Please try again.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection and try again.';
      }
      setAuthError(message);
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showNotificationToast('Signed in successfully');
      setCurrentScreen('dashboard');
      return true;
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      let message = 'Invalid email or password';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      if (err.code === 'auth/invalid-credential') message = 'Invalid credentials. Please verify your email and password.';
      setAuthError(message);
      return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string, fullName: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const user = res.user;
      const initialProfile: UserProfile = {
        fullName: fullName || email.split('@')[0],
        email: user.email || email,
        bio: 'Academic achiever passionate about structured learning.',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        dailyGoalHours: 4,
        lifetimeTasksCompleted: 0,
        lifetimeActivitiesLogged: 0,
      };
      await setDoc(doc(db, 'users', user.uid), initialProfile);
      setProfile(initialProfile);
      showNotificationToast('Account created successfully!');
      setCurrentScreen('dashboard');
      return true;
    } catch (err: any) {
      console.error('Registration Error:', err);
      let message = 'Failed to register account.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered. Please sign in.';
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      setAuthError(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showNotificationToast('Logged out');
      setCurrentScreen('login');
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  // Task Operations with Real Firestore
  const addTask = async (newTask: Omit<Task, 'id'>) => {
    if (!currentUser) {
      showNotificationToast('Please sign in to add tasks');
      return;
    }
    try {
      const taskData = {
        ...newTask,
        completed: false,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'users', currentUser.uid, 'tasks'), taskData);
      showNotificationToast(`Task "${newTask.title}" created!`);
    } catch (err: any) {
      console.error('Error adding task:', err);
      showNotificationToast('Failed to save task to database.');
    }
  };

  const toggleTask = async (id: string) => {
    if (!currentUser) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;
    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', id);
      await updateDoc(taskRef, {
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
      });

      // Update lifetime stats in profile
      const userRef = doc(db, 'users', currentUser.uid);
      if (nextCompleted) {
        await updateDoc(userRef, {
          lifetimeTasksCompleted: (profile.lifetimeTasksCompleted || 0) + 1,
        });
      } else {
        const newCount = Math.max(0, (profile.lifetimeTasksCompleted || 0) - 1);
        await updateDoc(userRef, {
          lifetimeTasksCompleted: newCount,
        });
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', id));
      showNotificationToast('Task deleted');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', id), updates);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Activity Operations with Real Firestore
  const addActivity = async (newAct: Omit<ActivityLog, 'id'>) => {
    if (!currentUser) {
      showNotificationToast('Please sign in to log activity');
      return;
    }
    try {
      const actData = {
        ...newAct,
        completed: true,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'users', currentUser.uid, 'activities'), actData);

      // Increment logged activities counter
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        lifetimeActivitiesLogged: (profile.lifetimeActivitiesLogged || 0) + 1,
      });

      showNotificationToast(`Logged ${newAct.durationFormatted} for ${newAct.title}!`);
    } catch (err) {
      console.error('Error logging activity:', err);
      showNotificationToast('Failed to save activity log.');
    }
  };

  const deleteActivity = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'activities', id));
      showNotificationToast('Activity removed');
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  // Profile and Settings Updates
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, updates, { merge: true });
      showNotificationToast('Profile updated');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!currentUser) return;
    try {
      const settingsRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
      await setDoc(settingsRef, updates, { merge: true });
      showNotificationToast('Preferences saved');
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Real Dynamic Notifications based on user tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const dynamicNotifications: string[] = [];
  if (pendingTasks.length > 0) {
    dynamicNotifications.push(`You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''} in your queue.`);
    const urgentTask = pendingTasks.find((t) => t.priority === 'high');
    if (urgentTask) {
      dynamicNotifications.push(`High Priority: "${urgentTask.title}" (${urgentTask.dueDate})`);
    }
  } else {
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
        isLoadingAuth,
        isLoadingData,
        authError,
        setAuthError,
        loginWithGoogle,
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
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#1C0606] text-[#FFFACD] px-5 py-3.5 rounded-xl shadow-2xl border border-[#B81104]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-[#B81104] text-[20px]">check_circle</span>
          <span className="font-medium text-xs tracking-wide text-[#FFFACD]">{notificationToast}</span>
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
