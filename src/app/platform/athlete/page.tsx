'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Zap, 
  Award, 
  Smartphone, 
  Gauge, 
  Compass, 
  ChevronRight, 
  CheckCircle,
  MessageSquare,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  DEMO_ATHLETE_ID,
  getActiveSessionForAthlete,
  getDemoAthlete,
  getLoadFlag,
  getTargetForAthlete,
  getTargetProgress,
  mockGoals,
  PlannedSessionConfig,
} from '@/data';

export default function AthleteDashboardPage() {
  const [devicePaired, setDevicePaired] = React.useState<boolean>(false);
  const [deviceDetails, setDeviceDetails] = React.useState<any>(null);
  const [hasUnsynced, setHasUnsynced] = React.useState<boolean>(false);
  const [activeConfig, setActiveConfig] = React.useState<PlannedSessionConfig | null>(null);
  const [lastSession, setLastSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Read state from localStorage to create a highly integrated demo state
    const paired = localStorage.getItem('ssp-device-connected') === 'true';
    setDevicePaired(paired);

    const detailsStr = localStorage.getItem('ssp-device-details');
    if (detailsStr) {
      try {
        setDeviceDetails(JSON.parse(detailsStr));
      } catch (e) {
        console.error(e);
      }
    }

    const unsyncedSession = localStorage.getItem('ssp-unsynced-session');
    setHasUnsynced(!!unsyncedSession);

    try {
      setActiveConfig(getActiveSessionForAthlete(DEMO_ATHLETE_ID));
      const last = localStorage.getItem('ssp-last-session');
      setLastSession(last ? JSON.parse(last) : null);
    } catch {
      setActiveConfig(null);
      setLastSession(null);
    }
  }, []);

  const demoAthlete = getDemoAthlete();
  const isAssigned = !!(activeConfig && activeConfig.selectedPlayerIds?.includes(DEMO_ATHLETE_ID));
  const activeTarget = getTargetForAthlete(isAssigned ? activeConfig : null, DEMO_ATHLETE_ID);
  const loadFlag = getLoadFlag(demoAthlete);
  const latestDistance = lastSession?.distanceMeters || demoAthlete.distance;
  const latestSprints = lastSession?.sprints || demoAthlete.sprintCount;
  const latestWorkload = Number(lastSession?.strain || demoAthlete.workload);
  const latestMaxSpeed = Number(lastSession?.maxSpeed || demoAthlete.maxSpeed);

  // Quick statistics for performance summary
  const summaryStats = [
    {
      label: 'Active Target',
      value: `${getTargetProgress(latestDistance, activeTarget.distanceMeters)}%`,
      subtitle: isAssigned ? activeConfig.title : 'No active coach plan',
      desc: `${latestDistance} / ${activeTarget.distanceMeters} m`,
      icon: CheckCircle,
      color: 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20'
    },
    {
      label: 'Cumulative Dist.',
      value: `${(latestDistance / 1000).toFixed(2)} km`,
      subtitle: 'Session Total',
      desc: `Target ${(activeTarget.distanceMeters / 1000).toFixed(1)} km`,
      icon: Compass,
      color: 'text-blue-700 bg-blue-50 border border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20'
    },
    {
      label: 'Speed Profile',
      value: `${latestMaxSpeed.toFixed(1)} m/s`,
      subtitle: 'Max Speed',
      desc: `Target ${activeTarget.maxSpeedMps} m/s`,
      icon: Zap,
      color: 'text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-emerald-500/20'
    },
    {
      label: 'Workload Index',
      value: String(latestWorkload),
      subtitle: loadFlag.label,
      desc: loadFlag.detail,
      icon: Gauge,
      color: 'text-purple-700 bg-purple-50 border border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-emerald-500/20'
    }
  ];

  // Goals list
  const activeGoals = [
    {
      title: 'Distance Target',
      current: latestDistance,
      target: activeTarget.distanceMeters,
      unit: 'm',
      pct: getTargetProgress(latestDistance, activeTarget.distanceMeters),
      color: 'bg-emerald-500'
    },
    {
      title: 'Sprint Efforts',
      current: latestSprints,
      target: activeTarget.sprintCount,
      unit: 'above threshold',
      pct: getTargetProgress(latestSprints, activeTarget.sprintCount),
      color: 'bg-amber-500'
    },
    {
      title: 'Workload Target',
      current: latestWorkload,
      target: activeTarget.workloadIndex,
      unit: 'index',
      pct: getTargetProgress(latestWorkload, activeTarget.workloadIndex),
      color: 'bg-brand-blue'
    },
    ...mockGoals
      .filter((goal) => goal.assignedTo === DEMO_ATHLETE_ID)
      .slice(0, 1)
      .map((goal) => ({
        title: goal.title,
        current: goal.currentValue,
        target: goal.targetValue,
        unit: goal.unit,
        pct: getTargetProgress(goal.currentValue, goal.targetValue),
        color: 'bg-zinc-500',
      }))
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow">
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-zinc-200 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Performance app ready</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Athlete Dashboard
          </h1>
          <p className="text-xs lg:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
            Track activity, review goals, and understand progress from the athlete view.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10 shrink-0">
          <Link
            href="/platform/athlete/live-session"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90 transition-all shadow flex items-center space-x-2"
          >
            <Zap className="h-4.5 w-4.5" />
            <span>Start Live Session</span>
          </Link>
          {hasUnsynced && (
            <Link
              href="/platform/athlete/sync"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-250 transition-all flex items-center space-x-2 dark:bg-zinc-950 dark:text-amber-400 dark:border-amber-500/30"
            >
              <Activity className="h-4.5 w-4.5 animate-pulse" />
              <span>Unsynced Data</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid for Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 space-y-4 shadow transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white block">
                  {stat.value}
                </span>
                <div className="flex justify-between items-center text-[10px] text-zinc-450 dark:text-zinc-500 font-bold">
                  <span>{stat.subtitle}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{stat.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dual Columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Goal metrics & Targets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Weekly Goals Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-brand-blue" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Active Weekly Targets
                </h3>
              </div>
              <Link 
                href="/platform/athlete/goals"
                className="text-[10px] font-bold text-brand-blue hover:text-brand-blue/80 flex items-center space-x-0.5"
              >
                <span>View Details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-5">
              {activeGoals.map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-600 dark:text-zinc-350">{goal.title}</span>
                    <span className="text-zinc-900 dark:text-white">
                      {goal.current} <span className="text-zinc-400 dark:text-zinc-550 font-normal">/ {goal.target} {goal.unit.split(' ')[0]}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-850">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                      style={{ width: `${goal.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>PROGRESS: {goal.pct}%</span>
                    <span>{goal.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach feedback Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow relative overflow-hidden">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-brand-blue" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Coach Session Feedback
                </h3>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-500">
                Active 18h ago
              </span>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-850 p-4 rounded-xl space-y-3">
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold italic">
                "{isAssigned ? (activeConfig?.coachNotes || 'No custom notes provided for this session.') : 'Coach targets are loaded for the active session. Review load flags as coaching prompts, not medical guidance.'}"
              </p>
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-900 pt-2 text-[10px] font-bold text-zinc-550 dark:text-zinc-450">
                <span>By Dan (Head Coach)</span>
                <span className="text-emerald-600 dark:text-emerald-450 flex items-center space-x-1">
                  <Flame className="h-3.5 w-3.5" />
                  <span>Target: {isAssigned && activeConfig?.sessionType === 'match' ? 'Match' : 'Training'} Session</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Device Connection */}
        <div className="space-y-6">
          
          {/* pairing card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-5 shadow flex flex-col justify-between h-full min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-450">
                  Tracker Status
                </span>
                <div className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${
                  devicePaired 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                    : 'bg-rose-550/10 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-450 dark:border-rose-500/20'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${devicePaired ? 'bg-emerald-500 animate-pulse' : 'bg-rose-550'}`}></span>
                  <span>{devicePaired ? 'CONNECTED' : 'DISCONNECTED'}</span>
                </div>
              </div>

              <div className="text-center py-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850 flex flex-col items-center justify-center p-4 min-h-[140px] relative overflow-hidden">
                {devicePaired ? (
                  <>
                    <Smartphone className="h-10 w-10 text-emerald-500 dark:text-emerald-450 mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
                      {deviceDetails?.name || 'SSP TRACKER V2'}
                    </p>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Tracker status: Connected
                    </p>
                    <p className="text-[9px] text-zinc-500">
                      Sync Status: Ready
                    </p>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mb-2" />
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-tight">
                      No Active Tracker
                    </p>
                    <p className="text-[9px] text-zinc-500 mt-1 max-w-[200px]">
                      Connect an SSP tracker to record session movement.
                    </p>
                  </>
                )}
              </div>
            </div>

            <Link
              href="/platform/athlete/pair-device"
              className="w-full py-2.5 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-800 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>{devicePaired ? 'Manage Tracker' : 'Pair SSP Tracker'}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



