'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Radio,
  ClipboardCheck,
  Users,
  BarChart3,
  GitCompare,
  Gauge,
  Brain,
  MessageSquare,
  Settings,
  Home,
  Link2,
  Zap,
  Calendar,
  History,
  Target,
  RefreshCw,
  Lock,
  UserCheck,
  LogOut,
  Activity,
  X
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PlatformSidebarProps {
  role: 'coach' | 'athlete';
  onLinkClick?: () => void;
  onClose?: () => void;
}

export default function PlatformSidebar({ role, onLinkClick, onClose }: PlatformSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Define Links based on Role
  const links = React.useMemo<SidebarLink[]>(() => {
    if (role === 'coach') {
      return [
        { href: '/platform/coach', label: 'Coach Dashboard', icon: LayoutDashboard },
        { href: '/platform/coach/new-session', label: 'New Session', icon: PlusCircle },
        { href: '/platform/coach/live-session', label: 'Live Squad Tracking', icon: Radio },
        { href: '/platform/coach/session-review', label: 'Post-Session Review', icon: ClipboardCheck },
        { href: '/platform/coach/squad', label: 'Squad Analytics', icon: Users },
        { href: '/platform/coach/analytics', label: 'Advanced Analytics', icon: BarChart3 },
        { href: '/platform/coach/benchmarking', label: 'Performance Benchmarking', icon: GitCompare },
        { href: '/platform/coach/workload', label: 'Squad Workload', icon: Gauge },
        { href: '/platform/coach/readiness', label: 'Availability & Session Preparation', icon: Brain },
        { href: '/platform/coach/messages', label: 'Messages', icon: MessageSquare },
        { href: '/platform/coach/settings', label: 'Settings', icon: Settings },
      ];
    }

    return [
      { href: '/platform/athlete', label: 'Athlete Dashboard', icon: Home },
      { href: '/platform/athlete/pair-device', label: 'Device Pairing', icon: Link2 },
      { href: '/platform/athlete/live-session', label: 'Live Activity Tracking', icon: Zap },
      { href: '/platform/athlete/session-review', label: 'Session Review', icon: Calendar },
      { href: '/platform/athlete/history', label: 'Session History', icon: History },
      { href: '/platform/athlete/goals', label: 'Goals', icon: Target },
      { href: '/platform/athlete/sync', label: 'Offline Sync', icon: RefreshCw },
      { href: '/platform/athlete/privacy', label: 'Privacy Controls', icon: Lock },
      { href: '/platform/athlete/profile', label: 'Profile Settings', icon: UserCheck },
    ];
  }, [role]);
  const isCoach = role === 'coach';

  React.useEffect(() => {
    links.forEach((link) => router.prefetch(link.href));
    router.prefetch('/login');
  }, [links, router]);

  // Mock User Data for Preview
  const mockUser = isCoach 
    ? { name: 'Coach Dan', detail: 'FC United Performance Staff', initial: 'CD' }
    : { name: 'Alex Long', detail: 'Midfielder #10', initial: 'AL' };

  return (
    <div className="platform-sidebar flex flex-col h-full bg-[#111827] border-r border-zinc-800 select-none text-zinc-100">
      {/* Brand Header */}
      <div className="platform-sidebar__header h-16 flex items-center px-5 border-b border-zinc-800 justify-between shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="platform-sidebar__mark bg-brand-blue text-white p-1.5 rounded-md shadow-sm">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="platform-sidebar__brand font-extrabold text-sm tracking-tight text-white truncate">
            SSP {isCoach ? 'Coach' : 'Athlete'}
          </span>
        </div>
        {onClose ? (
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 flex items-center justify-center transition-colors border border-transparent hover:border-zinc-800"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className={`platform-sidebar__role text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
            isCoach 
              ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' 
              : 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
          }`}>
            {isCoach ? 'Staff' : 'Player'}
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="platform-sidebar__nav flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={active}
              onClick={onLinkClick}
              className={`platform-sidebar__link flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors group ${
                active
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${
                active ? 'text-brand-blue' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Information */}
      <div className="platform-sidebar__footer p-4 border-t border-zinc-800 shrink-0 bg-black/10">
        <div className="flex items-center space-x-3 px-2 py-1.5 mb-2">
          <div className="platform-sidebar__avatar h-9 w-9 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-white select-none shrink-0">
            {mockUser.initial}
          </div>
          <div className="overflow-hidden">
            <p className="platform-sidebar__user text-xs font-bold text-zinc-200 truncate">{mockUser.name}</p>
            <p className="platform-sidebar__detail text-[9px] text-zinc-500 truncate">{mockUser.detail}</p>
          </div>
        </div>
        <Link 
          href="/login" 
          className="platform-sidebar__signout flex items-center space-x-3 px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors w-full"
        >
          <LogOut className="h-3.5 w-3.5 text-zinc-500" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}

