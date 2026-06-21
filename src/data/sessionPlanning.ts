import { mockPlayers, Player } from './mockPlayers';

export const DEMO_ATHLETE_ID = '1';

export type PlannedSessionType = 'training' | 'match';
export type PlannedSessionStatus = 'planned' | 'active' | 'completed';
export type SessionAchievementLabel =
  | 'Below target'
  | 'Building'
  | 'On target'
  | 'Above target'
  | 'Review prompt';

export interface PlannedSessionTarget {
  distanceMeters: number;
  durationMinutes: number;
  maxSpeedMps: number;
  workloadIndex: number;
  sprintCount: number;
  sprintEffortThresholdMps?: number;
}

export interface PlannedSessionConfig {
  id: string;
  title: string;
  description: string;
  duration: number;
  plannedDurationMinutes: number;
  intensity: number;
  sessionType: PlannedSessionType;
  sessionCategory: string;
  sessionDate: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  actualDurationMinutes?: number;
  sport: string;
  ageGroup: string;
  level: string;
  selectedPlayerIds: string[];
  squadTarget: PlannedSessionTarget;
  squadTargets: PlannedSessionTarget;
  individualTargets: Record<string, PlannedSessionTarget>;
  objectives: string;
  sessionObjectives: string;
  coachNotes: string;
  isActive: boolean;
  startTime: string;
  distanceClassification?: string;
  createdAt: string;
  status: PlannedSessionStatus;
}

export interface AthleteSessionMetric {
  athleteId: string;
  athleteName: string;
  distanceMeters: number;
  maxSpeedMps: number;
  sprintCount: number;
  workloadIndex: number;
  acwr: number;
}

export interface CompletedSessionSummary {
  id?: string;
  title: string;
  date: string;
  sessionDate?: string;
  plannedStartTime?: string;
  plannedEndTime?: string;
  plannedDurationMinutes?: number;
  actualStartTime?: string;
  actualEndTime?: string;
  actualDurationMinutes?: number;
  durationMinutes: number;
  totalDistanceMeters: number;
  intensityScore: number;
  type: PlannedSessionType;
  sessionType?: PlannedSessionType;
  sessionCategory?: string;
  sport?: string;
  ageGroup?: string;
  level?: string;
  objectives?: string;
  sessionObjectives?: string;
  coachNotes?: string;
  squadTarget: PlannedSessionTarget;
  squadTargets?: PlannedSessionTarget;
  individualTargets: Record<string, PlannedSessionTarget>;
  athleteMetrics: AthleteSessionMetric[];
  distanceClassification?: string;
  status?: PlannedSessionStatus;
}

export const defaultSessionTarget: PlannedSessionTarget = {
  distanceMeters: 6500,
  durationMinutes: 75,
  maxSpeedMps: 8.5,
  workloadIndex: 80,
  sprintCount: 12,
  sprintEffortThresholdMps: 5.5,
};

export const getDemoAthlete = () =>
  mockPlayers.find((player) => player.id === DEMO_ATHLETE_ID) || mockPlayers[0];

export const getTargetForAthlete = (
  config: Partial<PlannedSessionConfig> | null | undefined,
  athleteId = DEMO_ATHLETE_ID
): PlannedSessionTarget => ({
  ...defaultSessionTarget,
  ...(config?.squadTarget || {}),
  ...(config?.individualTargets?.[athleteId] || {}),
});

export const getTargetProgress = (current: number, target: number) => {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

export const getActualVsExpectedPercent = (actual: number, expected: number) => {
  if (!expected || expected <= 0) return 0;
  return Math.round((actual / expected) * 100);
};

export const classifyActualVsExpected = (
  actual: number,
  expected: number,
  reviewAtPercent = 120
): SessionAchievementLabel => {
  const pct = getActualVsExpectedPercent(actual, expected);
  if (pct >= reviewAtPercent) return 'Review prompt';
  if (pct >= 105) return 'Above target';
  if (pct >= 90) return 'On target';
  if (pct >= 70) return 'Building';
  return 'Below target';
};

export const getLoadFlag = (player: Pick<Player, 'acwr' | 'workload'>) => {
  if (player.acwr >= 1.5 || player.workload >= 95) {
    return {
      label: 'Load flag',
      detail: 'Coach review recommended',
      tone: 'rose' as const,
    };
  }

  if (player.acwr >= 1.3 || player.workload >= 88) {
    return {
      label: 'Load flag',
      detail: 'Monitor trend',
      tone: 'amber' as const,
    };
  }

  return {
    label: 'Tracking normally',
    detail: 'No review prompt',
    tone: 'emerald' as const,
  };
};

export const formatSessionType = (type: string | undefined) =>
  type === 'match' || type === 'Match Play' ? 'Match' : 'Training';

export const isAthleteAssignedToSession = (
  config: Partial<PlannedSessionConfig> | null | undefined,
  athleteId = DEMO_ATHLETE_ID
) => !!config?.selectedPlayerIds?.includes(athleteId);
