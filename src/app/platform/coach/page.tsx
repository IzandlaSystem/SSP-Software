'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  CompletedSessionSummary,
  formatActualTimeRange,
  formatClockTime,
  formatPlannedTimeRange,
  formatSessionDate,
  getActiveSessions,
  getCompletedSessions,
  getTargetProgress,
  mockPlayers,
  Player,
  setActiveSessionConfig,
  setSelectedCompletedSessionId,
  classifyActualVsExpected,
  getRecordedDurationMinutes,
} from '@/data';

// Custom data for Squad Workload Trend (Daily workload index vs Subjective Intensity)
const workloadTrend = [
  { day: 'Mon (05/18)', load: 420, intensity: 4.5 },
  { day: 'Tue (05/19)', load: 680, intensity: 7.2 },
  { day: 'Wed (05/20)', load: 880, intensity: 8.5 },
  { day: 'Thu (05/21)', load: 310, intensity: 3.8 },
  { day: 'Fri (05/22)', load: 450, intensity: 5.0 },
  { day: 'Sat (05/23)', load: 950, intensity: 9.0 },
  { day: 'Sun (05/24)', load: 150, intensity: 2.0 },
  { day: 'Mon (05/25)', load: 820, intensity: 8.2 },
];

const trainingWorkloadTrend = [
  { day: 'Mon (05/18)', load: 420, intensity: 4.5 },
  { day: 'Wed (05/20)', load: 880, intensity: 8.5 },
  { day: 'Fri (05/22)', load: 450, intensity: 5.0 },
  { day: 'Mon (05/25)', load: 820, intensity: 8.2 },
];

const matchWorkloadTrend = [
  { day: 'Tue (05/19)', load: 680, intensity: 7.2 },
  { day: 'Thu (05/21)', load: 310, intensity: 3.8 },
  { day: 'Sat (05/23)', load: 950, intensity: 9.0 },
  { day: 'Sun (05/24)', load: 150, intensity: 2.0 },
];

