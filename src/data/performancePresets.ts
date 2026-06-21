import { PlannedSessionTarget, PlannedSessionType } from './sessionPlanning';

export interface PerformancePreset {
  id: string;
  name: string;
  sport: string;
  ageGroup: string;
  level: string;
  positionGroup: string;
  position?: string;
  sessionType: PlannedSessionType;
  distanceTargetRangeMeters: [number, number];
  sprintEffortTarget: number;
  sprintEffortThresholdMps: number;
  maxSpeedTargetMps: number;
  workloadReviewRange: [number, number];
  durationTargetMinutes: number;
  target: PlannedSessionTarget;
}

export const performancePresets: PerformancePreset[] = [
  {
    id: 'football-u18-forward-training',
    name: 'Football U18 Forward Training',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    positionGroup: 'Forward',
    position: 'Forward',
    sessionType: 'training',
    distanceTargetRangeMeters: [6000, 7500],
    sprintEffortTarget: 14,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 8.7,
    workloadReviewRange: [70, 88],
    durationTargetMinutes: 75,
    target: {
      distanceMeters: 6800,
      sprintCount: 14,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 8.7,
      workloadIndex: 82,
      durationMinutes: 75,
    },
  },
  {
    id: 'football-u18-midfielder-training',
    name: 'Football U18 Midfielder Training',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    positionGroup: 'Midfielder',
    position: 'Midfielder',
    sessionType: 'training',
    distanceTargetRangeMeters: [7000, 9000],
    sprintEffortTarget: 12,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 8.2,
    workloadReviewRange: [72, 90],
    durationTargetMinutes: 75,
    target: {
      distanceMeters: 7800,
      sprintCount: 12,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 8.2,
      workloadIndex: 84,
      durationMinutes: 75,
    },
  },
  {
    id: 'football-open-match',
    name: 'Football Open Match',
    sport: 'Football',
    ageGroup: 'Open',
    level: 'Club',
    positionGroup: 'Outfield',
    sessionType: 'match',
    distanceTargetRangeMeters: [7500, 10500],
    sprintEffortTarget: 18,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 9,
    workloadReviewRange: [80, 95],
    durationTargetMinutes: 90,
    target: {
      distanceMeters: 8500,
      sprintCount: 18,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 9,
      workloadIndex: 88,
      durationMinutes: 90,
    },
  },
  {
    id: 'football-u18-defender-training',
    name: 'Football U18 Defender Training',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    positionGroup: 'Defender',
    position: 'Defender',
    sessionType: 'training',
    distanceTargetRangeMeters: [5200, 7000],
    sprintEffortTarget: 10,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 8.2,
    workloadReviewRange: [65, 84],
    durationTargetMinutes: 75,
    target: {
      distanceMeters: 6200,
      sprintCount: 10,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 8.2,
      workloadIndex: 74,
      durationMinutes: 75,
    },
  },
  {
    id: 'football-u18-goalkeeper-training',
    name: 'Football U18 Goalkeeper Training',
    sport: 'Football',
    ageGroup: 'U18',
    level: 'Academy',
    positionGroup: 'Goalkeeper',
    position: 'Goalkeeper',
    sessionType: 'training',
    distanceTargetRangeMeters: [1800, 3200],
    sprintEffortTarget: 2,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 6.4,
    workloadReviewRange: [25, 45],
    durationTargetMinutes: 75,
    target: {
      distanceMeters: 2600,
      sprintCount: 2,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 6.4,
      workloadIndex: 38,
      durationMinutes: 75,
    },
  },
  {
    id: 'football-open-forward-match',
    name: 'Football Open Forward Match',
    sport: 'Football',
    ageGroup: 'Open',
    level: 'Club',
    positionGroup: 'Forward',
    position: 'Forward',
    sessionType: 'match',
    distanceTargetRangeMeters: [7800, 9800],
    sprintEffortTarget: 20,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 9.1,
    workloadReviewRange: [82, 96],
    durationTargetMinutes: 90,
    target: {
      distanceMeters: 8800,
      sprintCount: 20,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 9.1,
      workloadIndex: 90,
      durationMinutes: 90,
    },
  },
  {
    id: 'football-open-midfielder-match',
    name: 'Football Open Midfielder Match',
    sport: 'Football',
    ageGroup: 'Open',
    level: 'Club',
    positionGroup: 'Midfielder',
    position: 'Midfielder',
    sessionType: 'match',
    distanceTargetRangeMeters: [8500, 11000],
    sprintEffortTarget: 16,
    sprintEffortThresholdMps: 5.5,
    maxSpeedTargetMps: 8.4,
    workloadReviewRange: [84, 98],
    durationTargetMinutes: 90,
    target: {
      distanceMeters: 9600,
      sprintCount: 16,
      sprintEffortThresholdMps: 5.5,
      maxSpeedMps: 8.4,
      workloadIndex: 92,
      durationMinutes: 90,
    },
  },
];

export const findPerformancePreset = (params: {
  sport?: string;
  ageGroup?: string;
  level?: string;
  position?: string;
  sessionType?: PlannedSessionType;
}) => {
  const sessionType = params.sessionType || 'training';
  return (
    performancePresets.find(
      (preset) =>
        preset.sessionType === sessionType &&
        preset.position === params.position &&
        (preset.ageGroup === params.ageGroup || preset.level === params.level)
    ) ||
    performancePresets.find(
      (preset) =>
        preset.sessionType === sessionType &&
        (preset.positionGroup === params.position || preset.positionGroup === 'Outfield')
    ) ||
    performancePresets.find((preset) => preset.sessionType === sessionType)
  );
};
