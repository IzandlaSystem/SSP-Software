'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bell, 
  Home, 
  Menu, 
  X, 
  Check, 
  Trash2, 
  User, 
  LogOut, 
  Lock, 
  Palette,
  CheckSquare,
  Info,
  AlertTriangle,
  Award
} from 'lucide-react';
import { mockNotifications, Notification } from '@/data/mockNotifications';
import ThemeToggle from './ThemeToggle';

interface PlatformTopbarProps {
  role: 'coach' | 'athlete';
  onMenuClick: () => void;
}

export default function PlatformTopbar({ role, onMenuClick }: PlatformTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Dropdown & Drawer State
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [themeOpen, setThemeOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Notifications State (Filtered by role)
  const roleKey = role === 'coach' ? 'Coach' : 'Athlete';
  const [alerts, setAlerts] = React.useState<Notification[]>(() => {
    return mockNotifications.filter(
      (n) => n.recipientRole === roleKey
    );
  });

  // Click outside handlers
  const profileRef = React.useRef<HTMLDivElement>(null);
  const themeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications Actions
  const handleMarkAsRead = (id: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const handleClearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleClearAll = () => {
    setAlerts([]);
  };

  const unreadCount = alerts.filter(n => !n.read).length;

  // Mock User Detail Info
  const isCoach = role === 'coach';
  const mockUser = isCoach
    ? { name: 'Coach Dan', detail: 'FC United Head Scout', initial: 'CD', email: 'dan@fcunited.com' }
    : { name: 'Alex Long', detail: 'Midfielder #10', initial: 'AL', email: 'alex.long@ssp.com' };

  // Page header info based on the current platform route.
  const getHeaderInfo = (path: string) => {
    if (isCoach) {
      if (path === '/platform/coach') return { category: 'COACH DASHBOARD', title: 'Squad Performance Overview' };
      if (path.includes('/new-session')) return { category: 'NEW SESSION', title: 'Configure Session' };
      if (path.includes('/live-session')) return { category: 'Live Squad Tracking', title: 'Session Movement Tracking' };
      if (path.includes('/session-review')) return { category: 'POST-SESSION REVIEW', title: 'Post-Session Review' };
      if (path.includes('/squad')) return { category: 'SQUAD ANALYTICS', title: 'Squad Performance Analytics' };
      if (path.includes('/analytics')) return { category: 'ADVANCED ANALYTICS', title: 'Performance Analytics' };
      if (path.includes('/benchmarking')) return { category: 'BENCHMARKING', title: 'Squad Fitness Benchmarking' };
      if (path.includes('/workload')) return { category: 'Squad Workload', title: 'Rolling Workload Index' };
      if (path.includes('/readiness')) return { category: 'AVAILABILITY & PREPARATION', title: 'Availability & Session Preparation' };
      if (path.includes('/messages')) return { category: 'MESSAGES', title: 'Team Communications' };
      if (path.includes('/settings')) return { category: 'Settings', title: 'Preferences' };
      return { category: 'COACH PORTAL', title: 'SSP Coach Platform' };
    } else {
      if (path === '/platform/athlete') return { category: 'ATHLETE DASHBOARD', title: 'Performance Summary' };
      if (path.includes('/pair-device')) return { category: 'DEVICE PAIRING', title: 'SSP Wearable Connection' };
      if (path.includes('/live-session')) return { category: 'LIVE ACTIVITY TRACKING', title: 'Sessional Performance Tracking' };
      if (path.includes('/session-review')) return { category: 'SESSION REVIEW', title: 'Session Accomplishments' };
      if (path.includes('/history')) return { category: 'SESSION HISTORY', title: 'Personal Activity History' };
      if (path.includes('/goals')) return { category: 'GOALS', title: 'Performance Milestones' };
      if (path.includes('/sync')) return { category: 'Offline Sync', title: 'Sync Session Data' };
      if (path.includes('/privacy')) return { category: 'PRIVACY CONTROLS', title: 'Data Privacy Settings' };
      if (path.includes('/profile')) return { category: 'PROFILE SETTINGS', title: 'Personal Profile Details' };
      return { category: 'ATHLETE PORTAL', title: 'SSP Athlete Platform' };
    }
  };

  const headerInfo = getHeaderInfo(pathname);

  // Time formatter
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Get Notification Style based on Alert type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'ActionRequired':
        return <CheckSquare className="h-4 w-4 text-brand-blue" />;
      case 'Success':
        return <Award className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-sky-550" />;
    }
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-40 select-none transition-colors">
        
        {/* Left Side: Mobile Menu Button & Dynamic Screen Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-0.5">
              {headerInfo.category}
            </span>
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {headerInfo.title}
            </h2>
          </div>
        </div>

        {/* Right Side: Interactive widgets */}
        <div className="flex items-center space-x-3">
          
          {/* Theme Selector Popover */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="Change theme"
              aria-expanded={themeOpen}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                themeOpen ? 'bg-zinc-100 dark:bg-zinc-800 text-brand-blue' : 'text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
              title="Preferences"
            >
              <Palette className="h-4.5 w-4.5" />
            </button>

            {themeOpen && (
              <div className="absolute right-0 mt-2.5 z-50 w-[320px] transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Dynamic Notifications Bell Indicator */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className={`relative p-2 rounded-xl flex items-center justify-center transition-all ${
              notificationsOpen ? 'bg-zinc-100 dark:bg-zinc-800 text-brand-blue' : 'text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
            aria-label="Open Alerts Inbox"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full bg-brand-blue border border-white dark:border-zinc-950 text-[9px] font-black text-white flex items-center justify-center px-1 shadow animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Hub Navigation */}
          <Link
            href="/"
            className="hidden md:flex px-3.5 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all items-center space-x-1.5 shadow-sm"
          >
            <Home className="h-3.5 w-3.5 text-zinc-500" />
            <span>Hub</span>
          </Link>

          {/* Decorative Divider */}
          <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

          {/* User Profile popover widget */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2.5 p-1 px-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all select-none focus:outline-none"
            >
              <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xs font-black text-brand-blue shadow-sm">
                {mockUser.initial}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {mockUser.name}
                </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight font-semibold capitalize">
                  {role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2.5 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-sm font-black text-brand-blue">
                    {mockUser.initial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-zinc-950 dark:text-zinc-200 truncate">{mockUser.name}</p>
                    <p className="text-[9px] text-zinc-550 truncate">{mockUser.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link
                    href={isCoach ? '/platform/coach/settings' : '/platform/athlete/profile'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                    <span>My Account Profile</span>
                  </Link>

                  <Link
                    href={isCoach ? '/platform/coach/settings' : '/platform/athlete/privacy'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <Lock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Privacy & Security</span>
                  </Link>

                  <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-2"></div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-brand-blue hover:bg-brand-blue/5 hover:text-red-400 transition-all text-left cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5 text-brand-blue" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Slide-out notifications drawer overlay */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Drawer backdrop overlay area */}
          <div 
            className="flex-1" 
            onClick={() => setNotificationsOpen(false)}
          />

          {/* Actual Drawer Container */}
          <div className="w-full max-w-md bg-[#F8F7F3] dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-250">
            
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-brand-blue shadow-sm">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-100">
                      Alerts
                    </h3>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-semibold capitalize">
                      {role} notifications
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850 flex items-center justify-center transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                  aria-label="Close Alerts Drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action Menu Bar */}
              {alerts.length > 0 && (
                <div className="flex items-center justify-between py-2.5 px-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] mb-4 shadow-sm">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="font-bold text-brand-blue hover:text-brand-blue/80 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Scrollable Alert List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="h-16 w-16 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 text-zinc-300 shadow-sm">
                      <Check className="h-8 w-8 text-brand-blue" />
                    </div>
                    <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-200">All caught up</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs font-semibold leading-relaxed">
                      There are no sessional alerts or workload notifications pending for your team.
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border transition-all relative shadow-sm ${
                        alert.read
                          ? 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-850/60 opacity-60'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 shadow'
                      }`}
                    >
                      {/* Alert Header Icon + Title */}
                      <div className="flex items-start justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(alert.type)}
                          <span className={`text-xs font-bold ${alert.read ? 'text-zinc-500' : 'text-zinc-950 dark:text-zinc-150'}`}>
                            {alert.title}
                          </span>
                        </div>
                        
                        {/* Dynamic Action Buttons on Each Card */}
                        <div className="flex items-center space-x-1.5 select-none">
                          {!alert.read && (
                            <button
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="p-1 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                              title="Mark as Read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleClearAlert(alert.id)}
                            className="p-1 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 hover:text-brand-blue hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                            title="Dismiss"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Notification message details */}
                      <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed mt-2 pl-6 font-semibold">
                        {alert.message}
                      </p>

                      {/* Notification footer */}
                      <div className="flex items-center justify-between mt-3 pl-6">
                        <span className="text-[8px] font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                          {alert.type}
                        </span>
                        <span className="text-[9px] text-zinc-400">
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

