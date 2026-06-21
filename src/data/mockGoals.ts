export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'Sprinting' | 'Distance' | 'Workload' | 'availability';
  status: 'On Track' | 'At Risk' | 'Achieved' | 'Behind';
  assignedTo: 'Squad' | string; // 'Squad' or Player ID
  deadline: string;
}

export const mockGoals: Goal[] = [
  {
    id: 'g-201',
    title: 'Squad Weekly High-Intensity Distance',
    description: 'Ensure the aggregate squad distance above high-speed threshold (5.5 m/s) matches training cycles.',
    targetValue: 25000,
    currentValue: 19800,
    unit: 'meters',
    category: 'Distance',
    status: 'On Track',
    assignedTo: 'Squad',
    deadline: '2026-05-31'
  },
  {
    id: 'g-202',
    title: 'Squad Weekly Sprint Accumulation',
    description: 'Target aggregate high-speed speed/sprint triggers to build workload repeat sprint capacity.',
    targetValue: 80,
    currentValue: 68,
    unit: 'sprints',
    category: 'Sprinting',
    status: 'On Track',
    assignedTo: 'Squad',
    deadline: '2026-05-31'
  },
  {
    id: 'g-203',
    title: 'ACWR Stabilization Program',
    description: 'Reduce cumulative chronic running loads to return Acute:Chronic Workload Ratio below high strain limits.',
    targetValue: 1.30,
    currentValue: 1.62,
    unit: 'ratio',
    category: 'Workload',
    status: 'At Risk',
    assignedTo: '2', // Lucas Sterling
    deadline: '2026-05-29'
  },
  {
    id: 'g-204',
    title: 'Max Speed Sprint Reps',
    description: 'Maintain high-velocity exposure above 8.0 m/s to preserve maximal linear sprinting capabilities.',
    targetValue: 20,
    currentValue: 14,
    unit: 'sprints',
    category: 'Sprinting',
    status: 'On Track',
    assignedTo: '1', // Marcus Vane
    deadline: '2026-05-31'
  },
  {
    id: 'g-205',
    title: 'Workload Balance',
    description: 'Keep workload index visible for coach review when single-week loading changes quickly.',
    targetValue: 80,
    currentValue: 95,
    unit: 'index',
    category: 'Workload',
    status: 'At Risk',
    assignedTo: '8', // Son Heung-min
    deadline: '2026-05-29'
  },
  {
    id: 'g-206',
    title: 'Daily session preparation Sync',
    description: 'Ensure 100% compliance in logging morning availability sheets (workload, load balance, and sessional readiness metrics).',
    targetValue: 7,
    currentValue: 5,
    unit: 'logs/week',
    category: 'availability',
    status: 'Behind',
    assignedTo: 'Squad',
    deadline: '2026-05-31'
  },
  {
    id: 'g-207',
    title: 'Restricted speed Recovery Cap',
    description: 'Cap high-intensity speeds to maintain active recovery and session recovery quality.',
    targetValue: 3,
    currentValue: 2,
    unit: 'sprints',
    category: 'Sprinting',
    status: 'On Track',
    assignedTo: '4', // Christian Benteke
    deadline: '2026-05-28'
  }
];