export default function CoachOverviewPage() {
  const router = useRouter();
  
  // Roster-wide & Completed Session States
  const [completedSessions, setCompletedSessions] = React.useState<CompletedSessionSummary[]>([]);
  const [activeSessions, setActiveSessions] = React.useState<any[]>([]);
  const [sessionActive, setSessionActive] = React.useState<boolean>(false);
  
  // Dashboard Control Centre States
  const [sessionTypeFilter, setSessionTypeFilter] = React.useState<'all' | 'training' | 'match'>('all');
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>('');
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('all');
  const [positionFilter, setPositionFilter] = React.useState<string>('All');
  const [selectedMetric, setSelectedMetric] = React.useState<'distance' | 'sprints' | 'maxSpeed' | 'workload' | 'targetProgress'>('distance');
  const [fromTime, setFromTime] = React.useState<string>('');
  const [toTime, setToTime] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = getActiveSessions();
      const completed = getCompletedSessions();
      setActiveSessions(active);
      setCompletedSessions(completed);
      if (completed.length > 0) {
        setSelectedSessionId(completed[0].id || '');
      }
    }
  }, []);

  const availableSessions = React.useMemo(() => {
    return completedSessions.filter((session) => {
      const type = session.sessionType === 'match' || session.type === 'match' ? 'match' : 'training';
      return sessionTypeFilter === 'all' || type === sessionTypeFilter;
    });
  }, [completedSessions, sessionTypeFilter]);

  const selectedSession = React.useMemo(() => {
    return availableSessions.find((s) => s.id === selectedSessionId) || availableSessions[0] || completedSessions[0] || null;
  }, [availableSessions, completedSessions, selectedSessionId]);

  const durationBound = React.useMemo(() => {
    if (!selectedSession) return 90;
    return (
      getRecordedDurationMinutes(
        selectedSession.actualStartTime,
        selectedSession.actualEndTime,
        selectedSession.actualDurationMinutes || selectedSession.durationMinutes || selectedSession.plannedDurationMinutes || 0
      ) ||
      selectedSession.plannedDurationMinutes ||
      selectedSession.durationMinutes ||
      90
    );
  }, [selectedSession]);

  // Set default crop range on session load
  React.useEffect(() => {
    if (selectedSession) {
      const start = formatClockTime(selectedSession.actualStartTime || selectedSession.plannedStartTime);
      const end = formatClockTime(selectedSession.actualEndTime || selectedSession.plannedEndTime);
      setFromTime(start);
      setToTime(end);
    }
  }, [selectedSession?.id]);

  const sessionStartClock = React.useMemo(() => {
    if (!selectedSession) return '00:00';
    return formatClockTime(selectedSession.actualStartTime || selectedSession.plannedStartTime);
  }, [selectedSession]);

  const sessionEndClock = React.useMemo(() => {
    if (!selectedSession) return '00:00';
    return formatClockTime(selectedSession.actualEndTime || selectedSession.plannedEndTime);
  }, [selectedSession]);

  const getMinutesDiff = (t1: string, t2: string) => {
    if (!t1 || !t2) return 0;
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const fromOffset = React.useMemo(() => {
    return Math.max(0, getMinutesDiff(sessionStartClock, fromTime));
  }, [sessionStartClock, fromTime]);

  const toOffset = React.useMemo(() => {
    return Math.min(durationBound, getMinutesDiff(sessionStartClock, toTime));
  }, [sessionStartClock, toTime, durationBound]);

  const isCropValid = React.useMemo(() => {
    if (!fromTime || !toTime) return false;
    const diff = getMinutesDiff(fromTime, toTime);
    const startDiff = getMinutesDiff(sessionStartClock, fromTime);
    const endDiff = getMinutesDiff(toTime, sessionEndClock);
    return diff > 0 && startDiff >= 0 && endDiff >= 0;
  }, [fromTime, toTime, sessionStartClock, sessionEndClock]);

  const cropScale = React.useMemo(() => {
    if (!isCropValid) return 1;
    const totalMins = getMinutesDiff(sessionStartClock, sessionEndClock) || durationBound || 1;
    const cropMins = getMinutesDiff(fromTime, toTime);
    return Math.max(0, Math.min(1, cropMins / totalMins));
  }, [sessionStartClock, sessionEndClock, fromTime, toTime, durationBound, isCropValid]);

  // High-Speed effort config threshold
  const speedThreshold = selectedSession?.squadTarget?.sprintEffortThresholdMps || 5.5;

  // Shortcuts query builder helper
  const getQueryString = () => {
    return `sessionId=${selectedSession?.id || ''}&playerId=${selectedPlayerId}&metric=${selectedMetric}&from=${fromTime}&to=${toTime}`;
  };

  const handleViewSessionReview = (sessId: string) => {
    if (typeof window === 'undefined') return;
    setSelectedCompletedSessionId(sessId);
    router.push(`/platform/coach/session-review?sessionId=${sessId}`);
  };

  // Compute Roster and Workloads summaries
  const totalRoster = mockPlayers.length;
  const avgACWR = parseFloat(
    (mockPlayers.reduce((acc, curr) => acc + curr.acwr, 0) / totalRoster).toFixed(2)
  );
  const squadavailabilityAvg = 84; 

  const activeRosterFiltered = React.useMemo(() => {
    return mockPlayers.filter((player) => {
      const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
      return matchesPosition;
    });
  }, [positionFilter]);

  // Aggregate Metrics based on Selected Context (crop, session, player)
  const metricsContext = React.useMemo(() => {
    if (!selectedSession) {
      return {
        distance: { current: 0, target: 0, diff: 0, pct: 0, status: 'No completed session' },
        sprints: { current: 0, target: 0, diff: 0, pct: 0, status: 'No completed session' },
        maxSpeed: { current: 0, target: 0, diff: 0, pct: 0, status: 'No completed session' },
        workload: { current: 0, target: 0, diff: 0, pct: 0, status: 'No completed session' },
        targetProgress: { current: 0, target: 0, diff: 0, pct: 0, status: 'No completed session' }
      };
    }

    const athleteMetrics = selectedSession.athleteMetrics || [];
    const playersToMap = selectedPlayerId === 'all'
      ? athleteMetrics
      : athleteMetrics.filter((m) => m.athleteId === selectedPlayerId);

    const count = Math.max(playersToMap.length, 1);
    
    // Average raw metrics
    const avgRawDistance = playersToMap.reduce((acc, m) => acc + m.distanceMeters, 0) / count;
    const avgRawSprints = playersToMap.reduce((acc, m) => acc + m.sprintCount, 0) / count;
    const peakMaxSpeed = playersToMap.reduce((max, m) => Math.max(max, m.maxSpeedMps), 0);
    const avgRawWorkload = playersToMap.reduce((acc, m) => acc + m.workloadIndex, 0) / count;

    // Apply crop scale
    const currentDistance = Math.round(avgRawDistance * cropScale);
    const currentSprints = Math.round(avgRawSprints * cropScale);
    const currentMaxSpeed = Math.round(peakMaxSpeed * 10) / 10;
    const currentWorkload = Math.round(avgRawWorkload * cropScale);

    // Retrieve corresponding targets
    const targetBase = selectedPlayerId === 'all'
      ? selectedSession.squadTarget
      : selectedSession.individualTargets?.[selectedPlayerId] || selectedSession.squadTarget;

    const targetDistance = targetBase?.distanceMeters || 6500;
    const targetSprints = targetBase?.sprintCount || 12;
    const targetMaxSpeed = targetBase?.maxSpeedMps || 8.5;
    const targetWorkload = targetBase?.workloadIndex || 80;

    // Target Progress percentage
    const progressPct = getTargetProgress(currentDistance, targetDistance);

    return {
      distance: {
        current: currentDistance,
        target: targetDistance,
        diff: currentDistance - targetDistance,
        pct: getTargetProgress(currentDistance, targetDistance),
        status: currentDistance >= targetDistance ? 'Above target' : 'Below target'
      },
      sprints: {
        current: currentSprints,
        target: targetSprints,
        diff: currentSprints - targetSprints,
        pct: getTargetProgress(currentSprints, targetSprints),
        status: currentSprints >= targetSprints ? 'Target met' : 'Below target'
      },
      maxSpeed: {
        current: currentMaxSpeed,
        target: targetMaxSpeed,
        diff: Math.round((currentMaxSpeed - targetMaxSpeed) * 10) / 10,
        pct: getTargetProgress(currentMaxSpeed, targetMaxSpeed),
        status: currentMaxSpeed >= targetMaxSpeed ? 'Target met' : 'Below target'
      },
      workload: {
        current: currentWorkload,
        target: targetWorkload,
        diff: currentWorkload - targetWorkload,
        pct: getTargetProgress(currentWorkload, targetWorkload),
        status: currentWorkload >= targetWorkload ? 'Above planned load' : 'Below plan'
      },
      targetProgress: {
        current: progressPct,
        target: 100,
        diff: progressPct - 100,
        pct: progressPct,
        status: progressPct >= 100 ? 'Target met' : 'Building'
      }
    };
  }, [selectedSession, selectedPlayerId, cropScale]);

  // Graph Data Calculations
  const graphTargetProgress = React.useMemo(() => {
    if (!selectedSession) return [];
    return (selectedSession.athleteMetrics || []).map((m) => {
      const pTarget = selectedSession.individualTargets?.[m.athleteId] || selectedSession.squadTarget;
      let currentVal = 0;
      let targetVal = 1;
      if (selectedMetric === 'distance') {
        currentVal = m.distanceMeters * cropScale;
        targetVal = pTarget.distanceMeters;
      } else if (selectedMetric === 'sprints') {
        currentVal = m.sprintCount * cropScale;
        targetVal = pTarget.sprintCount;
      } else if (selectedMetric === 'maxSpeed') {
        currentVal = m.maxSpeedMps;
        targetVal = pTarget.maxSpeedMps;
      } else if (selectedMetric === 'workload') {
        currentVal = m.workloadIndex * cropScale;
        targetVal = pTarget.workloadIndex;
      } else {
        currentVal = m.distanceMeters * cropScale;
        targetVal = pTarget.distanceMeters;
      }
      return {
        name: m.athleteName.split(' ').slice(-1)[0],
        progress: getTargetProgress(currentVal, targetVal || 1)
      };
    });
  }, [selectedSession, selectedMetric, cropScale]);

  const graphActualVsTarget = React.useMemo(() => {
    if (!selectedSession) return [];
    const roster = selectedSession.athleteMetrics || [];
    return roster.map((m) => {
      const pTarget = selectedSession.individualTargets?.[m.athleteId] || selectedSession.squadTarget;
      let actual = 0;
      let target = 0;
      if (selectedMetric === 'distance') {
        actual = m.distanceMeters * cropScale;
        target = pTarget.distanceMeters;
      } else if (selectedMetric === 'sprints') {
        actual = m.sprintCount * cropScale;
        target = pTarget.sprintCount;
      } else if (selectedMetric === 'maxSpeed') {
        actual = m.maxSpeedMps;
        target = pTarget.maxSpeedMps;
      } else if (selectedMetric === 'workload') {
        actual = m.workloadIndex * cropScale;
        target = pTarget.workloadIndex;
      } else {
        actual = m.distanceMeters * cropScale;
        target = pTarget.distanceMeters;
      }
      return {
        name: m.athleteName.split(' ').slice(-1)[0],
        Actual: Math.round(actual),
        Target: Math.round(target)
      };
    });
  }, [selectedSession, selectedMetric, cropScale]);

  const graphExposureComparison = React.useMemo(() => {
    const trainings = completedSessions.filter(s => (s.sessionType || s.type) === 'training').slice(0, 3);
    const matches = completedSessions.filter(s => (s.sessionType || s.type) === 'match').slice(0, 3);
    if (trainings.length === 0 || matches.length === 0) return [];
    
    const data = [];
    const count = Math.max(trainings.length, matches.length);
    for (let i = 0; i < count; i++) {
      const t = trainings[i];
      const m = matches[i];
      data.push({
        day: `Set ${i + 1}`,
        load: t ? Math.round((t.athleteMetrics || []).reduce((acc, curr) => acc + curr.workloadIndex, 0) / Math.max(t.athleteMetrics?.length || 1, 1)) : 0,
        intensity: m ? Math.round((m.athleteMetrics || []).reduce((acc, curr) => acc + curr.workloadIndex, 0) / Math.max(m.athleteMetrics?.length || 1, 1)) : 0,
      });
    }
    return data.reverse();
  }, [completedSessions]);

  const graphHighSpeedEfforts = React.useMemo(() => {
    if (!selectedSession) return [];
    return (selectedSession.athleteMetrics || []).map((m) => ({
      name: m.athleteName.split(' ').slice(-1)[0],
      'High-Speed Efforts': Math.round(m.sprintCount * cropScale)
    }));
  }, [selectedSession, cropScale]);

  const graphWorkloadVsPlanned = React.useMemo(() => {
    if (!selectedSession) return [];
    return (selectedSession.athleteMetrics || []).map((m) => {
      const pTarget = selectedSession.individualTargets?.[m.athleteId] || selectedSession.squadTarget;
      return {
        name: m.athleteName.split(' ').slice(-1)[0],
        Actual: Math.round(m.workloadIndex * cropScale),
        Planned: pTarget.workloadIndex || 80
      };
    });
  }, [selectedSession, cropScale]);

  // Reason-based alert list for Workload Prompts
  const alertReasons = React.useMemo(() => {
    if (!selectedSession) return [];
    return (selectedSession.athleteMetrics || []).map((m) => {
      const pTarget = selectedSession.individualTargets?.[m.athleteId] || selectedSession.squadTarget;
      const acwr = m.acwr;
      const workload = Math.round(m.workloadIndex * cropScale);
      const plannedWorkload = pTarget?.workloadIndex || 80;
      
      let reason = '';
      let isAlert = false;
      if (acwr >= 1.3) {
        reason = `ACWR review: ${acwr.toFixed(2)} above demo review range`;
        isAlert = true;
      } else if (workload >= plannedWorkload + 15) {
        reason = `Workload above planned load: +${workload - plannedWorkload}`;
        isAlert = true;
      } else if (m.distanceMeters * cropScale < (pTarget?.distanceMeters || 6500) * 0.7) {
        const diffM = Math.round((m.distanceMeters * cropScale) - (pTarget?.distanceMeters || 6500));
        reason = `Distance below target: ${diffM}m`;
        isAlert = true;
      } else if (m.sprintCount * cropScale < (pTarget?.sprintCount || 12) - 3) {
        const diffS = Math.round((m.sprintCount * cropScale) - (pTarget?.sprintCount || 12));
        reason = `High-speed efforts below target: ${diffS}`;
        isAlert = true;
      } else {
        reason = `On target`;
      }

      const player = mockPlayers.find((p) => p.id === m.athleteId) || mockPlayers[0];

      return {
        id: m.athleteId,
        name: m.athleteName,
        position: player.position,
        squadNumber: player.squadNumber,
        acwr,
        workload,
        reason,
        isAlert
      };
    }).filter((r) => r.isAlert || r.acwr >= 1.3);
  }, [selectedSession, cropScale]);

  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'distance': return 'Distance';
      case 'sprints': return 'High-speed efforts';
      case 'maxSpeed': return 'Max Speed';
      case 'workload': return 'Workload Index';
      case 'targetProgress': return 'Target progress';
      default: return '';
    }
  };

  const latestTraining = completedSessions.find((session) => (session.sessionType || session.type) === 'training');
  const latestMatch = completedSessions.find((session) => (session.sessionType || session.type) === 'match');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs mb-1">
            <Icons.Layers className="h-4 w-4 text-brand-blue" />
            <span>SSP Coach Control Centre</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Performance Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time sessional workloads, player metrics, and acute:chronic training ratios.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 px-3 py-1.5">
              Live Feed
            </span>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all ${
              sessionActive 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                : 'bg-zinc-200 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
            }`}>
              <span className={`h-2 w-2 rounded-full inline-block ${sessionActive ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-zinc-400 dark:bg-zinc-600'}`}></span>
              <span className=" text-[10px] font-bold">{sessionActive ? 'ACTIVE' : 'IDLE / READY'}</span>
            </div>
          </div>

          <button
            onClick={() => setSessionActive(!sessionActive)}
            className="px-4 py-2 text-xs bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            {sessionActive ? 'STANDBY Tracking' : 'Wake Tracking Device'}
          </button>
        </div>
      </div>

      {/* Active Sessions Panel */}
      {activeSessions.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Icons.Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
              <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">
                Active Concurrent Sessions ({activeSessions.length})
              </h3>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Now
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between space-y-3 shadow-inner">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      session.sessionType === 'match' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                    }`}>
                      {session.sessionType === 'match' ? 'Match' : 'Training'}
                    </span>
                    <span className="text-[9px] text-zinc-550 dark:text-zinc-400 font-bold">{session.distanceClassification || 'Standard Volume'}</span>
                  </div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-2">{session.title}</h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1">{session.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] font-bold text-zinc-500">
                    <span>Date: {formatSessionDate(session.sessionDate)}</span>
                    <span>Planned: {formatPlannedTimeRange(session)}</span>
                    <span className="col-span-2">Started: {formatClockTime(session.actualStartTime) || 'Not started'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-150 dark:border-zinc-850">
                  <span className="text-[9px] text-zinc-500 font-bold">{session.selectedPlayerIds?.length || 0} Athletes Tracked</span>
                  <Link
                    href="/platform/coach/live-session"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        setActiveSessionConfig(session);
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg text-[9px] font-black transition-all shadow-sm flex items-center space-x-1"
                  >
                    <Icons.Radio className="h-3 w-3 animate-pulse" />
                    <span>Open Tracking</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Sessions Toolbar / Dashboard Control Centre */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-zinc-250 dark:border-zinc-800 pb-3">
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
            <Icons.Settings className="h-4.5 w-4.5 text-brand-blue" />
            Dashboard Analytics Control Centre
          </h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Synchronise selections, apply clock-time crops, and export configurations to all coach analytics dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Session Type</span>
            <select
              value={sessionTypeFilter}
              onChange={(e) => setSessionTypeFilter(e.target.value as any)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Sessions</option>
              <option value="training">Training Only</option>
              <option value="match">Matches Only</option>
            </select>
          </label>

          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-[10px] font-bold text-zinc-500">Completed Session Selector</span>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              {availableSessions.map((session) => {
                const sType = session.sessionType === 'match' || session.type === 'match' ? 'Match' : 'Training';
                const sDate = formatSessionDate(session.sessionDate || session.date);
                const actual = formatActualTimeRange(session);
                const planned = formatPlannedTimeRange(session);
                return (
                  <option key={session.id} value={session.id}>
                    {session.title} — {sType} — {sDate} — {actual ? `Actual ${actual}` : `Planned ${planned}`}
                  </option>
                );
              })}
              {availableSessions.length === 0 && (
                <option value="">No completed sessions available</option>
              )}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Player Filter</span>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Players</option>
              {mockPlayers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Position Group</span>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="All">All Positions</option>
              <option value="Forward">Forwards</option>
              <option value="Midfielder">Midfielders</option>
              <option value="Defender">Defenders</option>
              <option value="Goalkeeper">Goalkeepers</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Metric Indicator</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="distance">Distance</option>
              <option value="sprints">High-speed efforts</option>
              <option value="maxSpeed">Max Velocity</option>
              <option value="workload">Workload Index</option>
              <option value="targetProgress">Target progress</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Exact From Time ({sessionStartClock})</span>
            <input
              type="time"
              value={fromTime}
              min={sessionStartClock}
              max={toTime || sessionEndClock}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-850 dark:text-zinc-200 focus:outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Exact To Time ({sessionEndClock})</span>
            <input
              type="time"
              value={toTime}
              min={fromTime || sessionStartClock}
              max={sessionEndClock}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-850 dark:text-zinc-200 focus:outline-none"
            />
          </label>
        </div>

        {/* Informative crop bounds and shortcuts bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-255 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-4 text-xs font-semibold text-zinc-650 dark:text-zinc-350 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div>
              Focus window: <strong className="text-zinc-950 dark:text-white">{fromTime || '--:--'} – {toTime || '--:--'}</strong> 
              {isCropValid ? ` | ${fromOffset} – ${toOffset} min` : ' | Invalid clock range selected'}
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Focus values are demo-scaled from session summaries until timestamped tracking samples are available.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href={`/platform/coach/squad?${getQueryString()}`}
              className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-[10px] font-extrabold shadow transition-all"
            >
              Open Squad Analytics
            </Link>
            <Link
              href={`/platform/coach/analytics?${getQueryString()}`}
              className="px-3.5 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-855 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-[10px] font-extrabold shadow transition-all border border-zinc-300 dark:border-zinc-700"
            >
              Open Advanced Analytics
            </Link>
            <Link
              href={`/platform/coach/session-review?sessionId=${selectedSession?.id || ''}`}
              className="px-3.5 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-855 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-[10px] font-extrabold shadow transition-all border border-zinc-300 dark:border-zinc-700"
            >
              Open Session Review
            </Link>
          </div>
        </div>
      </div>

      {/* Roster / Session Selected Metrics Cards */}
      {selectedSession ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Distance */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Distance</span>
            <span className="text-lg font-black text-zinc-950 dark:text-white mt-1 block">
              {metricsContext.distance.current.toLocaleString()}m / {metricsContext.distance.target.toLocaleString()}m
            </span>
            <div className="mt-2 text-[10px] font-bold flex justify-between">
              <span className={metricsContext.distance.diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                {metricsContext.distance.diff >= 0 ? `+${metricsContext.distance.diff}` : metricsContext.distance.diff}m
              </span>
              <span className="text-zinc-500">
                {metricsContext.distance.pct}% | {metricsContext.distance.status}
              </span>
            </div>
          </div>

          {/* 2. High Speed Efforts */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">High-speed efforts</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">
              {metricsContext.sprints.current} / {metricsContext.sprints.target} runs
            </span>
            <div className="mt-2 text-[10px] font-bold">
              <div className="flex justify-between">
                <span className={metricsContext.sprints.diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                  {metricsContext.sprints.diff >= 0 ? `+${metricsContext.sprints.diff}` : metricsContext.sprints.diff} efforts
                </span>
                <span className="text-zinc-500">
                  {metricsContext.sprints.pct}%
                </span>
              </div>
              <span className="text-[8px] text-zinc-550 block mt-1 leading-none">
                above SSP-configured {speedThreshold} m/s
              </span>
            </div>
          </div>

          {/* 3. Max Velocity */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Max Velocity</span>
            <span className="text-xl font-black text-zinc-955 dark:text-white mt-1 block">
              {metricsContext.maxSpeed.current} / {metricsContext.maxSpeed.target} m/s
            </span>
            <div className="mt-2 text-[10px] font-bold flex justify-between">
              <span className={metricsContext.maxSpeed.diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                {metricsContext.maxSpeed.diff >= 0 ? `+${metricsContext.maxSpeed.diff}` : metricsContext.maxSpeed.diff} m/s
              </span>
              <span className="text-zinc-500 font-bold">
                {metricsContext.maxSpeed.pct}% | {metricsContext.maxSpeed.status}
              </span>
            </div>
          </div>

          {/* 4. Workload */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Workload Index</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">
              {metricsContext.workload.current} / {metricsContext.workload.target}
            </span>
            <div className="mt-2 text-[10px] font-bold flex justify-between">
              <span className={metricsContext.workload.diff >= 0 ? 'text-amber-600' : 'text-emerald-600'}>
                {metricsContext.workload.diff >= 0 ? `+${metricsContext.workload.diff}` : metricsContext.workload.diff} Index
              </span>
              <span className="text-zinc-500 font-bold">
                {metricsContext.workload.status}
              </span>
            </div>
          </div>

          {/* 5. Target Progress */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Target progress</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">
              {metricsContext.targetProgress.pct}%
            </span>
            <div className="mt-2 text-[10px] font-bold flex justify-between">
              <span className="text-zinc-550 block font-bold">Distance target</span>
              <span className="text-brand-blue">
                {metricsContext.targetProgress.status}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-100 p-8 rounded-2xl text-center text-xs font-semibold text-zinc-500">
          No completed sessions available. Use Live Squad to save records.
        </div>
      )}

      {/* Roster & Completed Session Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Users className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Total Active Roster</p>
          <p className="text-3xl font-black text-zinc-950 dark:text-white mt-2">{totalRoster}</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/5 px-2 py-0.5 rounded w-fit border border-emerald-200 dark:border-emerald-500/10">
            <Icons.CheckCircle className="h-3 w-3" />
            <span>All Devices Paired</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Activity className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Avg Squad ACWR</p>
          <p className="text-3xl font-black text-zinc-955 dark:text-white mt-2">{avgACWR}</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/5 px-2 py-0.5 rounded w-fit border border-amber-200 dark:border-amber-500/10">
            <Icons.AlertTriangle className="h-3 w-3" />
            <span>Configurable coach review range (0.8 - 1.3)</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.TrendingUp className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Squad Availability Avg</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{squadavailabilityAvg}%</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/5 px-2 py-0.5 rounded w-fit border border-emerald-200 dark:border-emerald-500/10">
            <Icons.TrendingUp className="h-3 w-3" />
            <span>+2.4% vs Last Cycle</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Radio className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Session Status</p>
          <p className="text-3xl font-black text-zinc-950 dark:text-white mt-2">{sessionActive ? 'Active' : 'STANDBY'}</p>
          <div className={`flex items-center space-x-1.5 mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-fit border ${
            sessionActive 
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/10' 
              : 'text-zinc-500 bg-zinc-100 border-zinc-200 dark:text-zinc-500 dark:bg-zinc-800/50 dark:border-zinc-700/50'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${sessionActive ? 'bg-emerald-500 dark:bg-emerald-400 animate-ping' : 'bg-zinc-400 dark:bg-zinc-600'}`}></span>
            <span>{sessionActive ? 'Live Stream Active' : 'System Ready'}</span>
          </div>
        </div>
      </div>

      {/* Recent Completed Sessions */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icons.ClipboardCheck className="h-5 w-5 text-brand-blue" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">Recent Completed Sessions</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-bold">{completedSessions.length} saved locally</span>
        </div>
        {completedSessions.length === 0 ? (
          <p className="text-xs font-semibold text-zinc-500">No completed sessions yet. Stop and save a Live Squad session to populate this history.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                    session.sessionType === 'match' || session.type === 'match'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                  }`}>
                    {session.sessionType === 'match' || session.type === 'match' ? 'Match' : 'Training'}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500">{formatSessionDate(session.sessionDate || session.date)}</span>
                </div>
                <h4 className="text-xs font-black text-zinc-900 dark:text-white">{session.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-zinc-500">
                  <span>Planned: {formatPlannedTimeRange(session)}</span>
                  <span>Actual: {formatActualTimeRange(session) || 'Not recorded'}</span>
                  <span>Duration: {session.actualDurationMinutes || session.durationMinutes} min</span>
                  <span>Players: {session.athleteMetrics?.length || 0}</span>
                </div>
                <button
                  onClick={() => handleViewSessionReview(session.id || '')}
                  className="w-full rounded-lg bg-brand-blue px-3 py-2 text-[10px] font-black text-white shadow-sm"
                >
                  Open Session Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Session Summary Graphs - Question-Based Coaching Answers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graph 1: Who is meeting the selected target? */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm min-w-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white">Who is meeting the selected target?</h3>
            <p className="text-[10px] text-zinc-500">Target progress percentage by player for {getMetricLabel(selectedMetric)}.</p>
          </div>
          <div className="h-44 min-w-0">
            {graphTargetProgress.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">No completed session context loaded</div>
            ) : (
              <ClientOnly>
                <ResponsiveContainer width="100%" height={176} minWidth={0}>
                  <BarChart data={graphTargetProgress} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={9} tickLine={false} />
                    <YAxis stroke="var(--zinc-550)" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="progress" name="Target progress %" fill="var(--brand-blue)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            )}
          </div>
        </div>

        {/* Graph 2: Actual vs Target in selected window */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm min-w-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white">Actual vs Target in the selected time window</h3>
            <p className="text-[10px] text-zinc-500">Compares actual vs target for {getMetricLabel(selectedMetric)}.</p>
          </div>
          <div className="h-44 min-w-0">
            {graphActualVsTarget.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">No completed session context loaded</div>
            ) : (
              <ClientOnly>
                <ResponsiveContainer width="100%" height={176} minWidth={0}>
                  <BarChart data={graphActualVsTarget} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={9} tickLine={false} />
                    <YAxis stroke="var(--zinc-550)" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '8px' }} />
                    <Bar dataKey="Actual" fill="var(--brand-blue)" radius={[4, 4, 0, 0]} maxBarSize={12} />
                    <Bar dataKey="Target" fill="#a1a1aa" radius={[4, 4, 0, 0]} maxBarSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            )}
          </div>
        </div>

        {/* Graph 3: High-speed efforts above SSP-configured threshold */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm min-w-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white">High-speed efforts above SSP-configured threshold</h3>
            <p className="text-[10px] text-zinc-500">Counts movements above configured speed threshold ({speedThreshold} m/s).</p>
          </div>
          <div className="h-44 min-w-0">
            {graphHighSpeedEfforts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">No completed session context loaded</div>
            ) : (
              <ClientOnly>
                <ResponsiveContainer width="100%" height={176} minWidth={0}>
                  <BarChart data={graphHighSpeedEfforts} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={9} tickLine={false} />
                    <YAxis stroke="var(--zinc-550)" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="High-Speed Efforts" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Workload Trend Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        
        {/* Workload Trend Chart Card */}
        <div className="lg:col-span-2 min-w-0 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icons.LineChart className="h-5 w-5 text-brand-blue" />
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  Workload vs planned load
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-black text-zinc-900 dark:text-white">Training exposure vs match demand</h4>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-400">This helps the coach see whether training exposure is below, close to, or above recent match demand.</p>
            </div>
            
            <div className="h-56 min-h-56 w-full min-w-0 overflow-hidden">
              {graphExposureComparison.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">No completed session context loaded</div>
              ) : (
                <ClientOnly>
                  <ResponsiveContainer width="100%" height={224} minWidth={0}>
                    <AreaChart data={graphExposureComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--zinc-500)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="var(--zinc-500)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--zinc-550)" 
                        fontSize={10} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="var(--zinc-550)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--zinc-100)', 
                          borderColor: 'var(--zinc-200)',
                          borderRadius: '12px',
                          color: 'var(--zinc-950)'
                        }}
                        labelStyle={{ fontWeight: 'bold', color: 'var(--zinc-600)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'none', paddingTop: '10px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="Training Load" 
                        name="Average Training Workload"
                        stroke="var(--brand-blue)" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorLoad)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Match Demand" 
                        name="Average Match Workload"
                        stroke="var(--zinc-500)" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorIntensity)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ClientOnly>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center space-x-1">
              <Icons.Info className="h-3.5 w-3.5 text-zinc-400" />
              <span>Training vs Match workload demand comparisons.</span>
            </span>
            <div className="flex gap-4">
              <Link 
                href={`/platform/coach/analytics?${getQueryString()}`}
                className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
              >
                Deep Analytics &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ACWR Workload Review Prompts Panel */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Icons.AlertOctagon className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">
                  Which players need coach review and why?
                </h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200 dark:bg-amber-500/10 dark:text-amber-550 dark:border-amber-500/20">
                {alertReasons.length} Flags
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {alertReasons.map((player) => (
                <div 
                  key={player.id} 
                  className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 hover:border-amber-500/30 p-3.5 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{player.name}</span>
                      <span className="text-[10px] block text-zinc-500 font-medium">{player.position} • Squad #{player.squadNumber}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20">
                      ACWR: {player.acwr.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-bold">
                    <span className="text-amber-750 bg-amber-50 dark:bg-amber-500/5 px-2 py-1 rounded flex items-center space-x-1.5 border border-amber-250 dark:border-amber-500/10">
                      <Icons.ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{player.reason}</span>
                    </span>
                  </div>
                </div>
              ))}
              
              {alertReasons.length === 0 && (
                <div className="text-center py-8 text-zinc-500 text-xs space-y-2">
                  <Icons.CheckCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p>All players are within recommended workload indicators.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <Link 
              href="/platform/coach/workload"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-350 dark:border-zinc-850 font-bold"
            >
              <Icons.Shield className="h-4 w-4 text-brand-blue" />
              <span>Configure Review Thresholds</span>
            </Link>
            <p className="text-[9px] text-zinc-500 text-center leading-normal">
              These are coach-review prompts, not medical assessments.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Roster Performance Metrics Grid */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5 gap-4">
          <div className="flex items-center space-x-2">
            <Icons.Gauge className="h-5 w-5 text-brand-blue" />
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                Squad Metrics Dashboard
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Toggle filter keys to evaluate current roster performance.</p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {(['distance', 'sprints', 'maxSpeed', 'workload', 'targetProgress'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedMetric === m 
                    ? 'bg-brand-blue text-white shadow' 
                    : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {m === 'distance' && 'Distance'}
                {m === 'sprints' && 'High-speed efforts'}
                {m === 'maxSpeed' && 'Max Speed'}
                {m === 'workload' && 'Workload Index'}
                {m === 'targetProgress' && 'Target progress'}
              </button>
            ))}
          </div>
        </div>

        {/* Players Grid with dynamic metric view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeRosterFiltered.map((player) => {
            const hasAlert = player.acwr >= 1.3;
            
            // Sessional metric calculations for bottom grid roster cards
            const mVal = selectedSession?.athleteMetrics?.find((item) => item.athleteId === player.id);
            const pTarget = selectedSession?.individualTargets?.[player.id] || selectedSession?.squadTarget;
            
            let current = 0;
            let target = 0;
            let label = '';
            
            if (selectedMetric === 'distance') {
              current = Math.round((mVal?.distanceMeters ?? player.distance) * cropScale);
              target = pTarget?.distanceMeters || 6500;
              label = 'm';
            } else if (selectedMetric === 'sprints') {
              current = Math.round((mVal?.sprintCount ?? player.sprintCount) * cropScale);
              target = pTarget?.sprintCount || 12;
              label = 'runs';
            } else if (selectedMetric === 'maxSpeed') {
              current = Math.round((mVal?.maxSpeedMps ?? player.maxSpeed) * 10) / 10;
              target = pTarget?.maxSpeedMps || 8.5;
              label = 'm/s';
            } else if (selectedMetric === 'workload') {
              current = Math.round((mVal?.workloadIndex ?? player.workload) * cropScale);
              target = pTarget?.workloadIndex || 80;
              label = 'index';
            } else {
              current = getTargetProgress(Math.round((mVal?.distanceMeters ?? player.distance) * cropScale), pTarget?.distanceMeters || 6500);
              target = 100;
              label = '%';
            }

            const diff = current - target;
            const pct = getTargetProgress(current, target);
            const status = classifyActualVsExpected(current, target);

            return (
              <div 
                key={player.id} 
                className={`bg-zinc-100 dark:bg-zinc-950 rounded-xl p-4 border transition-all ${
                  hasAlert 
                    ? 'border-rose-500/20 hover:border-rose-500/40 shadow-sm shadow-rose-500/5' 
                    : 'border-zinc-200 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center font-bold text-xs text-brand-blue">
                      {player.squadNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{player.name}</h4>
                      <span className="text-[10px] block text-zinc-500 font-bold">{player.position}</span>
                    </div>
                  </div>

                  <span className={`h-2.5 w-2.5 rounded-full ${
                    player.availabilityStatus === 'Optimal' 
                      ? 'bg-emerald-500' 
                      : player.availabilityStatus === 'Adaptive' 
                      ? 'bg-amber-500' 
                      : 'bg-rose-500 animate-pulse'
                  }`} title={`Availability: ${player.availabilityStatus}`} />
                </div>

                <div className="py-2.5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] space-y-1.5 font-semibold text-zinc-650 dark:text-zinc-450">
                  <div className="flex justify-between">
                    <span>Current vs Target:</span>
                    <span className="text-zinc-950 dark:text-white font-bold">{current}{label} / {target}{label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difference:</span>
                    <span className={`font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {diff >= 0 ? `+${diff}` : diff}{label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span>{pct}% | {status}</span>
                  </div>
                </div>

                <div className="mt-3.5 flex gap-2">
                  <Link 
                    href={`/platform/coach/squad?sessionId=${selectedSession?.id || ''}&playerId=${player.id}&metric=${selectedMetric}&from=${fromTime}&to=${toTime}`}
                    className="w-full py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-350 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-[10px] font-bold text-zinc-650 dark:text-zinc-455 hover:text-zinc-950 dark:hover:text-white transition-all text-center border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-750"
                  >
                    View Player Analytics
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct CTA Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/platform/coach/new-session"
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-brand-blue/40 p-6 rounded-2xl shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-brand-blue transition-colors">
              New Session
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create sessional plans, player constraints, and active metrics.
            </p>
          </div>
          <div className="bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white p-3 rounded-xl transition-all shadow-md">
            <Icons.PlusCircle className="h-6 w-6" />
          </div>
        </Link>

        <Link 
          href="/platform/coach/live-session"
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/40 p-6 rounded-2xl shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Live Squad Tracking
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              View live sessional active metrics, positioning layouts, and sprint logs.
            </p>
          </div>
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-black p-3 rounded-xl transition-all shadow-md">
            <Icons.Radio className="h-6 w-6" />
          </div>
        </Link>
      </div>

    </div>
  );
}
