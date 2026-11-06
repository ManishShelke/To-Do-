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
  const { currentScreen, setCurrentScreen, isAuthenticated } = useApp();
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);

  if (currentScreen === 'login' || (!isAuthenticated && currentScreen !== 'register')) {
    return (
      <div className="relative min-h-screen flex flex-col bg-[#111808] text-[#FFF0BA] selection:bg-[#FFF0BA] selection:text-[#111808]">
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
      <div className="relative min-h-screen flex flex-col bg-[#111808] text-[#FFF0BA] selection:bg-[#FFF0BA] selection:text-[#111808]">
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#111808] text-[#FFF0BA] antialiased selection:bg-[#FFF0BA] selection:text-[#111808]">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#18220C]/95 backdrop-blur-xl border-t border-[#FFF0BA]/15 flex items-center justify-around px-2 z-40">
        {mobileNavItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
                isActive ? 'text-[#FFF0BA] font-bold scale-105' : 'text-[#FFF0BA]/50 hover:text-[#FFF0BA]/80'
              }`}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
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
    <div className="fixed bottom-20 md:bottom-4 right-4 z-40 flex items-center">
      {isOpen ? (
        <div className="bg-[#18220C] text-[#FFF0BA] p-2.5 rounded-2xl shadow-2xl border border-[#FFF0BA]/25 flex flex-wrap items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 max-w-[95vw]">
          <span className="text-[11px] font-semibold text-[#FFF0BA]/70 px-2">
            View Screen:
          </span>
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScreen(s.id);
                setIsOpen(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentScreen === s.id
                  ? 'bg-[#FFF0BA] text-[#111808] font-bold shadow-sm'
                  : 'bg-[#111808] text-[#FFF0BA]/80 hover:bg-[#FFF0BA]/15 hover:text-[#FFF0BA] border border-[#FFF0BA]/15'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-[#FFF0BA]/60 hover:text-[#FFF0BA] rounded-lg ml-1 hover:bg-[#FFF0BA]/10 cursor-pointer"
            title="Close switcher"
            aria-label="Close screen switcher"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#18220C] hover:bg-[#212E11] text-[#FFF0BA] px-3.5 py-2 rounded-xl text-xs font-medium border border-[#FFF0BA]/25 shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          title="Quick switch between screens"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[15px] text-[#FFF0BA]/70">layers</span>
          <span className="text-[#FFF0BA]/70">Screen:</span>
          <span className="font-bold text-[#FFF0BA] capitalize">{currentScreen}</span>
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
