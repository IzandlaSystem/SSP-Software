'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import {
  addMinutesToTime,
  CompletedSessionSummary,
  formatActualTimeRange,
  formatPlannedTimeRange,
  formatSessionDate,
  getCompletedSessions,
  getRecordedDurationMinutes,
  mockPlayers,
  getTargetProgress,
  classifyActualVsExpected,
  formatClockTime
} from '@/data';

export default function AnalyticsPage() {
  const [metricX, setMetricX] = React.useState<'workload' | 'distance' | 'maxSpeed'>('workload');
  const [metricY, setMetricY] = React.useState<'sprintCount' | 'workload' | 'distance'>('sprintCount');
  
  const [completedSessions, setCompletedSessions] = React.useState<CompletedSessionSummary[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('all');
  
  // Crop states
  const [sessionTypeFilter, setSessionTypeFilter] = React.useState<'all' | 'training' | 'match'>('all');
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>('');
  
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
        const type = session.sessionType === 'match' || session.type === 'match' ? 'match' : 'training';
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

  // Read context query parameters
  React.useEffect(() => {
    if (typeof window !== 'undefined' && completedSessions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const sId = params.get('sessionId');
      const pId = params.get('playerId');
      const fromParam = params.get('from');
      const toParam = params.get('to');
      const metric = params.get('metric');

      if (sId && completedSessions.some(s => s.id === sId)) {
        setSelectedSessionId(sId);
      }
      if (pId) {
        setSelectedPlayerId(pId);
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

  // Initialize clocks when session changes (if no parameters override)
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

  const startTimeOffset = React.useMemo(() => {
    return Math.max(0, getMinutesDiff(sessionStartClock, fromTime));
  }, [sessionStartClock, fromTime]);

  const endTimeOffset = React.useMemo(() => {
    return Math.min(durationBound, getMinutesDiff(sessionStartClock, toTime));
  }, [sessionStartClock, toTime, durationBound]);

  const cropScale = React.useMemo(() => {
    if (!isCropValid) return 1;
    const totalMins = getMinutesDiff(sessionStartClock, sessionEndClock) || durationBound || 1;
    const cropMins = getMinutesDiff(fromTime, toTime);
    return Math.max(0, Math.min(1, cropMins / totalMins));
  }, [sessionStartClock, sessionEndClock, fromTime, toTime, durationBound, isCropValid]);

  // Dynamic Run Graph timeline calculations
  const filteredTimeline = React.useMemo(() => {
    if (!selectedSession || !isCropValid) return [];
    
    // Aggregate values
    const metrics = selectedSession.athleteMetrics || [];
    const pMetric = selectedPlayerId === 'all'
      ? {
          distanceMeters: metrics.reduce((acc, m) => acc + m.distanceMeters, 0) / Math.max(metrics.length, 1),
          maxSpeedMps: metrics.reduce((acc, m) => acc + m.maxSpeedMps, 0) / Math.max(metrics.length, 1)
        }
      : metrics.find(m => m.athleteId === selectedPlayerId) || {
          distanceMeters: 6500,
          maxSpeedMps: 8.5
        };

    const totalDistance = pMetric.distanceMeters;
    const peakVelocity = pMetric.maxSpeedMps;
    
    const startOffset = startTimeOffset;
    const endOffset = endTimeOffset;
    const interval = Math.max(1, Math.round((endOffset - startOffset) / 9));
    
    const result = [];
    for (let i = 0; i <= 9; i++) {
      const currentMin = Math.min(endOffset, startOffset + i * interval);
      const percent = durationBound > 0 ? currentMin / durationBound : 0;
      
      // S-curve distance accumulation
      const distanceAccum = Math.round(totalDistance * (Math.sin(percent * Math.PI / 2)));
      
      // Fluctuate speed within realistic limits
      const speedVal = parseFloat((
        (selectedPlayerId === 'all' ? 4.2 : 4.8) +
        Math.sin(i * 1.2) * 1.8 +
        (Math.cos(i * 0.7) * 1.0)
      ).toFixed(1));
      
      const clampedSpeed = Math.min(peakVelocity, Math.max(1.0, speedVal));
      const clockStr = addMinutesToTime(selectedSession.actualStartTime || selectedSession.plannedStartTime, currentMin);

      result.push({
        time: `${currentMin}m`,
        clock: clockStr,
        speed: clampedSpeed,
        distance: distanceAccum
      });
    }
    return result;
  }, [selectedSession, selectedPlayerId, startTimeOffset, endTimeOffset, durationBound, isCropValid]);

  const scatterData = React.useMemo(() => {
    return mockPlayers
      .filter((player) => selectedPlayerId === 'all' || player.id === selectedPlayerId)
      .map((player) => ({
        name: player.name,
        x: player[metricX],
        y: player[metricY as 'sprintCount' | 'workload' | 'distance'],
        position: player.position,
        squadNumber: player.squadNumber
      }));
  }, [metricX, metricY, selectedPlayerId]);

  const speedThreshold = selectedSession?.squadTarget?.sprintEffortThresholdMps || 5.5;

  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'workload': return 'Workload Index';
      case 'distance': return 'Total Distance (m)';
      case 'maxSpeed': return 'Peak Velocity (m/s)';
      case 'sprintCount': return 'Sprint Repetitions';
      default: return m;
    }
  };

  const getPositionColor = (pos: string) => {
    switch (pos) {
      case 'Forward': return '#06B6D4';
      case 'Midfielder': return '#155EEF';
      case 'Defender': return '#64748B';
      case 'Goalkeeper': return '#93C5FD';
      default: return '#cbd5e1';
    }
  };

  // Detailed player metrics computed for explanation cards
  const contextPlayerStats = React.useMemo(() => {
    if (!selectedSession) return null;
    const metrics = selectedSession.athleteMetrics || [];
    const pMetric = selectedPlayerId === 'all'
      ? {
          distance: metrics.reduce((acc, m) => acc + m.distanceMeters, 0) / Math.max(metrics.length, 1),
          sprints: metrics.reduce((acc, m) => acc + m.sprintCount, 0) / Math.max(metrics.length, 1),
          maxSpeed: metrics.reduce((acc, m) => acc + m.maxSpeedMps, 0) / Math.max(metrics.length, 1),
          workload: metrics.reduce((acc, m) => acc + m.workloadIndex, 0) / Math.max(metrics.length, 1),
        }
      : metrics.find(m => m.athleteId === selectedPlayerId) || {
          distanceMeters: 6500,
          sprintCount: 12,
          maxSpeedMps: 8.5,
          workloadIndex: 80
        };
    const dist = ('distanceMeters' in pMetric ? pMetric.distanceMeters : pMetric.distance) ?? 0;
    const spr = ('sprintCount' in pMetric ? pMetric.sprintCount : pMetric.sprints) ?? 0;
    const maxSp = ('maxSpeedMps' in pMetric ? pMetric.maxSpeedMps : pMetric.maxSpeed) ?? 0;
    const wl = ('workloadIndex' in pMetric ? pMetric.workloadIndex : pMetric.workload) ?? 0;

    const targetBase = selectedPlayerId === 'all'
      ? selectedSession.squadTarget
      : selectedSession.individualTargets?.[selectedPlayerId] || selectedSession.squadTarget;

    const scaledDist = Math.round(dist * cropScale);
    const scaledSprints = Math.round(spr * cropScale);
    const scaledWorkload = Math.round(wl * cropScale);

    return {
      distance: { current: scaledDist, target: targetBase.distanceMeters || 6500, progress: getTargetProgress(scaledDist, targetBase.distanceMeters || 6500) },
      sprints: { current: scaledSprints, target: targetBase.sprintCount || 12, progress: getTargetProgress(scaledSprints, targetBase.sprintCount || 12) },
      maxSpeed: { current: maxSp, target: targetBase.maxSpeedMps || 8.5, progress: getTargetProgress(maxSp, targetBase.maxSpeedMps || 8.5) },
      workload: { current: scaledWorkload, target: targetBase.workloadIndex || 80, progress: getTargetProgress(scaledWorkload, targetBase.workloadIndex || 80) }
    };
  }, [selectedSession, selectedPlayerId, cropScale]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.BarChart3 className="h-4 w-4" />
            <span>Advanced Analytics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
            Analyse player velocity timeline overlays, cumulative workload indices, and custom session focus crops.
          </p>
        </div>
      </div>

      {/* Selectors and Crop Control Panel */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
            Analytics Parameter Configuration
          </h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Configure player, completed session, and exact clock-time crop boundaries to sync deep velocity run graphs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Session Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">Session Type</label>
            <select
              value={sessionTypeFilter}
              onChange={(e) => setSessionTypeFilter(e.target.value as any)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Sessions</option>
              <option value="training">Training Only</option>
              <option value="match">Matches Only</option>
            </select>
          </div>

          {/* Completed Session Selector */}
          <div className="space-y-1.5 xl:col-span-1">
            <label className="text-[10px] font-bold text-zinc-500 block">Completed Session</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              {availableSessions.map((session) => {
                const type = session.sessionType === 'match' || session.type === 'match' ? 'Match' : 'Training';
                const actual = formatActualTimeRange(session);
                return (
                  <option key={session.id} value={session.id}>
                    {session.title} - {type} - {formatSessionDate(session.sessionDate || session.date)} - {actual ? `Actual ${actual}` : `Planned ${formatPlannedTimeRange(session)}`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Player Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">Player Focus</label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              <option value="all">All Players (Squad Average)</option>
              {mockPlayers.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </div>

          {/* Crop Clocks */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">From Time ({sessionStartClock})</label>
            <input
              type="time"
              value={fromTime}
              min={sessionStartClock}
              max={toTime || sessionEndClock}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">To Time ({sessionEndClock})</label>
            <input
              type="time"
              value={toTime}
              min={fromTime || sessionStartClock}
              max={sessionEndClock}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-semibold text-zinc-650 dark:border-zinc-850 dark:bg-zinc-955 dark:text-zinc-350">
          <span>Crop window: <strong className="text-zinc-950 dark:text-white">{fromTime} – {toTime}</strong></span>
          {isCropValid ? (
            <span> ({startTimeOffset} – {endTimeOffset} min of session)</span>
          ) : (
            <span className="text-rose-500 font-bold"> (Invalid clock range selected)</span>
          )}
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
            Focus values are demo-scaled from session summaries until timestamped tracking samples are available.
          </p>
        </div>
      </div>

      {/* Run Graph (Velocity and Distance timeline) */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 gap-4">
          <div className="flex items-center space-x-2">
            <Icons.TrendingUp className="h-5 w-5 text-brand-blue" />
            <div>
              <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">
                Run Graph (Speed Peaks and Cumulative Distance Timeline)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Visualise when intensity rises, velocity peaks, and how cumulative distance covered increments over the timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Line Chart */}
        <div className="h-80 w-full">
          {!isCropValid ? (
            <div className="h-full flex items-center justify-center text-xs font-bold text-rose-500 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-xl">
              No demo samples available in this focus window. Adjust the time range or select another session.
            </div>
          ) : (
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="clock" stroke="var(--zinc-550)" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="var(--brand-blue)" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Speed (m/s)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '9px', fill: 'var(--brand-blue)', fontWeight: 'bold' } }} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--amber-500)" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Distance (m)', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: '9px', fill: 'var(--amber-500)', fontWeight: 'bold' } }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--zinc-100)',
                      borderColor: 'var(--zinc-200)',
                      borderRadius: '12px',
                      color: 'var(--zinc-950)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--zinc-650)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="speed" name="Speed (m/s)" stroke="var(--brand-blue)" strokeWidth={2.5} activeDot={{ r: 6 }} dot={true} />
                  <Line yAxisId="right" type="monotone" dataKey="distance" name="Cumulative Distance (m)" stroke="var(--amber-500)" strokeWidth={2.5} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </ClientOnly>
          )}
        </div>

        <div className="text-[10px] text-zinc-550 dark:text-zinc-450 leading-relaxed pl-1 space-y-1.5 border-t border-zinc-200 dark:border-zinc-800 pt-3">
          <p>
            * Run graph uses demo-generated samples from session summaries until real timestamped tracking samples are available.
          </p>
          <p>
            * High-speed efforts in this SSP demo are counted above the SSP-configured speed threshold ({speedThreshold} m/s). This threshold is demo-configured and should be adjustable by sport, age group/level, position, and session type. It is not a universal sprint definition.
          </p>
          <p className="italic">
            * Workload review indicators represent sessional parameters configured for coach review. They are not medical assessments or clinical diagnostics.
          </p>
        </div>
      </div>

      {/* Metric Explanation Cards - Answering coaching questions */}
      {contextPlayerStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Distance Volume</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white block">
              {contextPlayerStats.distance.current.toLocaleString()}m / {contextPlayerStats.distance.target.toLocaleString()}m
            </span>
            <div className="text-[10px] font-semibold text-zinc-500">
              Target Progress: <span className="font-bold text-brand-blue">{contextPlayerStats.distance.progress}%</span>
              <p className="mt-1 leading-normal">
                Reflects total mechanical work volume. Helps determine if session load meets planned target ranges.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">High-speed efforts</span>
            <span className="text-xl font-black text-zinc-955 dark:text-white block">
              {contextPlayerStats.sprints.current} / {contextPlayerStats.sprints.target} runs
            </span>
            <div className="text-[10px] font-semibold text-zinc-500">
              Target Progress: <span className="font-bold text-brand-blue">{contextPlayerStats.sprints.progress}%</span>
              <p className="mt-1 leading-normal">
                Counted movements above configured {speedThreshold} m/s. Reflects explosive velocity demands.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Peak Speed</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white block">
              {contextPlayerStats.maxSpeed.current} / {contextPlayerStats.maxSpeed.target} m/s
            </span>
            <div className="text-[10px] font-semibold text-zinc-500">
              Target Progress: <span className="font-bold text-brand-blue">{contextPlayerStats.maxSpeed.progress}%</span>
              <p className="mt-1 leading-normal">
                Highest achieved velocity during the focus window. Not affected by crop duration scaling.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Workload Index</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white block">
              {contextPlayerStats.workload.current} / {contextPlayerStats.workload.target}
            </span>
            <div className="text-[10px] font-semibold text-zinc-500">
              Target Progress: <span className="font-bold text-brand-blue">{contextPlayerStats.workload.progress}%</span>
              <p className="mt-1 leading-normal">
                Workload index represents the sessional load. Calculated index is a coach-review prompt, not a forecasting model.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Axis Controls Toolbar (Scatter Plot) */}
      <div className="bg-zinc-50 border border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 block">Mapping Dimension (X-Axis)</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {(['workload', 'distance', 'maxSpeed'] as const).map((xVal) => (
                <button
                  key={xVal}
                  onClick={() => setMetricX(xVal)}
                  className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    metricX === xVal 
                      ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow' 
                      : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {xVal === 'workload' ? 'Workload' : xVal === 'distance' ? 'Distance' : 'Max Speed'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 block font-bold">Y-Axis Metric</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-955 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {(['sprintCount', 'workload', 'distance'] as const)
                .filter((yVal) => yVal !== metricX)
                .map((yVal) => (
                  <button
                    key={yVal}
                    onClick={() => setMetricY(yVal)}
                    className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      metricY === yVal 
                        ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow' 
                        : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    {yVal === 'sprintCount' ? 'Sprints' : yVal === 'workload' ? 'Workload' : 'Distance'}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-955 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 self-start md:self-center">
          <span className="text-[9px] font-bold text-zinc-500 mr-2">Positional Colors:</span>
          <div className="flex flex-wrap gap-3 text-[10px] font-bold">
            <span className="flex items-center space-x-1 text-brand-blue"><span className="h-2 w-2 rounded-full bg-brand-blue" /> <span>FWD</span></span>
            <span className="flex items-center space-x-1 text-amber-500"><span className="h-2 w-2 rounded-full bg-amber-500" /> <span>MID</span></span>
            <span className="flex items-center space-x-1 text-zinc-500"><span className="h-2 w-2 rounded-full bg-zinc-500" /> <span>DEF</span></span>
            <span className="flex items-center space-x-1 text-blue-300"><span className="h-2 w-2 rounded-full bg-blue-300" /> <span>GK</span></span>
          </div>
        </div>
      </div>

      {/* Scatter plot card */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-zinc-850 dark:text-zinc-200">
            Workload vs Movement Mapping (Scatter Plot)
          </h3>
          <span className="text-[10px] text-zinc-500 font-bold">
            Roster Position Cluster
          </span>
        </div>

        <div className="h-96 w-full">
          <ClientOnly>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={getMetricLabel(metricX)} 
                  stroke="var(--zinc-550)" 
                  fontSize={10} 
                  tickLine={false} 
                  label={{ value: getMetricLabel(metricX), fill: 'var(--zinc-550)', fontSize: 10, position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={getMetricLabel(metricY)} 
                  stroke="var(--zinc-550)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: getMetricLabel(metricY), fill: 'var(--zinc-550)', angle: -90, fontSize: 10, position: 'left', offset: 0 }}
                />
                <ZAxis type="number" range={[100, 100]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: 'var(--zinc-200)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xl text-[10px] text-zinc-700 dark:text-zinc-300 space-y-1">
                          <p className="font-black text-zinc-950 dark:text-white text-xs">{data.name} (#{data.squadNumber})</p>
                          <p className="text-zinc-500">{data.position}</p>
                          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2 space-y-1 text-[10px]">
                            <p>{getMetricLabel(metricX)}: <span className="font-black text-zinc-955 dark:text-white">{data.x}</span></p>
                            <p>{getMetricLabel(metricY)}: <span className="font-black text-zinc-955 dark:text-white">{data.y}</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Players" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getPositionColor(entry.position)} 
                      stroke="var(--zinc-200)" 
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-300 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-start space-x-2">
            <Icons.Info className="h-4.5 w-4.5 text-zinc-650 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              <span className="font-extrabold text-zinc-700 dark:text-zinc-300">Workload Interpretation:</span> This plot supports coach review of workload, movement patterns, sprint efforts, and target progress. ACWR-style values may be shown as demo-configured workload review indicators. Where the demo uses a range such as 0.8–1.3, label it as a configurable coach-review range, not a medical standard, injury-risk threshold, or forecasting model.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Icons.Compass className="h-4.5 w-4.5 text-zinc-650 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              <span className="font-extrabold text-zinc-700 dark:text-zinc-300">Bilateral Balances:</span> Goalkeeper positions cluster at minimal velocity/running ranges. Midfielder groups demonstrate deeper running loops. All parameters represent review/demo indicators, not clinical danger, medical scoring, or diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
