'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CompletedSessionSummary,
  findPerformancePreset,
  formatActualTimeRange,
  formatPlannedTimeRange,
  formatSessionDate,
  getActualVsExpectedPercent,
  getCompletedSessions,
  getRecordedDurationMinutes,
  getTargetProgress,
  mockPlayers,
  Player,
  formatClockTime,
} from '@/data';

type SessionTypeFilter = 'all' | 'training' | 'match';
type MetricFilter = 'distance' | 'sprints' | 'maxSpeed' | 'workload' | 'targetProgress';

const metricLabels: Record<MetricFilter, string> = {
  distance: 'Distance',
  sprints: 'High-speed efforts',
  maxSpeed: 'Max Velocity',
  workload: 'Workload Index',
  targetProgress: 'Target Progress',
};

const getSessionType = (session?: Partial<CompletedSessionSummary>) =>
  session?.sessionType === 'match' || session?.type === 'match' ? 'match' : 'training';

const getSessionLabel = (session: CompletedSessionSummary) => {
  const type = getSessionType(session) === 'match' ? 'Match' : 'Training';
  const actual = formatActualTimeRange(session);
  return `${session.title} - ${type} - ${formatSessionDate(session.sessionDate || session.date)} - ${
    actual ? `Actual ${actual}` : `Planned ${formatPlannedTimeRange(session)}`
  }`;
};

const getMetric = (player: Player, session?: CompletedSessionSummary) => {
  const metric = session?.athleteMetrics?.find((item) => item.athleteId === player.id);
  return {
    athleteId: player.id,
    athleteName: player.name,
    distanceMeters: metric?.distanceMeters ?? player.distance,
    maxSpeedMps: metric?.maxSpeedMps ?? player.maxSpeed,
    sprintCount: metric?.sprintCount ?? player.sprintCount,
    workloadIndex: metric?.workloadIndex ?? player.workload,
    acwr: metric?.acwr ?? player.acwr,
  };
};

