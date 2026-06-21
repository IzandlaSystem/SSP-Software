import { mockPlayers } from './mockPlayers';
import {
  CompletedSessionSummary,
  DEMO_ATHLETE_ID,
  PlannedSessionConfig,
  PlannedSessionTarget,
  defaultSessionTarget,
  isAthleteAssignedToSession,
} from './sessionPlanning';

export const ACTIVE_SESSION_CONFIG_KEY = 'active_session_config';
export const ACTIVE_SESSIONS_LIST_KEY = 'active_sessions_list';
export const COMPLETED_SESSION_KEY = 'last_completed_session';
export const COMPLETED_SESSIONS_HISTORY_KEY = 'completed_sessions_history';
export const SELECTED_COMPLETED_SESSION_ID_KEY = 'selected_completed_session_id';
export const SESSIONS_INITIALIZED_KEY = 'ssp_sessions_initialized';

const nowIso = () => new Date().toISOString();

const target = (overrides: Partial<PlannedSessionTarget> = {}): PlannedSessionTarget => ({
  ...defaultSessionTarget,
  ...overrides,
});

export const demoActiveSessions: PlannedSessionConfig[] = [
  {
    id: 'sess-demo-training-2026-05-27',
    title: 'Squad Attacking Drills (Pitch A)',
    description: 'High-intensity press and transition rondo on Pitch A.',
    duration: 75,
    plannedDurationMinutes: 75,
    intensity: 80,
    sessionType: 'training',
    sessionCategory: 'Attacking transition',
    sessionDate: '2026-05-27',
    plannedStartTime: '15:30',
    plannedEndTime: '16:45',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    selectedPlayerIds: ['1', '2', '3', '5'],
    squadTarget: target({ distanceMeters: 6500, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    squadTargets: target({ distanceMeters: 6500, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    individualTargets: {
      '1': target({ distanceMeters: 6900, sprintCount: 14, maxSpeedMps: 8.7, workloadIndex: 82 }),
      '5': target({ distanceMeters: 7600, sprintCount: 12, maxSpeedMps: 8.1, workloadIndex: 84 }),
    },
    objectives: 'Counter-pressing response and high-speed recovery runs.',
    sessionObjectives: 'Counter-pressing response and high-speed recovery runs.',
    coachNotes: 'Demo-configured thresholds for coach review only.',
    isActive: true,
    startTime: '2026-05-27T15:30:00.000Z',
    distanceClassification: 'Standard Distance (5000m - 7500m)',
    createdAt: '2026-05-26T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'sess-demo-match-2026-05-29',
    title: 'Conditioning & Sprints (Pitch B)',
    description: 'High-velocity threshold repeats and match-speed recovery intervals.',
    duration: 90,
    plannedDurationMinutes: 90,
    intensity: 85,
    sessionType: 'match',
    sessionCategory: 'Match simulation',
    sessionDate: '2026-05-29',
    plannedStartTime: '18:00',
    plannedEndTime: '19:30',
    sport: 'Football',
    ageGroup: 'Open',
    level: 'Club',
    selectedPlayerIds: ['1', '4', '6', '8'],
    squadTarget: target({ distanceMeters: 8000, sprintCount: 15, maxSpeedMps: 9, workloadIndex: 85, durationMinutes: 90 }),
    squadTargets: target({ distanceMeters: 8000, sprintCount: 15, maxSpeedMps: 9, workloadIndex: 85, durationMinutes: 90 }),
    individualTargets: {
      '1': target({ distanceMeters: 8600, sprintCount: 20, maxSpeedMps: 9, workloadIndex: 88, durationMinutes: 90 }),
      '7': target({ distanceMeters: 3200, sprintCount: 2, maxSpeedMps: 6.4, workloadIndex: 38, durationMinutes: 90 }),
    },
    objectives: 'Match-speed conditioning with configured high-speed effort thresholds.',
    sessionObjectives: 'Match-speed conditioning with configured high-speed effort thresholds.',
    coachNotes: 'Sprint efforts are counted above the configured high-speed threshold.',
    isActive: true,
    startTime: '2026-05-29T18:00:00.000Z',
    distanceClassification: 'High Volume (>7500m)',
    createdAt: '2026-05-26T10:05:00.000Z',
    status: 'active',
  },
];

export const demoCompletedSessions: CompletedSessionSummary[] = [
  {
    id: 'sess-demo-completed-2026-06-18-match',
    title: 'Match Play A-Team: High-Speed Review',
    date: '2026-06-18',
    sessionDate: '2026-06-18',
    plannedStartTime: '18:00',
    plannedEndTime: '19:30',
    plannedDurationMinutes: 90,
    actualStartTime: '2026-06-18T18:03:00.000Z',
    actualEndTime: '2026-06-18T19:33:00.000Z',
    actualDurationMinutes: 90,
    durationMinutes: 90,
    totalDistanceMeters: 60750,
    intensityScore: 88,
    type: 'match',
    sessionType: 'match',
    sessionCategory: 'Match simulation',
    sport: 'Football',
    ageGroup: 'Open',
    level: 'Club',
    objectives: 'Match-speed movement patterns and configured high-speed effort review.',
    sessionObjectives: 'Match-speed movement patterns and configured high-speed effort review.',
    coachNotes: 'Use as a coach-review benchmark. Not a medical assessment or forecasting model.',
    squadTarget: target({ distanceMeters: 8500, sprintCount: 18, maxSpeedMps: 9, workloadIndex: 88, durationMinutes: 90 }),
    squadTargets: target({ distanceMeters: 8500, sprintCount: 18, maxSpeedMps: 9, workloadIndex: 88, durationMinutes: 90 }),
    individualTargets: {
      '1': target({ distanceMeters: 8800, sprintCount: 20, maxSpeedMps: 9.1, workloadIndex: 90, durationMinutes: 90 }),
      '2': target({ distanceMeters: 9600, sprintCount: 16, maxSpeedMps: 8.4, workloadIndex: 92, durationMinutes: 90 }),
      '7': target({ distanceMeters: 3000, sprintCount: 2, maxSpeedMps: 6.4, workloadIndex: 38, durationMinutes: 90 }),
    },
    athleteMetrics: [
      { athleteId: '1', athleteName: 'Marcus Vane', distanceMeters: 8950, maxSpeedMps: 9.0, sprintCount: 21, workloadIndex: 91, acwr: 1.18 },
      { athleteId: '2', athleteName: 'Lucas Sterling', distanceMeters: 9700, maxSpeedMps: 8.2, sprintCount: 16, workloadIndex: 97, acwr: 1.38 },
      { athleteId: '3', athleteName: 'Trent Alexander', distanceMeters: 7900, maxSpeedMps: 8.5, sprintCount: 17, workloadIndex: 84, acwr: 0.94 },
      { athleteId: '4', athleteName: 'Christian Benteke', distanceMeters: 5600, maxSpeedMps: 7.4, sprintCount: 8, workloadIndex: 66, acwr: 0.76 },
      { athleteId: '5', athleteName: 'Declan Rice', distanceMeters: 10650, maxSpeedMps: 8.2, sprintCount: 20, workloadIndex: 95, acwr: 1.16 },
      { athleteId: '6', athleteName: 'Virgil van Dijk', distanceMeters: 7350, maxSpeedMps: 8.5, sprintCount: 12, workloadIndex: 78, acwr: 0.97 },
      { athleteId: '7', athleteName: 'Alisson Becker', distanceMeters: 3150, maxSpeedMps: 6.2, sprintCount: 1, workloadIndex: 35, acwr: 0.82 },
      { athleteId: '8', athleteName: 'Son Heung-min', distanceMeters: 9450, maxSpeedMps: 9.2, sprintCount: 25, workloadIndex: 99, acwr: 1.44 },
    ],
    distanceClassification: 'High Volume (>7500m)',
    status: 'completed',
  },
  {
    id: 'sess-demo-completed-2026-06-16-training',
    title: 'Training High-Press Transition',
    date: '2026-06-16',
    sessionDate: '2026-06-16',
    plannedStartTime: '15:00',
    plannedEndTime: '16:15',
    plannedDurationMinutes: 75,
    actualStartTime: '2026-06-16T15:04:00.000Z',
    actualEndTime: '2026-06-16T16:19:00.000Z',
    actualDurationMinutes: 75,
    durationMinutes: 75,
    totalDistanceMeters: 51400,
    intensityScore: 82,
    type: 'training',
    sessionType: 'training',
    sessionCategory: 'High press transition',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    objectives: 'High-speed recovery runs and target progress review.',
    sessionObjectives: 'High-speed recovery runs and target progress review.',
    coachNotes: 'Sprint efforts counted above the configured high-speed threshold.',
    squadTarget: target({ distanceMeters: 6800, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    squadTargets: target({ distanceMeters: 6800, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    individualTargets: {
      '1': target({ distanceMeters: 7000, sprintCount: 15, maxSpeedMps: 8.8, workloadIndex: 84 }),
      '5': target({ distanceMeters: 8000, sprintCount: 12, maxSpeedMps: 8.2, workloadIndex: 84 }),
    },
    athleteMetrics: [
      { athleteId: '1', athleteName: 'Marcus Vane', distanceMeters: 7050, maxSpeedMps: 8.7, sprintCount: 15, workloadIndex: 84, acwr: 1.12 },
      { athleteId: '2', athleteName: 'Lucas Sterling', distanceMeters: 8350, maxSpeedMps: 7.9, sprintCount: 10, workloadIndex: 92, acwr: 1.45 },
      { athleteId: '3', athleteName: 'Trent Alexander', distanceMeters: 6200, maxSpeedMps: 8.2, sprintCount: 11, workloadIndex: 73, acwr: 0.96 },
      { athleteId: '5', athleteName: 'Declan Rice', distanceMeters: 8850, maxSpeedMps: 8.0, sprintCount: 14, workloadIndex: 86, acwr: 1.18 },
      { athleteId: '6', athleteName: 'Virgil van Dijk', distanceMeters: 5950, maxSpeedMps: 8.4, sprintCount: 10, workloadIndex: 70, acwr: 1.01 },
      { athleteId: '8', athleteName: 'Son Heung-min', distanceMeters: 7800, maxSpeedMps: 8.8, sprintCount: 19, workloadIndex: 94, acwr: 1.35 },
    ],
    distanceClassification: 'Standard Distance (5000m - 7500m)',
    status: 'completed',
  },
  {
    id: 'sess-demo-completed-2026-06-14-speed',
    title: 'Speed Block: Configured Threshold Efforts',
    date: '2026-06-14',
    sessionDate: '2026-06-14',
    plannedStartTime: '10:00',
    plannedEndTime: '11:00',
    plannedDurationMinutes: 60,
    actualStartTime: '2026-06-14T10:01:00.000Z',
    actualEndTime: '2026-06-14T11:02:00.000Z',
    actualDurationMinutes: 61,
    durationMinutes: 61,
    totalDistanceMeters: 38550,
    intensityScore: 78,
    type: 'training',
    sessionType: 'training',
    sessionCategory: 'Speed block',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    objectives: 'Configured high-speed threshold efforts and max velocity review.',
    sessionObjectives: 'Configured high-speed threshold efforts and max velocity review.',
    coachNotes: 'Demo-configured threshold values only.',
    squadTarget: target({ distanceMeters: 5600, sprintCount: 16, maxSpeedMps: 8.7, workloadIndex: 76, durationMinutes: 60 }),
    squadTargets: target({ distanceMeters: 5600, sprintCount: 16, maxSpeedMps: 8.7, workloadIndex: 76, durationMinutes: 60 }),
    individualTargets: {
      '1': target({ distanceMeters: 5900, sprintCount: 18, maxSpeedMps: 9, workloadIndex: 80, durationMinutes: 60 }),
      '8': target({ distanceMeters: 6100, sprintCount: 20, maxSpeedMps: 9.1, workloadIndex: 82, durationMinutes: 60 }),
    },
    athleteMetrics: [
      { athleteId: '1', athleteName: 'Marcus Vane', distanceMeters: 6100, maxSpeedMps: 9.0, sprintCount: 20, workloadIndex: 82, acwr: 1.08 },
      { athleteId: '2', athleteName: 'Lucas Sterling', distanceMeters: 5900, maxSpeedMps: 8.1, sprintCount: 12, workloadIndex: 79, acwr: 1.26 },
      { athleteId: '3', athleteName: 'Trent Alexander', distanceMeters: 5400, maxSpeedMps: 8.4, sprintCount: 15, workloadIndex: 72, acwr: 0.92 },
      { athleteId: '4', athleteName: 'Christian Benteke', distanceMeters: 3900, maxSpeedMps: 7.6, sprintCount: 7, workloadIndex: 58, acwr: 0.74 },
      { athleteId: '8', athleteName: 'Son Heung-min', distanceMeters: 6900, maxSpeedMps: 9.2, sprintCount: 22, workloadIndex: 88, acwr: 1.29 },
    ],
    distanceClassification: 'Standard Distance (5000m - 7500m)',
    status: 'completed',
  },
  {
    id: 'sess-demo-completed-2026-06-12-recovery',
    title: 'Recovery Run: Technical Reset',
    date: '2026-06-12',
    sessionDate: '2026-06-12',
    plannedStartTime: '09:30',
    plannedEndTime: '10:15',
    plannedDurationMinutes: 45,
    actualStartTime: '2026-06-12T09:32:00.000Z',
    actualEndTime: '2026-06-12T10:17:00.000Z',
    actualDurationMinutes: 45,
    durationMinutes: 45,
    totalDistanceMeters: 27600,
    intensityScore: 46,
    type: 'training',
    sessionType: 'training',
    sessionCategory: 'Recovery run',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    objectives: 'Lower-volume movement review and target reset.',
    sessionObjectives: 'Lower-volume movement review and target reset.',
    coachNotes: 'Low-volume coach review session, not a medical assessment.',
    squadTarget: target({ distanceMeters: 4200, sprintCount: 2, maxSpeedMps: 5.2, workloadIndex: 46, durationMinutes: 45 }),
    squadTargets: target({ distanceMeters: 4200, sprintCount: 2, maxSpeedMps: 5.2, workloadIndex: 46, durationMinutes: 45 }),
    individualTargets: {
      '7': target({ distanceMeters: 1600, sprintCount: 0, maxSpeedMps: 4, workloadIndex: 22, durationMinutes: 45 }),
    },
    athleteMetrics: [
      { athleteId: '1', athleteName: 'Marcus Vane', distanceMeters: 4100, maxSpeedMps: 5.0, sprintCount: 1, workloadIndex: 42, acwr: 0.98 },
      { athleteId: '2', athleteName: 'Lucas Sterling', distanceMeters: 4550, maxSpeedMps: 4.8, sprintCount: 1, workloadIndex: 48, acwr: 1.12 },
      { athleteId: '3', athleteName: 'Trent Alexander', distanceMeters: 3950, maxSpeedMps: 4.9, sprintCount: 0, workloadIndex: 39, acwr: 0.88 },
      { athleteId: '5', athleteName: 'Declan Rice', distanceMeters: 4700, maxSpeedMps: 5.1, sprintCount: 1, workloadIndex: 47, acwr: 1.04 },
      { athleteId: '7', athleteName: 'Alisson Becker', distanceMeters: 1550, maxSpeedMps: 3.7, sprintCount: 0, workloadIndex: 20, acwr: 0.78 },
    ],
    distanceClassification: 'Low Volume (<5000m)',
    status: 'completed',
  },
  {
    id: 'sess-demo-completed-2026-05-24',
    title: 'Matchday Prep & Transition Rondo',
    date: '2026-05-24',
    sessionDate: '2026-05-24',
    plannedStartTime: '16:00',
    plannedEndTime: '17:15',
    plannedDurationMinutes: 75,
    actualStartTime: '2026-05-24T16:02:00.000Z',
    actualEndTime: '2026-05-24T17:18:00.000Z',
    actualDurationMinutes: 76,
    durationMinutes: 76,
    totalDistanceMeters: 49000,
    intensityScore: 82,
    type: 'training',
    sessionType: 'training',
    sessionCategory: 'Transition rondo',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    objectives: 'High-speed counter-pressing rondo.',
    sessionObjectives: 'High-speed counter-pressing rondo.',
    coachNotes: 'Review load flags as coaching prompts only.',
    squadTarget: target({ distanceMeters: 6500, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    squadTargets: target({ distanceMeters: 6500, sprintCount: 12, maxSpeedMps: 8.5, workloadIndex: 80 }),
    individualTargets: {
      '1': target({ distanceMeters: 6800, sprintCount: 14, maxSpeedMps: 8.5, workloadIndex: 85 }),
    },
    athleteMetrics: mockPlayers.slice(0, 5).map((player) => ({
      athleteId: player.id,
      athleteName: player.name,
      distanceMeters: player.distance,
      maxSpeedMps: player.maxSpeed,
      sprintCount: player.sprintCount,
      workloadIndex: player.workload,
      acwr: player.acwr,
    })),
    distanceClassification: 'Standard Distance (5000m - 7500m)',
    status: 'completed',
  },
];

export const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const normalizeSessionConfig = (session: Partial<PlannedSessionConfig>): PlannedSessionConfig => {
  const squad = target(session.squadTargets || session.squadTarget);
  const plannedDuration = session.plannedDurationMinutes || session.duration || squad.durationMinutes;
  const createdAt = session.createdAt || nowIso();
  return {
    id: session.id || `sess-${Date.now()}`,
    title: session.title || 'Untitled Session',
    description: session.description || session.objectives || session.sessionObjectives || '',
    duration: plannedDuration,
    plannedDurationMinutes: plannedDuration,
    intensity: session.intensity || squad.workloadIndex,
    sessionType: session.sessionType === 'match' ? 'match' : 'training',
    sessionCategory: session.sessionCategory || (session.sessionType === 'match' ? 'Match simulation' : 'Training'),
    sessionDate: session.sessionDate || createdAt.slice(0, 10),
    plannedStartTime: session.plannedStartTime || '15:30',
    plannedEndTime: session.plannedEndTime || '16:45',
    actualStartTime: session.actualStartTime,
    actualEndTime: session.actualEndTime,
    actualDurationMinutes: session.actualDurationMinutes,
    sport: session.sport || 'Football',
    ageGroup: session.ageGroup || session.level || 'U18',
    level: session.level || 'Academy',
    selectedPlayerIds: session.selectedPlayerIds || [],
    squadTarget: squad,
    squadTargets: squad,
    individualTargets: session.individualTargets || {},
    objectives: session.objectives || session.sessionObjectives || session.description || '',
    sessionObjectives: session.sessionObjectives || session.objectives || session.description || '',
    coachNotes: session.coachNotes || '',
    isActive: session.isActive ?? session.status !== 'completed',
    startTime: session.startTime || session.actualStartTime || createdAt,
    distanceClassification: session.distanceClassification,
    createdAt,
    status: session.status || 'active',
  };
};

export const seedDemoSessionsIfNeeded = () => {
  if (typeof window === 'undefined') return [];
  const initialized = localStorage.getItem(SESSIONS_INITIALIZED_KEY) === 'true';
  const existing = readJson<PlannedSessionConfig[] | null>(ACTIVE_SESSIONS_LIST_KEY, null);
  if (existing) return existing.map(normalizeSessionConfig);
  if (initialized) return [];

  writeJson(ACTIVE_SESSIONS_LIST_KEY, demoActiveSessions);
  writeJson(COMPLETED_SESSIONS_HISTORY_KEY, demoCompletedSessions);
  writeJson(COMPLETED_SESSION_KEY, demoCompletedSessions[0]);
  localStorage.setItem(SESSIONS_INITIALIZED_KEY, 'true');
  return demoActiveSessions;
};

export const getActiveSessions = () => seedDemoSessionsIfNeeded();

export const setActiveSessionConfig = (session: PlannedSessionConfig) => {
  writeJson(ACTIVE_SESSION_CONFIG_KEY, normalizeSessionConfig(session));
};

export const getActiveSessionConfig = () => {
  const active = readJson<Partial<PlannedSessionConfig> | null>(ACTIVE_SESSION_CONFIG_KEY, null);
  if (active) return normalizeSessionConfig(active);
  const sessions = getActiveSessions();
  if (!sessions[0]) return null;
  setActiveSessionConfig(sessions[0]);
  return sessions[0];
};

export const getActiveSessionForAthlete = (athleteId = DEMO_ATHLETE_ID) => {
  const config = getActiveSessionConfig();
  return isAthleteAssignedToSession(config, athleteId) ? config : null;
};

export const upsertActiveSession = (session: PlannedSessionConfig) => {
  const normalized = normalizeSessionConfig(session);
  const list = getActiveSessions().filter((item) => item.id !== normalized.id);
  const next = [...list, normalized];
  writeJson(ACTIVE_SESSIONS_LIST_KEY, next);
  setActiveSessionConfig(normalized);
  if (typeof window !== 'undefined') localStorage.setItem(SESSIONS_INITIALIZED_KEY, 'true');
  return next;
};

export const removeActiveSession = (sessionId: string) => {
  const next = getActiveSessions().filter((session) => session.id !== sessionId);
  writeJson(ACTIVE_SESSIONS_LIST_KEY, next);
  const current = readJson<Partial<PlannedSessionConfig> | null>(ACTIVE_SESSION_CONFIG_KEY, null);
  if (current?.id === sessionId) {
    if (next[0]) setActiveSessionConfig(next[0]);
    else localStorage.removeItem(ACTIVE_SESSION_CONFIG_KEY);
  }
  if (typeof window !== 'undefined') localStorage.setItem(SESSIONS_INITIALIZED_KEY, 'true');
  return next;
};

export const markSessionActualStart = (sessionId: string, actualStartTime = nowIso()) => {
  const sessions = getActiveSessions();
  const targetSession = sessions.find((session) => session.id === sessionId);
  if (!targetSession) return null;
  const updated = normalizeSessionConfig({ ...targetSession, actualStartTime, startTime: actualStartTime });
  writeJson(
    ACTIVE_SESSIONS_LIST_KEY,
    sessions.map((session) => (session.id === sessionId ? updated : session))
  );
  setActiveSessionConfig(updated);
  return updated;
};

export const appendCompletedSession = (summary: CompletedSessionSummary) => {
  const history = readJson<CompletedSessionSummary[]>(COMPLETED_SESSIONS_HISTORY_KEY, []);
  const next = [summary, ...history.filter((session) => session.id !== summary.id)];
  writeJson(COMPLETED_SESSIONS_HISTORY_KEY, next);
  writeJson(COMPLETED_SESSION_KEY, summary);
  if (summary.id && typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_COMPLETED_SESSION_ID_KEY, summary.id);
  }
  if (typeof window !== 'undefined') localStorage.setItem(SESSIONS_INITIALIZED_KEY, 'true');
  return next;
};

export const getCompletedSessions = () => {
  let history = readJson<CompletedSessionSummary[]>(COMPLETED_SESSIONS_HISTORY_KEY, []);
  let latest = readJson<CompletedSessionSummary | null>(COMPLETED_SESSION_KEY, null);
  const initialized = typeof window !== 'undefined' && localStorage.getItem(SESSIONS_INITIALIZED_KEY) === 'true';
  if (!initialized && history.length === 0 && !latest) {
    seedDemoSessionsIfNeeded();
    history = readJson<CompletedSessionSummary[]>(COMPLETED_SESSIONS_HISTORY_KEY, []);
    latest = readJson<CompletedSessionSummary | null>(COMPLETED_SESSION_KEY, null);
  }
  const merged = latest ? [latest, ...history.filter((session) => session.id !== latest.id)] : history;
  return merged.filter((session) => !!session?.id);
};

export const getSelectedCompletedSessionId = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(SELECTED_COMPLETED_SESSION_ID_KEY) || '';
};

export const setSelectedCompletedSessionId = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_COMPLETED_SESSION_ID_KEY, sessionId);
};

export const formatClockTime = (value?: string) => {
  if (!value) return '';
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const formatSessionDate = (value?: string) => {
  if (!value) return 'No date recorded';
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatPlannedTimeRange = (session: Partial<CompletedSessionSummary | PlannedSessionConfig>) => {
  if (!session.plannedStartTime && !session.plannedEndTime) return 'Not planned';
  return `${session.plannedStartTime || '--:--'}-${session.plannedEndTime || '--:--'}`;
};

export const formatActualTimeRange = (session: Partial<CompletedSessionSummary | PlannedSessionConfig>) => {
  if (!session.actualStartTime && !session.actualEndTime) return '';
  return `${formatClockTime(session.actualStartTime) || '--:--'}-${formatClockTime(session.actualEndTime) || '--:--'}`;
};

export const getRecordedDurationMinutes = (
  start?: string,
  end?: string,
  fallbackMinutes = 0
) => {
  if (start && end) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && endTime >= startTime) {
      if (endTime === startTime) return 0;
      return Math.max(1, Math.ceil((endTime - startTime) / 60000));
    }
  }
  return Math.max(0, Math.round(fallbackMinutes || 0));
};

export const addMinutesToTime = (start?: string, minutes = 0) => {
  if (!start) return '';
  const base = /^\d{2}:\d{2}$/.test(start) ? new Date(`2026-01-01T${start}:00`) : new Date(start);
  if (Number.isNaN(base.getTime())) return '';
  base.setMinutes(base.getMinutes() + minutes);
  return formatClockTime(base.toISOString());
};
