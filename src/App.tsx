import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SideNavBar } from './components/SideNavBar';
import { AddTaskModal } from './components/AddTaskModal';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { ActivitiesScreen } from './components/screens/ActivitiesScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Screen } from './types';

const MainLayout: React.FC = () => {
  const { currentScreen, setCurrentScreen, isAuthenticated, isLoadingAuth } = useApp();
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);

  // If Firebase auth is still initializing, show a stylish Milano Red & Lemon Chiffon loader
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#120303] text-[#FFFACD] flex flex-col items-center justify-center p-6 selection:bg-[#B81104] selection:text-[#FFFACD]">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B81104] to-[#8E0D03] border border-[#FFFACD]/30 flex items-center justify-center shadow-2xl shadow-[#B81104]/30 animate-pulse">
            <span className="material-symbols-outlined text-[#FFFACD] text-[32px]">auto_stories</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif tracking-[0.25em] text-[#FFFACD] uppercase">StudentFlow</h1>
            <p className="text-xs font-mono uppercase tracking-widest text-[#FFFACD]/50">Connecting to Cloud Database...</p>
          </div>
          <div className="w-48 h-1 bg-[#1C0606] rounded-full overflow-hidden border border-[#FFFACD]/10">
            <div className="h-full bg-gradient-to-r from-[#B81104] via-[#FFFACD] to-[#B81104] animate-indeterminate rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is on login or register screen or not authenticated
  if (currentScreen === 'login' || (!isAuthenticated && currentScreen !== 'register')) {
    return (
      <div className="relative min-h-screen flex flex-col bg-[#120303] text-[#FFFACD] selection:bg-[#B81104] selection:text-[#FFFACD]">
        <ScreenSwitcherBadge
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          isOpen={showScreenSwitcher}
          setIsOpen={setShowScreenSwitcher}
        />
        <LoginScreen />
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="relative min-h-screen flex flex-col bg-[#120303] text-[#FFFACD] selection:bg-[#B81104] selection:text-[#FFFACD]">
        <ScreenSwitcherBadge
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          isOpen={showScreenSwitcher}
          setIsOpen={setShowScreenSwitcher}
        />
        <RegisterScreen />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'activities':
        return <ActivitiesScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const mobileNavItems: { id: Screen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'activities', label: 'Activities', icon: 'pending_actions' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#120303] text-[#FFFACD] antialiased selection:bg-[#B81104] selection:text-[#FFFACD]">
      {/* Quick Screen Switcher Badge */}
      <ScreenSwitcherBadge
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        isOpen={showScreenSwitcher}
        setIsOpen={setShowScreenSwitcher}
      />

      {/* Desktop Sidebar */}
      <SideNavBar />

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {renderActiveScreen()}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#180404]/95 backdrop-blur-xl border-t border-[#FFFACD]/15 flex items-center justify-around px-2 z-40">
        {mobileNavItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
                isActive ? 'text-[#FFFACD] font-bold scale-105' : 'text-[#FFFACD]/40 hover:text-[#FFFACD]/80'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-wider uppercase font-syne">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Add Task Modal */}
      <AddTaskModal />
    </div>
  );
};

interface ScreenSwitcherProps {
  currentScreen: Screen;
  setCurrentScreen: (s: Screen) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

const ScreenSwitcherBadge: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  setCurrentScreen,
  isOpen,
  setIsOpen,
}) => {
  const screens: { id: Screen; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'activities', label: 'Activity' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'profile', label: 'Profile' },
    { id: 'login', label: 'Sign In' },
    { id: 'register', label: 'Register' },
  ];

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center">
      {isOpen ? (
        <div className="bg-[#1C0606]/95 backdrop-blur-md text-[#FFFACD] p-2.5 rounded-2xl shadow-2xl border border-[#FFFACD]/25 flex flex-wrap items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 max-w-[95vw]">
          <span className="text-[10px] font-semibold text-[#FFFACD]/60 px-2 uppercase tracking-widest font-syne">
            View Screen:
          </span>
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScreen(s.id);
                setIsOpen(false);
              }}
              className={`px-3 py-1 rounded-full text-xs transition-all font-syne cursor-pointer ${
                currentScreen === s.id
                  ? 'bg-[#B81104] text-[#FFFACD] font-bold shadow-md shadow-[#B81104]/30'
                  : 'bg-[#FFFACD]/10 text-[#FFFACD]/80 hover:bg-[#FFFACD]/20 hover:text-[#FFFACD] border border-[#FFFACD]/10'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-[#FFFACD]/50 hover:text-[#FFFACD] rounded-full ml-1 hover:bg-[#FFFACD]/10 cursor-pointer"
            title="Close switcher"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1C0606]/90 hover:bg-[#280B0A] text-[#FFFACD] px-3.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border border-[#FFFACD]/20 shadow-lg flex items-center gap-2 transition-all cursor-pointer group"
          title="Quick switch between screens"
        >
          <span className="w-2 h-2 rounded-full bg-[#B81104] group-hover:scale-125 transition-transform animate-ping"></span>
          <span className="hidden sm:inline text-[#FFFACD]/60 font-syne uppercase tracking-wider text-[10px]">Screen:</span>
          <span className="font-semibold text-[#FFFACD] capitalize tracking-wide font-syne">{currentScreen}</span>
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