export default function SquadRosterPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [positionFilter, setPositionFilter] = React.useState<string>('All');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [sessionTypeFilter, setSessionTypeFilter] = React.useState<SessionTypeFilter>('all');
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>('');
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('all');
  const [metricFilter, setMetricFilter] = React.useState<MetricFilter>('distance');
  const [completedSessions, setCompletedSessions] = React.useState<CompletedSessionSummary[]>([]);
  const [openPlayerId, setOpenPlayerId] = React.useState<string>('1');

  // Clock time crop states
  const [fromTime, setFromTime] = React.useState<string>('');
  const [toTime, setToTime] = React.useState<string>('');

  React.useEffect(() => {
    const sessions = getCompletedSessions();
    setCompletedSessions(sessions);
    if (sessions.length > 0) {
      setSelectedSessionId(sessions[0].id || '');
    }
  }, []);

  const availableSessions = React.useMemo(
    () =>
      completedSessions.filter((session) => {
        const type = getSessionType(session);
        return sessionTypeFilter === 'all' || type === sessionTypeFilter;
      }),
    [completedSessions, sessionTypeFilter]
  );

  const selectedSession = React.useMemo(
    () => availableSessions.find((session) => session.id === selectedSessionId) || availableSessions[0] || completedSessions[0] || null,
    [availableSessions, completedSessions, selectedSessionId]
  );

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

  const isCropValid = React.useMemo(() => {
    if (!fromTime || !toTime) return false;
    const diff = getMinutesDiff(fromTime, toTime);
    const startDiff = getMinutesDiff(sessionStartClock, fromTime);
    const endDiff = getMinutesDiff(toTime, sessionEndClock);
    return diff > 0 && startDiff >= 0 && endDiff >= 0;
  }, [fromTime, toTime, sessionStartClock, sessionEndClock]);

  const cropRange = React.useMemo(() => {
    if (!isCropValid) return [0, durationBound];
    const startOffset = Math.max(0, getMinutesDiff(sessionStartClock, fromTime));
    const endOffset = Math.min(durationBound, getMinutesDiff(sessionStartClock, toTime));
    return [startOffset, endOffset];
  }, [sessionStartClock, fromTime, toTime, durationBound, isCropValid]);

  const cropScale = React.useMemo(() => {
    if (!isCropValid) return 1;
    const totalMins = getMinutesDiff(sessionStartClock, sessionEndClock) || durationBound || 1;
    const cropMins = getMinutesDiff(fromTime, toTime);
    return Math.max(0, Math.min(1, cropMins / totalMins));
  }, [sessionStartClock, sessionEndClock, fromTime, toTime, durationBound, isCropValid]);

  // Read context query parameters
  React.useEffect(() => {
    if (typeof window !== 'undefined' && completedSessions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const sId = params.get('sessionId');
      const pId = params.get('playerId');
      const metric = params.get('metric');
      const fromParam = params.get('from');
      const toParam = params.get('to');

      if (sId && completedSessions.some(s => s.id === sId)) {
        setSelectedSessionId(sId);
      }
      if (pId) {
        setSelectedPlayerId(pId);
        if (pId !== 'all') {
          setOpenPlayerId(pId);
        }
      }
      if (metric) {
        if (metric === 'sprints' || metric === 'highSpeedEfforts') setMetricFilter('sprints');
        else if (metric === 'maxSpeed') setMetricFilter('maxSpeed');
        else if (metric === 'workload') setMetricFilter('workload');
        else if (metric === 'targetProgress') setMetricFilter('targetProgress');
        else setMetricFilter('distance');
      }

      const activeSess = completedSessions.find(s => s.id === (sId || selectedSessionId)) || completedSessions[0];
      if (activeSess) {
        const start = fromParam || formatClockTime(activeSess.actualStartTime || activeSess.plannedStartTime);
        const end = toParam || formatClockTime(activeSess.actualEndTime || activeSess.plannedEndTime);
        setFromTime(start);
        setToTime(end);
      }
    }
  }, [completedSessions]);

  // Set clock times when session changes (if no override in search parameters)
  React.useEffect(() => {
    if (selectedSession) {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get('from');
      const toParam = params.get('to');
      if (!fromParam || !toParam) {
        const start = formatClockTime(selectedSession.actualStartTime || selectedSession.plannedStartTime);
        const end = formatClockTime(selectedSession.actualEndTime || selectedSession.plannedEndTime);
        setFromTime(start);
        setToTime(end);
      }
    }
  }, [selectedSession?.id]);

  const visiblePlayers = React.useMemo(() => {
    const sessionPlayerIds = selectedSession?.athleteMetrics?.map((item) => item.athleteId);
    return mockPlayers.filter((player) => {
      const [firstName = '', surname = ''] = player.name.toLowerCase().split(' ');
      const query = searchQuery.toLowerCase();
      const matchesSearch = player.name.toLowerCase().includes(query) || firstName.includes(query) || surname.includes(query);
      const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
      const matchesStatus = statusFilter === 'All' || player.status === statusFilter;
      const matchesSession = !sessionPlayerIds?.length || sessionPlayerIds.includes(player.id);
      const matchesPlayer = selectedPlayerId === 'all' || player.id === selectedPlayerId;
      return matchesSearch && matchesPosition && matchesStatus && matchesSession && matchesPlayer;
    });
  }, [positionFilter, searchQuery, selectedPlayerId, selectedSession, statusFilter]);

  const speedThreshold = selectedSession?.squadTarget?.sprintEffortThresholdMps || 5.5;

  const getPlayerReviewReason = (row: any) => {
    const acwr = row.metric.acwr;
    const workload = row.scaledWorkload;
    const plannedWorkload = row.target.workloadIndex || 80;
    
    if (acwr >= 1.3) {
      return `ACWR review: ${acwr.toFixed(2)} above demo review range`;
    }
    if (workload >= plannedWorkload + 15) {
      return `Workload above planned load: +${workload - plannedWorkload}`;
    }
    if (row.scaledDistance < (row.target.distanceMeters || 6500) * 0.7) {
      const diff = Math.round(row.scaledDistance - (row.target.distanceMeters || 6500));
      return `Distance below target: ${diff}m`;
    }
    if (row.scaledSprints < (row.target.sprintCount || 12) - 3) {
      const diff = Math.round(row.scaledSprints - (row.target.sprintCount || 12));
      return `High-speed efforts below target: ${diff}`;
    }
    return 'On target';
  };

  const analyticsRows = React.useMemo(() => {
    return visiblePlayers.map((player) => {
      const metric = getMetric(player, selectedSession || undefined);
      const preset = findPerformancePreset({
        sport: selectedSession?.sport,
        ageGroup: selectedSession?.ageGroup,
        level: selectedSession?.level,
        position: player.position,
        sessionType: getSessionType(selectedSession || undefined),
      });
      const target = {
        ...(preset?.target || selectedSession?.squadTargets || selectedSession?.squadTarget),
        ...(selectedSession?.individualTargets?.[player.id] || {}),
      };
      const scaledDistance = Math.round(metric.distanceMeters * cropScale);
      const scaledSprints = Math.round(metric.sprintCount * cropScale);
      const scaledWorkload = Math.round(metric.workloadIndex * cropScale);
      const progress = getTargetProgress(scaledDistance, target.distanceMeters || 1);
      
      const rowBase = {
        player,
        metric,
        preset,
        target,
        scaledDistance,
        scaledSprints,
        scaledWorkload,
        progress
      };
      
      const classification = getPlayerReviewReason(rowBase);
      
      return {
        ...rowBase,
        classification,
        actualVsExpected: getActualVsExpectedPercent(scaledDistance, target.distanceMeters || 1),
      };
    });
  }, [cropScale, selectedSession, visiblePlayers]);

  const selectedPlayer = mockPlayers.find((player) => player.id === (selectedPlayerId === 'all' ? openPlayerId : selectedPlayerId)) || mockPlayers[0];
  const selectedRow = analyticsRows.find((row) => row.player.id === selectedPlayer.id) || analyticsRows[0];
  const rosterSize = Math.max(analyticsRows.length, 1);
  const squadAvgDistance = Math.round(analyticsRows.reduce((acc, row) => acc + row.scaledDistance, 0) / rosterSize);
  const squadSprintAvg = Math.round(analyticsRows.reduce((acc, row) => acc + row.scaledSprints, 0) / rosterSize);
  const squadMaxVelocity = analyticsRows.reduce((max, row) => Math.max(max, row.metric.maxSpeedMps), 0);
  const squadWorkloadAvg = Math.round(analyticsRows.reduce((acc, row) => acc + row.scaledWorkload, 0) / rosterSize);

  const trendSessions = completedSessions
    .filter((session) => selectedPlayerId === 'all' || session.athleteMetrics?.some((item) => item.athleteId === selectedPlayerId))
    .slice(0, 6)
    .reverse()
    .map((session) => {
      const metrics = selectedPlayerId === 'all'
        ? session.athleteMetrics || []
        : (session.athleteMetrics || []).filter((item) => item.athleteId === selectedPlayerId);
      const count = Math.max(metrics.length, 1);
      return {
        name: formatSessionDate(session.sessionDate || session.date).split(' ').slice(0, 2).join(' '),
        Distance: Math.round(metrics.reduce((acc, item) => acc + item.distanceMeters, 0) / count),
        Workload: Math.round(metrics.reduce((acc, item) => acc + item.workloadIndex, 0) / count),
      };
    });

  const focusContext = `${selectedSession?.title || 'Selected session'} • ${
    selectedPlayerId === 'all' ? 'All Players' : selectedPlayer.name
  } • ${metricLabels[metricFilter]} • ${fromTime || sessionStartClock}-${toTime || sessionEndClock}`;

  const signed = (value: number, unit = '') => `${value > 0 ? '+' : ''}${value.toLocaleString()}${unit}`;
  const statusForDiff = (diff: number, unit = '') => {
    if (diff > 0) return unit === ' workload' ? `Above planned load: ${signed(diff)}` : `Above target: ${signed(diff, unit)}`;
    if (diff === 0) return 'Target met';
    return `Below target: ${signed(diff, unit)}`;
  };

  const averageTarget = (key: 'distanceMeters' | 'sprintCount' | 'maxSpeedMps' | 'workloadIndex') =>
    Math.round(analyticsRows.reduce((acc, row) => acc + Number(row.target[key] || 0), 0) / rosterSize);

  const targetDistance = averageTarget('distanceMeters');
  const targetSprints = averageTarget('sprintCount');
  const targetMaxVelocity = Number((analyticsRows.reduce((acc, row) => acc + Number(row.target.maxSpeedMps || 0), 0) / rosterSize).toFixed(1));
  const targetWorkload = averageTarget('workloadIndex');
  const targetProgressAvg = Math.round(analyticsRows.reduce((acc, row) => acc + row.progress, 0) / rosterSize);

  const selectedFocusCards = [
    {
      label: 'Distance',
      current: `${squadAvgDistance.toLocaleString()}m`,
      target: `${targetDistance.toLocaleString()}m`,
      diff: signed(squadAvgDistance - targetDistance, 'm'),
      percent: `${getActualVsExpectedPercent(squadAvgDistance, targetDistance)}%`,
      status: statusForDiff(squadAvgDistance - targetDistance, 'm'),
      detail: 'Current focus distance vs configured target',
    },
    {
      label: 'High-speed efforts',
      current: `${squadSprintAvg}`,
      target: `${targetSprints}`,
      diff: signed(squadSprintAvg - targetSprints),
      percent: `${getActualVsExpectedPercent(squadSprintAvg, targetSprints)}%`,
      status: squadSprintAvg >= targetSprints ? 'Target met' : statusForDiff(squadSprintAvg - targetSprints),
      detail: `Above SSP-configured ${speedThreshold} m/s`,
    },
    {
      label: 'Max velocity',
      current: `${squadMaxVelocity.toFixed(1)} m/s`,
      target: `${targetMaxVelocity.toFixed(1)} m/s`,
      diff: signed(Number((squadMaxVelocity - targetMaxVelocity).toFixed(1)), ' m/s'),
      percent: `${getActualVsExpectedPercent(squadMaxVelocity, targetMaxVelocity)}%`,
      status: statusForDiff(Number((squadMaxVelocity - targetMaxVelocity).toFixed(1)), ' m/s'),
      detail: 'Peak speed in current focus',
    },
    {
      label: 'Workload index',
      current: `${squadWorkloadAvg}`,
      target: `${targetWorkload}`,
      diff: signed(squadWorkloadAvg - targetWorkload),
      percent: `${getActualVsExpectedPercent(squadWorkloadAvg, targetWorkload)}%`,
      status: squadWorkloadAvg > targetWorkload + 10 ? `Above planned load: ${signed(squadWorkloadAvg - targetWorkload)}` : statusForDiff(squadWorkloadAvg - targetWorkload),
      detail: 'Coach review indicator',
    },
    {
      label: 'Target progress',
      current: `${targetProgressAvg}%`,
      target: '100%',
      diff: signed(targetProgressAvg - 100, '%'),
      percent: `${targetProgressAvg}%`,
      status: targetProgressAvg >= 100 ? 'Target met' : `Below target: ${signed(targetProgressAvg - 100, '%')}`,
      detail: 'Average selected target achievement',
    },
  ];

  const targetAchievementData = analyticsRows.map((row) => ({
    name: row.player.name.split(' ').slice(-1)[0],
    '% of target achieved': row.progress,
  }));

  const actualVsTargetData = analyticsRows.map((row) => {
    const actual =
      metricFilter === 'sprints'
        ? row.scaledSprints
        : metricFilter === 'maxSpeed'
        ? row.metric.maxSpeedMps
        : metricFilter === 'workload'
        ? row.scaledWorkload
        : metricFilter === 'targetProgress'
        ? row.progress
        : row.scaledDistance;
    const target =
      metricFilter === 'sprints'
        ? row.target.sprintCount
        : metricFilter === 'maxSpeed'
        ? row.target.maxSpeedMps
        : metricFilter === 'workload'
        ? row.target.workloadIndex
        : metricFilter === 'targetProgress'
        ? 100
        : row.target.distanceMeters;
    return {
      name: row.player.name.split(' ').slice(-1)[0],
      Actual: actual,
      Target: target,
    };
  });

  const workloadVsPlannedData = analyticsRows.map((row) => ({
    name: row.player.name.split(' ').slice(-1)[0],
    Actual: row.scaledWorkload,
    Planned: row.target.workloadIndex,
  }));

  const exposureDemandData = completedSessions.slice(0, 6).reverse().map((session) => {
    const metrics = session.athleteMetrics || [];
    const count = Math.max(metrics.length, 1);
    const value =
      metricFilter === 'sprints'
        ? Math.round(metrics.reduce((acc, item) => acc + item.sprintCount, 0) / count)
        : metricFilter === 'maxSpeed'
        ? Number((metrics.reduce((max, item) => Math.max(max, item.maxSpeedMps), 0)).toFixed(1))
        : metricFilter === 'workload'
        ? Math.round(metrics.reduce((acc, item) => acc + item.workloadIndex, 0) / count)
        : metricFilter === 'targetProgress'
        ? getTargetProgress(
            Math.round(metrics.reduce((acc, item) => acc + item.distanceMeters, 0) / count),
            session.squadTarget?.distanceMeters || 1
          )
        : Math.round(metrics.reduce((acc, item) => acc + item.distanceMeters, 0) / count);
    return {
      name: `${getSessionType(session) === 'match' ? 'Match' : 'Training'} ${formatSessionDate(session.sessionDate || session.date).split(' ').slice(0, 2).join(' ')}`,
      'Selected load metric': value,
    };
  });

  const selectedMetricYAxis =
    metricFilter === 'sprints'
      ? 'Effort count'
      : metricFilter === 'maxSpeed'
      ? 'Speed (m/s)'
      : metricFilter === 'workload'
      ? 'Workload index'
      : metricFilter === 'targetProgress'
      ? '% of target achieved'
      : 'Distance (m)';

  const avgAcwr = Number((mockPlayers.reduce((acc, player) => acc + player.acwr, 0) / Math.max(mockPlayers.length, 1)).toFixed(2));
  const availabilityAvg = Math.round((mockPlayers.filter((player) => player.availabilityStatus === 'Optimal').length / Math.max(mockPlayers.length, 1)) * 100);
  const sessionStatus = selectedSession ? 'Completed session loaded' : 'No session selected';
  const displayFromTime = fromTime || sessionStartClock;
  const displayToTime = toTime || sessionEndClock;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.Users className="h-4 w-4" />
            <span>Squad Performance Analytics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Squad Analytics
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
            Review squad metrics, crop completed sessions, and inspect player target progress from one coach-side view.
          </p>
        </div>
        <Link
          href={`/platform/coach/analytics?sessionId=${selectedSession?.id || ''}&playerId=${selectedPlayerId}&metric=${metricFilter}&from=${displayFromTime}&to=${displayToTime}`}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all shadow shadow-brand-blue/25 flex items-center space-x-1.5 self-start md:self-center"
        >
          <Icons.BarChart3 className="h-4 w-4" />
          <span>Advanced Charts</span>
        </Link>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Session Type</span>
            <select value={sessionTypeFilter} onChange={(e) => setSessionTypeFilter(e.target.value as SessionTypeFilter)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              <option value="all">All Sessions</option>
              <option value="training">Training</option>
              <option value="match">Match</option>
            </select>
          </label>
          
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-[10px] font-bold text-zinc-500">Completed Session Selector</span>
            <select value={selectedSession?.id || ''} onChange={(e) => setSelectedSessionId(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              {availableSessions.map((session) => (
                <option key={session.id} value={session.id}>{getSessionLabel(session)}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Player Filter</span>
            <select value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              <option value="all">All Players</option>
              {mockPlayers.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Position Group</span>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              {['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map((pos) => <option key={pos} value={pos}>{pos === 'All' ? 'All Positions' : `${pos}s`}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Duty Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              {['All', 'Ready', 'Recovery', 'High Load'].map((status) => <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Metric Indicator</span>
            <select value={metricFilter} onChange={(e) => setMetricFilter(e.target.value as MetricFilter)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200">
              {Object.entries(metricLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Exact From Time ({sessionStartClock})</span>
            <input type="time" value={displayFromTime} min={sessionStartClock} max={displayToTime} onChange={(e) => setFromTime(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-850 dark:text-zinc-200" />
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-500">Exact To Time ({sessionEndClock})</span>
            <input type="time" value={displayToTime} min={displayFromTime} max={sessionEndClock} onChange={(e) => setToTime(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-850 dark:text-zinc-200" />
          </label>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 p-3 text-xs font-semibold text-zinc-600 dark:text-zinc-350 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <div>Crop range: <strong className="text-zinc-950 dark:text-white">{displayFromTime} - {displayToTime}</strong>{isCropValid ? ` (${cropRange[0]}-${cropRange[1]} min)` : ` (0-${durationBound} min)`}</div>
            <span className="text-[10px] text-zinc-500 block">Focus values are demo-scaled from session summaries until timestamped tracking samples are available.</span>
          </div>
        </div>
      </div>

      {/* Selected Focus Summary */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-base font-black text-zinc-950 dark:text-white">Selected Focus Summary</h2>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            Based on the selected session, player filter, metric, and exact time window.
          </p>
          <p className="mt-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 px-3 py-2 text-[10px] font-bold text-zinc-650 dark:text-zinc-350">
            Current view: {focusContext}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-zinc-500">
            Focus values are demo-scaled from session summaries until timestamped tracking samples are available.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedFocusCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
              <span className="text-[10px] font-black uppercase text-zinc-500 block">{card.label}</span>
              <span className="text-xl font-black text-zinc-950 dark:text-white mt-2 block">{card.current}</span>
              <div className="mt-2 space-y-1 text-[10px] font-bold text-zinc-600 dark:text-zinc-350">
                <p>Target: <span className="text-zinc-950 dark:text-white">{card.target}</span></p>
                <p>Difference: <span className="text-zinc-950 dark:text-white">{card.diff}</span></p>
                <p>Percentage of target: <span className="text-zinc-950 dark:text-white">{card.percent}</span></p>
                <p className="text-brand-blue">{card.status}</p>
                <p className="text-zinc-500">{card.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Squad and System Status */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-base font-black text-zinc-950 dark:text-white">Squad and System Status</h2>
          <p className="text-xs font-semibold text-zinc-500 mt-1">
            General squad/system indicators. These are not filtered by the selected time window unless stated.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Total Active Roster', `${mockPlayers.length}`, 'Full available roster, not time-window filtered'],
            ['Avg Squad ACWR', avgAcwr.toFixed(2), `ACWR review: ${avgAcwr.toFixed(2)} within demo review range`],
            ['Squad Availability Avg', `${availabilityAvg}%`, 'Players marked Optimal in roster status'],
            ['Session Status', sessionStatus, selectedSession ? `${formatSessionDate(selectedSession.sessionDate || selectedSession.date)} completed` : 'Select a completed session'],
          ].map(([label, value, note]) => (
            <div key={label} className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
              <span className="text-[10px] font-black uppercase text-zinc-500 block">{label}</span>
              <span className="text-xl font-black text-zinc-950 dark:text-white mt-2 block">{value}</span>
              <span className="text-[10px] font-semibold text-zinc-500 mt-2 block">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">Target achievement by player</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Shows how close each player is to the selected target in the selected time window.</p>
            <p className="text-[9px] font-bold text-zinc-500 mt-1">X-axis: Player • Y-axis: % of target achieved • Context: {focusContext}</p>
          </div>
          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={targetAchievementData} margin={{ top: 10, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} label={{ value: 'Player', position: 'insideBottom', offset: -8, fontSize: 10 }} />
                  <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} label={{ value: '% of target achieved', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="% of target achieved" fill="var(--brand-blue)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">Actual vs target by player</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Compares actual output with the configured target for the selected metric.</p>
            <p className="text-[9px] font-bold text-zinc-500 mt-1">X-axis: Player • Y-axis: {selectedMetricYAxis} • Metric: {metricLabels[metricFilter]}</p>
          </div>
          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actualVsTargetData} margin={{ top: 10, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} label={{ value: 'Player', position: 'insideBottom', offset: -8, fontSize: 10 }} />
                  <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} label={{ value: selectedMetricYAxis, angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Actual" fill="var(--brand-blue)" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="Target" fill="var(--amber-500)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">High-speed efforts above SSP-configured threshold</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Counts movements above the configured speed threshold for this demo session.</p>
            <p className="text-[9px] font-bold text-zinc-500 mt-1">X-axis: Player • Y-axis: Effort count • Threshold: SSP-configured {speedThreshold} m/s</p>
          </div>
          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsRows.map((row) => ({ name: row.player.name.split(' ').slice(-1)[0], 'Effort count': row.scaledSprints }))} margin={{ top: 10, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} label={{ value: 'Player', position: 'insideBottom', offset: -8, fontSize: 10 }} />
                  <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Effort count', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="Effort count" fill="var(--amber-500)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">Workload vs planned load</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Compares actual workload against planned workload for coach review.</p>
            <p className="text-[9px] font-bold text-zinc-500 mt-1">X-axis: Player • Y-axis: Workload index • Context: {focusContext}</p>
          </div>
          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadVsPlannedData} margin={{ top: 10, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} label={{ value: 'Player', position: 'insideBottom', offset: -8, fontSize: 10 }} />
                  <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Workload index', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Actual" fill="var(--brand-blue)" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="Planned" fill="var(--amber-500)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm xl:col-span-2">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">Training exposure vs match demand</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Shows whether selected training exposure is below, close to, or above recent match demand.</p>
            <p className="text-[9px] font-bold text-zinc-500 mt-1">X-axis: Session type/date • Y-axis: Selected load metric ({metricLabels[metricFilter]})</p>
          </div>
          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exposureDemandData} margin={{ top: 10, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} label={{ value: 'Session type/date', position: 'insideBottom', offset: -8, fontSize: 10 }} />
                  <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Selected load metric', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Selected load metric" stroke="var(--brand-blue)" strokeWidth={2.5} dot />
                </LineChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-black text-zinc-955 dark:text-white">Roster Table</h3>
            <p className="text-[10px] text-zinc-500">Click a row or View Analytics to open the coach-side player panel.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none font-semibold" placeholder="Search by name..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-650 dark:text-zinc-350 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 bg-zinc-100/40 dark:bg-zinc-955/50">
                <th className="py-4 pl-6 w-16">Squad #</th>
                <th className="py-4 pl-4">Athlete</th>
                <th className="py-4">Position</th>
                <th className="py-4 text-center">Duty Status</th>
                <th className="py-4 text-right">Distance</th>
                <th className="py-4 text-right">Max Velocity</th>
                <th className="py-4 text-right">Sprint Efforts</th>
                <th className="py-4 text-right">Workload</th>
                <th className="py-4 text-center">Workload Review Reason</th>
                <th className="py-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
              {analyticsRows.map((row) => {
                const isOptimal = row.classification === 'On target';
                return (
                  <tr key={row.player.id} onClick={() => setOpenPlayerId(row.player.id)} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-955/60 transition-colors cursor-pointer">
                    <td className="py-4.5 pl-6 font-black text-zinc-600 text-sm">{row.player.squadNumber.toString().padStart(2, '0')}</td>
                    <td className="py-4.5 pl-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-bold text-xs text-brand-blue">
                          {row.player.name.split(' ').map((name) => name[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-zinc-950 dark:text-white">{row.player.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-medium">{row.actualVsExpected}% actual-vs-expected</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5"><span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-955 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-800">{row.player.position}</span></td>
                    <td className="py-4.5 text-center"><span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold border border-zinc-300 dark:border-zinc-800">{row.player.status}</span></td>
                    <td className="py-4.5 text-right font-semibold">{row.scaledDistance.toLocaleString()} m</td>
                    <td className="py-4.5 text-right font-semibold">{row.metric.maxSpeedMps.toFixed(1)} m/s</td>
                    <td className="py-4.5 text-right font-semibold">{row.scaledSprints}</td>
                    <td className="py-4.5 text-right font-semibold">{row.scaledWorkload}</td>
                    <td className="py-4.5 text-center">
                      <span className={`font-black px-2.5 py-0.5 rounded text-[10px] border ${
                        isOptimal
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : row.classification.includes('above')
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>{row.classification}</span>
                    </td>
                    <td className="py-4.5 pr-6 text-right">
                      <button type="button" onClick={(event) => { event.stopPropagation(); setOpenPlayerId(row.player.id); setSelectedPlayerId(row.player.id); }} className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-brand-blue hover:text-white dark:bg-zinc-955 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-300 dark:border-zinc-800">
                        View Analytics
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Detail Card */}
      {selectedRow && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-[10px] font-black text-brand-blue uppercase">Individual Player Analytics</span>
              <h3 className="text-xl font-black text-zinc-955 dark:text-white mt-1">{selectedRow.player.name}</h3>
              <p className="text-xs font-semibold text-zinc-550">{selectedRow.player.position} - {selectedSession ? getSessionLabel(selectedSession) : 'No completed session selected'}</p>
            </div>
            <Link href={`/platform/coach/athlete/${selectedRow.player.id}`} className="inline-flex items-center rounded-xl bg-brand-blue px-4 py-2 text-[10px] font-black text-white">
              Full Athlete Profile
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              ['Distance', `${selectedRow.scaledDistance} / ${selectedRow.target.distanceMeters} m`, `${getActualVsExpectedPercent(selectedRow.scaledDistance, selectedRow.target.distanceMeters)}%`],
              ['Sprint Efforts', `${selectedRow.scaledSprints} / ${selectedRow.target.sprintCount}`, `${getActualVsExpectedPercent(selectedRow.scaledSprints, selectedRow.target.sprintCount)}%`],
              ['Max Velocity', `${selectedRow.metric.maxSpeedMps} / ${selectedRow.target.maxSpeedMps} m/s`, `${getActualVsExpectedPercent(selectedRow.metric.maxSpeedMps, selectedRow.target.maxSpeedMps)}%`],
              ['Workload Index', `${selectedRow.scaledWorkload} / ${selectedRow.target.workloadIndex}`, selectedRow.classification],
              ['Preset', selectedRow.preset?.name || 'Session target', 'Demo configured'],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3">
                <span className="block text-[9px] font-black uppercase text-zinc-500">{label}</span>
                <span className="mt-1 block text-xs font-black text-zinc-950 dark:text-white">{value}</span>
                <span className="mt-1 block text-[9px] font-semibold text-zinc-500">{detail}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="h-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendSessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--zinc-550)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--zinc-550)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Distance" stroke="var(--brand-blue)" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Workload" stroke="var(--amber-500)" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3">
              <div>
                <h4 className="text-xs font-black text-zinc-955 dark:text-white">Recent Sessions</h4>
                <div className="mt-2.5 space-y-2">
                  {completedSessions
                    .filter((session) => session.athleteMetrics?.some((item) => item.athleteId === selectedRow.player.id))
                    .slice(0, 4)
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-600 dark:text-zinc-350">
                        <span>{session.title}</span>
                        <span>{formatSessionDate(session.sessionDate || session.date)}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="text-[10px] font-bold text-zinc-500 leading-normal space-y-1 pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
                <p>
                  High-speed efforts in this SSP demo are counted above the SSP-configured speed threshold ({speedThreshold} m/s). This threshold is demo-configured and should be adjustable by sport, age group/level, position, and session type. It is not a universal sprint definition.
                </p>
                <p className="italic">
                  These are coach-review prompts, not medical assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
