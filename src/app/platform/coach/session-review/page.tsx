'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import {
  addMinutesToTime,
  classifyActualVsExpected,
  CompletedSessionSummary,
  formatActualTimeRange,
  formatPlannedTimeRange,
  formatSessionDate,
  getCompletedSessions,
  getRecordedDurationMinutes,
  getSelectedCompletedSessionId,
  getTargetProgress,
  mockPlayers,
  setSelectedCompletedSessionId,
  formatClockTime
} from '@/data';

const RechartsResponsiveContainer = ResponsiveContainer as any;
const RechartsRadarChart = RadarChart as any;
const RechartsPolarGrid = PolarGrid as any;
const RechartsPolarAngleAxis = PolarAngleAxis as any;
const RechartsPolarRadiusAxis = PolarRadiusAxis as any;
const RechartsRadar = Radar as any;
const RechartsTooltip = Tooltip as any;
const RechartsLegend = Legend as any;

export default function SessionReviewPage() {
  const [completedSessions, setCompletedSessions] = React.useState<CompletedSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>('');
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('all');
  const [coachNotes, setCoachNotes] = React.useState<string>('');
  
  // Custom interactive modal states
  const [actionType, setActionType] = React.useState<'save' | 'export' | 'sync' | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // Exact clock time crop states
  const [fromTime, setFromTime] = React.useState<string>('');
  const [toTime, setToTime] = React.useState<string>('');

  const sessionData = React.useMemo(
    () => completedSessions.find((session) => session.id === selectedSessionId) || completedSessions[0] || null,
    [completedSessions, selectedSessionId]
  );

  const durationBound = React.useMemo(() => {
    if (!sessionData) return 0;
    return getRecordedDurationMinutes(
      sessionData.actualStartTime,
      sessionData.actualEndTime,
      sessionData.actualDurationMinutes || sessionData.durationMinutes || sessionData.plannedDurationMinutes || 0
    ) || sessionData.plannedDurationMinutes || sessionData.durationMinutes || 0;
  }, [sessionData]);

  const durationSource = sessionData?.actualDurationMinutes || (sessionData?.actualStartTime && sessionData?.actualEndTime)
    ? 'actual recorded duration'
    : 'planned duration';

  const getMinutesDiff = (t1: string, t2: string) => {
    if (!t1 || !t2) return 0;
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const sessionStartClock = React.useMemo(() => {
    if (!sessionData) return '00:00';
    return formatClockTime(sessionData.actualStartTime || sessionData.plannedStartTime);
  }, [sessionData]);

  const sessionEndClock = React.useMemo(() => {
    if (!sessionData) return '00:00';
    return formatClockTime(sessionData.actualEndTime || sessionData.plannedEndTime);
  }, [sessionData]);

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

  const cropScaleFactor = React.useMemo(() => {
    if (!isCropValid) return 1;
    const totalMins = getMinutesDiff(sessionStartClock, sessionEndClock) || durationBound || 1;
    const cropMins = getMinutesDiff(fromTime, toTime);
    return Math.max(0, Math.min(1, cropMins / totalMins));
  }, [sessionStartClock, sessionEndClock, fromTime, toTime, durationBound, isCropValid]);

  // Load completed session history from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = getCompletedSessions();
      const storedSelectedId = getSelectedCompletedSessionId();
      setCompletedSessions(sessions);
      setSelectedSessionId(storedSelectedId && sessions.some((session) => session.id === storedSelectedId) ? storedSelectedId : sessions[0]?.id || '');
    }
  }, []);

  // Read context query parameters
  React.useEffect(() => {
    if (typeof window !== 'undefined' && completedSessions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const sId = params.get('sessionId');
      const pId = params.get('playerId');
      const fromParam = params.get('from');
      const toParam = params.get('to');

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

  // Initialize clocks when session changes (if no override parameter exists)
  React.useEffect(() => {
    if (sessionData) {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get('from');
      const toParam = params.get('to');
      if (!fromParam || !toParam) {
        const start = formatClockTime(sessionData.actualStartTime || sessionData.plannedStartTime);
        const end = formatClockTime(sessionData.actualEndTime || sessionData.plannedEndTime);
        setFromTime(start);
        setToTime(end);
      }
    }
  }, [sessionData?.id]);

  const handleCompletedSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSelectedCompletedSessionId(sessionId);
  };

  // Targets vs achievement for the selected completed session.
  const radarComparisonData = React.useMemo(() => {
    if (!sessionData) return [];
    const metrics =
      selectedPlayerId === 'all'
        ? sessionData.athleteMetrics || []
        : (sessionData.athleteMetrics || []).filter((metric) => metric.athleteId === selectedPlayerId);
    const rosterSize = Math.max(metrics.length || 1, 1);
    const target = sessionData.squadTargets || sessionData.squadTarget;
    const playerTarget = selectedPlayerId === 'all' ? target : sessionData.individualTargets?.[selectedPlayerId] || target;
    const avgDistance = Math.round(metrics.reduce((acc: number, m: any) => acc + m.distanceMeters, 0) / rosterSize);
    const avgSpeed = metrics.reduce((max: number, m: any) => Math.max(max, m.maxSpeedMps), 0);
    const avgSprints = Math.round(metrics.reduce((acc: number, m: any) => acc + m.sprintCount, 0) / rosterSize);
    const avgWorkload = Math.round(metrics.reduce((acc: number, m: any) => acc + m.workloadIndex, 0) / rosterSize);
    return [
      { metric: 'Avg Distance', Target: 100, Achievement: getTargetProgress(avgDistance * cropScaleFactor, playerTarget?.distanceMeters || 1) },
      { metric: 'Peak Velocity', Target: 100, Achievement: getTargetProgress(avgSpeed, playerTarget?.maxSpeedMps || 1) },
      { metric: 'Sprint Efforts', Target: 100, Achievement: getTargetProgress(avgSprints * cropScaleFactor, playerTarget?.sprintCount || 1) },
      { metric: 'Workload Index', Target: 100, Achievement: getTargetProgress(avgWorkload * cropScaleFactor, playerTarget?.workloadIndex || 1) },
    ];
  }, [selectedPlayerId, sessionData, cropScaleFactor]);

  const handleAction = (type: 'save' | 'export' | 'sync') => {
    setActionType(type);
    setIsProcessing(true);
    setIsSuccess(false);

    // Simulate server transaction spinner
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Auto clear success indicator banner after 4 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setActionType(null);
      }, 4000);
    }, 1800);
  };

  if (!sessionData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 animate-in fade-in">
        <div className="max-w-lg rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Icons.ClipboardCheck className="mx-auto h-10 w-10 text-zinc-400" />
          <h1 className="mt-4 text-xl font-black text-zinc-955 dark:text-white">No completed sessions yet</h1>
          <p className="mt-2 text-sm font-semibold text-zinc-550">
            Run and save a Live Squad session first. Completed sessions will appear here for review.
          </p>
          <a
            href="/platform/coach/live-session"
            className="mt-5 inline-flex rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-black text-white shadow hover:bg-brand-blue/90"
          >
            Open Live Squad
          </a>
        </div>
      </div>
    );
  }

  // Calculate aggregates
  const reviewMetrics =
    selectedPlayerId === 'all'
      ? sessionData.athleteMetrics
      : sessionData.athleteMetrics.filter((metric) => metric.athleteId === selectedPlayerId);
  const rosterSize = Math.max(reviewMetrics.length, 1);
  const rawAvgDistance = Math.round(
    reviewMetrics.reduce((acc: number, m: any) => acc + m.distanceMeters, 0) / rosterSize
  );
  const avgDistance = Math.round(rawAvgDistance * cropScaleFactor);
  const avgMaxSpeed = parseFloat(
    (reviewMetrics.reduce((max: number, m: any) => Math.max(max, m.maxSpeedMps), 0) / rosterSize).toFixed(1)
  );
  const rawTotalSprints = reviewMetrics.reduce((acc: number, m: any) => acc + m.sprintCount, 0);
  const totalSprints = Math.round(rawTotalSprints * cropScaleFactor);
  const selectedPlayerCount = reviewMetrics.length;
  
  const cropClockStart = addMinutesToTime(sessionData.actualStartTime || sessionData.plannedStartTime, cropRange[0]);
  const cropClockEnd = addMinutesToTime(sessionData.actualStartTime || sessionData.plannedStartTime, cropRange[1]);
  const cropClockLabel = sessionData.actualStartTime ? 'actual clock range' : 'planned clock range';
  const sessionTypeLabel = sessionData.sessionType === 'match' || sessionData.type === 'match' ? 'Match' : 'Training';

  const speedThreshold = sessionData?.squadTarget?.sprintEffortThresholdMps || 5.5;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.ClipboardCheck className="h-4 w-4" />
            <span>Post-Session Review Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-955 dark:text-white">
            Post-Session Review
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
            Evaluate squad performance indexes against planned targets. Record training reflections.
          </p>
        </div>

        {/* Custom Actions bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('sync')}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-805 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.RefreshCcw className="h-4 w-4" />
            <span>Sync Data</span>
          </button>

          <button
            onClick={() => handleAction('export')}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-805 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleAction('save')}
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.02] shadow shadow-brand-blue/25 cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.Check className="h-4 w-4" />
            <span>Save Reflections</span>
          </button>
        </div>
      </div>

      {/* Crop / Focus View Card */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-zinc-250 dark:border-zinc-800 pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200">
                Completed Session Selection & Clock Crop
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Select a completed session. Crop minutes are based on the selected session's actual recorded duration.
              </p>
            </div>
            <div className="w-full lg:max-w-xl">
              <label className="text-[10px] font-bold text-zinc-500 block mb-1.5">Completed Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => handleCompletedSessionChange(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none focus:border-brand-blue"
              >
                {completedSessions.map((session) => {
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">Player Focus</label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 cursor-pointer focus:outline-none focus:border-brand-blue"
            >
              <option value="all">Squad Aggregate</option>
              {(sessionData.athleteMetrics || []).map((metric) => {
                const player = mockPlayers.find((item) => item.id === metric.athleteId);
                return (
                  <option key={metric.athleteId} value={metric.athleteId}>
                    {metric.athleteName} {player ? `- ${player.position}` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* From Time clock */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">Exact From Time ({sessionStartClock})</label>
            <input
              type="time"
              value={fromTime}
              min={sessionStartClock}
              max={toTime || sessionEndClock}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* To Time clock */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 block">Exact To Time ({sessionEndClock})</label>
            <input
              type="time"
              value={toTime}
              min={fromTime || sessionStartClock}
              max={sessionEndClock}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-[10px] font-bold text-zinc-500 block">Focus window</span>
            <span className="text-xs font-black text-zinc-900 dark:text-white">
              {fromTime || '--:--'} – {toTime || '--:--'}
            </span>
            <span className="text-[9px] text-zinc-500 block font-bold">
              {isCropValid ? `${cropRange[0]}–${cropRange[1]} min` : 'Invalid clock range'}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-650 dark:border-zinc-850 dark:bg-zinc-955 dark:text-zinc-350">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            Focus values are demo-scaled from session summaries until timestamped tracking samples are available.
          </p>
        </div>
      </div>

      {/* Selected Session Details */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-brand-blue">{sessionTypeLabel} Session</span>
            <h2 className="mt-1 text-2xl font-black text-zinc-955 dark:text-white">{sessionData.title}</h2>
            <p className="mt-1 text-xs font-semibold text-zinc-550 dark:text-zinc-400">{sessionData.objectives || sessionData.sessionObjectives || 'No objectives recorded.'}</p>
          </div>
          <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-[10px] font-black text-zinc-605 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-300 self-start">
            {selectedPlayerCount} players recorded
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
          {[
            ['Session date', formatSessionDate(sessionData.sessionDate || sessionData.date)],
            ['Planned time', formatPlannedTimeRange(sessionData)],
            ['Actual recorded time', formatActualTimeRange(sessionData) || 'Not recorded'],
            ['Planned duration', `${sessionData.plannedDurationMinutes || sessionData.durationMinutes || 0} min`],
            ['Actual duration', `${durationBound} min`],
            ['Session type', sessionTypeLabel],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="block text-[9px] font-black uppercase text-zinc-500">{label}</span>
              <span className="mt-1 block text-xs font-black text-zinc-955 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
        {sessionData.coachNotes && (
          <p className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {sessionData.coachNotes}
          </p>
        )}
      </div>

      {/* Main Grid split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Comparison: Targets vs Achievement (Radar Chart) */}
        <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-205 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icons.Target className="h-5 w-5 text-brand-blue" />
                <h3 className="font-extrabold text-base text-zinc-850 dark:text-zinc-200">
                  Target Constraints vs Actual Achievement
                </h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold">
                Layered radar index
              </span>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ClientOnly>
                <RechartsResponsiveContainer width="100%" height="100%">
                  <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarComparisonData}>
                  <RechartsPolarGrid stroke="var(--zinc-300)" />
                  <RechartsPolarAngleAxis 
                    dataKey="metric" 
                    stroke="var(--zinc-550)" 
                    fontSize={10} 
                  />
                  <RechartsPolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    stroke="var(--zinc-300)" 
                    fontSize={8} 
                    tick={false}
                  />
                  <RechartsRadar 
                    name="Target Constraints" 
                    dataKey="Target" 
                    stroke="#155EEF" 
                    fill="#155EEF" 
                    fillOpacity={0.15} 
                  />
                  <RechartsRadar 
                    name="Actual Achievement" 
                    dataKey="Achievement" 
                    stroke="#06B6D4" 
                    fill="#06B6D4" 
                    fillOpacity={0.4} 
                  />
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--zinc-100)', 
                      borderColor: 'var(--zinc-200)',
                      borderRadius: '12px',
                      color: 'var(--zinc-950)',
                      fontSize: '11px'
                    }}
                  />
                  <RechartsLegend 
                    wrapperStyle={{ 
                      fontSize: '10px', 
                      paddingTop: '10px' 
                    }} 
                  />
                  </RechartsRadarChart>
                </RechartsResponsiveContainer>
              </ClientOnly>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-550 dark:text-zinc-400 flex items-center space-x-1.5">
            <Icons.Info className="h-4 w-4 text-zinc-555" />
            <span>Scores normalized out of 100. Workload indicators are review prompts only, not a medical assessment.</span>
          </div>
        </div>

        {/* Reflection Notes Card & Training Details */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-extrabold text-base text-zinc-850 dark:text-zinc-200">
                Reflections & Notes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Write coach notes for the local demo session summary.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Training Session Notes</label>
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  rows={6}
                  placeholder="Record squad workload thresholds, drill effectiveness, and session observations..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-blue rounded-xl p-3.5 text-xs text-zinc-950 dark:text-white focus:outline-none font-semibold resize-none leading-relaxed"
                />
              </div>

              <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 animate-in fade-in">
                <h4 className="text-[10px] font-black text-zinc-650">Quick Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'High Intensity', 
                    'Target Met', 
                    'Review Load Flag', 
                    'Monitor Trend'
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCoachNotes((prev) => prev + ` [${tag}] `)}
                      className="px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-[9px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-[9px] text-zinc-500 leading-normal">
              Notes are saved locally for this browser demo. Review load flags as coaching prompts, not medical guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Roster Detailed Performance Breakdown */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3.5 mb-4">
          <h3 className="font-extrabold text-base text-zinc-850 dark:text-zinc-200">
            Session Summary Log: {sessionData.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Recorded metrics across active player trackers in this demo session.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-950 p-4.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 block">Sync date</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">{formatSessionDate(sessionData.sessionDate || sessionData.date)}</span>
          </div>

          <div className="bg-white dark:bg-zinc-955 p-4.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 block">Tracked squad avg distance</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">{avgDistance} meters</span>
          </div>

          <div className="bg-white dark:bg-zinc-955 p-4.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 block">Total High-speed sprints</span>
            <span className="text-xl font-black text-amber-500 mt-1 block">{totalSprints} Runs</span>
          </div>

          <div className="bg-white dark:bg-zinc-955 p-4.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-500 block">Average peak velocity</span>
            <span className="text-xl font-black text-zinc-950 dark:text-white mt-1 block">{avgMaxSpeed} m/s</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500 bg-zinc-100/40 dark:bg-zinc-955/50">
                <th className="pb-3 pl-2 py-4 text-zinc-700 dark:text-zinc-300">Athlete Name</th>
                <th className="pb-3 text-right py-4 text-zinc-700 dark:text-zinc-300">Distance (m)</th>
                <th className="pb-3 text-right py-4 text-zinc-700 dark:text-zinc-300">Peak Velocity (m/s)</th>
                <th className="pb-3 text-right py-4 text-zinc-700 dark:text-zinc-300">Sprint Efforts</th>
                <th className="pb-3 text-right py-4 text-zinc-700 dark:text-zinc-300">Workload Index</th>
                <th className="pb-3 text-right pr-6 py-4 text-zinc-700 dark:text-zinc-300">Workload Review Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
              {reviewMetrics.map((player: any, idx: number) => {
                const scaledDist = Math.round(player.distanceMeters * cropScaleFactor);
                const scaledSprints = Math.round(player.sprintCount * cropScaleFactor);
                const scaledWorkload = Math.round(player.workloadIndex * cropScaleFactor);
                const playerTarget = sessionData.individualTargets?.[player.athleteId] || sessionData.squadTargets || sessionData.squadTarget;
                
                const targetDistance = playerTarget?.distanceMeters || 6500;
                const targetSprints = playerTarget?.sprintCount || 12;
                const targetMaxSpeed = playerTarget?.maxSpeedMps || 8.5;
                const targetWorkload = playerTarget?.workloadIndex || 80;

                const distDiff = scaledDist - targetDistance;
                const sprintsDiff = scaledSprints - targetSprints;
                const speedDiff = Math.round((player.maxSpeedMps - targetMaxSpeed) * 10) / 10;
                const workloadDiff = scaledWorkload - targetWorkload;

                const distPct = getTargetProgress(scaledDist, targetDistance);
                const sprintsPct = getTargetProgress(scaledSprints, targetSprints);
                const speedPct = getTargetProgress(player.maxSpeedMps, targetMaxSpeed);
                const workloadPct = getTargetProgress(scaledWorkload, targetWorkload);

                const distStatus = scaledDist >= targetDistance ? 'Above target' : 'Below target';
                const sprintsStatus = scaledSprints >= targetSprints ? 'Target met' : 'Below target';
                const speedStatus = player.maxSpeedMps >= targetMaxSpeed ? 'Target met' : 'Below target';
                const workloadStatus = scaledWorkload >= targetWorkload ? 'Above planned load' : 'Below plan';

                // Specific reason-based warning check
                let reviewReason = 'On target';
                let isOptimal = true;
                if (player.acwr >= 1.3) {
                  reviewReason = `ACWR review: ${player.acwr.toFixed(2)} above demo review range`;
                  isOptimal = false;
                } else if (scaledWorkload >= targetWorkload + 15) {
                  reviewReason = `Workload above planned load: +${scaledWorkload - targetWorkload}`;
                  isOptimal = false;
                } else if (scaledDist < targetDistance * 0.7) {
                  reviewReason = `Distance below target: ${distDiff}m`;
                  isOptimal = false;
                } else if (scaledSprints < targetSprints - 3) {
                  reviewReason = `High-speed efforts below target: ${sprintsDiff}`;
                  isOptimal = false;
                }

                return (
                  <tr key={idx} className="hover:bg-zinc-100/40 dark:hover:bg-zinc-955/40 transition-colors">
                    <td className="py-4 pl-2 font-black text-zinc-950 dark:text-white">
                      <div>{player.athleteName}</div>
                      <span className="text-[9px] text-zinc-500 font-bold block mt-0.5">
                        Configured: {speedThreshold} m/s
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200">
                        {scaledDist}m <span className="text-zinc-400 font-semibold">/ {targetDistance}m</span>
                      </div>
                      <span className={`text-[9px] font-bold ${distDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {distDiff >= 0 ? `+${distDiff}m` : `${distDiff}m`} • {distPct}% • {distStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200">
                        {player.maxSpeedMps.toFixed(1)} m/s <span className="text-zinc-400 font-semibold">/ {targetMaxSpeed} m/s</span>
                      </div>
                      <span className={`text-[9px] font-bold ${speedDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {speedDiff >= 0 ? `+${speedDiff} m/s` : `${speedDiff} m/s`} • {speedPct}% • {speedStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200">
                        {scaledSprints} <span className="text-zinc-400 font-semibold">/ {targetSprints} efforts</span>
                      </div>
                      <span className={`text-[9px] font-bold ${sprintsDiff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {sprintsDiff >= 0 ? `+${sprintsDiff}` : sprintsDiff} • {sprintsPct}% • {sprintsStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200">
                        {scaledWorkload} <span className="text-zinc-400 font-semibold">/ {targetWorkload}</span>
                      </div>
                      <span className={`text-[9px] font-bold ${workloadDiff >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {workloadDiff >= 0 ? `+${workloadDiff}` : workloadDiff} • {workloadPct}% • {workloadStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-6">
                      <span className={`font-black px-2.5 py-1 rounded text-[10px] border ${
                        isOptimal
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : reviewReason.includes('above')
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {reviewReason}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-3.5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-550 dark:text-zinc-450 space-y-1">
          <p>
            * High-speed efforts in this SSP demo are counted above the SSP-configured speed threshold, for example {speedThreshold} m/s where configured. This threshold is demo-configured and should be adjustable by sport, age group/level, position, and session type. It is not a universal sprint definition.
          </p>
          <p>
            * ACWR-style values may be shown as demo-configured workload review indicators. Where the demo uses a range such as 0.8–1.3, label it as a configurable coach-review range, not a medical standard, injury-risk threshold, or forecasting model.
          </p>
          <p className="italic">
            * These are coach-review prompts, not medical assessments or clinical diagnoses.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white dark:bg-zinc-950 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-555">
              <Icons.CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-950 dark:text-white">
                {actionType === 'save' && 'Session Review Saved'}
                {actionType === 'export' && 'PDF Export Compiled'}
                {actionType === 'sync' && 'Cloud Roster Synchronised'}
              </h4>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-normal mt-1">
                {actionType === 'save' && 'Session review saved successfully.'}
                {actionType === 'export' && 'Performance charts, player tables, and notes exported to CSV/PDF.'}
                {actionType === 'sync' && 'Session summary shared with the team demo.'}
              </p>
            </div>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-zinc-500 hover:text-zinc-700 transition-colors p-1"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay spinner for actions */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl text-center max-w-xs space-y-4 shadow-2xl">
            <Icons.Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto" />
            <h4 className="text-xs font-black text-zinc-950 dark:text-white">
              {actionType === 'save' && 'Saving session review...'}
              {actionType === 'export' && 'Compiling pdf workbook...'}
              {actionType === 'sync' && 'Preparing team summary...'}
            </h4>
            <p className="text-[10px] text-zinc-500">Saving session review, please stand by...</p>
          </div>
        </div>
      )}

    </div>
  );
}
